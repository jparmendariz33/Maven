# Short de contexto · BLACK FRIDAY · viernes 27 de noviembre de 2026

**Formato:** short vertical de contexto (`/short` §1c) · 8 escenas · **163 palabras / ~890 caracteres**
**Duración estimada:** **82 s** (a 120 palabras/min por sílabas, como mide `no_voice.py`). La banda del
formato es 60–85 s, así que entra, pero arriba. **Si al medir se pasa de 85 s, la escena 2 se calla y su
cifra se queda solo en pantalla, en el gancho** (−10 palabras, −5 s).
**Se publica:** hoy 19:00 CDMX · **JP graba su voz**
**Estado:** 🚦 PRIMERA PUERTA — esperando OK. No se ha construido nada.

> **v5 — con tus seis correcciones de guion y tu dirección visual.** Detalle al final.

---

# 1 · Lo que cambió con tu crítica

| Tu corrección | Qué hice |
|---|---|
| "No fue un día suelto" está mal planteado | Ahora es **«Y ya venía de antes»**: el fenómeno ya se veía los días anteriores, no es que un día fuera aislado |
| La pregunta "¿y qué compraron?" no corresponde a la respuesta | Ahora es **«¿Y qué categorías subieron más?»**, que es literalmente lo que contesta |
| Falta conectar las categorías con la bolsa | Entra el puente: **«Eso también se vio en la bolsa»** |
| Mencionar una o dos empresas más | Entran **Shopify (+6.28%)** y **Mercado Libre (+4.47%)** junto a Amazon, y el contrapunto **eBay (−1.91%)** |
| La escena 7 no es intuitiva | Ahora dice **«cuando reporten sus resultados trimestrales en febrero»**, con la palabra completa |
| **No hay pregunta de cierre** | Entra: **«¿Tú gastaste más este Black Friday que el pasado?»** |

**Y lo que encontré al buscar las otras empresas:** no todas subieron. **eBay cayó 1.91%** y Target
cerró ligeramente abajo. Ese contraste hace el video más honesto y más interesante que si solo
pusiera ganadores, así que le di su propia escena.

**Ojo, obligatorio:** Mercado Libre está en `plan/posiciones-jp.md`, así que **tu posición se declara
en la voz y en la descripción**. Ya está puesta en la escena 7.

---

# 2 · Tabla de verdad de los datos

| Cifra | Estado | Fuente | ¿Entra? |
|---|---|---|---|
| Acción de Gracias 2026: **$7,100 M** en compras por internet en EE.UU. | **Hecho** | Adobe Analytics | Sí — gancho |
| **+10.4%** vs. el Día de Acción de Gracias de 2025 | **Hecho** | Adobe Analytics | Sí — escena 2 |
| 1–22 nov 2026: **$82,500 M**, **+9.1%** vs. las mismas fechas de 2025 | **Hecho** | Adobe Analytics | Sí — escena 3 |
| Vs. **promedio de octubre de 2026**: higiene personal **+40%**, limpieza del hogar **+33%**, ropa básica **+27%** | **Hecho** | Adobe Analytics | Sí — escena 4 |
| Cierre 27 nov (media jornada): **Nasdaq +2.31% · S&P 500 +1.60% · Dow +1.18%** | **Hecho** | Cierres del día | Sí — escena 5 |
| **Shopify +6.28%** ($141.78) | **Hecho** | Yahoo Finance, cierre | Sí — escena 6 |
| **MercadoLibre +4.47%** ($1,532.92) | **Hecho** | Yahoo Finance, cierre | Sí — escena 6 |
| **Amazon +3.96%** ($254.12) | **Hecho** | Yahoo Finance, cierre | Sí — escena 6 |
| **eBay −1.91%** ($113.33) · Target −0.15% | **Hecho** | Yahoo Finance, cierre | eBay sí (escena 7); Target solo en pantalla |
| Walmart +0.90% · Best Buy +1.56% · Costco +1.01% | **Hecho** | Yahoo Finance, cierre | Solo en pantalla, escena 6 |
| Resultados por tienda del Black Friday | ⚠️ **No publicados todavía** | — | **NO** |
| Black Friday: $12,900 M "récord" | ⚠️ **Pronóstico** | Adobe | **NO** |

