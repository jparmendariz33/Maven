---
name: short
description: Crea un short vertical (YouTube Shorts / Reels / TikTok) con el análisis de una acción o de una empresa "caliente" (modo empresa), con fotos reales (logo, sucursales, productos), en el estilo de marca Costa Studio Finance, subtítulos-teleprompter y música. Úsala cuando el usuario diga "/short AAPL", "hazme el short de Tesla", "analiza la empresa X", "short de empresa", etc.
argument-hint: "<TICKER o nombre de la empresa> [enfoque opcional]"
---

# /short — análisis de una acción o empresa en video (Costa Studio Finance)

Dos modos, mismo motor, misma duración (~65–75 s sin voz) y misma marca:
- **Reactivo** (lun, mar, jue): qué pasó hoy con una acción o índice (ver `plan/PLAN.md` §2).
- **Empresa** (vie, sáb, dom): "Análisis + Potencial" de una empresa (sección 1b); el sábado, "Tesis a 5 años" de `plan/banco-tesis.md`. `"mode": "empresa"` en el storyboard.
**Todos los shorts llevan imágenes reales** que hagan sentido con la historia (sección 2b).
**Fecha (regla de oro de JP):** un short por día, hecho el MISMO día en que se publica (19:00 CDMX). La carpeta lleva la fecha de
publicación; "hoy" y "ayer" se cuentan desde ese día (en fin de semana di "el viernes…"). Nunca produzcas shorts de días futuros
(el adelanto del miércoles lo hace la tarea del miércoles). Antes de elegir tema, revisa `plan/publicados.md` para no repetir, y al
terminar agrega el short ahí. `narration.txt` = los `say` del storyboard, uno por párrafo (regenéralo si cambias el guion).
**Modelo de estilo:** `videos/2026-11-07-ABNB/` (el favorito de JP).

Proyecto: `finance-videos/` en la raíz del repo. Todo se ejecuta desde ahí:
`cd finance-videos` (rutas abajo relativas a esa carpeta).

El usuario es **Juan Pablo Armendáriz (@jparmendariz)**. Escríbele en español, corto y claro.

## 0. Preparar la sesión (siempre, ~1 min)
```bash
bash scripts/setup.sh
```
Crea `.venv` (numpy + faster-whisper). ffmpeg y Playwright ya vienen en el contenedor.

## 1. Datos (sin preguntar)
Si el usuario dio un nombre y no un ticker, deduce el ticker (Apple → AAPL; Sea Limited → SE).
```bash
ID=$(date +%F)-TICKER            # ej. 2026-11-07-AAPL
python3 scripts/fetch_data.py TICKER videos/$ID
```
Lee `videos/$ID/summary.md`. Incluye precio, cambios (1d, 15 sesiones, 1m, 3m, 1a, YTD), P/E, P/E forward, PEG, ROE,
márgenes, crecimiento, trimestres (ingresos / utilidad neta / EPS), próximos resultados, los movimientos diarios más grandes
de las últimas 60 sesiones (con volumen vs promedio) y titulares semilla.

**Investiga y verifica** con WebSearch (modo standard; extended si hace falta):
- Qué explica el movimiento reciente: cruza las fechas de `biggest_moves_60s` con noticias. No atribuyas una caída a un evento
  si el precio ya venía cayendo antes (dilo con matiz).
- El trimestre más reciente: Yahoo a veces no trae el último trimestre publicado. Si falta, búscalo (comunicado de la empresa)
  y pásalo en la escena `bars` con `"quarters": [...]`.
- Fecha confirmada del próximo reporte.
- **Si la empresa acaba de reportar, Yahoo trae P/E, ROE y EPS de los 4 trimestres ANTERIORES** (desactualizados). Recalcula:
  P/E = precio ÷ suma del EPS diluido de los últimos 4 trimestres (incluido el nuevo). Ejemplo ABNB 6 nov 2026: Yahoo 42.6x,
  real 35x. Si no puedes recalcular una métrica con fuente primaria, usa otra (p. ej. margen neto del trimestre, del 8-K).
Guarda las fuentes (URLs) para `youtube.md`.

