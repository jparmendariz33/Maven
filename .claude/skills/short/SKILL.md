---
name: short
description: Crea un video vertical de ~1.5 min (70–95 s) (YouTube Shorts / Reels / TikTok) con el análisis de una acción, en el estilo de marca Costa Studio, con voz en off en español, subtítulos y música. Úsala cuando el usuario diga "/short AAPL", "hazme el short de Tesla", "analiza la acción de X en video", etc.
argument-hint: "<TICKER o nombre de la empresa> [enfoque opcional]"
---

# /short — análisis de una acción en video (estilo Costa Studio)

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
Guarda las fuentes (URLs) para `youtube.md`.

## 2. Guion + storyboard → MOSTRAR AL USUARIO ANTES DE GASTAR CRÉDITOS
Escribe `videos/$ID/storyboard.json` (esquema abajo). Luego:
```bash
python3 scripts/script_check.py videos/$ID
```
Debe salir ✅: **800–1000 caracteres** (≈75–92 s y 14 créditos; pasar de 1000 cuesta el doble). Si sale ❌, ajusta y repite.
Ritmo pausado: el usuario prefiere ~1.5 min con aire entre frases, no prisa (la voz va a tempo natural 1.00x).

Muéstrale al usuario el guion (la narración por escena) y un resumen de las escenas, y **pide su OK**. No generes la voz
sin su aprobación (cuesta créditos de vidIQ). Si pide cambios, edita y vuelve a correr `script_check.py`.

### Estructura recomendada (8–10 escenas, una idea por pantalla)
| # | type | Qué cuenta | ~seg |
|---|------|-----------|------|
| 1 | `hook` | El dato que detiene el scroll (el % de la caída/subida) + pregunta | 5–7 |
| 2 | `company` | Qué hace la empresa en 1 línea + valor de mercado | 7–9 |
| 3 | `price` | Cómo le fue en 12 meses (2–3 anotaciones) | 8–10 |
| 4 | `zoom` y/o `news` | El movimiento reciente y su porqué (con contexto: ¿ya venía cayendo?) | 12–18 |
| 5 | `bars` | Ingresos y utilidad neta por trimestre, con su porqué | 8–10 |
| 6–8 | `metric` ×3 | P/E, PEG, ROE (uno por pantalla, con su regla) | 7–8 c/u |
| 9 | `catalyst` | Próximos resultados (fecha + qué vigilar) | 5–6 |
| 10 | `outro` | Pregunta final en dos partes | 4–5 |
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
Ejemplo completo: `finance-videos/videos/ejemplo-SE/storyboard.json`.

## 3. Voz (después del OK)
1. Carga las herramientas: `ToolSearch` con `select:mcp__vidIQ__vidiq_balance,mcp__vidIQ__vidiq_voiceover_generate,mcp__vidIQ__vidiq_job_poll`.
2. `vidiq_balance` → dile al usuario cuántos créditos tiene y que este video usará 14.
3. `vidiq_voiceover_generate` con `script` = contenido exacto de `videos/$ID/narration.txt` y
   `voiceId` = `onwK4e9ZLuTAKqWW03F9` (Daniel – Steady Broadcaster; está en `assets/brand/brand.json`).
4. `vidiq_job_poll` hasta `completed` (tarda ~1–2 min; entre sondeos haz otra cosa o usa Monitor, no `sleep`).
5. Descarga: `curl -sS -o videos/$ID/audio/voice_raw.mp3 "<audioUrl>"` (crea la carpeta `audio`).
Si vidIQ no está conectado o no hay créditos, avísale al usuario y detente (no inventes otra voz sin preguntar).

## 4. Sincronizar, revisar y renderizar
```bash
.venv/bin/python scripts/process_voice.py videos/$ID     # recorta pausas, tempo, normaliza, tiempos por palabra
python3 scripts/build_timeline.py videos/$ID             # escenas y cues en segundos, subtítulos
node scripts/render.js videos/$ID --qa                   # hoja de revisión → videos/$ID/build/qa.jpg
```
- `build_timeline.py` debe reportar alineación ≥ 60% y sin cues "no encontrados" (si hay, cambia el cue y repite).
- **Mira `build/qa.jpg`** (Read). Revisa: textos que se salen o se enciman, etiquetas que chocan, escenas vacías,
  datos correctos. Corrige el storyboard (no hace falta regenerar la voz si no cambias el `say`) y repite.
- Duración final entre 70 y 95 s (ideal ~90 s).
```bash
.venv/bin/python scripts/make_audio.py videos/$ID        # voz + música + efectos → audio/mix.wav
node scripts/render.js videos/$ID                        # → videos/$ID/TICKER_short.mp4 (~3 min, en segundo plano)
```
Verifica con `ffprobe` (1080x1920, h264 + aac, duración) y revisa 2–3 cuadros del MP4 final.

## 5. Entregar
1. Escribe `videos/$ID/youtube.md`: 3 títulos (≤100 caracteres, el gancho en los primeros ~40, con 2–3 hashtags),
   descripción con datos clave, fuentes reales, "Contenido educativo. No es asesoría financiera." y hashtags;
   recuerda marcar "No es para niños" y "contenido alterado/sintético: voz de IA".
2. Envía el MP4 con SendUserFile (display render) y dale al usuario el título recomendado.
3. Commit y push de `finance-videos/videos/$ID/` (storyboard, data, narration, voice_raw.mp3, mp4, youtube.md) a la rama actual.

## Estilo (no cambiar sin que el usuario lo pida)
Definido en `finance-videos/assets/brand/brand.json` y `engine/engine.js`: paleta Costa (arena #EBE6BA, azul costa #4173D1,
terracota #BB6F58 = baja, musgo #7E8C54 = sube, mostaza #C7A317 = acento, negro #0A0A0A); tipografías libres
Unbounded (títulos y números), Space Grotesk (texto), Instrument Serif itálica (acentos); transiciones de "marea",
grano de película, una idea por pantalla. Contenido fuera de la columna derecha (x > 930) donde están los botones de Shorts,
y subtítulos en y≈1650.
