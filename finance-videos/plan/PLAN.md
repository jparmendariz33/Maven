# Plan de acción · Costa Studio Finance (@jparmendariz) · nov 2026 → nov 2027

> Canal de YouTube sobre bolsa, inversión y construcción de patrimonio, en español de México.
> Tagline: *"Desde la costa, todo se ve con claridad."* Contenido educativo, nunca recomendaciones de compra/venta.
> Este archivo es la fuente de verdad que leen las tareas programadas. Se revisa cada trimestre (ver §7).

## 0. Marca: Costa Studio Finance
**Costa Studio** es una agencia de influencer marketing. **Costa Studio Finance** es su división de contenido educativo
sobre finanzas e inversión: un proyecto aparte que aprovecha la marca y el estilo de la casa.

- **Nombre completo:** **Costa Studio Finance, by JP Armendáriz.**
- **Cómo se ve:** el logo de Costa Studio con **FINANCE** a un lado y debajo "by JP Armendáriz · @jparmendariz" (en todos los videos, arriba a la izquierda).
  Al cierre: tagline + @handle + "COSTA STUDIO FINANCE · BY JP ARMENDÁRIZ". Misma paleta, tipografías y "mareas" que la agencia.
- **Nombre del canal:** "Costa Studio Finance by JP Armendáriz". El handle sigue siendo @jparmendariz por ahora (decisión tuya; opción: @costastudiofinance).

**Lo que se separa**
- Canal, redes y bio propios: la agencia no se promociona dentro del análisis.
- Las opiniones financieras son de Costa Studio Finance, nunca de la agencia ni de sus clientes o influencers.
- **Conflictos de interés** (lista en `plan/clientes-agencia.md`): si una empresa del video es (o fue) cliente de la agencia, o hay relación comercial, se dice
  en el video y en la descripción, o mejor no se analiza. Nunca se presenta como análisis algo que sea publicidad.
- Todo patrocinio se marca en YouTube ("incluye promoción pagada") y se menciona en voz.
- Datos y finanzas de la agencia, aparte de los del canal.

**Lo que se aprovecha (sinergias)**
- **Patrocinios:** la red de marcas de la agencia (fintechs, casas de bolsa, apps de ahorro, educación financiera) puede
  patrocinar el canal, siempre declarado y sin cambiar el análisis.
- **Vitrina:** el canal muestra lo que la agencia sabe producir (formato, estilo, constancia, métricas). Sirve como caso
  de éxito para clientes de fintech.
- **Colaboraciones:** invitar a creadores de la red a videos de finanzas personales (no de acciones concretas).
- **Aprendizaje cruzado:** lo que funcione aquí (ganchos, retención, miniaturas) alimenta la estrategia de la agencia, y al revés.
- **Pie en las descripciones:** "Costa Studio Finance, by JP Armendáriz, es la división de finanzas de Costa Studio." + liga a la agencia.

## 1. La estrategia en una frase
**Videos largos atemporales cada semana = el motor de ingresos y de horas de reproducción.**
**Shorts = el anzuelo de descubrimiento, uno diario** (reactivos cuando pasa algo extraordinario, derivados del video largo y
análisis de empresas "calientes" el fin de semana). **Todos los videos llevan imágenes reales** (logo, sucursales, productos, sedes).
Tú pones la voz (más genuino que IA); Claude hace la investigación, el guion, los gráficos y el render.

