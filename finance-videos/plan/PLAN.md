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
**Shorts = el anzuelo de descubrimiento** (reactivos cuando pasa algo extraordinario + derivados del video largo).
Tú pones la voz (más genuino que IA); Claude hace la investigación, el guion, los gráficos y el render.

## 2. Ritmo de publicación (fijo, todas las semanas)
| Día (CDMX) | Qué se publica | Duración | Origen |
|---|---|---|---|
| **Lunes 19:00** | Short reactivo #1 | 45–65 s | Lo más fuerte del viernes/fin de semana |
| **Martes 19:00** | Short reactivo #2 | 45–65 s | Lo más fuerte del lunes |
| **Miércoles 19:00** | Short derivado del largo (adelanto: "el domingo, el video completo") | 30–50 s | Idea más poderosa del largo de la semana |
| **Jueves 19:00** | Short reactivo #3 | 45–65 s | Lo más fuerte del miércoles |
| **Domingo 10:00** | **Video largo atemporal** (16:9) | 9–11 min | Calendario de 55 semanas |

= **5 piezas por semana** (1 largo + 4 shorts). Al año: 55 largos y ~220 shorts.
Los 3 reactivos son siempre de **acciones/temas distintos** en la semana y no repiten una empresa de los últimos 10 días.
Regla de oro: **constancia > perfección.** Si una semana no puedes grabar, se publican los shorts y el largo se recorre una semana
(nunca 2 semanas seguidas sin largo).

### Cómo se elige cada short reactivo (siempre hay uno)
Se ordena por "qué tan extraordinario" y se toma el #1 que no se haya usado en la semana:
1. Empresa grande (S&P 500, Nasdaq-100 o BMV: Walmex, FEMSA, Bimbo, Cemex, Banorte, América Móvil, GMéxico…) con **±8% en un día**
   o **±15% en 2 semanas** y causa clara (resultados, demanda, adquisición, lanzamiento).
2. Índice (S&P 500, Nasdaq, IPC) **±2%** en un día, peso **±2%**, o decisión de Fed/Banxico.
3. Si no hubo nada de lo anterior: el mayor movimiento del día entre las 50 empresas más grandes de EE.UU. o México, o un
   tema de inversión de la semana (resultados de una empresa muy conocida, máximo histórico, IPO relevante).
Siempre se explica con matiz (si ya venía cayendo, se dice) y nunca se recomienda comprar o vender.

## 3. Flujo semanal (automatizado)
| Cuándo (CDMX) | Quién | Qué pasa |
|---|---|---|
| **Lunes 16:40** | Tarea "Radar de Shorts" | Elige y produce el short reactivo #1 (sin voz). Te notifica. |
| **Lunes 19:10** | Tarea "Producción del video largo" | Toma la semana del calendario, escribe el guion con datos verificados, genera el **video 16:9 completo sin voz** (subtítulos-teleprompter), la miniatura, `youtube.md` y el short derivado. Te notifica. |
| **Martes 16:40** | Radar | Short reactivo #2. |
| **Jueves 16:40** | Radar | Short reactivo #3. |
| **Lun → sáb** | **Tú** | Grabas tu voz encima de cada video: shorts con *Voz en off* en la app de YouTube; el largo en CapCut (gratis): importas el MP4, *Audio → Grabar*, lees los subtítulos, exportas. Subes y programas. |
| **Domingo** | **Tú** | Sale el largo a las 10:00. 10 min contestando comentarios. |

