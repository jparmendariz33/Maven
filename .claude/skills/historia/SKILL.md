---
name: historia
description: Crea una "Historia 3D" vertical (75–90 s, YouTube Shorts / Reels / TikTok) que cuenta la historia de una empresa o de su fundador con maquetas de plastilina animadas, personajes que actúan, luz de cine, música y efectos — estilo Costa Diorama de Costa Studio Finance, con voz de IA ya puesta, lista para publicar. Se hacen DOS por semana (martes y jueves 12:00); la del jueves anuncia el largo del domingo. Úsala cuando digan "/historia", "haz la historia 3D de X", "video animado de Steve Jobs / Nike / Bimbo", "el video 3D de la semana", o cuando la tarea programada lo pida.
argument-hint: "<empresa o personaje> [enfoque opcional]"
---
> # ⚠️ LEE ESTO PRIMERO: `finance-videos/plan/anatomia-formatos.md`
> Ahí está **qué debe llevar** cada pieza. Este skill es **cómo** se hace. No empieces sin leerlo.
>
> **El gancho decide todo, y está medido (20 nov 2026).** SpaceX retuvo al **86.5%** y Nubank al **5.9%** con la misma
> cantidad de impresiones del feed (1,164 vs 1,158): el gancho fue la única diferencia. La de Kahneman sacó 20.8%
> abriendo con "En 1979, dos psicólogos publicaron un artículo": eso es contexto, no gancho.
> **Los primeros 3 segundos son tres capas juntas desde el cuadro 1** — la narración (la primera frase hablada ES el
> gancho, sin rampa, con la cifra en las primeras 8 palabras), el texto en pantalla, y la música con cuerpo.
> **Meta: ≥49% de stayed-to-watch. Objetivo: 70%.** Se mide cada lunes con vidIQ.
> **Voz de JP (obligatorio en todo guion):** antes de escribir, lee `finance-videos/plan/voz-jp.md` y redacta con ese tono. El guion no debe sonar a IA.


# /historia — historia 3D animada de una empresa o su fundador (Costa Studio Finance)

Proyecto: `finance-videos/` (todo se ejecuta desde ahí: `cd finance-videos`). Usuario: **Juan Pablo Armendáriz (@jparmendariz)**;
escríbele en español, corto y claro. **Voz:** las historias llevan **voz de IA** (Francisco, vidIQ) desde el 17 nov 2026, en UNA
sola toma. Cuesta 28 créditos si el texto hablado queda bajo 1,000 caracteres: mídelo antes de enviarlo.
Lee antes: `plan/PLAN.md` (§0 marca y conflictos de interés, §2 ritmo), `plan/banco-historias.md`, `plan/publicados.md`,
`plan/clientes-agencia.md`, `plan/posiciones-jp.md`.

**Ritmo (calendario del 20 nov 2026): 2 historias por semana, martes y jueves 12:00.** Es el formato con más alcance del canal:
- **La del JUEVES 12:00** se produce el miércoles y cuenta la historia de la empresa o del personaje **del largo de ESE domingo**: es
  el puente. Lleva una escena de aviso con el pizarrón ("ESTE DOMINGO 10:00" + el título del largo) antes de la pregunta de cierre.
  **Si esa historia promete el largo en pantalla, el largo deja de ser negociable.**
- **La del MARTES 12:00** se produce el lunes y sale del banco de historias.
**TODA historia manda a un largo:** en `youtube.md` deja indicado "Video relacionado" → el largo del tema más cercano y el comentario
fijado con la liga. Sin ese puente, el alcance de las historias no se convierte en horas de reproducción.

**Regla del borrador anticipado:** la historia es atemporal, así que el guion, el storyboard y las capturas se adelantan en cuanto se
sabe el tema. Lo único que se ejecuta el día que toca es generar la voz y renderizar, ya con todo aprobado. La carpeta lleva la
**fecha de publicación**: `videos/<AAAA-MM-DD>-<SLUG>-historia/`.
**Plantilla y modelo de estilo:** `videos/2026-11-14-JOBS-historia/` (Steve Jobs: `story.js`, `guion.md`, `youtube.md`). Cópiala y adáptala.

### ✅ Checklist (revisa TODO antes de entregar)
1. **Tema** del banco (o pedido por JP), sin repetir `publicados.md`; empresa que cotiza en bolsa o cerca de su IPO.
2. **Datos verificados** con fuente primaria, anotados en `guion.md`. Citas siempre atribuidas ("según Jobs…").
3. **Guion:** 8–10 escenas, 120–160 palabras, 60–90 s según `voz3d.py`. El texto hablado, bajo 1,000 caracteres.
4. **Gancho de 3 segundos, tres capas** (narración + texto + música). Meta ≥49% de stayed-to-watch.
4b. **Miniatura propia** con el frame del gancho: si no la subes, YouTube escoge un frame de en medio.
5. **Arriba limpio:** el 40% superior de cada escena es fondo liso o lleva `L.scrim`; titular legible; nada tapa el logo ni la ficha del año.
6. **En cada escena PASA algo** (regla del dinamismo, JP 19 nov): el personaje actúa —camina, gira, voltea a ver lo que importa,
   señala, se le caen los hombros— Y un objeto cambia de estado **por una causa**. Una escena donde solo se mueve la cámara está mal.
