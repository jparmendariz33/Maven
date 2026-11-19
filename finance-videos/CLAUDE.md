# finance-videos — Costa Studio Finance (división de finanzas de Costa Studio)

Costa Studio es una agencia de influencer marketing; **Costa Studio Finance** es su canal de finanzas, aparte pero con la misma
marca. Firma en pantalla: logo + "FINANCE". Reglas de separación y sinergias: `plan/PLAN.md` §0. Nunca analizar una empresa que
sea cliente de la agencia sin declararlo.

**Videos largos (16:9, 6–7 min):** skill **`/largo`** (`../.claude/skills/largo/SKILL.md`), motor `engine/long.js`, carpetas
`largos/<domingo AAAA-MM-DD>/`. Plan, calendario y metas en `plan/`. Costo cero: sin vidIQ; JP pone su voz (modo sin voz por defecto).

**Historias 3D (verticales, 75–90 s, miércoles y sábados 12:00):** skill **`/historia`** (`../.claude/skills/historia/SKILL.md`), motor `engine3d/`
(Three.js: `lib.js` + `cine.js` con luz de cine y actores articulados), carpetas `videos/<sábado>-<SLUG>-historia/` con `story.js`.
Flujo CON voz de IA (el de ahora): `story.js` → `render3d.js --qa` + cuadros `--at` → **capturas a JP y su OK** → voz en UNA toma →
`process_voice.py` → `scripts/voz3d.py --aire 0.7` → `make_audio.py` (partitura al 60% de la voz) → `render3d.js`.
Sin voz de IA (JP graba encima): igual pero con `scripts/pace3d.py` en lugar de la voz y `voz3d.py`.
Ideas en `plan/banco-historias.md`. Aquí NO van fotos: todo es maqueta 3D propia, sin logotipos reales.

**JP en 3D (anfitrión del canal; aprobado el 11 nov 2026, obligatorio):** el personaje 3D de JP sale como recorte con fondo transparente,
chico (≈1/8 de la pantalla), encima de la escena y reaccionando a ella; el protagonista es el tema (foto a toda la pantalla con
`"bg_full": true`), no JP. Shorts: SOLO en el gancho y el cierre. Largos: inicio, 3–5 puntos intermedios y cierre. Publicaciones: primera y
última imagen. Personas famosas: su propio muñeco (`"who"`). Sin párpados en ningún personaje. `"host": {"act", "mood", "pos"}` en la escena;
`node engine3d/render_host.js <carpeta>` después de `build_timeline.py`. Detalle: `/short` §2c.

**Qué hace cada formato (plan del 11 nov 2026, `plan/PLAN.md` §2b):** publicaciones = lo de hoy (skill `/publicacion`, lun/mié/vie);
shorts = contexto que dura meses (sin "hoy"; `/short` §1c); historia 3D = alcance y marca; largos = horas de reproducción y búsqueda.

**Imágenes reales en TODOS los videos** (shorts y largos): logos, sucursales, productos, sedes, personas. `scripts/fetch_images.py`
(Openverse / Wikimedia Commons / simple-icons / salas de prensa; solo licencias libres; nunca IA de marcas o personas reales) →
`videos|largos/<id>/images/` + `images/credits.json`. En el storyboard: escena `photo`, `bg_image`, `company.logo`, `news.image`.
`build_timeline.py` las incrusta; el motor pone el pie de foto. Detalle en `/short` §2b. **Calidad (JP, 11 nov 2026):** solo fotos nítidas (≥ 1600 px), limpias, con el sujeto solo y sin ruido de fondo; nada de fotos de calle cargadas.

