# Fuentes · Finanzas conductuales: por qué tu cerebro te hace perder dinero
**Largo del domingo 22 nov 2026.** Verificación hecha el 22 nov 2026. Todas las cifras del guion salen de aquí.

## ⚠️ Lo que NO se usó, y por qué

El `calendario-largos.md` proponía abrir con: *"Un fondo de Fidelity ganó casi 30% al año durante 13 años y aun así
muchos de sus inversionistas perdieron dinero."* Es el caso Magellan / Peter Lynch.

**Se descartó: no tiene fuente primaria.** Es una cifra que circula en charlas y artículos sin que Fidelity ni ningún
estudio publicado la respalde. Entra en conflicto directo con la regla "un número que no se puede verificar no se
publica" (`CLAUDE.md`, bloque 2). En vez de omitirlo en silencio, **el video cuenta que se descartó y por qué**: es el
capítulo del mito y es más útil que el dato falso.

También se descartó construir el video sobre "la brecha del comportamiento" como hecho establecido: la literatura la
está discutiendo ahora mismo (ver §3 abajo). El video presenta las dos posturas.

## 1. El gancho y el capítulo 1 — el experimento

**Barber, Brad M. y Terrance Odean (2000). "Trading Is Hazardous to Your Wealth: The Common Stock Investment
Performance of Individual Investors." *The Journal of Finance*, vol. 55, núm. 2, pp. 773–806. DOI 10.1111/0022-1082.00226.**
PDF del autor: https://faculty.haas.berkeley.edu/odean/papers/returns/individual_investor_performance_final.pdf
Ficha: https://econpapers.repec.org/RePEc:bla:jfinan:v:55:y:2000:i:2:p:773-806

| Dato usado en el video | Valor | Dónde |
|---|---|---|
| Hogares estudiados | **66,465** con cuenta en una casa de bolsa de descuento | resumen del paper |
| Periodo | **1991–1996** | resumen |
| Rendimiento del mercado | **17.9% anual** | resumen |
| Hogar promedio | **16.4% anual** (neto) | resumen |
| El 20% que más operaba | **11.4% anual** | resumen |
| Rotación del portafolio, hogar promedio | **75% al año** | resumen |
| Diferencia mercado − los que más operaban | **6.5 puntos** | 17.9 − 11.4, aritmética sobre las cifras de arriba |

## 2. Capítulo 2 — los tres sesgos

### Aversión a la pérdida
- **Kahneman, Daniel y Amos Tversky (1979). "Prospect Theory: An Analysis of Decision under Risk."** *Econometrica*,
  vol. 47, núm. 2, pp. 263–291. **DOI 10.2307/1914185.**
- **Tversky, Amos y Daniel Kahneman (1992). "Advances in Prospect Theory: Cumulative Representation of Uncertainty."**
  *Journal of Risk and Uncertainty*, vol. 5, pp. 297–323. **DOI 10.1007/BF00122574.** De aquí sale el **λ ≈ 2.25**
  (perder duele ~2.25 veces más que gustar ganar lo mismo).
- Nobel de Ciencias Económicas 2002 a Daniel Kahneman: The Nobel Prize (api.nobelprize.org).
*(Las tres ya estaban verificadas para la Historia 3D del 21 nov 2026, `videos/2026-11-21-KAHNEMAN-historia/youtube.md`.)*

### Efecto disposición
- **Shefrin, Hersh y Meir Statman (1985). "The Disposition to Sell Winners Too Early and Ride Losers Too Long."**
  *The Journal of Finance*, vol. 40, núm. 3. **DOI 10.1111/j.1540-6261.1985.tb05002.x.**
- **Odean, Terrance (1998). "Are Investors Reluctant to Realize Their Losses?"** *The Journal of Finance*, vol. LIII,
  núm. 5, octubre 1998, pp. 1775–1798. **DOI 10.1111/0022-1082.00072.**
  PDF del autor: https://faculty.haas.berkeley.edu/odean/Papers%20current%20versions/AreInvestorsReluctant.pdf
  **Verificado leyendo el PDF el 22 nov 2026** (no por fuente secundaria):

