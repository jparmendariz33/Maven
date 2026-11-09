# finance-videos — Costa Studio Finance (división de finanzas de Costa Studio)

Costa Studio es una agencia de influencer marketing; **Costa Studio Finance** es su canal de finanzas, aparte pero con la misma
marca. Firma en pantalla: logo + "FINANCE". Reglas de separación y sinergias: `plan/PLAN.md` §0. Nunca analizar una empresa que
sea cliente de la agencia sin declararlo.

**Videos largos (16:9, 9–11 min):** skill **`/largo`** (`../.claude/skills/largo/SKILL.md`), motor `engine/long.js`, carpetas
`largos/<domingo AAAA-MM-DD>/`. Plan, calendario y metas en `plan/`. Costo cero: sin vidIQ; JP pone su voz (modo sin voz por defecto).

**Historias 3D (verticales, 75–90 s, sábados 12:00):** skill **`/historia`** (`../.claude/skills/historia/SKILL.md`), motor `engine3d/`
(Three.js: `lib.js` + `cine.js` con luz de cine y actores articulados), carpetas `videos/<sábado>-<SLUG>-historia/` con `story.js`.
Flujo: `story.js` → `scripts/pace3d.py` → `engine3d/render3d.js --qa` → `make_audio.py` (música + efectos por acción) → `render3d.js video`.
Ideas en `plan/banco-historias.md`. Aquí NO van fotos: todo es maqueta 3D propia, sin logotipos reales.

**Imágenes reales en TODOS los videos** (shorts y largos): logos, sucursales, productos, sedes, personas. `scripts/fetch_images.py`
(Openverse / Wikimedia Commons / simple-icons / salas de prensa; solo licencias libres; nunca IA de marcas o personas reales) →
`videos|largos/<id>/images/` + `images/credits.json`. En el storyboard: escena `photo`, `bg_image`, `company.logo`, `news.image`.
`build_timeline.py` las incrusta; el motor pone el pie de foto. Detalle en `/short` §2b.

**Ritmo (nov 2026):** un video por día, producido el MISMO día que se publica (`plan/PLAN.md` §2 "Regla de oro"; no repetir nada de `plan/publicados.md`): 1 short diario (lun/mar/jue reactivo, mié derivado del largo, **vie/sáb/dom análisis de empresa**) + largo los domingos + **1 Historia 3D los sábados 12:00** (se produce el viernes).

Para crear un short, sigue la skill **`/short`** (`../.claude/skills/short/SKILL.md`). Resumen del flujo:
`setup.sh` → `fetch_data.py` → storyboard.json → `script_check.py` → **OK del usuario** → voz (vidIQ) →
`process_voice.py` → `build_timeline.py` → `render.js --qa` (revisar) → `make_audio.py` → `render.js` → youtube.md → commit.

## Regla de los números (descubierta en nov 2026 — aplica a TODO: shorts, largos, voz propia o de IA)
Un número mide pocos caracteres pero tarda mucho en decirse: "45" son 2 caracteres y se dice "cuarenta y cinco";
"1950" → "mil novecientos cincuenta" (8 sílabas); "46%" → "cuarenta y seis por ciento"; "$45,765" → 20 sílabas.
- **Tiempos (teleprompter sin voz):** `scripts/no_voice.py` convierte cada número, %, $ y monto a palabras (`spoken()`) y mide
  por SÍLABAS habladas, no por letras, a ~120 palabras/min. Nunca calcules tiempos por caracteres.
- **Voz de IA:** `scripts/tts_prep.py` escribe los números como se pronuncian (y siglas: S&P 500, CNBV, Nasdaq, JP) antes de
  enviarlos, para que la voz no lea "10,000" como "diez coma cero", y calcula el costo real en créditos.
- **Guiones:** en `say` escribe números con dígitos (se ven bien en subtítulos y alinean con whisper); las herramientas hacen la
  conversión. Si un tramo tiene muchas cifras seguidas, divídelo en más pantallas: se dice más lento de lo que parece.

## Estructura
- `assets/brand/brand.json` — marca: colores, handle, tagline, CTA, aviso legal, voz (id de Daniel).
- `assets/fonts/` — Unbounded, Space Grotesk, Instrument Serif (licencia OFL, uso comercial libre).
- `assets/brand/logo_mask*.png` — logo de Costa Studio como máscara (se tiñe según el fondo).
- `engine/index.html` + `engine/engine.js` — motor Canvas 1080x1920 que dibuja `window.VIDEO`.
  Abrir en navegador: `engine/index.html?v=../videos/<id>/build/video.js` (vista previa en loop).
- `scripts/` — pipeline (ver docstring de cada script). Voz de IA en largos: `tts_prep.py` → vidIQ por piezas →
  `audio/voice_part1.mp3, voice_part2.mp3…` → `process_voice.py` (las une; en largos no acelera la voz) → `build_timeline.py`.
- `videos/<AAAA-MM-DD>-<TICKER>/` — un folder por video: `data.json`, `summary.md`, `storyboard.json`, `narration.txt`, `images/`,
  `audio/voice_raw.mp3` (la voz pagada: no borrar), `<TICKER>_short.mp4`, `youtube.md`. `build/` y los .wav no se versionan.

## Reglas
- No generar voz sin aprobación del guion (cuesta créditos de vidIQ: 14 por cada 1,000 caracteres; plan de 150/mes,
  se renueva el día 4 de cada mes).
- Datos siempre verificados; nunca recomendaciones de compra/venta.
- Para cambiar el estilo, editar `brand.json` / `engine.js` y probar con `videos/ejemplo-SE` (re-render sin gastar créditos:
  `build_timeline.py` → `make_audio.py` → `render.js`).
