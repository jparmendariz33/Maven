# Short de contexto · BLACK FRIDAY · viernes 27 de noviembre de 2026

**Formato:** short vertical de contexto (`/short` §1c) · 7 escenas · **123 palabras / 661 caracteres**
(sin voz el rango es 100–125 palabras; `script_check.py` pide 650–950 caracteres)
**Duración estimada:** **68 s**. Calculada a 120 palabras/min contando sílabas, que es como mide
`no_voice.py` para la voz de JP. La medición real se corre al aprobar el texto. **Si se pasa de 85 s,
el recorte sale de la escena 2** (es la que menos aporta al argumento).
**Se publica:** hoy 19:00 CDMX · **JP graba su voz** (Voz en off en la app de YouTube)
**Estado:** 🚦 PRIMERA PUERTA — esperando OK. No se ha construido nada.

> Escrito con el formato de [`plan/guion-de-rodaje.md`](../../plan/guion-de-rodaje.md), estrenado hoy.

---

# 1 · El ángulo

**Lo que dijeron TODOS:** Black Friday, Acción de Gracias, "récord de compras", sesión corta de bolsa.
**Lo que dijo CASI NADIE:** que más de la mitad de ese crecimiento no es gente comprando más cosas,
sino las mismas cosas más caras.
**Cifras donde los medios no coinciden:** el cierre del S&P 500 (7,297.49 según unos, 7,302.10 según
otros) y el monto del Black Friday (que además todavía es pronóstico). **Las dos se resuelven abajo:
el cierre del S&P no entra como nivel, solo como porcentaje, y el monto del Black Friday no entra.**

**Por qué dura meses:** la frase final —*un récord en dólares no siempre es un récord en cosas*— sigue
siendo cierta en enero, en el Buen Fin y leyendo las ventas de cualquier empresa. Por eso no aparece
"hoy" en ninguna parte y todas las fechas van completas.

**Motor narrativo:** *desmontaje* — un titular que casi todos creen y la cuenta dice otra cosa.
Es el motor más usado del canal y el que mejor le va a una cifra que todo el mundo va a repetir.

---

# 2 · Tabla de verdad de los datos

| Cifra | Estado | Fuente | ¿Entra? |
|---|---|---|---|
| Acción de Gracias 2026: **$7,100 M** en línea en EE.UU. | **Hecho ocurrido** | Adobe Analytics | Sí — es el gancho |
| Ese gasto fue **+10.4%** vs. 2025 | **Hecho ocurrido** | Adobe Analytics | Sí — ficha de la escena 1 |
| 1–22 nov 2026: **$82,500 M** en línea, **+9.1%** | **Hecho ocurrido** | Adobe Analytics | Sí — escena 2 |
| Temporada: **+5.5%**, de los cuales **2.8 puntos** son precio | ⚠️ **PRONÓSTICO** | Mastercard Economics Institute | Sí, **dicho y rotulado como proyección** |
| Cierre 27 nov (media jornada): **Nasdaq +2.31% · S&P 500 +1.60% · Dow +1.18%** | **Hecho** | Cierres del día | Sí — escena 5 |
| Inflación **PCE de octubre de 2026: 3.8%** anual | **Hecho** | Oficina de Análisis Económico (BEA) | Solo en pantalla, al pie de la escena 4 |
| Black Friday: **$12,900 M**, "récord" | ⚠️ **PRONÓSTICO de Adobe. El dato real no existe todavía.** | Adobe | **NO** |
| Temporada: $1.013 billones (NRF) | Pronóstico | NRF | No — sobra |

**Comprobación aritmética de la escena 4:** 5.5 − 2.8 = **2.7 puntos**. Es la resta explícita que hace
Mastercard al decir cuánto del crecimiento viene de precios; no es una estimación mía.

**Nada lleva la marca `ilustrativo`:** no hay ningún número simulado. Lo que hay son dos proyecciones,
y ésas se rotulan **`PROYECCIÓN`** con quién la hace, que es distinto.

**La regla que estoy respetando y que es la más delicada de esta pieza:** en ningún momento digo que el
Black Friday rompió un récord. El récord que sí está medido y ya ocurrió es el del Día de Acción de
Gracias, y ése es el único que afirmo.

---

# 3 · Desglose escena por escena