## 1b. Modo empresa (viernes, sábado y domingo)
**Cómo elegir la empresa** (tómala tú, sin preguntar; revisa `plan/banco-empresas.md` y `videos/` para no repetir):
1. **Está en las noticias de la semana**: resultados que sorprendieron, adquisición, IPO, expansión, lanzamiento, polémica,
   cambio de CEO, récord, o es tendencia en redes. **Solo empresas que ya coticen en bolsa o que estén cerca de su IPO**
   (fecha anunciada o S-1/F-1/prospecto presentado). Nunca privadas sin IPO en puerta, startups ni cripto. Si es pre-IPO: sin
   `fetch_data.py`; cifras del prospecto, valor/ventas con el rango de precio en lugar de P/E, y di claro que aún no cotiza. EE.UU., México
   (BMV: tickers de Yahoo con `.MX`, p. ej. `WALMEX.MX`, `FEMSAUBD.MX`, `GSANBORB-1.MX`) o del mundo (ADR o bolsa local).
2. **Marca cotidiana** que tu audiencia conoce o usa (tiendas, apps, comida, autos, viajes, ropa, tecnología, bancos).
3. **La gente la busca**: autocompletado gratuito de YouTube
   `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=es&gl=MX&q=<empresa>`.
4. Variedad: al menos 1 de cada 3 shorts de empresa es mexicana; no repetir una empresa de los últimos 30 días ni una de los
   shorts reactivos de esa semana; nunca una de `plan/clientes-agencia.md` sin declararlo.
Anota la empresa elegida en la tabla "Ya publicadas" de `plan/banco-empresas.md`.

**Formato "Análisis + Potencial" (desde el 8 nov 2026, pedido por JP): mitad análisis de la empresa, mitad su potencial de
inversión a largo plazo.** Las dos mitades se complementan: la primera explica qué es, por qué está en boca de todos y cómo van sus
números; la segunda, por qué podría (o no) valer más en 5 años. 12 escenas, ~145–155 palabras ≈ 75–85 s. Ejemplo: `videos/2026-11-08-CUERVO/`.

| # | type | Mitad | Qué cuenta |
|---|------|-------|-----------|
| 1 | `hook` + `bg_image` | Análisis | El dato que detiene el scroll + pregunta ("¿Tiene futuro?", "¿Por qué?") |
| 2 | `company` + `logo` | Análisis | Qué hace en 1 línea, valor de mercado y un dato de escala |
| 3 | `photo` | Análisis | El modelo de negocio: cómo gana dinero |
| 4 | `news` + `image` | Análisis | Por qué está en boca de todos ahora (fecha y fuente) |
| 5 | `bars` | Análisis | Ingresos y utilidad neta por trimestre (con el trimestre nuevo) |
| 6 | `metric` | Análisis | ¿Está cara? P/E (o valor/ventas si pierde dinero o es pre-IPO) |
| 7 | `statement` | Potencial | Puente + el motor de crecimiento en una frase (kicker "El potencial · a 5 años") |
| 8 | `photo` o `metric` | Potencial | El dato del motor: mercado por conquistar, crecimiento, expansión (verificado) |
| 9 | `news` (kicker "Su ventaja") | Potencial | 2 razones por las que es difícil de copiar (marca, red, escala, licencias, costos) |
| 10 | `news` (kicker "Lo que podría salir mal") | Potencial | 2 riesgos reales, con el MISMO peso que lo bueno (tono `down`) |
| 11 | `catalyst` | Potencial | Qué vigilar: el próximo dato que confirma o rompe la tesis |
| 12 | `outro` + `disclosure` | — | Pregunta en dos partes ("¿Motor para 5 años… o ya está en el precio?") |

**La parte de potencial NO es recomendación:** se presenta como "la tesis optimista y lo que podría salir mal", nunca "cómprala",
"va a subir" ni precios objetivo propios. Si JP tiene acciones de la empresa (`plan/posiciones-jp.md`), el outro lleva
`"disclosure": "JP tiene acciones de <empresa>"` y la descripción lo dice; si la tabla está vacía, no se afirma nada.
**Sábado = "Tesis a 5 años":** la empresa sale de `plan/banco-tesis.md` (empresas con potencial de largo plazo, como Grab o ASUR),
aunque no esté en las noticias; el "por qué ahora" es su dato más reciente (resultados, máximo, expansión). Viernes y domingo:
la empresa caliente de la semana, de preferencia una con una historia de largo plazo creíble.

