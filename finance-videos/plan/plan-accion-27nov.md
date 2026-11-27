# Dos planes de acción · 27 de noviembre de 2026

Pedidos por JP al cerrar la sesión de la historia del interés compuesto.
**Ninguno está ejecutado. El A espera tu luz verde; del B ya me diste permiso para llegar al guion.**

---

# PLAN A · Subir los aprendizajes de esta sesión a las skills

## El problema, con número

La historia del interés compuesto se llevó **el 32% de tus créditos de Claude de la semana**. No fue
por el video: fue por **seis renders completos** de 36 a 68 minutos cada uno, porque las correcciones
llegaron *después* de renderizar en vez de antes.

Seis rondas de correcciones tuyas, y casi todas eran defectos que **un solo cuadro suelto habría
enseñado gratis**: la escalera tapando la casa, las llantas cuadradas, el rótulo fuera de cuadro, el
texto encimado. El render no descubrió ninguno — lo descubriste tú, viendo el MP4.

**Por eso el Plan A no es "documentar lo aprendido". Es convertir cada aprendizaje en algo que se
revise ANTES de gastar máquina**, y hacerlo para todos los formatos, no solo para el 3D.

## Qué voy a tocar

| Archivo | Qué le entra |
|---|---|
| `.claude/skills/historia/SKILL.md` | Las reglas de maqueta, profundidad, rótulos y audio, con el checklist previo al render |
| `.claude/skills/short/SKILL.md` | Las mismas reglas traducidas al motor 2D: capas, zona segura, data labels, efectos |
| `.claude/skills/publicacion/SKILL.md` | Zona segura, data labels y "nada encimado" en láminas |
| `.claude/skills/largo/SKILL.md` | Lo mismo para 16:9, más el checklist previo al render |
| `finance-videos/plan/anatomia-formatos.md` | Una sección nueva: "Reglas de limpieza visual, comunes a todos los formatos" |
| `finance-videos/CLAUDE.md` | Reordenar: las reglas de esta sesión están sueltas al final; van a sus bloques |

## Los aprendizajes, agrupados, y cómo se generalizan

### A1 · Nada se encima con nada (tu corrección más repetida: la pediste cuatro veces)

En 3D fue la escalera tapando la casa y el barco. En 2D es exactamente el mismo defecto: un data label
sobre el subtítulo, el título sobre la cifra, JP en 3D tapando el dato.

- **La regla que descubrimos: antes de pelearse con los valores, escribe las desigualdades.** Si se
  contradicen entre sí, no hay combinación de números que funcione y **hay que cambiar la estructura**,
  no los valores. Yo intenté tres veces con números distintos antes de darme cuenta.
- **La estructura que sí funciona son capas declaradas**, no ajustes: en 3D, un nivel de fondo
  (gráfica y objetos enrasados) y uno de frente (la pasarela del personaje). En 2D, **bandas fijas**:
  rótulo arriba, contenido en medio, subtítulo abajo, y nadie invade la del otro.
- **En 2D esto se vuelve una tabla de bandas en píxeles** que entra a los tres skills, para que ningún
  elemento se coloque "a ojo".

### A2 · La franja de arriba es del texto, y se despeja sola

- El 49% de arriba es del rótulo; nada de la escena entra ahí.
- No se consigue moviendo la cámara escena por escena: se consigue con una función que recibe los
  límites de la acción y despeja la franja ella sola (`encuadra()`).
- **Con la cámara a nivel el horizonte cae siempre en el 50%**, así que alejar un objeto alto no lo
  baja nunca: hay que hacer que el fondo crezca con la historia.
- **Dale la medida real, no la que crees.** Le puse 1.95 al personaje y mide 2.35.
- **En 2D el equivalente ya existe** (`fitLines` achica hasta que quepa) pero no está dicho como regla:
  **nunca se arregla un encimado acortando el texto**. Eso va a los tres skills.

### A3 · Los data labels (el que nombraste explícitamente)

Siete reglas que salieron todas de esta sesión:

1. **La etiqueta va a la misma profundidad que el objeto que nombra**, y se separa solo en altura.
2. **Su texto sale de la misma variable que el contador**, nunca escrito a mano, o un día dirán cosas
   distintas.
3. **Un hijo se posiciona en coordenadas locales**, no de mundo. Este me costó el `$160 al mes`: acabó
   en x = −14, fuera de cuadro, sin dar ningún error.
