# Short de contexto · AMZN · viernes 27 de noviembre de 2026

**Formato:** short vertical de contexto (`/short` §1c) · 7 escenas · objetivo 60–75 s
**Se publica:** hoy 19:00 CDMX · **JP graba su voz** (Voz en off en la app de YouTube)
**Estado:** 🚦 PRIMERA PUERTA — esperando tu OK. No he construido nada.

> **v2.** La v1 la escribí antes de leer la skill completa y tenía tres errores de formato:
> 148 palabras cuando sin voz el rango es **100–125**, una cascada por segmentos en vez de la
> cascada real del estado de resultados, y una escena de columnas que **el motor no tiene**.
> Corregido abajo, y la decisión del motor te la dejo a ti (punto 5).

---

## 1. Conflicto de interés que tengo que declarar

**Amazon es uno de los principales inversionistas de Anthropic, y yo (Claude) soy un producto de
Anthropic.** No es teórico: el propio reporte que cito lo menciona — la utilidad neta bajó contra el
año pasado porque en el tercer trimestre de 2025 Amazon registró **9,500 millones de dólares de
ganancia antes de impuestos por su inversión en Anthropic**.

Regla del canal: "cualquier relación entre quien escribe y la empresa analizada se dice, y la decisión
de publicarla o no es de JP". **Tres caminos:**

1. Seguir y **declararlo en la descripción** (lo que yo haría: el guion no toca esa inversión y los
   números son de la SEC).
2. Seguir y **declararlo también en la voz**.
3. Cambiar de empresa: **Tesla** (+5.2% el viernes), igual de gigante y sin relación conmigo.

---

## 2. Por qué esta empresa y este ángulo

Sesión corta de Black Friday, cerró en verde: S&P 500 +1.60%, Nasdaq +2.31%. Amazon **+3.96%, a
254.12 dólares**. Eso es la percha, nada más: en el short no aparece la palabra "hoy".

**Los titulares, antes de escribir el gancho** (regla del 20 nov):
- **Lo que dijeron TODOS:** Black Friday, sesión corta, rebote de la tecnología. Nada de Amazon en sí.
- **Lo que dijo CASI NADIE:** que Amazon tuvo el margen de operación más alto de su historia **y** que
  su flujo de efectivo libre de doce meses se dio la vuelta: venía de **+14,788** millones y está en
  **−42,357**.
- **Cifras donde los medios no coinciden:** el cierre del S&P (7,297.49 vs 7,302.10 según la fuente) y
  el capex de 2026 (200 mil vs 220 mil millones). **Las dos las resolví con fuente primaria**: el capex
  sale textual del reporte y el cierre del S&P no entra al video.

**El ángulo** (motor: *desmontaje*): casi todos creemos que Amazon gana vendiendo cosas. La tienda pone
el **77% de las ventas y solo el 37% de la ganancia de operación**; AWS pone **23% y 63%**. Y el remate:
con el mejor margen de su historia, está quemando efectivo porque se lo está gastando en centros de
datos. Eso sigue siendo cierto dentro de seis meses.

---

## 3. Los números, con su fuente

**Fuente primaria:** Amazon, resultados del 3T 2026 (trimestre cerrado el **30 de septiembre de 2026**),
Exhibit 99.1 del 8-K ante la SEC —
`sec.gov/Archives/edgar/data/0001018724/000101872426000038/amzn-20260930xex991.htm`
**Mercado:** Yahoo Finance, cierre del **viernes 27 de noviembre de 2026**.

### Estado de resultados del trimestre (la cascada)

| Barra | Monto (millones USD) | % de ventas |
|---|---|---|
| Ventas | 201,944 | 100% |
| Comprar la mercancía (cost of sales) | (94,573) | 47% |
| Guardar y enviar (fulfillment) | (29,997) | 15% |
| Tecnología e infraestructura | (34,814) | 17% |
| Vender y anunciar (sales & marketing) | (11,649) | 6% |
| Administración y otros | (2,835) | 1% |
| **Utilidad de operación** | **28,076** | **14%** |

Cuadra: 94,573 + 29,997 + 34,814 + 11,649 + 2,835 = 173,868 · 201,944 − 173,868 = **28,076** ✓
Y 47 + 15 + 17 + 6 + 1 + 14 = **100** ✓

### Los segmentos (el desmontaje)

| Segmento | Ventas | % ventas | Utilidad de operación | % de la ganancia |
|---|---|---|---|---|
| **Tienda** (Norteamérica + Internacional) | 155,960 | **77%** | 10,303 | **37%** |
| **AWS** | 45,984 | **23%** | 17,773 | **63%** |
| Total | 201,944 | 100% | 28,076 | 100% |

