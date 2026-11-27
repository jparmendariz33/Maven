# Short de contexto · BLACK FRIDAY · viernes 27 de noviembre de 2026

**Formato:** short vertical de contexto (`/short` §1c) · 7 escenas · **125 palabras / 670 caracteres**
(el rango sin voz es 100–125 palabras y `script_check.py` pide 650–950 caracteres: entra justo)
**Se publica:** hoy 19:00 CDMX · **JP graba su voz** (Voz en off en la app de YouTube)
**Estado:** 🚦 PRIMERA PUERTA — esperando tu OK sobre el guion. No he construido nada.

---

## 1. El ángulo

Tenías razón en lo de Amazon: no hubo noticia de la empresa ese día, yo estaba usando el Black Friday
como percha para hablar de otra cosa. El día **es** la historia.

**Lo que todos van a repetir:** que fue récord. Y es verdad — el Día de Acción de Gracias de 2026 se
gastaron **7,100 millones de dólares en línea en Estados Unidos, el máximo de la historia, 10.4% más
que el año anterior**.

**El giro que casi nadie cuenta:** más de la mitad de ese crecimiento no es gente comprando más cosas,
es que las cosas cuestan más. Mastercard proyecta que las ventas de la temporada crezcan **5.5%**, y
que **2.8 de esos 5.5 puntos vengan de precios más altos**.

**Y el mercado, que es lo que pediste:** la sesión del viernes 27 fue media jornada y cerró en verde,
y la que la subió fue la tecnología — Nasdaq **+2.31%** contra **+1.60%** del S&P 500.

**Por qué dura meses:** la lección es que *un récord en dólares no es un récord en cosas*. Eso sirve
igual en enero, en el Buen Fin, o leyendo las ventas de cualquier empresa. Por eso no aparece la
palabra "hoy" en ninguna parte y todas las fechas van completas.

---

## 2. Qué se puede afirmar y qué no

Esto es lo más delicado de esta pieza, así que lo pongo por delante:

| Cifra | Estado | Entra al video |
|---|---|---|
| Acción de Gracias 2026: $7,100 M en línea, +10.4% | **Hecho ocurrido** (Adobe Analytics) | Sí, es el gancho |
| 1–22 de noviembre: $82,500 M en línea, +9.1% | **Hecho ocurrido** (Adobe Analytics) | Sí |
| Temporada +5.5%, de los cuales 2.8 puntos son precio | **Pronóstico** (Mastercard Economics Institute) | Sí, **dicho como proyección** |
| Cierre del viernes 27: Nasdaq +2.31%, S&P 500 +1.60%, Dow +1.18% | **Hecho** (media jornada) | Sí |
| Inflación PCE de octubre: 3.8% anual | **Hecho** | Solo en pantalla, como referencia |
| Black Friday: $12,900 M, récord | ⚠️ **Pronóstico de Adobe. El dato real todavía no existe.** | **NO** |
| Temporada: $1.013 billones (NRF) | Pronóstico | No, sobra |

**No voy a decir que el Black Friday rompió un récord.** A esta hora eso es una proyección, no un dato,
y es justo el tipo de número que la regla manda omitir o citar como lo que es. El récord que sí existe
y sí está medido es el del Día de Acción de Gracias, y ése es el que uso.

**Fuentes:** Adobe Analytics (gasto en línea) · Mastercard Economics Institute (proyección de la
temporada) · cierres del 27 de noviembre de 2026 · Oficina de Análisis Económico de EE.UU. (PCE de
octubre). Las verifico y las dejo con liga en `youtube.md`.

---

## 3. El guion de rodaje · 7 escenas

> **Reloj:** 125 palabras, estimo **62–70 s** (`no_voice.py` mide por sílabas y aquí hay menos números
> que en el guion de Amazon). Lo mido en cuanto apruebes. Si se pasa, el recorte sale de la escena 2.

### 1 · `hook` · ~9 s
| Se NARRA | Se VE |
|---|---|
| «El Día de Acción de Gracias de 2026, Estados Unidos gastó 7,100 millones de dólares en línea. Récord.» | Foto de carritos o de una tienda llena, **a toda la pantalla** con velo oscuro. Tú en 3D, chiquito abajo a la izquierda, acto `senala`, `mood: up`. **Rótulo en dos tiempos:** `Acción de Gracias 2026` en arena y, 0.3 s después, `$7,100 M en línea en un día` en mostaza. Ficha chica: `+10.4% vs. 2025 · Adobe Analytics`. |

### 2 · `photo` · ~8 s
| Se NARRA | Se VE |
|---|---|
| «Del 1 al 22 de noviembre ya llevaba 82,500 millones, 9 por ciento más que el año anterior.» | Foto de paquetes de reparto apilados. Rótulo: `1 al 22 de noviembre de 2026 · $82,500 M en línea`, y debajo `+9.1% vs. 2025`. |

### 3 · `news` · ~13 s
| Se NARRA | Se VE |
|---|---|
| «Pero cuidado con la palabra récord. Mastercard proyecta que las ventas de la temporada crezcan 5.5 por ciento, y que 2.8 de esos puntos sean solo precios.» | Kicker: `PROYECCIÓN · MASTERCARD ECONOMICS INSTITUTE`. Titular: `La temporada crecería 5.5%`. Dos viñetas: `2.8 puntos · precios más altos` y `2.7 puntos · todo lo demás`. La palabra **proyección** va en el kicker a propósito, para que nadie lo lea como un dato cerrado. |