4. **El texto que no cabe en el lienzo se recorta en silencio:** `caracteres × 0.62 × tamaño ≤ pw`.
5. **El rótulo se agranda con la fuente, no con el plano.**
6. **La etiqueta vive solo mientras la voz habla de eso.** Si se queda, tarde o temprano la cámara se
   mueve y el subtítulo le cae encima. Éste es el más nuevo y el que más se generaliza: **en shorts,
   rankings y publicaciones, un rótulo que no se apaga acaba chocando con otro.**
7. **Nombrar un color no explica nada.** "Los dorados pagan más dorados" no dice nada; el color va en
   una etiqueta que apunta (`VERDE · el dinero que tú pones`) y el concepto va en palabras.

### A4 · El mundo persiste: lo que enciendes, apágalo

Cada escena declara el estado **completo** de lo que le importa, no solo lo que cambia. La flecha
exponencial se coló encima del coche porque ninguna escena la apagó.
**En 2D y en publicaciones es lo mismo:** una escena que hereda un elemento de la anterior sin
declararlo es un defecto esperando a pasar.

### A5 · Audio

- **El tiempo de un efecto es una fracción de la escena, nunca segundos.** Nueve de once efectos
  sonaban en la escena equivocada, uno después de que acababa el video.
- **Se comprueba en diez segundos** leyendo `build/sfx.json`: si un efecto cae fuera de su `[t0, t1]`,
  están en segundos. Eso se vuelve un paso obligatorio del checklist.
- **La "ola" solo suena en cortes de verdad**, no entre escenas encadenadas.
- **`pace3d.py` deja una bandera que mata la narración** (`audio/NO_VOICE`). Ya está corregido en
  `process_voice.py`, y la señal de que hay voz es que `make_audio.py` imprima la línea
  `balance hablando:`. Si no sale, el video va mudo.

### A6 · Verificar el entregable, no el proceso

- **Un MP4 truncado se reportó como éxito.** ffmpeg falló al concatenar y salió con código 0; el video
  perdió su última escena y yo te lo iba a mandar. Ya está corregido en el motor 3D: ahora compara la
  duración real contra la esperada y truena. **Falta ponerlo igual en `scripts/render.js`** (shorts y
  largos), que tiene el mismo riesgo.
- **El barrido de 3 en 3 segundos es obligatorio**, no la hoja de QA sola. La hoja toma 20 instantes y
  se le escapan cosas.
- **La correlación contra la narración** (que la voz de verdad esté en la mezcla) se vuelve paso fijo.

### A7 · Eficiencia — el bloque que de verdad te ahorra créditos

Esto es lo nuevo; lo demás es documentar. Propongo cuatro reglas duras:

1. **Nunca renderices para comprobar algo que un cuadro suelto prueba.** `render3d.js --at <seg>` tarda
   ~40 segundos y cuesta cero. Un render completo son 36–68 minutos. En esta sesión hice seis renders;
   **con esta regla habrían sido dos**.
2. **Las correcciones se juntan y se verifican en lote.** Una ronda entera de cambios → un cuadro por
   cada cambio → **un** render. Nunca "corrijo, renderizo, corrijo, renderizo".
3. **Un cambio de audio no se re-renderiza.** Se rehace la mezcla y se sustituye la pista con ffmpeg
   copiando el video. Segundos en vez de media hora. Ya está escrito en `CLAUDE.md` pero no en los skills.
4. **Las dos puertas se respetan siempre:** `guion.md` → tu OK → maqueta; hoja de QA + cuadros sueltos →
   tu OK → voz y render. **"Haz el contenido de hoy" no es luz verde de ninguna de las dos.**

Y un **checklist previo al render**, de una página, que entra a los cuatro skills y que se corre
siempre antes de gastar máquina:

```
□ Las bandas: ningún elemento invade la del rótulo ni la del subtítulo
□ Cada data label: ¿a la z de su objeto? ¿su texto sale de la variable? ¿se apaga cuando toca?
□ Cada escena declara el estado completo (lo encendido en otra escena, apagado aquí)
□ build/sfx.json: todos los efectos dentro de su [t0, t1]
□ ≤ 6–8 efectos en toda la pieza, ninguno repetido seguido
□ make_audio.py imprimió "balance hablando:"  (si no, no hay voz)
□ Una sola paleta: mira la hoja entrecerrando los ojos
□ Cada cifra con su unidad y su sujeto; "utilidad de operación", nunca "utilidad"
□ Cuadros --at de cada momento con acción, revisados uno por uno
```

## Lo que NO voy a hacer

