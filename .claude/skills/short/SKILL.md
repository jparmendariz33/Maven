---
name: short
description: Crea un short vertical (YouTube Shorts / Reels / TikTok) con el análisis de una acción o de una empresa "caliente" (modo empresa), con fotos reales (logo, sucursales, productos), en el estilo de marca Costa Studio Finance, subtítulos-teleprompter y música. Úsala cuando el usuario diga "/short AAPL", "hazme el short de Tesla", "analiza la empresa X", "short de empresa", etc.
argument-hint: "<TICKER o nombre de la empresa> [enfoque opcional]"
---

> **Voz de JP (obligatorio en todo guion):** antes de escribir, lee `finance-videos/plan/voz-jp.md` y redacta con ese tono. El guion no debe sonar a IA.


# /short — análisis de una acción o empresa en video (Costa Studio Finance)

Dos modos, mismo motor, misma duración (~65–75 s sin voz) y misma marca:
- **Contexto** (lun, mar, jue; antes "reactivo"): la noticia de la sesión es el pretexto; el short cuenta algo que dure meses (sección 1c).
- **Empresa** (solo viernes): "Análisis + Potencial" (sección 1b). Desde el 11 nov 2026 absorbe a la "Tesis a 5 años" del sábado, que era lo
  mismo: la empresa es la caliente de la semana o, si ninguna lo amerita, una de `plan/banco-tesis.md`. `"mode": "empresa"` en el storyboard.
- **Ranking** (dom): top 3 o top 5 en cuenta regresiva (sección 1d).
**Todos los shorts llevan imágenes reales** que hagan sentido con la historia (sección 2b).
**Fecha (regla de oro de JP):** un short por día, hecho el MISMO día en que se publica (19:00 CDMX). La carpeta lleva la fecha de
publicación. En los shorts ya no se dice "hoy" ni "ayer" (§1c); eso vive en las publicaciones. Nunca produzcas shorts de días futuros
(el adelanto del miércoles lo hace la tarea del miércoles). Antes de elegir tema, revisa `plan/publicados.md` para no repetir, y al
terminar agrega el short ahí. `narration.txt` = los `say` del storyboard, uno por párrafo (regenéralo si cambias el guion).
**Modelo de estilo:** `videos/2026-11-07-ABNB/` (el favorito de JP) y, para el formato y los colores de empresa, `videos/2026-11-08-CUERVO/`.

### ✅ Checklist de estilo (reglas que pidió JP — revisa TODAS antes de entregar)
- **JP en 3D (§2c), obligatorio:** solo en el gancho y en el cierre, chico y recortado, sobre la foto del tema a pantalla completa (`bg_full`). Nada 3D en medio. Varía acto y vestuario respecto al short anterior.
- **Short reactivo = short de contexto (§1c):** sin "hoy" ni fecha en el título, el gancho y el guion; la noticia es el pretexto, el ángulo dura meses.
1. **Un video por día**, hecho el mismo día, que se publica **siempre a las 19:00 CDMX**. **Regla del cierre:** los datos son los de
   CIERRE de la sesión; nada se termina ni se entrega antes de que cierre la bolsa (`python3 scripts/market_close.py`; ver `CLAUDE.md`).
   Si JP pide un tema durante el día, prepara todo y entrégalo UNA vez, después del cierre, ya con los datos finales.
2. **Empresas:** solo las que ya cotizan en bolsa o están cerca de su IPO (prospecto o fecha anunciada). Nada privado, startups ni cripto.
3. **Formato de empresa "Análisis + Potencial"** (§1b): mitad análisis, mitad potencial a 5 años; riesgos con el mismo peso;
   nunca "cómprala" ni precios objetivo; `disclosure` si JP tiene acciones (`plan/posiciones-jp.md`).
4. **Colores** (§1b): `brand_colors` con el color real de la marca (verificado en logo/etiqueta/sitio). Gancho, catalizador y
   cierre con fondo de la marca; el resto con UN fondo Costa (arena para marcas fuertes; azul solo para marcas pastel); los datos
   de la empresa en su color; **todas las viñetas de las listas en el color de la empresa** (nada de verdes sueltos); nunca bloques
   rellenos del color de la empresa sobre el azul Costa.
5. **Logo SIEMPRE:** la escena `company` lleva `logo` (y el logo sale en cada video de empresa). **Los logos van SIEMPRE en PNG
   transparente** (nunca JPG ni capturas con fondo) para que se vea el fondo del video; el motor lo dibuja sin recuadro (solo pone
   ficha blanca si el logo es tan claro que se perdería). Fuentes, en orden: `icon` (simple-icons), `logo` (Commons .svg) o
   `add … logo URL.svg --logo` (SVG/PNG del sitio oficial o sala de prensa de la empresa). Si la escena es de la matriz (Becle),
   usa el logo de la matriz.
6. **Fotos reales** (3–5 + logo; nunca IA de marcas o personas): a pantalla completa sobre negro, con el texto en el color base
   del video (arena, o azul si la marca es pastel).
7. **Datos verificados** con fuente primaria (reporte trimestral, 8-K/10-Q, BMV, prospecto) y P/E recalculado si acaba de reportar.
8. **QA (`build/qa.jpg`):** nada encimado ni fuera de la zona segura; el logo aparece; los colores siguen las reglas 4–6;
   duración 75–85 s en formato de empresa.
9. **Entrega:** MP4 + título y descripción listos para copiar + guion para leer (§5).

Proyecto: `finance-videos/` en la raíz del repo. Todo se ejecuta desde ahí:
`cd finance-videos` (rutas abajo relativas a esa carpeta).

El usuario es **Juan Pablo Armendáriz (@jparmendariz)**. Escríbele en español, corto y claro.