> Los tiempos van **relativos al inicio de cada escena** (`+0.0 s`), porque los absolutos se mueven con
> la medición de la voz. Las palabras en **negrita** dentro de la narración son los `cue`: el elemento
> entra exactamente cuando se dice esa palabra.

---

## ESCENA 1 · `hook` · [0:00 – 0:09] · ~9 s · PLANO GENERAL

**NARRACIÓN**
> «El Día de Acción de Gracias de 2026, Estados Unidos **gastó** 7,100 millones de dólares en línea.
> **Récord**.»

**GUION DE TIEMPOS**

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | La voz ya está hablando y la música ya tiene cuerpo | Sin rampa, sin respiración previa. `music3d` entra al 36%, no al 15% |
| +0.0 | Entra la foto a toda pantalla | Fija, sin zoom de entrada. Deriva lenta de cámara (la que hace el motor sola) |
| +0.0 | Entra el kicker y la primera línea del rótulo | `ACCIÓN DE GRACIAS 2026` y `Estados Unidos gastó` |
| +0.0 | Entra JP en 3D | Ya está en cuadro desde el primer fotograma, no entra caminando |
| +2.6 | **cue `gastó`** → cae la cifra grande | Sube desde 40 px abajo con `rise`, 0.35 s, mostaza |
| +3.0 | JP reacciona a la cifra | Gira la cabeza hacia el centro y levanta la mano: acto `senala`, `mood: up` |
| +7.4 | **cue `Récord`** → cae la segunda línea, en dos tiempos | 0.3 s después de la cifra, en mostaza, debajo |
| +8.0 | Entra la ficha de contexto, chica | `+10.4% vs. 2025 · Adobe Analytics` |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `ACCIÓN DE GRACIAS 2026` | Rótulo (y≈300) | Arena 70% | +0.0 | con la escena |
| Título | `Estados Unidos gastó` | Rótulo (y≈420) | Arena | +0.0 | con la escena |
| Cifra | `$7,100 millones en línea en un día` | Rótulo (y≈560) | Mostaza | +2.6 | con la escena |
| Remate | `Récord` | Rótulo (y≈700) | Mostaza, serif itálica | +7.4 | con la escena |
| Ficha | `+10.4% vs. 2025 · Adobe Analytics` | Contenido (y≈980) | Arena 60%, chica | +8.0 | con la escena |
| Subtítulo | el `say`, palabra por palabra | Subtítulo (y≈1650) | Blanco sobre píldora | sigue a la voz | — |

**ELEMENTOS Y ACCIONES**

| Elemento | Entra | Qué hace | Sale | Posición / capa |
|---|---|---|---|---|
| Foto `bg_full` | +0.0 | Nada: fija, con velo oscuro al 55% para que el texto se lea | con la escena | Fondo, detrás de todo |
| JP en 3D | +0.0 | A los +3.0 voltea al centro y señala la cifra. Mira solo hacia el centro, nunca a la cámara | con la escena | Abajo a la IZQUIERDA (`pos: bl`), 500 px |

**CÁMARA.** Plano general: la foto llena el cuadro. Solo la deriva lenta del motor (1.8% en toda la
escena). **Ningún zoom de entrada:** el gancho se tiene que ver antes de entenderse, y un plano que se
abre es un acertijo (lección del short de Anthropic).

**SFX.** `[0.00, 'thud', 0.5]` — un golpe seco en el cuadro 1, junto con la cifra. **Uno solo.**

**DATOS.** $7,100 M y +10.4%: Adobe Analytics, hecho ya ocurrido.

**POR QUÉ EXISTE.** Es el gancho: la cifra que todos van a repetir, dicha en las primeras 8 palabras,
con la marca del día y con JP identificando el canal.

---

## ESCENA 2 · `photo` · [0:09 – 0:17] · ~8 s · PLANO DETALLE

**NARRACIÓN**
> «Del 1 al 22 de noviembre ya **llevaba** 82,500 millones, 9 por ciento **más**.»