**Colores de la empresa (regla de JP, 8 nov 2026): el color de la empresa = los DATOS de la empresa; los fondos son los
institucionales de Costa, salvo el gancho y el cierre.** Pon en el storyboard `"brand_colors": {"primary": "#XXXXXX", "name": "Rojo Cuervo"}` (el color
principal de la marca, verificado en su logo, etiqueta o sitio oficial) y el motor lo aplica solo en todas las escenas: en fondo
arena, el nombre, las cifras, las barras de ingresos, el valor de cada métrica, la gráfica del precio, la ficha principal y las
viñetas sin tono van en el color de la empresa; en fondo azul (`hook`, `catalyst`) el nombre, la cifra del gancho y la fecha van
sobre un "marcatextos" del color exacto de la empresa (texto blanco o negro según contraste). **Excepción: el GANCHO (`hook`)
y el CIERRE (`outro`) llevan DE FONDO el color de la empresa** (oscurecido lo justo para que el texto arena se lea): el video abre
y cierra con la marca. Sube/baja en viñetas y notas siguen en musgo/terracota; frases y subtítulos, en paleta Costa.
`"brand": false` apaga el color en una escena; `"brand_bg": true/false` pone o quita el fondo de marca en una escena azul.
Si la marca es negra, blanca o gris (sin un color distintivo), no uses `brand_colors`. Revisa en `qa.jpg` que todo se lea.

## 2b. Imágenes reales (obligatorio en TODOS los shorts: 3–5 por video)
Que hagan sentido con la historia: logo de la marca, sucursales/tiendas, productos, sede, la app, el CEO, la fábrica…
Solo fotos REALES con licencia libre o de la sala de prensa oficial. **Nunca imágenes generadas con IA de una marca o persona real.**
```bash
python3 scripts/fetch_images.py icon videos/$ID logo airbnb             # logo (simple-icons, rápido); si no existe el slug:
python3 scripts/fetch_images.py logo videos/$ID logo "Archivo_logo.svg"  # logo desde Wikimedia Commons
python3 scripts/fetch_images.py search videos/$ID "costco warehouse"     # Openverse (si responde): mira images/_cand/sheet.jpg y…
python3 scripts/fetch_images.py pick videos/$ID 3 tienda                 # …elige la #3
python3 scripts/fetch_images.py commons videos/$ID sede "Nombre del archivo.jpg" --credit "Foto: Autor · CC BY-SA 4.0 · Wikimedia Commons"
python3 scripts/fetch_images.py add videos/$ID fachada "https://…" --credit "Foto: Empresa (sala de prensa)"
```
- Para `commons`: busca nombres con WebFetch en `https://commons.wikimedia.org/wiki/Category:<Empresa>` (y subcategorías: CEO,
  tiendas, productos) y lee autor y licencia en la página `File:…` del archivo. Solo CC0, dominio público, CC BY o CC BY-SA.
- Wikimedia limita las descargas desde la nube (429): el script reintenta solo, con paciencia (hasta ~3 min por foto).
  **Si Wikimedia sigue en 429, busca en Flickr** (`search … --source flickr`): baja al instante y también tiene licencias libres
  (CC BY / BY-SA / CC0). En el pie de foto y en youtube.md escribe una descripción limpia, no el título original de Flickr.
  Lanza las descargas en segundo plano y sigue con el guion. Si una no baja, usa otra fuente o quita esa imagen.
- **Mira cada imagen antes de usarla** (Read): que de verdad sea esa marca/lugar/persona, sin texto que confunda, nítida.
- Las fotos horizontales se ven completas (con fondo desenfocado); las verticales llenan la pantalla. `focus` [x, y] (0–1)
  elige qué parte se ve al recortar (p. ej. la cara: `[0.5, 0.25]`).

**Campos de imagen** (las rutas son relativas a la carpeta del video):
- `bg_image` (cualquier escena): foto de fondo en duotono con el color del tema; el texto sigue legible. Ideal en `hook`.
- `photo` (escena nueva): `image`, `layout` ("full" por defecto · "card" tarjeta sobre arena · "logo" logo grande en ficha blanca),
  `kicker`, `title`, `caption`, `focus`, `fit: "cover"` (forzar pantalla completa), `cue_title`, `cue_caption`.
- `company.logo`: ficha blanca con el logo a la derecha del nombre.
- `news.image` (+ `focus`): foto en tarjeta arriba del titular (con imagen: máx. 2 bullets).
El pie de foto (autor · licencia) sale solo en pantalla. En `youtube.md` pega la lista de `python3 scripts/fetch_images.py credits videos/$ID`.