6b. **Cada escena cambia de mundo o de situación.** Dos seguidas en el mismo sitio y con la misma acción son una sola escena larga.
6c. **Transiciones:** la ola solo entre mundos distintos. Dentro del mismo mundo va `trans: 'cont'` con las cámaras encadenadas
   (cada escena arranca donde terminó la anterior) y los objetos se encogen para salir, no desaparecen de golpe.
7. **Música + efectos por acción** (`sfx` en cada escena) → `make_audio.py`. Nunca entregar un video mudo. **Todas las historias llevan la
   partitura de órgano y piano** (la de SpaceX, elegida por JP el 11 nov 2026); `make_audio.py` la pone sola. Los shorts y largos usan otra.
8. **Sin logotipos reales** (los nombres van como texto) y **sin imágenes de IA de personas o marcas**: todo es maqueta 3D propia.
9. **Cierre:** la **pregunta** en serif itálica centrada + "Desde la costa, todo se ve con claridad." + aviso legal. Si es la historia
   puente, antes va la escena del pizarrón con el aviso del largo.
10. **Aprobación:** capturas a JP y su OK **ANTES** de generar voz y renderizar. Una corrección vista en una captura cuesta cero.
11. **Entrega:** MP4 con audio + título y descripción + `publicados.md` y `banco-historias.md` actualizados.

## 0. Preparar
```bash
bash scripts/setup.sh
S=AAAA-MM-DD                       # martes o jueves de publicación
ID=$S-SLUG-historia                # ej. 2026-11-21-NIKE-historia
mkdir -p videos/$ID && cp videos/2026-11-14-JOBS-historia/story.js videos/$ID/story.js
```
Si ya existe `videos/$S-*-historia/*.mp4`, no hagas otra: reenvía esa.
**Modelo con todo lo nuevo aplicado:** `videos/2026-11-21-KAHNEMAN-historia/` (10 escenas, voz de IA, gráficas con `L.plaque`,
plano continuo al final, pizarrón de aviso y pregunta de cierre).

## 1. Elegir el tema (sin preguntar, si JP no lo dio)
**Si es la historia del JUEVES, el tema NO se elige:** es la empresa o el personaje del largo de ese domingo (mira
`plan/calendario-largos.md`). Si el largo es educativo y no tiene empresa (por ejemplo "qué es una acción"), toma la empresa que ese largo
usa de ejemplo. Lo de abajo aplica a la historia del MARTES.

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
  los datos de "Hoy" al cierre (`--wait`). **Comprueba la fecha en hora de México, no la del contenedor**, que corre en UTC.
- **Noticias:** fuente primaria + al menos dos fuentes independientes del mismo día, las tres citadas. **Un número que no se puede
  verificar no se publica** (en el debut de Anthropic se omitió el valor de mercado porque las fuentes iban de 1.3 a 2 billones).
- **Conflicto de interés:** cualquier relación entre quien escribe y la empresa analizada se declara, y JP decide.
- Datos de hoy: `python3 scripts/fetch_data.py TICKER videos/$ID` (precio, valor de mercado, trimestres). Serie larga para la escena
  de la gráfica: `python3 scripts/fetch_series.py TICKER DESDE 1mo videos/$ID/serie.json` y pásala a `videos/$ID/series.js`
  (`export default [["AAAA-MM", cierre], ...]`). Si la gráfica abarca décadas, usa escala logarítmica y dilo en pantalla.
- Escribe `videos/$ID/guion.md`: concepto, narración por escena y tabla "Dato · Valor · Fuente" (modelo: el de Jobs).

### Antes del gancho: busca los titulares (JP, 20 nov 2026)
**Obligatorio en toda pieza sobre una noticia, ANTES de escribir la primera frase.** Busca en español y en inglés
(El Financiero y CNN en Español pesan más para nuestro público que CNBC). Anota tres listas:
- **Lo que dijeron TODOS** → con eso se ABRE. Si el espectador no reconoce la historia en 3 segundos, desliza.
- **Lo que dijo CASI NADIE** → ese es el cuerpo y la razón para quedarse.
- **Las cifras en las que los medios NO coinciden** → alerta roja: se verifican con fuente primaria o se omiten.
**La fórmula: lo que ya oyeron + el giro que no.** Y si engancha con algo que el canal ya publicó, mejor.
Los titulares eligen el ÁNGULO; los números siguen saliendo de la fuente primaria. Un titular nunca es la fuente de
una cifra.

## 3. Guion (8 escenas; 7–9 si la historia lo pide)
| # | Escena | Qué cuenta |
|---|--------|-----------|
| 1 | **Gancho (3 s)** | La frase que detiene el scroll, dicha Y escrita Y con música desde el cuadro 1. Algo conocido + contradicción o cifra con escala. **Nunca contexto ni presentación** |
| 2 | **Origen** | Dónde y cómo empezó, en chico (un garaje, un puesto, un préstamo) |
| 3 | **Conflicto** | Qué salió mal o quién se opuso |
| 4 | **Caída** | El punto más bajo, con UNA cifra |
| 5 | **Regreso / apuesta** | La decisión que lo cambió |
| 6 | **Giro** | Los productos o jugadas que funcionaron (máx. 3) |
| 7 | **Hoy** | El dato actual verificado + la gráfica real dentro de la maqueta |
| 8 | **Aviso** (solo la del jueves) | Pizarrón "ESTE DOMINGO 10:00" + el título del largo, y el personaje lo señala |
| 9 | **Cierre** | La pregunta en serif itálica centrada + "Desde la costa, todo se ve con claridad." + aviso legal |

