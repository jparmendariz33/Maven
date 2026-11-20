# Plan de acción · Estado de los skills y qué cambiaría
**Pedido por JP el 20 nov 2026**, al cerrar la semana de la historia de Kahneman.

---

## 1. Diagnóstico: hay tres problemas, y el del gancho no es el más grave

### Problema A — El gancho no es una regla en ningún lado (lo que JP detectó)
Los skills hablan mucho del gancho, pero **solo de identificación**: que lleve el logo, que nombre a la empresa, dónde
va el bloque de logos. **No hay una sola línea sobre si el gancho engancha.** Y la evidencia del canal dice que ahí
está el problema real: en la historia de Steve Jobs **solo el 27.84% se quedó a mirar** (7 de cada 10 deslizaron),
mientras que **quien se quedaba veía el 51.76%**. El contenido retiene; el primer segundo no.

### Problema B — Los skills se quedaron atrás de cómo trabajamos hoy (más grave)
Los skills son lo que se ejecuta cuando corre `/historia`, `/short` o `/largo`. Hoy contradicen la operación real:

| Skill | Dice | La realidad desde | Consecuencia |
|---|---|---|---|
| `historia` | "Se hacen DOS por semana (**miércoles y sábado**)" | martes y jueves (20 nov) | produce para el día equivocado |
| `historia` | "**Costo cero:** nada de vidIQ; JP graba su voz encima" | voz de IA desde el 17 nov | no generaría voz, o pediría permiso para algo ya aprobado |
| `historia` | `make_audio.py` en "modo sin voz" | `voz3d.py --aire` + mezcla al 60% | ritmo y mezcla equivocados |
| `short` | Short de contexto "**lunes, martes y jueves**" | viernes (20 nov) | produce para el día equivocado |
| `largo` | "El **miércoles** sale la Historia 3D de este mismo tema" | jueves (20 nov) | el puente apunta mal |
| `short` | "No uses vidIQ para nada más (**ni voz**, ni guion…)" | la voz de IA es el flujo normal | contradice la práctica |

### Problema C — El conocimiento vive en el lugar equivocado
Todo lo aprendido estas dos semanas está en `CLAUDE.md` (ya son 376 líneas y ~25 reglas). Pero **`CLAUDE.md` es
contexto general y los skills son el procedimiento**. Hoy hay duplicación en unos temas y huecos en otros, y nada
garantiza que al correr `/historia` se apliquen la regla del dinamismo, la del encuadre o el flujo de `voz3d.py`.

---

## 2. El gancho: qué propongo exactamente

La regla ya quedó escrita en `CLAUDE.md` ("Regla del gancho"). Lo concreto:

| Formato | Tiempo | Qué tiene que haber |
|---|---|---|
| Short / historia 3D | **3 s** | Frase escrita en pantalla que valga sin sonido + una razón para no deslizar |
| Largo | hasta 15 s, **la promesa en los primeros 5** | El resultado prometido, no la presentación |
| Publicación | el título de la lámina 1 | Mismo filtro |

**El filtro, antes de escribir el resto del guion:** si la primera frase se puede cambiar por la de otro video del
canal sin que se note, no es un gancho. Si hay que esperar a la segunda frase para entender por qué importa, tampoco.

**Lo que ha funcionado en el canal, por orden:** una contradicción ("reportó récord y la acción cayó"), una cifra con
escala ("perdió 104 mil millones y casi no perdió dinero operando"), un resultado prometido ("gana Alphabet, 25 de 30").

**Lo que hay que dejar de hacer:** abrir presentando el tema. La historia de Kahneman abre con "En 1979, dos
psicólogos publicaron un artículo en una revista de economía": es contexto, no gancho. El gancho estaba en la escena
4 ("perder duele el doble") y llegó a los 20 segundos.

**Y hay que medirlo.** El 28 de noviembre ya está agendada la revisión que compara la próxima historia contra el
27.84% de Jobs. Propongo ampliarla: medir el % que se queda en los primeros 3 s de **toda** pieza nueva y anotarlo,
para que la regla se ajuste con datos y no con opiniones.

---

## 3. Qué cambiaría, dónde y por qué