Desglose: Norteamérica 112,852 / 8,723 · Internacional 43,108 / 1,580 · AWS 45,984 / 17,773.
Cuadra: 112,852 + 43,108 + 45,984 = 201,944 ✓ · 8,723 + 1,580 + 17,773 = 28,076 ✓

### El giro (doce meses a septiembre de 2026)

| Concepto | 12m a sep. 2026 | 12m a sep. 2025 |
|---|---|---|
| Compras de propiedad y equipo | 215,192 | 120,131 |
| **Flujo de efectivo libre** | **(42,357)** | **14,788** |

Guía de la empresa, textual: *"We continue to expect 2026 cash capital expenditures to be approximately
$220 billion."*

**Mercado al cierre del viernes 27:** 254.12 USD (+3.96% en la sesión) · valor de mercado 2.75 billones ·
−10.5% desde su máximo de cierre de 12 meses (284.02, del 3 de agosto de 2026) · +8.96% en un año.

**Nada va rotulado `ilustrativo`:** todas las cifras son reales y tienen fuente. No hay ninguna
proyección mía: los 220 mil millones van citados como lo que *dice la empresa*.

---

## 4. El guion de rodaje · 7 escenas · 132 palabras

> **Reloj:** sin voz, `no_voice.py` mide a ~120 palabras/min **contando sílabas**, y este guion está
> cargado de números (que tardan mucho más de lo que parecen). Estimo **70–78 s**, dentro de la banda
> de 60–85 s del formato. La medición real la corro en cuanto apruebes el texto. **Si se pasa de 85 s,
> el recorte sale de la escena 3** (quito "y 17 en tecnología").

### 1 · `hook` · ~9 s
| Se NARRA | Se VE |
|---|---|
| «Amazon tuvo el trimestre más rentable de su historia… y su flujo libre está en menos 42 mil millones.» | Foto de paquetes en la banda de un centro logístico, **a toda la pantalla** (`bg_full`), con velo oscuro. Logo de Amazon arriba a la derecha. Tú en 3D abajo a la izquierda, chiquito, acto `senala`, `mood: down`. **Rótulo en dos tiempos:** `Margen récord` en arena y, 0.3 s después, `Flujo libre: −$42,357 M` en naranja. |

### 2 · `company` · ~5 s
| Se NARRA | Se VE |
|---|---|
| «Casi todos creemos que gana vendiendo cosas.» | Nombre + logo. Fichas: `Valor de mercado · 2.75 billones de USD`, `Ventas del trimestre · $201,944 M`. Fondo arena. |

### 3 · `waterfall` · ~17 s
| Se NARRA | Se VE |
|---|---|
| «De cada 100 dólares que vendió en el trimestre que cerró en septiembre, 47 se van en la mercancía y 17 en tecnología. Le quedan 14 de ganancia de operación.» | La cascada de la tabla de arriba, **con los montos reales** y el % encima de cada barra. Colores funcionales: azul las ventas, rojo lo que resta, verde lo que queda. `callout` **dentro de la barra de ventas**: la porción de AWS en azul más claro, `AWS · 23%`. Subtítulo: `Trimestre cerrado el 30 de septiembre de 2026 · millones de dólares`. |

### 4 · `columnas` (escena nueva — ver punto 5) · ~12 s
| Se NARRA | Se VE |
|---|---|
| «Y la tienda pone 77 de cada 100 dólares de venta… pero solo 37 de cada 100 de esa ganancia.» | **Columnas verticales con eje X y eje Y** (regla de JP del 20 nov). Dos grupos: `Ventas` y `Ganancia de operación`. La columna de la tienda altísima en ventas, chaparra en ganancia. Etiquetas completas: `Tienda · 77% de las ventas` / `Tienda · 37% de la ganancia de operación`. |

### 5 · `photo` · ~11 s
| Se NARRA | Se VE |
|---|---|
| «El resto lo pone AWS, que renta servidores: 23 por ciento de las ventas, 63 de la ganancia.» | Foto de un centro de datos a toda la pantalla. Las mismas dos columnas se quedan chiquitas en una esquina con AWS ya en naranja. Rótulo: `AWS · 23% de las ventas · 63% de la ganancia de operación`. |

### 6 · `catalyst` · ~14 s
| Se NARRA | Se VE |
|---|---|
| «Ese flujo negativo es porque en doce meses se gastó 215 mil millones en instalaciones y equipo, y dice que en 2026 serán 220 mil.» | Foto de servidores / obra de un centro de datos. Dos cifras enfrentadas con su etiqueta completa: `12 meses a sep. 2025 · $120,131 M` y `12 meses a sep. 2026 · $215,192 M`. Abajo, chiquito: `La empresa espera ~$220,000 M en 2026 · según su propia guía`. |

