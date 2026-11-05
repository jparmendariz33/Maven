#!/usr/bin/env python3
"""Modo SIN VOZ: tiempos por palabra estimados al ritmo de una persona leyendo en voz alta (JP graba encima).

Uso:  python3 scripts/no_voice.py videos/<id> [sílabas_por_segundo]   (no pases el 2º argumento: usa el ritmo por defecto)
Salida: build/whisper.json (mismo formato que process_voice.py) y audio/NO_VOICE (marca).

Cómo calcula el ritmo (para que nunca "corra" en partes con números):
- Cada palabra dura según las SÍLABAS QUE SE PRONUNCIAN, no las letras. Los números, %, $ y montos se convierten a palabras
  antes de contar ("1950" → "mil novecientos cincuenta" = 8 sílabas; "46%" → "cuarenta y seis por ciento").
- Velocidad por defecto: 5.2 sílabas/s al hablar (≈ 120 palabras por minuto con pausas, cómodo para leer en voz alta; la media del español es ~130 ppm;
  un locutor profesional va a 150–160). Pausas para respirar: coma 0.3 s, dos puntos/punto y coma 0.4 s, punto 0.6 s,
  "..." 0.7 s, entre pantallas 0.9 s (largos) / 0.6 s (shorts), y 1.2 s extra antes de cada capítulo.
"""
import sys, os, json, re, unicodedata
sys.path.insert(0, os.path.dirname(__file__))
from common import load, tokens

U = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince',
     'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco',
     'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve']
D = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
C = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos']


def num_words(n):
    """Entero → palabras en español (suficiente para estimar sílabas)."""
    n = int(n)
    if n == 0: return 'cero'
    if n < 30: return U[n]
    if n < 100: return D[n // 10] + ('' if n % 10 == 0 else ' y ' + U[n % 10])
    if n == 100: return 'cien'
    if n < 1000: return C[n // 100] + ('' if n % 100 == 0 else ' ' + num_words(n % 100))
    if n < 1_000_000:
        k, r = divmod(n, 1000); return ('mil' if k == 1 else num_words(k) + ' mil') + ('' if r == 0 else ' ' + num_words(r))
    if n < 1_000_000_000_000:
        m, r = divmod(n, 1_000_000); return ('un millón' if m == 1 else num_words(m) + ' millones') + ('' if r == 0 else ' ' + num_words(r))
    b, r = divmod(n, 1_000_000_000_000); return ('un billón' if b == 1 else num_words(b) + ' billones') + ('' if r == 0 else ' ' + num_words(r))


def spoken(tok):
    """Cómo se dice una palabra del guion (para contar sílabas)."""
    t = tok.strip('¿¡"“”«»()[]')
    out = []
    for part in re.findall(r'\$?[\d][\d,]*(?:\.\d+)?%?x?|[^\d$]+', t):
        m = re.fullmatch(r'(\$)?([\d][\d,]*)(?:\.(\d+))?(%)?(x)?', part)
        if m:
            cur, ent, dec, pct, ex = m.groups(); w = num_words(ent.replace(',', ''))
            if dec: w += ' punto ' + ' '.join(num_words(int(c)) for c in dec)
            if pct: w += ' por ciento'
            if ex: w += ' veces'
            if cur: w += ' dólares'
            out.append(w)
        else: out.append(part.replace('%', ' por ciento').replace('&', ' y ').replace('+', ' más ').replace('×', ' por '))
    return ' '.join(out)


def syllables(text):
    """Sílabas aproximadas en español: grupos de vocales (las tildes en í/ú rompen el diptongo)."""
    total = 0
    for w in re.findall(r'[a-záéíóúüñ]+', text.lower()):
        groups = re.findall(r'[aeiouáéíóúü]+', w.replace('y', 'i') if w.endswith('y') else w)
        n = 0
        for g in groups:
            n += 1 + sum(1 for i, ch in enumerate(g) if i and (ch in 'áéíóú' and g[i - 1] in 'aeoáéó' or ch in 'aeoáéó' and g[i - 1] in 'aeoáéó' or ch in 'íú' or g[i - 1] in 'íú'))
        total += max(1, n)
    return total


def main(vdir, sps=None):
    sb = load(os.path.join(vdir, 'storyboard.json'))
    LONG = sb.get('format') == 'long'
    sps = float(sps) if sps else 5.2
    SCENE = .9 if LONG else .6
    t, words = 0.0, []
    for si, s in enumerate(sb['scenes']):
        if si: t += SCENE + (1.2 if s.get('type') == 'chapter' else 0)
        for w in tokens(s.get('say', '')):
            d = max(.22, syllables(spoken(w)) / sps)
            words.append([round(t, 3), round(t + d, 3), w]); t += d
            if w.endswith('...') or w.endswith('…'): t += .7
            elif w[-1] in '.?!': t += .6
            elif w[-1] in ':;': t += .4
            elif w[-1] == ',': t += .3
    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True); os.makedirs(os.path.join(vdir, 'audio'), exist_ok=True)
    json.dump({'words': words, 'source': f'estimado (sin voz, {sps} sílabas/s)'}, open(os.path.join(vdir, 'build', 'whisper.json'), 'w'), ensure_ascii=False)
    open(os.path.join(vdir, 'audio', 'NO_VOICE'), 'w').write(f'{sps}\n')
    wpm = len(words) / (t / 60)
    print(f'tiempos estimados: {len(words)} palabras en {t / 60:.1f} min → {wpm:.0f} palabras/min ({sps} sílabas/s al hablar)')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
