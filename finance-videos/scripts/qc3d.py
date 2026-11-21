#!/usr/bin/env python3
"""QC de una pieza 3D: revisa sola lo que en esta casa ya falló al menos una vez.

Uso:  .venv/bin/python scripts/qc3d.py videos/<id> [--estricto]

Nace del short de Anthropic (20-21 nov 2026), que necesitó cinco vueltas y 19 correcciones.
Casi todas eran mecánicas: texto que no cabía, objetos más anchos que el cuadro, la capa 2D en
el lugar equivocado, barras que se salían, demasiados efectos. Todo eso se puede medir.

Devuelve código 1 si hay algún ERROR (bloquea voz y render) y 0 si solo hay avisos.
Lo que NO revisa, porque necesita criterio: si la historia se entiende, si el gancho engancha,
si las cifras son del mismo periodo y si la fuente es primaria. Eso va en la lista del plan.
"""
import sys, os, re, json, math, wave, subprocess
import numpy as np

TAN15 = math.tan(math.radians(15))          # el fov del motor es 30°: semiángulo 15°
ALTO = lambda d: 2 * TAN15 * d              # alto del cuadro a distancia d
ANCHO = lambda d: ALTO(d) * 0.5625          # y el ANCHO, que es 1.78 veces menor: es el que manda

ERR, AVI = [], []
def err(c, m): ERR.append(f'[{c}] {m}')
def avi(c, m): AVI.append(f'[{c}] {m}')

def revisa_story(vdir):
    p = os.path.join(vdir, 'story.js')
    if not os.path.exists(p): return err('ESTRUCTURA', 'no hay story.js'), None
    s = open(p, encoding='utf-8').read()

    # ── 1. la capa 2D va en overlay(): en update() el lienzo todavía es null (crashea)
    for m in re.finditer(r'update\s*\(w, lt, t, L\)\s*\{(.*?)\n    \},?\n', s, re.S):
        cuerpo = m.group(1)
        for mal in ('L.scrim(', 'head(L,', 'L.rise(', 'L.kicker(', 'cascada2D('):
            if mal in cuerpo:
                err('MOTOR', f'{mal} está dentro de update(); la capa 2D va en overlay() o L.C es null')

    # ── 2. efectos de sonido: máximo 8 en la pieza y ninguno repetido seguido
    efectos = re.findall(r"\[\s*\.?\d*\.?\d*\s*,\s*'(\w+)'", s)
    if len(efectos) > 8: avi('AUDIO', f'{len(efectos)} efectos declarados; la regla son 6–8')
    for a, b in zip(efectos, efectos[1:]):
        if a == b: avi('AUDIO', f'efecto "{a}" repetido dos veces seguidas')

    # ── 3. encuadre: distancia de cámara por escena, y variedad de tamaños de plano
    escenas = re.findall(r"\{\s*id:\s*'([^']+)'.*?world:\s*'(\w+)'", s)
    cams = re.findall(r'cam\(w,\s*mv\(\[([^\]]+)\],\s*\[([^\]]+)\],\s*k\),\s*mv\(\[([^\]]+)\],\s*\[([^\]]+)\]', s)
    dists = []
    for p0, p1, t0, t1 in cams:
        f = lambda z: [float(x) for x in z.split(',')]
        d0 = math.dist(f(p0), f(t0)); d1 = math.dist(f(p1), f(t1))
        dists.append((d0, d1))
    if dists:
        print('\n  escena                 d inicio → d final   ancho de cuadro   alto')
        for (nm, _), (d0, d1) in zip(escenas, dists):
            print(f'  {nm[:20]:22s} {d0:6.1f} → {d1:6.1f}      {ANCHO(d1):5.2f}         {ALTO(d1):5.2f}')
        # dos escenas seguidas con el mismo tamaño de plano no se leen como corte
        for i in range(len(dists) - 1):
            a, b = dists[i][1], dists[i + 1][0]
            if a > 0 and abs(b - a) / a < .18 and escenas[i][1] == escenas[i + 1][1]:
                avi('CÁMARA', f'"{escenas[i][0]}" → "{escenas[i+1][0]}": mismo mundo y distancia casi igual '
                              f'({a:.1f} vs {b:.1f}); el corte no se va a notar')
        fams = [min(range(4), key=lambda k: abs(d1 - [4, 8, 14, 22][k])) for _, d1 in dists]
        if len(set(fams)) < 3:
            avi('CÁMARA', f'solo {len(set(fams))} familias de plano en {len(dists)} escenas: la pieza se va a sentir plana')

    # ── 4. texto dentro de un lienzo: caracteres × 0.62 × tamaño ≤ ancho del lienzo
    for m in re.finditer(r"font\s*=\s*'[^']*?(\d+)px[^']*'\s*;[^;]*?fillText\('([^']*)'", s):
        px, txt = int(m.group(1)), m.group(2)
        ancho_est = len(txt) * 0.62 * px
        if ancho_est > 1000:
            avi('TEXTO', f'"{txt[:28]}" a {px}px mide ~{ancho_est:.0f}px: comprueba el ancho del lienzo (pw)')

    # ── 5. logos reales declarados pero sin archivo
    for m in re.finditer(r"images:\s*\{([^}]*)\}", s):
        for k, f in re.findall(r"(\w+)\s*:\s*'([^']+)'", m.group(1)):
            if not os.path.exists(os.path.join(vdir, f)): err('IMAGEN', f'falta {f} (declarado como "{k}")')
    return None, len(escenas)

