---
name: historia
description: Crea una "Historia 3D" vertical (75–90 s, YouTube Shorts / Reels / TikTok) que cuenta la historia de una empresa o de su fundador con maquetas de plastilina animadas, personajes que actúan, luz de cine, música y efectos — estilo Costa Diorama de Costa Studio Finance, lista para que JP solo grabe su voz. Se hacen DOS por semana (miércoles y sábado). Úsala cuando digan "/historia", "haz la historia 3D de X", "video animado de Steve Jobs / Nike / Bimbo", "el video 3D de la semana", o cuando la tarea programada de los viernes lo pida.
argument-hint: "<empresa o personaje> [enfoque opcional]"
---

> **Voz de JP (obligatorio en todo guion):** antes de escribir, lee `finance-videos/plan/voz-jp.md` y redacta con ese tono. El guion no debe sonar a IA.


# /historia — historia 3D animada de una empresa o su fundador (Costa Studio Finance)

Proyecto: `finance-videos/` (todo se ejecuta desde ahí: `cd finance-videos`). Usuario: **Juan Pablo Armendáriz (@jparmendariz)**;
escríbele en español, corto y claro. **Costo cero:** nada de vidIQ ni servicios de pago; JP graba su voz encima (modo sin voz).
Lee antes: `plan/PLAN.md` (§0 marca y conflictos de interés, §2 ritmo), `plan/banco-historias.md`, `plan/publicados.md`,
`plan/clientes-agencia.md`, `plan/posiciones-jp.md`.

**Ritmo (cambio del 13 nov 2026, con los primeros datos reales): 2 historias por semana.** Es el formato con más alcance del canal (79% de
las vistas y el mejor gancho), así que se duplicó:
- **La del MIÉRCOLES 12:00** se produce el martes y cuenta la historia de la empresa o del personaje **del largo de ESE domingo**: es el
  puente a los largos. Sustituye al antiguo short adelanto. Usa el cierre del lunes para la escena "Hoy" (un día de desfase no importa
  en una historia).
- **La del SÁBADO 12:00** se produce el viernes, después del cierre, y sale del banco de historias.
**TODA historia manda a un largo:** en `youtube.md` deja indicado "Video relacionado" → el largo del tema más cercano y el comentario
fijado con la liga. Sin ese puente, el alcance de las historias no se convierte en horas de reproducción.

Las historias son la excepción a la regla de "mismo día" (junto con el largo): JP necesita un día para grabar su voz. La carpeta lleva
la **fecha de publicación**: `videos/<AAAA-MM-DD>-<SLUG>-historia/` (el miércoles o el sábado, según cuál sea). El sábado la historia es
la única pieza del día.
**Plantilla y modelo de estilo:** `videos/2026-11-14-JOBS-historia/` (Steve Jobs: `story.js`, `guion.md`, `youtube.md`). Cópiala y adáptala.

### ✅ Checklist (revisa TODO antes de entregar)
1. **Tema** del banco (o pedido por JP), sin repetir `publicados.md`; empresa que cotiza en bolsa o cerca de su IPO.
2. **Datos verificados** con fuente primaria, anotados en `guion.md`. Citas siempre atribuidas ("según Jobs…").
3. **Guion para leer despacio:** 8 escenas, 110–150 palabras, 75–90 s según `pace3d.py` (≈100 palabras/min con pausas).
4. **Primer cuadro = miniatura:** quién + el dato o la frase, visibles desde t = 0.
5. **Arriba limpio:** el 40% superior de cada escena es fondo liso o lleva `L.scrim`; titular legible; nada tapa el logo ni la ficha del año.
6. **Personajes vivos:** parpadean, hablan con el subtítulo (`talkAt`), caminan y gesticulan; animados a 12 cuadros/s (`on2`).
7. **Música + efectos por acción** (`sfx` en cada escena) → `make_audio.py`. Nunca entregar un video mudo. **Todas las historias llevan la
   partitura de órgano y piano** (la de SpaceX, elegida por JP el 11 nov 2026); `make_audio.py` la pone sola. Los shorts y largos usan otra.
8. **Sin logotipos reales** (los nombres van como texto) y **sin imágenes de IA de personas o marcas**: todo es maqueta 3D propia.
9. **Entrega:** MP4 con audio + título y descripción listos + guion para leer + `publicados.md` y `banco-historias.md` actualizados.

