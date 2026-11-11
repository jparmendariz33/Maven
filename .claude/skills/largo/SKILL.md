---
name: largo
description: Produce el video largo semanal (9–11 min, 16:9) de Costa Studio Finance, by JP Armendáriz, listo para que JP solo le ponga su voz — guion con datos verificados, storyboard, render 1920x1080 con teleprompter, miniatura, youtube.md y short derivado. Úsala cuando digan "/largo", "haz el video largo de la semana", "produce el video del domingo", o cuando la tarea programada de los lunes lo pida.
---

> **Voz de JP (obligatorio en todo guion):** antes de escribir, lee `finance-videos/plan/voz-jp.md` y redacta con ese tono. El guion no debe sonar a IA.


# /largo — video largo semanal (Costa Studio Finance)

Proyecto: `finance-videos/` (todo se ejecuta desde ahí: `cd finance-videos`). Usuario: **Juan Pablo Armendáriz (@jparmendariz)**;
escríbele en español, corto y claro. Lee antes: `plan/PLAN.md` (§0 marca y conflictos de interés, §4 formato, §6b monetización),
`plan/calendario-largos.md` y `plan/clientes-agencia.md`. **Costo cero:** no uses vidIQ ni servicios de pago.

## 0. Preparar
```bash
bash scripts/setup.sh
D=AAAA-MM-DD            # domingo de publicación (la semana del calendario)
mkdir -p largos/$D/data
```
Si `largos/$D/*_largo.mp4` ya existe, no lo rehagas.

## 1. Investigar y verificar (WebSearch; fuentes primarias cuando se pueda)
- Toma de `calendario-largos.md` la semana $D: título, búsqueda objetivo, gancho, capítulos, visuales, short derivado y datos a verificar.
- Cada número del guion sale de una fuente que anotas en `largos/$D/fuentes.md` (URL + dato). México: Banxico, INEGI, CONSAR, SAT, CNBV, BMV.
  Empresas: reportes en la SEC o de la empresa. Estudios (Behavioral Finance): el paper original o una fuente académica seria;
  nada de estudios retractados.
- Datos de mercado: `python3 scripts/fetch_data.py TICKER largos/$D/data` (empresa) y
  `python3 scripts/fetch_series.py SIMBOLO DESDE [1mo|1wk|1d] largos/$D/data/x.json` (series para gráficas: ^GSPC, ^IXIC, ^MXX, ^N225, MXN=X…).
  Si Yahoo responde 429, reintenta con espera creciente.
- Si la empresa del tema está en `clientes-agencia.md`, decláralo en el guion y la descripción (o avisa a JP).

## 2. Guion + storyboard (`largos/$D/storyboard.json`)
```json
{ "format": "long", "slug": "que-es-una-accion", "title": "…", "intro_title": "Introducción",
  "thumbnail": {"lines": ["¿QUÉ ES UNA", "ACCIÓN?"], "emphasis": "acción", "big": "×108", "big_sub": "Apple desde 2009", "big_tone": "up"},
  "scenes": [ {"type": "…", "say": "…", …} ] }
```
Ejemplo completo y probado: `largos/2026-11-15/storyboard.json` (úsalo como plantilla de ritmo y estilo).

**Estructura (PLAN §4):** gancho (≤30 s) → qué vas a aprender → **presentación de JP** (escena `personal`) → 4–5 capítulos (cada uno abre con
escena `chapter`) → error común / mito → resumen en 3 puntos (`list`) → `outro` con pregunta y el tema de la próxima semana.

**Reglas de escritura** (voz de JP): español de México, tuteo, frases cortas, tono sereno, números con dígitos ("26%", "10,000 dólares"),
decimales solo en pantalla. Una idea por pantalla: cada `say` ≤ 45 palabras (≈ 6–18 s). Total **1,150–1,400 palabras** (10–11.5 min al ritmo de lectura de JP, ~120 palabras/min).
Nunca recomendar comprar/vender; cerrar siempre con "contenido educativo, no asesoría financiera". Los `cue` son palabras del `say`
de esa misma escena (evita números como cue si puedes).

