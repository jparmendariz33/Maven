#!/usr/bin/env python3
"""Ritmo de una historia 3D CON VOZ DE IA: sincroniza escenas y subtítulos con la voz real.

Uso:  .venv/bin/python scripts/voz3d.py videos/<id> [--aire SEGUNDOS]
Es el gemelo de pace3d.py, pero en vez de estimar por sílabas usa los tiempos reales de
build/whisper.json (la voz ya generada). Así ninguna escena ni subtítulo queda desfasado.

Lee  : story.js (los `cap:`) · build/whisper.json (palabras con tiempo)
Salida: narration.txt · build/timing.js (escenas + subtítulos) · build/timeline.json (para make_audio.py)
Las palabras del cap se alinean contra la transcripción con difflib, así que tolera que whisper
escuche "Amostversky" por "Amos Tversky": lo que no casa se interpola entre las anclas vecinas.
Cada escena abre un poco antes de su primera palabra y cierra después de la última, repartiendo
el silencio real que la voz dejó entre párrafos (máx. LEAD / TAIL).

`--aire S` inserta S segundos de silencio ENTRE escenas (nunca dentro de una frase) reescribiendo
audio/voice.wav y corriendo los tiempos de whisper.json. Sirve cuando la voz de IA lee rápido y la
animación no alcanza a aterrizar: la historia de Kahneman pasó de 162 a ~139 palabras/min con 0.7 s.
Ojo: solo se aplica una vez; si hay que repetirlo, vuelve a correr process_voice.py antes.
"""
import sys, os, re, json, unicodedata
from difflib import SequenceMatcher

LEAD, TAIL, TAIL_END = .55, 1.0, 2.2      # aire máximo antes/después de cada escena
GAP_IN = .45                              # fracción del silencio real que se da a la escena que entra


def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if unicodedata.category(c) != 'Mn' and (c.isalnum()))


def aire(vdir, W, caps, seg):
    """Mete `seg` segundos de silencio en el hueco entre escenas y corre los tiempos."""
    import wave as wv, numpy as np
    wd = W['words']; n = [len(c.split()) for c in caps]
    cuts, k = [], 0
    for c in n[:-1]:
        k += c
        cuts.append(min(max(k - 1, 0), len(wd) - 2))                        # última palabra de cada escena
    wf = wv.open(os.path.join(vdir, 'audio', 'voice.wav'), 'rb')
    ch, sw, sr, nf = wf.getnchannels(), wf.getsampwidth(), wf.getframerate(), wf.getnframes()
    a = np.frombuffer(wf.readframes(nf), dtype=np.int16).reshape(-1, ch); wf.close()
    pad = np.zeros((int(seg * sr), ch), dtype=np.int16)
    out, prev, shift = [], 0, 0.0
    for i in cuts:
        mid = (wd[i][1] + wd[i + 1][0]) / 2 + shift                         # punto medio del silencio real
        j = min(max(int(mid * sr), prev), len(a))
        out += [a[prev:j], pad]; prev = j
        for w in wd[i + 1:]: w[0] += seg; w[1] += seg
        shift += seg
    out.append(a[prev:])
    b = np.concatenate(out)
    o = wv.open(os.path.join(vdir, 'audio', 'voice.wav'), 'wb')
    o.setnchannels(ch); o.setsampwidth(sw); o.setframerate(sr); o.writeframes(b.tobytes()); o.close()
    W['duration'] = len(b) / sr
    json.dump(W, open(os.path.join(vdir, 'build', 'whisper.json'), 'w'), ensure_ascii=False)
    print(f'aire: +{seg}s en {len(cuts)} cortes → voz {W["duration"]:.1f}s')
    return W


def main(vdir, extra=0.0):
    src = open(os.path.join(vdir, 'story.js'), encoding='utf-8').read()
    caps = [c.replace("\\'", "'") for c in re.findall(r"\bcap:\s*'((?:[^'\\]|\\.)*)'", src)]
    if not caps: sys.exit('❌ story.js no tiene escenas con cap:')
    W = json.load(open(os.path.join(vdir, 'build', 'whisper.json'), encoding='utf-8'))
    if extra: W = aire(vdir, W, caps, extra)
    wd, VDUR = W['words'], W['duration']

    cw = [(si, w) for si, c in enumerate(caps) for w in c.split()]          # palabra del guion → escena
    a, b = [norm(w) for _, w in cw], [norm(x[2]) for x in wd]
    t0s, t1s = [None] * len(cw), [None] * len(cw)
    for i, j, n in SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(n): t0s[i + k], t1s[i + k] = wd[j + k][0], wd[j + k][1]
    miss = sum(1 for x in t0s if x is None)

    # lo que no ancló se reparte entre las anclas vecinas
    for i in range(len(cw)):
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

    idx = [[i for i, (s, _) in enumerate(cw) if s == si] for si in range(len(caps))]
    scenes, groups = [], []
    for si, ii in enumerate(idx):
        first, last = t0s[ii[0]], t1s[ii[-1]]
        prev_end = t1s[idx[si - 1][-1]] if si else 0.0
        next_start = t0s[idx[si + 1][0]] if si < len(idx) - 1 else VDUR
        s0 = 0.0 if si == 0 else max(prev_end, first - min(LEAD, (first - prev_end) * GAP_IN + .05))
        s1 = (VDUR + TAIL_END) if si == len(idx) - 1 else min(next_start, last + min(TAIL, (next_start - last) * (1 - GAP_IN)))
        scenes.append([round(s0, 3), round(s1, 3)])
        cur = []
        for n, i in enumerate(ii):                                          # subtítulos: máx. 4 palabras, cortados en la puntuación
            w = cw[i][1]; cur.append([round(t0s[i], 3), round(t1s[i], 3), w])
            brk = bool(re.search(r'[.,;:?!…]["”»)]*$', w))
            if len(cur) >= 4 or brk or n == len(ii) - 1: groups.append(cur); cur = []

    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True)
    DUR = scenes[-1][1]
    open(os.path.join(vdir, 'narration.txt'), 'w', encoding='utf-8').write('\n\n'.join(caps) + '\n')
    open(os.path.join(vdir, 'build', 'timing.js'), 'w', encoding='utf-8').write(
        'export default ' + json.dumps({'scenes': scenes, 'caps': groups}, ensure_ascii=False) + ';\n')
    json.dump({'duration': round(DUR, 2), 'offset': 0, 'format': 'story',
               'scenes': [{'type': 'story', 't0': x, 't1': y} for x, y in scenes]},
              open(os.path.join(vdir, 'build', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    nw = len(cw)
    print(f'{len(caps)} escenas · {nw} palabras · voz {VDUR:.1f}s · video {DUR:.1f}s · {nw/(VDUR/60):.0f} palabras/min')
    print(f'alineación: {nw - miss}/{nw} palabras ancladas en la transcripción' + ('' if not miss else f' ({miss} interpoladas)'))
    for i, (x, y) in enumerate(scenes): print(f'  {x:6.2f}–{y:6.2f}  ({y-x:4.1f} s)  {caps[i][:66]}')
    if DUR > 95: print('⚠️  Pasa de 95 s.')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    av = sys.argv[1:]
    ex = float(av[av.index('--aire') + 1]) if '--aire' in av else 0.0
    main(av[0], ex)
