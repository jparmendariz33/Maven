#!/usr/bin/env python3
"""Prepara el guion para una VOZ DE IA (vidIQ / ElevenLabs) y lo corta en piezas al menor costo posible.

Uso:  python3 scripts/tts_prep.py <carpeta> [créditos_disponibles]
Salida: <carpeta>/tts_chunks.json  (piezas listas para vidiq_voiceover_generate, en orden)

Qué hace:
1. NÚMEROS A PALABRAS (regla del proyecto): la voz puede leer "10,000" como "diez coma cero" y los números tardan mucho
   más en decirse de lo que miden en caracteres. Se escriben como se pronuncian con `no_voice.spoken`
   ("1950" → "mil novecientos cincuenta", "46%" → "cuarenta y seis por ciento", "$7,600" → "siete mil seiscientos dólares").
   Arregla concordancias comunes ("uno millón" → "un millón", "quinientos empresas" → "quinientas empresas").
2. SIGLAS Y NOMBRES como se dicen: S&P 500 → "es and pi quinientos", CNBV → nombre completo, Nasdaq → "Násdak",
   "by JP" → "de Jota Pe". Agrega aquí las que falten (diccionario PRON).
3. COSTO: vidIQ cobra 14 créditos por cada 1,000 caracteres de CADA envío, redondeando hacia arriba (máx. 5,000 por envío).
   Busca el corte entre escenas que use menos bloques y, a igual costo, más piezas (rehacer una pieza sale más barato).
Nunca pongas en boca de la voz de IA "soy JP": usa una presentación de marca ("Bienvenido a Costa Studio Finance…").
"""
import sys, os, json, re, math
sys.path.insert(0, os.path.dirname(__file__))
from no_voice import spoken

PRON = {'S&P 500': 'es and pi quinientos', 'S&P': 'es and pi', 'CNBV': 'Comisión Nacional Bancaria y de Valores', 'Nasdaq': 'Násdak',
        'by JP Armendáriz': 'de Jota Pe Armendáriz', 'JP Armendáriz': 'Jota Pe Armendáriz', 'BMV': 'be eme uve', 'SAT': 'sat', 'IPC': 'i pe ce', 'ETF': 'i ti ef', 'ETFs': 'i ti efs'}
FIX = [('uno millón', 'un millón'), ('uno mil', 'un mil'), ('veintiuno millones', 'veintiún millones'),
       ('quinientos empresas', 'quinientas empresas'), ('doscientos empresas', 'doscientas empresas'), ('trescientos empresas', 'trescientas empresas')]


def tts_text(t):
    for k in sorted(PRON, key=len, reverse=True): t = t.replace(k, PRON[k])
    out = []
    for w in t.split(' '):
        if re.search(r'\d', w):
            m = re.match(r'^([¿¡("“]*)(.*?)([.,:;?!)"”]*)$', w); out.append(m.group(1) + spoken(m.group(2)) + m.group(3))
        else: out.append(w)
    t = ' '.join(out)
    for a, b in FIX: t = t.replace(a, b)
    return re.sub(r'\s+', ' ', t).strip()


def main(d, credits=None):
    sb = json.load(open(os.path.join(d, 'storyboard.json'), encoding='utf-8'))
    T = [tts_text(s['say']) for s in sb['scenes'] if s.get('say')]
    L = [len(x) for x in T]; n = len(T)
    clen = lambda a, b: sum(L[a:b]) + 2 * (b - a - 1)
    best = [(math.inf, 0, None)] * (n + 1); best[0] = (0, 0, None)
    for b in range(1, n + 1):
        for a in range(b):
            c = clen(a, b)
            if c > 5000: continue
            cand = (best[a][0] + math.ceil(c / 1000), best[a][1] - 1, a)
            if cand[:2] < best[b][:2]: best[b] = cand
    cuts, b = [], n
    while b > 0: a = best[b][2]; cuts.append((a, b)); b = a
    chunks = [{'n': k + 1, 'chars': len('\n\n'.join(T[a:b])), 'text': '\n\n'.join(T[a:b])} for k, (a, b) in enumerate(reversed(cuts))]
    units = sum(math.ceil(c['chars'] / 1000) for c in chunks)
    json.dump(chunks, open(os.path.join(d, 'tts_chunks.json'), 'w'), ensure_ascii=False, indent=1)
    total = sum(L) + 2 * (n - 1)
    print(f'{total} caracteres para la voz · {len(chunks)} piezas · {units} bloques = {units * 14} créditos')
    for c in chunks: print(f"  pieza {c['n']}: {c['chars']} caracteres ({math.ceil(c['chars'] / 1000) * 14} créditos)")
    if credits is not None and units * 14 > int(credits):
        falta = total - (int(credits) // 14) * 1000
        print(f'⚠️  No alcanzan {credits} créditos: recorta al menos ~{falta} caracteres (o espera la renovación).')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
