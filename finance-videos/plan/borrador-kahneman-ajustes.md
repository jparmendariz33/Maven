# Plan de acción · Dos arreglos en la historia de Kahneman
**Pedidos por JP el 20 nov 2026**, sobre la versión de 63.9 s ya renderizada.

---

## A · La escena 2 no es lo bastante simple, y el dibujo no dice lo que dice la voz

**Lo que hay hoy**
- Voz: *"Hasta entonces se pensaba que, con el dinero, todos hacemos cuentas mentales y elegimos lo que más nos conviene."*
- Pizarrón: unos ejes con una recta y las palabras "ganar" y "perder".
- Rótulo: "Que haces / cuentas mentales / y eliges lo mejor".

**Qué está mal**
1. "Cuentas mentales" sigue siendo vocabulario de finanzas. Pide traducción mental, y la regla es que no pida nada.
2. **La recta no aparece en la narración.** La voz nunca habla de ejes, de una gráfica ni de "ganar contra perder" en ese
   momento. Es un dibujo bonito que no ilustra la frase: rompe la regla de que la imagen diga lo mismo que la voz, al
   mismo tiempo. Además adelanta el tema de la escena 4 (perder duele más), que es donde esa curva sí tendría sentido.

**Tres paquetes completos.** Cada uno trae voz + pizarrón + rótulo, para elegir uno entero y no piezas sueltas.

### Opción 1 — Sin metáfora (la que recomiendo)
- **Voz:** "Hasta entonces se daba por hecho algo muy simple: que con el dinero, siempre eliges la mejor opción."
- **Pizarrón:** dos cantidades escritas con gis, **$100** y **$120**, y una **palomita grande** sobre el 120.
  Se escribe mientras lo dice. Lo entiende un niño.
- **Rótulo:** "Que siempre / eliges / la mejor opción" · sub: "Sin dudar, sin miedo".
- **Por qué:** cero vocabulario técnico, y monta la sorpresa de la escena 3 — ahí se verá que, con el mismo dinero
  sobre la mesa, la gente NO decide por el número.

### Opción 2 — La calculadora, pero mostrada
- **Voz:** "Hasta entonces, la economía trataba a las personas como una calculadora. Fría. Sin miedo."
- **Pizarrón:** una **calculadora dibujada con gis** y, al lado, un **corazón tachado**. La calculadora 3D que ya
  flota en la escena deja de ser un adorno y pasa a ser el tema.
- **Rótulo:** "Te trataban / como una / calculadora" · sub: "Fría, sin miedo, solo números".
- **Por qué:** JP descartó "una calculadora en la cabeza" porque había que descifrarla. Aquí no: el objeto está en
  pantalla y el corazón tachado dice "sin emociones" sin una sola palabra técnica.

### Opción 3 — La más corta
- **Voz:** "Hasta entonces, la economía daba por hecho que con el dinero nadie se equivoca."
- **Pizarrón:** la palabra **"ERROR"** escrita con gis y **tachada** de un trazo.
- **Rótulo:** "Daban por hecho / que con el dinero / nadie se equivoca".
- **Por qué:** es la frase más corta de las tres y la imagen es una sola palabra. El riesgo es que "nadie se equivoca"
  suene a que la teoría decía que nadie pierde dinero, que no es lo mismo.

**Qué cuesta:** cambiar esta frase obliga a regenerar la voz (regla de la toma única: se regenera completa, no por
piezas). El guion está hoy en 933 caracteres y las tres opciones lo dejan por debajo de 1,000, así que **sigue siendo
un bloque: 28 créditos**. El re-render son ~35 min y no cuesta créditos.

---

## B · Las transiciones de las últimas escenas

**Qué está pasando.** El motor hace el cambio de escena con `L.tide()`: una ola con espuma que barre la pantalla
(`engine3d/lib.js`). Es la transición de la marca y está bien… **cuando se cambia de lugar**. El problema es que hoy se
dispara también entre escenas que ocurren en el MISMO lugar, y ahí se siente como un parche en medio de una toma.

Cuatro pares comparten mundo y los cuatro llevan ola:

| Corte | Mundo | Debería ser |
|---|---|---|
| 1 → 2 (gancho → supuesto) | `estudio` | un solo plano, la cámara se mueve |
| 6 → 7 (nobel → tversky) | `nobel` | un solo plano |
| **8 → 9 (cierre → aviso)** | `cierre` | un solo plano |
| **9 → 10 (aviso → pregunta)** | `cierre` | un solo plano |

Los dos que marcó JP son justo los del final, que además caen seguidos: tres escenas en la misma habitación con dos
olas de por medio.

**El arreglo, en dos partes:**
1. **`trans: 'cont'`** en las escenas 2, 7, 9 y 10. El motor ya lo soporta: en `player.js`, `s.trans !== 'cont'`
   es lo que decide si dibuja la ola. Con eso desaparece el barrido entre esas escenas.
2. **Encadenar las cámaras**, que es el trabajo de verdad. Quitar la ola sin esto deja un corte seco, porque cada
   escena tiene su propio recorrido de cámara. La posición y el objetivo con que **arranca** cada escena continuada
   tienen que ser exactamente los que tenía la anterior al **terminar**. Hecho así, 8 → 9 → 10 queda como una sola
   toma en el cuarto de arena: de la cara del personaje, a que voltea al pizarrón del domingo, a que abre las manos
   y pregunta.

La ola se queda donde sí cuenta algo: 2→3 (del aula a la mesa), 3→4, 4→5, 5→6 y 7→8. Son cambios de lugar de verdad.

**Qué cuesta:** cero créditos. Solo re-render.

---

## Orden sugerido
1. JP elige opción de la escena 2 (1, 2 o 3).
2. Se aplican los dos arreglos juntos y se mandan capturas, incluidos cuadros de los cortes 8→9 y 9→10 para que se
   vea que ya no hay ola.
3. Con el visto bueno: una sola generación de voz (28 créditos) y un render.