**Ritmo (desde el 13 nov 2026, con los primeros datos reales del canal — `plan/PLAN.md` §2 y §2c):** **2 Historias 3D por semana**
(miércoles y sábado 12:00; es el formato con más alcance y el puente a los largos) + shorts de contexto martes y jueves + Análisis +
Potencial el viernes + **ranking el domingo** + **largo de 6–7 minutos** el domingo 10:00 + publicaciones lunes, miércoles y domingo.
Los videos con datos del día se hacen DESPUÉS del cierre de la bolsa (ver "Regla del cierre"). Música: partitura de órgano y piano en las
historias; cama cálida en shorts y largos.

Para crear un short, sigue la skill **`/short`** (`../.claude/skills/short/SKILL.md`). Resumen del flujo:
`setup.sh` → `market_close.py` (¿ya cerró?) → `fetch_data.py` → storyboard.json → `script_check.py` → **OK del usuario** → voz (vidIQ) →
`process_voice.py` → `build_timeline.py` → `engine3d/render_host.js` (JP en 3D) → `render.js --qa` (revisar) → `make_audio.py` → `render.js` → youtube.md → commit.

**Rama y tareas:** todo el proyecto vive en la rama `costa-studio-finance` de `jparmendariz33/Maven` (Costa Studio, la agencia, es otra
empresa: no mezclar nombres). Las instrucciones de las tareas programadas están en `plan/tareas.md`. Un solo MP4 por pieza en GitHub
(sin renders de prueba ni versiones alternas: el repo crece con cada video).

## Regla del cierre (pedida por JP, 9 nov 2026 — aplica a TODO video que lleve datos de mercado)
**Ningún video con precios, porcentajes del día o valor de mercado se termina ni se entrega antes del cierre de la sesión ordinaria
de Wall Street** (16:00 de Nueva York = 15:00 CDMX en invierno y 14:00 CDMX durante el horario de verano de EE.UU.; la BMV cierra a
la misma hora). Los datos son SIEMPRE los de cierre, lo más actualizados posible. JP publica a las 19:00, así que hay margen.
- Antes de escribir una cifra: `python3 scripts/market_close.py` (CERRADO = usa los datos; ABIERTO = todavía no; SIN SESIÓN = fin de
  semana o festivo: usa el último cierre y nombra ese día). `--wait` espera solo hasta 12 min después del cierre.
- **Si JP da una idea durante el día** ("hoy haz el de Nvidia"): se adelanta todo lo que no depende del cierre (investigación,
  fuentes, imágenes, guion con las cifras pendientes) y, al cerrar la bolsa, se bajan los datos finales, se ajusta el guion si el
  movimiento cambió (si ya no es cierto, se reescribe), se renderiza y **se entrega UNA sola vez, ya final**. Nada de versiones
  preliminares con datos intradía, salvo que JP las pida. En una sesión de chat: avísale que llega después del cierre y prográmalo
  (`send_later` a las 16:20 de Nueva York, o `market_close.py --wait` en segundo plano).
- Las tareas automáticas con datos del día corren a las **16:25 de Nueva York** (15:25 o 14:25 CDMX) y el video llega ~30 min después.
- No dependen del cierre: el largo (atemporal), su short derivado del miércoles y los shorts de sábado y domingo (no hay mercado: usan
  el cierre del viernes).

## El ranking del domingo es un TORNEO (JP, 14 nov 2026, estrena el 22 nov)
Las empresas compiten en 5 rondas (ventas, utilidad de operación, margen, ROE y PEG), con puntos 5-4-3-2-1, minigráfica
de evolución en las dos primeras y tabla final con una ganadora. El título promete un resultado; "5 empresas que estamos
vigilando" no dice nada. Plan de acción completo en `plan/torneo.md`; reglas en `/short` §1d.

## Regla de los logos (JP, 15 nov 2026)
- **Siempre el logo oficial de la empresa**, bajado de su propia sala de prensa o sitio (gstatic para Google, newsroom de
  Spotify, el sitio de cada mexicana). El catálogo de iconos monocromo solo como último recurso: da la "G" en vez de la
  palabra Google y pierde el color de marca. Crédito en `images/credits.json`.
