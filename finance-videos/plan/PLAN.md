# Plan de acción · Costa Studio Finance (@jparmendariz) · nov 2026 → nov 2027

> Canal de YouTube sobre bolsa, inversión y construcción de patrimonio, en español de México.
> Tagline: *"Desde la costa, todo se ve con claridad."* Contenido educativo, nunca recomendaciones de compra/venta.
> Este archivo es la fuente de verdad que leen las tareas programadas. Se revisa cada trimestre (ver §7).

## 0. Marca: Costa Studio Finance
**Costa Studio** es una agencia de influencer marketing. **Costa Studio Finance** es su división de contenido educativo
sobre finanzas e inversión: un proyecto aparte que aprovecha la marca y el estilo de la casa.

- **Cómo se ve:** el logo de Costa Studio con la palabra **FINANCE** a un lado (en todos los videos, arriba a la izquierda).
  Al cierre: tagline + @handle + "COSTA STUDIO FINANCE". Misma paleta, tipografías y "mareas" que la agencia.
- **Nombre del canal sugerido:** "Costa Studio Finance". El handle sigue siendo @jparmendariz por ahora (decisión tuya; opción: @costastudiofinance).

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
- **Pie en las descripciones:** "Costa Studio Finance es la división de finanzas de Costa Studio." + liga a la agencia.

## 1. La estrategia en una frase
**Videos largos atemporales cada semana = el motor de ingresos y de horas de reproducción.**
**Shorts = el anzuelo de descubrimiento** (reactivos cuando pasa algo extraordinario + derivados del video largo).
Tú pones la voz (más genuino que IA); Claude hace la investigación, el guion, los gráficos y el render.

## 2. Ritmo de publicación
| Formato | Frecuencia | Duración | Día / hora sugerida (CDMX) | Cuánto te toma a ti |
|---|---|---|---|---|
| Video largo (16:9) | **1 por semana** | 9–11 min (≥ 8 min permite anuncios a mitad del video) | Domingo 10:00 | ~25 min: grabar voz leyendo el guion + subir |
| Short reactivo | 0–3 por semana, solo si pasa algo extraordinario | 45–65 s | El mismo día o al siguiente, 19:00 | ~10 min: grabar voz en la app de Shorts + subir |
| Short derivado del largo | **1 por semana** (pase lo que pase) | 30–50 s | Miércoles 19:00 | ~10 min |

Mínimo garantizado: **1 largo + 1 short por semana**. Promedio esperado: 1 largo + 2–3 shorts. Total para ti: ~1–1.5 h por semana.
Regla de oro: **constancia > perfección.** Si una semana no puedes, se publica el short derivado y el largo se recorre una semana
(nunca dejar el canal 2 semanas sin un largo).

### ¿Qué cuenta como "extraordinario" para un short reactivo?
- Una empresa grande (S&P 500, Nasdaq-100 o muy conocida en México: Walmex, Femsa, Bimbo, Cemex, Banorte, América Móvil) que
  se mueve **±8% o más en un día**, o **±15% en 2 semanas**, con una causa clara (resultados, demanda, adquisición, lanzamiento).
- Un movimiento del S&P 500 o Nasdaq de **±2.5% en un día**, o el peso mexicano **±3% en un día**.
- Una decisión de tasas de la Fed o Banxico que sorprenda al mercado.
- Máximo 1 short reactivo por día; se prefiere el tema que más le importa a un inversionista mexicano promedio.

## 3. Flujo semanal (automatizado)
| Cuándo | Quién | Qué pasa |
|---|---|---|
| L–V 16:40 | Tarea "Radar de Shorts" | Revisa el cierre del mercado. Si hay algo extraordinario, hace el short completo **sin voz** (subtítulos = teleprompter), lo sube a la rama `costa-studio` y te manda notificación. Si no, no hace nada. |
| Lunes 19:10 | Tarea "Guion del video largo" | Toma el tema de la semana (§6), investiga y verifica datos, escribe el guion (`finance-videos/largos/<fecha>/guion.md`) + 3 títulos + idea de miniatura. Te notifica. |
| Lun → jue | **Tú** | Lees el guion en voz alta (grabadora del celular, cuarto silencioso) y subes el audio desde el navegador: github.com/jparmendariz33/Maven → rama `costa-studio` → `finance-videos/largos/<fecha del domingo>/` → *Add file → Upload files*. |
| Viernes 18:20 | Tarea "Render del video largo" | Si ya está tu audio: lo limpia, sincroniza los gráficos con tu voz, renderiza el video 16:9 + miniatura + `youtube.md` + el short derivado. Si no está, te recuerda. |
| Fin de semana | **Tú** | Subes y programas en YouTube Studio (largo el domingo, short derivado el miércoles). Contestas comentarios 10 min. |