## 0. Preparar la sesión (siempre, ~1 min)
```bash
bash scripts/setup.sh
```
Crea `.venv` (numpy + faster-whisper). ffmpeg y Playwright ya vienen en el contenedor.

## 1. Datos (sin preguntar)
**Primero: `python3 scripts/market_close.py`.** Si dice ABIERTO, adelanta investigación, imágenes y guion (sin cifras de precio) y
corre `python3 scripts/market_close.py --wait` en segundo plano; `fetch_data.py`, las cifras del guion y el render van DESPUÉS del
cierre. Si dice SIN SESIÓN (fin de semana o festivo), usa el último cierre y nombra ese día ("el viernes…").
Si el usuario dio un nombre y no un ticker, deduce el ticker (Apple → AAPL; Sea Limited → SE).
```bash
ID=$(date +%F)-TICKER            # ej. 2026-11-07-AAPL
python3 scripts/fetch_data.py TICKER videos/$ID
```
Lee `videos/$ID/summary.md`. Incluye precio, cambios (1d, 15 sesiones, 1m, 3m, 1a, YTD), P/E, P/E forward, PEG, ROE,
márgenes, crecimiento, trimestres (ingresos / utilidad neta / EPS), próximos resultados, los movimientos diarios más grandes
de las últimas 60 sesiones (con volumen vs promedio) y titulares semilla.

**Investiga y verifica** con WebSearch (modo standard; extended si hace falta):
- Qué explica el movimiento reciente: cruza las fechas de `biggest_moves_60s` con noticias. No atribuyas una caída a un evento
  si el precio ya venía cayendo antes (dilo con matiz).
- El trimestre más reciente: Yahoo a veces no trae el último trimestre publicado. Si falta, búscalo (comunicado de la empresa)
  y pásalo en la escena `bars` con `"quarters": [...]`.
- Fecha confirmada del próximo reporte.
- **Si la empresa acaba de reportar, Yahoo trae P/E, ROE y EPS de los 4 trimestres ANTERIORES** (desactualizados). Recalcula:
  P/E = precio ÷ suma del EPS diluido de los últimos 4 trimestres (incluido el nuevo). Ejemplo ABNB 6 nov 2026: Yahoo 42.6x,
  real 35x. Si no puedes recalcular una métrica con fuente primaria, usa otra (p. ej. margen neto del trimestre, del 8-K).
Guarda las fuentes (URLs) para `youtube.md`.

## 1e. Cascada (waterfall) siempre que se hable del estado de resultados (regla de JP, 11 nov 2026)
Cuando un video explique cómo gana dinero una empresa, sus márgenes, sus resultados o su P&L, **incluye una cascada**: de los ingresos a
la utilidad neta, mostrando en qué se va cada parte. Es la forma más visual de entenderlo, y además sirve para revisar que los números cuadren
(si las barras no llegan al resultado, hay un dato mal).
- Shorts: escena `waterfall` (ver esquema). Largos: escena `cascade`. Publicaciones: descríbela en una imagen `dato` con viñetas, o usa la gráfica.
- Escala fácil: "de cada $100 que vende" (porcentajes sobre ingresos) o en miles de millones, pero una sola escala por cascada.
- Pasos típicos: ingresos → costo de lo vendido → gastos de operación (investigación, ventas, administración) → impuestos y otros → utilidad neta.
  Si la empresa pierde dinero, la última barra se muestra como pérdida y se dice claro.
- Todos los números salen del reporte oficial (10-K/10-Q/8-K o reporte a la BMV) y deben sumar: ingresos − todo lo que sale = utilidad neta.
- En Análisis + Potencial ponla en la mitad de análisis ("cómo gana dinero"). En el guion, una frase la recorre: "entran 100, salen 51, 16 y otros 5; quedan 28".

## 1c. Short reactivo = short de CONTEXTO (lunes, martes y jueves — plan del 11 nov 2026)
Lo que pasó hoy caduca mañana, y un short se sigue viendo durante meses. Por eso la noticia del día es solo el PRETEXTO para elegir el tema;
el short cuenta algo que siga siendo cierto dentro de 3 meses. (Lo del día exacto vive en las publicaciones: skill `/publicacion`.)
- **Ángulo:** qué le está pasando a la empresa (el mes, el trimestre, el año), por qué, y qué viene o qué tiene planeado. Ej.: no "Nvidia
  cayó 5% hoy", sino "Nvidia lleva un mes cayendo: esto pasa y esto es lo que planea". O "Apple sacó X: esto es lo que puede implicar".
