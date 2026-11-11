#!/usr/bin/env python3
"""Música original para historias 3D: órgano + piano minimalista que crece con la historia (estilo "épico espacial").

Uso:  .venv/bin/python scripts/music3d.py videos/<id> [--mp4 <video.mp4>]

- Lee los tiempos de escena de build/timing.js (si hay voz sincronizada) o de los `d:` de story.js (animatic).
- Composición original (no copia ninguna obra): Re menor, 96 BPM, progresión i–VI–III–VII (Dm–B♭–F–C),
  arpegio de piano en semicorcheas, órgano sostenido, bajo y timbales en el clímax; baja en la caída y cierra en órgano.
- Efectos suaves sincronizados: despegues, explosiones, monedas y "olas" en las transiciones.
Salida: audio/music.wav (estéreo, ≈ -20 LUFS para dejar espacio a la voz) y audio/music.m4a.
Con --mp4 además mezcla la música en ese video → <video>_musica.mp4.
"""
import sys, os, re, json, subprocess
import numpy as np

SR = 44100
rng = np.random.default_rng(7)
BPM = 96; S16 = 60 / BPM / 4; BAR = S16 * 16
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)


def scene_times(vdir):
    tj = os.path.join(vdir, 'build', 'timing.js')
    if os.path.exists(tj):
        sc = json.loads(open(tj).read()[len('export default '):].rstrip().rstrip(';'))['scenes']; return [a for a, b in sc], sc[-1][1]
    js = open(os.path.join(vdir, 'story.js')).read()
    ds = [float(x) for x in re.findall(r"world: '\w+', d: ([\d.]+)", js)]; tail = float((re.findall(r'tail: ([\d.]+)', js) or [0])[0])
    t0 = np.concatenate([[0], np.cumsum(ds)[:-1]]); return list(t0), float(sum(ds) + tail)


def adsr(n, a, r):
    e = np.ones(n); ka, kr = min(n, int(a * SR)), min(n, int(r * SR))
    if ka: e[:ka] = np.linspace(0, 1, ka)
    if kr: e[-kr:] *= np.linspace(1, 0, kr)
    return e


def add(buf, x, t, pan=0.0):
    i = int(t * SR)
    if i >= buf.shape[1] or i + len(x) <= 0: return
    j = min(buf.shape[1], i + len(x)); x = x[:j - i]
    buf[0, i:j] += x * np.sqrt((1 - pan) / 2); buf[1, i:j] += x * np.sqrt((1 + pan) / 2)


def piano(f, d=1.6, g=.3):      # piano suave ("felt"): ataque rápido, cola larga, armónicos que se apagan
    x = np.arange(int(d * SR)) / SR
    y = sum(w * np.sin(2 * np.pi * f * k * x * (1 + .0004 * k * k)) * np.exp(-x * (2.2 + 1.8 * k)) for k, w in [(1, 1), (2, .45), (3, .18), (4, .08)])
    return y * adsr(len(x), .004, .25) * g


def organ(f, d, g=.12):         # órgano de tubos: registros 8', 4', 2 2/3', 2' con leve trémolo
    x = np.arange(int(d * SR)) / SR; trem = 1 + .035 * np.sin(2 * np.pi * 5.3 * x)
    y = sum(w * np.sin(2 * np.pi * f * k * x + k) for k, w in [(1, 1), (2, .6), (3, .28), (4, .32), (6, .1), (8, .07)])
    return y * trem * adsr(len(x), .45, .9) * g


def rumble(d=3.5, g=.5):        # despegue: ruido grave que crece
    n = np.cumsum(rng.standard_normal(int(d * SR))); n -= np.convolve(n, np.ones(800) / 800, 'same'); n /= np.abs(n).max() + 1e-9
    return n * np.sin(np.pi * np.linspace(0, 1, len(n))) ** .8 * g