**Todas las cifras de bolsa son del CIERRE del 27 de noviembre de 2026**, bajadas con
`scripts/fetch_data.py`. Las que circulan en notas de prensa son intradía y se contradicen entre sí
(eBay aparece como −1.81% y como +0.49% según la hora); por eso no uso ninguna de esas.

**Lo que NO afirmo:** que estas acciones subieran *por* el Black Friday. Ese día subió toda la bolsa.
En pantalla va la nota que lo aclara, y el cierre dice dónde estará la prueba de verdad.

---

# 3 · Dirección visual (tu idea + lo que el motor puede hacer hoy)

**Lo que pediste:** mantener el estilo de los videos de contexto y del ranking · logos desde el
principio · gráficas que suban y bajen · columnas · ranking para los más beneficiados · fotos ·
**fondo negro por el Black Friday**, conciliado con los colores de Costa.

**Lo que ya existe en el motor y uso tal cual:** las escenas de ranking del torneo (`ronda`), que son
exactamente ese estilo — logo, nombre, barra que crece y el valor a la derecha. Las uso **dos veces**:
una para las categorías y otra para las empresas. Las fotos a pantalla completa y el `photo` ya existen.

**Dos cosas chicas que hay que agregarle al motor, y las hago yo:**
1. **Tema `negro`** (≈3 renglones). Hoy los fondos oscuros son azul Costa; agrego el negro `#0A0A0A` de
   la paleta. Todo el texto ya se pinta en arena cuando el fondo es oscuro, así que no hay que tocar
   nada más. **Y así queda conciliado con la marca: fondo negro + arena + mostaza, que ya son nuestros.**
2. **Escena `ranking`** (≈20 renglones). Es la `ronda` del torneo sin lo de torneo: sin "RONDA 1 DE 6"
   y sin los círculos de puntos, con el valor en porcentaje. Mismo dibujo, misma tipografía.

**Lo que NO alcanzo a hacer hoy y te propongo dejar para la próxima:** la escena de **columnas
verticales con eje X y eje Y** que pediste el 20 de noviembre. El motor no la tiene y es trabajo de
verdad, no de veinte renglones. Hoy la comparación se ve con las barras del ranking, que es el estilo
que ya usamos y que sí existe.

---

# 4 · Desglose escena por escena

> Tiempos relativos al inicio de cada escena. Las palabras en **negrita** son los `cue`.
> **Paleta de todo el video:** fondo negro `#0A0A0A`, texto arena `#EBE6BA`, acento mostaza `#C7A317`,
> musgo `#7E8C54` para lo que sube, terracota `#BB6F58` para lo que baja. Una sola familia, las 8 escenas.

---

## ESCENA 1 · `hook` · tema `negro` · [0:00 – 0:12] · ~12 s · PLANO GENERAL

**NARRACIÓN**
> «El Día de Acción de Gracias de 2026, Estados Unidos **rompió** su récord de compras por internet:
> 7,100 millones de **dólares** en un día.»

**GUION DE TIEMPOS**

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Voz y música ya con cuerpo | Sin rampa |
| +0.0 | Foto a toda pantalla: tienda llena de gente con carritos | Velo oscuro al 55%, solo la deriva del motor |
| +0.0 | Kicker y título | `ACCIÓN DE GRACIAS · 27 DE NOVIEMBRE DE 2026` · `Estados Unidos rompió su récord` |
| +0.0 | JP en 3D | Abajo a la izquierda, 500 px, acto `senala`, `mood: up` |
| +2.4 | **cue `rompió`** → se subraya `récord` | El subrayado se dibuja de izquierda a derecha, 0.35 s, mostaza |
| +6.6 | **cue `dólares`** → cae la cifra | `rise` desde 40 px abajo, mostaza |
| +7.0 | JP voltea al centro y señala la cifra | — |
| +9.0 | Entra la ficha de fuente | `Compras por internet en EE.UU. · Adobe Analytics` |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `ACCIÓN DE GRACIAS · 27 DE NOVIEMBRE DE 2026` | Rótulo y≈300 | Arena 70% | +0.0 | fin escena |
| Título | `Estados Unidos rompió su récord` | Rótulo y≈430 | Arena, `récord` subrayado mostaza | +0.0 | fin escena |
| Cifra | `$7,100 millones en un día` | Rótulo y≈600 | Mostaza | +6.6 | fin escena |
| Ficha | `Compras por internet en EE.UU. · Adobe Analytics` | Contenido y≈980 | Arena 60% | +9.0 | fin escena |