| Dato usado en el video | Valor | Dónde en el paper |
|---|---|---|
| Muestra | **10,000 cuentas** en una casa de bolsa de descuento nacional, **enero 1987 – diciembre 1993**, 162,948 registros | Sección de datos |
| Proporción de **ganancias** realizadas (PGR) | **0.148** = 14.8% | **Tabla I**, columna "Entire Year" |
| Proporción de **pérdidas** realizadas (PLR) | **0.098** = 9.8% | **Tabla I**, columna "Entire Year" |
| Cuánto más venden las ganadoras | 14.8 ÷ 9.8 = **~1.5 veces** | aritmética sobre la Tabla I |
| Lo que costó | las ganadoras vendidas rindieron **3.4 puntos** más que las perdedoras conservadas en el año siguiente (exceso sobre el índice CRSP ponderado por valor) | **Tabla VI** y texto: *"For winners that are sold, the average excess return over the following year is 3.4 percent more than it [is for the losers held]"* |
| En diciembre se invierte | PLR 0.128 > PGR 0.108 (venta por impuestos) | Tabla I, columna "December" |

### Exceso de confianza
- **Barber, Brad M. y Terrance Odean (2001). "Boys Will Be Boys: Gender, Overconfidence, and Common Stock Investment."**
  *The Quarterly Journal of Economics*, vol. 116, núm. 1, pp. 261–292. **DOI 10.1162/003355301556400.**
  PDF del autor: https://faculty.haas.berkeley.edu/odean/papers/gender/boyswillbeboys.pdf
  **Verificado leyendo el PDF el 22 nov 2026.** Del resumen, textual:

> *"Using account data for over 35,000 households from a large discount brokerage, we analyze the common stock
> investments of men and women from February 1991 through January 1997. We document that men trade 45 percent more
> than women. Trading reduces men's net returns by 2.65 percentage points a year as opposed to 1.72 percentage
> points for women."*

| Dato usado en el video | Valor |
|---|---|
| Muestra | **más de 35,000 hogares**, casa de bolsa de descuento, **feb 1991 – ene 1997** |
| Los hombres operan | **45% más** que las mujeres |
| Operar le recortó a los hombres | **2.65 puntos** al año |
| Operar le recortó a las mujeres | **1.72 puntos** al año |
| Diferencia | **0.94 puntos** al año |
| Solteros | los hombres solteros operan **67% más** que las mujeres solteras, y pierden **1.44 puntos** más al año |

## 3. Capítulo 3 — lo que está medido y lo que se discute

### Morningstar, "Mind the Gap" (edición 2026)
Los 10 años cerrados el **31 de diciembre de 2025**:

| Dato usado en el video | Valor |
|---|---|
| Rendimiento de los fondos | **9.9% anual** |
| Rendimiento del inversionista promedio dentro de esos fondos | **8.7% anual** |
| Brecha | **1.2 puntos porcentuales** al año |
| Activos cubiertos / riqueza no obtenida | ~**$13.6 billones** / ~**$3.8 billones** |
| Brecha por categoría | acciones **0.4** · mixtos **0.7** · alternativos **1.6** · indizados **1.1** vs activos **1.6** |

Cobertura: https://www.wealthmanagement.com/investing-strategies/investors-miss-out-on-12-of-fund-returns-over-decade
y https://etfdb.com/equity-etf-content-hub/the-investor-return-gap-what-advisors-can-learn/

### La crítica académica (va en el video, en el mismo capítulo)
**Fulkerson, Jon A.; Bradford D. Jordan; Timothy B. Riley y Qing Yan (2026). "Bad Timing Does Not Cost Investors 15%
of Their Funds' Returns: An Examination of Morningstar's 'Mind the Gap' Study."** *Financial Analysts Journal*
(CFA Institute). **DOI 10.1080/0015198X.2026.2657253.**
- Página del CFA Institute: https://rpc.cfainstitute.org/research/financial-analysts-journal/2026/bad-timing-does-not-cost-investors-funds-returns
- Artículo: https://www.tandfonline.com/doi/full/10.1080/0015198X.2026.2657253
- SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4904652

**Hallazgo citado:** con la misma muestra, el mal *timing* del inversionista en fondos cuesta **0.10% al año**, y la
brecha de 1.2 puntos **no mide mal comportamiento**.

## 4. Lo que el video NO afirma
- No dice que la brecha del comportamiento sea un hecho cerrado: dice que está en debate y cita las dos partes.
- No usa el caso Magellan como dato (lo usa como ejemplo de número sin fuente).
- No recomienda comprar ni vender nada, ni da precios objetivo.
- Las cuatro reglas del capítulo 4 son hábitos de proceso, no consejos de inversión.

## 5. Conflicto de interés
Ninguno. Ninguna de las empresas o instituciones mencionadas (Fidelity, Morningstar, CFA Institute) es cliente de
Costa Studio; `plan/clientes-agencia.md` está vacío. Fidelity y Morningstar se mencionan solo como sujetos de
estudios públicos.