def revisa_narracion(vdir):
    caps = re.findall(r"cap:\s*'((?:[^'\\]|\\.)*)'", open(os.path.join(vdir, 'story.js'), encoding='utf-8').read())
    t = ' '.join(c.replace("\\'", "'") for c in caps)
    n, pal = len(t), len(t.split())
    bloques = -(-n // 1000)
    print(f'\n  narración: {n} caracteres · {pal} palabras · {bloques} bloque(s) = {bloques*28} créditos')
    print(f'             ~{pal/162*60:.0f} s con Francisco (162 ppm)')
    margen = bloques * 1000 - n
    if margen < 60: avi('CRÉDITOS', f'a {margen} caracteres de pasar al bloque siguiente (+28 créditos): recorta aquí')
    if pal < 90: avi('RELOJ', f'{pal} palabras: la pieza queda corta para el formato')
    return caps

def revisa_audio(vdir):
    p = os.path.join(vdir, 'audio', 'mix.wav')
    if not os.path.exists(p): return avi('AUDIO', 'no hay audio/mix.wav todavía')
    w = wave.open(p); sr = w.getframerate()
    a = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768
    if w.getnchannels() == 2: a = a.reshape(-1, 2).mean(1)
    pico = 20 * math.log10(float(np.abs(a).max()) + 1e-9)
    print(f'\n  audio: {len(a)/sr:.1f} s · pico {pico:+.1f} dBFS')
    if pico > -0.5: err('AUDIO', f'pico en {pico:+.1f} dBFS: tiene que quedar por debajo de −0.5')
    # ningún hueco de más de 1.5 s sin nada
    v = int(.5 * sr); huecos = 0
    for i in range(0, len(a) - 3 * v, v):
        if np.abs(a[i:i + 3 * v]).max() < .01: huecos += 1
    if huecos: avi('AUDIO', f'{huecos} tramo(s) de ~1.5 s en silencio total')
    # la música tiene que estar desde el primer segundo (regla del gancho)
    ini = float(np.sqrt((a[:int(3 * sr)] ** 2).mean()))
    tot = float(np.sqrt((a ** 2).mean()))
    if tot and ini / tot < .45:
        avi('AUDIO', f'los primeros 3 s están al {ini/tot*100:.0f}% del nivel medio: el gancho entra sin cuerpo')

def revisa_miniatura(vdir):
    p = os.path.join(vdir, 'miniatura.jpg')
    if not os.path.exists(p): return avi('MINIATURA', 'no hay miniatura.jpg (la saca el render al terminar)')
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                          'stream=width,height', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip()
    if out != '1080,1920': err('MINIATURA', f'mide {out}, tiene que ser 1080x1920')
    else: print(f'\n  miniatura: {out} ✓')

def revisa_video(vdir):
    vid = [f for f in os.listdir(vdir) if f.endswith('.mp4')]
    if not vid: return avi('RENDER', 'todavía no hay MP4')
    if len(vid) > 1: err('REPO', f'{len(vid)} archivos MP4 en la carpeta: debe quedar uno solo')
    p = os.path.join(vdir, vid[0])
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip())
    mb = os.path.getsize(p) / 1e6
    print(f'  video: {vid[0]} · {dur:.1f} s · {mb:.0f} MB')
    if mb > 95: err('REPO', f'{mb:.0f} MB: GitHub no acepta más de 100')
    if not (25 <= dur <= 95): avi('RELOJ', f'{dur:.0f} s queda fuera del rango normal de un short (25–95 s)')
    # hoja de contacto del MP4 completo, para el barrido a ojo
    hoja = os.path.join(vdir, 'build', 'barrido.jpg')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', p, '-vf',
                    'fps=1/3,scale=240:-1,tile=8x4', '-frames:v', '1', hoja], check=False)
    print(f'  barrido para revisar a ojo: {hoja}')

def main(vdir):
    print(f'QC de {vdir}')
    revisa_story(vdir); revisa_narracion(vdir); revisa_audio(vdir); revisa_miniatura(vdir); revisa_video(vdir)
    print('\n' + '─' * 72)
    for e in ERR: print('  ERROR  ' + e)
    for a in AVI: print('  aviso  ' + a)
    if not ERR and not AVI: print('  sin defectos automáticos. Falta la lista de criterio: plan/qc-3d.md')
    print('─' * 72)
    print(f'  {len(ERR)} error(es) · {len(AVI)} aviso(s)')
    return 1 if ERR else 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1].rstrip('/')))
