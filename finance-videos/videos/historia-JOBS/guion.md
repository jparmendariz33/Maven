# Steve Jobs: lo sacaron de su propia empresa
Historia 3D · estilo **Costa Diorama v2** (luz de cine + actores articulados) · ~80 s · 1080x1920 · sin voz (JP graba la suya)

**Estado (9 nov 2026):** prueba de estilo con 4 de las 8 escenas (gancho, garaje, consejo, iPhone). Falta el OK de JP al estilo
para animar las otras 4 (los años fuera, el regreso de 1997, hoy y el cierre).

## Qué cambió frente a SpaceX (motor `engine3d/cine.js`)
- **Luz de cine:** luz principal cálida con sombra, contraluz que recorta la silueta, relleno frío, focos reales en interiores
  (el foco del garaje, el reflector del escenario) y profundidad de campo (el fondo y el primer plano se desenfocan).
- **Actores articulados:** piernas que caminan, brazos con codo y manos, cuello, parpadeo, cejas, boca que se abre con cada
  palabra del subtítulo. Reparto: Jobs a los 21, a los 30 y a los 51; Wozniak; seis consejeros.
- **Plastilina con huellas** (relieve de dedos en todas las piezas) y animación de personajes a 12 cuadros por segundo.
- **Viñeta y degradado de estudio** en el fondo; franja suave detrás del titular para que siempre se lea.
- Sin logotipos: "Apple Computer" y "Apple 1" aparecen solo como texto.

## Narración (8 escenas)
1. **1985 · La salida.** En 1985, a Steve Jobs lo sacaron de Apple. La empresa que él mismo había fundado.
2. **1976 · El garaje.** Todo empezó en 1976, en un garaje: dos amigos y una computadora armada a mano.
3. **1985 · El consejo.** Nueve años después, chocó con el director que él mismo había contratado. Y el consejo no lo eligió a él.
4. **1985–1996 · Los años fuera.** Jobs se fue y fundó otra empresa, NeXT. Mientras, Apple perdía el rumbo.
5. **1997 · El regreso.** En 1997, Apple perdió más de 1,000 millones de dólares. Según Jobs, estaba a 90 días de la quiebra. Y lo llamaron de vuelta.
6. **1998–2007 · El giro.** Recortó la mayoría de los productos y apostó por unos cuantos: el iMac, el iPod... y en 2007, el iPhone.
7. **Hoy.** Hoy, el iPhone es más de la mitad de las ventas de Apple, que vale unos 5 billones de dólares.
8. **Cierre.** ¿Genio irrepetible... o la prueba de que una empresa puede reinventarse?

## Datos y fuentes (por verificar contra fuente primaria antes del render final los marcados con *)
| Dato | Valor | Fuente |
|------|-------|--------|
| Fundación de Apple | 1 abr 1976, Jobs y Wozniak; el Apple I se armó a mano | historia de la empresa* |
| Salida de Jobs | Perdió la pugna con el CEO John Sculley (a quien él reclutó en 1983); el consejo respaldó a Sculley; Jobs renunció en sept. de 1985. En el guion: "lo sacaron" (no "lo despidieron") | hwbusters.com, Wikipedia (NeXT)* |
| NeXT | Fundada por Jobs en 1985; Apple anunció su compra el 20 dic 1996 por ~$429 M (cerró en feb 1997) | computinghistory.org.uk |
| Pérdida fiscal 1997 | $1,045 M | Informe anual de Apple FY1997* |
| "A 90 días de la quiebra" | Frase del propio Jobs (conferencia D8, 2010); va atribuida a él | mac-history.net* |
| iMac / iPod / iPhone | 1998 / 2001 / presentado el 9 ene 2007 | comunicados de Apple* |
| iPhone como % de ventas | 53.1% en el año fiscal 2026 ($254,098 M de $478,834 M) | Apple, 8-K del T4 FY2026 (ya verificado en `largos/2026-11-15/fuentes.md`) |
| Valor de mercado | ≈ $5 billones (≈ $5.08 al 4 nov 2026) — actualizar el día del render | Yahoo Finance |
| Acción desde 1997 | serie mensual ajustada por splits (`series.js`) | Yahoo Finance |

Contenido educativo, no es asesoría financiera. Caricatura editorial de una figura pública; sin logotipos reales.