- **Nada de tarjeta blanca** salvo que el logo sea casi invisible sobre el fondo (umbral de contraste 1.22). Una tarjeta
  blanca se lee como "PNG mal recortado".
- **Varios logos juntos van en bloque 3 + 2, no en fila.** En fila de cinco quedan diminutos. En el gancho del short el
  bloque va a la altura del personaje (y≈1128), nunca pegado al subtítulo ni encima de los subtítulos de la voz.
  Lo controla `"logo_layout": "bloque" | "fila" | "esparcido"` en la escena.

## Regla del cierre de un ranking (JP, 15 nov 2026)
La última frase es **un principio general, nunca un veredicto sobre una acción**. "El crecimiento es una métrica, no una
tesis" sirve; "Mercado Libre no es buena inversión" o "no es buen momento para entrar" son recomendación y están
prohibidas. La buena señal: la frase sigue siendo cierta en el torneo del domingo siguiente, con otras empresas.
Tampoco frases tajantes de más ("crecer rápido no es ser un buen negocio" se descartó por injusta con quien lidera
en ventas y en PEG).

## El gancho identifica a la empresa (JP, 14 nov 2026)
La primera escena lleva **siempre** el logo (`"logo"` en el `hook`, arriba a la derecha, con tarjeta blanca si no
contrasta) o la foto del tema a toda pantalla, o las dos. Un gancho sin marca no dice de quién habla. Detalle en `/short` §0.

## Regla del rótulo (JP, 14 nov 2026)
**Todo lo que dice la voz se ve en pantalla, y ningún número va sin decir qué es.** "Brasil · 120 M" no significa nada: va
"Brasil · 120 M de clientes". "¿Está cara?" sin nombrar la acción es ambiguo: va "La acción se paga a 16 veces las ganancias".
Distingue siempre **utilidad de operación** de **utilidad neta**. Detalle y checklist en `/short` §0.

## Regla de la maquetación (13 nov 2026, tras el defecto que encontró JP en el short de Nubank)
El motor tiene que aguantar cualquier largo de texto: **nunca** se arregla un encimado acortando el guion.
- `fitLines(txt, f, w, size, maxW, maxLines, min)` achica hasta que quepa. `wrap(...).slice(0, n)` tira palabras en
  silencio (así se perdieron "pagan" e "impuestos" en las etiquetas de una cascada): prohibido.
- Nada se dibuja en una Y fija si arriba hay texto de largo variable: cada bloque cuelga de donde terminó el anterior.
- Antes de entregar, barrido del MP4 completo (un cuadro cada 3 s en contacto), no solo `qa.jpg`. Receta en `/short` §4.

## Regla del aire (JP, 14 nov 2026 — oyó demasiadas pausas en el short de Nubank)
El cambio de pantalla **absorbe** la pausa del punto final, no se le suma: antes se encadenaban 0.6 s + 0.6 s y quedaba 1.2 s de
silencio entre TODAS las escenas (13 s muertos en un short de 88). Ahora el hueco es el mayor de los dos (`no_voice.py`), y la cola
después de la última palabra es de 1.4 s, no 2.2 (`build_timeline.py` → `TAIL`). Si un video se pasa de formato, lo primero que se
revisa es el aire, no el guion.

## Regla de las cascadas (JP, 14 nov 2026)
**Siempre con los montos reales; nunca normalizados a $100.** Con base 100 el porcentaje y el monto dicen lo mismo y la fila de
montos sobra. La escala va en el subtítulo y en `"unit"` de la escena. Detalle en `/short` §1e.

## Regla de la voz humana con IA (JP, 17 nov 2026 — las dos correcciones del mismo día)
JP corrigió dos veces el mismo short y las dos juntas dan la regla:

1. **"Suena muy robotizado."** Cierto, pero el problema casi nunca es la voz: es que el guion esté escrito para leerse.
2. **"Demasiadas muletillas, se ve demasiado informal."** Al reescribirlo con "a ver", "o sea", "¿sabes?", "¡súper bien!"
   quedó peor: informal y falso.

