# Plan de acción · El ranking pasa de lista a TORNEO
**Pedido por JP el 14 nov 2026**, a partir del ranking de Pepe Nieves (6 acciones, 10 rondas, 48 min).

## 1. Qué está mal hoy
- **El título no dice nada.** "5 empresas que estamos vigilando" no promete un resultado: ¿vigilando para qué?
  No hay mensaje concreto, que es el mismo problema de fondo que ya salió en otros videos.
- **Una sola métrica no alcanza.** Ordenar por crecimiento de ventas es arbitrario: una empresa puede crecer mucho
  y ser un mal negocio. Hacen falta varias métricas y, sobre todo, **cómo han evolucionado en el tiempo**.
- **No hay ganador.** Sin un resultado al final, el video no tiene a dónde llegar y el espectador no tiene por qué quedarse.

## 2. El formato nuevo
Las 5 empresas **compiten** en 6 rondas, una por métrica. En cada ronda se ordenan y se reparten puntos
(**5 al 1º, 4 al 2º, 3, 2 y 1**; empate = mismos puntos). Al final, tabla de posiciones y una ganadora.

| Ronda | Métrica | La pregunta que responde | Gana | Fuente |
|---|---|---|---|---|
| 1 | Crecimiento de ventas (a/a) | ¿El negocio está creciendo? | el mayor | Reporte trimestral |
| 2 | Crecimiento de la utilidad **de operación** | ¿Crece lo que gana operando, o solo lo que le pasó con sus inversiones? | el mayor | Reporte trimestral |
| 3 | Margen de operación | De cada peso que entra, ¿cuánto le queda? | el mayor | Reporte trimestral |
| 4 | ROE | ¿Qué tan bien usa el dinero de sus accionistas? | el mayor | Datos de mercado |
| 5 | **Deuda sobre capital** | ¿Aguantaría un mal año, o va muy apalancada? | **el menor** | Datos de mercado |
| 6 | PEG | ¿Está cara para lo que crece? | **el menor** | Datos de mercado |

**Son 6 rondas, no 5 (JP, 14 nov 2026: "no pasa nada si dura casi 2 minutos").** Con 5 faltaba la pata de **solidez
financiera**: una empresa puede ganar en crecimiento, margen, ROE y valuación y estar ahogada en deuda. La ronda de
deuda es la que vuelve el torneo interesante — en la muestra, Mercado Libre gana casi todo y aquí sale último
(197 contra 5 de Spotify). Las seis cubren: crecer (1 y 2), ganar (3), usar bien el capital (4), aguantar (5) y
cuánto cuesta (6). Duración: ~1:55.

**Sobre la idea de una ronda de "narrativa" (JP la propuso; NO se hace como ronda).** No es puntuable sin inventarse
el criterio, y una nota subjetiva presentada como dato rompe la regla de "datos verificados". Pero el contexto sí hace
falta, así que va en otro lado: **una escena de presentación de 12 s antes de la ronda 1**, con una línea factual por
empresa ("Spotify: 306 millones de suscriptores de pago"). Informa sin fingir que es medible.

**Evolución en el tiempo:** en las rondas 1 y 2, cada empresa lleva una minigráfica de sus últimos 5 trimestres.
Es lo que pidió JP y es lo que separa "creció este trimestre" de "viene creciendo".

**Reglas que no se rompen:** la ganadora es "la que gana en más métricas", **nunca** "la mejor para comprar"; se dice
en voz y en pantalla. Si JP tiene posición en alguna, va el chip **"En lo personal tengo posición"** en su ronda.
Las cifras del estado de resultados salen SIEMPRE del reporte oficial; los ratios de mercado se rotulan como tales
(el campo de utilidad de Yahoo ya nos falló una vez con GAP: decía −9.1% y el 6-K decía +8.1%).

## 3. Cómo se reparte el tiempo (short de 100–120 s)
JP autorizó que dure más: "no pasa nada si este video dura más; hay que ser concisos pero completos".
```
0:00–0:10  Gancho: "Rankeando 5 acciones." + subtítulo "5 rondas, un ganador."  (logos al fondo)
0:08–0:20  Quiénes compiten: una línea factual por empresa
0:20–0:36  Ronda 1 · Crecimiento de ventas        + minigráfica
0:36–0:52  Ronda 2 · Utilidad de operación        + minigráfica
0:52–1:06  Ronda 3 · Margen de operación
1:06–1:20  Ronda 4 · ROE
1:20–1:34  Ronda 5 · Deuda sobre capital (gana el menor)
1:34–1:48  Ronda 6 · PEG (gana el menor)
1:48–2:02  Tabla final y ganadora
2:02–2:10  Cierre: ¿coincides?
```

