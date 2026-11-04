"""Utilidades compartidas: narración, normalización de palabras."""
import json, re, unicodedata, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load(p):
    return json.load(open(p, encoding='utf-8'))


def brand():
    return load(os.path.join(ROOT, 'assets', 'brand', 'brand.json'))


def narration(sb):
    """Texto completo para la voz: los `say` de cada escena separados por párrafo."""
    return '\n\n'.join(s['say'].strip() for s in sb['scenes'] if s.get('say', '').strip())


def norm(w):
    w = unicodedata.normalize('NFKD', w.lower())
    w = ''.join(c for c in w if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9]', '', w)


def tokens(text):
    return [t for t in re.split(r'\s+', text.strip()) if t]