| # | Cambio | Dónde | Por qué |
|---|---|---|---|
| 1 | **Sincronizar los skills con la operación real**: días, voz de IA, `voz3d.py`, mezcla al 60% | `historia`, `short`, `largo` | Es el que más daño hace hoy: un skill desactualizado produce la pieza equivocada el día equivocado |
| 2 | **Sección "El gancho" al inicio de cada skill**, antes del guion | los 4 skills | Que sea lo primero que se decide, no lo último que se redacta |
| 3 | **Mover a los skills las reglas de ejecución** que hoy solo están en CLAUDE.md (encuadre 3D, dinamismo, transiciones, aprobación por capturas, eficiencia en créditos) | `historia` sobre todo | CLAUDE.md es contexto; el skill es el procedimiento que se sigue paso a paso |
| 4 | **Dejar CLAUDE.md como el "por qué"** y los skills como el "cómo", con referencias cruzadas en vez de texto duplicado | ambos | Con 376 líneas, CLAUDE.md empieza a ser difícil de leer completo, y lo que no se lee no se aplica |
| 5 | **Checklist de entrega al final de cada skill** (gancho de 3 s ✓, rótulos sin desbordes ✓, barrido del MP4 ✓, fuentes citadas ✓, fechas explícitas ✓) | los 4 skills | Casi todos los defectos de esta semana los habría atrapado una lista de verificación |
| 6 | **Reprogramar las tareas automáticas** al calendario nuevo | los cron | Hoy disparan con los días viejos; ayer saltó la del short de contexto en jueves |

---

## 4. Orden sugerido

