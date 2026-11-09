#!/usr/bin/env python3
"""Sincroniza una historia 3D (engine3d) con la voz real.

Uso:  .venv/bin/python scripts/build_timing3d.py videos/<id>

Entrada: narration.txt (un párrafo por escena, en el mismo orden que story.js),
         build/whisper.json (de process_voice.py), story.js (para leer los `cap:` con dígitos).
Salida:  build/timing.js     → tiempos de escena + subtítulos que usa engine3d/player.js
         build/timeline.json → lo que necesita make_audio.py para mezclar voz, música y efectos.
"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(__file__))
from common import load, tokens
from build_timeline import align, OFFSET

TAIL = 1.8   # segundos después de la última palabra (cierre)


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
    times = [[a + OFFSET, b + OFFSET] for a, b in times]
    first, last = {}, {}
    for k, si in enumerate(owner): first.setdefault(si, k); last[si] = k
    voice_end = times[-1][1]; duration = round(voice_end + TAIL, 2)
    t0s = [0.0] + [round(times[first[si]][0] - .3, 3) for si in range(1, len(paras))]
    scenes = [[t0s[i], t0s[i + 1] if i + 1 < len(paras) else duration] for i in range(len(paras))]
    # subtítulos con el texto "bonito" (dígitos) repartido en el tiempo real de cada escena
    groups = []
    for si, cap in enumerate(caps):
        words = cap.split(); a, b = times[first[si]][0], times[last[si]][1]
        wts = [len(w) + 2 for w in words]; tot = sum(wts); t = a; cur = []
        for i, w in enumerate(words):
            d = (b - a) * wts[i] / tot; cur.append([round(t, 3), round(t + d * .9, 3), w]); t += d
            if len(cur) >= 4 or re.search(r'[.,:;?!…]$', w) or i == len(words) - 1: groups.append(cur); cur = []
    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True)
    open(os.path.join(vdir, 'build', 'timing.js'), 'w').write('export default ' + json.dumps({'scenes': scenes, 'caps': groups}, ensure_ascii=False) + ';\n')
    tl = {'duration': duration, 'offset': OFFSET, 'scenes': [{'type': 'story', 't0': a, 't1': b, 'cue': round(a + .35, 3)} for a, b in scenes]}
    json.dump(tl, open(os.path.join(vdir, 'build', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'duración: {duration:.1f}s (voz hasta {voice_end:.1f}s)')
    for i, (a, b) in enumerate(scenes): print(f'  {a:6.2f}–{b:6.2f}  escena {i + 1}')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
