# Short: Sea Limited (NYSE: SE) — 15 s

Video vertical 1080x1920 · 30 fps, generado 100% con código.

- `SE_short_15s.mp4` — video final con SFX
- `index.html` + `data.js` — animación en Canvas (abre `index.html` para verla en loop)
- `sfx.py` — efectos de sonido sintetizados con numpy → `sfx.wav`
- `render.js` — renderiza los 450 frames con Playwright y codifica con ffmpeg

```bash
python3 sfx.py sfx.wav
node render.js $PWD/index.html $PWD/sfx.wav $PWD/SE_short_15s.mp4
```

Datos: precios diarios de Yahoo Finance (nov 2025 – 3 nov 2026); eventos según Reuters / Motley Fool. No es asesoría financiera.