## 4. Formato del video largo (estructura del guion)
1. **Gancho (0:00–0:30):** una pregunta o dato que duela/intrigue + promesa de lo que vas a aprender. Sin "hola, bienvenidos" largo.
2. **Contexto (0:30–1:30):** por qué importa para tu dinero.
3. **3–4 bloques (capítulos)** de 1.5–2.5 min, cada uno con: idea → ejemplo con números reales → gráfico → "lo que esto significa para ti".
4. **Error común / mito** (1 min).
5. **Resumen en 3 puntos + pregunta para comentarios + CTA** al video relacionado (pantalla final) y al short.
- ~1,300–1,600 palabras (≈ 140 palabras/min). Frases cortas, tuteo, números con dígitos, cero sensacionalismo.
- Capítulos con marca de tiempo en la descripción (ayudan al SEO).
- Título con la palabra que la gente busca ("cómo invertir en CETES", "qué es el P/E") — son videos de búsqueda, no de noticia.
- Siempre: "Contenido educativo. No es asesoría financiera." Fuentes reales en la descripción.

## 5. Metas y números honestos
- YPP (anuncios): **1,000 suscriptores + 4,000 horas** de videos largos en 12 meses. Con ~50 largos, eso es ~80 h por video
  (≈ 1,200 vistas por video con 4 min de retención promedio). Es alcanzable en 12–18 meses con constancia, **no garantizado**.
- Escalón previo: con 500 suscriptores (+ 3 videos en 90 días + 3,000 h, o 3 M de vistas en Shorts) se abren membresías,
  Super Thanks y compras, sin anuncios. Verificar requisitos vigentes en el check-up.
- RPM realista para audiencia en español/México en finanzas: **~$1–5 USD** por 1,000 vistas en largos (menos que EE.UU.).
  Los ingresos de verdad llegan con patrocinios (plataformas de inversión, cursos) cuando el canal tenga audiencia fiel.

| Trimestre | Largos acumulados | Suscriptores (meta) | Horas acumuladas (meta) | Qué medimos |
|---|---|---|---|---|
| Q1 (nov–ene) | 11 | 150 | 300 | CTR de miniaturas (meta > 4%), retención al minuto 1 (> 55%) |
| Q2 (feb–abr) | 23 | 400 | 1,200 | Qué temas traen más búsquedas; vistas/short |
| Q3 (may–jul) | 36 | 700 | 2,500 | Duración media de visualización (> 35%) |
| Q4 (ago–oct) | 49 | 1,000 | 4,000 | Ingresos por suscriptor, solicitudes de YPP |

## 6. Calendario de videos largos (tema por semana; fecha = domingo de publicación)
Pilares: **F** Fundamentos · **E** Leer empresas · **A** Análisis a fondo (semi-atemporal; actualizar datos) · **P** Psicología y estrategia · **M** Patrimonio en México · **H** Historia.

