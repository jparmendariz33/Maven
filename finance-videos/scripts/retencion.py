#!/usr/bin/env python3
"""Analiza la retención del canal a partir de una tabla pegada de YouTube Studio.

Uso:  python3 scripts/retencion.py plan/datos/<AAAA-MM-DD>.md

El archivo es una tabla de pipes con estas columnas, en este orden (el encabezado y las líneas
que no empiezan con "|" se ignoran, así que puedes pegar texto alrededor):

| video | formato | duración del video | vistas | % reproducido | duración media |

- "duración del video" y "duración media" aceptan `0:45`, `1:38` o segundos sueltos (`45`).
- Si no sabes la duración del video, pon `?`: se deduce de duración media ÷ %.
- "formato": short | historia | largo | vivo   (historia = las 3D; cuenta como short para YouTube)

Responde las tres preguntas que importan:
 1. ¿Los segundos vistos dependen de la duración?  (si no: alargar solo diluye el %)
 2. ¿Qué formato retiene mejor, a igualdad de duración?
 3. ¿Cuántas horas que SÍ cuentan para monetizar llevamos?  (Shorts no suman)
"""
import sys, os, re, statistics as st


def secs(x):
    x = x.strip()
    if x in ('?', '', '-'): return None
    if ':' in x:
        p = [int(n) for n in x.split(':')]
        return p[0] * 60 + p[1] if len(p) == 2 else p[0] * 3600 + p[1] * 60 + p[2]
    return float(re.sub(r'[^\d.]', '', x) or 0)


def corr(a, b):
    if len(a) < 3: return None
    ma, mb = st.mean(a), st.mean(b)
    va = sum((x - ma) ** 2 for x in a); vb = sum((y - mb) ** 2 for y in b)
    if va == 0 or vb == 0: return None
    return sum((x - ma) * (y - mb) for x, y in zip(a, b)) / (va * vb) ** .5


def leer(path):
    vids = []
    for ln in open(path, encoding='utf-8'):
        ln = ln.strip()
        if not ln.startswith('|'): continue
        c = [x.strip() for x in ln.strip('|').split('|')]
        if len(c) < 6 or not c[3].replace(',', '').replace('.', '').isdigit(): continue   # salta encabezado y separadores
        nombre, fmt = c[0].strip('*[] '), c[1].lower()
        dur, vistas, pct, media = secs(c[2]), int(c[3].replace(',', '')), float(re.sub(r'[^\d.]', '', c[4])), secs(c[5])
        if media is None and dur: media = dur * pct / 100
        if dur is None and media: dur = media / (pct / 100)
        vids.append(dict(n=nombre, f=fmt, dur=dur, v=vistas, pct=pct, sec=media))
    return vids


def main(path):
    vids = leer(path)
    if not vids: sys.exit(f'no encontré filas en {path} (¿la tabla tiene las 6 columnas?)')
    cortos = [x for x in vids if x['f'] in ('short', 'historia')]
    largos = [x for x in vids if x['f'] == 'largo']

    print(f"\n{'='*74}\n  RETENCIÓN · {os.path.basename(path)}  ·  {len(vids)} contenidos\n{'='*74}")

    if cortos:
        print(f"\nSHORTS E HISTORIAS ({len(cortos)}), por minutos totales vistos\n")
        print(f"  {'video':<34}{'dur':>6}{'vistas':>8}{'%':>7}{'seg':>6}{'min':>8}")
        for x in sorted(cortos, key=lambda z: -z['sec'] * z['v']):
            print(f"  {x['n'][:33]:<34}{x['dur']:>5.0f}s{x['v']:>8}{x['pct']:>7.1f}{x['sec']:>6.0f}{x['sec']*x['v']/60:>8.0f}")
        S = [x['sec'] for x in cortos]; D = [x['dur'] for x in cortos]; P = [x['pct'] for x in cortos]
        tot = sum(x['sec'] * x['v'] for x in cortos) / 60
        print(f"\n  segundos vistos: media {st.mean(S):.1f}  ·  rango {min(S):.0f}–{max(S):.0f}  ·  desv {st.pstdev(S):.1f}")
        print(f"  duración:        media {st.mean(D):.0f}s  ·  rango {min(D):.0f}–{max(D):.0f}s")
        print(f"  total: {sum(x['v'] for x in cortos):,} vistas · {tot:,.0f} min = {tot/60:.1f} h (NO cuentan para las 4,000)")
        cs, cp = corr(D, S), corr(D, P)
        print(f"\n  >> duración ↔ SEGUNDOS VISTOS : {cs:+.2f}" if cs is not None else "\n  >> faltan datos")
        if cs is not None:
            print(f"  >> duración ↔ % RETENCIÓN     : {cp:+.2f}")
            if max(D) - min(D) < 20:
                print(f"  ⚠️  Las duraciones solo varían {max(D)-min(D):.0f}s: la muestra NO puede responder")
                print(f"      si la duración importa. Hace falta variación deliberada.")
            elif cs < .3:
                print(f"  → Los segundos vistos NO dependen de la duración: alargar solo diluye el %.")
            elif cs > .5:
                print(f"  → Más duración SÍ da más tiempo visto: el formato largo se justifica.")
            else:
                print(f"  → Zona gris ({cs:+.2f}): no concluyas todavía.")

        porfmt = {}
        for x in cortos: porfmt.setdefault(x['f'], []).append(x)
        if len(porfmt) > 1:
            print(f"\n  por formato:")
            for f, xs in porfmt.items():
                print(f"    {f:<10} n={len(xs):<3} % medio {st.mean([x['pct'] for x in xs]):>5.1f}  "
                      f"seg medios {st.mean([x['sec'] for x in xs]):>4.0f}  vistas medias {st.mean([x['v'] for x in xs]):>7.0f}")

    if largos:
        h = sum(x['sec'] * x['v'] for x in largos) / 3600
        print(f"\nLARGOS ({len(largos)}) — el único formato que suma a las 4,000 horas\n")
        print(f"  {'video':<34}{'dur':>7}{'vistas':>8}{'%':>7}{'horas':>8}")
        for x in sorted(largos, key=lambda z: -z['sec'] * z['v']):
            print(f"  {x['n'][:33]:<34}{x['dur']/60:>6.1f}m{x['v']:>8}{x['pct']:>7.1f}{x['sec']*x['v']/3600:>8.1f}")
        print(f"\n  >> {h:.1f} h de 4,000 ({h/4000*100:.2f}%). Faltan {4000-h:,.0f} h.")
        if h > 0:
            med = st.mean([x['sec'] * x['v'] / 3600 for x in largos])
            print(f"  >> a {med:.1f} h por largo, harían falta ~{(4000-h)/med:,.0f} largos más. La palanca no es")
            print(f"     publicar más, es subir vistas y retención por largo.")
    print()


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