**CÁMARA.** Plano general, sin zoom de entrada.
**SFX.** `[0.00, 'thud', 0.5]`. Uno solo.
**POR QUÉ EXISTE.** El gancho dice **récord** en las primeras ocho palabras, sin suspenso.

---

## ESCENA 2 · `statement` · tema `negro` · [0:12 – 0:17] · ~5 s · PLANO MEDIO

**NARRACIÓN**
> «10% **más** que ese mismo día de **2025**.»

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a negro limpio, sin foto | El cambio de fondo separa la escena sin ola |
| +1.3 | **cue `más`** → entra la cifra grande | `+10.4%`, mostaza, centrada |
| +3.2 | **cue `2025`** → entra debajo contra qué se compara | `vs. el Día de Acción de Gracias de 2025` |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Cifra | `+10.4%` | Contenido y≈1100 | Mostaza, grande | +1.3 | fin escena |
| Comparación | `vs. el Día de Acción de Gracias de 2025` | Contenido y≈1270 | Arena | +3.2 | fin escena |

**CÁMARA.** Plano medio. **SFX.** Ninguno. **Sin personaje** (JP solo en gancho y cierre).
**POR QUÉ EXISTE.** Un récord sin comparación no dice nada. **Es la escena que se calla si el reloj se
pasa de 85 s**: la cifra se queda en pantalla, en el gancho.

---

## ESCENA 3 · `photo` · [0:17 – 0:32] · ~15 s · PLANO DETALLE

**NARRACIÓN**
> «Y el aumento en ventas ya **venía** de antes: del 1 al 22 de noviembre llevaban 82,500 **millones**
> en compras por internet, un 9% por encima de esas mismas **fechas** de 2025.»

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a la foto de paquetes de reparto apilados, a pantalla completa | Otra foto, nunca la de la escena 1 |
| +1.1 | **cue `venía`** → entra el kicker | `EL AUMENTO EN VENTAS YA VENÍA DE ANTES` |
| +5.6 | **cue `millones`** → entra la cifra con su sujeto completo | `$82,500 M en compras por internet` |
| +11.0 | **cue `fechas`** → entra el chip de comparación | `+9.1% vs. 1–22 de noviembre de 2025`, musgo |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `EL AUMENTO EN VENTAS YA VENÍA DE ANTES` | Rótulo | Arena 70% | +1.1 | fin escena |
| Título | `Del 1 al 22 de noviembre de 2026` | Rótulo | Arena | +0.0 | fin escena |
| Cifra | `$82,500 M en compras por internet` | Contenido y≈1120 | Mostaza | +5.6 | fin escena |
| Chip | `+9.1% vs. 1–22 de noviembre de 2025` | Contenido y≈1280 | Musgo | +11.0 | fin escena |

**CÁMARA.** Plano detalle. **SFX.** Ninguno.
**POR QUÉ EXISTE.** Tu corrección: no es que un día fuera aislado, es que **el fenómeno ya venía**.

---

## ESCENA 4 · `ranking` (escena nueva) · [0:32 – 0:46] · ~14 s · ESQUEMA

**NARRACIÓN**
> «¿Y qué **categorías** subieron más? Contra el promedio de **octubre**: higiene personal 40 por
> ciento, **limpieza** del hogar 33 y ropa **básica** 27.»

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a negro limpio | Es la escena donde hay que leer |
| +0.8 | **cue `categorías`** → entra el titular | `Las categorías que más subieron` |
| +3.0 | **cue `octubre`** → entra la línea de comparación bajo el titular | `Contra el promedio de octubre de 2026` |
| +5.6 | Fila 1: la barra crece de izquierda a derecha en 0.5 s | `Higiene personal` · barra al 100% · `+40%` |
| +8.9 | **cue `limpieza`** → fila 2 | `Limpieza del hogar` · barra al 83% · `+33%` |
| +11.8 | **cue `básica`** → fila 3 | `Ropa básica` · barra al 68% · `+27%` |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `QUÉ SUBIÓ MÁS` | Rótulo | Arena 70% | +0.0 | fin escena |
| Titular | `Las categorías que más subieron` | Rótulo | Arena | +0.8 | fin escena |
| Comparación | `Contra el promedio de octubre de 2026` | Rótulo | Arena 60% | +3.0 | fin escena |
| Fila 1 | `Higiene personal` · `+40%` | Contenido | Barra musgo, texto arena | +5.6 | fin escena |
| Fila 2 | `Limpieza del hogar` · `+33%` | Contenido | Barra musgo, texto arena | +8.9 | fin escena |
| Fila 3 | `Ropa básica` · `+27%` | Contenido | Barra musgo, texto arena | +11.8 | fin escena |
| Fuente | `Adobe Analytics · 1–22 de noviembre de 2026` | Firma | Arena 50% | +12.4 | fin escena |