def boom(g=.7):                 # explosión de plastilina: golpe grave + ruido corto
    x = np.arange(int(1.4 * SR)) / SR; f = 38 + 70 * np.exp(-x * 7)
    n = rng.standard_normal(len(x)); n = np.convolve(n, np.ones(60) / 60, 'same')
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 3.2) + .5 * n * np.exp(-x * 9)) * g


def coin(g=.12):
    x = np.arange(int(.5 * SR)) / SR; f = 1900 + rng.random() * 900
    return (np.sin(2 * np.pi * f * x) + .5 * np.sin(2 * np.pi * f * 2.4 * x)) * np.exp(-x * 11) * g


def whoosh(d=1.1, g=.35):       # ola de transición
    n = rng.standard_normal(int(d * SR)); n = np.convolve(n, np.ones(25) / 25, 'same')
    return n * np.sin(np.pi * np.linspace(0, 1, len(n))) ** 1.6 * g


def timpani(g=.35):
    x = np.arange(int(1.6 * SR)) / SR; return np.sin(2 * np.pi * 55 * x * (1 + .02 * np.exp(-x * 6))) * np.exp(-x * 2.6) * adsr(len(x), .005, .2) * g


def reverb(buf, secs=2.8, mix=.3):
    n = int(secs * SR); out = np.empty_like(buf)
    for c in range(2):
        ir = np.random.default_rng(11 + c).standard_normal(n) * np.exp(-np.linspace(0, 6.5, n)); ir[:int(.012 * SR)] = 0
        L = 1 << int(np.ceil(np.log2(buf.shape[1] + n)))
        wet = np.fft.irfft(np.fft.rfft(buf[c], L) * np.fft.rfft(ir, L), L)[:buf.shape[1]]
        out[c] = buf[c] * (1 - mix) + wet / (np.abs(wet).max() + 1e-9) * np.abs(buf[c]).max() * mix * 1.6
    return out


def score(T0, DUR):
    """La partitura (sin efectos): estéreo (2, n), ya con reverb y crescendo. La usa make_audio.py en TODAS las historias 3D."""
    n = int((DUR + 1) * SR); mus = np.zeros((2, n))
    S = lambda i: T0[i] if i < len(T0) else DUR
    # intensidad por tramo de la historia (0..1), interpolada suave
    keys = [(0, .35), (S(1), .45), (S(2), .62), (S(3), .75), (S(4), .82), (S(5), 1.0), (S(6) - .5, 1.0), (S(6) + 1.5, .45),
            (S(6) + .68 * (S(7) - S(6)), .6), (S(7), .85), (DUR - 1.5, .7), (DUR, 0)]
    inten = lambda t: float(np.interp(t, [k[0] for k in keys], [k[1] for k in keys]))
    BRIGHT = [(-1, 50, 53, 57), (-1, 50, 53, 58), (-1, 48, 53, 57), (-1, 48, 52, 55)]   # Dm  B♭  F  C (voces)
    BASS = [38, 34, 41, 36]
    DARK = [(-1, 50, 53, 57), (-1, 50, 55, 58), (-1, 50, 53, 58), (-1, 49, 52, 57)]     # Dm  Gm  B♭  A (la caída)
    DBASS = [38, 43, 34, 45]
    PAT = [0, 2, 4, 2, 3, 2, 4, 1, 0, 2, 4, 2, 3, 4, 2, 1]                              # arpegio original
    nb = int(DUR / BAR) + 1
    for b in range(nb):
        t = b * BAR; k = inten(t)
        dark = S(6) - .3 <= t < S(7) - .3
        ch, bs = (DARK, DBASS) if dark else (BRIGHT, BASS)
        c = ch[b % 4]; tones = [c[1], c[2], c[3], c[1] + 12, c[2] + 12]
        if t >= S(7) - .3:      # cierre: un solo acorde largo de órgano (Dm add9) que se apaga
            if t < S(7) + BAR: [add(mus, organ(mtof(m), DUR - t + .5, .1 + .04 * (m > 60)), t, p) for m, p in [(38, 0), (50, -.3), (57, .3), (62, -.2), (64, .2), (69, 0)]]
            for i in range(16):
                tt_ = t + i * S16
                if tt_ < DUR - 2: add(mus, piano(mtof(tones[PAT[i]] + 12), 1.8, .16), tt_, -.4 + .8 * (i % 2))
            continue
        for i in range(16):                                   # piano: arpegio en semicorcheas
            tt_ = t + i * S16; acc = 1.0 if i % 4 == 0 else .72
            add(mus, piano(mtof(tones[PAT[i]] + 12), 1.6, .2 * acc * (.6 + .5 * k)), tt_, -.35 + .7 * (i % 2))
            if k > .7 and i % 2 == 0:                         # segunda voz una octava arriba en el clímax
                add(mus, piano(mtof(tones[PAT[(i + 5) % 16]] + 24), 1.2, .09 * (k - .6)), tt_ + S16 * .5, .5 - (i % 4) * .25)
        if k > .4:                                            # órgano sostenido
            for m in c[1:]: add(mus, organ(mtof(m), BAR + .6, .045 + .06 * k), t, (m - 53) / 12)
            add(mus, organ(mtof(bs[b % 4]), BAR + .6, .05 * k), t)
        if k > .7:                                            # bajo en corcheas
            for i in range(0, 16, 2): add(mus, piano(mtof(bs[b % 4] + 12), .6, .12 * k), t + i * S16)
        if k > .9:                                            # timbales en el clímax
            add(mus, timpani(.3), t); add(mus, timpani(.2), t + BAR / 2)
    mus = reverb(mus, 3.0, .35)
    tgrid = np.arange(n) / SR; arc = .2 + .8 * np.interp(tgrid, [k[0] for k in keys], [max(k[1], .35) for k in keys]) ** 1.4  # crescendo audible
    return mus / (np.abs(mus).max() + 1e-9) * .8 * arc