### 4 · `waterfall` · ~10 s
| Se NARRA | Se VE |
|---|---|
| «Más de la mitad del crecimiento no es gente llevándose más cosas. Es lo mismo, más caro.» | La cascada, pero en **puntos porcentuales** en vez de dinero (`percent: false`, el texto de cada barra forzado): `Crecimiento 5.5 pp` → `(precios 2.8 pp)` → `Crecimiento real 2.7 pp`. Colores funcionales: azul el total, rojo lo que resta, verde lo que queda. Subtítulo: `Proyección de la temporada · puntos porcentuales`. Al pie, chiquito: `Inflación PCE de octubre de 2026: 3.8% anual`. |

### 5 · `news` · ~10 s
| Se NARRA | Se VE |
|---|---|
| «Y la sesión del viernes 27 fue media jornada: cerró arriba, y la que la subió fue la tecnología.» | Kicker: `VIERNES 27 DE NOVIEMBRE DE 2026 · MEDIA JORNADA`. Tres viñetas con su etiqueta completa: `Nasdaq Composite +2.31%`, `S&P 500 +1.60%`, `Dow Jones +1.18%`. Foto chica de un piso de remates en la tarjeta. |

### 6 · `catalyst` · ~10 s
| Se NARRA | Se VE |
|---|---|
| «Lo que de verdad lo dirá son las ventas de diciembre, ya descontada la inflación.» | Rótulo grande: `Qué lo va a resolver: las ventas minoristas de diciembre`, y debajo `ya descontada la inflación`. Foto de una caja registradora o de etiquetas de precio. |

### 7 · `outro` · ~8 s
| Se NARRA | Se VE |
|---|---|
| «Un récord en dólares no siempre es un récord en cosas.» | Foto de una bolsa de compras o una tienda, a toda la pantalla. Tú en 3D, acto `cierre`. La frase grande en pantalla. Aviso legal y CTA automáticos. |

---

## 4. Dos cosas que rompo a propósito, y por qué

1. **El gancho no identifica una empresa.** La regla pide logo o foto de la empresa en el primer cuadro.
   Aquí no hay empresa: el sujeto es el consumidor de Estados Unidos, así que lo identifico con la
   imagen del día (carritos, tienda llena) y con la fecha en el rótulo. Te lo marco por si prefieres
   que entre algún logo.
2. **La cascada no es un estado de resultados**, son puntos porcentuales de una proyección. Uso la misma
   gramática visual de la casa porque es exactamente la misma idea —de dónde sale el total y qué se le
   va— pero con `percent: false` para que el motor no invente porcentajes sobre porcentajes.

---

## 5. Decisiones de estilo

- **Paleta:** sin color de marca (no hay empresa) → **arena Costa** en todo, con mostaza como acento.
  Una sola paleta de principio a fin.
- **Motor narrativo:** *desmontaje* — un titular que casi todos creen y la cuenta dice otra cosa.
- **Tú en 3D:** solo gancho y cierre. Actos `senala` + `cierre`, vestuario **polo**, para no repetir el
  `piensa` + blazer del short de Nvidia del 17 de noviembre.
- **Fotos (4 + ninguna repetida en escenas seguidas):** carritos o tienda llena, paquetes de reparto,
  piso de remates, caja registradora o etiquetas de precio. Reales, libres, ≥1600 px, nunca de IA.
- **Sin recomendación:** no se nombra ninguna acción para comprar ni vender. El cierre es un principio
  general, que además sigue siendo cierto el año que viene.

---

## 6. Título y descripción (borrador)

**Título** (76 caracteres):
```
Récord de compras en Acción de Gracias: cuánto es precio #BlackFriday #bolsa
```

**Descripción:**
```
El Día de Acción de Gracias de 2026 se gastaron 7,100 millones de dólares en línea en Estados Unidos, el máximo de la historia. Pero un récord en dólares no es lo mismo que un récord en cosas.

📌 Datos clave
• Acción de Gracias de 2026: $7,100 M en línea, 10.4% más que en 2025 (Adobe Analytics)
• Del 1 al 22 de noviembre de 2026: $82,500 M en línea, +9.1%
• Mastercard proyecta que la temporada crezca 5.5%, y que 2.8 de esos puntos sean precios más altos
• Inflación PCE de octubre de 2026: 3.8% anual
• Cierre del viernes 27 de noviembre (media jornada): Nasdaq +2.31%, S&P 500 +1.60%, Dow +1.18%

¿Compraste más cosas este año, o lo mismo más caro?

Fuentes: Adobe Analytics · Mastercard Economics Institute (proyección) · Oficina de Análisis Económico de EE.UU. · cierres del 27 de noviembre de 2026.

Contenido educativo. No es asesoría financiera.
Costa Studio Finance, by JP Armendáriz.

#BlackFriday #consumo #inflación #bolsa #Shorts
```

---

## Registro de cambios

- v1 · 27 nov 2026 · primera versión. Sustituye al guion de AMZN, que queda archivado en
  `videos/2026-11-27-AMZN/guion.md` por si algún día sirve el ángulo.