## 2. Ritmo de publicación (fijo, todas las semanas)
**Regla de oro (feedback de JP, 7 nov 2026): UN video por día, producido AUTOMÁTICAMENTE el MISMO día en que se publica.** Nada se
produce con semanas de anticipación. Única excepción: el largo se produce el lunes para el domingo de ESA MISMA semana (para que
JP tenga tiempo de grabar su voz). La carpeta lleva la fecha de publicación; "hoy" y "ayer" en el guion se cuentan desde el día en
que se publica. Antes de producir, revisar `plan/publicados.md` para no repetir nada que ya esté en el canal.
**Regla del cierre (feedback de JP, 9 nov 2026): los videos con datos de mercado se hacen DESPUÉS del cierre de la sesión ordinaria**
(16:00 de Nueva York = 15:00 CDMX en invierno / 14:00 CDMX en el verano de EE.UU.), con los precios finales del día, y se publican a
las 19:00. Si JP da una idea durante el día, se prepara todo y se entrega una sola vez, ya con el cierre (detalle en `CLAUDE.md`).
| Día (CDMX) | Qué se publica | Duración | Origen |
|---|---|---|---|
| **Lunes ≈17:00** | 📌 Publicación del día (3–4 imágenes) | — | Lo que pasó HOY + pregunta (skill `/publicacion`) |
| **Lunes 19:00** | Short de contexto #1 | 60–75 s | La noticia de la sesión es el pretexto; cuenta algo que dure meses (§2b). Datos de cierre |
| **Martes 19:00** | Short de contexto #2 | 60–75 s | Igual |
| **Miércoles ≈17:00** | 📌 Publicación del día | — | Lo que pasó HOY + pregunta |
| **Miércoles 19:00** | Short derivado del largo (adelanto: "el domingo, el video completo") | 45–60 s | Idea más poderosa del largo de la semana |
| **Jueves 19:00** | Short de contexto #3 | 60–75 s | Igual que lunes y martes |
| **Viernes 19:00** | Short **Análisis + Potencial** (único de la semana) | 75–85 s | Empresa caliente de la semana o una de [`banco-tesis.md`](banco-tesis.md) |
| **Sábado 12:00** | 🎬 **Historia 3D** (única pieza del día) | 75–90 s | [`banco-historias.md`](banco-historias.md) · skill `/historia` · se produce el viernes |
| **Domingo 10:00** | **Video largo atemporal** (16:9) | 9–11 min | Calendario de 55 semanas · se produce el lunes |
| **Domingo 19:00** | Short **Ranking** (top 3 o top 5) + su 📌 publicación | 75–85 s | Se produce el SÁBADO en la mañana (`/short` §1d) |

= **11 piezas por semana** desde el 11 nov 2026 (1 largo + 6 shorts + 1 Historia 3D + 3 publicaciones). JP graba voz en 8.
(Cambio del 11 nov 2026, noche: "Tesis a 5 años" del sábado se fusionó con el Análisis + Potencial del viernes porque eran lo mismo; el
sábado queda solo la Historia 3D; la mañana del sábado se usa para producir el ranking del domingo; la publicación del viernes se quitó para
aligerar ese día. Publicaciones: lunes, miércoles y domingo.)
(Cambio del 9 nov 2026: JP pidió sumar las historias animadas en 3D. Van 1 por semana, el sábado a las 12:00; ese día salen dos
piezas, separadas 7 horas para que no compitan. Se revisa en el check-up de febrero: si las historias rinden más que los shorts
normales, se sube a 2 por semana con una segunda los miércoles a las 12:00.)
(Cambio del 6 nov 2026: antes eran 4 shorts por semana; JP pidió video diario y que los nuevos fueran análisis de empresas.)
Los 3 reactivos son siempre de **acciones/temas distintos** en la semana y no repiten una empresa de los últimos 10 días.
Regla de oro: **constancia > perfección.** Si una semana no puedes grabar, se publican los shorts y el largo se recorre una semana
(nunca 2 semanas seguidas sin largo).

## 2b. Qué hace cada formato (replanteo acordado con JP el 11 nov 2026)
Objetivo final: crecer la audiencia de finanzas e inversión y monetizar el canal. Cada formato tiene su trabajo:

| Formato | Objetivo | Qué cuenta | Vigencia | Cuándo |
|---|---|---|---|---|
| Publicaciones (3–4 imágenes) | Conversación con quien ya sigue a JP | Lo que pasó HOY + una pregunta (dom: el ranking) | Un día | Lun y mié ≈17:00 (tras el cierre) + dom |
| Shorts | Que lo descubra gente nueva | Una empresa y una idea: qué le pasa, por qué y qué viene | Meses | Diario 19:00 |
| Historia 3D | Alcance y marca | La historia de una empresa o fundador | Años | Sáb 12:00 |
| Largos | Horas de reproducción y búsqueda | Enseñar algo de inversión | Años | Dom 10:00 |