- No voy a reescribir los skills de cero: añado y reordeno, para no romper lo que ya funciona.
- No voy a tocar el motor 3D (ya quedó corregido durante la sesión), salvo el verificador de duración
  de `render.js`, que es el mismo defecto sin arreglar.
- No voy a inventar reglas que no salieron de una corrección tuya.

**Tiempo estimado:** una sesión de trabajo, sin créditos de voz ni renders.

---

# PLAN B · El short del viernes: Black Friday en vez de Amazon

## Por qué tienes razón

Lo dije yo mismo y no saqué la conclusión: **de Amazon no hubo ninguna noticia ese día.** Estaba
usando el Black Friday como percha para hablar de otra cosa. Tú lo volteaste: el día *es* la historia.

## El ángulo

El dato que todos van a repetir es que fue **récord**. Y es cierto: el Día de Acción de Gracias de 2026
se gastaron **7,100 millones de dólares en línea en Estados Unidos, el máximo de la historia, 10.4% más
que el año anterior** (Adobe Analytics).

El giro que casi nadie cuenta: **más de la mitad de ese crecimiento no es gente comprando más cosas, es
que las cosas cuestan más.** El Mastercard Economics Institute proyecta que las ventas minoristas de la
temporada crezcan 5.5%, y dice que **2.8 de esos 5.5 puntos vienen de precios más altos**. Con la
inflación de octubre en 3.8%, un récord en dólares puede ser un empate en cosas.

Y el remate con el mercado, que es lo que pediste: la sesión del viernes 27 fue **media jornada** y
cerró en verde, pero **no la subieron las tiendas: la subió la tecnología** — Nasdaq +2.31% contra
+1.60% del S&P 500.

**La lección dura meses y no caduca:** un récord en dólares no es un récord en cosas. Eso sirve igual
en enero, en el Buen Fin o con las ventas de cualquier empresa.

## Lo que SÍ se puede afirmar y lo que NO (importante)

| Cifra | Estado |
|---|---|
| Acción de Gracias 2026: $7,100 M en línea, +10.4% | **Hecho** (Adobe Analytics, ya ocurrido) |
| 1–22 de noviembre: $82,500 M en línea, +9.1% | **Hecho** (Adobe Analytics) |
| Cierre del viernes 27: S&P +1.60%, Nasdaq +2.31%, Dow +1.18% | **Hecho** (media jornada) |
| Inflación PCE de octubre: 3.8% anual | **Hecho** |
| Black Friday: $12,900 M | ⚠️ **PRONÓSTICO de Adobe**, no un dato. Si entra, va dicho como pronóstico |
| Temporada: +5.5%, de los cuales 2.8 puntos son precio | ⚠️ **PRONÓSTICO de Mastercard**, va dicho así |
| Temporada: $1.013 billones (NRF) | ⚠️ **PRONÓSTICO**, probablemente lo dejo fuera |

**No voy a decir que el Black Friday rompió un récord**, porque a la hora de escribir esto todavía es
una proyección y el dato real no existe. Ése es justo el tipo de número que la regla manda omitir o
citar como lo que es.

## Estructura propuesta · 7 escenas · 60–75 s

1. **Gancho** — el récord de Acción de Gracias, con la cifra.
2. **De qué tamaño es** — el contexto de noviembre.
3. **El desmontaje** — cuánto de ese crecimiento es precio y cuánto son cosas.
4. **La cuenta, en pantalla** — nominal contra real, con la inflación.
5. **El mercado** — media jornada, cerró arriba, pero la subió la tecnología.
6. **Qué viene** — Cyber Monday y lo que de verdad se sabrá en los datos de diciembre.
7. **Cierre** — qué vigilar.

**Sin empresa protagonista**, así que el gancho se identifica con la imagen del día (tiendas, carritos,
paquetes) en vez de con un logo. Te lo marco porque rompe la regla de "el gancho identifica a la
empresa", y es a propósito: aquí el sujeto es el consumidor de Estados Unidos.

## Lo que necesito confirmarte

- **La hora.** Ya pasó la meta de las 16:30 CDMX (se fue en el render y en el guion de Amazon). Para las
  19:00 sí llega, pero con menos margen tuyo para corregir.
- **La carpeta de Amazon** (`videos/2026-11-27-AMZN/`) la dejo con su `guion.md` como material
  archivado, por si algún día quieres ese ángulo. No la borro salvo que me digas.

---

## Qué sigue

- **Plan A:** espero tu luz verde.
- **Plan B:** con tu permiso ya dado, escribo el `guion.md` del Black Friday y te lo mando. No construyo
  nada hasta que apruebes ese guion.