| # | Publica | Pilar | Tema / título de trabajo |
|---|---|---|---|
| — | 15 nov 2026 | — | (sin video: semana de construir el motor de video largo y grabar voz de prueba) |
| 1 | 22 nov 2026 | F | ¿Qué es una acción y por qué sube o baja? Explicado sin rollos |
| 2 | 29 nov 2026 | F | Interés compuesto: la regla del 72 y empezar a los 25 vs. a los 35 |
| 3 | 6 dic 2026 | M | CETES vs. bolsa vs. inflación: ¿dónde crece de verdad tu dinero? |
| 4 | 13 dic 2026 | A | Apple a fondo: cómo gana dinero la empresa más valiosa |
| 5 | 20 dic 2026 | F | ETFs: qué son y por qué Buffett recomienda el S&P 500 |
| 6 | 27 dic 2026 | M | Cómo invertir en acciones de EE.UU. desde México: SIC, casas de bolsa y comisiones |
| 7 | 3 ene 2027 | F | Antes de invertir: fondo de emergencia y la regla 50/30/20 |
| 8 | 10 ene 2027 | P | Invertir cada mes sin adivinar el mercado (promediar costos) |
| 9 | 17 ene 2027 | A | Nvidia a fondo: de videojuegos a la inteligencia artificial |
| 10 | 24 ene 2027 | F | Dividendos: cómo funcionan y la trampa del rendimiento alto |
| 11 | 31 ene 2027 | P | Riesgo y diversificación: por qué no poner todo en una acción |
| 12 | 7 feb 2027 | E | El P/E explicado: cuándo una acción está cara o barata |
| 13 | 14 feb 2027 | E | Cómo leer un estado de resultados en 10 minutos |
| 14 | 21 feb 2027 | A | Amazon a fondo: la tienda que en realidad vive de la nube |
| 15 | 28 feb 2027 | E | Flujo de caja libre: la métrica que más miran los inversionistas |
| 16 | 7 mar 2027 | E | ROE, márgenes y ventajas competitivas: cómo reconocer un gran negocio |
| 17 | 14 mar 2027 | E | El PEG: por qué no todo lo "caro" es caro |
| 18 | 21 mar 2027 | A | Walmart de México a fondo |
| 19 | 28 mar 2027 | E | Deuda: cuándo ayuda y cuándo hunde a una empresa |
| 20 | 4 abr 2027 | E | Recompras de acciones: por qué las empresas compran sus propias acciones |
| 21 | 11 abr 2027 | E | Cómo leer un reporte trimestral (temporada de resultados) |
| 22 | 18 abr 2027 | A | Microsoft a fondo |
| 23 | 25 abr 2027 | E | Valor intrínseco: un flujo descontado (DCF) explicado simple |
| 24 | 2 may 2027 | P | Por qué la mayoría pierde dinero en bolsa: los sesgos que nos traicionan |
| 25 | 9 may 2027 | P | Inversión pasiva vs. activa: lo que dicen los datos |
| 26 | 16 may 2027 | A | Berkshire Hathaway y la filosofía de Warren Buffett |
| 27 | 23 may 2027 | P | Crecimiento vs. valor: dos formas de invertir |
| 28 | 30 may 2027 | P | Qué hacer (y qué no) cuando la bolsa cae 20% |
| 29 | 6 jun 2027 | M | Tasas de interés, Banxico y la Fed: cómo mueven tus inversiones |
| 30 | 13 jun 2027 | A | Costco a fondo: el negocio de las membresías |
| 31 | 20 jun 2027 | M | El tipo de cambio y tus inversiones en dólares |
| 32 | 27 jun 2027 | P | Cómo se arma un portafolio simple (ejemplos educativos) |
| 33 | 4 jul 2027 | P | Rebalancear: la disciplina aburrida que funciona |
| 34 | 11 jul 2027 | A | Tesla a fondo: ¿automotriz o empresa de tecnología? |
| 35 | 18 jul 2027 | P | 10 errores del inversionista principiante |
| 36 | 25 jul 2027 | F | La constancia en números: invertir $2,000 al mes por 10, 20 y 30 años |
| 37 | 1 ago 2027 | M | AFORE: cuánto tendrás al retirarte y cómo mejorarlo |
| 38 | 8 ago 2027 | M | PPR y deducciones: ahorrar para el retiro con beneficio fiscal |
| 39 | 15 ago 2027 | A | FEMSA a fondo: OXXO, Coca-Cola y más |
| 40 | 22 ago 2027 | M | Impuestos de invertir en bolsa en México: lo básico |
| 41 | 29 ago 2027 | M | Bienes raíces vs. bolsa: comparación honesta |
| 42 | 5 sep 2027 | H | La burbuja puntocom: qué aprendimos |
| 43 | 12 sep 2027 | A | Alphabet (Google) a fondo |
| 44 | 19 sep 2027 | H | La crisis de 2008 explicada en 10 minutos |
| 45 | 26 sep 2027 | F | La inflación: el impuesto invisible |
| 46 | 3 oct 2027 | P | Cripto vs. bolsa: riesgos explicados sin fanatismo |
| 47 | 10 oct 2027 | A | Visa y Mastercard: el peaje de cada compra |
| 48 | 17 oct 2027 | P | Cómo leer noticias financieras sin caer en el pánico |
| 49 | 24 oct 2027 | P | Mi sistema de inversión en 1 página (y cómo armar el tuyo) |
| 50 | 31 oct 2027 | H | Un año en la costa: lo que aprendí haciendo este canal |

Los check-ups pueden reordenar o cambiar temas según qué funcione (búsquedas, retención, comentarios).

## 7. Revisiones
- **Check-ups trimestrales** (tarea programada, día 4 de feb, may y ago 2027 a las 17:12): leen las analíticas del canal en
  vidIQ, las comparan contra §5, proponen ajustes al calendario y al formato y te mandan un resumen. Cambios grandes, con tu OK.
- **Re-plan anual** (4 nov 2027): balance del año y nuevo plan 2027–2028 (con su calendario y sus tareas programadas).

## 8. Lo que falta construir (próximo paso)
- [ ] Motor de video largo 16:9 (mismo estilo Costa: arena, azul costa, mareas) + skill `/largo` (guion → tu voz → render).
- [ ] Miniaturas 1280x720 automáticas con el mismo estilo.
- [ ] (Opcional) Dar a las tareas programadas acceso a vidIQ y Google Drive desde claude.ai → Rutinas (hoy corren sin conectores:
      el check-up te pedirá los números del canal si vidIQ no está disponible).

## 9. Tareas programadas (zona horaria: Ciudad de México)
| Tarea | Cuándo | ID |
|---|---|---|
| Radar de Shorts | L–V 16:40 | trig_01CnUTcJ3bevrqhQoUcnexqW |
| Guion del video largo | Lunes 19:10 | trig_01PqPWwd22ymEiaN4zJynEAN |
| Render del video largo | Viernes 18:20 | trig_016NhWWd4V4191XwxQdrZZsk |
| Check-up trimestral | 4 feb, 4 may, 4 ago · 17:12 | trig_01DUUsYHU5STYp3ERkoYnnkU |
| Re-plan anual | 4 nov 2027 · 17:12 | trig_012FRZsfmRFvxMPNyMQJTHsq |