## 2. Guion + storyboard → MOSTRAR AL USUARIO ANTES DE GASTAR CRÉDITOS
Escribe `videos/$ID/storyboard.json` (esquema abajo). Luego:
```bash
python3 scripts/script_check.py videos/$ID
```
Debe salir ✅: **650–950 caracteres** (≈45–60 s y 14 créditos). Si sale ❌, ajusta y repite.

Muéstrale al usuario el guion (la narración por escena) y un resumen de las escenas, y **pide su OK**. No generes la voz
sin su aprobación (cuesta créditos de vidIQ). Si pide cambios, edita y vuelve a correr `script_check.py`.

### Estructura recomendada (8–10 escenas, una idea por pantalla)
| # | type | Qué cuenta | ~seg |
|---|------|-----------|------|
| 1 | `hook` | El dato que detiene el scroll (el % de la caída/subida) + pregunta | 4–6 |
| 2 | `company` | Qué hace la empresa en 1 línea + valor de mercado | 4–5 |
| 3 | `price` | Cómo le fue en 12 meses (2–3 anotaciones) | 6–8 |
| 4 | `zoom` y/o `news` | El movimiento reciente y su porqué | 6–10 |
| 5 | `bars` | Ingresos y utilidad neta por trimestre | 5–7 |
| 6–8 | `metric` ×3 | P/E, PEG, ROE (uno por pantalla, con su regla) | 4–5 c/u |
| 9 | `catalyst` | Próximos resultados (fecha) | 3–4 |
| 10 | `outro` | Pregunta final en dos partes | 3–4 |
Si no hubo un movimiento fuerte reciente, omite `zoom` y usa `news` con el tema más relevante. Usa `statement` para
frases-puente cortas ("Pero en octubre, todo cambió.").

### Reglas de escritura (voz Daniel)
- Español de México, frases cortas, tono claro y sereno (no sensacionalista). Tutea.
- **Números con dígitos**: "25%", "156 dólares", "9%". Evita decimales al hablar ("casi 30 veces", no "29.64").
  En pantalla sí usa el dato exacto.
- Cada `say` es lo que se narra durante esa escena. Todo el guion = los `say` en orden.
- Los `cue` son **una palabra (o dos) que aparece en el `say` de esa misma escena**: el elemento aparece justo cuando se dice.
  Elige palabras distintivas (no "de", "la"). Evita usar números como cue (whisper los escribe distinto).
- Explica cada métrica en palabras simples:
  - **P/E**: "pagas X dólares por cada dólar que gana la empresa". Regla: `[[0,15,"Barata"],[15,30,"Justa"],[30,60,"Cara"]]`,
    `ref` S&P 500 (verifica el P/E actual del S&P 500; ~22–25x).
  - **PEG** = P/E ÷ crecimiento: "menos de 1 suele verse barato". Regla `[[0,1,"Barata"],[1,2,"Justa"],[2,4,"Cara"]]`.
  - **ROE**: "por cada 100 dólares del accionista, genera X de utilidad". Regla con tonos invertidos:
    `[[0,10,"Bajo","down"],[10,20,"Bueno","accent"],[20,60,"Excelente","up"]]`. Si el ROE es >100% (p. ej. Apple), explica
    que es por recompras que reducen el capital contable.
- Marca: el cierre usa automáticamente el tagline "Desde la costa, todo se ve con claridad." y el CTA.
- Nunca des recomendación de compra/venta. Cierra con pregunta abierta.

### Esquema de `storyboard.json`
```json
{ "ticker": "AAPL", "title": "tema del video", "scenes": [ {"type": "...", "say": "...", ...} ] }
```
Campos por tipo (todos opcionales salvo `type` y `say`; `theme` puede forzar `"blue"`, `"sand"` o `"white"`):
- Nivel raíz: `brand_colors` {"primary": "#hex", "name"} (colores de la empresa, §1b; se aplica solo). En una escena: `"brand": false` lo apaga.
- `outro`: `disclosure` (opcional, "JP tiene acciones de X").
- `hook` (azul): `kicker` ("NASDAQ · AAPL"), `title`, `value` (número, ej. -24.1), `decimals`, `unit` ("%"), `prefix`,
  `signed` (true = "+"), `tone` ("down"|"up"), `caption`, `question`, `cue_value`, `cue_question`.