- **Nunca "hoy", "ayer", "esta mañana", "esta semana"** en el título, el gancho y el guion: eso es lo que hace que el video se sienta viejo mañana.
- **SÍ fechas absolutas, y entre más concretas mejor (precisión de JP, 12 nov 2026):** un hecho puntual se dice con su fecha completa
  ("el 12 de noviembre de 2026 renunció el fundador de Nvidia"); un periodo, con su marco ("viene cayendo desde enero de 2025", "en 2026
  lleva −30%", "desde su máximo del 6 de octubre de 2026"). Una fecha exacta del pasado NO caduca: es justo lo que vuelve atemporal al video.
  Lo que nunca va son las referencias relativas ("este mes", "este año", "en el último mes", "la semana pasada"), porque dependen de cuándo
  se vea. Regla práctica: si alguien ve el short en 5 años, debe saber de qué época habla sin sentir que es una noticia caducada.
- **Gancho con la cifra de periodo largo** (1 mes, 3 meses, en el año, desde el máximo), no con la del día.
- **Lo que viene es el gancho:** el corazón del short es el porqué y, sobre todo, qué viene o qué tiene planeado la empresa. De vez en cuando
  (no siempre, que no se vuelva fórmula) úsalo para retener: "y lo que tiene planeado es lo interesante". Sin exagerar ni prometer de más.
- **Cierre:** qué vigilar en los próximos meses (un evento, un dato, un lanzamiento), no "mañana veremos".
- Sigue valiendo todo lo demás: datos de cierre verificados (Regla del cierre), no repetir empresas, fotos reales, nunca recomendación.
- Los shorts de viernes, sábado y domingo (Análisis + Potencial) y el derivado del miércoles ya son atemporales: no cambian.

## 1d. Formato RANKING (top 3 o top 5) — idea de JP, 11 nov 2026
Cuenta regresiva: del último lugar al número 1. Sirve para shorts, publicaciones y, de vez en cuando, un largo.
- **Estructura del short:** gancho ("Las 5 … de 2026") → #5 → #4 → #3 → #2 → **pausa antes del #1** ("Antes del número 1: sígueme, que cada
  semana hay uno de estos") → #1 → cierre con pregunta ("¿Cuál pondrías tú?"). Una escena por puesto, con la foto o el logo de la empresa, el
  número grande en el `kicker` ("#5") y UN dato que explique por qué está ahí. Top 3 si los datos necesitan más aire; top 5 si son de una línea.
- **El criterio manda y se dice en pantalla.** Todo ranking se ordena por un dato verificable: crecimiento de ingresos, margen, rendimiento en
  el año, caída desde el máximo, dividendo, valor de mercado, flujo libre… Di el criterio en el gancho y la fecha de corte en la descripción.
- **Nunca "las que van a subir" ni "las mejores para comprar".** Eso es recomendación y predicción. En su lugar: "las 5 que más crecieron este
  año", "las 5 más castigadas del S&P 500" o, el favorito de JP, **"5 empresas que Costa Studio Finance está vigilando y por qué"**.
- **Quien vigila es el canal, no JP (pedido de JP, 11 nov 2026):** en rankings y listas de seguimiento el sujeto es SIEMPRE "Costa Studio
  Finance" ("estamos vigilando", "en Costa Studio Finance seguimos de cerca…"); no digas "JP vigila", "yo vigilo" ni su nombre. Cada puesto
  lleva por qué se vigila Y su riesgo, con el mismo peso. Es una lista de seguimiento, no de compra: dilo una vez en el video y en la descripción.
  Si alguna empresa está en `posiciones-jp.md`, se declara como "Costa Studio Finance tiene posición en <empresa>".
- **Vigencia:** evita rankings atados a un mes ("para diciembre"); caducan en semanas. Mejor "de 2026", "de los últimos 12 meses", "de la década".
- **vidIQ para elegir tema y título (permitido por JP el 11 nov 2026; única excepción a "costo cero"):** carga con ToolSearch
  `select:mcp__vidIQ__vidiq_balance,mcp__vidIQ__vidiq_keyword_research,mcp__vidIQ__vidiq_outliers`. Mira el saldo (`vidiq_balance`, gratis);
  con `vidiq_keyword_research` compara 3–5 ideas de ranking (volumen y competencia en español) y, si alcanza, `vidiq_outliers` para ver qué
  rankings de finanzas han pegado. **Tope: 15 créditos por ranking.** vidIQ solo ayuda a decidir QUÉ ranking hacer y cómo titularlo; el
  ranking en sí sale de datos financieros verificados. Si no hay saldo o la herramienta falla, sigue sin ella. Di en el mensaje final
  cuántos créditos usaste y cuántos quedan. No uses vidIQ para nada más (ni voz, ni guion, ni miniaturas).
- **Cuándo: se publica el DOMINGO 19:00 y se produce el SÁBADO en la mañana** (para que JP tenga un día para grabar). La carpeta lleva la
  fecha del domingo. El short del domingo es un ranking (en lugar del Análisis + Potencial de ese día) y va
  acompañado de su publicación de 4 imágenes: portada + puestos 5–4 + puestos 3–2 + el #1 con la pregunta (`/publicacion`). Alterna cada
  semana entre un ranking por dato ("las 5 que más…") y "5 empresas que Costa Studio Finance está vigilando". No repitas en la lista
  más de 2 empresas del ranking anterior. Carpeta: `videos/<domingo>-TOP5-<tema>/`.

## 1b. Modo empresa (viernes)
**Cómo elegir la empresa** (tómala tú, sin preguntar; revisa `plan/banco-empresas.md` y `videos/` para no repetir):
1. **Está en las noticias de la semana**: resultados que sorprendieron, adquisición, IPO, expansión, lanzamiento, polémica,
   cambio de CEO, récord, o es tendencia en redes. **Solo empresas que ya coticen en bolsa o que estén cerca de su IPO**
   (fecha anunciada o S-1/F-1/prospecto presentado). Nunca privadas sin IPO en puerta, startups ni cripto. Si es pre-IPO: sin
   `fetch_data.py`; cifras del prospecto, valor/ventas con el rango de precio en lugar de P/E, y di claro que aún no cotiza. EE.UU., México
   (BMV: tickers de Yahoo con `.MX`, p. ej. `WALMEX.MX`, `FEMSAUBD.MX`, `GSANBORB-1.MX`) o del mundo (ADR o bolsa local).
2. **Marca cotidiana** que tu audiencia conoce o usa (tiendas, apps, comida, autos, viajes, ropa, tecnología, bancos).
3. **La gente la busca**: autocompletado gratuito de YouTube
   `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=es&gl=MX&q=<empresa>`.
4. Variedad: al menos 1 de cada 3 shorts de empresa es mexicana; no repetir una empresa de los últimos 30 días ni una de los
   shorts reactivos de esa semana; nunca una de `plan/clientes-agencia.md` sin declararlo.
Anota la empresa elegida en la tabla "Ya publicadas" de `plan/banco-empresas.md`.

**Formato "Análisis + Potencial" (desde el 8 nov 2026, pedido por JP): mitad análisis de la empresa, mitad su potencial de
inversión a largo plazo.** Las dos mitades se complementan: la primera explica qué es, por qué está en boca de todos y cómo van sus
números; la segunda, por qué podría (o no) valer más en 5 años. 12 escenas, ~145–155 palabras ≈ 75–85 s. Ejemplo: `videos/2026-11-08-CUERVO/`.

| # | type | Mitad | Qué cuenta |
|---|------|-------|-----------|
| 1 | `hook` + `bg_image` | Análisis | El dato que detiene el scroll + pregunta ("¿Tiene futuro?", "¿Por qué?") |
| 2 | `company` + `logo` | Análisis | Qué hace en 1 línea, valor de mercado y un dato de escala |
| 3 | `photo` | Análisis | El modelo de negocio: cómo gana dinero |
| 4 | `news` + `image` | Análisis | Por qué está en boca de todos ahora (fecha y fuente) |
| 5 | `bars` | Análisis | Ingresos y utilidad neta por trimestre (con el trimestre nuevo) |
| 6 | `metric` | Análisis | ¿Está cara? P/E (o valor/ventas si pierde dinero o es pre-IPO) |
| 7 | `statement` | Potencial | Puente + el motor de crecimiento en una frase (kicker "El potencial · a 5 años") |
| 8 | `photo` o `metric` | Potencial | El dato del motor: mercado por conquistar, crecimiento, expansión (verificado) |
| 9 | `news` (kicker "Su ventaja") | Potencial | 2 razones por las que es difícil de copiar (marca, red, escala, licencias, costos) |
| 10 | `news` (kicker "Lo que podría salir mal") | Potencial | 2 riesgos reales, con el MISMO peso que lo bueno (tono `down`) |
| 11 | `catalyst` | Potencial | Qué vigilar: el próximo dato que confirma o rompe la tesis |
| 12 | `outro` + `disclosure` | — | Pregunta en dos partes ("¿Motor para 5 años… o ya está en el precio?") |

**La parte de potencial NO es recomendación:** se presenta como "la tesis optimista y lo que podría salir mal", nunca "cómprala",
"va a subir" ni precios objetivo propios. Si JP tiene acciones de la empresa (`plan/posiciones-jp.md`), el outro lleva
`"disclosure": "JP tiene acciones de <empresa>"` y la descripción lo dice; si la tabla está vacía, no se afirma nada.
**Sábado = "Tesis a 5 años":** la empresa sale de `plan/banco-tesis.md` (empresas con potencial de largo plazo, como Grab o ASUR),
aunque no esté en las noticias; el "por qué ahora" es su dato más reciente (resultados, máximo, expansión). Viernes y domingo:
la empresa caliente de la semana, de preferencia una con una historia de largo plazo creíble.

**Colores de la empresa (reglas de JP, 8 nov 2026).** Pon en el storyboard `"brand_colors": {"primary": "#XXXXXX", "name": "Rojo
Cuervo"}` (el color principal de la marca, verificado en su logo, etiqueta o sitio oficial) y el motor lo aplica solo:
- **Gancho (`hook`), catalizador (`catalyst`) y cierre (`outro`): fondo del color de la empresa**, con el mismo formato del gancho.
- **El resto del video usa UN fondo institucional, el que combine con la marca** (el motor lo elige solo):
  - Marca de color **FUERTE** (rojo, verde, naranja, amarillo intenso, azul marino… — casi todas) → fondo **ARENA**.
  - Marca **TENUE / PASTEL** (amarillo pastel, verde menta, rosa palo: muy clara o poco saturada) → fondo **AZUL**. Solo estas:
    un color fuerte sobre el azul se ve demasiado colorido (lo rechazó JP con un amarillo intenso).
  - En el gancho/catalizador/cierre: color brillante o pastel → exacto con texto negro; color oscuro → oscurecido lo justo con
    texto arena.
  - Para forzarlo: `"base": "arena"` o `"base": "azul"` dentro de `brand_colors` (solo si en `qa.jpg` no combina).
- Viñetas de `news`: con `brand_colors` TODAS van en el color de la empresa (el `tone` ya no las pinta de verde/rojo).
- En esas escenas, **los DATOS de la empresa** (nombre, cifras, barras de ingresos, valor de cada métrica, gráfica del precio, ficha
  principal, viñetas sin tono) van en el color de la empresa; sube/baja siguen en musgo/terracota; frases y subtítulos en paleta Costa.
- Las fotos a pantalla completa (`photo`, por defecto) van sobre negro, con el texto en el color base del video (arena o azul).
- ❌ **Nunca** pongas el color de la empresa como bloque, ficha o recuadro relleno sobre el azul Costa (se ve pesado: lo rechazó JP).
`"brand": false` apaga la marca en una escena; `"brand_bg": true/false` pone o quita el fondo de marca en una escena.
Si la marca es negra, blanca o gris (sin un color distintivo), no uses `brand_colors`. Revisa en `qa.jpg` que todo se lea.

## 2b. Imágenes reales (obligatorio en TODOS los shorts: 3–5 por video)
Que hagan sentido con la historia: logo de la marca, sucursales/tiendas, productos, sede, la app, el CEO, la fábrica…
Solo fotos REALES con licencia libre o de la sala de prensa oficial. **Nunca imágenes generadas con IA de una marca o persona real.**
```bash
python3 scripts/fetch_images.py icon videos/$ID logo airbnb             # logo (simple-icons, rápido); si no existe el slug:
python3 scripts/fetch_images.py logo videos/$ID logo "Archivo_logo.svg"  # logo desde Wikimedia Commons
python3 scripts/fetch_images.py search videos/$ID "costco warehouse"     # Openverse (si responde): mira images/_cand/sheet.jpg y…
python3 scripts/fetch_images.py pick videos/$ID 3 tienda                 # …elige la #3
python3 scripts/fetch_images.py commons videos/$ID sede "Nombre del archivo.jpg" --credit "Foto: Autor · CC BY-SA 4.0 · Wikimedia Commons"
python3 scripts/fetch_images.py add videos/$ID fachada "https://…" --credit "Foto: Empresa (sala de prensa)"
```
- Para `commons`: busca nombres con WebFetch en `https://commons.wikimedia.org/wiki/Category:<Empresa>` (y subcategorías: CEO,
  tiendas, productos) y lee autor y licencia en la página `File:…` del archivo. Solo CC0, dominio público, CC BY o CC BY-SA.
- Wikimedia limita las descargas desde la nube (429): el script reintenta solo, con paciencia (hasta ~3 min por foto).
  **Si Wikimedia sigue en 429, busca en Flickr** (`search … --source flickr`): baja al instante y también tiene licencias libres
  (CC BY / BY-SA / CC0). En el pie de foto y en youtube.md escribe una descripción limpia, no el título original de Flickr.
  Lanza las descargas en segundo plano y sigue con el guion. Si una no baja, usa otra fuente o quita esa imagen.
- **Mira cada imagen antes de usarla** (Read): que de verdad sea esa marca/lugar/persona, sin texto que confunda, nítida.
- Las fotos horizontales se ven completas (con fondo desenfocado); las verticales llenan la pantalla. `focus` [x, y] (0–1)
  elige qué parte se ve al recortar (p. ej. la cara: `[0.5, 0.25]`).

**Campos de imagen** (las rutas son relativas a la carpeta del video):
- `bg_image` (cualquier escena): foto de fondo en duotono con el color del tema; el texto sigue legible. Ideal en `hook`.
- `photo`: `image`, `layout` (**"full" por defecto**: pantalla completa sobre fondo negro, con el texto en el color base del
  video — arena, o azul si la marca es pastel; así lo quiere JP · "framed" foto en tarjeta sobre el fondo del video ·
  "card" título arriba y foto grande · "logo" logo grande en ficha blanca),
  `kicker`, `title`, `caption`, `focus`, `fit: "cover"` (forzar pantalla completa), `cue_title`, `cue_caption`.
- `company.logo` (obligatorio en videos de empresa): logo PNG transparente a la derecha del nombre, directo sobre el fondo del
  video (sin ficha). `"logo_card": true` fuerza la ficha blanca si hiciera falta.
- `news.image` (+ `focus`): foto en tarjeta arriba del titular (con imagen: máx. 2 bullets).
El pie de foto (autor · licencia) sale solo en pantalla. En `youtube.md` pega la lista de `python3 scripts/fetch_images.py credits videos/$ID`.

### Calidad de las imágenes (regla de JP, 11 nov 2026 — aplica a shorts, largos, publicaciones y cualquier video)
Cada foto debe verse **nítida y limpia, con el sujeto solo y sin ruido alrededor**. Antes de usar una imagen, ábrela y descártala si:
- mide menos de **1600 px** por su lado largo (logos en PNG transparente o SVG: sin mínimo), o se ve borrosa, pixelada o con marca de agua;
- es una foto "de calle" donde el tema ocupa poco y hay de todo alrededor (rejas, coches, gente, letreros ajenos, franjas blancas o grises);
- tiene texto ajeno grande que compite con el título, o bordes y marcos de otra publicación.
Prefiere, en este orden: material oficial de prensa de la empresa (producto, tienda, sede), fotos de producto sobre fondo limpio, retratos
de estudio o de evento con fondo desenfocado, y fotos de sedes o tiendas tomadas de frente. Si la mejor candidata no cumple, busca más
(`fetch_images.py search` con otras palabras y `--n 24`, o `--source flickr`) antes de conformarte; es mejor 3 fotos excelentes que 5 regulares.
Para fondos a pantalla completa (`bg_full`) y portadas, la foto debe aguantar el recorte vertical: sujeto al centro y sin zonas claras abajo.

## 2c. JP en 3D: el anfitrión del canal, como recorte sobre el tema
> **ESTADO: aprobado por JP el 11 nov 2026. Obligatorio en TODOS los shorts, también en las tareas automáticas.**

**Regla de JP: el protagonista es el TEMA del video, no él.** Su personaje 3D (plastilina, sin párpados) sale como un **recorte con fondo
transparente**: solo él y los objetos con los que interactúa (escritorio, laptop con el logo de la empresa, ficha del logo, flecha, taza…).
Va **chico (≈1/8 de la pantalla), en una esquina, encima de la escena**, y reacciona a lo que hay en ella: mira el dato, lo señala, se
apoya en el logo, piensa frente a la gráfica. Nunca media pantalla, nunca con un fondo propio.

- **En los shorts JP sale SOLO en dos escenas: el gancho (la primera) y el cierre (la última).** En medio no va ningún personaje ni figura
  3D (JP, 11 nov 2026): ahí mandan las fotos, los datos y las gráficas.
- **En `hook`, `statement`, `catalyst` y `outro` la foto del tema va a TODA la pantalla:** `"bg_image": "images/....jpg", "bg_full": true`
  (+ `"focus": [x, y]`). Es una de las fotos reales del video (§2b), a color, con un velo oscuro para leer el texto. Sin ella la escena no
  dice de qué trata el video.
```json
{"type": "hook", "bg_image": "images/producto.jpg", "bg_full": true, "host": {"act": "escritorio", "mood": "up"}, ...}
{"type": "outro", "bg_image": "images/tienda.jpg", "bg_full": true, "host": {"act": "cierre"}, ...}
```
- `act`: `escritorio` (teclea, levanta la vista al dato y reacciona; el logo va en su laptop) · `cafe` (igual, con sorbo) · `logo` (presenta
  una ficha grande con el logo de la empresa y se apoya en ella) · `senala` (señala el dato; a su lado sube o baja una flecha) · `piensa`
  (mano en la barbilla, moneda girando: bueno frente a gráficas) · `telefono` · `camina` (entra y saluda) · `cierre` (junto al logo, se
  encoge de hombros con la pregunta y señala a cámara).
- `mood`: `up` (festeja) · `down` (se agarra la cabeza) · `neutral`. Debe coincidir con el dato de la escena.
- `pos`: `br` (abajo a la derecha, por defecto) · `bl` · `bc`; `size` en px (por defecto 500; 420 en el cierre; máx. 560). Colócalo donde
  NO tape el dato principal; JP mira solo hacia el centro. El logo sale del `logo` de la escena `company`.
- **Variar en cada video:** no repitas la combinación de actos del short anterior. El vestuario sale de la fecha de la carpeta; para fijarlo:
  `"host": {"outfit": "negra|blanca|hoodie|blazer|polo|sueter", "accessory": "ninguno|lentes|gorra|audifonos|reloj", "prop": "ninguno|cafe|telefono"}` a nivel del storyboard.
- **Personas famosas:** si la escena habla de alguien conocido (un CEO, un fundador), el muñeco de esa escena debe ser ESA persona
  (caricatura de plastilina con sus rasgos públicos), no JP. En el `host` de esa escena pon `"who"` con opciones de `L.actor` sacadas de
  fotos reales de la persona: `{"who": {"skin": "#F0D2B8", "hair": "#8A8A8A", "hairStyle": "short|side|mop|quiff|bald", "glasses": true,
  "beard": "#555", "shirt": "#111111", "collar": "turtle|suit|crew|polo|hoodie", "tie": "#hex", "pants": "#3F5E8C"}}`. Solo rasgos públicos y
  neutrales (peinado, lentes, barba, ropa típica); nada burlón. En un short esto solo aplica si el gancho o el cierre son sobre esa persona.
- Flujo: `build_timeline.py` → **`node engine3d/render_host.js videos/$ID`** (≈1 min; solo re-renderiza lo que cambió) → `render.js --qa`.
- **No repitas la misma foto en escenas seguidas** (corrección de JP): si una escena usa `bg_image` + `bg_full` con una foto, la escena
  siguiente o anterior NO puede ser una `photo` con esa misma foto (se ve como si la escena se repitiera). Usa otra foto u otro tipo de escena.
- **Fotos con franjas claras:** si la foto tiene una zona blanca o gris justo donde va JP (parece un piso raro bajo su escritorio), cambia el
  `focus`, mueve a JP (`pos`) o elige otra foto.
- En `qa.jpg`: que JP no tape cifras ni el título, que el tema se reconozca de un vistazo y que JP se vea chico.
  Hoja de pruebas del personaje: `node engine3d/render_host.js --sheet /ruta/hoja.jpg images/logo.png`. Personaje: `engine3d/host.js`.

## 2. Guion + storyboard → MOSTRAR AL USUARIO ANTES DE GASTAR CRÉDITOS
Escribe `videos/$ID/storyboard.json` (esquema abajo). Luego:
```bash
python3 scripts/script_check.py videos/$ID
```
Debe salir ✅: **650–950 caracteres** (≈45–60 s y 14 créditos). Si sale ❌, ajusta y repite.

Muéstrale al usuario el guion (la narración por escena) y un resumen de las escenas, y **pide su OK**. No generes la voz
sin su aprobación (cuesta créditos de vidIQ). Si pide cambios, edita y vuelve a correr `script_check.py`.

### Estructura recomendada (8–10 escenas, una idea por pantalla)
| # | type | Qué cuenta | ~seg |
|---|------|-----------|------|
| 1 | `hook` | El dato que detiene el scroll (el % de la caída/subida) + pregunta | 4–6 |
| 2 | `company` | Qué hace la empresa en 1 línea + valor de mercado | 4–5 |
| 3 | `price` | Cómo le fue en 12 meses (2–3 anotaciones) | 6–8 |
| 4 | `zoom` y/o `news` | El movimiento reciente y su porqué | 6–10 |
| 5 | `bars` | Ingresos y utilidad neta por trimestre | 5–7 |
| 6–8 | `metric` ×3 | P/E, PEG, ROE (uno por pantalla, con su regla) | 4–5 c/u |
| 9 | `catalyst` | Próximos resultados (fecha) | 3–4 |
| 10 | `outro` | Pregunta final en dos partes | 3–4 |
Si no hubo un movimiento fuerte reciente, omite `zoom` y usa `news` con el tema más relevante. Usa `statement` para
frases-puente cortas ("Pero en octubre, todo cambió.").

### Reglas de escritura (voz Daniel)
- Español de México, frases cortas, tono claro y sereno (no sensacionalista). Tutea.
- **Números con dígitos**: "25%", "156 dólares", "9%". Evita decimales al hablar ("casi 30 veces", no "29.64").
  En pantalla sí usa el dato exacto.
- Cada `say` es lo que se narra durante esa escena. Todo el guion = los `say` en orden.
- Los `cue` son **una palabra (o dos) que aparece en el `say` de esa misma escena**: el elemento aparece justo cuando se dice.
  Elige palabras distintivas (no "de", "la"). Evita usar números como cue (whisper los escribe distinto).
- Explica cada métrica en palabras simples:
  - **P/E**: "pagas X dólares por cada dólar que gana la empresa". Regla: `[[0,15,"Barata"],[15,30,"Justa"],[30,60,"Cara"]]`,
    `ref` S&P 500 (verifica el P/E actual del S&P 500; ~22–25x).
  - **PEG** = P/E ÷ crecimiento: "menos de 1 suele verse barato". Regla `[[0,1,"Barata"],[1,2,"Justa"],[2,4,"Cara"]]`.
  - **ROE**: "por cada 100 dólares del accionista, genera X de utilidad". Regla con tonos invertidos:
    `[[0,10,"Bajo","down"],[10,20,"Bueno","accent"],[20,60,"Excelente","up"]]`. Si el ROE es >100% (p. ej. Apple), explica
    que es por recompras que reducen el capital contable.
- Marca: el cierre usa automáticamente el tagline "Desde la costa, todo se ve con claridad." y el CTA.
- Nunca des recomendación de compra/venta. Cierra con pregunta abierta.

### Esquema de `storyboard.json`
```json
{ "ticker": "AAPL", "title": "tema del video", "scenes": [ {"type": "...", "say": "...", ...} ] }
```
Campos por tipo (todos opcionales salvo `type` y `say`; `theme` puede forzar `"blue"`, `"sand"` o `"white"`):
- Nivel raíz: `brand_colors` {"primary": "#hex", "name"} (colores de la empresa, §1b; se aplica solo). En una escena: `"brand": false` lo apaga.
- `outro`: `disclosure` (opcional, "JP tiene acciones de X").
- `hook` (azul): `kicker` ("NASDAQ · AAPL"), `title`, `value` (número, ej. -24.1), `decimals`, `unit` ("%"), `prefix`,
  `signed` (true = "+"), `tone` ("down"|"up"), `caption`, `question`, `cue_value`, `cue_question`.
- `statement` (azul): `text`, `emphasis` (palabra en serif mostaza), `kicker`, `sub`, `size`.
- `company`: `name`, `line`, `chips` (["iPhone", ...] o [{"label","cue"}]), `stats` ([{"label","value","tone","cue"}], máx 3).
- `price` (usa la serie de 12 meses): `kicker`, `title` (def. "De $X a $Y"), `subtitle`,
  `annotations` [{"date":"YYYY-MM-DD","label","sub","tone","cue","dir":-1|1}] (máx 3), `chips` [{"label","value","tone","cue"}] (máx 3).
- `zoom` (últimas N sesiones con volumen): `sessions` (15), `title`, `events` [{"date","label","sub","tone","cue"}] (máx 2).
- `news`: `kicker` ("20 OCT · EL DETONANTE"), `headline`, `bullets` [{"text","sub","cue","tone"}] (máx 3), `source`.
- `bars`: `count` (6), `quarters` (opcional, sobreescribe los de Yahoo: [{"period":"2026-09-30","revenue":..., "net_income":...}]),
  `cue_revenue`, `cue_net`, `note` (ej. "+16% ingresos a/a"), `note_sub`, `note_tone`, `cue_note`.
- `metric`: `kicker` ("Valuación · 1/3"), `label` ("P/E"), `fullname`, `value`, `decimals`, `prefix`, `suffix` ("x", "%"),
  `explain`, `scale` {"min","max","bands":[[a,b,"texto","tono?"]],"ref":{"value","label"}}, `verdict`, `verdict_tone`,
  `cue_value`, `cue_explain`, `cue_gauge`.
- `waterfall` (cascada del estado de resultados): `kicker`, `title`, `subtitle`, `steps` [{"label" (corta, 2–3 palabras), "value", "kind":
  "total" | "minus" | "result", "text" (lo que se lee arriba de la barra, ej. "−$51"), "cue"}], `note`, `cue_note`. La primera es `total`
  (ingresos), las de en medio `minus` (lo que se va) y la última `result` (lo que queda). 4 a 6 barras; cada `cue` es una palabra DISTINTA
  del `say` (ojo: "5" también calza dentro de "51"; usa otra palabra).
- `catalyst` (azul): `kicker`, `date` ("28 ENE"), `label`, `sub`, `cue_date`.
- `outro` (azul): `question_a`, `question_b`, `cue_a`, `cue_b`, `cta` (opcional), `sources` ("Yahoo Finance · Reuters").
- `photo`, `bg_image`, `company.logo`, `news.image`: ver sección 2b.
Ejemplos completos: `finance-videos/videos/ejemplo-SE/storyboard.json` (reactivo) y `finance-videos/videos/2026-11-06-ABNB/storyboard.json` (empresa, con imágenes).

## 3. Voz (después del OK)
**Modo predeterminado desde nov 2026: SIN VOZ.** Juan Pablo graba su propia voz en la app de YouTube Shorts leyendo los
subtítulos (funcionan como teleprompter). En ese caso NO uses vidIQ; en lugar de los pasos 1–5 y de `process_voice.py`:
```bash
python3 scripts/no_voice.py videos/$ID        # ritmo de lectura de JP (~120 palabras/min, cuenta sílabas reales)
```
y sigue en la sección 4 desde `build_timeline.py` (sin voz apunta a 100–125 palabras ≈ 55–70 s; máximo 90 s).
`make_audio.py` detecta `audio/NO_VOICE` y deja solo música baja + efectos. Usa voz de IA solo si él lo pide.

Con voz de IA (solo si la pide):
1. Carga las herramientas: `ToolSearch` con `select:mcp__vidIQ__vidiq_balance,mcp__vidIQ__vidiq_voiceover_generate,mcp__vidIQ__vidiq_job_poll`.
2. `vidiq_balance` → dile al usuario cuántos créditos tiene y que este video usará 14.
3. `vidiq_voiceover_generate` con `script` = contenido exacto de `videos/$ID/narration.txt` y
   `voiceId` = `onwK4e9ZLuTAKqWW03F9` (Daniel – Steady Broadcaster; está en `assets/brand/brand.json`).
4. `vidiq_job_poll` hasta `completed` (tarda ~1–2 min; entre sondeos haz otra cosa o usa Monitor, no `sleep`).
5. Descarga: `curl -sS -o videos/$ID/audio/voice_raw.mp3 "<audioUrl>"` (crea la carpeta `audio`).
Si vidIQ no está conectado o no hay créditos, avísale al usuario y detente (no inventes otra voz sin preguntar).


**Regla de los números:** los tiempos se calculan por sílabas habladas (los números se convierten a palabras: "45" =
"cuarenta y cinco"). Lo hace `no_voice.py`; para voz de IA usa `python3 scripts/tts_prep.py videos/$ID <créditos>` y envía
el texto de `tts_chunks.json` (números ya en palabras), no `narration.txt`. Ver "Regla de los números" en `finance-videos/CLAUDE.md`.

## 4. Sincronizar, revisar y renderizar
```bash
.venv/bin/python scripts/process_voice.py videos/$ID     # recorta pausas, tempo, normaliza, tiempos por palabra
python3 scripts/build_timeline.py videos/$ID             # escenas y cues en segundos, subtítulos
node engine3d/render_host.js videos/$ID                  # JP en 3D (escenas con "host"; ver §2c) — siempre antes de render.js
node scripts/render.js videos/$ID --qa                   # hoja de revisión → videos/$ID/build/qa.jpg
```
- `build_timeline.py` debe reportar alineación ≥ 60% y sin cues "no encontrados" (si hay, cambia el cue y repite).
- **Mira `build/qa.jpg`** (Read). Revisa: textos que se salen o se enciman, etiquetas que chocan, escenas vacías,
  datos correctos. Corrige el storyboard (no hace falta regenerar la voz si no cambias el `say`) y repite.
- Duración final entre 45 y 60 s.
```bash
.venv/bin/python scripts/make_audio.py videos/$ID        # voz + música + efectos → audio/mix.wav
node scripts/render.js videos/$ID                        # → videos/$ID/TICKER_short.mp4 (~2 min, en segundo plano)
```
Verifica con `ffprobe` (1080x1920, h264 + aac, duración) y revisa 2–3 cuadros del MP4 final.

## 5. Entregar
1. Escribe `videos/$ID/youtube.md` empezando con la sección **`## ✅ Para copiar y pegar`** (modelo: `videos/2026-11-07-ABNB/youtube.md`):
   - **Título** listo, en un bloque de código: ≤ 100 caracteres (ideal 60–80), la empresa o el tema y el gancho en los primeros
     ~40, **2 hashtags al final** (la empresa + `#acciones`/`#inversiones`/`#bolsa`). Indica cuántos caracteres lleva.
   - **Descripción** lista, en otro bloque de código, corta para el celular: 1.ª línea con la noticia y las palabras clave
     (es lo que se ve sin abrir), "📌 Datos clave" en 4–6 viñetas, la pregunta del outro, fuentes en una línea, **créditos de las
     imágenes** en una línea (autor + licencia), "Contenido educativo. No es asesoría financiera.", "Costa Studio Finance, by JP
     Armendáriz." y al final **3–5 hashtags** (los 3 primeros salen arriba del título; nunca más de 15 porque YouTube los ignora
     todos): empresa, ticker, tema y `#Shorts`. Si la empresa es cliente de la agencia, decláralo (ver `plan/PLAN.md` §0).
   - Debajo: 2 títulos alternativos, "Fuentes completas (enlaces)" y "Al subir" (no es para niños; contenido alterado/sintético
     = No si la voz es de JP, Sí si es voz de IA; video relacionado; comentario fijado).