**Reglas de escritura (para que JP lea despacio y con aire):**
- Español de México, tuteo, frases cortas (≤ 14 palabras). 12–24 palabras por escena; **120–160 en total**.
- **Que lo entienda cualquiera sin saber de finanzas.** Si una frase pide deducir algo, está mal: nada de palabras cultas
  ("póstumo" → "no se le da a quien ya murió") ni metáforas que haya que descifrar ("una calculadora en la cabeza").
- **La imagen dice lo mismo que la frase, al mismo tiempo.** Si hay que explicar la escena, la escena está mal.
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

### ⚠️ PRIMERO LA HISTORIA, DESPUÉS LA TÉCNICA (JP, 20 nov 2026)
JP lo dijo viendo que en un solo día le metí ocho técnicas a este skill: *"cada video va a ser distinto… no es que
tengas que meter todo en todos los videos, sino agarrar lo que más te sirva para cierto tipo de videos."*
**El orden no se invierte nunca:**
1. Escribes la historia que quieres contar, en prosa, sin pensar en recursos.
2. Preguntas **qué tipo de historia es**.
3. Eliges **UN motor narrativo** de los cinco de abajo, y **dices por qué** en el borrador que le mandas a JP.
4. Los recursos de "la base" van en todos. De los demás, **máximo dos**, y solo si la historia los pide.

**Una historia a la que hay que meterle un recurso para que funcione no está bien contada.** Si el guion en prosa
no se sostiene leído en voz alta, ningún contador lo salva.

| Si la historia es… | El motor | Por qué | Lo que NO va |
|---|---|---|---|
| **una cantidad que crece o se encoge** hasta volverse absurda | **El contador** | el espectador se queda para ver hasta dónde llega el número | no le pongas "construido desde cero": la cadena de problemas compite con el número |
| **cómo funciona algo** que todos usan y nadie sabe por qué es así | **Construido desde cero** | cada problema obliga a inventar la siguiente pieza, y el título se contesta al final | sin contador: aquí no hay una cifra protagonista |
| **un hecho humano que necesita contexto** para pesar | **El alejamiento** | la cámara sale de la persona al cuarto, del cuarto a la ciudad: el dato se siente, no se explica | sin recuadro esquema: romperías el único efecto que tiene |
| **un error que mucha gente comete** | **Lo peor que puedes hacer** | te acusa en el gancho y luego te da el protocolo | ojo con el límite: protocolo de CONDUCTA, nunca de asignación |
| **un titular que casi todos creen** y la cuenta dice otra cosa | **El desmontaje** | abres con lo que ya oyeron y lo desarmas pieza por pieza | no necesita contador ni cadena: necesita UNA imagen de la diferencia |