**Todo se lee tal cual (regla de JP):** el video se sube como está, con la voz de JP encima. Por eso NO hay pantallas de
"habla libre", indicaciones ni temporizadores: **cada escena lleva su texto completo en `say`** y lo que se ve en pantalla es parte del
video para la audiencia. Incluye siempre:
- Una escena `personal` de presentación al inicio, por ejemplo: "Soy JP Armendáriz y esto es Costa Studio Finance…" (varía la frase).
- Una escena `personal` a mitad del video con una **pregunta a la audiencia** ("Ahora piénsalo tú: …") que invite a comentar.
- **Nunca inventes datos personales de JP** (edad, experiencias, cuánto invierte, anécdotas). Usa solo lo que sabemos: su nombre, que
  hace Costa Studio Finance (división de finanzas de la agencia Costa Studio) y que comparte lo que aprende sobre inversiones.
- Protección contra la política de contenido no auténtico: su voz real, guiones originales y variedad de pantallas entre semanas.

### Tipos de escena (motor `engine/long.js`, 1920x1080)
Comunes: `kicker`, `title`, `subtitle`, `theme` ("blue" | "sand" | "white"), `say`, `cue*`.
- `hook` (azul): `title`, `value` (número o texto), `prefix`, `unit`, `decimals`, `signed`, `tone`, `caption`, `question`, `cue_value`, `cue_question`.
- `statement` (azul por defecto): `text`, `emphasis` (palabra(s) en serif mostaza), `sub`, `size`.
- `chapter` (azul): `number`, `title`, `sub`, `chapter_name` (texto del capítulo de YouTube).
- `personal` (azul): `kicker`, `title` (frase grande en serif), `sub`, `say` (texto completo que JP lee). Sin `adlib`.
- `bignum`: `label`, `value`, `prefix`, `suffix`, `decimals`, `signed`, `tone`, `sub`, `cue_value`, `cue_sub`.
- `list`: `items` [{`text`, `sub`, `tone`, `cue`}] (≤ 4 en una columna; 5–8 en dos).
- `compare`: `items` [{`label`, `value`, `sub`, `tone`, `highlight`, `cue`}] (2–3 tarjetas).
- `line`: `series` [{`name`, `points` [[fecha|etiqueta, valor]…], `tone`, `cue`}] o `use_price: true` (+ `sessions`) con data.json;
  `prefix`, `suffix`, `decimals`, `axis_decimals`, `zero`, `y_min`, `y_max`, `x_labels` (índices), `x_fmt: "raw"` (etiquetas tal cual),
  `annotations` [{`date` o `i`, `label`, `sub`, `tone`, `cue`, `dir` (-1 arriba, 1 abajo), `len`}] (máx. 3; prefiere `dir: -1`).
- `bars`: `items` [{`label`, `value`, `value2`, `tone`, `display`}] (+ `stack: true`, `legend` [a, b]) o trimestres de data.json
  (`quarters` para sobrescribir); `prefix`, `suffix`, `decimals`, `cue_bars`.
- **Regla de JP (11 nov 2026): siempre que el largo hable del estado de resultados, márgenes o cómo gana dinero una empresa, lleva una `cascade`** (de ingresos a utilidad neta; detalle en `/short` §1e).
- `cascade` (estado de resultados): `items` [{`label`, `value`, `kind`: "total"}]; el 1º es el total inicial, los demás restan salvo `kind: "total"`.
- `donut`: `slices` [{`label`, `value`, `tone`, `cue`, `display`}], `center`, `cue_donut`.
- `metric`: igual que en shorts (P/E, PEG, ROE con `scale` y bandas; ver skill /short).
- `quote` (azul): `text`, `author`, `source`.
- `formula`: `parts` [{`t`, `op`: true para ÷ = → ×, `tone`, `cue`}], `sub`, `cue_sub`.
- `timeline`: `events` [{`date`, `label`, `sub`, `tone`, `cue`}] (3–6).
- `table`: `headers`, `rows`, `highlight` (índice), `row_cues`.
- `news`: `bullets` [{`text`, `sub`, `tone`, `cue`}], `source`.
- `catalyst` (azul): `date`, `label`, `sub`, `cue_date`.
- `outro` (azul): `question_a`, `question_b`, `cue_a`, `cue_b`, `cta`, `sources`.
- `photo` (foto real): `image`, `layout` ("full" foto a pantalla completa con texto abajo · "split" texto a la izquierda y foto a la
  derecha · "logo" logo grande; los logos SIEMPRE en PNG transparente, se dibujan sin recuadro sobre el fondo — solo llevan
  ficha blanca si son tan claros que se perderían; `"logo_card": true` la fuerza), `kicker`, `title`, `caption`, `focus` [x, y], `cue_title`, `cue_caption`.
