# Métricas del canal · tablero del gancho
**Reemplaza la versión anterior (13–14 nov 2026), que se calculó con vistas de la primera hora y sin separar la
publicidad pagada: daba una foto equivocada.** Desde el 20 nov 2026 los números salen de la API de vidIQ y de la
extensión conectada a YouTube Studio.

## Cómo se mide (cada lunes, ~15 créditos)
```
vidiq_channel_analytics_extended  report=shorts_stayed_to_watch   # 5 · el tablero del gancho
vidiq_channel_analytics           report=top_videos               # 5 · vistas reales por pieza
vidiq_channel_analytics           report=traffic_sources          # 5 · separar pagado de orgánico
```
**La métrica que manda es `stayedToWatchPercentage`**: de cada 100 personas a las que YouTube enseñó el Short en el
feed, cuántas NO deslizaron. Es literalmente el gancho. **Mínimo 49% (promedio del canal). Objetivo 70%.**
**Siempre se mide solo tráfico orgánico**, separando la publicidad.

## Corte del 20 nov 2026 (28 días)

### El gancho, pieza por pieza
| Pieza | Se queda | Impresiones del feed |
|---|---:|---:|
| Apple "$28 de cada $100" | **93.3%** | 105 |
| SpaceX | **86.5%** | 1,164 |
| Steve Jobs | 60.9% | 773 |
| Meta | 52.0% | 25 |
| GTA | 49.4% | 162 |
| Nvidia −9% | 46.9% | 224 |
| Vistra | 46.7% | 30 |
| Nvidia −6% | 45.6% | 46 |
| Airbnb | 45.1% | 51 |
| AMD | 43.1% | 153 |
| Nvidia contexto | 36.5% | 63 |
| Cuervo | 31.1% | 119 |
| Kahneman | **20.8%** | 24 |
| Torneo | **19.8%** | 116 |
| Nubank | **5.9%** | 1,158 |
| **CANAL** | **49.0%** | 4,258 |

**El caso que lo prueba:** SpaceX y Nubank recibieron prácticamente las mismas impresiones (1,164 vs 1,158) y
retuvieron 86.5% contra 5.9%. Misma semana, mismo canal, misma distribución inicial. La diferencia fue el gancho.

### De dónde vienen las vistas
| Fuente | Vistas | % | Retención | Duración |
|---|---:|---:|---:|---:|
| **Publicidad pagada** | 6,939 | **71%** | 16.5% | 22 s |
| Feed de Shorts | 2,194 | 22% | **51.8%** | 41 s |
| Página del canal | 305 | 3% | 31.2% | 30 s |
| **Búsqueda de YouTube** | 293 | 3% | **68.4%** | **61 s** |

- **El 71% de las vistas eran publicidad pagada de JP** (en SpaceX, el 92%). JP la detuvo el 20 nov; la de Kahneman
  ($240) fue la última. A partir de ahí los números son comparables entre sí.
- **La búsqueda es el mejor tráfico del canal** y el más desatendido: por eso los largos eligen tema con
  `keyword_research`.
- **402 suscriptores produjeron 16 vistas en 28 días** (12.96% de retención): la base comprada no abre los videos,
  y eso empeora la distribución futura.

### Vistas con intención (`engagedViews / views`)
El largo **"¿Qué es una acción?" tiene 87%**, el mejor del canal: los largos sí retienen a quien llega, pero llegan
poquísimos. El resto de los shorts orgánicos va entre 35% y 50%.

## Qué se anota cada semana
1. `stayedToWatchPercentage` de cada pieza nueva, contra el 49% del canal y el 86.5% de SpaceX (el techo demostrado).
2. Impresiones del feed (si bajan, el problema es distribución; si se mantienen y el gancho no, es el gancho).
3. Reparto pagado / orgánico.
4. Cualquier pieza bajo 49%: anotar **con qué frase abría**, para alimentar el patrón de `anatomia-formatos.md`.

## Revisión del 28 de noviembre
La hipótesis registrada el 14 de nov comparaba contra el 27.84% de Jobs, calculado con datos malos.
**Se compara contra el 49% del canal y el 86.5% de SpaceX, solo con tráfico orgánico.**
