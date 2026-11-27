# Guion de rodaje · Historia 3D "El interés compuesto" — **VERSIÓN FINAL (v4)**
**Puente al largo del domingo 29:** *Cómo empezar a invertir desde cero en México*
**10 escenas · 176 palabras · ~73 s con voz de IA · UN bloque de voz = 28 créditos**
**Estado: PENDIENTE DE APROBACIÓN DE JP. Sin maqueta, sin voz, sin render.**

---

## El dato detrás de todo (aritmética verificada, no es dato de nadie)
**$160 dólares al mes** (≈ **$5.26 al día**) · **10% anual compuesto** · **40 años** → **$1,011,853**
El 10% es un **supuesto nuestro**: rotulado `supone 10% anual · ilustrativo` pegado a la cifra, las 10 escenas.

| Año | Total | **Verde** (lo que pones) | **Dorado** (lo que paga el interés) | % dorado |
|---|---|---|---|---|
| 5 | $12,390 | $9,600 | $2,790 | 23% |
| 18.4 | **$100,000** | $35,360 | $65,615 | 65% |
| 31 | **$400,000** | $59,520 | $340,480 | 85% |
| 40 | **$1,011,853** | **$76,640** | **$935,053** | **92%** |

**La escalera de premios, toda dentro del millón:** coche **$12,000** (≈230,000 pesos) año 4.9 ·
casa **$100,000** (≈1.9 M pesos) año 18.4 · barco **$400,000** año 31 · **el millón** año 39.9

> **Por qué NO hay yate ni jet:** no caben en un millón (yate 2–10 M, jet usado 3–15 M). Enseñarlos
> afirmaría algo falso sobre lo que compra el dinero. **La fama sí se queda:** montar una celebración es
> puesta en escena; decir qué compra el dinero tiene que ser cierto.

**La cita es de Charlie Munger, no de Buffett**, y las fuentes no coinciden en la redacción exacta ni en el
año. Por eso **no va entrecomillada**: va como idea atribuida a él, sin groserías.

---

## Revisión de factibilidad (contra el motor y las skills)

**Ya existe y se usa tal cual:** `cineWorld` · `actor` + `pose` (Jobs usó 8 personajes y Kahneman 6, así que
la multitud del final cabe) · `rbox` y `clay2` (barras, coche, casa, barco) · `label3d` · **`burst` (el
confeti y los flashes)** · `tide` · `plaque` · las fichas del contador en el overlay 2D.

**Hay que CONSTRUIRLO, y es barato:**
1. **La etiqueta que apunta** (píldora + línea punteada al objeto). Está en `CLAUDE.md` como recurso de la
   casa **pero nunca se implementó**. Es dibujo 2D, ~15 líneas. La necesita la escena 2.
2. **La barra de dos colores** (verde abajo, dorado arriba, con la proporción real de cada año): dos `rbox`
   apilados por escalón, a mano, como la columna de monedas.
3. **Coche, casa y barco** de plastilina, sin marca, con primitivas.

**Riesgos que ya conozco y cómo los evito** (los tres me mordieron esta semana):
- `label3d` usa **`ink` y `font`** (cadena CSS), nunca `fg`/`size`; y el texto que no cabe en `pw` **se
  recorta**: `caracteres × 0.62 × tamaño + ls × caracteres ≤ pw`.
- **Un grupo que se escala no mide 1:** el factor es `valor / altura_construida`.
- **Encuadre con la fórmula:** `ancho_de_cuadro = 0.3015 × distancia`.

**Presupuesto de efectos: 8, el máximo que permite la regla** (Kahneman se pasó con 10).
`whoosh` en el salto al futuro · `pop` del primer dorado · puerta del coche · puerta de la casa · `thud`
cuando la barra se dispara · flashes · `shine` en el pizarrón · `pop` en la pregunta.
**La escena 4 va SIN efecto, a propósito:** el silencio en la cuesta larga es parte del golpe.

**Gramática de plano — las cinco familias cubiertas, sin dos seguidas iguales:**
| Escena | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Plano | medio→general→medio | **detalle** | medio | **general** | entero | general alto | gran general→**primer plano** | general | medio | entero |

---

## ESCENA 1 · GANCHO CON SALTO AL FUTURO (0:00–0:10)
**NARRA:** «Invierte cinco dólares al día y cuarenta años después serás millonario. No es un truco: es
aritmética. Pero el camino sorprende.»

**SE VE:** Tres tiempos en una toma continua:
1. **Plano medio** del personaje solo en un **terreno baldío** al amanecer. Nada más. (0–2.5 s)
2. En «serás millonario», la cámara **se dispara hacia atrás** y aparece el final completo: la gráfica dorada
   gigante, la casa, el coche, el barco, él arriba con gente y flashes. Ciudad iluminada. (2.5–7 s)
3. En «el camino», **todo se desvanece de golpe** y volvemos al baldío con su montoncito verde. (7–10 s)

**RÓTULO (dos tiempos):** "Cinco dólares al día" → en dorado: "cuarenta años después"

---

## ESCENA 2 · EL MECANISMO (0:10–0:23)
**NARRA:** «Cada mes pones ciento sesenta dólares: ese dinero tuyo son los billetes verdes. Lo que el
interés paga encima son los dorados. Y esos dorados pagan más dorados.»

**SE VE:** **Plano detalle**, la única toma cerrada del video. Se forma el primer escalón: entra la capa
**verde** y encima **un** billete dorado. Pasa un año y de ese dorado **brotan dos**; de esos, cuatro.
**Dos etiquetas que apuntan**, con línea punteada a su color:
`VERDE · el dinero que tú pones` · `DORADO · lo que te paga el interés`.