- **Shorts de lunes, martes y jueves = shorts de contexto** (`/short` §1c): la noticia es el pretexto; sin "hoy" ni el día exacto, pero con el
  periodo anclado en fechas absolutas y largas ("desde enero de 2025"), para que en 5 años se entienda de qué época es.
- **Publicaciones:** skill `/publicacion`: lunes y miércoles (la noticia del día) + domingo (el ranking de la semana).
- **Música:** las historias 3D llevan la partitura de órgano y piano (la de SpaceX); shorts y largos, la cama cálida de siempre.
- **Rankings (domingo):** short + publicación. Siempre por un dato verificable o como lista de seguimiento de **Costa Studio Finance** (nunca
  "JP vigila", nunca "van a subir", nunca atados a un mes). Detalle: `/short` §1d.
- **JP en 3D:** recorte chico sobre el tema (`/short` §2c). Shorts: gancho y cierre. Largos: inicio, 3–5 intermedios y cierre. Publicaciones: primera y última imagen.
- **Los videos anteriores al 11 nov no se tocan.**
- **Revisión cada 4 semanas** con los números de YouTube Studio de JP (`plan/metricas.md`): qué pegó, por qué, dónde se cae la audiencia,
  y si los shorts de contexto retienen más vistas que los de noticia. Horarios: no hay evidencia sólida de un mejor horario (investigación
  del 11 nov); se ajustan con el reporte "Cuándo están tus espectadores en YouTube" de JP.

### Cómo se elige cada short reactivo (siempre hay uno)
Se ordena por "qué tan extraordinario" y se toma el #1 que no se haya usado en la semana:
1. Empresa grande (S&P 500, Nasdaq-100 o BMV: Walmex, FEMSA, Bimbo, Cemex, Banorte, América Móvil, GMéxico…) con **±8% en un día**
   o **±15% en 2 semanas** y causa clara (resultados, demanda, adquisición, lanzamiento).
2. Índice (S&P 500, Nasdaq, IPC) **±2%** en un día, peso **±2%**, o decisión de Fed/Banxico.
3. Si no hubo nada de lo anterior: el mayor movimiento del día entre las 50 empresas más grandes de EE.UU. o México, o un
   tema de inversión de la semana (resultados de una empresa muy conocida, máximo histórico, IPO relevante).
Siempre se explica con matiz (si ya venía cayendo, se dice) y nunca se recomienda comprar o vender.

### Cómo se elige cada short de empresa (vie, sáb, dom)
Mismo formato y duración que los reactivos, pero la historia es la **empresa**: qué hace, cómo gana dinero, por qué está en boca de
todos ahora y qué tan cara o rentable es. **Solo empresas que ya coticen en bolsa o que estén cerca de su IPO** (fecha anunciada o
S-1/F-1/prospecto presentado; feedback de JP, 8 nov 2026). Nunca privadas sin IPO en puerta, startups ni cripto. Si es pre-IPO, se usan
las cifras del prospecto y se dice claro que aún no cotiza. Prioridad: (1) noticia de la semana (resultados que sorprendieron,
adquisición, IPO, expansión, lanzamiento, polémica, récord); (2) marca cotidiana para la audiencia; (3) búsquedas en YouTube.
Al menos 1 de cada 3 es mexicana. Sin repetir empresas en 30 días ni las de los reactivos de esa semana. Banco de ideas y
registro: [`banco-empresas.md`](banco-empresas.md). Estructura: skill `/short` §1b.