### 7 · `outro` · ~10 s
| Se NARRA | Se VE |
|---|---|
| «Vale la pena vigilar si la ganancia de AWS crece más rápido que esa inversión.» | Foto de una furgoneta de reparto a toda la pantalla. Tú en 3D, acto `cierre`. Rótulo: `Qué vigilar: ganancia de AWS vs. inversión en centros de datos`. Aviso legal y CTA automáticos. |

**Comprobación de la regla del rótulo:** cada cifra que dice la voz tiene su rótulo en la escena que le
toca, con su unidad y su sujeto, y en ningún lado digo "utilidad" a secas — siempre **utilidad de
operación**, que es la que estoy comparando.

---

## 5. La única decisión técnica: la escena de columnas

Tu regla del 20 de noviembre dice que **comparar dos cantidades va en columnas verticales con eje X y
eje Y visibles**, no en barras horizontales. Revisé el motor (`engine/engine.js`) y **esa escena no
existe**: hay `bars` (ingresos y utilidad por trimestre), `ronda` y `tabla` del torneo, y nada más.

- **Opción A (la que yo haría):** le agrego al motor una escena `columnas` — dos grupos de columnas con
  sus ejes, unos 60 renglones. Es media hora, no gasta créditos, y queda para todos los shorts que
  comparen dos cosas, que es constante.
- **Opción B:** lo resuelvo con dos escenas `metric` (una para 77/37 y otra para 23/63). Sale hoy sin
  tocar el motor, pero rompe tu regla de las columnas.

---

## 6. Decisiones de estilo, una línea cada una

- **Color de marca:** naranja Amazon `#FF9900`, verificado en su logo. Es un color fuerte → el resto del
  video va con **fondo arena** (regla §1b). Gancho, catalizador y cierre llevan foto a toda pantalla.
- **Motor narrativo:** *desmontaje* — un titular que casi todos creen y la cuenta dice otra cosa.
- **Tú en 3D:** solo gancho y cierre. Actos `senala` + `cierre`, vestuario **polo**, para no repetir el
  `piensa` + `blazer` del short de Nvidia del 17 de noviembre.
- **Fotos (4 + logo):** paquetes en la banda, centro de datos, servidores u obra, furgoneta de reparto.
  Reales, libres, ≥1600 px, ninguna repetida en escenas seguidas, ninguna generada con IA.
- **Cascada:** montos reales en pantalla, narración en porcentajes (es lo que manda §1e cuando los
  montos son de miles de millones), colores funcionales y no los de la marca.
- **Sin recomendación:** no hay precio objetivo ni "cómprala". El cierre es qué vigilar, no un veredicto.

---

## 7. Título y descripción (borrador)

**Título** (71 caracteres):
```
Amazon vende $201 mil millones y la tienda no es donde gana #Amazon #acciones
```

**Descripción:**
```
Amazon tuvo el margen de operación más alto de su historia y aun así su flujo de efectivo libre quedó en menos 42,357 millones de dólares.

📌 Datos clave
• Ventas del trimestre cerrado el 30 de septiembre de 2026: $201,944 M
• Utilidad de operación: $28,076 M (14% de las ventas)
• La tienda: 77% de las ventas y 37% de la ganancia de operación
• AWS: 23% de las ventas y 63% de la ganancia de operación
• Compras de propiedad y equipo, doce meses: $215,192 M (eran $120,131 M)
• La empresa espera ~$220,000 M de inversión en 2026, según su propia guía

¿Crecerá la ganancia de AWS más rápido que esa inversión?

Fuentes: Amazon, resultados del 3T 2026 (Exhibit 99.1 del 8-K ante la SEC) · Yahoo Finance (cierre del 27 de noviembre de 2026).

Nota: Amazon es inversionista de Anthropic, la empresa de la herramienta de IA con la que se preparó este video.

Contenido educativo. No es asesoría financiera.
Costa Studio Finance, by JP Armendáriz.

#Amazon #AMZN #AWS #acciones #Shorts
```

---

## Registro de cambios

- v1 · 27 nov 2026 · primera versión (escrita sin leer la skill completa; 148 palabras, cascada mal planteada).
- v2 · 27 nov 2026 · leídas `/short` completa, `anatomia-formatos.md`, `voz-jp.md` y `CLAUDE.md`:
  132 palabras en 7 escenas, cascada real del estado de resultados con `callout` de AWS, narración en
  porcentajes, tipos de escena del motor, y la escena de columnas marcada como decisión pendiente.