**GUION DE TIEMPOS**

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a la foto de paquetes | **Corte seco**, sin ola: es el mismo "lugar" (el consumo), solo cambia el tamaño de plano |
| +0.0 | Entra el kicker | `ANTES DE QUE EMPEZARA` |
| +1.9 | **cue `llevaba`** → entra la cifra | `rise` desde abajo, 0.3 s |
| +4.6 | **cue `más`** → entra el chip de comparación | Aparece a la derecha de la cifra, en musgo (sube) |
| +7.6 | JP **no** está en esta escena | Regla de la casa: en los shorts JP solo sale en el gancho y en el cierre |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `ANTES DE QUE EMPEZARA` | Rótulo | Arena 70% | +0.0 | con la escena |
| Título | `1 al 22 de noviembre de 2026` | Rótulo | Arena | +0.0 | con la escena |
| Cifra | `$82,500 M en compras en línea` | Contenido (y≈1150) | Mostaza | +1.9 | con la escena |
| Chip | `+9.1% vs. 2025` | Contenido (y≈1150, a la derecha) | Musgo | +4.6 | con la escena |
| Pie de foto | autor · licencia | Firma | Arena 50% | +0.0 | con la escena |

**ELEMENTOS Y ACCIONES.** Solo la foto (paquetes de reparto apilados), a pantalla completa sobre negro,
fija. **No es la misma foto de la escena 1** — si se repite, se lee como si la escena no hubiera cambiado.

**CÁMARA.** Plano detalle: los paquetes llenan el cuadro. Cambia de tamaño respecto al general de la
escena 1, que es lo que hace que se lea como escena nueva.

**SFX.** Ninguno. (El silencio también es un recurso, y vienen dos escenas con efecto.)

**DATOS.** $82,500 M y +9.1%: Adobe Analytics, hecho ocurrido.

**POR QUÉ EXISTE.** Da la escala: el récord de un día no fue un pico aislado, venía de tres semanas
igual de fuertes. Es la escena que se recorta si el reloj se pasa.

---

## ESCENA 3 · `news` · [0:17 – 0:30] · ~13 s · PLANO MEDIO (tarjeta)

**NARRACIÓN**
> «Pero **cuidado** con la palabra récord. Mastercard **proyecta** que las ventas de la temporada
> crezcan 5.5 por ciento, y que 2.8 de esos puntos sean solo **precios**.»

**GUION DE TIEMPOS**

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a fondo arena, sin foto | El cambio de fondo marca el giro del argumento |
| +0.9 | **cue `cuidado`** → entra el kicker | En terracota, que es el color de "ojo con esto" |
| +3.4 | **cue `proyecta`** → entra el titular | `fitLines` lo achica si hace falta; nunca se acorta el texto |
| +6.0 | Entra la viñeta 1 | Deslizándose 20 px desde la izquierda |
| +9.8 | **cue `precios`** → entra la viñeta 2, destacada | Misma animación, pero en terracota y 10% más grande |
| +12.0 | Entra la fuente al pie | `Mastercard Economics Institute` |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `PROYECCIÓN · NO ES UN DATO CERRADO` | Rótulo | **Terracota** | +0.9 | con la escena |
| Titular | `Mastercard proyecta +5.5% en la temporada` | Rótulo | Arena | +3.4 | con la escena |
| Viñeta 1 | `2.7 puntos · más cosas vendidas` | Contenido | Musgo | +6.0 | con la escena |
| Viñeta 2 | `2.8 puntos · precios más altos` | Contenido | **Terracota** | +9.8 | con la escena |
| Fuente | `Mastercard Economics Institute · 1 nov – 24 dic de 2026` | Firma | Arena 50% | +12.0 | con la escena |

**ELEMENTOS Y ACCIONES.** Ningún personaje, ninguna foto. Solo texto sobre fondo arena: es la escena
donde hay que leer, y cualquier imagen competiría.

**CÁMARA.** Plano medio de tarjeta. Tercer tamaño distinto seguido (general → detalle → medio).

**SFX.** `[0.07, 'tick', 0.45]` en el kicker. Uno solo, y distinto del de la escena 1.

**DATOS.** +5.5% y 2.8 puntos: **proyección** del Mastercard Economics Institute. La palabra
`PROYECCIÓN` va en el kicker **y** la voz dice "proyecta": no se puede leer como hecho ni oyéndolo ni
viéndolo.

**POR QUÉ EXISTE.** Es el giro. Introduce la idea de que el crecimiento tiene dos partes y que una de
ellas no es buena noticia.

---

## ESCENA 4 · `waterfall` · [0:30 – 0:40] · ~10 s · ESQUEMA A PANTALLA