**La conclusión: `plan/voz-jp.md` describe cómo habla JP cuando LÉE ÉL.** Sus muletillas suenan naturales porque son
suyas y las dice con su propio ritmo. Puestas en una voz de IA suenan actuadas. **Con narración de IA se mantiene el
registro escrito de siempre —limpio, profesional, una idea por frase— y lo humano se consigue con la PROSODIA, no con
palabras de relleno.**

Qué sí mueve la entonación de la voz, y dónde ponerlo:
- **`…` para respirar**, 2 o 3 veces en un short, justo antes del dato que importa. No en cada línea.
- **Frases de largo desigual.** Una corta de golpe, luego una larga que explica. El monótono viene de frases iguales.
- **Signos de interrogación reales** (una pregunta genuina, no retórica en cadena): suben el tono al final.
- **Alargar una vocal, una sola vez por video** y solo si la palabra lo pide (`muchíiisimo`). Dos veces ya es caricatura.
- **Comas donde de verdad se pausa al hablar**, aunque la gramática no las pida.

Qué NO se usa con voz de IA: "a ver", "o sea", "pues", "¿sabes?", "¿no?", "¡súper!", exclamaciones de entusiasmo.
Esas se quedan para cuando grabe JP.

## Regla de la toma única (JP, 17 nov 2026)
**La voz de IA se genera en UNA sola llamada, nunca por piezas.** Cada envío tiene su propia entonación y energía, así
que en los cortes se oye un cambio de voz; JP lo notó en el largo de Apple, justo donde terminaba cada pieza. El límite
de un envío son **5,000 caracteres**: si el guion no cabe, se recorta el guion, no se parte el audio. Ojo: `tts_prep.py`
parte en piezas para el flujo viejo; usa su texto concatenado con `\n\n` y mándalo completo. Y borra `voice_raw.mp3`
antes de reprocesar: `process_voice.py` lo reutiliza si existe y ignora las piezas nuevas.

## Regla del encuadre 3D (19 nov 2026 — historia de Kahneman)
La hoja de revisión (`render3d.js <carpeta> --qa`) es obligatoria y casi nunca pasa a la primera: la de Kahneman necesitó
cinco vueltas. Los cuatro defectos que salieron, con su causa real:
- **Texto cortado en una etiqueta 3D.** No es el encuadre: `label3d` dibuja sobre un canvas de `pw` píxeles (1024 por
  defecto) y el texto que no cabe se recorta. "ECONOMETRICA · 1979" a 86px con `ls: 3` mide ~1,070 px y perdía letras en
  los dos extremos. Regla: `caracteres × 0.62 × tamaño + ls × caracteres ≤ pw`. Baja la fuente, no el ancho del plano.
- **Objeto pegado al rótulo.** Para BAJAR algo en el cuadro, el `lookAt` va ARRIBA del objeto, no abajo (es al revés de lo
  que parece). La zona segura de un vertical es de ~800 a ~1650 px de 1920: apunta a `centro_del_objeto + 0.25 × media_altura`.
- **Texto acostado que no se ve.** Un `label3d` plano sobre una mesa se lee pésimo en vertical y con la cámara baja
  desaparece. Las cartas de la apuesta se volvieron **placas verticales de frente a cámara** y se leyeron a la primera.
- **Personaje fuera de cuadro.** Si la cámara panea y el personaje está quieto, se sale. Mueve el `target` lo mismo que el
  personaje, o no lo muevas.
Para calcular distancia: con el vertical, `media_altura = tan(25°) × distancia` y `media_anchura = media_altura × 0.5625`.
Mide el objeto más ancho (incluye lo que se mueve: un plato de balanza que se inclina viaja hacia afuera) y despeja.