## 3a. El gancho de los primeros 3 segundos (JP, 14 nov 2026)
**La primera pantalla dice la ACCIÓN, grande; el resultado va de subtítulo.** No al revés.
```
Rankeando 5 acciones.        ← título grande, es lo que el canal HACE
5 rondas, un ganador.        ← subtítulo, el resultado que se promete
```
"5 rondas, un ganador" **no puede ser el título**: no tiene gancho porque no dice qué se está haciendo ni de qué.
Lo que engancha es el verbo: *rankeando*. Variantes válidas del título grande: "Rankeando 5 acciones",
"Rankeando nuestras acciones favoritas", "Rankeando las 5 más grandes de la bolsa". El subtítulo casi no cambia.
Los cinco logos van al fondo, tenues, para que se vea de quiénes se habla sin leer una lista.

## 3b. Cómo se ve (muestra aprobada el 14 nov 2026)
Las dos escenas nuevas ya están en el motor y probadas:
- **`ronda`**: kicker "RONDA 1 DE 5 · CRECIMIENTO DE VENTAS", la pregunta como título, una línea de por qué importa y
  cinco filas (logo · nombre · barra proporcional · valor rotulado · puntos en círculo). La ganadora de la ronda va en
  verde. Con `"invert": true` (PEG) aparece "Aquí gana el número más bajo".
- **`tabla`**: fondo claro para que los logos se lean, posiciones ordenadas solas por puntos y la ganadora en una
  pastilla verde. El orden lo calcula el motor, no el storyboard.
Todo el bloque cuelga del final real del título (regla de la maquetación), así que aguanta preguntas de dos líneas.

## 4. Qué hay que construir
| # | Trabajo | Dónde |
|---|---|---|
| 1 | ~~Escena `ronda`~~ **hecha el 14 nov**: título de la métrica, una línea de por qué importa, 5 filas (logo · nombre · barra · valor · puntos) y minigráfica opcional | `engine/engine.js` |
| 2 | ~~Escena `tabla`~~ **hecha el 14 nov**: posiciones acumuladas, ganadora destacada | `engine/engine.js` |
| 3 | `scripts/torneo.py`: toma los tickers, arma las 5 métricas, calcula puntos y escribe el bloque del storyboard | `scripts/` |
| 4 | Logos oficiales de cada empresa (no el catálogo monocromo) | `fetch_images.py` |
| 5 | Versión para video largo: 8–10 rondas en 6–7 min, mismas reglas | skill `/largo` |

## 5. Títulos — la fórmula, no una lista suelta
Referencia: los títulos de Pepe Nieves ("Mi nueva APUESTA en BOLSA", "No puedo parar de COMPRAR esta acción",
"RANKEANDO la mejor APP para invertir", "MI MAYOR APUESTA"). **No prometen un dato: prometen que algo se va a resolver**,
y siempre dicen que se habla de bolsa.

**Los tres ingredientes, y los tres tienen que estar:**
1. **Un verbo en primera persona**, en MAYÚSCULAS: COMPARÉ, RANKEÉ, ENFRENTÉ, PUSE A COMPETIR. El canal hizo algo, no
   "estamos vigilando" (que no es una acción, es una actitud).
2. **Decir que son ACCIONES o BOLSA, explícito.** El error de "5 gigantes" y "5 métricas" es que no dicen de qué:
   ¿gigantes de qué?, ¿ganó una en qué? Tiene que aparecer "acciones", "en la bolsa" o "para invertir".
3. **Un resultado que se revela al final**: "ganó una sola", "y ganó la que menos esperaba". Eso es lo que retiene.

**TÍTULO ELEGIDO (JP, 14 nov 2026):**

> # RANKEANDO 5 acciones: 5 rondas, un ganador

Tiene los tres ingredientes: verbo en primera persona en mayúsculas, dice **acciones** y promete un ganador.
JP quitó "gigantes" porque alargaba sin aportar. Es la plantilla de los siguientes: cambia el número y el universo
("RANKEANDO 5 acciones mexicanas", "RANKEANDO 5 acciones de IA"), nunca la estructura.

**Otros candidatos, por si el tema pide otra cosa:**
1. **COMPARÉ 5 de las acciones más grandes del mundo: ganó una sola**
2. **Puse a COMPETIR 5 acciones en 5 métricas y hubo un ganador claro**
3. **RANKEANDO 5 acciones gigantes: 5 rondas, un ganador**
4. **¿Cuál de estas 5 ACCIONES aguanta mejor los números?**
5. **El TORNEO de las 5 acciones más grandes de la bolsa**
6. **ENFRENTÉ 5 acciones en 5 rondas y ganó la que menos esperaba** ← solo si de verdad sorprende el resultado

