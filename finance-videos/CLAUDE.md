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

**JP en 3D (anfitrión del canal; aprobado el 11 nov 2026, obligatorio):** el personaje 3D de JP sale como recorte con fondo transparente,
chico (≈1/8 de la pantalla), encima de la escena y reaccionando a ella; el protagonista es el tema (foto a toda la pantalla con
`"bg_full": true`), no JP. Shorts: SOLO en el gancho y el cierre. Largos: inicio, 3–5 puntos intermedios y cierre. Publicaciones: primera y
última imagen. Personas famosas: su propio muñeco (`"who"`). Sin párpados en ningún personaje. `"host": {"act", "mood", "pos"}` en la escena;
`node engine3d/render_host.js <carpeta>` después de `build_timeline.py`. Detalle: `/short` §2c.

**Qué hace cada formato (plan del 11 nov 2026, `plan/PLAN.md` §2b):** publicaciones = lo de hoy (skill `/publicacion`, lun/mié/vie);
shorts = contexto que dura meses (sin "hoy"; `/short` §1c); historia 3D = alcance y marca; largos = horas de reproducción y búsqueda.

**Imágenes reales en TODOS los videos** (shorts y largos): logos, sucursales, productos, sedes, personas. `scripts/fetch_images.py`
(Openverse / Wikimedia Commons / simple-icons / salas de prensa; solo licencias libres; nunca IA de marcas o personas reales) →
`videos|largos/<id>/images/` + `images/credits.json`. En el storyboard: escena `photo`, `bg_image`, `company.logo`, `news.image`.
`build_timeline.py` las incrusta; el motor pone el pie de foto. Detalle en `/short` §2b. **Calidad (JP, 11 nov 2026):** solo fotos nítidas (≥ 1600 px), limpias, con el sujeto solo y sin ruido de fondo; nada de fotos de calle cargadas.

**Ritmo (nov 2026):** un video por día, producido el MISMO día que se publica (`plan/PLAN.md` §2 "Regla de oro"; no repetir nada de `plan/publicados.md`): shorts lun/mar/jue de contexto, mié derivado del largo, vie Análisis + Potencial, **dom ranking** (el sábado solo sale la Historia 3D) + publicaciones lun/mié/dom. Música: partitura de órgano y piano en las historias; cama cálida en shorts y largos + largo los domingos + **1 Historia 3D los sábados 12:00** (se produce el viernes). Los videos con datos del día se hacen DESPUÉS del cierre de la bolsa (ver "Regla del cierre").

Para crear un short, sigue la skill **`/short`** (`../.claude/skills/short/SKILL.md`). Resumen del flujo:
`setup.sh` → `market_close.py` (¿ya cerró?) → `fetch_data.py` → storyboard.json → `script_check.py` → **OK del usuario** → voz (vidIQ) →
`process_voice.py` → `build_timeline.py` → `engine3d/render_host.js` (JP en 3D) → `render.js --qa` (revisar) → `make_audio.py` → `render.js` → youtube.md → commit.

**Rama y tareas:** todo el proyecto vive en la rama `costa-studio-finance` de `jparmendariz33/Maven` (Costa Studio, la agencia, es otra
empresa: no mezclar nombres). Las instrucciones de las tareas programadas están en `plan/tareas.md`. Un solo MP4 por pieza en GitHub
(sin renders de prueba ni versiones alternas: el repo crece con cada video).

## Regla del cierre (pedida por JP, 9 nov 2026 — aplica a TODO video que lleve datos de mercado)
**Ningún video con precios, porcentajes del día o valor de mercado se termina ni se entrega antes del cierre de la sesión ordinaria
de Wall Street** (16:00 de Nueva York = 15:00 CDMX en invierno y 14:00 CDMX durante el horario de verano de EE.UU.; la BMV cierra a
la misma hora). Los datos son SIEMPRE los de cierre, lo más actualizados posible. JP publica a las 19:00, así que hay margen.
- Antes de escribir una cifra: `python3 scripts/market_close.py` (CERRADO = usa los datos; ABIERTO = todavía no; SIN SESIÓN = fin de
  semana o festivo: usa el último cierre y nombra ese día). `--wait` espera solo hasta 12 min después del cierre.
- **Si JP da una idea durante el día** ("hoy haz el de Nvidia"): se adelanta todo lo que no depende del cierre (investigación,
  fuentes, imágenes, guion con las cifras pendientes) y, al cerrar la bolsa, se bajan los datos finales, se ajusta el guion si el
  movimiento cambió (si ya no es cierto, se reescribe), se renderiza y **se entrega UNA sola vez, ya final**. Nada de versiones
  preliminares con datos intradía, salvo que JP las pida. En una sesión de chat: avísale que llega después del cierre y prográmalo
  (`send_later` a las 16:20 de Nueva York, o `market_close.py --wait` en segundo plano).
- Las tareas automáticas con datos del día corren a las **16:25 de Nueva York** (15:25 o 14:25 CDMX) y el video llega ~30 min después.
- No dependen del cierre: el largo (atemporal), su short derivado del miércoles y los shorts de sábado y domingo (no hay mercado: usan
  el cierre del viernes).

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
- **Voz de JP:** todo guion se escribe con el tono de `plan/voz-jp.md` (conversado, suyo, sin frases que suenen a IA). Léelo antes de redactar.
- No generar voz sin aprobación del guion (cuesta créditos de vidIQ: 14 por cada 1,000 caracteres; plan de 150/mes,
  se renueva el día 4 de cada mes).
- Datos siempre verificados; nunca recomendaciones de compra/venta.
- Para cambiar el estilo, editar `brand.json` / `engine.js` y probar con `videos/ejemplo-SE` (re-render sin gastar créditos:
  `build_timeline.py` → `make_audio.py` → `render.js`).