Tu tiempo: ~15 min el largo (es leer 10 min) + ~5 min cada short = **~40 min por semana**, más subir y contestar.
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
- 1,300–1,600 palabras (≈ 140 palabras/min). Frases cortas, tuteo, números con dígitos, cero sensacionalismo.
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
| dic 2026 | 7 | 30 | 100 | 150 | Constancia: no fallar ninguna semana |
| ene 2027 (Q1) | 12 | 50 | 200 | 400 | CTR miniatura > 4%, retención min 1 > 55% |
| abr 2027 (Q2) | 24 | 100 | 450 | 1,300 | Qué búsquedas traen gente; doblar lo que funciona |
| jul 2027 (Q3) | 37 | 155 | 750 | 2,600 | Duración media > 35%; listas de reproducción por pilar |
| oct 2027 (Q4) | 50 | 210 | 1,000 | 4,000 | **Solicitar YPP**; primer patrocinio |
| nov 2027 | 55 | 220 | 1,100+ | 4,300+ | Re-plan anual |

## 6. Calendario de videos largos (55 semanas)
**Detalle semana por semana en [`calendario-largos.md`](calendario-largos.md)**: título, búsqueda objetivo, gancho, capítulos,
visuales, short derivado y datos a verificar. Resumen:

| Semanas | Fechas | Bloque | Videos |
|---|---|---|---|
| 1–10 | 15 nov 2026 → 17 ene 2027 | Empezar desde cero | acción, interés compuesto, CETES vs. bolsa, aguinaldo, ETFs, invertir desde México, lecciones 2026, plan 2027, 50/30/20, promediar costos |
| 11–24 | 24 ene → 25 abr 2027 | Leer empresas | reporte trimestral, dividendos, P/E, estado de resultados, **Nvidia**, flujo libre, ROE/moats, PEG, **Walmex**, deuda, impuestos (abril), recompras, **Apple**, DCF |
| 25–38 | 2 may → 1 ago 2027 | Estrategia y psicología | sesgos, PTU (mayo), pasiva vs. activa, **Berkshire**, valor vs. crecimiento, caídas de 20%, diversificación, tasas, **Costco**, tipo de cambio, portafolio simple, rebalancear, **Amazon**, 10 errores |
| 39–46 | 8 ago → 26 sep 2027 | Patrimonio en México | $2,000 al mes, AFORE, PPR, **FEMSA**, bienes raíces vs. bolsa, FIBRAS, inflación, **Microsoft** |
| 47–55 | 3 oct → 28 nov 2027 | Historia y criterio | puntocom, 2008, cripto vs. bolsa, **Alphabet**, noticias sin pánico, **Visa/Mastercard**, **Tesla**, mi sistema en 1 página, un año en la costa |

Los análisis a fondo caen cerca de la temporada de resultados de cada empresa. Los temas de México siguen el calendario
del bolsillo: aguinaldo (dic), propósitos (ene), declaración anual (abr), PTU (may).

## 7. Revisiones
- **Check-ups trimestrales** (4 feb, 4 may y 4 ago 2027, 17:12): analíticas del canal vs. §5, ajustes al calendario y formato.
  Cambios grandes, con tu OK.
- **Re-plan anual** (4 nov 2027): balance del año y plan 2027–2028 con nuevas tareas programadas.

## 8. Pendientes
- [ ] Motor de video largo 16:9 + skill `/largo` (en construcción; listo antes del lunes 9 nov, cuando se produce la semana 1).
- [ ] Miniaturas 1280x720 automáticas.
- [ ] Llenar `clientes-agencia.md`.
- [ ] (Opcional) Dar a las tareas acceso a vidIQ desde claude.ai → Rutinas para que el check-up lea las analíticas solo.

## 9. Tareas programadas (zona horaria: Ciudad de México)
| Tarea | Cuándo | ID |
|---|---|---|
| Radar de Shorts (3 por semana) | Lun, mar y jue 16:40 | trig_01CnUTcJ3bevrqhQoUcnexqW |
| Producción del video largo | Lunes 19:10 | trig_01PqPWwd22ymEiaN4zJynEAN |
| Check-up trimestral | 4 feb, 4 may, 4 ago · 17:12 | trig_01DUUsYHU5STYp3ERkoYnnkU |
| Re-plan anual | 4 nov 2027 · 17:12 | trig_012FRZsfmRFvxMPNyMQJTHsq |