**NARRACIÓN**
> «De ese **crecimiento**, más de la mitad son **precios** más altos. Lo que de verdad se llevó la
> **gente** creció menos de 3 puntos.»

**GUION DE TIEMPOS**

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Entran los ejes y el subtítulo de escala | Vacíos, antes de las barras: así se entiende la unidad antes del dato |
| +1.2 | **cue `crecimiento`** → sube la barra azul | Crece de abajo hacia arriba en 0.4 s, `5.5 pp` |
| +4.1 | **cue `precios`** → baja el escalón rojo | Cae desde lo alto de la azul, `(2.8 pp)`. Es el que más pesa: se queda 0.6 s solo antes de la siguiente |
| +7.6 | **cue `gente`** → aparece la barra verde | `2.7 pp`, el resto |
| +9.0 | Entra el pie con la inflación | Chiquito, debajo de los ejes |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `PROYECCIÓN DE LA TEMPORADA` | Rótulo | Arena 70% | +0.0 | con la escena |
| Título | `De dónde sale ese crecimiento` | Rótulo | Arena | +0.0 | con la escena |
| Subtítulo | `En puntos porcentuales · 1 nov – 24 dic de 2026` | Rótulo | Arena 60% | +0.0 | con la escena |
| Barra 1 | `Crecimiento` · texto forzado `5.5 pp` | Contenido | **Azul** (funcional) | +1.2 | con la escena |
| Barra 2 | `Precios más altos` · texto forzado `(2.8 pp)` | Contenido | **Rojo** (funcional) | +4.1 | con la escena |
| Barra 3 | `Más cosas vendidas` · texto forzado `2.7 pp` | Contenido | **Verde** (funcional) | +7.6 | con la escena |
| Pie | `Referencia: inflación PCE de octubre de 2026, 3.8% anual · BEA` | Firma | Arena 50% | +9.0 | con la escena |

**Configuración de la escena:** `percent: false` — **obligatorio**. Si no, el motor calcula
"porcentajes sobre las ventas" encima de unos números que ya son porcentajes, y sale un disparate. El
monto de cada barra va forzado con `text`, ya escrito con la convención (paréntesis para lo que resta).

**ELEMENTOS Y ACCIONES.** Ningún personaje. Las barras son el movimiento de la escena: una sube, una
cae, una queda.

**CÁMARA.** Esquema a pantalla completa, sin deriva. Cuarto tamaño distinto.

**SFX.** `[0.41, 'drop', 0.55]` justo cuando cae el escalón rojo. Es la única escena donde algo "cae",
así que se gana el efecto.

**DATOS.** 5.5 − 2.8 = 2.7. La resta la hace Mastercard, no yo. Inflación PCE 3.8%: BEA, hecho.

**POR QUÉ EXISTE.** Enseña la idea en vez de decirla. Es el corazón del video.

---

## ESCENA 5 · `news` · [0:40 – 0:50] · ~10 s · PLANO GENERAL (con tarjeta)

**NARRACIÓN**
> «Y la sesión del viernes 27 fue media **jornada**: cerró arriba, y la que la subió fue la
> **tecnología**.»

**GUION DE TIEMPOS**

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a la foto del piso de remates, en tarjeta | Vuelve la imagen después de dos escenas de puro dato |
| +0.0 | Entra el kicker con la fecha completa | `VIERNES 27 DE NOVIEMBRE DE 2026 · MEDIA JORNADA` |
| +2.3 | **cue `jornada`** → entran los tres cierres, en cascada | Uno cada 0.25 s, de arriba abajo |
| +7.1 | **cue `tecnología`** → se destaca el Nasdaq | La viñeta del Nasdaq crece 8% y pasa a mostaza; las otras dos bajan a 60% de opacidad |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `VIERNES 27 DE NOVIEMBRE DE 2026 · MEDIA JORNADA` | Rótulo | Arena 70% | +0.0 | con la escena |
| Titular | `La bolsa cerró arriba` | Rótulo | Arena | +0.0 | con la escena |
| Viñeta 1 | `Nasdaq Composite +2.31%` | Contenido | Musgo → **mostaza** a los +7.1 | +2.3 | con la escena |
| Viñeta 2 | `S&P 500 +1.60%` | Contenido | Musgo → 60% opacidad a los +7.1 | +2.55 | con la escena |
| Viñeta 3 | `Dow Jones +1.18%` | Contenido | Musgo → 60% opacidad a los +7.1 | +2.8 | con la escena |