**Formato "Análisis + Potencial" (8 nov 2026, pedido por JP):** cada short de empresa es mitad análisis (qué hace, por qué está en
boca de todos, números y valuación) y mitad potencial de inversión a largo plazo (motor de crecimiento, ventaja competitiva,
riesgos con el mismo peso y qué vigilar). Nunca "cómprala" ni precios objetivo: es "la tesis optimista y lo que podría salir mal".
Si JP tiene acciones de la empresa ([`posiciones-jp.md`](posiciones-jp.md)), se declara en pantalla y en la descripción.
El **sábado** es "Tesis a 5 años": la empresa sale de [`banco-tesis.md`](banco-tesis.md) aunque no esté en las noticias.
Cuando una tesis jale vistas y comentarios, se convierte en video largo en un espacio de "⚔️ Leer empresas" (propuesta a JP).
**Colores de la empresa:** el gancho, el catalizador y el cierre llevan de fondo el color de la empresa; el resto del video usa
un fondo institucional que combine (marca de color fuerte → arena; solo marcas tenues/pastel → azul) con los datos de la empresa en su color (skill `/short` §1b).

### Historia 3D (sábados 12:00)
La historia de una empresa o de quien la fundó, contada con maquetas de plastilina animadas, personajes que actúan, luz de cine,
música y efectos (estilo "Costa Diorama"; modelo: `videos/2026-11-14-JOBS-historia/`). Es el formato más visual del canal: sirve
para atraer gente nueva y mandarla al largo o al short de esa empresa. Reglas: solo empresas que coticen o estén cerca de su IPO;
hechos públicos y documentados (nada de vida privada ni acusaciones no probadas); caricatura respetuosa; sin logotipos reales;
nunca recomendaciones. Al menos 1 de cada 3 es de México o Latinoamérica. **Se produce el viernes para el sábado** (segunda
excepción a la regla de "mismo día", junto con el largo): hacer una maqueta tarda más y JP necesita tiempo para grabar su voz.
Ideas y registro: [`banco-historias.md`](banco-historias.md). Cómo se hace: skill `/historia`.

### Imágenes en todos los videos
Cada short lleva 3–5 imágenes reales y cada largo 10–20, que hagan sentido con la historia (ej.: un análisis de Sanborns muestra
sus sucursales y su logo). Solo fotos con licencia libre (Wikimedia Commons, Flickr CC) o de salas de prensa oficiales, con crédito
en pantalla y en la descripción; **nunca imágenes generadas con IA de marcas o personas reales.** Herramienta: `scripts/fetch_images.py`.

## 3. Flujo semanal (automatizado)
**Los videos con datos del día llegan DESPUÉS del cierre de la bolsa** (las tareas corren a las 16:25 de Nueva York = 15:25 CDMX en
invierno / 14:25 en el verano de EE.UU.; el short llega ~30 min después) y **se publican SIEMPRE a las 19:00**. Lo que no depende del
mercado (largo, adelanto del miércoles, shorts de sábado y domingo) sigue llegando a las 6:41. Cambio pedido por JP el 9 nov 2026.

| Cuándo (CDMX) | Quién | Qué pasa |
|---|---|---|
| **Lunes 6:41** | Tarea "Producción del video largo" | Produce SOLO el largo del domingo de esta semana (si ya existe, no hace nada): guion con datos verificados, **video 16:9 completo sin voz** (subtítulos-teleprompter), miniatura y `youtube.md`. Te notifica. |
| **Lun, mar y jue · tras el cierre (~15:25)** | Tarea "Short de contexto" | Parte de la noticia de la sesión y produce el short de contexto con precios de cierre (sin voz). Llega ~16:00. |
| **Lun y mié · tras el cierre (~15:26)** | Tarea "Publicación del día" | 3–4 imágenes con la noticia de hoy + descripción para copiar. Llega ~16:00; se publica ≈17:00. |
| **Miércoles 6:41** | Tarea "Short derivado (miércoles)" | Produce el short adelanto del largo de ese domingo. Te notifica. |
| **Viernes · tras el cierre (~15:25)** | Tarea "Análisis de empresa (viernes)" | Elige la empresa caliente y produce el short con el cierre del viernes. Llega ~16:00. |
| **Viernes · tras el cierre (~15:25)** | Tarea "Historia 3D" | Elige la historia, verifica los datos (con el cierre del viernes), arma la maqueta y renderiza con música y efectos. Llega en la tarde-noche (el render tarda ~1 h). Se publica el **sábado 12:00**. |
| **Sábado 6:41** | Tarea "Ranking del domingo" | Produce el short ranking y su publicación de 4 imágenes para el DOMINGO, con el cierre del viernes. |
| **Lun → sáb** | **Tú** | Grabas tu voz encima de cada video: shorts con *Voz en off* en la app de YouTube; el largo en CapCut (gratis): importas el MP4, *Audio → Grabar*, lees los subtítulos, exportas. Subes y programas. |
| **Domingo** | **Tú** | Sale el largo a las 10:00. 10 min contestando comentarios. |