**Lo que no se usa nunca:**
- "5 empresas que estamos vigilando" y parientes: no prometen nada y no dicen de qué se habla.
- Nada con comprar, vender, "va a subir" ni "la mejor para invertir tu dinero": eso sí es recomendación.
  "La mejor **en estas 5 métricas**" sí se puede, porque el criterio está dicho y es verificable.
- Títulos atados a un mes ("para diciembre"): caducan en semanas.

**Cómo se elige el definitivo:** se escriben 3 con la fórmula, se corre `vidiq_score_title` si hay créditos
(renuevan el 4 de dic) y, si no, gana el que diga el resultado con menos palabras. El título se decide **antes**
de escribir el guion, porque el gancho de los primeros 3 segundos tiene que prometer lo mismo que el título.

## 5b. La serie por país (JP, 22 nov 2026)
JP vio el torneo de las mexicanas y pidió seguir con otros países: *"Me gustaría que en el siguiente video
rankeáramos empresas colombianas y luego en otro empresas argentinas y luego en otro empresas brasileñas."*

**El torneo se vuelve una serie recurrente por país.** Orden acordado, un país por torneo:

| # | Domingo | País | Candidatas (verificar que tengan las 6 métricas antes de cerrar la lista) |
|---|---|---|---|
| 1 | ✅ 22 nov 2026 | 🇲🇽 México | América Móvil, FEMSA, CEMEX, ASUR, Bimbo · **empate ASUR–CEMEX 22-22** |
| 2 | | 🇨🇴 Colombia | Ecopetrol, Bancolombia, Grupo Argos, Cementos Argos, Grupo Nutresa, ISA, Grupo Sura |
| 3 | | 🇦🇷 Argentina | YPF, Grupo Galicia, Banco Macro, Pampa Energía, Ternium Argentina, Loma Negra, Telecom Argentina |
| 4 | | 🇧🇷 Brasil | Petrobras, Vale, Itaú, Ambev, Embraer, WEG, Localiza, Magazine Luiza |

**Lo que hay que cuidar en cada uno, aprendido con el de México:**
- **Verificar SIEMPRE contra el reporte oficial.** En el de México, Yahoo se equivocó en 3 de 5 y uno de los errores
  cambiaba los puntos de una ronda. Con empresas de la región el riesgo es mayor, no menor.
- **Moneda:** CEMEX reporta en dólares y las demás en pesos. En Argentina hay además ajuste por inflación (NIIF 29) y
  en Brasil se reporta en reales. Por eso el torneo compara **porcentajes y razones**, nunca montos entre empresas,
  y se dice en pantalla cuando una reporta en otra moneda.
- **Bancos y mineras rompen el formato.** A un banco no se le puede medir margen de operación ni deuda sobre capital
  como a una industrial; una minera que reporta en dólares descuadra la comparación. Antes de cerrar la lista,
  comprueba que las cinco tengan las 6 métricas y sean comparables. (Por eso se cayeron Banorte y Grupo México.)
- **Asientos contables que inflan:** ASUR reporta ingresos que incluyen "servicios de construcción" (IFRIC 12), que
  entran como ingreso y salen como costo. Se usó la cifra que los excluye. Revisa si la concesionaria del país
  siguiente hace lo mismo.
- **Logos:** los de empresas latinoamericanas no están en simple-icons y Wikimedia limita las descargas. Bájalos con
  tiempo y **comprueba que el archivo no sea una página de error**: en el de México, Wikimedia devolvió un 429 con
  código 200 y el "logo" de FEMSA acabó siendo la pantalla de error. El de FEMSA en Commons además está incompleto
  (solo la mancha roja, sin el texto) y se tuvo que retirar.
- **Un empate es un resultado válido** y se cuenta tal cual: no se inventa una ronda de desempate después de ver el
  resultado. El de México empató y quedó mejor video.

## 6. Calendario
- **Dom 15 nov:** sale el ranking que ya está, con el título nuevo ("5 gigantes: ¿en cuáles crece el negocio?").
  No se cambia a torneo con prisas.
- **Lun 16 – jue 19:** construir las dos escenas y `torneo.py`; probar con `videos/ejemplo-SE`.
- **Sáb 21:** producir el primer torneo con datos verificados.
- **Dom 22 · 19:00:** estrena el formato torneo.
- **Dic:** si el torneo retiene bien, se hace la versión de video largo.

## 7. Lo que hay que medir
El 28 de noviembre, en la revisión que ya está agendada, el torneo del 22 se compara contra el ranking del 15:
retención, segundos vistos y comentarios. Si el torneo no retiene mejor, se vuelve a la lista y se dice.