## 0. Preparar
```bash
bash scripts/setup.sh
S=AAAA-MM-DD                       # sábado de publicación
ID=$S-SLUG-historia                # ej. 2026-11-21-NIKE-historia
mkdir -p videos/$ID && cp videos/2026-11-14-JOBS-historia/story.js videos/$ID/story.js
```
Si ya existe `videos/$S-*-historia/*.mp4`, no hagas otra: reenvía esa.

## 1. Elegir el tema (sin preguntar, si JP no lo dio)
**Si es la historia del MIÉRCOLES, el tema NO se elige:** es la empresa o el personaje del largo de ese domingo (mira
`plan/calendario-largos.md`). Si el largo es educativo y no tiene empresa (por ejemplo "qué es una acción"), toma la empresa que ese largo
usa de ejemplo. Lo de abajo aplica a la historia del SÁBADO.

Toma una fila de `plan/banco-historias.md` que no esté en "Ya publicadas" ni en `publicados.md`. Prioridad:
1. **Engancha con la semana:** la empresa del largo del domingo (`plan/calendario-largos.md`), del short de empresa del fin de semana
   o de la noticia de la semana (así los videos se empujan entre sí).
2. **Arco claro:** caída y regreso, rival vencido, apuesta que casi quiebra a la empresa, invento por accidente. Sin arco no hay historia.
3. **Marca cotidiana** para la audiencia. Al menos 1 de cada 3 es de México o Latinoamérica.
Reglas duras:
- Solo empresas que **coticen en bolsa o estén cerca de su IPO**. Nada privado, startups ni cripto.
- **Personas reales:** caricatura respetuosa de figuras públicas, solo con hechos públicos y documentados de su vida profesional.
  Nada de vida privada, salud, escándalos personales ni acusaciones no probadas; nada que ridiculice. Si la persona está en medio de
  una polémica esta semana, elige otro tema.
- Si la empresa está en `clientes-agencia.md`: decláralo o elige otra. Si está en `posiciones-jp.md`: dilo en el cierre y la descripción.
- Nunca recomendaciones de compra/venta ni "va a subir".

## 2. Investigar y verificar
- WebSearch/WebFetch: fechas, cifras y frases con **fuente primaria** (informe anual, 10-K/8-K, comunicado de la empresa, prospecto,
  biografía autorizada o entrevista). Si solo hay fuentes secundarias para un dato, búscalo en dos y dilo con matiz, o quítalo.
- Cuida los verbos: "lo sacaron" ≠ "lo despidieron"; "casi quiebra" necesita una cifra o una cita atribuida.
- **Regla del cierre:** `python3 scripts/market_close.py` antes de bajar precios; si la bolsa sigue abierta, adelanta la maqueta y baja
  los datos de "Hoy" al cierre (`--wait`). La historia del sábado usa el cierre del viernes.
- Datos de hoy: `python3 scripts/fetch_data.py TICKER videos/$ID` (precio, valor de mercado, trimestres). Serie larga para la escena
  de la gráfica: `python3 scripts/fetch_series.py TICKER DESDE 1mo videos/$ID/serie.json` y pásala a `videos/$ID/series.js`
  (`export default [["AAAA-MM", cierre], ...]`). Si la gráfica abarca décadas, usa escala logarítmica y dilo en pantalla.
- Escribe `videos/$ID/guion.md`: concepto, narración por escena y tabla "Dato · Valor · Fuente" (modelo: el de Jobs).

## 3. Guion (8 escenas; 7–9 si la historia lo pide)
| # | Escena | Qué cuenta |
|---|--------|-----------|
| 1 | **Gancho** | Empieza por el momento más dramático (a media historia), con el protagonista y la frase que detiene el scroll |
| 2 | **Origen** | Dónde y cómo empezó, en chico (un garaje, un puesto, un préstamo) |
| 3 | **Conflicto** | Qué salió mal o quién se opuso |
| 4 | **Caída** | El punto más bajo, con UNA cifra |
| 5 | **Regreso / apuesta** | La decisión que lo cambió |
| 6 | **Giro** | Los productos o jugadas que funcionaron (máx. 3) |
| 7 | **Hoy** | El dato actual verificado + la gráfica real dentro de la maqueta |
| 8 | **Cierre** | Pregunta en dos partes + lema + aviso legal |

