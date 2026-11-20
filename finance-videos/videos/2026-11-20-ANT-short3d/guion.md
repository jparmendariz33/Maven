# Short 3D · Anthropic · viernes 20 nov 2026, 19:00
**Experimento (JP, 19 nov 2026):** primer short de CONTEXTO hecho con el motor 3D en vez del 2D, para probar de una
vez la gramática de plano nueva. Mantiene la capa editorial de marca (logo, ficha, titular, subtítulos) que `lib.js`
ya dibuja encima del 3D: es el mismo estilo, con cámara de verdad debajo.

## ⚠️ Conflicto de interés — decisión de JP antes de producir
Este guion lo escribe Claude, que **es un producto de Anthropic, la empresa analizada**. Ya lo declaramos en la
publicación de hoy; en un video pesa más, porque casi nadie lee la descripción. Por eso va **en pantalla**, en la
escena del cierre, no solo en el texto de YouTube: *"Guion asistido por Claude, producto de Anthropic."*
El análisis no favorece a la empresa: desmonta el titular de "+17%" y a la vez explica que la pérdida de 104 mil
millones es casi toda contable. Es mixto y todo sale del prospecto ante la SEC. **Aun así, publicarlo o no es tuyo.**

## Por qué este tema aguanta meses (regla del short de contexto)
Solo usa hechos del día del debut, que ya son historia fija: precio de colocación, apertura, cierre del primer día y
las cifras del prospecto. **No dice "hoy", ni "ahora cotiza en", ni el precio actual.** Si mañana la acción se cae o
se dispara, el short sigue siendo cierto.

## Datos (todos verificados el 19 nov — `videos/2026-11-19-POST-ANTHROPIC/summary.md`)
| Dato | Valor | Fuente |
|---|---|---|
| Colocación | $83.00 · 980 M acciones | 424(b)(4) SEC, 19 nov |
| Debut | abrió $111.50 · cerró **$97.17** | Yahoo Finance, 19 nov |
| vs colocación / vs apertura | **+17%** / **−13%** | cálculo sobre esos precios |
| Pérdida neta ene–sep 2026 | **$104,039 M** | 424(b)(4) SEC |
| De eso, cambio de valor de notas convertibles y SAFEs | **$94,300 M** (no es efectivo) | 424(b)(4) SEC |
| Margen de operación 3T 2026 | **−3%** (−224% un año antes) | 424(b)(4) SEC |

## El gancho, en tres capas (regla del 20 nov)
- **Voz, en 0.0 s:** "Perdió 104 mil millones de dólares en nueve meses. Y casi no perdió dinero."
- **Texto en pantalla, cuadro 1:** `PERDIÓ $104,039 MILLONES` / `Y CASI NO PERDIÓ DINERO`
- **Música:** entra con cuerpo (36%), ya corregido en `music3d.py`.
- Identifica a la empresa: logo oficial de Anthropic arriba a la derecha, en la capa editorial (en el mundo 3D no va
  ningún logotipo real, como siempre).

## Los tres mundos (no son el mismo piso repintado)
Cada uno con **tres profundidades** y algo que se construye durante la escena.

- **A · EL PISO** — azul noche. Delante y desenfocada, la esquina de un escritorio con una pantalla; en medio, el
  inversionista; al fondo, un tablero grande (`L.plaque`) donde **se traza la línea del precio** mientras habla la voz.
- **B · LA TORRE** — beige cálido. Delante, unas monedas sobre la mesa; en medio, la torre de bloques de la pérdida,
  que **se construye bloque por bloque** (`scale.y` escalonado) junto al inversionista, que es la referencia de
  tamaño; al fondo, la pared con la cifra.
- **C · EL MOSTRADOR** — claro, limpio. Delante, un billete; en medio, el mostrador donde entran 100 y salen 97;
  al fondo, nada: aquí el vacío es a propósito, es la escena del remate.

## Las 9 escenas — guion, toma y acción
La columna **toma** usa la tabla de `/historia` §4 (`fov` 30°, `media_altura = 0.268 × distancia`, personaje = 2.85).
**Ninguna toma se repite seguida, y hay al menos una de cada familia.** Es lo que vamos a probar.

