# finance-videos — shorts de análisis de acciones (estilo Costa Studio)

Para crear un video, sigue la skill **`/short`** (`../.claude/skills/short/SKILL.md`). Resumen del flujo:
`setup.sh` → `fetch_data.py` → storyboard.json → `script_check.py` → **OK del usuario** → voz (vidIQ) →
`process_voice.py` → `build_timeline.py` → `render.js --qa` (revisar) → `make_audio.py` → `render.js` → youtube.md → commit.

## Estructura
- `assets/brand/brand.json` — marca: colores, handle, tagline, CTA, aviso legal, voz (id de Daniel).
- `assets/fonts/` — Unbounded, Space Grotesk, Instrument Serif (licencia OFL, uso comercial libre).
- `assets/brand/logo_mask*.png` — logo de Costa Studio como máscara (se tiñe según el fondo).
- `engine/index.html` + `engine/engine.js` — motor Canvas 1080x1920 que dibuja `window.VIDEO`.
  Abrir en navegador: `engine/index.html?v=../videos/<id>/build/video.js` (vista previa en loop).
- `scripts/` — pipeline (ver docstring de cada script).
- `videos/<AAAA-MM-DD>-<TICKER>/` — un folder por video: `data.json`, `summary.md`, `storyboard.json`, `narration.txt`,
  `audio/voice_raw.mp3` (la voz pagada: no borrar), `<TICKER>_short.mp4`, `youtube.md`. `build/` y los .wav no se versionan.

## Reglas
- Duración objetivo: ~1.5 min (70–95 s, 800–1000 caracteres de guion = 14 créditos), ritmo pausado con aire entre frases.
- No generar voz sin aprobación del guion (cuesta créditos de vidIQ: 14 por cada 1,000 caracteres; plan de 150/mes,
  se renueva el día 4 de cada mes).
- Datos siempre verificados; nunca recomendaciones de compra/venta.
- Para cambiar el estilo, editar `brand.json` / `engine.js` y probar con `videos/ejemplo-SE` (re-render sin gastar créditos:
  `build_timeline.py` → `make_audio.py` → `render.js`).