Tu tiempo: ~15 min el largo (es leer 10 min) + ~5 min cada short y cada historia = **~55 min por semana**, más subir y contestar.
Alternativa para el largo: si prefieres leer a tu ritmo, graba solo el audio leyendo `guion.md` y súbelo a
`finance-videos/largos/<fecha>/` en GitHub; la tarea lo sincroniza (whisper) y re-renderiza con tu voz incluida.

## 4. Formato del video largo
Mismo estilo que los shorts (paleta Costa, Unbounded/Space Grotesk/Instrument Serif, mareas, grano, una idea por pantalla),
en horizontal 1920x1080, con la firma **COSTA STUDIO FINANCE · by JP Armendáriz** y subtítulos-teleprompter abajo.
1. **Gancho (0:00–0:30):** dato o pregunta + promesa ("en 10 minutos vas a saber…"). Sin saludo largo.
2. **Contexto (0:30–1:30):** por qué le importa a tu dinero.
3. **3–5 capítulos** de 1.5–2.5 min. Cada uno abre con una tarjeta de capítulo y sigue: idea → ejemplo con números reales →
   gráfico → "lo que esto significa para ti".
4. **Error común / mito** (≈1 min).
5. **Cierre:** resumen en 3 puntos + pregunta para comentarios + "Desde la costa, todo se ve con claridad." + CTA.
- 1,150–1,400 palabras (≈ 120 palabras/min: ritmo cómodo para leer en voz alta). Frases cortas, tuteo, números con dígitos, cero sensacionalismo.
- Pantallas: ~60–90 por video (una cada 6–10 s). Tipos: gancho, capítulo, frase, cifra grande, lista, comparación, barras,
  línea/precio, medidor (P/E, PEG, ROE), fórmula, línea de tiempo, cita, cierre.
- Título con la búsqueda objetivo al inicio; capítulos con tiempos en la descripción; miniatura con máx. 4 palabras.
- Siempre: "Contenido educativo. No es asesoría financiera." + fuentes reales + "Costa Studio Finance, by JP Armendáriz, es la
  división de finanzas de Costa Studio."

## 5. Metas: 1,000 suscriptores y 4,000 horas en 12 meses
- **YPP (anuncios):** 1,000 suscriptores + 4,000 horas públicas de videos largos en los últimos 365 días.
  Con 55 largos: ~73 h por video ≈ **1,100 vistas por video** con 4 min de retención media. Los shorts traen los suscriptores.
- **Escalón previo** (~500 suscriptores): membresías, Super Thanks y compras. Verificar requisitos vigentes en cada check-up.
- Honesto: es alcanzable con esta constancia, pero no garantizado. RPM realista en español/México: ~$1–5 USD por 1,000 vistas.
  El dinero grande llega con patrocinios (ver §0, sinergias con la agencia).

| Fin de… | Largos | Shorts | Suscriptores | Horas (365 d) | Foco |
|---|---|---|---|---|---|
| dic 2026 | 7 | 45 | 100 | 150 | Constancia: no fallar ninguna semana |
| ene 2027 (Q1) | 12 | 80 | 200 | 400 | CTR miniatura > 4%, retención min 1 > 55% |
| abr 2027 (Q2) | 24 | 165 | 450 | 1,300 | Qué búsquedas traen gente; doblar lo que funciona |
| jul 2027 (Q3) | 37 | 255 | 750 | 2,600 | Duración media > 35%; listas de reproducción por pilar |
| oct 2027 (Q4) | 50 | 345 | 1,000 | 4,000 | **Solicitar YPP**; primer patrocinio |
| nov 2027 | 55 | 380 | 1,100+ | 4,300+ | Re-plan anual |