- `bg_image` (cualquier escena): foto de fondo en duotono del color del tema. `thumbnail.bg_image` también funciona.

### Imágenes reales (obligatorio: 10–20 por video)
Que hagan sentido con la historia: logos y tiendas de las empresas que mencionas, sedes, productos, personajes (Buffett,
Kahneman…), lugares históricos (Wall Street, la Bolsa Mexicana, Banxico), objetos (billetes, certificados de acciones).
Mismo proceso y reglas que en la skill `/short` §2b (`scripts/fetch_images.py`: `icon`, `logo`, `commons`, `search`/`pick`, `add`;
solo licencias libres o salas de prensa; nunca IA de marcas o personas reales; mira cada imagen antes de usarla).
- Úsalas para **romper la monotonía**: una escena `photo` cada 1–2 minutos (al abrir un capítulo o al presentar una empresa,
  persona o lugar) y `bg_image` en ganchos, citas y capítulos. No tapes gráficas con fotos.
- Créditos: en `youtube.md` pega la lista de `python3 scripts/fetch_images.py credits largos/$D` (y copia a `fuentes.md`).

```bash
python3 scripts/script_check.py largos/$D      # debe salir ✅ (palabras, capítulos, escenas ≤ 45 palabras)
```

**Calidad de las imágenes:** aplica la regla de `/short` §2b ("Calidad de las imágenes"): nítidas (≥ 1600 px), limpias, con el sujeto solo y sin ruido de fondo.

### JP en 3D en los largos (obligatorio desde el 11 nov 2026)
Misma regla que en los shorts (`/short` §2c): **recorte chico con fondo transparente, encima de la escena, reaccionando al texto, la foto o
la gráfica; nunca grande ni con fondo propio.** En un largo sale en **la primera escena, en 3 a 5 puntos intermedios (al abrir un capítulo o
frente a la gráfica o el dato más importante) y en el cierre.** No lo pongas en escenas seguidas ni en todas.
- En el storyboard: `"host": {"act": "senala", "mood": "up", "pos": "br"}` en la escena. Actos, ánimo, vestuario y `"who"` (personas
  famosas): los de `/short` §2c. Tamaño por defecto 380 px (de 1080 de alto); `pos` `br` | `bl` | `bc`; `"y"` para subirlo o bajarlo.
- Colócalo donde no tape el contenido: en `bignum`, `line`, `bars` y `table` el dato suele llegar hasta la derecha, así que usa `"pos": "bl"`,
  un `size` menor (300) o súbelo/bájalo con `"y"`. Revisa cada hoja de QA: JP nunca encima de una cifra.
- Flujo: `build_timeline.py` → `node engine3d/render_host.js largos/$D` → `render.js --qa`. Si cambian los tiempos, repite `render_host.js`.

## 3. Tiempos, revisión y render (sin voz; JP graba encima)
```bash
python3 scripts/no_voice.py largos/$D           # ritmo de lectura ~120 palabras/min, cuenta sílabas reales (números incluidos)
python3 scripts/build_timeline.py largos/$D     # sin cues "no encontrados"; revisa escenas <3.5 s o >16 s
node scripts/render.js largos/$D --qa           # build/qa_1.jpg … qa_N.jpg
```
**Mira TODAS las hojas** (Read): textos encimados o fuera de cuadro, etiquetas que chocan con ejes o con el teleprompter (y > 900),
escenas vacías, datos correctos. Corrige el storyboard y repite. Revisa 2–3 cuadros sueltos con `--at`.
```bash
node scripts/render.js largos/$D --thumb        # miniatura.jpg 1280x720 (revísala: texto grande, máx. 4 palabras)
.venv/bin/python scripts/make_audio.py largos/$D
node scripts/render.js largos/$D                # <slug>_largo.mp4 (≈15–20 min, en paralelo; córrelo en segundo plano)
```
Verifica con `ffprobe` (1920x1080, h264 + aac, duración 9.5–12.5 min) y mira 3 cuadros del MP4.