1. **Los cron y la sincronización de los skills** (#1 y #6). Es lo que está roto *ahora*: mañana viernes toca short de
   contexto y el skill cree que es jueves.
2. **La sección del gancho** (#2). Es el cambio con más impacto en vistas.
3. **La reorganización** (#3, #4, #5). Es trabajo de fondo y no corre prisa; conviene hacerlo de una sola vez y con
   calma, no a mitad de una semana de producción.

**Nada de esto cuesta créditos.** Es todo reescritura de documentación y configuración.

---

## 5. Lo que ya quedó guardado de esta sesión
En `CLAUDE.md`, ocho reglas nuevas: el gancho · el cierre con pregunta · la ola solo entre lugares distintos · los
rótulos que se ajustan solos · nunca "hoy" ni "ayer" en una publicación · un número no verificable no se publica ·
fuente primaria más tres fuentes del día (y comprobar la fecha en hora de México) · declarar conflictos de interés.
Y antes, en la misma sesión: el borrador anticipado · la aprobación por capturas · la eficiencia en créditos · que se
entienda sin saber nada · el dinamismo en 3D · la mezcla al 60% · la partitura anclada al final · cambiar solo el
audio sin renderizar · las gráficas con `L.plaque` · el flujo de `voz3d.py` con sus tres trampas.

---

# 6. Los números del canal (JP los pasó el 20 nov 2026) — y qué cambian del plan

## 6.1 Dos cosas no cuadran, y conviene decirlas antes de concluir nada

**a) Las 11,018 vistas y las 23.15 horas son incompatibles.** 23.15 h entre 11,018 vistas dan **7.6 segundos por
vista**, pero Studio reporta una duración promedio de **30 s**. Si de verdad fueran 30 s, el tiempo de reproducción
serían 91.8 horas, no 23.15: las dos cifras difieren **4 veces**. La explicación más probable es la que el propio
reporte menciona — **el ajuste de conteo de vistas de YouTube del 16 de noviembre**, que empezó a contar como vista
cualquier aparición en el feed de Shorts, no solo las reproducciones con intención.
**Consecuencia práctica: el salto de "30–120 vistas" a 11,018 NO es comparable con lo de antes y no debe leerse como
que el canal se disparó.** Las métricas confiables de este periodo son **tiempo de reproducción (23.15 h),
+366 suscriptores y 751 me gusta**, y esas tres sí son buenas.

**b) La tabla suma 1,085 vistas y el canal reporta 11,018.** Encaja con la nota de que la tabla mide **la primera hora**
de cada pieza. Eso la hace justa entre sí, pero significa que mide **cuánta distribución le dio YouTube al arrancar**,
no qué tan bueno es el contenido.

## 6.2 El hallazgo que cambia la prioridad

Crucé vistas contra retención de las 14 piezas: **la correlación es NEGATIVA (r = −0.14)**. Lo mejor retenido es lo
menos visto.

| Pieza | Vistas (1ª h) | Retención |
|---|---:|---:|
| Nubank | **666** | 38.45% |
| Jobs | 119 | 53.67% |
| AMD vs Nvidia | 103 | **79.13%** |
| Kahneman | 15 | **127.83%** (se repite) |
| Meta | 8 | 76.25% |
| GTA | 4 | 67.93% |

**Esto obliga a matizar la conclusión del gancho.** El gancho sigue siendo necesario —el 27.84% de Jobs lo prueba—
pero **hoy el cuello de botella no parece ser la retención: es la distribución.** Tenemos piezas que retienen 68%,
76% y 79% y que casi nadie vio. Mejorar el gancho de un video que recibe 4 vistas no cambia nada.

**Y falta el dato que lo resolvería: impresiones y CTR.** Sin eso no se puede distinguir entre
"YouTube no lo mostró" y "lo mostró y nadie hizo clic" (que sería culpa de la miniatura y el título, no del gancho).
**Es lo primero que le pediría a JP del próximo reporte.**

## 6.3 Lo que sí se puede afirmar con esta muestra

- **Solo 4 de las 14 piezas pasan de 50 vistas.** En las otras diez, los porcentajes salen de muestras de 4 a 18
  vistas: no son concluyentes y no se debe planear sobre ellos. **Regla nueva: no se toma ninguna decisión de formato
  con menos de 50 vistas en la pieza.**
- **Nubank es la única referencia real**: 666 vistas, 38.45% de retención, 33 s de duración promedio. Es el número
  a batir, y el formato a entender — es un short de empresa con cifra fuerte en el gancho.
- **Kahneman al 127.83% significa que se repite**: la duración promedio (1:23) supera la del video (1:05). Es
  excelente señal de que el contenido engancha a quien lo ve… pero con 15 vistas, es una señal, no una conclusión.
- **El torneo (16.90%) es la peor retención de las piezas nuevas.** Con 14 vistas no es concluyente, pero coincide
  con la hipótesis del gancho: una cuenta regresiva necesita prometer el resultado en los primeros 3 segundos.
- **El largo de Apple tiene 1 vista en su primera hora.** Toda la estrategia de "las historias son el puente a los
  largos" todavía **no tiene ninguna evidencia de estar funcionando**. Hay que medirlo explícitamente.
- En la lista de largos aparecen dos videos en inglés ("The Porfiriato…", "The First $100,000") que **no son de esta
  línea de contenido**; conviene saber si son del canal viejo, porque ensucian el promedio del canal.

## 6.4 Cómo cambia el orden de prioridades

| Antes | Ahora | Por qué |
|---|---|---|
| 1. Cron y skills | **1. Cron y skills** | Sigue igual: está roto hoy |
| 2. El gancho | **2. Pedir impresiones y CTR** | Sin eso estamos optimizando a ciegas la mitad equivocada del embudo |
| 3. Reorganizar | **3. El gancho** | Sigue siendo correcto y barato, pero ya no es evidente que sea el cuello de botella |
| — | **4. Entender por qué Nubank sí se distribuyó** | Es la única pieza con distribución real: el título, la miniatura y el tema de ese short son la mejor pista que tenemos |
| — | **5. Medir el puente historia → largo** | Es el supuesto central de todo el calendario nuevo y no está verificado |

## 6.5 Qué pedirle a JP del próximo reporte
1. **Impresiones y CTR** de cada pieza (es lo que falta para saber dónde está el problema).
2. **Vistas totales, no solo de la primera hora**, para las piezas con más de una semana.
3. **Fuentes de tráfico** (feed de Shorts, búsqueda, sugeridos, externos).
4. Para los largos: **impresiones, CTR y retención a los 30 s**.
5. Confirmación de si los dos videos en inglés son del canal viejo.

---

# 7. Los datos reales de vidIQ (20 nov 2026) — y el hallazgo que lo cambia todo

Consulté la API de vidIQ con la cuenta de JP. **Los números son muy distintos a los del reporte pegado**, porque
aquel medía la primera hora de cada pieza. Costo: 20 créditos de 1,374 disponibles (plan **Boost**, 2,000 al mes,
renueva el 17 de diciembre — no el plan básico).

## 7.1 El 71% de las vistas del canal son PUBLICIDAD PAGADA

| Fuente | Vistas | % | Con intención | Retención | Duración |
|---|---:|---:|---:|---:|---:|
| **Publicidad pagada** | **6,939** | **71%** | 1,207 | 16.5% | 22 s |
| Feed de Shorts | 2,194 | 22% | 559 | **51.8%** | 41 s |
| Página del canal | 305 | 3% | 192 | 31.2% | 30 s |
| **Búsqueda de YouTube** | 293 | 3% | 107 | **68.4%** | **61 s** |
| Resto | 53 | 1% | — | — | — |

Y en el video más visto, SpaceX: **4,590 de sus 4,974 vistas (92%) vinieron de publicidad.** Solo 278 del feed.

**Esto reordena todo el diagnóstico:**
- El crecimiento aparente del canal es **comprado**, no orgánico. Las 11,018 vistas no miden el contenido.
- El motor orgánico real son **2,845 vistas** (29%), y está **sano**: el feed de Shorts retiene 51.8% y la búsqueda
  68.4% con 61 segundos de duración promedio.
- La conclusión de la sección 6 ("el cuello de botella es la distribución") sigue siendo cierta, pero la causa es
  otra: no es que YouTube no muestre el contenido, es que **el volumen que vemos no es distribución orgánica**.
- **Pregunta abierta para JP: ¿quién está pagando esa publicidad y con qué objetivo?** Si es una campaña suya,
  conviene separar las métricas pagadas de las orgánicas en cada revisión, porque mezcladas no dicen nada.

## 7.2 El "% que se queda" por pieza, ya limpio

`engagedViews / views` es la proporción que no deslizó. Ojo: la publicidad lo contamina hacia abajo.

| Pieza | Vistas | Se queda |
|---|---:|---:|
| Nubank | 928 | **7%** |
| SpaceX · Jobs (los dos con mucha publicidad) | 4,974 · 2,267 | 18% · 18% |
| Torneo | 105 | 22% |
| Apple "$28 de cada $100" | 320 | 28% |
| Cuervo · Nvidia contexto · Meta · AMD · Nvidia −6% | 33–164 | 35–40% |
| Nvidia −9% · Airbnb | 258 · 52 | 42% · 44% |
| GTA · Vistra | 163 · 28 | **50%** |
| **"¿Qué es una acción?" (LARGO)** | 188 | **87%** |

**Dos cosas saltan:**
1. **El largo "¿Qué es una acción?" tiene 87% de vistas con intención**, el mejor número del canal con diferencia.
   Los largos sí retienen a quien llega; el problema es que llegan poquísimos.
2. **El torneo (22%) y Nubank (7%) son los peores.** Coincide con la hipótesis del gancho.

## 7.3 La búsqueda es el activo desaprovechado
293 vistas, pero **68.4% de retención y 61 segundos de duración promedio**: es, de lejos, el tráfico de mejor calidad
y el único que no se apaga. Y es justo donde juegan los largos. Hoy el canal produce 2 historias, 2 shorts y 3
publicaciones por semana para el feed, y **un solo largo** para búsqueda.

## 7.4 Falta conectar la extensión de vidIQ
Los reportes que responderían la pregunta del gancho **con precisión** necesitan la extensión de navegador, y no está
conectada. Son: **stayed-to-watch por Short** (cuántos se quedan en los primeros segundos, que es literalmente la
métrica del gancho), **impresiones y CTR de miniatura**, y los **tests A/B de título y miniatura**.
**Acción para JP:** instalar la extensión de vidIQ en Chrome, con la misma cuenta, y avisarme. Son 5 minutos y
desbloquea lo más valioso de la suscripción.

## 7.5 Cómo aprovechar el plan Boost (1,374 créditos hasta el 17 de diciembre)
Lo que cuesta créditos y vale la pena, por orden:

| Uso | Costo | Por qué |
|---|---:|---|
| **Voz de IA** de historias y shorts | 28 por pieza | Es lo que ya usamos; ~8 piezas al mes = 224 créditos |
| **Revisión semanal de analítica** (top videos + fuentes) | 10 por semana | Para separar pagado de orgánico y medir el gancho |
| **`keyword_research`** antes de elegir tema de largo | ~5–15 | La búsqueda es el mejor tráfico del canal y hoy elegimos temas sin consultar demanda |
| **`outliers`** para ver qué pega en finanzas en español | ~5–15 | Ideas de formato con evidencia, no intuición |
| **Voz del largo** | ~141 | Solo si JP decide que los largos lleven voz de IA |
| **`generate_titles` / `score_title`** | bajo | Para los largos, donde el título decide la búsqueda |

**Presupuesto propuesto al mes:** ~250 de voz + ~60 de analítica + ~80 de investigación = **~390 de 2,000.** Sobra
muchísimo, así que lo sensato es **gastar más en investigación de temas y títulos**, que es donde el canal está
decidiendo a ciegas.

## 7.6 Qué cambia en las prioridades (versión final)

1. **Preguntarle a JP por la publicidad.** Sin saber si es campaña suya y con qué objetivo, el 71% de los datos no se
   puede interpretar.
2. **Conectar la extensión de vidIQ** → desbloquea stayed-to-watch y CTR.
3. **Cron y skills desactualizados** (sigue siendo lo único roto).
4. **El gancho**, con la métrica real en la mano y midiendo solo tráfico orgánico.
5. **Apostar por búsqueda**: es el tráfico de más calidad y el más desatendido. Elegir los temas de los largos con
   `keyword_research` en vez de por intuición.
