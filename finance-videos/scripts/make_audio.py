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


# ---------- efectos por acción (historias 3D): cada escena de story.js declara sfx: [[fracción, nombre, volumen?, duración?], ...]
def sfx_pop(g=1, d=0):        # algo aparece: "blip" que sube
    x = tt(.16); f = 420 + 900 * x / .16; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(.16, .002, 6) * .5 * g


def sfx_whoosh(g=1, d=0):     # movimiento rápido: ruido que barre
    d = d or .5; n = rng.standard_normal(int(d * SR)); k = np.linspace(.02, .25, len(n)); y = np.empty_like(n); a = 0.0
    for i in range(len(n)):
        a += k[i] * (n[i] - a); y[i] = a
    return y * np.sin(np.pi * np.linspace(0, 1, len(y))) ** 2 * 1.6 * g


def sfx_door(g=1, d=0):       # puerta: golpe grave + clic
    y = thud(.9 * g); c = tick(.5 * g); y[int(.05 * SR):int(.05 * SR) + len(c)] += c; return y


def sfx_steps(g=1, d=0):      # pasos: golpecitos suaves, dos por segundo y medio
    d = d or 2.0; y = np.zeros(int(d * SR)); k = 0; t = 0.0
    while t < d - .15:
        x = tt(.09); st = np.sin(2 * np.pi * (150 if k % 2 else 130) * x) * env(.09, .002, 9) * .55 * g; i = int(t * SR); y[i:i + len(st)] += st[:len(y) - i]; t += .36; k += 1
    return y


def sfx_coins(g=1, d=0):      # monedas: campanitas agudas
    y = np.zeros(int(.9 * SR))
    for k, f in enumerate([1568, 2093, 1760, 2349, 1976]):
        p = pluck(f, .35, .22 * g); i = int(k * .09 * SR); y[i:i + len(p)] += p[:len(y) - i]
    return y


def sfx_arp(notes, step, g):
    y = np.zeros(int((len(notes) * step + .7) * SR))
    for k, f in enumerate(notes):
        p = pluck(f, .6, .3 * g); i = int(k * step * SR); y[i:i + len(p)] += p[:len(y) - i]
    return y


def sfx_rise(g=1, d=0): return sfx_arp([392, 523.25, 659.25, 783.99, 1046.5], .11, g)      # algo crece o sale bien
def sfx_fall(g=1, d=0): return sfx_arp([659.25, 523.25, 440, 349.23], .16, g * .9)          # algo sale mal
def sfx_shine(g=1, d=0):      # revelación: campana con brillo
    x = tt(1.2); return (np.sin(2 * np.pi * 1318.5 * x) + .5 * np.sin(2 * np.pi * 1976 * x) + .3 * np.sin(2 * np.pi * 2637 * x)) * env(1.2, .004, 4) * .3 * g


def sfx_ticks(g=1, d=0):      # contador que corre
    d = d or 1.2; y = np.zeros(int(d * SR)); t = 0.0
    while t < d - .04:
        c = tick(.5 * g); i = int(t * SR); y[i:i + len(c)] += c[:len(y) - i]; t += .075
    return y


def sfx_applause(g=1, d=0):   # aplausos: ráfagas de ruido
    d = d or 2.2; n = rng.standard_normal(int(d * SR)); y = n - onepole(n, .25); m = np.zeros(len(n))
    for _ in range(int(d * 55)):
        i = int(rng.uniform(0, len(n) - 600)); m[i:i + 500] += np.exp(-np.linspace(0, 6, 500))
    return y * np.minimum(m, 2) * np.sin(np.pi * np.linspace(0, 1, len(y))) ** .6 * .28 * g


def sfx_vote(g=1, d=0):       # golpe seco de madera (una paleta, un mazo)
    x = tt(.18); return (np.sin(2 * np.pi * 320 * x) + .5 * np.sin(2 * np.pi * 640 * x)) * env(.18, .001, 14) * .6 * g


SFX = {'pop': sfx_pop, 'whoosh': sfx_whoosh, 'door': sfx_door, 'steps': sfx_steps, 'coins': sfx_coins, 'rise': sfx_rise, 'fall': sfx_fall,
       'shine': sfx_shine, 'ticks': sfx_ticks, 'applause': sfx_applause, 'vote': sfx_vote, 'thud': lambda g=1, d=0: thud(.8 * g), 'wave': lambda g=1, d=0: wave_sfx(.9, g)}


def main(vdir):
    tl = json.load(open(os.path.join(vdir, 'build', 'timeline.json')))
    LONG = tl.get('format') == 'long'
    T = tl['duration']; n = int(T * SR); fx = np.zeros(n, np.float32); mus = np.zeros(n, np.float32)

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
    # historias 3D: efectos por acción que declara cada escena (build/sfx.json lo escribe engine3d/render3d.js)
    sp = os.path.join(vdir, 'build', 'sfx.json'); STORY = tl.get('format') == 'story'
    if os.path.exists(sp):
        for sc in json.load(open(sp))['scenes']:
            for ev in sc.get('sfx', []):
                t, name, g = ev[0], ev[1], (ev[2] if len(ev) > 2 else 1)
                if name not in SFX: print(f'⚠️  efecto desconocido: {name} (hay: {", ".join(SFX)})'); continue
                add(fx, SFX[name](g, ev[3] if len(ev) > 3 else 0), t)
    elif STORY: print('⚠️  falta build/sfx.json: corre antes `node engine3d/render3d.js <carpeta> --qa` para tener los efectos por acción')
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
        if not LONG:   # en largos, sin pulso de bombo: cama más tranquila para 10 minutos
            for j in range(4):
                add(mus, thud(.2 if STORY else .35), k * bar + j * bar / 4)   # historias: pulso más suave, mandan los efectos
    fi = int(.4 * SR); mus[:fi] *= np.linspace(0, 1, fi); fo = int(1.2 * SR); mus[-fo:] *= np.linspace(1, 0, fo)
    # voz + ducking
    vp = os.path.join(vdir, 'audio', 'voice.wav')
    if os.path.exists(os.path.join(vdir, 'audio', 'NO_VOICE')) or not os.path.exists(vp):
        # sin voz: música más baja y pareja para que tu voz grabada en YouTube encima se oiga clara
        voice = np.zeros(n); duck = np.full(n, .55); print('modo sin voz: solo música + efectos')
    else:
        w = wave.open(vp); v = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32768; w.close()
        voice = np.zeros(n); add(voice, v, tl['offset'])
        e = np.convolve(np.abs(voice), np.ones(int(.15 * SR)) / int(.15 * SR), 'same'); e /= e.max() + 1e-9
        duck = 1 - .6 * np.clip(e * 4, 0, 1)
    mus = mus / (np.abs(mus).max() + 1e-9) * (.13 if LONG else .20) * duck
    fx = fx / (np.abs(fx).max() + 1e-9) * (.22 if not voice.any() else .34)
    voice = voice / (np.abs(voice).max() + 1e-9) * .92
    mix = np.tanh((voice + mus + fx) * 1.02); mix /= np.abs(mix).max() * 1.06
    pcm = (np.stack([mix, mix], 1) * 32767).astype('<i2')
    o = wave.open(os.path.join(vdir, 'audio', 'mix.wav'), 'wb'); o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes(pcm.tobytes()); o.close()
    print(f'mezcla lista: {T:.1f}s')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
