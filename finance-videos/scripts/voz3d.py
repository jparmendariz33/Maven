#!/usr/bin/env python3
"""Ritmo de una historia 3D CON VOZ DE IA: sincroniza escenas y subtítulos con la voz real.

Uso:  .venv/bin/python scripts/voz3d.py videos/<id> [--aire SEGUNDOS]
Es el gemelo de pace3d.py, pero en vez de estimar por sílabas usa los tiempos reales de
build/whisper.json (la voz ya generada). Así ninguna escena ni subtítulo queda desfasado.

Lee  : story.js (los `cap:`) · build/whisper.json (palabras con tiempo) · audio/voice.wav
Salida: narration.txt · build/timing.js (escenas + subtítulos) · build/timeline.json (para make_audio.py)

Las palabras del guion se alinean contra la transcripción con difflib, así que tolera que whisper
escuche "Amostversky" por "Amos Tversky" o escriba "1979" donde el guion dice el año en palabras:
lo que no casa se interpola entre las anclas vecinas.

`--aire S` inserta S segundos de silencio ENTRE escenas (nunca dentro de una frase) reescribiendo
audio/voice.wav. Sirve cuando la voz de IA lee rápido y la animación no alcanza a aterrizar.
Tres cosas que costaron sangre y por eso están así:
  1. Los límites entre escenas salen de la ALINEACIÓN, no de contar palabras por escena. Whisper
     no parte las palabras igual que el guion, y contar desplazaba los cortes a media frase.
  2. El corte se pega al punto más callado de la onda cerca del límite, porque los tiempos de
     whisper son aproximados y la cola de la última palabra suele seguir sonando.
  3. Si no hay ningún punto callado cerca, ese corte SE SALTA. Mejor una escena sin aire que una
     palabra partida. Al final se verifica que toda palabra tenga audio donde dice tenerlo.
Ojo: `--aire` se aplica una sola vez sobre voice.wav; para repetirlo, corre antes process_voice.py.
"""
import sys, os, re, json, unicodedata
from difflib import SequenceMatcher

LEAD, TAIL, TAIL_END = .55, 1.0, 2.2      # aire máximo antes/después de cada escena
GAP_IN = .45                              # fracción del silencio real que se da a la escena que entra


def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if unicodedata.category(c) != 'Mn' and c.isalnum())


def alinea(caps, wd, VDUR):
    """Devuelve (t0s, t1s) por palabra del guion, y cuántas no ancló."""
    cw = [w for c in caps for w in c.split()]
    a, b = [norm(w) for w in cw], [norm(x[2]) for x in wd]
    t0s, t1s = [None] * len(cw), [None] * len(cw)
    for i, j, n in SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(n): t0s[i + k], t1s[i + k] = wd[j + k][0], wd[j + k][1]
    anclada = [x is not None for x in t0s]
    miss = sum(1 for x in t0s if x is None)
    for i in range(len(cw)):                                                # lo que no ancló se interpola
        if t0s[i] is not None: continue
        p = next((k for k in range(i - 1, -1, -1) if t1s[k] is not None), None)
        n = next((k for k in range(i + 1, len(cw)) if t0s[k] is not None), None)
        lo = t1s[p] if p is not None else 0.0
        hi = t0s[n] if n is not None else VDUR
        m = (n if n is not None else len(cw)) - (p if p is not None else -1)
        q = i - (p if p is not None else -1)
        t0s[i] = lo + (hi - lo) * (q - 1) / m; t1s[i] = lo + (hi - lo) * q / m
    for i in range(1, len(cw)):                                             # monotonía
        t0s[i] = max(t0s[i], t1s[i - 1]); t1s[i] = max(t1s[i], t0s[i] + .08)
    return cw, t0s, t1s, miss, anclada