**ELEMENTOS Y ACCIONES.** Foto del piso de remates en tarjeta (no a pantalla completa: el dato manda
en esta escena). **Máximo 3 viñetas**, que es el tope del motor con imagen.

**CÁMARA.** Plano general otra vez, pero con tarjeta, así que no se confunde con la escena 1.

**SFX.** Ninguno. La cascada de tres viñetas ya tiene ritmo propio.

**DATOS.** Los tres cierres del 27 de noviembre de 2026, media jornada. **Van en porcentaje, no en
nivel**, justo porque los niveles del S&P no coinciden entre fuentes.

**POR QUÉ EXISTE.** Es lo que pidió JP: cerrar el círculo entre el día de compras y el mercado. Y dice
algo verdadero y poco obvio — el día del consumo, a la bolsa la movió otra cosa.

---

## ESCENA 6 · `catalyst` · [0:50 – 1:00] · ~10 s · PLANO DETALLE

**NARRACIÓN**
> «Lo dirán las ventas de **diciembre**, ya descontada la **inflación**.»

**GUION DE TIEMPOS**

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a la foto de etiquetas de precio, a pantalla completa | Fondo de marca apagado: aquí manda la foto |
| +1.4 | **cue `diciembre`** → entra la ficha grande | `rise`, 0.3 s |
| +4.0 | **cue `inflación`** → entra la línea de abajo | Más chica, en arena 70% |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Kicker | `QUÉ LO VA A RESOLVER` | Rótulo | Arena 70% | +0.0 | con la escena |
| Ficha | `Las ventas minoristas de diciembre` | Contenido | Mostaza | +1.4 | con la escena |
| Sub | `ya descontada la inflación` | Contenido | Arena 70% | +4.0 | con la escena |

**ELEMENTOS Y ACCIONES.** Solo la foto. Ningún personaje.

**CÁMARA.** Plano detalle. Distinto del general de la escena 5.

**SFX.** `[0.14, 'shine', 0.4]` con la ficha. Cuarto y último efecto del video.

**DATOS.** Ninguna cifra nueva: es la promesa de qué mirar después, no un dato.

**POR QUÉ EXISTE.** §1c manda que el cierre de un short de contexto sea **qué vigilar en los próximos
meses**, con un evento concreto. Aquí el evento son las ventas de diciembre en términos reales.

---

## ESCENA 7 · `outro` · [1:00 – 1:08] · ~8 s · PLANO MEDIO

**NARRACIÓN**
> «Un récord en **dólares** no siempre es un récord en **cosas**.»

**GUION DE TIEMPOS**

| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | Corte a la foto de la bolsa de compras, a pantalla completa | Con velo oscuro |
| +0.0 | Entra JP en 3D, acto `cierre` | Junto al bloque de texto, abajo a la derecha, 420 px |
| +1.6 | **cue `dólares`** → entra la primera mitad de la frase | `Un récord en dólares` |
| +3.4 | **cue `cosas`** → entra la segunda, en mostaza | `no siempre es un récord en cosas` |
| +5.0 | JP se encoge de hombros y señala a cámara | Es lo que hace el acto `cierre` |
| +6.0 | Entran firma, CTA y aviso legal | Automáticos, salen de `brand.json` |

**EN PANTALLA**

| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|
| Frase A | `Un récord en dólares` | Rótulo | Arena | +1.6 | con el video |
| Frase B | `no siempre es un récord en cosas` | Rótulo | Mostaza | +3.4 | con el video |
| Firma | `COSTA STUDIO FINANCE · BY JP ARMENDÁRIZ` | Firma | Arena | +6.0 | con el video |
| Aviso | `Contenido educativo. No es asesoría financiera.` | Firma | Arena 50% | +6.0 | con el video |

**ELEMENTOS Y ACCIONES.** JP en 3D, acto `cierre`, vestuario **polo** (distinto del `piensa` + blazer
del short de Nvidia del 17 de noviembre). Mira al centro, no a la cámara, hasta el gesto final.

**CÁMARA.** Plano medio. El bloque de texto sube 200 px porque JP ocupa la esquina de abajo (lo hace el
motor solo cuando hay `host` en un `outro`).

**SFX.** Ninguno.

