#!/usr/bin/env python3
"""Ritmo de lectura para una historia 3D SIN VOZ (JP graba su voz encima leyendo los subtítulos).

Uso:  python3 scripts/pace3d.py videos/<id> [sílabas_por_segundo]
Lee los `cap:` de story.js (uno por escena, con dígitos) y calcula cuánto dura cada palabra al ritmo de JP:
  - por SÍLABAS HABLADAS (los números, %, $ se convierten a palabras: misma regla que no_voice.py), 5.0 sílabas/s
  - pausas para respirar: coma 0.3 s · dos puntos 0.45 s · punto / ? / ! 0.75 s · "..." 0.8 s
  - 0.5 s de entrada en cada escena y 1.1 s de aire al final (la animación termina de contar la idea)
Salida: narration.txt (guion para leer, un párrafo por escena) · build/timing.js (escenas + subtítulos; lo usa engine3d/player.js)
        build/timeline.json (para make_audio.py) · audio/NO_VOICE
Las duraciones `d` de story.js quedan solo como respaldo: con timing.js mandan estos tiempos.
"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(__file__))
from no_voice import spoken, syllables

LEAD, TAIL_SCENE, TAIL_END = .5, 1.1, 2.2
PAUSE = [(re.compile(r'(\.\.\.|…)["”»)]*$'), .8), (re.compile(r'[.?!]["”»)]*$'), .75), (re.compile(r'[:;]$'), .45), (re.compile(r',$'), .3)]


def pause(w):
    for rx, d in PAUSE:
        if rx.search(w): return d
    return 0.0


def main(vdir, sps=5.0):
    src = open(os.path.join(vdir, 'story.js'), encoding='utf-8').read()
    caps = [c.replace("\\'", "'") for c in re.findall(r"\bcap:\s*'((?:[^'\\]|\\.)*)'", src)]
    if not caps: sys.exit('❌ story.js no tiene escenas con cap: \'...\'')
    t, scenes, groups, nwords = 0.0, [], [], 0
    for si, cap in enumerate(caps):
        t0 = t; t += LEAD; cur = []; words = cap.split()
        for i, w in enumerate(words):
            d = max(.24, syllables(spoken(w)) / sps); cur.append([round(t, 3), round(t + d, 3), w]); t += d; p = pause(w)
            last = i == len(words) - 1
            if not last: t += p
            if len(cur) >= 4 or p or last: groups.append(cur); cur = []      # subtítulos de máx. 4 palabras, cortados en las pausas
        t += TAIL_SCENE if si < len(caps) - 1 else TAIL_END
        scenes.append([round(t0, 3), round(t, 3)]); nwords += len(words)
    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True); os.makedirs(os.path.join(vdir, 'audio'), exist_ok=True)
    open(os.path.join(vdir, 'narration.txt'), 'w', encoding='utf-8').write('\n\n'.join(caps) + '\n')
    open(os.path.join(vdir, 'build', 'timing.js'), 'w', encoding='utf-8').write('export default ' + json.dumps({'scenes': scenes, 'caps': groups}, ensure_ascii=False) + ';\n')
    tl = {'duration': round(t, 2), 'offset': 0, 'format': 'story', 'scenes': [{'type': 'story', 't0': a, 't1': b} for a, b in scenes]}
    json.dump(tl, open(os.path.join(vdir, 'build', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    open(os.path.join(vdir, 'audio', 'NO_VOICE'), 'w').write(f'{sps}\n')
    print(f'{len(caps)} escenas · {nwords} palabras · {t:.1f} s → {nwords / (t / 60):.0f} palabras/min (con pausas)')
    for i, (a, b) in enumerate(scenes): print(f'  {a:6.2f}–{b:6.2f}  ({b - a:4.1f} s)  {caps[i][:70]}')
    if t > 95: print('⚠️  Pasa de 95 s: recorta el guion (ideal 70–90 s, 110–150 palabras).')
    if nwords < 90: print('⚠️  Menos de 90 palabras: la historia queda corta.')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 5.0)