**CÁMARA.** Esquema a pantalla. Cuarto tamaño distinto seguido.
**SFX.** `[0.06, 'tick', 0.45]` con el titular.
**POR QUÉ EXISTE.** Es tu "gráfica para las categorías", y la pregunta que la abre ahora **sí
corresponde a la respuesta**. Y lo que sale es jabón, limpiador y ropa básica: nada más cotidiano.

---

## ESCENA 5 · `news` · [0:46 – 0:55] · ~9 s · PLANO GENERAL (con tarjeta)

**NARRACIÓN**
> «Eso también se vio en la **bolsa**, que el viernes 27 trabajó media jornada y cerró **arriba**.»

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a la foto del piso de remates, en tarjeta | Vuelve la imagen tras la escena de puro dato |
| +1.8 | **cue `bolsa`** → entra el kicker con la fecha | `VIERNES 27 DE NOVIEMBRE DE 2026 · MEDIA JORNADA` |
| +5.1 | **cue `arriba`** → entran los tres cierres en cascada | Uno cada 0.25 s |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `VIERNES 27 DE NOVIEMBRE DE 2026 · MEDIA JORNADA` | Rótulo | Arena 70% | +1.8 | fin escena |
| Viñeta 1 | `Nasdaq Composite +2.31%` | Contenido | Musgo | +5.1 | fin escena |
| Viñeta 2 | `S&P 500 +1.60%` | Contenido | Musgo | +5.35 | fin escena |
| Viñeta 3 | `Dow Jones +1.18%` | Contenido | Musgo | +5.6 | fin escena |

**CÁMARA.** Plano general con tarjeta. **SFX.** Ninguno.
**POR QUÉ EXISTE.** **Es el puente que pediste** entre las categorías y las empresas. Los cierres van
en porcentaje y no en nivel, porque los niveles del S&P no coinciden entre fuentes.

---

## ESCENA 6 · `ranking` con logos · [0:55 – 1:08] · ~13 s · ESQUEMA CON LOGOS

**NARRACIÓN**
> «Los más **beneficiados**: Shopify subió 6 por ciento, **Mercado Libre** 4 y medio, y **Amazon** casi
> 4. El S&P 500 subió 1.6.»

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a negro limpio | — |
| +0.9 | **cue `beneficiados`** → entra el titular | `Los más beneficiados ese día` |
| +3.1 | Fila 1 con su logo | Logo Shopify · `Shopify` · barra al 100% · `+6.28%` |
| +6.0 | **cue `Mercado Libre`** → fila 2 | Logo MercadoLibre · barra al 71% · `+4.47%` |
| +8.4 | **cue `Amazon`** → fila 3 | Logo Amazon · barra al 63% · `+3.96%` |
| +10.8 | Entra la fila de referencia, separada por una línea | `S&P 500` · barra al 25% · `+1.60%`, en arena y no en musgo |
| +12.0 | Entra la nota aclaratoria, chiquita | `Toda la bolsa subió ese día, con la tecnología al frente` |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `CIERRE DEL 27 DE NOVIEMBRE DE 2026` | Rótulo | Arena 70% | +0.0 | fin escena |
| Titular | `Los más beneficiados ese día` | Rótulo | Arena | +0.9 | fin escena |
| Fila 1 | logo + `Shopify` + `+6.28%` | Contenido | Barra musgo | +3.1 | fin escena |
| Fila 2 | logo + `MercadoLibre` + `+4.47%` | Contenido | Barra musgo | +6.0 | fin escena |
| Fila 3 | logo + `Amazon` + `+3.96%` | Contenido | Barra musgo | +8.4 | fin escena |
| Referencia | `S&P 500` + `+1.60%` | Contenido | Barra arena 40% | +10.8 | fin escena |
| Nota | `Toda la bolsa subió ese día, con la tecnología al frente` | Firma | Arena 50% | +12.0 | fin escena |

