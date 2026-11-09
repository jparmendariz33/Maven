#!/usr/bin/env python3
"""Sincroniza una historia 3D (engine3d) con la voz real y le da aire al ritmo.

Uso:  .venv/bin/python scripts/build_timing3d.py videos/<id>
      (antes: .venv/bin/python scripts/process_voice.py videos/<id> --historia)

Entrada: narration.txt (un párrafo por escena, en el mismo orden que story.js),
         audio/voice.wav + build/whisper.json (de process_voice.py), story.js (los `cap:` con dígitos).
Hace:    inserta silencio para que haya PAUSA_FRASE s después de cada . ? ! : … y PAUSA_ESCENA s entre escenas
         → audio/voice_story.wav (voice.wav no se toca: el script se puede correr las veces que sea).
Salida:  build/timing.js     → tiempos de escena + subtítulos (cada frase amarrada a su frase en la voz) para player.js
         build/timeline.json → lo que necesita make_audio.py (usa voice_story.wav).
"""
import sys, os, re, json
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from common import load, tokens
from build_timeline import align, OFFSET
from process_voice import read_wav, write_wav, SR

PAUSA_FRASE, PAUSA_ESCENA = .7, 1.1
TAIL = 1.8            # segundos después de la última palabra (cierre)
END = re.compile(r'[.:?!…]$')


def sentences(words):
    out, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        if END.search(w) or i == len(words) - 1: out.append(cur); cur = []
    return out


def main(vdir):
    paras = [p.replace('\n', ' ').strip() for p in open(os.path.join(vdir, 'narration.txt')).read().strip().split('\n\n')]
    caps = re.findall(r"cap:\s*'((?:[^'\\]|\\.)*)'", open(os.path.join(vdir, 'story.js')).read())
    if len(caps) != len(paras): sys.exit(f'❌ story.js tiene {len(caps)} escenas y narration.txt {len(paras)} párrafos: deben coincidir.')
    wh = load(os.path.join(vdir, 'build', 'whisper.json'))
    toks, owner = [], []
    for si, p in enumerate(paras):
        for t in tokens(p): toks.append(t); owner.append(si)
    times, ratio = align(toks, wh['words'])
    print(f'alineación: {ratio:.0%} de las palabras del guion coinciden con la voz')

    # ---- pausas: silencio extra a la mitad del hueco entre frases
    x = read_wav(os.path.join(vdir, 'audio', 'voice.wav'))
    cuts = []
    for k in range(len(toks) - 1):
        if not END.search(toks[k]) and owner[k + 1] == owner[k]: continue
        target = PAUSA_ESCENA if owner[k + 1] != owner[k] else PAUSA_FRASE
        gap = times[k + 1][0] - times[k][1]
        if target > gap: cuts.append(((times[k][1] + times[k + 1][0]) / 2, target - gap))
    parts, pos, shift, shifts = [], 0, 0.0, []
    for c, extra in cuts:
        i = int(c * SR); parts += [x[pos:i], np.zeros(int(extra * SR), dtype=x.dtype)]; pos = i; shift += extra; shifts.append((c, shift))
    parts.append(x[pos:]); write_wav(os.path.join(vdir, 'audio', 'voice_story.wav'), np.concatenate(parts))
    def sh(t): return t + max([s for c, s in shifts if c <= t] or [0.0])
    times = [[sh(a) + OFFSET, sh(b) + OFFSET] for a, b in times]
    print(f'pausas agregadas: {len(cuts)} (+{shift:.1f}s)')

    first, last = {}, {}
    for k, si in enumerate(owner): first.setdefault(si, k); last[si] = k
    voice_end = times[-1][1]; duration = round(voice_end + TAIL, 2)
    t0s = [0.0] + [round(times[first[si]][0] - .5, 3) for si in range(1, len(paras))]
    scenes = [[t0s[i], t0s[i + 1] if i + 1 < len(paras) else duration] for i in range(len(paras))]

    # ---- subtítulos: frase de pantalla (con dígitos) ↔ frase de la voz
    groups = []
    for si, cap in enumerate(caps):
        words = cap.split(); idx = [k for k in range(len(toks)) if owner[k] == si]
        cs, vs = sentences(words), sentences([toks[k] for k in idx])
        spans = [(times[idx[v[0]]][0], times[idx[v[-1]]][1]) for v in vs] if len(cs) == len(vs) else None
        if spans is None:
            print(f'⚠️  escena {si + 1}: las frases del subtítulo no coinciden con la voz; se reparte proporcional')
            cs, spans = [list(range(len(words)))], [(times[idx[0]][0], times[idx[-1]][1])]
        for sent, (a, b) in zip(cs, spans):
            ws = [words[i] for i in sent]; wts = [len(w) + 2 for w in ws]; tot = sum(wts); t = a; cur = []
            for i, w in enumerate(ws):
                d = (b - a) * wts[i] / tot; cur.append([round(t, 3), round(t + d * .9, 3), w]); t += d
                if len(cur) >= 4 or w.endswith(',') or i == len(ws) - 1: groups.append(cur); cur = []

    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True)
    open(os.path.join(vdir, 'build', 'timing.js'), 'w').write('export default ' + json.dumps({'scenes': scenes, 'caps': groups}, ensure_ascii=False) + ';\n')
    tl = {'duration': duration, 'offset': OFFSET, 'voice': 'voice_story.wav',
          'scenes': [{'type': 'story', 't0': a, 't1': b, 'cue': round(a + .35, 3)} for a, b in scenes]}
    json.dump(tl, open(os.path.join(vdir, 'build', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'duración: {duration:.1f}s (voz hasta {voice_end:.1f}s)')
    for i, (a, b) in enumerate(scenes): print(f'  {a:6.2f}–{b:6.2f}  escena {i + 1}')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
