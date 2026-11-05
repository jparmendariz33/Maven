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
    if sb.get('format') == 'long':
        words = len(txt.split())
        est = words / 140 * 60 + len(sb['scenes']) * .5
        print(txt); print('\n' + '-' * 60)
        print(f'VIDEO LARGO · Escenas: {len(sb["scenes"])} | Palabras: {words} | Duración estimada: {est / 60:.1f} min (a ~140 palabras/min)')
        ok = 1250 <= words <= 1700
        if words < 1250: print('⚠️  Menos de 1,250 palabras: quedaría de menos de 9 min.')
        if words > 1700: print('⚠️  Más de 1,700 palabras: quedaría de más de 12 min.')
        if sum(1 for s in sb['scenes'] if s['type'] == 'chapter') < 3: print('⚠️  Usa al menos 3 escenas `chapter`.'); ok = False
        for i, s in enumerate(sb['scenes']):
            if s.get('adlib'): print(f'⚠️  Escena {i}: "adlib" ya no se usa; escribe el texto en "say".'); ok = False
            if not s.get('say'): print(f'⚠️  La escena {i} ({s["type"]}) no tiene narración.'); ok = False
            elif s.get('say') and len(s['say'].split()) > 45: print(f'⚠️  Escena {i} ({s["type"]}): {len(s["say"].split())} palabras; divídela (máx. ~45, una idea por pantalla).'); ok = False
        print('✅ Guion largo listo.' if ok else '❌ Ajusta el guion.'); sys.exit(0 if ok else 1)
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