**POR QUÉ EXISTE.** El cierre es **un principio general**, no un veredicto sobre ninguna acción, y
sigue siendo cierto el año que viene. No hay pregunta en dos partes a propósito: ese molde ya se usó
mucho y `voz-jp.md` pide variarlo.

---

# 4 · Dos cosas que rompo a propósito

1. **El gancho no identifica una empresa.** La regla pide logo o foto de la empresa en el primer cuadro.
   Aquí no hay empresa: el sujeto es el consumidor de Estados Unidos. Lo identifico con la imagen del
   día y con la fecha en el kicker. **Si prefieres que entre algún logo, dímelo y lo cambio.**
2. **La cascada no es un estado de resultados**, son puntos porcentuales de una proyección. Uso la misma
   gramática visual de la casa porque es la misma idea —de dónde sale el total y qué se le va— con
   `percent: false` para que el motor no calcule porcentajes sobre porcentajes.

---

# 5 · Decisiones de estilo

- **Paleta:** sin color de marca (no hay empresa) → **arena Costa** de principio a fin, mostaza como
  acento y terracota solo para la parte "ojo con esto". Una sola familia de color en las 7 escenas.
- **Tamaños de plano, en orden:** general → detalle → medio → esquema → general con tarjeta → detalle →
  medio. **Ningún par consecutivo repite tamaño.**
- **JP en 3D:** solo escenas 1 y 7. Actos `senala` + `cierre`, vestuario **polo**.
- **Fotos (4, ninguna repetida en escenas seguidas):** ① tienda llena o carritos ② paquetes de reparto
  ③ piso de remates ④ etiquetas de precio o bolsa de compras. Reales, licencia libre, ≥1600 px, sujeto
  limpio. **Ninguna generada con IA.**
- **SFX: 4 en todo el video** (`thud`, `tick`, `drop`, `shine`), ninguno repetido, todos escritos como
  **fracción de la escena**, y se comprueban en `build/sfx.json` antes de mezclar.
- **Sin recomendación:** no se nombra ninguna acción para comprar ni vender.

---

# 6 · Título y descripción, listos para copiar

**Título** (75 caracteres):
```
Récord de compras en Acción de Gracias: cuánto es precio #BlackFriday #bolsa
```

**Descripción:**
```
El Día de Acción de Gracias de 2026 se gastaron 7,100 millones de dólares en línea en Estados Unidos, el máximo de la historia. Pero un récord en dólares no siempre es un récord en cosas.

📌 Datos clave
• Acción de Gracias de 2026: $7,100 M en línea, 10.4% más que en 2025 (Adobe Analytics)
• Del 1 al 22 de noviembre de 2026: $82,500 M en línea, +9.1%
• Mastercard proyecta que la temporada crezca 5.5%, y que 2.8 de esos puntos sean precios más altos
• Inflación PCE de octubre de 2026: 3.8% anual
• Cierre del viernes 27 de noviembre (media jornada): Nasdaq +2.31%, S&P 500 +1.60%, Dow +1.18%

¿Compraste más cosas este año, o lo mismo más caro?

Fuentes: Adobe Analytics · Mastercard Economics Institute (proyección) · Oficina de Análisis Económico de EE.UU. · cierres del 27 de noviembre de 2026.

Contenido educativo. No es asesoría financiera.
Costa Studio Finance, by JP Armendáriz.

#BlackFriday #consumo #inflación #bolsa #Shorts
```

**Títulos alternativos:**
1. `Se gastaron $7,100 millones en un día: cuánto fue precio #BlackFriday #bolsa`
2. `El récord de compras que no es tan récord #BlackFriday #inflación`

---

# 7 · Registro de cambios

- **v1** · 27 nov 2026 · guion de Amazon, descartado por JP: *"de Amazon no hubo ninguna noticia en
  particular, hay que rebotarlo con lo del Black Friday"*. Archivado en `videos/2026-11-27-AMZN/`.
- **v2** · 27 nov 2026 · Black Friday, versión corta (7 escenas, 125 palabras).
- **v3** · 27 nov 2026 · **esta.** Reescrita con el formato de `plan/guion-de-rodaje.md` a petición de
  JP: guion de tiempos por escena, cada rótulo con su hora de entrada y de salida, cada acción del
  personaje, cada efecto y la tabla de verdad de los datos. 123 palabras / 661 caracteres.