**ELEMENTOS.** Tres logos en PNG transparente, de la sala de prensa de cada empresa. Sin tarjeta blanca.
**CÁMARA.** Esquema con logos. **SFX.** `[0.07, 'shine', 0.4]` con la primera fila. Tercero y último.
**POR QUÉ EXISTE.** Es tu ranking de los más beneficiados, con logos, en el estilo del torneo.
**La fila del S&P 500 es deliberada:** sin una referencia, "subió 6%" no se sabe si es mucho o poco.

---

## ESCENA 7 · `statement` · [1:08 – 1:16] · ~8 s · PLANO MEDIO

**NARRACIÓN**
> «Pero no **todos** subieron: eBay cayó 2% y **Target** cerró abajo.»

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a negro limpio | — |
| +1.0 | **cue `todos`** → entran las dos que no subieron | `eBay −1.91%` y, debajo, `Target −0.15%`, en terracota |
| +4.4 | **cue `Target`** → se resalta la segunda fila | El dato de Target pasa de arena a terracota |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `NO TODOS SUBIERON` | Rótulo | Arena 70% | +0.0 | fin escena |
| Dato 1 | `eBay · −1.91%` | Contenido | **Terracota** | +1.0 | fin escena |
| Dato 2 | `Target · −0.15%` | Contenido | **Terracota** | +1.3 | fin escena |

**CÁMARA.** Plano medio. **SFX.** Ninguno.
**POR QUÉ EXISTE.** El video no es una lista de ganadores: **hubo quien cayó el día del récord**. Sin
esta escena el ranking se leería como una recomendación, y con ella se lee como lo que es, un reporte.

---

## ESCENA 8 · `outro` · [1:16 – 1:26] · ~10 s · PRIMER PLANO

**NARRACIÓN**
> «Si ese récord también llegó a las **empresas**, lo veremos cuando **reporten** sus resultados
> trimestrales en febrero. ¿Tú **gastaste** más este Black Friday que el pasado?»

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a la foto de bolsas de compras, a pantalla completa | Velo oscuro |
| +0.0 | Entra JP en 3D, acto `cierre`, 420 px | Abajo a la derecha; el bloque de texto sube 200 px solo |
| +1.6 | **cue `empresas`** → entra la primera línea | `¿El récord llegó también a las empresas?` |
| +4.0 | **cue `reporten`** → entra la fecha | `Lo dirán sus resultados trimestrales · Amazon reporta el 4 de febrero de 2027 (fecha esperada)` |
| +7.0 | **cue `gastaste`** → entra **la pregunta de cierre**, grande | `¿Tú gastaste más este Black Friday que el pasado?`, en mostaza |
| +8.4 | JP se encoge de hombros y señala a cámara | Lo hace el acto `cierre` |
| +8.6 | Entran firma, CTA y aviso legal | Automáticos, de `brand.json` |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Línea 1 | `¿El récord llegó también a las empresas?` | Rótulo | Arena | +1.6 | fin video |
| Fecha | `Amazon reporta el 4 de febrero de 2027 · fecha esperada` | Contenido | Arena 70% | +4.0 | fin video |
| **Pregunta** | `¿Tú gastaste más este Black Friday que el pasado?` | Contenido y≈1300 | **Mostaza** | +7.0 | fin video |
| Firma | `COSTA STUDIO FINANCE · BY JP ARMENDÁRIZ` | Firma | Arena | +8.6 | fin video |
| Aviso | `Contenido educativo. No es asesoría financiera.` | Firma | Arena 50% | +8.6 | fin video |

**CÁMARA.** Primer plano: JP más grande que en el gancho, foto más cerrada.
**SFX.** Ninguno.
**POR QUÉ EXISTE.** Cierra con **la idea dicha completa** —resultados trimestrales, con mes y con la
fecha en pantalla— y con **la pregunta al espectador**, que es lo que faltaba.