- `statement` (azul): `text`, `emphasis` (palabra en serif mostaza), `kicker`, `sub`, `size`.
- `company`: `name`, `line`, `chips` (["iPhone", ...] o [{"label","cue"}]), `stats` ([{"label","value","tone","cue"}], máx 3).
- `price` (usa la serie de 12 meses): `kicker`, `title` (def. "De $X a $Y"), `subtitle`,
  `annotations` [{"date":"YYYY-MM-DD","label","sub","tone","cue","dir":-1|1}] (máx 3), `chips` [{"label","value","tone","cue"}] (máx 3).
- `zoom` (últimas N sesiones con volumen): `sessions` (15), `title`, `events` [{"date","label","sub","tone","cue"}] (máx 2).
- `news`: `kicker` ("20 OCT · EL DETONANTE"), `headline`, `bullets` [{"text","sub","cue","tone"}] (máx 3), `source`.
- `bars`: `count` (6), `quarters` (opcional, sobreescribe los de Yahoo: [{"period":"2026-09-30","revenue":..., "net_income":...}]),
  `cue_revenue`, `cue_net`, `note` (ej. "+16% ingresos a/a"), `note_sub`, `note_tone`, `cue_note`.
- `metric`: `kicker` ("Valuación · 1/3"), `label` ("P/E"), `fullname`, `value`, `decimals`, `prefix`, `suffix` ("x", "%"),
  `explain`, `scale` {"min","max","bands":[[a,b,"texto","tono?"]],"ref":{"value","label"}}, `verdict`, `verdict_tone`,
  `cue_value`, `cue_explain`, `cue_gauge`.
- `catalyst` (azul): `kicker`, `date` ("28 ENE"), `label`, `sub`, `cue_date`.
- `outro` (azul): `question_a`, `question_b`, `cue_a`, `cue_b`, `cta` (opcional), `sources` ("Yahoo Finance · Reuters").
- `photo`, `bg_image`, `company.logo`, `news.image`: ver sección 2b.
Ejemplos completos: `finance-videos/videos/ejemplo-SE/storyboard.json` (reactivo) y `finance-videos/videos/2026-11-06-ABNB/storyboard.json` (empresa, con imágenes).

## 3. Voz (después del OK)
**Modo predeterminado desde nov 2026: SIN VOZ.** Juan Pablo graba su propia voz en la app de YouTube Shorts leyendo los
subtítulos (funcionan como teleprompter). En ese caso NO uses vidIQ; en lugar de los pasos 1–5 y de `process_voice.py`:
```bash
python3 scripts/no_voice.py videos/$ID        # ritmo de lectura de JP (~120 palabras/min, cuenta sílabas reales)
```
y sigue en la sección 4 desde `build_timeline.py` (sin voz apunta a 100–125 palabras ≈ 55–70 s; máximo 90 s).
`make_audio.py` detecta `audio/NO_VOICE` y deja solo música baja + efectos. Usa voz de IA solo si él lo pide.

Con voz de IA (solo si la pide):
1. Carga las herramientas: `ToolSearch` con `select:mcp__vidIQ__vidiq_balance,mcp__vidIQ__vidiq_voiceover_generate,mcp__vidIQ__vidiq_job_poll`.
2. `vidiq_balance` → dile al usuario cuántos créditos tiene y que este video usará 14.
3. `vidiq_voiceover_generate` con `script` = contenido exacto de `videos/$ID/narration.txt` y
   `voiceId` = `onwK4e9ZLuTAKqWW03F9` (Daniel – Steady Broadcaster; está en `assets/brand/brand.json`).
4. `vidiq_job_poll` hasta `completed` (tarda ~1–2 min; entre sondeos haz otra cosa o usa Monitor, no `sleep`).
5. Descarga: `curl -sS -o videos/$ID/audio/voice_raw.mp3 "<audioUrl>"` (crea la carpeta `audio`).
Si vidIQ no está conectado o no hay créditos, avísale al usuario y detente (no inventes otra voz sin preguntar).


**Regla de los números:** los tiempos se calculan por sílabas habladas (los números se convierten a palabras: "45" =
"cuarenta y cinco"). Lo hace `no_voice.py`; para voz de IA usa `python3 scripts/tts_prep.py videos/$ID <créditos>` y envía
el texto de `tts_chunks.json` (números ya en palabras), no `narration.txt`. Ver "Regla de los números" en `finance-videos/CLAUDE.md`.