**El alejamiento** (el que JP describió así: *"tomas de una persona, pero luego alejas la toma y luego la vuelves a
alejar a la ciudad"*): la misma cosa vista a tres escalas, encadenadas sin corte (`trans: 'cont'`), con la persona
clavada en el mismo punto de la pantalla mientras el mundo crece alrededor. Sirve cuando el dato es grande y
abstracto y hay que volverlo humano — o al revés, cuando es íntimo y hay que enseñar que le pasa a millones.
Se distingue del **contador** en que aquí no hay un número subiendo: lo que cambia es **a qué distancia estás**.

### ─────── LA BASE: esto va en TODOS los videos ───────

### Gramática de plano: la cámara cambia de tamaño, no solo de sitio (JP, 20 nov 2026)
JP vio un short de @SoySR.J y dijo: "todas las tomas son a la misma altura de la persona, la toma no cambia, mantiene
el mismo tamaño la persona". **Lo medí en la historia de Kahneman y tenía razón exacta:**

| | Kahneman, 10 escenas |
|---|---|
| Ángulo de cámara | entre **−1.9° y +7.8°** — las diez |
| Distancia al sujeto | 9.4 a 21.6 (mediana 15.2) |
| El personaje ocupa | **20–33% del alto del cuadro**, siempre |
| Primeros planos · detalles · picados · contrapicados | **cero** |

Siete mundos distintos con su color y su luz, y aun así se siente estático, porque **son diez variaciones del mismo
plano medio a la altura de los ojos**. Nunca se ve una cara de cerca, nunca se ve un objeto de cerca.

**La regla: en una historia de 8–10 escenas tiene que haber al menos un plano de cada familia, y dos escenas
seguidas nunca comparten tamaño de plano.** La cámara es narración: el tamaño del plano dice qué sientes.

El motor tiene `fov = 30°`, así que **`media_altura = tan(15°) × distancia = 0.268 × distancia`** y
`media_anchura = media_altura × 0.5625`. Un personaje de pie mide **2.85 unidades** (pies en y=0, cabeza en y≈2.12,
coronilla en 2.85). De ahí sale la tabla, que es la que hay que usar:

| Plano | Distancia | El sujeto ocupa | Para qué sirve | Altura de cámara |
|---|---|---|---|---|
| **General** | ~21 | 25% | situar el lugar; la primera vez que se ve un mundo | 4–7 |
| **Entero** | ~10 | 55% | el personaje actúa con todo el cuerpo (camina, se encoge) | 2.5–3.5 |
| **Americano** (rodillas arriba) | ~5.2 | 75% | dos personajes conversando | 2.2–2.8 |
| **Medio** (cintura arriba) | ~4.4 | 78% | la frase importante, cuando hay que ver el gesto | 2.0–2.4 |
| **Primer plano** (la cara) | ~3.7 | 70% | el golpe emocional. UNO por historia, no más | 2.0–2.3 |
| **Detalle** (objeto de ~0.5) | ~1.6 | 60% | la moneda, la medalla, la carta, la mano | la del objeto |

Y los ángulos, que son lo que de verdad cambia el tono:
- **Nivel de ojos** (cámara y ≈ 2.1, ángulo ~0°) — neutro. Es el único que usamos hoy. Está bien para conversar.
- **Contrapicado** (cámara y 0.6–1.2, mirando ARRIBA) — el sujeto se agranda. Para el Nobel, el logro, la autoridad.
- **Picado** (cámara y 6–9, mirando ABAJO) — el sujeto se empequeñece. Para la pérdida, el error, sentirse chico
  frente al mercado.
- **Cenital** (cámara justo encima, mirando recto abajo) — convierte la escena en un esquema. Para las cartas de la
  apuesta, un tablero, un portafolio sobre una mesa.

Tres cosas que hay que cuidar al usar esto:
- **Un primer plano con `fov` 30 a distancia 3.7 deforma poco**, pero si te acercas más de 3 la nariz crece. Para
  acercarte más, baja el `fov` (teleobjetivo) en vez de meter la cámara: `w.cam.fov = 18; w.cam.updateProjectionMatrix()`.
- **En plano cerrado el fondo se ve vacío.** Mete algo a media distancia (el pizarrón, una lámpara, otra persona
  desenfocada) o el plano se lee como un error.
- Sigue vigente que para **BAJAR** algo en el cuadro el `lookAt` va **ARRIBA** del objeto, y la zona segura del
  vertical es y_px 800–1650.

### Mundos que se construyen, no fondos pintados (JP, 20 nov 2026)
Lo otro que JP señaló del short de referencia: ahí la ciudad **se va construyendo** mientras habla la voz. Nuestros
siete mundos de Kahneman son **piso + pared al fondo** con distinto color: cambian de paleta, no de arquitectura.
- Un mundo necesita **tres profundidades**: algo pegado a cámara (de refilón, desenfocado), el sujeto, y algo al
  fondo. Con una sola capa el 3D se ve plano y da igual que sea 3D.
- **Que el mundo haga algo durante la escena**: los edificios suben del suelo uno a uno, la mesa se llena, la gente
  entra, la luz pasa de día a noche. No tiene que ser caro: `scale.y` de 0 a 1 escalonado con un retraso por objeto
  ya da la sensación de que se construye.
- Un mundo nuevo entra con la ola (`L.tide()`); dentro del mismo mundo va `trans: 'cont'` con las cámaras encadenadas.

### El rótulo que se revela, y la consecuencia que se ve (JP, 20 nov 2026)
Del short de @DesarmadoYoutube (206 mil likes, el más visto de los que trajo JP):
- **Remate en dos tiempos.** Entra `lo peor:` solo; ~0.3 s después cae debajo, **en el color de acento**, `pisar a
  fondo`. No es un subtítulo, es un reveal. `head()` dibuja el título completo de golpe y en el momento del golpe eso
  se desperdicia. **Una o dos veces por video** —gancho y remate—, nunca en todas las escenas o deja de pegar.
- **La consecuencia se ve.** Dice "el que termina abrazado a un poste eres tú" **y el coche choca**: estrellas,
  parabrisas roto, la equis. Si el guion nombra una consecuencia mala, la maqueta la enseña pasando.
- **Lo que NO copiamos:** el aspecto (plano, pocos polígonos, de noche). El nuestro es plastilina mate con luz de
  cine y ya es reconocible. Parecernos a alguien es tirar lo único que es nuestro.

### Anotar encima de la maqueta: las cuatro herramientas (JP, 20 nov 2026)
Del video completo de @DesarmadoYoutube (206 mil likes). **Es lo más aprovechable de todo lo que trajo JP**, porque
resuelve algo que a nosotros nos cuesta: explicar un mecanismo sin que la voz tenga que describirlo.

1. **Trayectoria dibujada.** Una línea luminosa encima del 3D marca el recorrido: **verde lima el del protagonista,
   rojo el de la amenaza**. Se entiende sin una palabra. En finanzas: el camino de un peso entre cuentas, la línea
   de un precio, lo que entra contra lo que sale.
2. **Etiqueta que APUNTA.** Píldoras (`placa`, `modelo`, `color`) con una línea punteada hasta la parte exacta del
   coche que nombran. Esto mejora nuestra regla del rótulo: hoy ponemos "Brasil · 120 M de clientes" en el titular;
   es mejor una píldora señalando **la cosa**. Para las partes de un estado de resultados, de un recibo, de una
   gráfica, es justo lo que falta.
3. **Anillo de foco.** Un círculo o elipse alrededor de lo que importa en ese segundo (la cabeza del conductor para
   "manos libres", el coche entero para "por dónde vas"). Barato y dirige la mirada.
4. **Recuadro esquema, abajo a la izquierda.** Un cuadrito con borde blanco y fondo oscuro donde el mismo concepto
   se dibuja **abstracto**: las tres vueltas a la derecha como un cuadrado punteado con los puntos 1, 2 y 3. La
   maqueta enseña la cosa real; el recuadro enseña la regla. Las dos a la vez, y por eso se entiende a la primera.
   Es la herramienta que más nos sirve para un mecanismo financiero.

**Y la regla que las amarra: el color de la palabra es el color del objeto.** En ese video la palabra resaltada del
rótulo va en verde lima, el mismo verde lima de la trayectoria, de las píldoras y del anillo. La palabra y la cosa
quedan ligadas sin explicarlo. Nosotros ya tenemos el mostaza de la palabra activa: **que el acento del rótulo y el
color de lo que se anota en la escena sean el mismo, siempre.**

### El arco de luz (20 nov 2026)
Ese video entero pasa de noche, oscuro, y termina en una gasolinera **iluminada y con gente**. La luz carga la
emoción: oscuro es el problema, claro es la salida. No hace falta copiar la paleta nocturna —la nuestra es
plastilina cálida— pero sí el arco: **si la historia tiene un problema y una salida, el mundo del problema va más
oscuro que el de la salida**, y el cambio se ve.

### Números que ilustran: la marca `ilustrativo` (20 nov 2026)
En ese short el velocímetro sube a 150 y lleva pegado, chiquito, `km/h · ilustrativo`. **Todo número proyectado,
simulado o de ejemplo lleva esa palabra en la ficha, en pantalla, no en la descripción.** Si el supuesto cabe en una
palabra, se nombra: `supone 10% anual · ilustrativo`. Un número real NUNCA la lleva: ahí va la fuente, y si la marca
se pone en todo deja de distinguir nada. Nos aplica en cuanto hagamos el interés compuesto: "$1,000 al 10%" no es un
dato, es un supuesto nuestro. Y no legitima proyectar el precio de una acción: eso sigue prohibido.

### ─────── LOS CINCO MOTORES: escoge UNO ───────
Uno por video, y el borrador dice cuál y por qué. Ver la tabla del selector, arriba.

**Los cinco motores no son una jaula (JP, 20 nov 2026).** Salieron de seis videos de dos canales: es poca muestra.
Cuando una historia no quepa en ninguno, **se le inventa el motor a esa historia y se anota aquí con su nombre**, en
vez de forzarla al que menos mal le quede. JP: *"si hay alguna otra forma para ese video, pues adelante, crear una
nueva vía."* Lo que no cambia nunca es la estructura de la casa: el gancho de 3 segundos en tres capas, que se
entienda sin saber nada, la gramática de plano, el cierre con pregunta y los límites editoriales.

### "Construido desde cero": el formato que deriva el mecanismo (JP, 20 nov 2026)
El segundo video de @DesarmadoYoutube (227 mil likes): *"Ese techo del estadio NO tiene ni una columna"*. **No
explica un estadio: lo construye delante de ti, y cada problema nuevo obliga a inventar la siguiente pieza.**

> cancha + gente alrededor → *pero solo la primera fila ve* → cada fila un escalón → *pero las esquinas quedan
> vacías y los de las orillas ven de lado* → doblas las tribunas hasta cerrar el anillo → *pero llueve y 70,000
> personas se mojan* → techo sobre columnas → *pero a alguien le toca ver detrás de un poste* → quitas las columnas
> de enfrente y lo cuelgas. **Y ahí está el título contestado.**

**Cómo se escribe:** cada frase es **un problema o su arreglo**, encadenados con *pero* y *así que*. Nada más. No hay
presentación, no hay recapitulación, no hay "y eso es todo": si una frase no plantea un problema ni lo resuelve,
sobra. Son 116 palabras para nueve pasos.
**El título promete el final y el video lo entrega en la última frase.** El gancho no es una cifra: es una
imposibilidad ("un techo sin columnas"), y te quedas a ver cómo se resuelve.

**Para qué nos sirve:** es el formato natural de casi todo lo que enseñamos, y no lo teníamos.
`¿Por qué existe la bolsa?` → tienes un negocio y te falta dinero → *pides prestado, pero hay que devolverlo vaya
bien o mal* → vendes un pedazo → *pero quien te lo compró va a querer salir algún día* → hace falta dónde
revenderlo → **eso es la bolsa**. Más candidatos en `plan/banco-historias.md`.

**Tropicalizado a Costa Studio** — qué cambia y qué se queda:
- **Los colores son los nuestros, con significado fijo:** el problema en **terracota `#BB6F58`**, la pieza que lo
  resuelve en **mostaza `#C7A317`**, lo neutro en arena y negro. Ellos usan rojo y verde lima; el papel es el mismo
  y ya tenemos esos dos colores en la marca. **La palabra del rótulo va del color de lo que se señala en la escena.**
- **La pieza nueva se resalta en mostaza en cuanto aparece** (ellos pintan el anillo del techo de lima encima del
  3D), y se apaga al color normal en la escena siguiente, cuando ya es parte del mundo.
- **Plano cenital y plano en 3D se alternan a propósito:** el cenital es **la regla** (la geometría, por qué las
  esquinas quedan vacías), el 3D es **cómo se siente** (ver el partido de lado). Cada vez que toca una regla,
  cenital; cada vez que toca una consecuencia, 3D a la altura de la gente.
- **El entorno mete el siguiente problema:** empieza a llover y por eso hace falta el techo. No lo anuncia la voz,
  lo anuncia el mundo. En nuestras maquetas: que se nuble, que entre gente, que se haga de noche.
- **Dos tipos de recuadro:** el cuadrado con esquema abstracto (ya anotado) y la **lupa circular**, que amplía un
  detalle de la estructura sin salir de la escena. La lupa es para un detalle físico; el cuadrado, para una regla.
- **Lo que NO copiamos:** su aspecto (ilustración plana, cielo azul de plantilla, monigotes de palo). El nuestro es
  plastilina mate con luz de cine. Copiamos el método, no la cara.

**Una advertencia de reloj:** este formato mete nueve pasos en 45 segundos porque va a **203 palabras/min**. A las
145 nuestras no cabe la cadena: o se queda en cuatro pasos y pierde la gracia, o se acelera la voz. **Es el formato
que más depende de que JP decida la velocidad** (ver la nota pendiente en la regla de la voz de IA).

### Formato "lo peor que puedes hacer" (20 nov 2026)
El short de las 206 mil likes abre así: *"Si un coche te sigue de noche, lo peor que puedes hacer es…"*. Condición
que le puede pasar a cualquiera + un error que quizá estés cometiendo. Engancha porque te acusa.
En finanzas es terreno seguro y nuestro: **un error que evitar no es una recomendación de compra ni de venta**, así
que esquiva la regla que nos cierra la puerta en casi todo lo demás. **La estructura real, viendo el video completo:** no son solo errores. Son **dos errores (máximo) y luego un
PROTOCOLO numerado de qué sí hacer**, y el protocolo es el 70% del video: comprueba → da la vuelta a una glorieta →
pon los seguros y llama al 911 → di placa, color y modelo → maneja normal a una estación de policía → si no hay, a
un lugar abierto. **Cada paso dice POR QUÉ en una frase concreta**: "es el último lugar donde alguien que te sigue
quiere que lo vean". Un paso sin su porqué se olvida.
**El límite que no se cruza en finanzas:** el protocolo tiene que ser de CONDUCTA, nunca de asignación. "Revisa en
cuánto tiempo vas a necesitar ese dinero", "pregunta la comisión antes de firmar", "apunta por qué compraste" son
procedimiento y están bien. "Compra más", "vende", "cámbiate a X" son recomendación y están prohibidos — y este
formato es justo donde más fácil se resbala uno, porque suena a consejo útil. Candidatos en `plan/banco-historias.md`.

### El desmontaje: agarrar el titular y abrirlo (20 nov 2026)
El motor más común de este canal, aunque no lo teníamos escrito: **abres con lo que todos oyeron y lo desarmas.**
Es el del short de Anthropic ("le quitó el récord a SpaceX… y cerró ganando la mitad de lo que abrió") y el de
"reportó récord y la acción cayó".
- **El gancho es el titular ajeno, dicho tal cual**, para que el espectador reconozca la historia en 3 segundos.
  Sale de la investigación de titulares (§ "Antes del gancho").
- **El cuerpo es lo que casi nadie contó**, y llega por partes: cada escena quita una capa.
- **Necesita UNA imagen de la diferencia**, no muchas: la torre que se deshace, las dos columnas que se separan,
  la línea que sube y vuelve a bajar. Si hacen falta dos imágenes para ver la diferencia, el guion está confuso.
- **No lleva contador ni cadena de problemas:** no hay número que crezca ni mecanismo que derivar.
- **El cierre es un principio general**, nunca un veredicto sobre la empresa (regla del cierre de un ranking).

### El alejamiento: la misma cosa a tres escalas (JP, 20 nov 2026)
JP: *"tomas de una persona, pero luego alejas la toma y luego la vuelves a alejar a la ciudad."*
Tres escalas de lo mismo, **encadenadas sin corte** (`trans: 'cont'`, cámaras encadenadas) y con el sujeto clavado
en el mismo punto de la pantalla mientras el mundo crece a su alrededor. El dato no se explica: se siente.
- **Hacia afuera**, cuando algo íntimo resulta ser masivo: una persona mirando su teléfono → la misma escena con
  cien personas iguales → la ciudad entera haciendo lo mismo.
- **Hacia adentro**, cuando una cifra enorme hay que volverla humana: el edificio de la empresa → una oficina →
  el recibo de una persona.
- **Cada escala necesita una referencia conocida** en cuadro (una persona, un coche, una casa), o el salto no se
  lee como escala, se lee como otra escena.
- **Va con la gramática de plano**, no contra ella: cada escala es un tamaño de plano distinto, y de eso se trata.
- **No le metas recuadro esquema ni contador.** El alejamiento es un solo efecto y compite con todo lo demás.

### El contador: para historias cuyo tema ES un número (JP, 20 nov 2026)
Del mismo short de @SoySR.J: "¿cuántas veces hay que doblar un papel para llegar a la Luna?". Lleva **dos fichas fijas
arriba que nunca se van** y suben con la voz — `DOBLECES 0 → 1 → 2 → 10 → 20 → 30` y `GROSOR 0,1 mm → 0,2 mm → 10,2 cm
→ 104,9 m → 107 km` — mientras **el mundo cambia de escala para que el número quepa**: escritorio → la taza → una
ciudad → la Tierra desde el espacio, con el objeto clavado en el mismo punto de la pantalla.

Funciona porque el espectador no se queda por la historia: **se queda porque quiere ver hasta dónde llega el número.**

**Cuándo se usa:** solo cuando el tema ES una cantidad que crece o se encoge. En una biografía (Kahneman, Jobs) **no
va** — ahí lo que falta es la gramática de plano de arriba, no un contador. JP lo dijo así: depende del tipo de video.

Las cuatro que están en el banco listas para usarlo:

| Contador | Historia | El mundo va de |
|---|---|---|
| `AÑOS` / `VALOR` | $1,000 al 10% anual durante 30 años | la mesa → el cuarto → el edificio |
| `AÑOS` / `LO QUE COMPRA $100` | La inflación, al revés | el carrito lleno → casi vacío |
| `AÑOS` / `TUYO` vs `DE LA COMISIÓN` | El 1% anual, con DOS contadores compitiendo | dos columnas que se separan |
| `SEGUNDOS` / `CONTADO` | Cuánto tardas en contar un billón de dólares | el reloj → el calendario → siglos |

**Cómo se hace, con lo que ya existe:** las fichas son dos `L.label3d` en la capa editorial 2D (las mismas de la ficha
del año), dibujadas en cada cuadro con el valor interpolado del tiempo; el salto de escala es un cambio de `world` con
la ola, o `trans: 'cont'` alejando la cámara si el objeto se queda fijo. Tres reglas:
- **El contador no se va nunca**, ni en el gancho ni en el cierre. Es el hilo.
- **El número sube cuando la voz lo dice**, no antes. Y lleva su `sfx` (`ticks`).
- **Cada salto de escala necesita una referencia conocida** en cuadro (una taza, una persona, un edificio): un número
  grande sin con qué compararlo no impresiona, confunde.

### Gráficas y pantallas dentro de la maqueta (19 nov 2026)
`L.plaque(ancho, alto, dibuja, pw)` da un plano con textura de canvas: con eso se dibujan **gráficas de línea de verdad** dentro de
la escena. Mete el plano en un grupo anclado a la IZQUIERDA y **escalando el grupo en x la línea se va trazando** mientras habla la
voz. Un portafolio en pantalla va **por sectores, nunca con nombres de empresas reales**: con tickers reales se lee como que estamos
diciendo qué comprar. Y activa `transparent = true` o el alfa del lienzo sale negro.

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
**Con voz de IA (el flujo de ahora):**
```bash
node engine3d/render3d.js videos/$ID --qa            # hoja de revisión build/qa.jpg (2 cuadros por escena) + build/sfx.json
node engine3d/render3d.js videos/$ID --at 3.5 12     # cuadros de cada momento con ACCIÓN, a tamaño completo
#    ↑↑ MANDA ESTO A JP Y ESPERA SU OK. No se gasta voz ni render sin eso. ↑↑
#    Mide el texto hablado: si pasa de 1,000 caracteres son 56 créditos en vez de 28.
#    vidiq_voiceover_generate en UNA llamada (voz Francisco) → audio/voice_raw.mp3
echo '{"format":"long"}' > videos/$ID/storyboard.json        # para que process_voice deje el ritmo natural
.venv/bin/python scripts/process_voice.py videos/$ID         # → audio/voice.wav + build/whisper.json
.venv/bin/python scripts/voz3d.py videos/$ID --aire 0.7      # sincroniza escenas y subtítulos con la voz real
.venv/bin/python scripts/make_audio.py videos/$ID            # música al 60% de la voz (es el valor por defecto)
node engine3d/render3d.js videos/$ID --jobs 3                # → $ID.mp4 (≈35 min: en segundo plano, y sigue con youtube.md)
# al terminar saca SOLO la miniatura: videos/$ID/miniatura.jpg (1080x1920, el cuadro del gancho, sin subtítulo).
node engine3d/render3d.js videos/$ID --mini 4.2 --hq          # solo si quieres OTRO cuadro que el del gancho
```
Sin voz de IA (si JP graba él): igual, pero `pace3d.py` en lugar de la voz, `process_voice.py` y `voz3d.py`.
- **Si solo cambia el audio** (música, aire, mezcla), **no vuelvas a renderizar**: `ffmpeg -i $ID.mp4 -i audio/mix.wav
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest salida.mp4`. Segundos en vez de 35 minutos.
- `voz3d.py` debe dar **60–90 s** y ~145 palabras/min. Verifica que diga "todas las palabras con audio en su lugar".
- **Mira `build/qa.jpg` y varios cuadros sueltos (Read)** antes de renderizar. La hoja casi nunca pasa a la primera: la de Kahneman
  necesitó cinco vueltas. Lo que hay que cazar, con su causa:
  - **Texto cortado en una etiqueta 3D:** no es el encuadre, es que `label3d` dibuja sobre un canvas de `pw` px y lo que no cabe se
    recorta. Regla: `caracteres × 0.62 × tamaño + ls × caracteres ≤ pw`. Baja la fuente, no el ancho del plano.
  - **Objeto pegado al rótulo:** para BAJAR algo en el cuadro el `lookAt` va ARRIBA del objeto (es al revés de lo que parece).
    Zona segura del vertical: y 800–1650 de 1920.
  - **Un objeto que cae sobre otro acaba DENTRO:** calcula la tapa con `getWorldPosition` del grupo, no con coordenadas locales.
  - **Lo que baja desde arriba pasa por detrás del rótulo:** que llegue pronto a la zona visible y se quede ahí.
  - **Una plaquita con fondo transparente sale negra:** `pl.material.transparent = true`.
  - Distancias: `media_altura = tan(25°) × distancia`, `media_anchura = media_altura × 0.5625`.
- Si cambias un `cap`, hay que regenerar la voz: **vuelve a pedirle el OK a JP antes de gastar los créditos**.
- Al terminar: `ffprobe` (1080x1920, h264 + aac, duración) y revisa 3 cuadros del MP4. Copia `build/qa.jpg` a `cuadros_clave.jpg`.
- `--hq` renderiza el 3D al 100% con sombras más suaves (2.5x más lento): solo si JP lo pide.

## 6. Entregar
1. `videos/$ID/youtube.md` con **`## ✅ Para copiar y pegar`**: título (≤ 100 caracteres, el personaje o la empresa y el gancho en los
   primeros ~40, 2 hashtags) y descripción (1.ª línea con la historia y las palabras clave, "📌 Datos clave" en 4–6 viñetas, la
   pregunta del cierre, fuentes en una línea, "Animación original en 3D. Caricatura editorial; sin logotipos reales.", "Contenido
   educativo. No es asesoría financiera.", "Costa Studio Finance, by JP Armendáriz." y 3–5 hashtags con `#Shorts`). Debajo: 2 títulos
   alternativos, fuentes completas y "Al subir" (no es para niños; **contenido alterado o sintético = Sí**, porque la narración es voz
   generada; video relacionado = el largo de ese domingo; comentario fijado con la pregunta y la liga al largo).
   Y una tabla de verificación: dato · fuente consultada · resultado, marcando con ⚠️ lo que solo tenga fuente secundaria.
2. Envía el MP4 con SendUserFile (display render) y `cuadros_clave.jpg`. En el mensaje pega SIEMPRE título y descripción.
   **El video YA LLEVA VOZ: no le pidas que grabe nada.** Recuérdale el día y la hora (martes o jueves, 12:00) y que suba la
   **miniatura propia** (`videos/$ID/miniatura.jpg`, la saca el render solo): mándasela también con SendUserFile.
3. Agrega la historia a `plan/publicados.md` (tabla "Programado") y a "Ya publicadas" de `plan/banco-historias.md`.
4. Commit + push a la rama actual (`story.js`, `series.js`, `guion.md`, `narration.txt`, `youtube.md`, `cuadros_clave.jpg`, el MP4;
   `miniatura.jpg`; sin `build/` ni `.wav`). Si el push falla, no insistas: el video ya llegó por el chat; pega también `youtube.md` completo.

### Gráficas con personaje y una sola paleta (JP, 20 nov 2026 — vale para todos los formatos)
- **Ventas / algo que crece → el personaje SUBE escaleras**, un escalón por periodo (el estilo de Steve Jobs).
- **Una curva con movimiento → el personaje va EN UN CARRITO** sobre la línea (el estilo de SpaceX).
- **Comparar dos cantidades → columnas VERTICALES con eje X y eje Y visibles**, no barras horizontales.
- **Una gráfica donde solo se mueve la línea está prohibida.**
- **Un video entero lleva UNA paleta.** Los mundos cambian de luz y de valor, no de familia de color: naranja
  profundo → naranja medio → naranja claro, nunca naranja → beige → blanco. Mira la hoja de QA entrecerrando los
  ojos: si un cuadro parece de otro video, está mal.
- **Máximo 6–8 efectos de sonido en toda la pieza**, ninguno repetido seguido, y la "ola" solo al cambiar de mundo.

## Estilo (no cambiar sin que JP lo pida)
"Costa Diorama v2": maquetas de plastilina mate con huellas, luz de cine (principal cálida + contraluz + relleno), profundidad de
campo, personajes cabezones articulados a 12 cuadros/s, misma capa editorial de los shorts (logo, ficha del año, etiqueta, titular
en Unbounded, subtítulos-teleprompter, grano, transición de marea) y cierre con el lema "Desde la costa, todo se ve con claridad."
