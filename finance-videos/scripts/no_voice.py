#!/usr/bin/env python3
"""Modo SIN VOZ: tiempos por palabra estimados a ritmo de lectura humana (tú grabas la voz después en YouTube).

Uso:  python3 scripts/no_voice.py videos/<id> [caracteres_por_segundo=14]
Salida: build/whisper.json (mismo formato que process_voice.py) y audio/NO_VOICE (marca).
Luego: build_timeline.py → render.js --qa → make_audio.py → render.js, igual que con voz.
Los subtítulos funcionan como teleprompter: léelos en voz alta al grabar.
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from common import load, tokens

SCENE_PAUSE = 0.5   # respiro entre escenas
PUNCT_PAUSE = {'.': .35, '?': .35, '!': .35, ',': .15, ':': .2, ';': .2, '…': .3}


def main(vdir, cps=14.0):
    sb = load(os.path.join(vdir, 'storyboard.json'))
    t, words = 0.0, []
    for si, s in enumerate(sb['scenes']):
        if si: t += SCENE_PAUSE
        for w in tokens(s.get('say', '')):
            d = max(.18, (len(w) + 1) / cps)
            words.append([round(t, 3), round(t + d, 3), w]); t += d
            if w.endswith('...'): t += .3
            elif w[-1] in PUNCT_PAUSE: t += PUNCT_PAUSE[w[-1]]
    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True); os.makedirs(os.path.join(vdir, 'audio'), exist_ok=True)
    json.dump({'words': words, 'source': 'estimado (sin voz)'}, open(os.path.join(vdir, 'build', 'whisper.json'), 'w'), ensure_ascii=False)
    open(os.path.join(vdir, 'audio', 'NO_VOICE'), 'w').write(f'{cps}\n')
    print(f'tiempos estimados: {len(words)} palabras, narración de {t:.1f}s a {cps} caracteres/s')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1], float(sys.argv[2]) if len(sys.argv) > 2 else 14.0)
