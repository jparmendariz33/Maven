#!/usr/bin/env python3
"""Guion para leer en voz alta (largos y shorts): una escena por párrafo, capítulos como títulos y
las pausas de "Tu turno" marcadas. Uso: python3 scripts/guion_lectura.py <carpeta>  → imprime Markdown."""
import sys, os, json
def main(d):
    sb = json.load(open(os.path.join(d, 'storyboard.json'), encoding='utf-8')); out = []
    for s in sb['scenes']:
        if s['type'] == 'chapter': out.append(f"\n### Capítulo {s.get('number', '')}: {s.get('chapter_name') or s.get('title', '')}\n")
        if s.get('adlib'): out.append(f"> 🎙️ **TU TURNO ({s.get('adlib_secs', 15)} s, con tus palabras):** {s['adlib']}\n"); continue
        if s.get('say'): out.append(s['say'].strip() + '\n')
    print('\n'.join(out))
if __name__ == '__main__': main(sys.argv[1])