Si JP sube su audio (`largos/$D/audio/voice_raw.*`): quita `audio/NO_VOICE`, corre `.venv/bin/python scripts/process_voice.py largos/$D`
(nota: ajusta tempo solo si hace falta), `build_timeline.py`, `make_audio.py` y `render.js`: los visuales se sincronizan con su voz.


### Regla de los números y voz de IA
- Los tiempos sin voz se calculan por sílabas habladas: `no_voice.py` convierte números, %, $ y montos a palabras ("45" =
  "cuarenta y cinco"). Si una pantalla tiene muchas cifras, divídela: se dicen más lento de lo que miden.
- **Solo si JP pide voz de IA** (cuesta créditos de vidIQ; pide su OK con el costo exacto): `python3 scripts/tts_prep.py largos/$D <créditos>`
  → envía cada pieza de `tts_chunks.json` con la voz Daniel (`onwK4e9ZLuTAKqWW03F9`), primero la pieza 1 como prueba; revisa la
  pronunciación transcribiendo con whisper; guarda `audio/voice_part1.mp3`, `voice_part2.mp3`…; borra `audio/NO_VOICE`; corre
  `process_voice.py` (une piezas, sin acelerar), `build_timeline.py`, QA, `make_audio.py`, `render.js`. La voz de IA nunca dice
  "soy JP": usa "Bienvenido a Costa Studio Finance, de Jota Pe Armendáriz". En `youtube.md`: contenido alterado o sintético = **Sí**.

## 4. Entregables
1. `largos/$D/youtube.md`, empezando con **`## ✅ Para copiar y pegar`** (igual que los shorts): **Título** listo en un bloque de
   código (la búsqueda objetivo al inicio, ≤ 70 caracteres, sin hashtags en el título del largo) y **Descripción** lista en otro bloque
   (en el mensaje a JP pega SIEMPRE ambos bloques); debajo, 2 títulos alternativos. La descripción lleva: (2–3 líneas con la promesa,
   **capítulos** de `capitulos.txt`, fuentes con URL, créditos de imágenes, "Contenido educativo. No es asesoría financiera.",
   "Costa Studio Finance, by JP Armendáriz, es la división de finanzas de Costa Studio.", 3–5 hashtags), lista de reproducción del
   pilar, comentario fijado (la pregunta del outro), pantalla final (video sugerido del mismo pilar) y el **guion para leer** completo
   (`python3 scripts/guion_lectura.py largos/$D`).
2. **Short derivado** (miércoles; lo produce la tarea del MIÉRCOLES, no la del lunes): `videos/<miércoles>-<SLUG>/` con la skill `/short` en modo sin voz (30–50 s, la idea más poderosa,
   sin ticker si es educativo: storyboard con `"slug"`, `hook` (con `kicker` y `title` propios), `statement`, `catalyst` ("DOM <día>" · video completo) y `outro`; ejemplo: `videos/2026-11-11-APPLE/`. El `outro` lleva
   "Video completo el domingo en el canal"). En su `youtube.md`, recuerda enlazar el largo con "Video relacionado".
3. Commit + push a la rama `costa-studio-finance` (sin `build/`, `images/_cand/` ni .wav). Si el push falla, entrega igual: MP4 y miniatura
   por el chat (SendUserFile) y el contenido de `youtube.md` pegado en el mensaje.
4. Mensaje a JP: tema, duración, **el título y la descripción completos listos para copiar** (los bloques de "Para copiar y pegar"), rutas (MP4, miniatura, short) y recordatorio:
   "Graba tu voz con CapCut (importa el MP4 → Audio → Grabar → lee el teleprompter de principio a fin) y prográmalo
   para el domingo 10:00. El short derivado, el miércoles 19:00 con 'Video relacionado' → este largo."