2. Envía el MP4 con SendUserFile (display render). En el mensaje a JP **SIEMPRE** pega, listos para copiar: **el título, la
   descripción completa** (los dos bloques de "Para copiar y pegar") y **el guion para leer** (el contenido de `narration.txt`, una
   escena por párrafo), porque él graba su voz leyéndolo y sube el video desde el celular.
3. Commit y push de `finance-videos/videos/$ID/` (storyboard, data, narration, images/ sin `_cand/`, voice_raw.mp3, mp4, youtube.md)
   a la rama actual. **Si el push falla** (p. ej. 403 porque la sesión no tiene el repo), no te detengas: el MP4 ya se envió por el
   chat; pega también el contenido completo de `youtube.md` en el mensaje final para que JP pueda publicar igual.

## Estilo (no cambiar sin que el usuario lo pida)
Marca: **Costa Studio Finance** (división de finanzas de la agencia Costa Studio). `brand.json` → `division: "FINANCE"` dibuja
la firma logo + FINANCE + "by JP Armendáriz · @jparmendariz" en cada pantalla y "COSTA STUDIO FINANCE · BY JP ARMENDÁRIZ" en el
cierre. Todo esto es automático (sale de `brand.json`); no hay que pedirlo. Al entregar, pega siempre el guion para leer en el chat.
Definido en `finance-videos/assets/brand/brand.json` y `engine/engine.js`: paleta Costa (arena #EBE6BA, azul costa #4173D1,
terracota #BB6F58 = baja, musgo #7E8C54 = sube, mostaza #C7A317 = acento, negro #0A0A0A); tipografías libres
Unbounded (títulos y números), Space Grotesk (texto), Instrument Serif itálica (acentos); transiciones de "marea",
grano de película, una idea por pantalla. Contenido fuera de la columna derecha (x > 930) donde están los botones de Shorts,
y subtítulos en y≈1650.