def main(vdir, mp4=None):
    T0, DUR = scene_times(vdir); n = int((DUR + 1) * SR); fx = np.zeros((2, n)); S = lambda i: T0[i] if i < len(T0) else DUR
    mus = score(T0, DUR)
    # efectos sincronizados con la animación (mismas fracciones que story.js) — solo para la historia de SpaceX
    d2 = S(2) - S(1); d3 = S(3) - S(2)
    add(fx, rumble(4.5, .35), .3)
    for f in (.1, .3, .5): add(fx, rumble(1.6, .18), S(1) + f * d2); add(fx, boom(.55), S(1) + f * d2 + 1.05)
    add(fx, rumble(3.5, .4), S(2) + .1)
    for i in range(18): add(fx, coin(.07 + .05 * rng.random()), S(2) + .45 * d3 + .2 + i * .09 + rng.random() * .05, rng.uniform(-.6, .6))
    for i in (1, 3, 4, 5, 7): add(fx, whoosh(1.1, .22), S(i) - .25)
    # mezcla
    fx = reverb(fx, 1.6, .15)
    fade = np.ones(n); kf = int(1.8 * SR); end = int(DUR * SR); fade[end - kf:end] = np.linspace(1, 0, kf); fade[end:] = 0
    mix = (mus + fx * .9) * fade
    mix = mix[:, :int(DUR * SR)]
    os.makedirs(os.path.join(vdir, 'audio'), exist_ok=True)
    raw = os.path.join(vdir, 'audio', '_music_raw.wav'); wav = os.path.join(vdir, 'audio', 'music.wav'); m4a = os.path.join(vdir, 'audio', 'music.m4a')
    import wave
    w = wave.open(raw, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix.T, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-20:TP=-2:LRA=9', '-ar', str(SR), wav], check=True)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-c:a', 'aac', '-b:a', '192k', m4a], check=True); os.remove(raw)
    print(f'música: {DUR:.1f}s → {wav} y {m4a}')
    if mp4:
        out = mp4[:-4] + '_musica.mp4'
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp4, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
        print('video con música:', out)


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    a = sys.argv; main(a[1], a[a.index('--mp4') + 1] if '--mp4' in a else None)