## 4. Sincronizar, revisar y renderizar
```bash
.venv/bin/python scripts/process_voice.py videos/$ID     # recorta pausas, tempo, normaliza, tiempos por palabra
python3 scripts/build_timeline.py videos/$ID             # escenas y cues en segundos, subtítulos
node scripts/render.js videos/$ID --qa                   # hoja de revisión → videos/$ID/build/qa.jpg
```
- `build_timeline.py` debe reportar alineación ≥ 60% y sin cues "no encontrados" (si hay, cambia el cue y repite).
- **Mira `build/qa.jpg`** (Read). Revisa: textos que se salen o se enciman, etiquetas que chocan, escenas vacías,
  datos correctos. Corrige el storyboard (no hace falta regenerar la voz si no cambias el `say`) y repite.
- Duración final entre 45 y 60 s.
```bash
.venv/bin/python scripts/make_audio.py videos/$ID        # voz + música + efectos → audio/mix.wav
node scripts/render.js videos/$ID                        # → videos/$ID/TICKER_short.mp4 (~2 min, en segundo plano)
```
Verifica con `ffprobe` (1080x1920, h264 + aac, duración) y revisa 2–3 cuadros del MP4 final.

## 5. Entregar
1. Escribe `videos/$ID/youtube.md` empezando con la sección **`## ✅ Para copiar y pegar`** (modelo: `videos/2026-11-07-ABNB/youtube.md`):
   - **Título** listo, en un bloque de código: ≤ 100 caracteres (ideal 60–80), la empresa o el tema y el gancho en los primeros
     ~40, **2 hashtags al final** (la empresa + `#acciones`/`#inversiones`/`#bolsa`). Indica cuántos caracteres lleva.
   - **Descripción** lista, en otro bloque de código, corta para el celular: 1.ª línea con la noticia y las palabras clave
     (es lo que se ve sin abrir), "📌 Datos clave" en 4–6 viñetas, la pregunta del outro, fuentes en una línea, **créditos de las
     imágenes** en una línea (autor + licencia), "Contenido educativo. No es asesoría financiera.", "Costa Studio Finance, by JP
     Armendáriz." y al final **3–5 hashtags** (los 3 primeros salen arriba del título; nunca más de 15 porque YouTube los ignora
     todos): empresa, ticker, tema y `#Shorts`. Si la empresa es cliente de la agencia, decláralo (ver `plan/PLAN.md` §0).
   - Debajo: 2 títulos alternativos, "Fuentes completas (enlaces)" y "Al subir" (no es para niños; contenido alterado/sintético
     = No si la voz es de JP, Sí si es voz de IA; video relacionado; comentario fijado).
2. Envía el MP4 con SendUserFile (display render). En el mensaje a JP **SIEMPRE** pega, listos para copiar: **el título, la
   descripción completa** (los dos bloques de "Para copiar y pegar") y **el guion para leer** (el contenido de `narration.txt`, una
   escena por párrafo), porque él graba su voz leyéndolo y sube el video desde el celular.
3. Commit y push de `finance-videos/videos/$ID/` (storyboard, data, narration, images/ sin `_cand/`, voice_raw.mp3, mp4, youtube.md)
   a la rama actual. **Si el push falla** (p. ej. 403 porque la sesión no tiene el repo), no te detengas: el MP4 ya se envió por el
   chat; pega también el contenido completo de `youtube.md` en el mensaje final para que JP pueda publicar igual.

## Estilo (no cambiar sin que el usuario lo pida)
Marca: **Costa Studio Finance** (división de finanzas de la agencia Costa Studio). `brand.json` → `division: "FINANCE"` dibuja
la firma logo + FINANCE + "by JP Armendáriz · @jparmendariz" en cada pantalla y "COSTA STUDIO FINANCE · BY JP ARMENDÁRIZ" en el
cierre. Todo esto es automático (sale de `brand.json`); no hay que pedirlo. Al entregar, pega siempre el guion para leer en el chat.
Definido en `finance-videos/assets/brand/brand.json` y `engine/engine.js`: paleta Costa (arena #EBE6BA, azul costa #4173D1,
terracota #BB6F58 = baja, musgo #7E8C54 = sube, mostaza #C7A317 = acento, negro #0A0A0A); tipografías libres
Unbounded (títulos y números), Space Grotesk (texto), Instrument Serif itálica (acentos); transiciones de "marea",
grano de película, una idea por pantalla. Contenido fuera de la columna derecha (x > 930) donde están los botones de Shorts,
y subtítulos en y≈1650.
