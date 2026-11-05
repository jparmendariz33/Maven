#!/usr/bin/env python3
"""Limpia la voz en off y obtiene el tiempo de cada palabra.

Uso:  .venv/bin/python scripts/process_voice.py videos/<id>
Entrada:  videos/<id>/audio/voice_raw.mp3
Salida:   videos/<id>/audio/voice.wav      (pausas recortadas, tempo ajustado, volumen normalizado)
          videos/<id>/build/whisper.json   (palabras con tiempos, en segundos de voice.wav)

Reglas shorts: pausas internas máx 0.32 s, entre párrafos 0.55 s, tempo 1.04x (hasta 1.10x si la voz pasa de 56 s).
Reglas largos (storyboard "format": "long"): pausas internas máx 0.55 s, entre párrafos 0.8 s, tempo 1.0 (voz natural).
Varias piezas: pon audio/voice_part1.mp3, voice_part2.mp3… y se unen solas (0.8 s entre piezas) en voice_raw.mp3.
"""
import sys, os, json, subprocess, wave
import numpy as np

SR = 44100


def run(cmd):
    subprocess.run(cmd, check=True)


def read_wav(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768; w.close(); return x


def write_wav(p, x):
    w = wave.open(p, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()); w.close()


def silences(x, thr_db=-38, min_len=.25):
    hop = int(.01 * SR); n = len(x) // hop
    rms = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms / (rms.max() + 1e-12))
    quiet = db < thr_db; out = []; i = 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]: j += 1
            if (j - i) * .01 >= min_len: out.append((i * .01, j * .01))
            i = j
        else: i += 1
    return out


def main(vdir):
    a = os.path.join(vdir, 'audio'); b = os.path.join(vdir, 'build'); os.makedirs(b, exist_ok=True)
    sbp = os.path.join(vdir, 'storyboard.json')
    LONG = os.path.exists(sbp) and json.load(open(sbp, encoding='utf-8')).get('format') == 'long'
    raw = os.path.join(a, 'voice_raw.mp3'); tmp = os.path.join(a, '_raw.wav')
    pieces = sorted(f for f in os.listdir(a) if f.startswith('voice_part') and f.endswith('.mp3'))
    if pieces and not os.path.exists(raw):   # une las piezas con 0.8 s de silencio entre ellas
        inp = []; fl = ''
        for i, f in enumerate(pieces): inp += ['-i', os.path.join(a, f)]
        n = len(pieces); inp += ['-f', 'lavfi', '-t', '0.8', '-i', f'anullsrc=r={SR}:cl=mono']
        seq = ''.join(f'[{i}:a][{n}:a]' if i < n - 1 else f'[{i}:a]' for i in range(n))
        run(['ffmpeg', '-loglevel', 'error', '-y', *inp, '-filter_complex', f'{seq}concat=n={2 * n - 1}:v=0:a=1[o]', '-map', '[o]', '-b:a', '192k', raw])
        print('piezas unidas:', ', '.join(pieces))
    run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-ac', '1', '-ar', str(SR), tmp])
    x = read_wav(tmp)
    sil = silences(x)
    # recorta silencio inicial/final y comprime pausas
    parts, pos = [], 0.0
    for s0, s1 in sil:
        d = s1 - s0
        if s0 <= .02:
            pos = max(0, s1 - .05); continue
        if s1 >= len(x) / SR - .02:
            parts.append(x[int(pos * SR):int((s0 + .15) * SR)]); pos = None; break
        keep = (.8 if d > 1.0 else min(d, .55)) if LONG else (.55 if d > .85 else min(d, .32))   # largos: pausas naturales
        parts.append(x[int(pos * SR):int((s0 + keep / 2) * SR)])
        pos = s1 - keep / 2
    if pos is not None: parts.append(x[int(pos * SR):])
    y = np.concatenate(parts); tight = os.path.join(a, '_tight.wav'); write_wav(tight, y)
    dur = len(y) / SR
    tempo = 1.0 if LONG else min(1.10, max(1.04, dur / 56.0))   # largos: sin acelerar la voz
    out = os.path.join(a, 'voice.wav')
    run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tight, '-af',
         f'atempo={tempo:.3f},highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,loudnorm=I=-15:TP=-1.5:LRA=7',
         '-ar', str(SR), '-ac', '1', out])
    for f in (tmp, tight): os.remove(f)
    final = len(read_wav(out)) / SR
    print(f'voz original {len(x) / SR:.1f}s → sin pausas largas {dur:.1f}s → tempo {tempo:.3f}x → final {final:.1f}s')
    # tiempos por palabra (faster-whisper; se le pasa un arreglo para evitar problemas con PyAV)
    raw16 = os.path.join(a, '_16k.f32')
    run(['ffmpeg', '-loglevel', 'error', '-y', '-i', out, '-ac', '1', '-ar', '16000', '-f', 'f32le', raw16])
    from faster_whisper import WhisperModel
    audio = np.fromfile(raw16, dtype=np.float32); os.remove(raw16)
    model = WhisperModel(os.environ.get('WHISPER_MODEL', 'small'), device='cpu', compute_type='int8')
    segs, _ = model.transcribe(audio, language='es', word_timestamps=True)
    words = [[round(w.start, 3), round(w.end, 3), w.word.strip()] for sg in segs for w in sg.words]
    json.dump({'duration': final, 'tempo': tempo, 'words': words}, open(os.path.join(b, 'whisper.json'), 'w'), ensure_ascii=False)
    print('transcripción:', ' '.join(w[2] for w in words))


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