## 6. Calendario de videos largos (55 semanas) y rotación
Detalle completo semana por semana en [`calendario-largos.md`](calendario-largos.md).

**Rotación fija de 5 semanas, repetida 11 veces**, para tener siempre defensa, medio y ataque:
| Semana del ciclo | Pilar | Rol |
|---|---|---|
| 1 | 🛡️ Empezar desde cero | Defensa: bases que todos buscan |
| 2 | ⚔️ Leer empresas | Ataque: métricas con empresas reales |
| 3 | 🧠 Psicología del dinero, serie *Tu cerebro y tu dinero* (Behavioral Finance: Kahneman, Tversky, Thaler, Shiller…) | Medio: lo que distingue al canal |
| 4 | 🛡️ Patrimonio en México | Defensa: CETES, AFORE, impuestos |
| 5 | 🎯 Historia y criterio | Medio/ataque: crisis y burbujas |

Temas de temporada en su pilar: aguinaldo (6 dic), cierre de año (27 dic), plan 2027 (3 ene), impuestos (25 abr), PTU (23 may).

## 6b. Lo que asegura la monetización (además de los números)
1. **Política de contenido no auténtico de YouTube:** los canales hechos en serie con plantilla pueden ser rechazados del YPP.
   Por eso: tu voz siempre; guiones originales; en cada largo una presentación tuya y una pregunta a la audiencia (todo escrito,
   tú solo lo lees); variedad de pantallas e imágenes reales distintas en cada video. Opcional: 10–15 s a cámara al inicio del largo (lo pegas en CapCut).
2. **Embudo Shorts → largos:** las vistas de Shorts no suman horas. Cada short lleva "Video relacionado" → un largo; cada largo,
   pantalla final + tarjeta → otro largo del mismo pilar; comentario fijado con pregunta.
3. **Canal configurado** (kit en `canal/`): verificación con teléfono, banner, descripción, plantilla de descripción, 5 listas por pilar.
4. **Colchón:** siempre 1–2 largos listos por adelantado.
5. **Miniaturas** automáticas + "Probar y comparar" de YouTube.
6. **Costo cero:** nada de vidIQ ni servicios de pago. Búsquedas con el autocompletado de YouTube; voz tuya; CapCut gratis.
   (Recomendación opcional: micrófono de solapa ~$300–600 MXN.)
7. **Medición:** cada domingo mándame una captura de YouTube Studio → Analytics (o pégala en `plan/metricas.md`).

## 7. Revisiones
- **Check-ups trimestrales** (4 feb, 4 may y 4 ago 2027, 17:12): analíticas del canal vs. §5, ajustes al calendario y formato.
  Cambios grandes, con tu OK.
- **Re-plan anual** (4 nov 2027): balance del año y plan 2027–2028 con nuevas tareas programadas.

## 8. Pendientes
- [x] Calendario de 55 semanas con rotación y búsquedas validadas (gratis).
- [x] Motor de video largo 16:9 con teleprompter, capítulos y miniaturas + skill `/largo`.
- [x] Videos 1 y 2 + sus shorts derivados (hechos el 5 nov). El video 1 ("¿Qué es una acción?") ya se publicó el ~5 nov, así que el
  calendario se recorrió una semana: Apple sale el 15 nov y su short el 11 nov (ver `calendario-largos.md` y `publicados.md`).