## Regla de la aprobación visual antes de producir (JP, 19 nov 2026 — aplica a TODO formato)
**Antes de renderizar cualquier pieza —y SIEMPRE antes de generar voz— JP tiene que ver capturas de las escenas.**
No es un trámite: los créditos de voz son el recurso escaso del canal y un render son ~30 min de máquina. Una
corrección detectada en una captura cuesta cero; la misma corrección detectada en el MP4 cuesta otra voz y otro render.
- **Historias 3D:** hoja de `render3d.js <carpeta> --qa` (2 cuadros por escena, gratis y rápida) + cuadros sueltos con
  `--at <segundos>` de cada momento con acción. Mándale las dos cosas, con una leyenda que diga qué pasa en cada una.
- **Shorts, largos y publicaciones:** lo mismo con `render.js --qa` / las imágenes del post, antes de pedir la voz.
- En las capturas, **di qué está pendiente de aprobación**. Si los rótulos todavía traen el texto viejo porque la frase
  no está decidida, se avisa; si no, JP revisa creyendo que ya es definitivo.
- Hasta que JP diga que sí, no se genera voz ni se renderiza.

## Regla de la eficiencia en créditos (JP, 19 nov 2026)
vidIQ cobra **28 créditos por cada bloque de 1,000 caracteres, redondeando hacia arriba**. Un guion de 1,010 caracteres
cuesta el doble que uno de 990. Antes de mandar la voz, **mide el texto ya convertido a palabras habladas** y di en
cuántos bloques cae y cuánto margen queda; si está apenas encima de un múltiplo de 1,000, recorta ahí. La historia de
Kahneman quedó en 791 caracteres: un bloque, 28 créditos, el mínimo posible para una toma única.
Lo demás que ahorra créditos: la toma única ya es lo más barato (no partir en piezas), **`voice_raw.mp3` no se borra
nunca** (reprocesar la mezcla, el ritmo y el render sale gratis a partir de él), y todo lo que no sea el texto hablado
—nivel de música, aire entre escenas, encuadres, animación— se ajusta y se re-renderiza **sin gastar un solo crédito**.

## Regla de que se entienda sin saber nada (JP, 19 nov 2026)
"Este tipo de videos deben ser súper digeribles para cualquier público, incluso los que no sepan de finanzas, de
economía, de cualquier edad." El filtro: **si la frase le pide al espectador que deduzca algo, está mal.** Las que
cayeron en la historia de Kahneman y por qué:
- "decides con **una calculadora en la cabeza**" → metáfora que hay que descifrar. Quedó: "todos hacemos **cuentas
  mentales** y elegimos lo que más nos conviene".
- "tu peor enemigo no está en la pantalla, **está de este lado**" → "de este lado" es espacial y abstracto. Quedó:
  "**no es el mercado. Eres tú**".
- "el Nobel **no se entrega póstumo**" → palabra culta. Quedó: "**no se le da a quien ya murió**".
- "lanzar una moneda por 200" → quedó "**un volado: 200 o nada**", que además calca lo que dicen las cartas en pantalla.
Y el remate: **la imagen tiene que decir lo mismo que la frase, al mismo tiempo.** "Eres tú" no se entendía con un
espejo (el reflejo se leía como otra persona detrás); se entiende con un teléfono que muestra el portafolio y una
cámara que se mueve de la pantalla a su cara. Si hace falta explicar la escena, la escena está mal.

## Regla del dinamismo en 3D (JP, 19 nov 2026 — vio la primera historia de Kahneman)
"Los personajes no están haciendo mucho." Una escena donde solo se mueve la cámara está mal, aunque el encuadre sea
perfecto. La referencia es la historia de Steve Jobs: en cada escena **pasa algo**. La lista de lo que hay que mover:
- **El personaje actúa**: camina (`walk` + `position`), gira (`rotation.y`), voltea a ver lo que importa (`head`),
  se le caen los hombros (`lean`, `bob`), se encoge de hombros, señala. No basta con `talk`.
