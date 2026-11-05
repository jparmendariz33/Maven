#!/usr/bin/env python3
"""Guion para leer en voz alta (largos y shorts): una escena por párrafo, capítulos como títulos y
sin pausas especiales: todo se lee tal cual. Uso: python3 scripts/guion_lectura.py <carpeta>  → imprime Markdown."""
import sys, os, json
def main(d):
    sb = json.load(open(os.path.join(d, 'storyboard.json'), encoding='utf-8')); out = []
    for s in sb['scenes']:
        if s['type'] == 'chapter': out.append(f"\n### Capítulo {s.get('number', '')}: {s.get('chapter_name') or s.get('title', '')}\n")
        if s.get('say'): out.append(s['say'].strip() + '\n')
    print('\n'.join(out))
if __name__ == '__main__': main(sys.argv[1])