---

# 5 · Decisiones de estilo

- **Paleta:** **fondo negro `#0A0A0A`** (tu idea, por el Black Friday) con arena, mostaza, musgo para lo
  que sube y terracota para lo que baja. Son los colores de Costa: el negro ya está en la paleta de la
  marca, solo no se usaba de fondo. Una sola familia en las 8 escenas.
- **Tamaños de plano, en orden:** general → medio → detalle → esquema → general con tarjeta → esquema
  con logos → medio → primer plano. Ningún par consecutivo repite.
- **Logos:** Shopify, MercadoLibre y Amazon, PNG transparente, de la sala de prensa de cada una.
  Sin tarjeta blanca (sobre negro contrastan solos).
- **JP en 3D:** solo escenas 1 y 8. Actos `senala` + `cierre`, vestuario **polo**.
- **Fotos (4):** ① tienda llena con carritos ② paquetes de reparto ③ piso de remates ④ bolsas de compras.
  Reales, licencia libre, ≥1600 px, sujeto limpio, ninguna repetida en escenas seguidas, **ninguna de IA**.
  **Se eligen oscuras o se les baja la exposición**, para que peguen con el fondo negro.
- **SFX: 3 en todo el video** (`thud`, `tick`, `shine`), ninguno repetido, escritos como fracción de la
  escena y comprobados en `build/sfx.json` antes de mezclar.
- **Sin recomendación:** se nombran cinco empresas con su dato del día y ningún juicio sobre ninguna.

---

# 6 · Título y descripción, listos para copiar

**Título** (78 caracteres):
```
Récord de compras por internet: quién ganó el Black Friday #BlackFriday #bolsa
```

**Descripción:**
```
El Día de Acción de Gracias de 2026, Estados Unidos rompió su récord de compras por internet: 7,100 millones de dólares en un día, 10.4% más que ese mismo día de 2025.

📌 Datos clave
• Acción de Gracias de 2026: $7,100 M en compras por internet en EE.UU. (+10.4% vs. 2025)
• Del 1 al 22 de noviembre de 2026: $82,500 M (+9.1% vs. las mismas fechas de 2025)
• Lo que más subió contra el promedio de octubre: higiene personal +40%, limpieza del hogar +33%, ropa básica +27%
• Cierre del viernes 27 de noviembre (media jornada): Nasdaq +2.31%, S&P 500 +1.60%, Dow +1.18%
• Los más beneficiados ese día: Shopify +6.28%, MercadoLibre +4.47%, Amazon +3.96%
• No todos subieron: eBay −1.91% y Target −0.15%

Toda la bolsa subió ese día, con la tecnología al frente, así que estos movimientos no se explican solo por el Black Friday.

¿Tú gastaste más este Black Friday que el pasado?

Fuentes: Adobe Analytics · cierres del 27 de noviembre de 2026 (Yahoo Finance).

Contenido educativo. No es asesoría financiera.
Costa Studio Finance, by JP Armendáriz.

#BlackFriday #consumo #Amazon #bolsa #Shorts
```

---

# 7 · Registro de cambios

- **v1** guion de Amazon · **v2** Black Friday corto · **v3** formato cinematográfico ·
  **v4** fuera Mastercard y las frases que no se entendían.
- **v5 · ésta.** Tus seis correcciones de guion (la tendencia que ya venía, la pregunta que corresponde
  a su respuesta, el puente a la bolsa, dos empresas más, el cierre dicho completo y **la pregunta
  final que faltaba**) y tu dirección visual (fondo negro, logos, ranking, fotos). Entra el contrapunto
  de eBay y Target, y la declaración de tu posición en Mercado Libre.
- **v6 · 27 nov 2026.** Tus cuatro últimas correcciones: `10%` con dígitos, «el aumento en ventas ya
  venía de antes» (y sin repetir "más" en la frase), «el viernes 27» en vez de «ese viernes», y **fuera
  la declaración de posición**. Maqueta construida y revisada en la hoja de QA.
  **Pendiente: las fotos.** Flickr solo da 1024 px (tu mínimo es 1600) y Wikimedia no responde desde el
  contenedor. La maqueta está armada sin ellas; se pueden añadir sin tocar nada más.
