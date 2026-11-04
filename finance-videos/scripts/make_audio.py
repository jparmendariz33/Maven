#!/usr/bin/env python3
"""Mezcla final: voz + cama musical cálida (se baja sola cuando habla la voz) + efectos suaves.

Uso:  .venv/bin/python scripts/make_audio.py videos/<id>
Lee build/timeline.json (tiempos de escenas y cues) y audio/voice.wav → audio/mix.wav
Estilo Costa: nada de golpes agresivos; pads cálidos, pulsos suaves, "olas" de ruido filtrado.
"""
import sys, os, json, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(3)


def tt(d): return np.arange(int(d * SR)) / SR


def env(d, a=.005, r=5):
    m = int(d * SR); e = np.ones(m); k = max(1, int(a * SR)); e[:k] = np.linspace(0, 1, k); return e * np.exp(-np.linspace(0, 1, m) * r)


def onepole(x, k):
    """Filtro pasa-bajos de un polo (vectorizado por bloques para velocidad)."""
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s += k * (x[i] - s); y[i] = s
    return y


def wave_sfx(d=.9, g=1.0):   # "ola": ruido filtrado que crece y se va
    n = rng.standard_normal(int(d * SR)); y = onepole(n, .08)
    return y * np.sin(np.pi * np.linspace(0, 1, len(y))) ** 1.5 * 2.2 * g


def pluck(f, d=.5, g=.4):     # tipo marimba
    x = tt(d); return (np.sin(2 * np.pi * f * x) + .25 * np.sin(2 * np.pi * 3 * f * x) * np.exp(-x * 18)) * env(d, .002, 7) * g


def tick(g=.18):
    x = tt(.03); return np.sin(2 * np.pi * 1800 * x) * env(.03, .0005, 25) * g


def thud(g=.8):               # golpe grave y redondo
    x = tt(.9); f = 45 + 60 * np.exp(-x * 9); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(.9, .002, 5) * g


def main(vdir):
    tl = json.load(open(os.path.join(vdir, 'build', 'timeline.json')))
    T = tl['duration']; n = int(T * SR); fx = np.zeros(n); mus = np.zeros(n)

    def add(buf, sig, t, g=1.0):
        i = int(t * SR); j = min(n, i + len(sig))
        if 0 <= i < n: buf[i:j] += sig[:j - i] * g

    cues = []
    def collect(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if (k == 'cue' or k.startswith('cue_')) and isinstance(v, (int, float)): cues.append(v)
                else: collect(v)
        elif isinstance(o, list):
            for v in o: collect(v)
    scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
    for i, s in enumerate(tl['scenes']):
        if i > 0: add(fx, wave_sfx(.9), s['t0'] - .2, .55)
        cues.clear(); collect(s)
        for j, c in enumerate(sorted(cues)): add(fx, pluck(scale[(i + j) % len(scale)], .45, .32), c)
        if s['type'] == 'hook' and 'cue_value' in s: add(fx, thud(.7), s['cue_value'] + 1.35)
        if s['type'] == 'zoom':
            for e in s.get('events', []):
                if isinstance(e.get('cue'), (int, float)) and e.get('tone') == 'down': add(fx, thud(.9), e['cue'])
        if s['type'] == 'metric' and 'cue_gauge' in s:
            for k in range(8): add(fx, tick(.1), s['cue_gauge'] + .5 + k * .16)
        if s['type'] == 'catalyst': add(fx, thud(.5), s.get('cue_date', s['t0'] + .5))
    # cama musical: Am9 – Fmaj7 – C – G, pads suaves + arpegio lento (92 bpm)
    x = np.arange(n) / SR
    chords = [[110, 164.81, 196, 246.94], [87.31, 130.81, 174.61, 220], [130.81, 164.81, 196, 261.63], [98, 146.83, 196, 246.94]]
    bar = 60 / 92 * 4
    for k in range(int(T / bar) + 1):
        a, b = int(k * bar * SR), min(n, int((k + 1) * bar * SR))
        if a >= n: break
        seg = x[a:b] - x[a]; e = np.minimum(1, seg / .6) * np.minimum(1, (bar - seg) / .6 + .2)
        for f in chords[k % 4]:
            mus[a:b] += (np.sin(2 * np.pi * f * x[a:b]) + .3 * np.sin(2 * np.pi * 2 * f * x[a:b] + .5)) * e * .12
        arp = chords[k % 4]
        for j in range(8):
            add(mus, pluck(arp[j % 4] * 2, .6, .10), k * bar + j * bar / 8)
        for j in range(4):
            add(mus, thud(.35), k * bar + j * bar / 4)
    fi = int(.4 * SR); mus[:fi] *= np.linspace(0, 1, fi); fo = int(1.2 * SR); mus[-fo:] *= np.linspace(1, 0, fo)
    # voz + ducking
    w = wave.open(os.path.join(vdir, 'audio', 'voice.wav')); v = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768; w.close()
    voice = np.zeros(n); add(voice, v, tl['offset'])
    e = np.convolve(np.abs(voice), np.ones(int(.15 * SR)) / int(.15 * SR), 'same'); e /= e.max() + 1e-9
    duck = 1 - .6 * np.clip(e * 4, 0, 1)
    mus = mus / (np.abs(mus).max() + 1e-9) * .20 * duck
    fx = fx / (np.abs(fx).max() + 1e-9) * .34
    voice = voice / (np.abs(voice).max() + 1e-9) * .92
    mix = np.tanh((voice + mus + fx) * 1.02); mix /= np.abs(mix).max() * 1.06
    pcm = (np.stack([mix, mix], 1) * 32767).astype('<i2')
    o = wave.open(os.path.join(vdir, 'audio', 'mix.wav'), 'wb'); o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes(pcm.tobytes()); o.close()
    print(f'mezcla lista: {T:.1f}s')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