**RÓTULO:** "Los dorados no se gastan" → "pagan más dorados"

---

## ESCENA 3 · AÑO 5, EL COCHE (0:23–0:31)
**NARRA:** «A los cinco años llevas doce mil dólares: ya es un coche. Casi todo lo pusiste tú.»

**SE VE:** Sobre el escalón del año 5 **aparece un coche** de plastilina, sin marca. El personaje **se sube
y cierra la puerta**. La barra es verde con una franja dorada delgada. Fondo: pueblito de casas bajas.

**RÓTULO:** "Año 5 · $12,390" · pie: "≈ 237,000 pesos · 77% lo pusiste tú"

---

## ESCENA 4 · LA CUESTA LARGA (0:31–0:42) · **sin efectos de sonido**
**NARRA:** «Y lo que nadie te cuenta: tardas dieciocho años en juntar los primeros cien mil. Casi la
mitad del camino para el diez por ciento.»

**SE VE:** La cámara **se aleja** y se ve lo plano que ha sido: dieciocho escalones bajos, casi una rampa.
El personaje camina con los **hombros caídos**, mirando el suelo. Las fichas suben con lentitud
desesperante. Fondo: el pueblo, algo más grande.

**RÓTULO:** "18 años" / "para el 10% del dinero" · pie: "Aquí es donde casi todos se rinden"

---

## ESCENA 5 · MUNGER Y LA CASA (0:42–0:51)
**NARRA:** «Charlie Munger decía que los primeros cien mil son los más difíciles. Y cuando llegas, ya son
una casa.»

**SE VE:** En el escalón del año 18 **aparece una casa**. El personaje llega arrastrando los pies, se
endereza y **abre la puerta**. La barra ya es 65% dorada. Fondo: **ciudad chica**, primeras luces.

**RÓTULO:** "Los primeros $100,000" / "son los más difíciles" · pie: "Charlie Munger · ≈ 1.9 M de pesos"

---

## ESCENA 6 · SE ACELERA, EL BARCO (0:51–1:01)
**NARRA:** «De ahí empuja el interés: a los treinta y uno llevas cuatrocientos mil, y el ochenta y cinco
por ciento es dorado.»

**SE VE:** Los escalones se vuelven **altos de golpe** y el personaje **trepa con esfuerzo**, impulsándose
con las manos. En el escalón del año 31 **aparece un barco**. Barras casi todas doradas.
Fondo: **ciudad grande**, edificios iluminados.

**RÓTULO:** "Año 31 · $400,000" · pie: "85% ya es interés"

---

## ESCENA 7 · AÑO 40, EL MILLÓN Y LA FAMA (1:01–1:09)
**NARRA:** «Y a los cuarenta: un millón de dólares.»

**SE VE:** La barra final **se dispara fuera de cuadro** y la cámara se aleja de golpe para que quepa
(gran general, a ~37 de distancia): la gráfica dorada gigantesca con la casa, el coche y el barco abajo.
**Gente alrededor, flashes (`burst`), confeti.** Él con lentes oscuros. La cámara **cierra hasta su cara**
y ahí se queda: es el reverso exacto de la escena 1.

**RÓTULO (dos tiempos):** "Año 40" → en dorado: "$1,011,853"

---

## ESCENA 8 · EL GOLPE (1:09–1:19)
**NARRA:** «Tú pusiste setenta y seis mil; el interés, novecientos treinta y cinco mil. Noventa y dos de
cada cien dólares.»

**SE VE:** La gráfica **entera**, de año 1 a año 40: el **verde es una tirita pegada al suelo** y todo lo
demás es **oro**. Una línea horizontal marca dónde acaba lo verde, y está casi en el piso. El personaje,
chiquito, hasta arriba.

**RÓTULO:** "Tú pusiste $76,640" → "El interés puso $935,053"

---

## ESCENA 9 · AVISO DEL LARGO (1:19–1:26)
**NARRA:** «Este domingo sube el video completo: cómo empezar a invertir desde cero.»

**SE VE:** El personaje frente al **pizarrón**: "ESTE DOMINGO 10:00 / Empezar a invertir / desde cero en
México", con **DOMINGO subrayado a mano**. Lo señala. Fondo: la ciudad iluminada.

---

## ESCENA 10 · PREGUNTA DE CIERRE (1:26–1:33)
**NARRA:** «¿Cuántos años llevas pensando en empezar?»

**SE VE:** El personaje abre las manos preguntando. Pregunta centrada en serif itálica, "Desde la costa,
todo se ve con claridad." y el aviso legal: "Supone 10% anual · ejemplo ilustrativo · Contenido educativo ·
No es asesoría financiera".

---

## Lo que NO lleva (a propósito)
- **Ni yate ni jet privado:** no caben en un millón.
- Ninguna recomendación de dónde invertir ni de qué instrumento da 10%.
- La frase de Munger sin comillas, sin atribuir a Buffett y sin groserías.
- Ningún logo ni marca real: coche, casa y barco son caricatura propia.
- El guion dice "supone", nunca "vas a tener".

## Checklist de entrega (después del render)
- [ ] `youtube.md`: título, descripción, **comentario fijado**, **"Video relacionado" → el largo del
      domingo** y tabla de verificación de fuentes.
- [ ] Registrar en `plan/publicados.md` y marcar la fila en `plan/banco-historias.md`.
- [ ] Miniatura propia del cuadro del gancho (la saca `render3d.js` sola).
- [ ] Barrido del MP4 terminado, un cuadro cada 3 s.