**Reglas de escritura (para que JP lea despacio y con aire):**
- Español de México, tuteo, frases cortas (≤ 14 palabras). 12–24 palabras por escena; **110–150 en total**.
- **La puntuación ES el ritmo:** cada coma da 0.3 s, cada punto 0.75 s y los "..." 0.8 s. Usa puntos para separar ideas y "..." antes
  del remate. Nunca una escena de una sola frase larga sin pausas.
- Números con dígitos ("1997", "1,000 millones", "53%"); máximo 2 cifras por escena (un número tarda mucho en decirse).
- Una idea por escena; lo que se ve en la maqueta es lo que se está diciendo en ese momento.
- El cierre es una pregunta abierta, nunca una conclusión de inversión.

## 4. La maqueta: `videos/$ID/story.js`
Motor: `engine3d/` (Three.js) = `lib.js` (base + capa editorial 2D) + `cine.js` (luz de cine, actores, plastilina) + `player.js`.
Todo es función del tiempo (determinista). Vista previa: abre `engine3d/index.html?v=../videos/$ID/story.js`.
```js
export default { id, title, tail: 1.2, worlds: { nombre(L) { …; return { ...w, cosas } } }, scenes: [ {
  id, world: 'nombre', d: 8,            // d = respaldo; los tiempos reales los pone pace3d.py
  year: '1997', ink: '#EBE6BA',         // ficha del año (hilo conductor) · ink claro en escenas oscuras
  cap: 'Texto que JP lee en esta escena.',
  sfx: [[.45, 'pop'], [.02, 'steps', .8, .6]],   // [fracción de la escena, efecto, volumen?, duración como fracción?]
  update(w, lt, t, L) { … },            // anima el mundo: lt = segundos dentro de la escena, t = tiempo global
  overlay(lt, t, L, s, w) { … } } ] };  // capa editorial: etiqueta, titular, contadores, L.tag(...)
```
Escenas seguidas con el mismo `world` = plano secuencia (no cortan); entre mundos distintos entra la transición de marea.
Dos escenas pueden compartir mundo (el escenario de Jobs sirve al giro y al cierre): cada `update` debe fijar TODO lo visible.

**Mundos con luz de cine** — `L.cineWorld({ bg, bg2, floor, fog, hemi, key, keyPos, keyCol, rim, rimPos, rimCol, fill })`:
| Ambiente | Receta |
|---|---|
| Día neutro (datos, gráficas) | `bg: '#EBE6BA', bg2: '#DCCF8E', floor: '#DCCF8E', key: 3, rim: 2.4` |
| Atardecer (despedidas, derrotas) | `bg: '#F0C9A4', bg2: '#E79C7A', keyPos: [-13, 8, 9], keyCol: '#FFD6A0', rim: 2.8, rimCol: '#FFB98A'` |
| Noche exterior | `bg: '#27376E', bg2: '#101A40', hemi: .34, key: 1, keyCol: '#A9BEFF'` + `L.stars()` + una luz cálida que se enciende |
| Interior cálido (garaje, taller) | noche exterior + `SpotLight('#FFC56E', 260, …)` desde el foco + `PointLight` de relleno al frente |
| Escenario | `bg: '#0D0E14', hemi: .1, key: 0, rim: 1.7, rimCol: '#8FB0FF'` + `SpotLight` sobre el protagonista + público en silueta |
Cámara: `cam(w, pos, objetivo)` cada cuadro (siempre con un movimiento lento: `mixv(a, b, L.eio(p))`) y `w.focusOn(objeto, dy)` +
`w.aperture` (.00016 suave → .0003 marcado) para el desenfoque. `w.vig` = viñeta (0–.6); `w.tint` = tinte.

**Encuadre vertical (lo más importante):** a 16 unidades de la cámara solo caben ~4.8 de ancho por 8.6 de alto. Un actor mide 2.74.
- El sujeto va en la mitad inferior; apunta la cámara 1–1.5 unidades por ARRIBA de su cabeza para dejar aire al titular.
- El 40% superior queda liso (cielo, pared) o con `L.scrim(L.C, 0, 800, .6–.9, 'r,g,b')` del color del fondo.
- Subtítulos en y≈1650 y columna derecha (x > 930) libre para los botones de Shorts.