def aire(vdir, idx, t0s, t1s, seg, cw, anclada):
    """Mete `seg` s de silencio en los límites entre escenas y corre los tiempos. Devuelve la duración."""
    import wave as wv, numpy as np
    wf = wv.open(os.path.join(vdir, 'audio', 'voice.wav'), 'rb')
    ch, sw, sr, nf = wf.getnchannels(), wf.getsampwidth(), wf.getframerate(), wf.getnframes()
    a = np.frombuffer(wf.readframes(nf), dtype=np.int16).reshape(-1, ch); wf.close()
    pad = np.zeros((int(seg * sr), ch), dtype=np.int16)
    m1 = np.abs(a.astype(np.float32).mean(1)); win = max(1, int(.02 * sr)); busca = int(.45 * sr)
    umbral = m1.mean() * .18                      # por debajo de esto la onda está de verdad callada

    limites = [(si, (t1s[idx[si][-1]] + t0s[idx[si + 1][0]]) / 2) for si in range(len(idx) - 1)]
    out, prev, hechos = [], 0, []
    for si, mid in limites:
        lo, hi = max(prev, int(mid * sr) - busca), min(len(a) - win, int(mid * sr) + busca)
        if hi <= lo: continue
        e = np.add.reduceat(m1[lo:hi + win], np.arange(0, hi - lo, win)) / win
        k = int(np.argmin(e))
        if e[k] > umbral: continue                # no hay silencio cerca: no se mete aire aquí
        j = min(max(lo + k * win, prev), len(a))
        out += [a[prev:j], pad]; prev = j; hechos.append(si)
    out.append(a[prev:])
    b = np.concatenate(out)
    o = wv.open(os.path.join(vdir, 'audio', 'voice.wav'), 'wb')
    o.setnchannels(ch); o.setsampwidth(sw); o.setframerate(sr); o.writeframes(b.tobytes()); o.close()

    for si in hechos:                             # corre todo lo que va detrás de cada pad insertado
        for i in range(idx[si + 1][0], len(t0s)): t0s[i] += seg; t1s[i] += seg
    DUR = len(b) / sr
    rms = lambda x: float(np.sqrt((x.astype(float) ** 2).mean())) if len(x) else 0.0
    mono = b.mean(1)
    # solo las palabras ANCLADAS tienen un tiempo real; las interpoladas son estimaciones y no se pueden verificar
    malas = [i for i in range(len(t0s)) if anclada[i] and rms(mono[int(t0s[i] * sr):int(t1s[i] * sr)]) < 120]
    if malas:
        det = ', '.join(f'#{i} "{cw[i]}" en {t0s[i]:.2f}s' for i in malas[:4])
        sys.exit(f'❌ {len(malas)} palabra(s) quedaron sin audio en su lugar ({det}): el aire cayó mal')
    falta = len(idx) - 1 - len(hechos)
    print(f'aire: +{seg}s en {len(hechos)} de {len(idx) - 1} cortes → voz {DUR:.1f}s · todas las palabras con audio'
          + (f' · {falta} corte(s) sin silencio donde meterlo' if falta else ''))
    return DUR


def main(vdir, extra=0.0):
    src = open(os.path.join(vdir, 'story.js'), encoding='utf-8').read()
    caps = [c.replace("\\'", "'") for c in re.findall(r"\bcap:\s*'((?:[^'\\]|\\.)*)'", src)]
    if not caps: sys.exit('❌ story.js no tiene escenas con cap:')
    W = json.load(open(os.path.join(vdir, 'build', 'whisper.json'), encoding='utf-8'))
    wd, VDUR = W['words'], W['duration']

    cw, t0s, t1s, miss, anclada = alinea(caps, wd, VDUR)
    n = [len(c.split()) for c in caps]
    idx, k = [], 0
    for c in n: idx.append(list(range(k, k + c))); k += c                    # palabras de cada escena

    if extra: VDUR = aire(vdir, idx, t0s, t1s, extra, cw, anclada)

    scenes, groups = [], []
    for si, ii in enumerate(idx):
        first, last = t0s[ii[0]], t1s[ii[-1]]
        prev_end = t1s[idx[si - 1][-1]] if si else 0.0
        next_start = t0s[idx[si + 1][0]] if si < len(idx) - 1 else VDUR
        s0 = 0.0 if si == 0 else max(prev_end, first - min(LEAD, (first - prev_end) * GAP_IN + .05))
        s1 = (VDUR + TAIL_END) if si == len(idx) - 1 else min(next_start, last + min(TAIL, (next_start - last) * (1 - GAP_IN)))
        scenes.append([round(s0, 3), round(s1, 3)])
        cur = []
        for m, i in enumerate(ii):                                           # subtítulos de máx. 4 palabras
            cur.append([round(t0s[i], 3), round(t1s[i], 3), cw[i]])
            brk = bool(re.search(r'[.,;:?!…]["”»)]*$', cw[i]))
            if len(cur) >= 4 or brk or m == len(ii) - 1: groups.append(cur); cur = []

    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True)
    DUR = scenes[-1][1]
    open(os.path.join(vdir, 'narration.txt'), 'w', encoding='utf-8').write('\n\n'.join(caps) + '\n')
    open(os.path.join(vdir, 'build', 'timing.js'), 'w', encoding='utf-8').write(
        'export default ' + json.dumps({'scenes': scenes, 'caps': groups}, ensure_ascii=False) + ';\n')
    json.dump({'duration': round(DUR, 2), 'offset': 0, 'format': 'story',
               'scenes': [{'type': 'story', 't0': x, 't1': y} for x, y in scenes]},
              open(os.path.join(vdir, 'build', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    nw = len(cw)
    print(f'{len(caps)} escenas · {nw} palabras · voz {VDUR:.1f}s · video {DUR:.1f}s · {nw / (VDUR / 60):.0f} palabras/min')
    print(f'alineación: {nw - miss}/{nw} palabras ancladas' + ('' if not miss else f' ({miss} interpoladas)'))
    for i, (x, y) in enumerate(scenes): print(f'  {x:6.2f}–{y:6.2f}  ({y - x:4.1f} s)  {caps[i][:62]}')
    if DUR > 95: print('⚠️  Pasa de 95 s.')


if __name__ == '__main__':
    av = sys.argv[1:]
    if not av: sys.exit(__doc__)
    main(av[0], float(av[av.index('--aire') + 1]) if '--aire' in av else 0.0)