- **Un objeto cambia de estado por una causa**: las monedas CAEN sobre el plato y por eso la balanza se hunde; las
  cartas ENTRAN deslizándose; la que gana SE VA volando; la medalla BAJA; el reflejo IMITA al personaje.
- **Los rótulos del mundo 3D aparecen cuando se dicen**, no están puestos desde el cuadro uno.
Dos trampas que ya costaron un render: un objeto que cae sobre otro acaba DENTRO de él si no se calcula la tapa
(usa `getWorldPosition` del grupo, no las coordenadas locales), y lo que baja desde arriba del cuadro pasa por detrás
del rótulo: que llegue pronto a la zona visible (y_px 800–1650) y se quede ahí, en vez de animar el recorrido completo.

## Regla de la mezcla (JP, 19 nov 2026)
**La música va al 60% del nivel de la voz, medido, no a ojo.** Estaba en 8% y JP casi no la oía. Lo controla
`make_audio.py --musica N`, y la mezcla imprime el balance real en dB durante los tramos hablados: para las historias
3D, `--musica 2.50` da el 60%. El ducking de la historia es más suave que el de un short, para que la partitura no
desaparezca bajo la voz. Verifica siempre después de mezclar: pico por debajo de −0.5 dBFS y ninguna palabra con el
audio tapado.

## Gráficas y portafolios dentro del 3D (19 nov 2026)
`L.plaque(ancho, alto, dibuja, pw)` da un plano con una textura de canvas: con eso se dibujan **gráficas de línea de
verdad** dentro de la escena, que es lo que JP pidió para la escena de la bolsa. El helper `grafica()` de la historia
de Kahneman es reutilizable: mete el plano en un grupo anclado a la IZQUIERDA, así que **escalando el grupo en x la
línea se va trazando** de izquierda a derecha mientras habla la voz.
Un portafolio en pantalla (teléfono, monitor) va **por sectores, nunca con nombres de empresas reales**: un portafolio
con tickers reales se lee como que estamos diciendo qué comprar, y eso está prohibido.

## Regla de la voz de IA en historias 3D (19 nov 2026)
Una historia 3D con voz de IA **no usa `pace3d.py`** (que estima por sílabas para la voz de JP). Usa `scripts/voz3d.py`,
que sincroniza escenas y subtítulos con los tiempos reales de `build/whisper.json`. El flujo completo:
1. Sacar los `cap:` de story.js y convertir números a palabras **conservando la puntuación** (`¿ ? , .`): `spoken()` sola
   se come los signos y la voz pierde la entonación de pregunta. `voz3d.py` documenta el convertidor.
2. **Una sola llamada** a `vidiq_voiceover_generate` (regla de la toma única) → `audio/voice_raw.mp3`.
3. `storyboard.json` con `{"format":"long"}` en la carpeta, para que `process_voice.py` deje el ritmo natural
   (tempo 1.0, pausas amplias) en vez del recorte agresivo de short. Sin eso, la historia sale acelerada.
4. `voz3d.py <carpeta> --aire 0.7` — Francisco lee a ~162 palabras/min, demasiado rápido para una historia: `--aire`
   mete silencio **entre escenas, nunca dentro de una frase**, y deja ~145 palabras/min. Kahneman: 46.8 s → 51.7 s.
5. `make_audio.py` → `render3d.js`.
Ojo: `--aire` se aplica una sola vez sobre `voice.wav`; para repetirlo hay que volver a correr `process_voice.py`.

## Regla del reloj con voz de IA (16 nov 2026)
La voz de IA lee a ~150 palabras/min; `no_voice.py` presupuesta 120 para la voz de JP. **El mismo guion sale ~25% más
corto con IA**: el largo de Apple pasó de 6:52 (teleprompter) a 5:21 (Francisco). Si un largo tiene que durar 6–7 min
con voz de IA, el guion necesita ~25% más contenido. Y nunca escribas la duración dentro del guion ("en 10 minutos"):
cambia con cada recorte y con la voz, y hay que regenerar audio para corregirla (ya pasó dos veces).