**Actores** — `L.actor({ shirt, pants, shoes, hair, hairStyle: 'mop'|'side'|'short'|'bald', beard, glasses, collar: 'turtle'|'suit'|'tee', tie, bow, size, seed })`
y `L.pose(actor, { walk, amp, armL, armR, head, lid, brow, smile, talk, lean, bob, sweat })`. Brazos: `[levantar al frente, abrir al lado, doblar codo]` (rad).
- Siempre: `const q = L.on2(t)` y usa `q` para todo lo del personaje (12 cuadros/s, se siente stop-motion); la cámara usa `t`.
- Siempre: `lid: Math.max(base, L.blink(q, n))` (parpadeo) y, si habla, `talk: L.talkAt(L.CAPS, q)`.
- Caminar: `walk: q * 7.5` mientras se mueve (null al detenerse); los brazos que cargan algo llevan un 4.º valor `1` para no balancearse.
- El mismo personaje a distintas edades = mismo `seed`, otro pelo/ropa (ver `JOBS_76`, `JOBS_85`, `JOBS_97`, `JOBS_07`).
- Emoción con cejas, boca y cabeza (`brow: -1` triste … `1` decidido; `smile: -1 … 1`; `sweat: true`). Un gesto claro por escena.
- Etiqueta con nombre la primera vez que aparece alguien: `L.tag('Nombre · dato', actor, w.cam, k, 3.0)`.

**Utilería:** `L.rbox(w, h, d, radio, mat)` (cajas con cantos suaves), `L.clay2(color, rugosidad)` (plastilina con huellas),
`L.emit(color, i)` (pantallas, focos), `L.label3d('TEXTO', w, h, { bg, ink, font })` (letreros: nombres como texto, nunca logotipos),
`L.tree`, `L.stars`, `L.puffs`, `L.burst`, `L.globe`, `L.rocket`, `L.palm`. Aparecer con rebote: `L.pop(lt, t0, .5)`.
**Los datos viven en la maqueta:** la gráfica real como escalera, montaña o torre; contadores que corren (`Math.round(n * L.ex(k))`);
ventanas que se encienden; cajas que se caen. Cada número en pantalla sale de `guion.md`.
**Colores:** paleta Costa (arena, azul, terracota = baja, musgo = sube, mostaza = acento) + el color real de la marca solo en SUS objetos.
**Velocidad (el render es por CPU):** fusiona piezas pequeñas repetidas con `L.blobs` / `L.merged`; máx. ~8 actores por mundo;
reusa mundos (día/noche del mismo edificio); 3–5 mundos por historia; no uses `ao: true` (deja manchas negras en este servidor).

**Efectos de sonido** (`sfx`): `pop` (algo aparece), `whoosh` (movimiento), `door`, `thud` (golpe, caída), `steps` (pasos; ponle duración),
`vote` (golpe seco), `ticks` (contador; ponle duración), `coins`, `rise` (algo sale bien), `fall` (algo sale mal), `shine` (revelación),
`applause`, `wave`. Cada acción visible lleva su efecto, en la misma fracción de la escena en la que ocurre. 3–7 por escena, no más.

### Personajes: que no se vean raros (corrección de JP, 11 nov 2026)
- **Sin párpados (JP, 11 nov 2026):** ningún personaje lleva párpados; los ojos van siempre abiertos y la expresión se da con cejas y boca (`lid` ya no hace nada).
- **Sentados de verdad.** Los actores ya tienen rodillas: `L.pose(a, { sit: 1, bob: -.2 })` dobla cadera y rodilla. Todo el que esté en una
  junta, un escritorio o un auto va con `sit: 1` y una silla o asiento visible debajo (una caja redondeada basta). Nunca "de pie detrás de la mesa".
- **Opciones nuevas de `L.actor`:** `hairStyle: 'quiff'`, `eyeStyle: 'full'` (ojo con blanco, iris y pupila: úsalo en protagonistas y primeros
  planos), `neck: true`, `sleeves: 'short'`, `collar: 'crew' | 'polo' | 'hoodie'`, `cap`, `headphones`, `watch`, `browW`.
