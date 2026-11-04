#!/usr/bin/env python3
"""Revisa el guion ANTES de gastar créditos de voz.

Uso:  python3 scripts/script_check.py videos/<id>
Imprime la narración completa, caracteres, duración estimada y costo en créditos,
y la guarda en videos/<id>/narration.txt (es el texto exacto que se manda a la voz).
"""
import sys, os, math
sys.path.insert(0, os.path.dirname(__file__))
from common import load, narration, brand

CHARS_PER_SEC = 14.0   # medido con la voz Daniel tras recortar pausas y tempo 1.04x


def main(vdir):
    sb = load(os.path.join(vdir, 'storyboard.json'))
    txt = narration(sb)
    open(os.path.join(vdir, 'narration.txt'), 'w').write(txt)
    n = len(txt); est = n / CHARS_PER_SEC + 0.45 + 2.0
    credits = math.ceil(n / 1000) * brand()['voice']['credits_per_1000_chars']
    print(txt); print('\n' + '-' * 60)
    print(f'Escenas: {len(sb["scenes"])} | Caracteres: {n} | Duración estimada del video: {est:.0f} s | Costo de voz: {credits} créditos')
    ok = True
    if n > 1000: print('⚠️  Pasa de 1,000 caracteres: costaría el doble. Recorta el guion.'); ok = False
    if est < 45: print('⚠️  Quedaría de menos de 45 s. Agrega un poco de contenido.'); ok = False
    if est > 60: print('⚠️  Quedaría de más de 60 s. Recorta el guion.'); ok = False
    for i, s in enumerate(sb['scenes']):
        if not s.get('say'): print(f'⚠️  La escena {i} ({s["type"]}) no tiene narración.'); ok = False
    print('✅ Guion listo para generar la voz.' if ok else '❌ Ajusta el guion antes de generar la voz.')
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