## Regla de los números (descubierta en nov 2026 — aplica a TODO: shorts, largos, voz propia o de IA)
Un número mide pocos caracteres pero tarda mucho en decirse: "45" son 2 caracteres y se dice "cuarenta y cinco";
"1950" → "mil novecientos cincuenta" (8 sílabas); "46%" → "cuarenta y seis por ciento"; "$45,765" → 20 sílabas.
- **Tiempos (teleprompter sin voz):** `scripts/no_voice.py` convierte cada número, %, $ y monto a palabras (`spoken()`) y mide
  por SÍLABAS habladas, no por letras, a ~120 palabras/min. Nunca calcules tiempos por caracteres.
- **Voz de IA:** `scripts/tts_prep.py` escribe los números como se pronuncian (y siglas: S&P 500, CNBV, Nasdaq, JP) antes de
  enviarlos, para que la voz no lea "10,000" como "diez coma cero", y calcula el costo real en créditos.
- **Guiones:** en `say` escribe números con dígitos (se ven bien en subtítulos y alinean con whisper); las herramientas hacen la
  conversión. Si un tramo tiene muchas cifras seguidas, divídelo en más pantallas: se dice más lento de lo que parece.

## Estructura
- `assets/brand/brand.json` — marca: colores, handle, tagline, CTA, aviso legal, voz (id de Daniel).
- `assets/fonts/` — Unbounded, Space Grotesk, Instrument Serif (licencia OFL, uso comercial libre).
- `assets/brand/logo_mask*.png` — logo de Costa Studio como máscara (se tiñe según el fondo).
- `engine/index.html` + `engine/engine.js` — motor Canvas 1080x1920 que dibuja `window.VIDEO`.
  Abrir en navegador: `engine/index.html?v=../videos/<id>/build/video.js` (vista previa en loop).
- `scripts/` — pipeline (ver docstring de cada script). Voz de IA en largos: `tts_prep.py` → vidIQ por piezas →
  `audio/voice_part1.mp3, voice_part2.mp3…` → `process_voice.py` (las une; en largos no acelera la voz) → `build_timeline.py`.
- `videos/<AAAA-MM-DD>-<TICKER>/` — un folder por video: `data.json`, `summary.md`, `storyboard.json`, `narration.txt`, `images/`,
  `audio/voice_raw.mp3` (la voz pagada: no borrar), `<TICKER>_short.mp4`, `youtube.md`. `build/` y los .wav no se versionan.

## Reglas
- **Voz de JP:** todo guion se escribe con el tono de `plan/voz-jp.md` (conversado, suyo, sin frases que suenen a IA). Léelo antes de redactar.
- No generar voz sin aprobación del guion. **Plan Boost desde el 16 nov 2026: 2,000 créditos al mes, se renuevan el 17.**
  La voz cuesta **28 créditos por cada 1,000 caracteres** (eran 14; la tarifa subió). Un largo de 7 min ≈ 5,000
  caracteres ≈ 141 créditos. **Antes de gastar en el guion completo, genera siempre una muestra de 10–15 s** y que JP
  la apruebe (JP, 16 nov 2026).
- **Voces en español del catálogo:** no hay ninguna mexicana. Francisco (`EK54is7sa3aPFLD9BwCC`) es la única masculina
  latinoamericana y es la más cercana a la voz de JP; Andrea es colombiana, Antonio y Carolina son de España.
- Datos siempre verificados; nunca recomendaciones de compra/venta.
- Para cambiar el estilo, editar `brand.json` / `engine.js` y probar con `videos/ejemplo-SE` (re-render sin gastar créditos:
  `build_timeline.py` → `make_audio.py` → `render.js`).
