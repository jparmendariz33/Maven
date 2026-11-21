# ASUR (ASR) · Análisis + Potencial · sábado 21 nov 2026, se publica hoy 19:00
**Cierre usado:** viernes 20 de noviembre de 2026 (sábado sin mercado; el guion nombra el viernes, nunca "hoy").

## Por qué esta empresa
La semana la dominó el desplome de la IA, y las candidatas de ese mundo están quemadas por la regla de 30 días
(Nvidia, AMD, CoreWeave, Apple, Anthropic, Nubank, Take-Two). ASUR es **idea de JP en `banco-tesis.md`**, es
**mexicana** (cumple la cuota de 1 de cada 3) y tiene una tensión real y verificable que casi nadie contó.

## El ángulo
**Cancún perdió 1.3 millones de pasajeros en nueve meses y la empresa vendió 19% más.** El crecimiento no vino de
su joya: vino de los aeropuertos que compró y de Colombia y Puerto Rico. Y la utilidad apenas creció 2%.

## Datos verificados
### Fuente PRIMARIA · comunicado de tráfico de ASUR, septiembre 2026 (asur.com.mx)
| | 9 meses 2025 | 9 meses 2026 | |
|---|---|---|---|
| **Cancún** | 22,196,857 | **20,882,658** | **−5.9%** · 1,314,199 pasajeros menos |
| México total | 30,481,397 | 29,534,119 | −3.1% |
| **Grupo total** | 57,532,457 | **57,151,121** | **−0.7%** (prácticamente plano) |

Septiembre solo: Cancún −8.6% · Colombia **+5.7%** · Puerto Rico **+3.1%**.

### Fuente PRIMARIA · sitio de ASUR
Su filial Aeropuerto de Cancún, S.A. de C.V. colocó **dos bonos de US$900 millones cada uno**: 6.711% con
vencimiento el 8 de octubre de 2031 y 7.491% al 8 de octubre de 2036.

### Datos de mercado · Yahoo Finance, cierre del viernes 20 nov
| Dato | Valor |
|---|---|
| Precio | $272.60 (ADR ASR, NYSE) |
| El viernes | **+2.06%**, el mismo día que el Nasdaq cayó **5.28%** (S&P 500 −3.70%) · Yahoo Finance, cierre del 20 nov 2026, verificado el 21 nov |
| Contra su máximo de 12 meses | **−28.5%** |
| En lo que va del año | −15.8% |
| P/E · P/E adelantado · PEG | 14.5 · 11.8 · 0.92 |
| ROE · margen neto | **21.7%** · **25.1%** |
| Ingresos a/a | **+18.9%** |
| Utilidad a/a | **+2.1%** ← la tensión |

### ⚠️ Secundario, NO se usa como cifra en pantalla
Rio Times y El Cronista reportan ingresos 3T de ~US$557 M, pasajeros del grupo −1.2% en el trimestre y deuda neta
de 2.6× EBITDA. **No pude abrir el reporte 3T26 oficial** (404 en el sitio y el índice de informes no lo lista),
así que esas cifras quedan fuera del video. Las de arriba sí están verificadas.

## Límites editoriales
- **No se dice si está cara o barata como veredicto.** Los múltiplos se nombran como dato, con su contexto.
- **No se usa el objetivo de analistas** que trae `data.json` ($328): precios objetivo prohibidos.
- Los dos riesgos van con el mismo peso que el motor.
- El cierre es un principio general, no una recomendación.

---

# ⚠️ HALLAZGO DEL 21 NOV 2026 — EL VIDEO ENTREGADO ESTÁ MAL

JP señaló que ASUR tiene aeropuertos en Brasil y otros países. Tenía razón. Verificado con fuente primaria.

## Lo que ASUR es HOY (y el video dice mal)
**Comunicado propio de ASUR:** "ASUR CONCLUYE LA ADQUISICIÓN DE LA PARTICIPACIÓN DE MOTIVA EN AEROPUERTOS DE
BRASIL, ECUADOR, COSTA RICA Y CURAÇAO". Compró el 100% de Companhia de Participações em Concessões (CPC),
subsidiaria de Motiva (antes CCR). Contrato firmado el 18 nov 2025; cierre el 1 sep 2026.
- **+20 aeropuertos**: 17 en Brasil y 3 entre Ecuador, Costa Rica y Curaçao.
- Precio reportado por la prensa: ~US$992 millones / R$5,187 millones. **Secundaria: falta confirmarlo en el
  comunicado o el reporte trimestral.**
- ASUR opera ahora en **SIETE países**: México, Colombia, Puerto Rico, Brasil, Ecuador, Costa Rica y Curaçao.

**Comunicado de tráfico de OCTUBRE 2026 (ya publicado, más nuevo que el que usé):** reporta por país —
Puerto Rico +4.8%, Colombia +2.8%, Brasil +0.9%, Ecuador +0.2%, México −5.4%, Costa Rica −6.6%, Curazao −3.5%.
Confirma que los siete países ya están en el reporte mensual.

## Los tres errores del video entregado
1. **Factual:** dice "En México, Colombia y Puerto Rico". Son siete países y 20 aeropuertos más desde el 1 sep 2026.
2. **Viejo:** usé el comunicado de tráfico de septiembre existiendo ya el de octubre (regla del cierre: datos lo más
   actualizados posible).
3. **Visual:** 9 escenas `statement` seguidas. La tabla de 12 escenas de `/short` §1b pide `photo`, `news`, `bars`
   (ingresos y utilidad por trimestre) y `metric`. El video quedó siendo puro texto, sin una sola gráfica.

## Causa raíz (para no repetirlo)
- Construí sobre `business_summary` de `data.json`, que es el perfil de Yahoo y está **desactualizado**: lista solo
  México, Colombia y Puerto Rico. Nunca abrí la sala de prensa de ASUR. **`data.json` no es fuente primaria para
  lo que la empresa ES; solo para precios y múltiplos.**
- Escribí el storyboard sin abrir la tabla de 12 escenas de `/short` §1b. Por eso salieron 9 `statement`.

## El ángulo que sale de esto (mejor que el entregado)
La tensión que el video reporta sin explicar — ingresos +18.9% y utilidad +2.1%, más deuda nueva — **tiene causa:
ASUR se acaba de comprar 20 aeropuertos**. Eso es el video: no "Cancún se cae", sino "Cancún se cae y aun así
ASUR creció, porque dejó de ser una empresa mexicana". Falta verificar si la deuda de 1,800 millones financió
la compra (lo di por hecho de Aerostar, sin confirmarlo).