- **Manos y miradas con intención:** cada personaje mira a quien habla o a lo que pasa; nadie con los brazos colgando si la escena es tensa.
- **Mantener el claroscuro** que le gustó a JP: luz principal cálida de lado, contraluz que recorta la silueta, relleno bajo.
- **El protagonista de una historia es la persona real** (su caricatura con rasgos públicos), nunca un JP genérico en su lugar.
- **JP como narrador:** si la historia lo pide, el personaje del canal se puede meter con `L.actor({ ...L.JP, shirt: '#2A2A31', collar: 'crew' })` (rasgos en `engine3d/host.js`).
- Revisa en `qa.jpg` cada escena con gente: postura, que nadie atraviese muebles y que las caras se vean.

## 5. Ritmo, revisión, audio y render
```bash
python3 scripts/pace3d.py videos/$ID                 # tiempos al ritmo de JP → narration.txt, build/timing.js, build/timeline.json
node engine3d/render3d.js videos/$ID --qa            # hoja de revisión build/qa.jpg (2 cuadros por escena) + build/sfx.json
node engine3d/render3d.js videos/$ID --at 3.5 12     # cuadros sueltos a tamaño completo para revisar detalles
.venv/bin/python scripts/make_audio.py videos/$ID    # música + efectos → audio/mix.wav (modo sin voz)
node engine3d/render3d.js videos/$ID video --jobs 3  # → videos/$ID/$ID.mp4 con audio (≈45–60 min: lánzalo en segundo plano y sigue con youtube.md)
```
- `pace3d.py` debe dar **75–90 s** y 95–110 palabras/min. Si pasa de 95 s, recorta el guion (no aceleres el ritmo).
- **Mira `build/qa.jpg` y varios cuadros sueltos (Read)** antes de renderizar: texto encimado con la maqueta, personajes cortados
  por el borde, caras en sombra, objetos que flotan o atraviesan otros, escenas vacías, datos correctos. Corrige y repite.
- Si cambias un `cap`, vuelve a correr `pace3d.py` → `--qa` → `make_audio.py`.
- Al terminar: `ffprobe` (1080x1920, h264 + aac, duración) y revisa 3 cuadros del MP4. Copia `build/qa.jpg` a `cuadros_clave.jpg`.
- `--hq` renderiza el 3D al 100% con sombras más suaves (2.5x más lento): solo si JP lo pide.

## 6. Entregar
1. `videos/$ID/youtube.md` con **`## ✅ Para copiar y pegar`**: título (≤ 100 caracteres, el personaje o la empresa y el gancho en los
   primeros ~40, 2 hashtags) y descripción (1.ª línea con la historia y las palabras clave, "📌 Datos clave" en 4–6 viñetas, la
   pregunta del cierre, fuentes en una línea, "Animación original en 3D. Caricatura editorial; sin logotipos reales.", "Contenido
   educativo. No es asesoría financiera.", "Costa Studio Finance, by JP Armendáriz." y 3–5 hashtags con `#Shorts`). Debajo: 2 títulos
   alternativos, fuentes completas y "Al subir" (no es para niños; contenido alterado/sintético = No: es animación evidente y la voz
   es de JP; video relacionado = el largo o short de esa empresa; comentario fijado con la pregunta).
2. Envía el MP4 con SendUserFile (display render) y `cuadros_clave.jpg`. En el mensaje pega SIEMPRE: título, descripción y **el guion
   para leer** (`narration.txt`, una escena por párrafo). Recuérdale: "Graba tu voz con Voz en off en la app de YouTube, despacio,
   siguiendo los subtítulos, y publícalo el sábado a las 12:00".
3. Agrega la historia a `plan/publicados.md` (tabla "Programado") y a "Ya publicadas" de `plan/banco-historias.md`.
4. Commit + push a la rama actual (`story.js`, `series.js`, `guion.md`, `narration.txt`, `youtube.md`, `cuadros_clave.jpg`, el MP4;
   sin `build/` ni `.wav`). Si el push falla, no insistas: el video ya llegó por el chat; pega también `youtube.md` completo.

## Estilo (no cambiar sin que JP lo pida)
"Costa Diorama v2": maquetas de plastilina mate con huellas, luz de cine (principal cálida + contraluz + relleno), profundidad de
campo, personajes cabezones articulados a 12 cuadros/s, misma capa editorial de los shorts (logo, ficha del año, etiqueta, titular
en Unbounded, subtítulos-teleprompter, grano, transición de marea) y cierre con el lema "Desde la costa, todo se ve con claridad."