| # | Mundo | Toma | dist · altura · ángulo | Lo que PASA | Rótulo |
|---|---|---|---|---|---|
| 1 gancho | B | **Detalle** → se abre a entero | 1.6 → 10 · 1.2 · 0° | Un bloque solo llena el cuadro; la cámara se aleja y aparece la torre entera, con el inversionista diminuto al pie | `PERDIÓ $104,039 MILLONES` / `Y CASI NO PERDIÓ DINERO` |
| 2 salida | A | **General** | 21 · 6.0 · picado −12° | El piso visto desde arriba; el tablero del fondo se enciende | `19 DE NOVIEMBRE DE 2026` / `Anthropic sale a la bolsa` |
| 3 precios | A | **Medio** | 4.4 · 2.2 · 0° | La línea se traza: sube a 111, baja a 97. El inversionista la sigue con la cabeza | `COLOCÓ EN $83 · ABRIÓ EN $111.50` / `Cerró su primer día en $97.17` |
| 4 titular | A | **Contrapicado entero** | 9 · 0.9 · +18° | Cae desde arriba una plancha de periódico que tapa el tablero; se ve enorme desde abajo | `SUBIÓ 17%` |
| 5 la otra cuenta | A | **Primer plano** (único) | 3.7 · 2.1 · 0° | La cara del inversionista; detrás, desenfocado, el tablero. `fov` a 22 para cerrar sin deformar | `CONTRA EL PRECIO DE APERTURA` / `cerró 13% abajo` |
| 6 la torre | B | **General** | 22 · 7.0 · 0° | La torre se construye bloque a bloque mientras habla, hasta salirse por arriba del cuadro | `PÉRDIDA NETA · 9 MESES DE 2026` / `$104,039 millones` |
| 7 el humo | B | **Entero** | 10 · 3.0 · 0° | **El momento del video:** 9 de cada 10 bloques se vuelven translúcidos y se van flotando; queda un muñón chaparrito | `$94,300 MILLONES NO SALIERON DE LA CAJA` / `Es un ajuste en los libros` |
| 8 el negocio | C | **Cenital** | 6 · justo encima · −90° | Vista de pájaro del mostrador: entran 100 monedas por un lado, salen 97 por el otro | `DE CADA $100 QUE VENDIÓ, PERDIÓ $3` / `Un año antes perdía $224` |
| 9 cierre | C | **Medio** | 4.4 · 2.2 · 0° | JP en 3D entra a cuadro y cierra | La pregunta + lema + aviso legal + **"Guion asistido por Claude, producto de Anthropic"** |

## Narración (lo que se manda a la voz, en UNA toma)
1. Perdió 104 mil millones de dólares en nueve meses. Y casi no perdió dinero.
2. El 19 de noviembre de 2026, Anthropic salió a la bolsa.
3. Vendió sus acciones en 83 dólares. Abrieron en 111… y el primer día cerró en 97.
4. Casi todos los titulares dijeron lo mismo: subió 17%.
5. Contra el precio de venta, es cierto. Contra el precio al que abrió, cerró 13% abajo.
6. Ahora, la pérdida: 104 mil millones de dólares.
7. De esa cifra, 94 mil millones nunca salieron de la caja. Son un ajuste en los libros, no dinero gastado. Nadie firmó un cheque por ese dinero.
8. ¿Y el negocio? De cada 100 dólares que vendió, perdió 3. Un año antes perdía 224.
9. La utilidad neta te dice qué quedó hasta abajo. No te dice cómo va el negocio. ¿Cuántas veces te has quedado solo con el titular?

## Lo que este short NO hace
- No dice si la acción está cara o barata, ni si conviene comprarla. El cierre es un principio general.
- No usa contador. El contador es para una cantidad que **crece**; aquí el mecanismo es una resta, y la resta se
  cuenta mejor con la torre que se deshace. (La primera con contador debería ser la del interés compuesto.)
- No lleva logotipos reales dentro del mundo 3D. El de Anthropic va solo en la capa editorial.