- [x] 7 nov 2026: se acabó el "colchón": cada tarea produce solo el video del día (el largo, solo el de esa semana).
- [x] Kit del canal en `canal/` (banner, foto de perfil, textos, listas, plantilla).
- [x] Imágenes reales en los motores (shorts y largos) + `fetch_images.py` (6 nov 2026).
- [x] Shorts de análisis de empresa vie/sáb/dom + banco de empresas (6 nov 2026).
- [x] Fotos reales agregadas a lo ya producido (largos 15 y 22 nov, shorts 11 y 18 nov) sin cambiar los guiones; re-renderizados.
- [x] 9 nov 2026: **Regla del cierre**: los videos con datos del día se producen después del cierre de la bolsa (`scripts/market_close.py`; tareas a las 16:25 de Nueva York).
- [x] 9 nov 2026: Historias 3D (motor `engine3d/` con luz de cine y actores, skill `/historia`, banco de historias y tarea de los viernes).
- [x] 11 nov 2026: plan nuevo (§2b): publicaciones, shorts de contexto, ranking del domingo, JP en 3D como recorte, voz de JP en los guiones.
  Las tareas de producción corren ahora dentro de UNA conversación de Claude que sí puede guardar en GitHub (parche; ver §9).
- [ ] **Tú (arreglo de fondo, sigue pendiente):** agregar el repo `jparmendariz33/Maven` a los repositorios del entorno "Juan Pa" (claude.ai/code → entorno → Edit →
  Repositories). Sin eso, las tareas programadas hacen el video y te lo mandan por chat, pero no lo pueden guardar en GitHub.
- [ ] **Tú:** verificar el canal con tu teléfono y configurarlo con `canal/configuracion.md` (~45 min, una vez).
- [ ] **Tú:** llenar `clientes-agencia.md`.
- [ ] **Tú, cada domingo:** 2 min en `metricas.md` (o mándame una captura de YouTube Studio).

## 9. Tareas programadas (actualizado el 11 nov 2026)
Las tareas de producción corren dentro de la conversación de Claude "session_01FvjQ3qKsfHX4rzw8jtw3Rk" (la única con permiso de escritura
en el repo). Cada una lee su texto base de la tarea original, que quedó EN PAUSA (no borrarla). Si esa conversación se archiva, hay que
recrearlas o hacer el arreglo de fondo (§8).

| Tarea activa | Cuándo | ID | Texto base (en pausa) |
|---|---|---|---|
| Short de contexto | Lun, mar y jue · 16:25 de Nueva York | trig_01YC6XSBjLTQC99azkzwABed | trig_01CnUTcJ3bevrqhQoUcnexqW |
| Publicación del día | Lun y mié · 16:26 de Nueva York | trig_019nTN3FFZncYqTA7e5RFBRJ | — |
| Short derivado (adelanto del largo) | Miércoles 6:41 | trig_011sLZh1asQNFXhKC4Tyu99z | trig_01CgPooCEzGfqDFb8XAbQQ14 |
| Análisis + Potencial del viernes | Viernes · 16:25 de Nueva York | trig_01RFu1UMadn1pzisH5YpPuSa | trig_0195fwBGXcNMr4tAiS2yXVsF |
| Historia 3D (se publica el sábado 12:00) | Viernes · 16:27 de Nueva York | trig_01FTeyhPd6NuwpkDqharo2Y2 | trig_01WiLjHyjJxTvYkRxBT6ZbUH |
| Ranking del domingo + su publicación (se produce el sábado) | Sábado 6:41 | trig_01JLBXKzRJ2bicmH6SpWWwPS | trig_01QJCh2FaMNmfpP1SMLHn1E9 |
| Producción del video largo | Lunes 6:41 | trig_012xeT5xAkvs2cXZ5uM4VNMp | trig_01PqPWwd22ymEiaN4zJynEAN |
| Revisión de números (cada ~4 semanas) | Día 9 de cada mes 11:13 | trig_01KQNjkV65mHR52Wwr9rUTVD | — |
| Check-up trimestral (config. anterior: no puede guardar en GitHub) | 4 feb, 4 may, 4 ago · 6:41 | trig_01DUUsYHU5STYp3ERkoYnnkU | — |
| Re-plan anual (config. anterior: no puede guardar en GitHub) | 4 nov 2027 · 6:41 | trig_012FRZsfmRFvxMPNyMQJTHsq | — |
