# El guion de rodaje · formato obligatorio, los cuatro formatos

**Pedido por JP el 27 de noviembre de 2026:** *"quiero que sea muy detallado, o sea, literal cada frase
me digas en qué momento, cómo, cuándo; si un personaje va a decir algo, cómo y cuándo; si va a hacer una
acción también; si va a aparecer un objeto. Que no falte absolutamente nada, literal como si fuera un
guion cinematográfico, para que podamos evitar mucho retrabajo."*

## Por qué existe

La historia del interés compuesto se llevó el **32% de los créditos de la semana** en **seis renders**.
Las seis rondas de correcciones no fueron sobre el guion hablado: fueron sobre **lo que se veía** — qué
tapaba a qué, dónde estaba el personaje, cuándo aparecía una etiqueta. Nada de eso estaba escrito en
ningún lado antes de construirlo, así que la única manera de que JP lo viera era renderizarlo.

**El guion de rodaje es el documento donde JP corrige en texto lo que si no corregiría en video.**
Un cambio en texto cuesta cero; el mismo cambio en un MP4 cuesta media hora de máquina y, si hay que
regenerar la voz, créditos.

## Las dos puertas (ninguna se salta)

1. **`guion.md` → OK de JP.** Hasta entonces no se escribe una línea de `storyboard.json` ni de `story.js`.
2. **Hoja de QA + cuadros sueltos → OK de JP.** Hasta entonces no se genera voz ni se renderiza.

**"Haz el contenido de hoy" no es la luz verde de ninguna de las dos.** Pedir la pieza y aprobar cómo se
ve son cosas distintas. Si JP pide el contenido, lo que se entrega es el `guion.md`, no el video.

## Vale para TODO, no solo para 3D

JP, el 27 nov 2026: *"este no va a ser en 3D, los videos de contexto los vamos a mantener más simple,
pero igual hay que hacerlo con el mayor detalle posible para justo evitar todo esto."* El nivel de
detalle no depende de la técnica: depende de cuánto cuesta rehacerlo, y rehacer un short cuesta igual.

---

# La plantilla

Se guarda como `guion.md` en la carpeta de la pieza. Las secciones 1 a 4 son obligatorias siempre.

## 1 · Cabecera

```
# <Formato> · <TEMA> · <día y fecha completa>

**Formato:** <skill y sección> · <n> escenas · <N> palabras / <N> caracteres
**Duración estimada:** <N> s   (cómo se calculó, y qué escena se recorta si se pasa)
**Se publica:** <día y hora> · <quién pone la voz>
**Estado:** 🚦 PRIMERA PUERTA — esperando OK. No se ha construido nada.
```

## 2 · El ángulo y los titulares

- **Lo que dijeron TODOS** (con eso se abre) · **lo que dijo CASI NADIE** (ése es el cuerpo) ·
  **las cifras donde los medios no coinciden** (alerta roja: fuente primaria u omitir).
- **Por qué dura meses** — la frase que seguirá siendo cierta dentro de seis meses.
- **El motor narrativo elegido, y por qué** en una línea.

## 3 · La tabla de verdad de los datos

Una fila por cifra. **Esta tabla es la que impide publicar un pronóstico como si fuera un hecho.**

| Cifra | Estado | Fuente | ¿Entra? |
|---|---|---|---|
| … | Hecho ocurrido / **Pronóstico** / Cálculo propio | … | Sí, como … / No, porque … |

Y debajo: las comprobaciones aritméticas escritas (que los segmentos sumen el total, que los
porcentajes den 100), y qué va rotulado **`ilustrativo`**.

## 4 · El desglose por escena — el corazón del documento

**Una escena por bloque, y cada bloque lleva las siete partes.** Los tiempos son relativos al inicio
de la escena (`+0.0 s`), porque los absolutos cambian con cada medición de la voz.

```
### ESCENA n · `tipo` · [mm:ss – mm:ss] · dur ~N s · PLANO: <general|entero|medio|primer plano|detalle>

**NARRACIÓN** (palabra por palabra, con los disparadores en negrita)
> «…»

**GUION DE TIEMPOS** — qué pasa, cuándo y cómo
| t | Qué pasa | Cómo |
|---|---|---|
| +0.0 | … | … |

**EN PANTALLA** — cada rótulo literal, con su banda y su color
| Elemento | Texto literal | Banda | Color | Entra | Sale |
|---|---|---|---|---|---|

**ELEMENTOS Y ACCIONES** — cada objeto y cada movimiento
| Elemento | Entra | Qué hace | Sale | Posición / capa |
|---|---|---|---|---|

**CÁMARA** — tamaño de plano, de dónde a dónde, y por qué cambia respecto a la escena anterior.

**SFX** — fracción (0..1), nombre, volumen. Máximo 6–8 en toda la pieza.

**DATOS DE ESTA ESCENA** — cada cifra con su fuente y su estado.

**POR QUÉ EXISTE ESTA ESCENA** — una línea. Si no se puede escribir, la escena sobra.
```

### Las reglas que el desglose tiene que hacer explícitas

- **Toda etiqueta dice cuándo ENTRA y cuándo SALE.** Una etiqueta sin hora de salida es la causa número
  uno de encimados (regla L3.6 de `anatomia-formatos.md`).
- **Todo personaje dice qué hace, no solo que está.** "JP en 3D abajo a la derecha" no basta: qué acto,
  qué humor, hacia dónde mira, en qué segundo reacciona.
- **Todo objeto dice en qué capa va.** En 3D, su z; en 2D, su banda. Si dos comparten capa y se cruzan
  en pantalla, hay que decir cuál gana.
- **Dos escenas seguidas nunca comparten tamaño de plano**, y el documento lo tiene que enseñar de un
  vistazo: por eso el tamaño va en la cabecera de cada escena.
- **Cada `cue`** (la palabra del `say` que dispara un elemento) **va en negrita en la narración**, y es
  una palabra distintiva, nunca un número ni un artículo.

## 5 · Decisiones de estilo

Una línea por decisión: paleta (una sola familia de color), motor narrativo, fotos previstas,
vestuario y actos del personaje (distintos a los de la pieza anterior), y **qué reglas de la casa se
rompen a propósito y por qué**.

## 6 · Título y descripción, ya listos para copiar

Con la cuenta de caracteres del título. Así JP los corrige junto con el guion y no al final.

## 7 · Registro de cambios

Una línea por versión, con qué cambió y por qué. Las correcciones de JP se anotan aquí, no se
sobreescriben en silencio.

---

## El error que esta plantilla evita, con nombre

En la historia del interés compuesto, el rótulo `$160 al mes` **estaba programado desde el principio** y
aun así no salió en pantalla durante seis renders: lo colgué de un grupo y le escribí coordenadas de
mundo, así que acabó fuera de cuadro sin dar ningún error. Cuando por fin salió, chocaba con el
subtítulo, porque nunca escribí cuándo tenía que apagarse.

Las dos cosas —**dónde va exactamente** y **cuándo entra y cuándo sale**— son casillas de esta
plantilla. Escritas antes, cuestan un minuto. Descubiertas después, costaron dos renders.
