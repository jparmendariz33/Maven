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
- No generar voz sin aprobación del guion (cuesta créditos de vidIQ: 28 por cada 1,000 caracteres, redondeado hacia arriba; plan de 150/mes,
  se renueva el día 4 de cada mes).
- Datos siempre verificados; nunca recomendaciones de compra/venta.
- Para cambiar el estilo, editar `brand.json` / `engine.js` y probar con `videos/ejemplo-SE` (re-render sin gastar créditos:
  `build_timeline.py` → `make_audio.py` → `render.js`).

## Historias 3D — "Costa Diorama" (`engine3d/`)
Videos narrativos con personajes de plastilina (Three.js) + la misma capa editorial de los shorts. Flujo:
`fetch_data.py` → `narration.txt` (un párrafo por escena) + `story.js` (mundos 3D y escenas, mismo orden) + `guion.md`
→ `node engine3d/render3d.js videos/<id> --qa` (revisar) → animatic mudo (`render3d.js videos/<id>`) → **OK del usuario**
→ voz (vidIQ) → `process_voice.py --historia` (sin acelerar) → `build_timing3d.py` (agrega pausas: 0.7 s tras cada frase, 1.1 s entre
  escenas → `audio/voice_story.wav`; escenas y subtítulos amarrados a la voz real) → `make_audio.py` → `render3d.js`.
- `engine3d/lib.js` — piezas reutilizables: plastilina, personaje con expresiones (`guy`, `face`), cohete, humo, explosión,
  satélite con corte, globo, capa editorial (kicker, titulares, ficha del año, palabra gigante, subtítulos), transición de marea.
- `engine3d/player.js` — línea de tiempo; escenas con `trans: 'cont'` comparten mundo (plano secuencia).
- Ritmo: las historias respiran (≈80 s para ~940 caracteres). Duración estimada por escena = caracteres/14.4 + pausas.
- Música: `scripts/music3d.py videos/<id> [--mp4 video.mp4]` → composición original (órgano + piano minimalista, crece con la
  historia) + efectos sincronizados → `audio/music.wav|m4a` y `<video>_musica.mp4`. Nunca imitar canciones con derechos.
- Render ~1 s por cuadro (SwiftShader): 60 s ≈ 30 min. Ejemplo: `videos/2026-11-09-SPCX-historia/`.
- Reglas de diseño: solo colores de `brand.json`; el texto va arriba (y < 760 px), la maqueta en el centro y abajo, los subtítulos en y≈1650;
  algo nuevo cada 1.5–2 s; nada de logotipos reales.
