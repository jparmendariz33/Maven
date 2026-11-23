# finance-videos — Costa Studio Finance (división de finanzas de Costa Studio)

Costa Studio es una agencia de influencer marketing; **Costa Studio Finance** es su canal de finanzas, aparte pero con la misma
marca. Firma en pantalla: logo + "FINANCE". Reglas de separación y sinergias: `plan/PLAN.md` §0. Nunca analizar una empresa que
sea cliente de la agencia sin declararlo.

**Videos largos (16:9, 6–7 min):** skill **`/largo`** (`../.claude/skills/largo/SKILL.md`), motor `engine/long.js`, carpetas
`largos/<domingo AAAA-MM-DD>/`. Plan, calendario y metas en `plan/`. **Narración: voz de IA (Francisco) en una sola toma,
por defecto desde el 22 nov 2026** — ver "La narración con voz de IA es LA del canal". El modo sin voz sirve para maquetar
antes de gastar créditos y para cuando JP quiera grabar él.

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

**Ritmo (vigente desde el 20 nov 2026 — JP lo reordenó para que la semana EMPUJE hacia el largo del domingo):**

| Día | 12:00 | 19:00 | Otro |
|---|---|---|---|
| Lunes | — | — | Publicación |
| Martes | **Historia 3D** (tema libre, del banco) | — | — |
| Miércoles | — | — | Publicación |
| **Jueves** | **Historia 3D puente** — anuncia el largo del domingo | — | — |
| **Viernes** | — | **Short de contexto** | — |
| **Sábado** | — | **Análisis + Potencial** | — |
| Domingo | **Largo 10:00** | **Ranking / torneo** | Publicación |

Qué cambió y por qué (JP, 19 nov 2026): las historias pasan a **martes y jueves** porque son el formato con más alcance y
sirven de calentamiento; **la del jueves es la puente** y lleva una escena con un pizarrón que anuncia el largo del domingo
("ESTE DOMINGO 10:00" + el título). El **short de contexto se va al viernes**, que es cuando ya cerró la semana y el
contexto está completo, y **Análisis + Potencial al sábado**. Antes eran: historias miércoles y sábado, shorts de contexto
martes y jueves, A+P el viernes.
**La regla que nace de esto:** si la historia del jueves promete el largo en pantalla, ese largo deja de ser negociable.
Por eso el borrador del largo empieza el lunes anterior (ver "Regla del borrador anticipado").
Los videos con datos del día se hacen DESPUÉS del cierre de la bolsa (ver "Regla del cierre"). Música: partitura de órgano y piano en las
historias; cama cálida en shorts y largos.

Para crear un short, sigue la skill **`/short`** (`../.claude/skills/short/SKILL.md`). Resumen del flujo:
`setup.sh` → `market_close.py` (¿ya cerró?) → `fetch_data.py` → storyboard.json → `script_check.py` → **OK del usuario** → voz (vidIQ) →
`process_voice.py` → `build_timeline.py` → `engine3d/render_host.js` (JP en 3D) → `render.js --qa` (revisar) → `make_audio.py` → `render.js` → youtube.md → commit.

**Rama y tareas (corregido el 22 nov 2026):** todo el proyecto vive en **`main`** de `jparmendariz33/Maven` (Costa Studio, la agencia, es otra
empresa: no mezclar nombres). La rama `costa-studio-finance` que se citaba aquí ya no existe en el remoto y era por lo que fallaban los
pushes de las tareas. Cada sesión en la nube trabaja y pushea en su propia rama `claude/<algo>`; a `main` se pasa con el OK de JP. Las instrucciones de las tareas programadas están en `plan/tareas.md`. Un solo MP4 por pieza en GitHub
(sin renders de prueba ni versiones alternas: el repo crece con cada video).

---

## Cómo está ordenado esto

Las reglas nacen de correcciones de JP y hasta el 20 nov 2026 estaban en orden cronológico, que no sirve para
buscar. Ahora van en **seis bloques**, cada regla con su fecha intacta. Si añades una, va al bloque que le toca,
no al final.

- **Bloque 1 — El gancho y el guion — qué se dice y en qué orden**
- **Bloque 2 — Datos, fuentes y límites editoriales**
- **Bloque 3 — Imagen: maquetación, 3D y miniatura**
- **Bloque 4 — Audio: voz, aire y música**
- **Bloque 5 — Producción: calendario, aprobaciones y créditos**
- **Bloque 6 — El proyecto: estructura y reglas base**


---

# 1. El gancho y el guion — qué se dice y en qué orden

## Regla del gancho (JP, 20 nov 2026 — la más importante del canal)
"Creo que la primera parte es muy buena, pero no engancha. Hay que enganchar en 3 o 5 segundos."
**No es opinión: está medido.** En la historia de Steve Jobs solo el **27.84%** se quedó a mirar —7 de cada 10
deslizaron— pero quien se quedaba veía el **51.76%**. El contenido no era el problema; el primer segundo sí.
Un video que nadie ve no sirve por bien hecho que esté, así que el gancho se trabaja **antes** que el resto del guion.
- **Shorts e historias 3D: 3 segundos, y el gancho son TRES CAPAS juntas** (JP, 20 nov 2026):
  1. **La narración.** La primera frase hablada ES el gancho: sin entrada, sin respiración previa, la voz arranca
     antes de 0.1 s. La cifra o la contradicción cae en las primeras 8 palabras.
  2. **El texto en pantalla**, desde el cuadro 1, que se basta solo porque mucha gente ve en silencio — lo cual no
     quiere decir que el video vaya mudo.
  3. **La música**, con cuerpo desde el cuadro 1. Hasta el 20 nov entraba al 15% de su máximo y crecía: el gancho
     era la parte con menos música del video. Ahora `music3d.py` entra al 36% y se asienta.
  Y el contenido: una cifra que choque, una contradicción, algo que el espectador ya conoce. Nunca una presentación
  ("hoy vamos a hablar de…") ni un contexto previo.
- **Largos: hasta 15 s**, pero la promesa concreta va en los primeros 5.
- **Publicaciones:** el gancho es el título de la primera lámina. Mismo filtro.
- **El filtro, antes de escribir nada más:** si la primera frase se puede cambiar por la de otro video del canal sin que
  se note, no es un gancho. Y si hay que esperar a la segunda frase para entender por qué importa, tampoco.
- Lo que SÍ engancha, por orden de lo que ha funcionado: una contradicción ("reportó récord y la acción cayó"), una
  cifra con escala ("perdió 104 mil millones y casi no perdió dinero"), un resultado prometido ("gana Alphabet, 25 de 30").
- Sigue vigente que el gancho **identifica a la empresa** (logo o foto): enganchar y decir de quién hablas no compiten.

## Los largos SIEMPRE abren con una PREGUNTA que le pasa a cualquiera (JP, 22 nov 2026)
JP vio el largo de finanzas conductuales y tumbó el gancho: *"no me gustó absolutamente nada"*. El que eligió, de
tres opciones, fue el que abre preguntando algo que el espectador ha vivido:
> *"¿Alguna vez vendiste algo que ya había subido… y te quedaste con lo que iba bajando? Si te pasó, no eres raro.
> Casi todos lo hacemos, y alguien hizo una investigación para entender por qué."*

**La regla, de aquí en adelante y para TODO largo:** el video empieza con una **pregunta directa al espectador sobre
algo que él ya hizo o ya sintió**, no con una cifra ni con una definición. JP lo dijo así: *"ese tipo de hooks con
preguntas son las que más me gustan, me gustaría que los videos largos siempre empezaran así"*.
- La pregunta tiene que entenderse **sin saber nada de finanzas** y sin importar la edad ni la profesión de quien ve.
- Después de la pregunta va el reconocimiento (*"no eres raro, casi todos lo hacemos"*) y luego la promesa
  (*"alguien hizo una investigación para entender por qué"*). Nunca "alguien lo contó cuenta por cuenta" ni frases
  que suenen a dato técnico: JP corrigió justo esa.
- **El dato que responde la pregunta va antes del segundo 30.** En la versión tumbada el primer dato caía en 1:13 y
  la audiencia del canal se va al minuto: los primeros 73 segundos eran preámbulo.

## Nunca "Soy JP Armendáriz" en un largo (JP, 22 nov 2026)
*"Quita siempre de ahora en adelante lo de 'soy JP Armendáriz'. Eso está de más, quita tiempo y la gente se puede ir
en ese momento."* La escena `personal` de presentación **se elimina de todos los largos**. La firma del canal ya está
en el logo de la esquina, en el cierre y en la descripción; no hace falta gastarle 13 segundos del minuto que decide
todo. **Sí se queda** la escena `personal` de a mitad del video con la pregunta a la audiencia: esa invita a comentar
y JP la quiere.

## Regla de oro: explicar como si quien ve no supiera NADA (JP, 22 nov 2026)
*"Este tipo de videos son para gente que no tiene nada de conocimiento. Todos los conceptos explícalos como si fueran
para un niño de 5 años, casi casi."* Ya existía "que se entienda sin saber nada" (19 nov) para las historias 3D; JP la
subió a **regla de oro del canal y la extendió a la narración y al guion de los largos**.
- **Ninguna palabra de gremio sin traducir.** "Efecto disposición" → "soltamos lo que va bien y nos aferramos a lo que
  va mal". "Aversión a la pérdida" → "perder duele más de lo que gusta ganar". "Rotar el portafolio" → "mover tu
  dinero". "Operar" → "comprar y vender". "Fondo de inversión" → "una canasta donde mucha gente junta su dinero".
  "Mal timing" → "entrar y salir en mal momento". Si el término hace falta, se dice **después** de la explicación, no antes.
- **Nada de siglas sueltas** (ROE, PEG, CRSP, PGR). Si no se puede explicar en media frase, no entra.
- **Los números se traducen a algo que se sienta.** "6.5 puntos al año" no significa nada; "en seis años, casi
  triplicar tu dinero contra no llegar ni a duplicarlo" sí. Un porcentaje suelto se convierte a dinero, a veces o a
  "de cada 100".
- **La prueba:** si una frase le pide al espectador que ya sepa algo, está mal. Se reescribe.

## El gancho se investiga antes de escribirlo (JP, 20 nov 2026)
JP tumbó mi gancho del short de Anthropic —"perdió 104 mil millones y casi no perdió dinero"— por dos razones: repite
"perdió" dos veces y, sobre todo, **no estaba construido sobre la noticia**. Yo lo saqué de los datos del prospecto
sin haber leído un solo titular. Al buscarlos, el titular que dominó en todo el mundo era otro y yo ni lo tenía:
**fue la salida a bolsa más grande de la historia**, 81.3 mil millones, y le quitó el récord a SpaceX.

**La regla: antes de escribir la primera frase de cualquier pieza sobre una noticia, se buscan los titulares reales.**
No para copiarlos: para saber qué ya oyó el espectador y qué no.
1. **Busca en español y en inglés** (los titulares mexicanos y los gringos no destacan lo mismo; El Financiero y CNN
   en Español importan más para nuestro público que CNBC).
2. **Apunta qué dijeron TODOS.** Ese es el hecho que el espectador reconoce, y es con lo que se abre: si no reconoce
   la historia en los primeros 3 segundos, no sabe de qué le hablas y desliza.
3. **Apunta qué dijo CASI NADIE.** Ese es el cuerpo del video y la razón para quedarse. Es nuestra ventaja: no
   competimos por dar la noticia primero, competimos por darla completa.
4. **La fórmula del gancho: lo que ya oyeron + el giro que no.** "Le quitó el récord a SpaceX" (lo oyeron) "y cerró
   ganando la mitad de lo que abrió" (no lo oyeron). El cuerpo entra después con lo que nadie contó.
5. **Las cifras en las que los medios NO coinciden son una alerta roja**, no un dato. En Anthropic el valor de
   mercado iba de 1.5 a 2 billones según quién lo contara, y el monto levantado era 81.3 o 107.3 mil millones según
   si se cuenta una colocación privada. Esas se verifican con fuente primaria o se omiten (regla del número que no se
   puede verificar). Las que sí coinciden en todos lados y además cuadran con el documento original son las seguras.
6. **Mejor si el gancho engancha con algo del canal.** SpaceX es nuestro video con más retención (86.5% se quedó a
   mirar): abrir con "le quitó el récord a SpaceX" le habla a gente que ya vio eso.
Esto **no** cambia la jerarquía de fuentes: los titulares sirven para elegir el ángulo, los números siguen saliendo de
la fuente primaria. Un titular es una pista de qué contar, nunca la fuente de una cifra.

## El gancho identifica a la empresa (JP, 14 nov 2026)
La primera escena lleva **siempre** el logo (`"logo"` en el `hook`, arriba a la derecha, con tarjeta blanca si no
contrasta) o la foto del tema a toda pantalla, o las dos. Un gancho sin marca no dice de quién habla. Detalle en `/short` §0.

## Regla del rótulo (JP, 14 nov 2026)
**Todo lo que dice la voz se ve en pantalla, y ningún número va sin decir qué es.** "Brasil · 120 M" no significa nada: va
"Brasil · 120 M de clientes". "¿Está cara?" sin nombrar la acción es ambiguo: va "La acción se paga a 16 veces las ganancias".
Distingue siempre **utilidad de operación** de **utilidad neta**. Detalle y checklist en `/short` §0.

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

## Las historias cierran con una PREGUNTA (convención de la casa, 19 nov 2026)
Lo tenía la historia de Steve Jobs ("¿Genio irrepetible… o una empresa capaz de reinventarse?") y a la de Kahneman se
me olvidó: terminaba con una afirmación y se acababa. La escena de cierre es propia y lleva **la pregunta centrada en
serif itálica, la línea "Desde la costa, todo se ve con claridad." y el aviso legal**. Si la historia es el puente a un
largo, va **antes** una escena de aviso (pizarrón "ESTE DOMINGO 10:00" + el título) y la pregunta cierra al final.

## Regla del cierre de un ranking (JP, 15 nov 2026)
La última frase es **un principio general, nunca un veredicto sobre una acción**. "El crecimiento es una métrica, no una
tesis" sirve; "Mercado Libre no es buena inversión" o "no es buen momento para entrar" son recomendación y están
prohibidas. La buena señal: la frase sigue siendo cierta en el torneo del domingo siguiente, con otras empresas.
Tampoco frases tajantes de más ("crecer rápido no es ser un buen negocio" se descartó por injusta con quien lidera
en ventas y en PEG).

## Regla de los números (descubierta en nov 2026 — aplica a TODO: shorts, largos, voz propia o de IA)
Un número mide pocos caracteres pero tarda mucho en decirse: "45" son 2 caracteres y se dice "cuarenta y cinco";
"1950" → "mil novecientos cincuenta" (8 sílabas); "46%" → "cuarenta y seis por ciento"; "$45,765" → 20 sílabas.
- **Tiempos (teleprompter sin voz):** `scripts/no_voice.py` convierte cada número, %, $ y monto a palabras (`spoken()`) y mide
  por SÍLABAS habladas, no por letras, a ~120 palabras/min. Nunca calcules tiempos por caracteres.
- **Voz de IA:** `scripts/tts_prep.py` escribe los números como se pronuncian (y siglas: S&P 500, CNBV, Nasdaq, JP) antes de
  enviarlos, para que la voz no lea "10,000" como "diez coma cero", y calcula el costo real en créditos.
- **Guiones:** en `say` escribe números con dígitos (se ven bien en subtítulos y alinean con whisper); las herramientas hacen la
  conversión. Si un tramo tiene muchas cifras seguidas, divídelo en más pantallas: se dice más lento de lo que parece.

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

## La narración con voz de IA es LA del canal (JP, 22 nov 2026)
Yo le advertí a JP que la voz de IA deja el largo en 4:22 en vez de los 6–7 minutos del formato, y le propuse
alargar el guion. Su respuesta: *"tú te quejaste del audio, pero es el video que más me ha gustado cómo se está
narrando. Valdría la pena mantenerlo con ese estilo. De verdad me fascinó."*

**La regla: la voz de Francisco en una sola toma es la narración por defecto de los largos y de los rankings**, y la
duración que resulte es la buena. Se acabó el "modo sin voz por defecto" para los largos.
- **No se alarga un guion para llegar a una duración.** Un largo de 4 a 5 minutos bien narrado vale más que uno de 7
  con relleno. Eso también es lo que JP pidió el 22 nov para el gancho: menos grasa, más al grano.
- Sigue valiendo la **regla de la toma única** (una sola llamada, nunca por piezas) y la de **eficiencia en créditos**
  (medir el texto antes de mandarlo y decir en cuántos bloques cae).
- La **voz es Francisco** (`EK54is7sa3aPFLD9BwCC`), la única masculina latinoamericana del catálogo. *(La skill
  `/largo` decía Daniel, que es una voz británica en inglés: corregido el 22 nov 2026.)*
- Al subir el video hay que marcar **"contenido alterado o sintético: Sí"**.
- Lo que NO cambia: el guion se sigue escribiendo con el registro limpio de la "Regla de la voz humana con IA"
  (sin muletillas, lo humano se consigue con prosodia), y JP puede grabar él cuando quiera.

## Regla del reloj con voz de IA (16 nov 2026)
La voz de IA lee a ~150 palabras/min; `no_voice.py` presupuesta 120 para la voz de JP. **El mismo guion sale ~25% más
corto con IA**: el largo de Apple pasó de 6:52 (teleprompter) a 5:21 (Francisco). Si un largo tiene que durar 6–7 min
con voz de IA, el guion necesita ~25% más contenido. Y nunca escribas la duración dentro del guion ("en 10 minutos"):
cambia con cada recorte y con la voz, y hay que regenerar audio para corregirla (ya pasó dos veces).

---

# 2. Datos, fuentes y límites editoriales

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

## Un número que no se puede verificar no se publica (20 nov 2026)
En el debut de Anthropic las fuentes daban valor de mercado entre 1.3 y 2 billones, el prospecto no publicaba cifra
final y las acciones en circulación que sí reportaba excluían opciones y RSUs. **Se omitió el dato.** Calcularlo
habría sido inventar precisión. Mejor una publicación sin la cifra más vistosa que una con un número que no aguanta.

## Noticias: fuente primaria + al menos tres fuentes del día (JP, 20 nov 2026)
Para una pieza sobre algo que pasó hoy: la **fuente primaria** (SEC, reporte de la empresa, la bolsa) manda, y encima
se confirma con **al menos dos fuentes independientes del mismo día**. En la publicación de Anthropic: prospecto
424(b)(4) ante la SEC + cierre de Yahoo Finance + cobertura de CNBC y CNN, todo del 19 de noviembre. Las tres se citan.
**Y antes de escribir: comprueba la fecha en hora de México, no la del contenedor**, que corre en UTC. Por eso dije
"ayer" de algo que había pasado ese mismo día.

## Un número que ilustra se marca "ilustrativo" en pantalla (20 nov 2026)
Del short de @DesarmadoYoutube que trajo JP: el velocímetro que sube a 150 lleva pegado, chiquito, **`km/h ·
ilustrativo`**. No es el dato de un coche real y lo dicen ellos mismos, sin que nadie se los pida.
Nos hacía falta. Nuestra regla era "todo número lleva fuente", y tapaba un hueco: **un número que no es un dato sino
una simulación no tiene fuente que citar, y aun así lo vamos a poner en pantalla.** Pasa en cuanto hagamos la
historia del interés compuesto: "$1,000 al 10% anual" no es un dato de nada, es un supuesto que elegimos nosotros.
- Todo número **proyectado, simulado o de ejemplo** lleva la palabra **`ilustrativo`** pegada a la cifra, en chico,
  en la misma ficha. No en la descripción: en pantalla.
- Si el supuesto se puede nombrar en una palabra, se nombra: `supone 10% anual · ilustrativo`.
- Un número **real** nunca lleva la marca: ahí va la fuente. La marca distingue las dos cosas, y si se pone en todo
  deja de distinguir nada.
- Esto **no** convierte una proyección en algo publicable por sí solo: sigue prohibido proyectar el precio de una
  acción. Es para aritmética neutra (interés compuesto, inflación, una comisión), no para pronósticos.

## Una publicación nunca dice "hoy" ni "ayer" (20 nov 2026)
JP no alcanzó a subir la publicación de Nvidia el día que se hizo, y al día siguiente "hoy bajó 2.89%" y "lo que
reportó ayer" ya eran falsas. **En publicaciones y en sus textos las fechas van explícitas** ("el martes", "el
miércoles 18", "en lo que va del año"), para que sigan siendo ciertas el día que se suban. En los shorts de contexto
ya estaba prohibido por otra razón (que no envejezcan); aquí es por exactitud.

## Conflicto de interés: se declara aunque nadie pregunte (20 nov 2026)
La publicación del debut de Anthropic la redactó Claude, que es un producto de Anthropic. Se le dijo a JP antes de
escribir una línea y quedó anotado en `summary.md` y en `publicacion.md`. La regla del canal ya exige declarar las
empresas que son clientes de la agencia; esto es lo mismo por el otro lado: **cualquier relación entre quien escribe
y la empresa analizada se dice, y la decisión de publicarla o no es de JP.**

---

# 3. Imagen: maquetación, 3D y miniatura

## Regla de la maquetación (13 nov 2026, tras el defecto que encontró JP en el short de Nubank)
El motor tiene que aguantar cualquier largo de texto: **nunca** se arregla un encimado acortando el guion.
- `fitLines(txt, f, w, size, maxW, maxLines, min)` achica hasta que quepa. `wrap(...).slice(0, n)` tira palabras en
  silencio (así se perdieron "pagan" e "impuestos" en las etiquetas de una cascada): prohibido.
- Nada se dibuja en una Y fija si arriba hay texto de largo variable: cada bloque cuelga de donde terminó el anterior.
- Antes de entregar, barrido del MP4 completo (un cuadro cada 3 s en contacto), no solo `qa.jpg`. Receta en `/short` §4.

## Los rótulos se ajustan solos (20 nov 2026)
Ni el título ni el subtítulo de `head()` se arreglan acortando el texto (regla de la maquetación). A 78 px caben ~18
caracteres por línea en los 900 px útiles: si una línea se pasa, **todo el bloque se achica** (mínimo 54). El subtítulo
hace lo mismo a partir de ~46 caracteres. Y el degradado (`scrim`) tiene que llegar ~60 px más abajo que la última
línea: si no, el subtítulo cae sobre la escena y, con un fondo oscuro detrás, desaparece.

## Regla de los logos (JP, 15 nov 2026)
- **Siempre el logo oficial de la empresa**, bajado de su propia sala de prensa o sitio (gstatic para Google, newsroom de
  Spotify, el sitio de cada mexicana). El catálogo de iconos monocromo solo como último recurso: da la "G" en vez de la
  palabra Google y pierde el color de marca. Crédito en `images/credits.json`.
- **Nada de tarjeta blanca** salvo que el logo sea casi invisible sobre el fondo (umbral de contraste 1.22). Una tarjeta
  blanca se lee como "PNG mal recortado".
- **Varios logos juntos van en bloque 3 + 2, no en fila.** En fila de cinco quedan diminutos. En el gancho del short el
  bloque va a la altura del personaje (y≈1128), nunca pegado al subtítulo ni encima de los subtítulos de la voz.
  Lo controla `"logo_layout": "bloque" | "fila" | "esparcido"` en la escena.

## Un archivo bajado puede ser una página de error (22 nov 2026)
Armando el torneo, Wikimedia devolvió su pantalla de **"Too many requests"** con **código HTTP 200**, no 429. El
archivo se guardó como si fuera el logo, `svg2png.js` lo convirtió tan contento y el "logo de FEMSA" acabó siendo la
pantalla de error de Wikimedia renderizada en PNG. Estuvo a punto de irse al video.
**La regla: después de bajar un logo o una foto, se MIRA el archivo antes de usarlo.** Un 200 no garantiza nada.
Señales de que algo salió mal: pesa menos de ~6 KB, o el SVG contiene "Too many requests" / "Error" / "Wikimedia
Status". Y aunque el archivo sea legítimo puede estar incompleto: la "FEMSA Logo.svg" de Commons es solo la mancha
roja, sin el texto, y tampoco servía. **La fuente preferida sigue siendo la sala de prensa o el sitio de la empresa**
(y si JP manda el logo, ese gana).

## Regla de las cascadas (JP, 14 nov 2026)
**Siempre con los montos reales; nunca normalizados a $100.** Con base 100 el porcentaje y el monto dicen lo mismo y la fila de
montos sobra. La escala va en el subtítulo y en `"unit"` de la escena. Detalle en `/short` §1e.

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
Para calcular distancia: con el vertical, **`media_altura = tan(15°) × distancia = 0.268 × distancia`** y
`media_anchura = media_altura × 0.5625`. (Hasta el 20 nov 2026 aquí decía `tan(25°)`, que era un error mío: el `fov`
del motor es **30°** —`cine.js:82`, `lib.js:52`, nunca se modifica—, así que el semiángulo es 15°. Con tan(25°) salía
un cuadro 74% más grande del real, te creías con aire que no tenías y el objeto quedaba cortado: esa es la causa de
varias de las cinco vueltas de encuadre de Kahneman. Comprobado contra `miniatura.jpg`: la fórmula predice que el
personaje ocupa el 33% del alto y medido ocupa el 34%; con tan(25°) habría predicho 19%.)
Mide el objeto más ancho (incluye lo que se mueve: un plato de balanza que se inclina viaja hacia afuera) y despeja.

## El personaje 3D interactúa, no decora (JP, 22 nov 2026)
*"Hay que intentar hacer un poquito más dinámico el video, con personajes 3D. No sé, como que el personaje esté
viendo la pantalla, o que interactúe con las letras de la pantalla, cosas así."* Hasta ahora el recorte de JP estaba
parado en la esquina mirando a cámara mientras el dato aparecía solo al lado.
**La regla: en cada escena donde salga, JP tiene que estar haciendo algo CON lo que hay en pantalla.**
- **Señala el dato** (`act: "senala"`), colocado del lado opuesto a la cifra para que el brazo apunte hacia ella.
  El lado sale de `pos`: con `bl` mira a la derecha, con `br` mira a la izquierda.
- **Reacciona al número**: `mood: "down"` cuando el dato es malo, `"up"` cuando es bueno, `"piensa"` cuando la escena
  plantea una duda.
- **Sale en más escenas que antes**: de 5 pasa a 6–8 en un largo, siempre que no sean dos seguidas.
- Lo que NO se hace: ponerlo de adorno en una esquina sin relación con la escena, ni dejarlo con el mismo acto y el
  mismo ánimo dos escenas distintas.

## Las gráficas llevan personaje, siempre (JP, 20 nov 2026 — regla permanente)
JP, viendo la gráfica de precios del short de Anthropic: *"no me gusta. La gráfica que más me ha gustado que hemos
hecho es la de SpaceX y Steve Jobs, en la que se ve a Jobs escalando las ventas y a Musk en un carrito. Te propongo
que siempre mantengamos ese estilo."*
**Dos convenciones de la casa, de aquí en adelante y en todos los formatos:**
- **Ventas, ingresos, algo que crece año con año → el personaje SUBE unas escaleras**, y cada escalón es un año o un
  periodo. La altura del escalón es el dato; el personaje da la escala.
- **Una curva con movimiento (un precio, una sesión, una caída) → el personaje va EN UN CARRITO** sobre la línea:
  sube con ella, se le cae encima cuando baja. La línea deja de ser un dibujo y se vuelve un recorrido.
**Una gráfica donde solo se mueve la línea está prohibida.** Si el dato no admite ni escalera ni carrito, busca otra
acción física antes de dibujar ejes sueltos: algo que el personaje haga o que le pase.
Para **comparar dos cantidades** (no una evolución): **columnas verticales con eje X y eje Y visibles**, no barras
horizontales ni bloques sueltos. JP lo pidió así para el récord de SpaceX contra Anthropic.

## Un video entero tiene UNA paleta (JP, 20 nov 2026)
*"El fondo de la nada aparece blanco y amarillo, cuando en realidad todo estaba siendo de color naranja. Cambió mucho
hasta el fondo en diferentes escenas. Hay que ser constantes, y eso anótalo para todos los demás skills."*
Tenía razón: el short de Anthropic empezaba en naranja quemado y a media pieza saltaba a beige y luego a crema casi
blanco. Leído seguido, parecen tres videos pegados.
**La regla: los mundos de un mismo video son variaciones de UNA paleta, no paletas distintas.** Cambia la luz y el
valor (más oscuro, más claro), no la familia de color. El arco de luz sigue valiendo —el mundo del problema más
oscuro que el de la salida— pero **dentro del mismo tono**: naranja profundo → naranja medio → naranja claro, nunca
naranja → beige → blanco. Antes de renderizar, mira la hoja de QA **entrecerrando los ojos**: si un cuadro parece de
otro video, está mal. Vale para historias, shorts, largos y publicaciones.

## Menos efectos, y ninguno repetido (JP, 20 nov 2026)
*"Hay muchos sonidos que se repiten, demasiados en el video."* Cierto, y la cuenta lo confirma: 18 efectos escritos
en `story.js` **más** una "ola" automática en cada cambio de escena (`make_audio.py`) **más** un `pluck` por cada
`cue`. En 87 segundos eso es un efecto cada dos segundos y medio.
- **Máximo 6–8 efectos en todo un short o una historia**, no 3–7 por escena como decía antes `/historia`.
- **Ninguno se repite dos veces seguidas**, y la "ola" de transición va solo cuando se cambia de MUNDO, no entre dos
  escenas del mismo sitio.
- El efecto se gana su lugar: suena cuando algo **golpea, cae, se rompe o aparece de golpe**. Un movimiento suave no
  lleva efecto.
- El silencio también es un recurso: un par de segundos sin nada antes del dato que importa pega más que un `shine`.

## Si sale un lugar real, investiga cómo se ve (JP, 20 nov 2026)
*"No se parece mucho a Nueva York; busca fotos de Times Square e inténtalo replicar lo más posible."* Yo hice
edificios de ladrillo con ventanitas y UNA pantalla, que es como se ve cualquier plaza, no Times Square.
Lo que de verdad lo define, verificado: **las fachadas enteras son pantallas, por ley** —la norma de zonificación
obliga a los edificios de la plaza a llevar miles de metros de anuncios luminosos—, el edificio en cuña de One Times
Square con un panel LED de ~100 metros de alto, letreros apilados unos sobre otros sin pared visible entre ellos, y
las **escaleras rojas translúcidas del TKTS**. No es una plaza con una pantalla: es una plaza hecha de pantallas.
**La regla: antes de maquetar un lugar reconocible, busca cómo es y quédate con los tres o cuatro rasgos que lo hacen
identificable.** Si la maqueta no se reconoce sin rótulo, no es ese lugar, es una plaza genérica.

## La cámara también narra: gramática de plano (JP, 20 nov 2026)
JP trajo un short de @SoySR.J y dijo: "todas las tomas son a la misma altura de la persona, la toma no cambia,
mantiene el mismo tamaño la persona". **Medido en la historia de Kahneman, tenía razón exacta:** las 10 escenas van
entre **−1.9° y +7.8°** de ángulo, a distancias de 9.4 a 21.6, con el personaje ocupando siempre el **20–33% del alto
del cuadro**. Cero primeros planos, cero detalles, cero picados, cero contrapicados. Siete mundos de distinto color y
aun así se siente estático: son diez variaciones del mismo plano medio.
**La regla: en una historia de 8–10 escenas va al menos un plano de cada familia (general, entero, medio, primer
plano, detalle) y dos escenas seguidas nunca comparten tamaño de plano.** El tamaño del plano dice qué sentir:
contrapicado agranda (el Nobel, el logro), picado empequeñece (la pérdida, el error), cenital convierte la escena en
un esquema (las cartas, un portafolio sobre la mesa). La tabla con las distancias y alturas exactas está en
`/historia` §4. Para acercarte más que el primer plano, **baja el `fov`** (`w.cam.fov = 18`), no metas la cámara: a
menos de 3 unidades la cara se deforma. Y en plano cerrado mete algo a media distancia, o el fondo se lee vacío.
Lo mismo con los mundos: los nuestros son **piso + pared** repintados. Un mundo necesita tres profundidades (algo
pegado a cámara, el sujeto, algo al fondo) y **hacer algo durante la escena** — que los edificios suban del suelo
escalonados con `scale.y`, que la mesa se llene, que la luz pase de día a noche.

## Un cambio de escena tiene que VERSE como un cambio de escena (JP, 20 nov 2026)
JP vio el short de Anthropic: *"la primera escena y la segunda sí se distingue que son dos escenas distintas,
porque hay un cambio repentino en el movimiento de cabeza de la persona. Cada vez que hagamos un cambio de escena,
tienen que hacer cambios de escena."* Tenía razón: yo había encadenado cuatro escenas seguidas en el mismo mundo
con `trans: 'cont'` y cámaras continuas, y el único indicio del corte era que al personaje le saltaba la cabeza.
Eso no se lee como una escena nueva: se lee como un error de render.
**La regla: entre dos escenas consecutivas tiene que cambiar el LUGAR o el TAMAÑO DEL PLANO, y de forma visible.**
Un desplazamiento pequeño de cámara dentro del mismo encuadre no es un corte; si eso es todo lo que cambia, **las dos
escenas son una sola** y hay que fundirlas, o darle a la segunda otro mundo u otro tamaño de plano.
`trans: 'cont'` sigue siendo correcto para una toma continua, pero continuo no quiere decir parecido: en el short de
Anthropic las escenas 1 y 2 siguen encadenadas y ahora la cámara pasa de **plano general de la plaza** a **la pantalla
llenando el cuadro**. Es continuo y aun así es inconfundible.

## El gancho se ve antes de entenderse (JP, 20 nov 2026)
Mi primera escena era un plano detalle de la línea del precio que se abría a general. JP: *"se ve espantoso… se ve
algo totalmente en zoom pero no se logra distinguir qué es, y cuando haces el zoom out tampoco entiendes qué tiene
que ver con la historia."* El defecto de fondo: **elegí el plano por la gramática (quería un detalle en la lista) en
vez de por lo que la imagen tenía que decir.** Un plano detalle de algo abstracto no es un gancho, es un acertijo.
**El primer cuadro tiene que ser una imagen que cualquiera reconozca al instante**, y para eso sirve la iconografía
del tema: JP propuso *"literal cuando tocan la campana en la bolsa, o cuando presionan el botón en el Nasdaq, y todo
el equipo empieza a celebrar; o Times Square, la pantalla famosa donde aparece cuando una acción sale a bolsa."*
Quedó así: plaza al atardecer, la pantalla de la torre encendida con el ticker, confeti y el equipo con los brazos
arriba. **Y hay que ser creativos con las escenas**: antes de aceptar un encuadre, pregunta qué imagen del mundo real
cuenta ese momento sin una sola palabra. Si la respuesta es "una gráfica", busca otra vez.
Detalle técnico: una pantalla de la calle **tiene que brillar sola** (`material.emissive` + `emissiveMap` con la
misma textura). Iluminada solo por las luces de la escena queda como un cartel apagado.

## El rótulo se revela en dos tiempos, y la consecuencia se VE (20 nov 2026)
Dos cosas del short de @DesarmadoYoutube (206 mil likes, el más visto de los tres que trajo JP):
- **El rótulo no es un subtítulo: es un remate en dos tiempos.** Primero entra `lo peor:` solo. Un instante después
  cae debajo, **en rojo**, `pisar a fondo`. La frase importante no aparece de golpe con el resto del texto; **se
  revela**. Nuestro `head()` dibuja el título entero de una vez, y para el golpe de la historia eso lo desperdicia.
  Úsalo **una o dos veces por video**, en el gancho y en el remate: la primera línea en el color de siempre, la
  segunda entrando ~0.3 s después en el color de acento. En todas las demás escenas, el rótulo normal.
- **La consecuencia se ve, no se nombra.** Dice "el que termina abrazado a un poste eres tú" y **el coche choca**:
  estrellas girando, parabrisas roto, la equis. Nuestra regla del dinamismo pide que un objeto cambie de estado por
  una causa; esto es el escalón siguiente y aplica a todo video sobre un error: **si el guion nombra una consecuencia
  mala, la maqueta tiene que enseñarla pasando.** La torre que se deshace del short de Anthropic es justo eso.
(De ese short NO copiamos el aspecto: es plano, de pocos polígonos y de noche. El nuestro es plastilina mate con luz
de cine y ya es reconocible; cambiarlo por parecernos a alguien sería tirar lo único que es nuestro.)

## Anotar encima de la maqueta (20 nov 2026)
Del video completo de @DesarmadoYoutube. Cuatro herramientas para explicar un mecanismo sin que la voz lo describa:
**trayectoria dibujada** (línea luminosa sobre el 3D; verde el protagonista, rojo la amenaza), **etiqueta que
APUNTA** (píldora con línea punteada hasta la parte exacta que nombra), **anillo de foco** (círculo alrededor de lo
que importa en ese segundo) y **recuadro esquema** abajo a la izquierda (el concepto dibujado abstracto mientras la
maqueta enseña la cosa real: las dos a la vez, y por eso se entiende a la primera). La cuarta es la que más nos
sirve para un mecanismo financiero. La segunda mejora nuestra regla del rótulo: en vez de nombrar el dato en el
titular, se señala la cosa. **Y las amarra una regla: el color de la palabra resaltada del rótulo es el mismo color
con el que se anota el objeto en la escena.** Detalle en `/historia` §4.
También el **arco de luz**: ese video pasa de noche y termina en una gasolinera iluminada con gente. Si la historia
tiene un problema y una salida, **el mundo del problema va más oscuro que el de la salida**, y el cambio se ve.

## Primero la historia, después la técnica (JP, 20 nov 2026)
En un solo día le metí ocho recursos nuevos al skill de historias y JP puso el freno: *"cada video va a ser
distinto… no es que tengas que meter todo en todos los videos, sino agarrar lo que más te sirva para cierto tipo de
videos."* Tenía razón: leídos en fila, los recursos parecen una lista de pendientes y el riesgo es producir videos
que son un muestrario en vez de una historia.
**El orden no se invierte nunca:** (1) escribes la historia en prosa, sin pensar en recursos; (2) preguntas qué tipo
de historia es; (3) eliges **UN motor narrativo** y **dices por qué en el borrador**; (4) los recursos de la base
van en todos, de los demás **máximo dos**.
**Una historia a la que hay que meterle un recurso para que funcione no está bien contada.** Si el guion en prosa no
se sostiene leído en voz alta, ningún contador lo salva.
Los cinco motores, con la tabla de cuándo va cada uno y qué NO mezclar, en `/historia` §4:
**el contador** (una cantidad que crece hasta volverse absurda) · **construido desde cero** (cómo funciona algo) ·
**el alejamiento** (un hecho humano que necesita contexto: la misma cosa a tres escalas, que es lo que JP describió
como "alejas la toma y luego la vuelves a alejar a la ciudad") · **lo peor que puedes hacer** (un error común) ·
**el desmontaje** (un titular que casi todos creen y la cuenta dice otra cosa — el motor más usado de este canal,
aunque no estaba escrito).
**No son una jaula.** Salieron de seis videos de dos canales. Cuando una historia no quepa en ninguno, **se le
inventa el motor a esa historia y se anota**, en vez de forzarla al que menos mal le quede (JP, 20 nov 2026). Lo que
no cambia nunca es la estructura de la casa: el gancho de 3 s en tres capas, que se entienda sin saber nada, la
gramática de plano, el cierre con pregunta y los límites editoriales.

## "Construido desde cero": derivar el mecanismo (20 nov 2026)
Segundo video de @DesarmadoYoutube, 227 mil likes: *"Ese techo del estadio NO tiene ni una columna"*. No explica un
estadio, **lo construye, y cada problema nuevo obliga a inventar la siguiente pieza**: cancha + gente → *solo la
primera fila ve* → escalones → *las esquinas quedan vacías* → cerrar el anillo → *llueve* → techo con columnas →
*hay quien ve detrás de un poste* → lo cuelgas. El título promete el final y la última frase lo entrega.
**Cada frase es un problema o su arreglo, encadenados con "pero" y "así que". Nada más**: ni presentación, ni
recapitulación, ni cierre de relleno. 116 palabras para nueve pasos.
Es el formato natural de casi todo lo que enseñamos y no lo teníamos (`¿por qué existe la bolsa?`, `¿por qué existe
un banco?`, `¿qué es una acción?`). **Tropicalizado:** el problema en **terracota**, la pieza que lo resuelve en
**mostaza**, y la pieza nueva se resalta en mostaza cuando aparece y se apaga cuando ya es parte del mundo. El
**cenital es la regla** y el **3D a la altura de la gente es la consecuencia**: se alternan a propósito. Y el
entorno mete el siguiente problema (empieza a llover), no la voz. Detalle en `/historia` §4.
**Ojo con el reloj:** caben nueve pasos en 45 s porque van a 203 palabras/min. A nuestras 145 la cadena no cabe.

## El contador, para historias cuyo tema ES un número (JP, 20 nov 2026)
Del mismo short ("¿cuántas veces hay que doblar un papel para llegar a la Luna?"): dos fichas fijas arriba que nunca
se van y suben con la voz (`DOBLECES 0→30`, `GROSOR 0,1 mm→107 km`) mientras el mundo cambia de escala para que el
número quepa, con el objeto clavado en el mismo punto de la pantalla. Funciona porque el espectador **se queda para
ver hasta dónde llega el número**, no por la historia.
**Solo se usa cuando el tema ES una cantidad que crece o se encoge** (interés compuesto, inflación, el 1% de comisión,
cuánto tardas en contar un billón). En una biografía NO va: ahí lo que falta es la gramática de plano, no un contador.
JP lo dijo así: depende del tipo de video. Reglas y los cuatro temas listos, en `/historia` §4.

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

## La ola solo va entre lugares distintos (20 nov 2026)
La transición `L.tide()` —la ola con espuma— es de marca y está bien para **cambiar de sitio**. Entre dos escenas que
pasan en el MISMO mundo se siente como un parche en medio de una toma. En esas va **`trans: 'cont'`** en la escena que
sigue, y además hay que **encadenar las cámaras**: la posición y el objetivo con que arranca cada escena continuada
son los que tenía la anterior al terminar. Sin eso, quitar la ola deja un corte seco. Y en un plano continuo los
objetos **se encogen** para salir, no desaparecen de golpe.

## Gráficas y portafolios dentro del 3D (19 nov 2026)
`L.plaque(ancho, alto, dibuja, pw)` da un plano con una textura de canvas: con eso se dibujan **gráficas de línea de
verdad** dentro de la escena, que es lo que JP pidió para la escena de la bolsa. El helper `grafica()` de la historia
de Kahneman es reutilizable: mete el plano en un grupo anclado a la IZQUIERDA, así que **escalando el grupo en x la
línea se va trazando** de izquierda a derecha mientras habla la voz.
Un portafolio en pantalla (teléfono, monitor) va **por sectores, nunca con nombres de empresas reales**: un portafolio
con tickers reales se lee como que estamos diciendo qué comprar, y eso está prohibido.

## La miniatura la hace el render, no se saca del MP4 (20 nov 2026)
Hasta hoy las historias 3D se subían sin miniatura propia y YouTube elegía un fotograma al azar. Ahora
`render3d.js` saca **`miniatura.jpg` a 1080x1920 solo, al terminar el render**, volviendo a dibujar el cuadro del
gancho en el motor (no extrayéndolo del MP4 ya comprimido, que llega lavado). Dos detalles que importan:
- **Va sin la píldora del subtítulo.** El subtítulo del momento sale cortado a media frase ("dos psicólogos
  publicaron un") y en una miniatura se lee como un error. Lo apaga `window.SIN_SUBS` en `lib.js`.
- **El cuadro por defecto es el del gancho**, `min(2.2 s, fin de la escena 1 − 0.4)`: ya entró el rótulo completo y
  los personajes están en cuadro. Para elegir otro: `node engine3d/render3d.js <carpeta> --mini <segundos> --hq`.
Shorts y largos ya la tenían con `scripts/render.js <carpeta> --thumb` (1280x720, lámina diseñada con `renderThumb()`);
esa sigue igual y se corre aparte.

---

# 4. Audio: voz, aire y música

## Regla del aire (JP, 14 nov 2026 — oyó demasiadas pausas en el short de Nubank)
El cambio de pantalla **absorbe** la pausa del punto final, no se le suma: antes se encadenaban 0.6 s + 0.6 s y quedaba 1.2 s de
silencio entre TODAS las escenas (13 s muertos en un short de 88). Ahora el hueco es el mayor de los dos (`no_voice.py`), y la cola
después de la última palabra es de 1.4 s, no 2.2 (`build_timeline.py` → `TAIL`). Si un video se pasa de formato, lo primero que se
revisa es el aire, no el guion.

## Regla de la mezcla (JP, 19 nov 2026)
**La música va al 60% del nivel de la voz, medido, no a ojo.** Estaba en 8% y JP casi no la oía. Lo controla
`make_audio.py --musica N`, y la mezcla imprime el balance real en dB durante los tramos hablados: para las historias
3D, `--musica 2.50` da el 60%. El ducking de la historia es más suave que el de un short, para que la partitura no
desaparezca bajo la voz. Verifica siempre después de mezclar: pico por debajo de −0.5 dBFS y ninguna palabra con el
audio tapado.

## La partitura se ancla al FINAL, no a la escena 7 (JP, 20 nov 2026)
`music3d.py` se escribió para historias de 8 escenas y colgaba su acorde de cierre en `S(7)`. En la historia de
Kahneman, que acabó con 10 escenas, eso dejó **16 segundos de un órgano sostenido** después de que la música ya había
terminado: JP lo describió como "aturde". Ahora el arco se cuenta **desde el final** (`S(N-3)`, `S(N-2)`, `S(N-1)`) y
el acorde de cierre entra en `max(S(N-1), DUR - 5.5)`, así que dura ~5.5 s con cualquier número de escenas (con 8 da
exactamente lo mismo que antes). **Al cambiar el número de escenas, revisa el balance de la mezcla otra vez**: con la
partitura más densa al final, el mismo `--musica` subió del 61% al 71%.
Cómo se verifica sin oír: mide los ataques de piano por segundo en los últimos 20 s (`music3d.score(...)`, picos por
encima de 2.5× la media del segundo). Si los últimos segundos marcan "solo órgano", el cierre está colgado.

## Regla de la toma única (JP, 17 nov 2026)
**La voz de IA se genera en UNA sola llamada, nunca por piezas.** Cada envío tiene su propia entonación y energía, así
que en los cortes se oye un cambio de voz; JP lo notó en el largo de Apple, justo donde terminaba cada pieza. El límite
de un envío son **5,000 caracteres**: si el guion no cabe, se recorta el guion, no se parte el audio. Ojo: `tts_prep.py`
parte en piezas para el flujo viejo; usa su texto concatenado con `\n\n` y mándalo completo. Y borra `voice_raw.mp3`
antes de reprocesar: `process_voice.py` lo reutiliza si existe y ignora las piezas nuevas.

## Regla de la voz de IA en historias 3D (19 nov 2026)
Una historia 3D con voz de IA **no usa `pace3d.py`** (que estima por sílabas para la voz de JP). Usa `scripts/voz3d.py`,
que sincroniza escenas y subtítulos con los tiempos reales de `build/whisper.json`. El flujo completo:
1. Sacar los `cap:` de story.js y convertir números a palabras **conservando la puntuación** (`¿ ? , .`): `spoken()` sola
   se come los signos y la voz pierde la entonación de pregunta. `voz3d.py` documenta el convertidor.
2. **Una sola llamada** a `vidiq_voiceover_generate` (regla de la toma única) → `audio/voice_raw.mp3`.
3. `storyboard.json` con `{"format":"long"}` en la carpeta, para que `process_voice.py` deje el ritmo natural
   (tempo 1.0, pausas amplias) en vez del recorte agresivo de short. Sin eso, la historia sale acelerada.
4. `voz3d.py <carpeta> --aire 0.7` — Francisco lee a ~162 palabras/min, demasiado rápido para una historia: `--aire`
   mete silencio **entre escenas, nunca dentro de una frase**, y deja ~145 palabras/min.
   Tres cosas que costaron varias vueltas y por eso están como están (19–20 nov 2026):
   - Los límites entre escenas salen de la **alineación con difflib**, no de contar palabras por escena. Whisper no
     parte igual que el guion (oye "Amostversky", escribe "1979" donde el guion dice el año en palabras), así que
     contar desplazaba los cortes a media frase y el silencio caía dentro de una palabra.
   - El corte se **pega al punto más callado de la onda** cerca del límite: los tiempos de whisper son aproximados y
     la cola de la última palabra suele seguir sonando después de su t1.
   - Si no hay ningún punto callado cerca, ese corte **se salta**. Mejor una escena sin aire que una palabra partida.
   Al final `voz3d.py` verifica que toda palabra **anclada** tenga audio donde dice tenerlo y truena si no. Solo las
   ancladas: las interpoladas no tienen tiempo real contra el cual comparar y daban falsas alarmas.
5. `make_audio.py` → `render3d.js`.
**Pendiente de calibrar con el oído de JP (20 nov 2026):** JP trajo tres shorts de referencia que le gustan y los tres
van mucho más rápido que nosotros — **190, 177 y 197 palabras/min** — y el de 197 no es un arranque: son 150 palabras en 46 s del video
completo, el de las 206 mil likes —, contra las **145**
que deja `--aire 0.7`. Tres de tres ya es un patrón, no una muestra. El `0.7` lo elegí yo por criterio propio y la
evidencia dice que me quedé corto. **No lo cambio sin que JP oiga las versiones**, porque es su canal y su oído; y
probarlo es gratis: `--aire` se aplica sobre `voice.wav`, que sale de `voice_raw.mp3`, que ya está pagado.
Ojo: `--aire` se aplica una sola vez sobre `voice.wav`; para repetirlo hay que volver a correr `process_voice.py`.

## Cambiar solo el audio no exige volver a renderizar (20 nov 2026)
Si el arreglo es de mezcla —nivel de música, aire, partitura— el video no cambia. Se rehace `make_audio.py` y se
sustituye la pista con `ffmpeg -i video.mp4 -i audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k
-shortest salida.mp4`. El flujo de video se copia tal cual, así que son segundos en vez de los ~35 min de un render.

---

# 5. Producción: calendario, aprobaciones y créditos

## Regla del borrador anticipado (JP, 19 nov 2026)
**Todo lo atemporal se trabaja en borrador días antes, no el día de publicarlo.** Los largos, las historias 3D y los
rankings no dependen del cierre de la bolsa, así que no hay ninguna razón para empezarlos el mismo día. Lo que se
adelanta: **el guion, el storyboard y capturas de cómo se vería**, y se le mandan a JP para que corrija con calma.
Lo que NO se adelanta: generar la voz y renderizar — eso se ejecuta el día que toca, ya con todo aprobado y corregido.
Así el día de publicar es solo ejecución, no diseño.
- **Largo del domingo:** borrador desde el lunes anterior (guion + visuales + fuentes verificadas).
- **Historia 3D:** borrador en cuanto se sepa el tema (sale del largo de ese domingo).
- **Ranking / torneo:** la mecánica y las empresas, en borrador; solo las cifras de mercado esperan al cierre.
- **Shorts de contexto y Análisis + Potencial:** la empresa, el ángulo y el guion se adelantan con las cifras
  pendientes; al cerrar la bolsa se rellenan los números y se revisa que el ángulo siga siendo cierto.
Cuando una pieza atemporal se produce el mismo día, se pierde la vuelta de correcciones de JP, que es justo donde
estos videos mejoran. La de Kahneman necesitó cinco vueltas de encuadre y tres de guion.

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

## El ranking del domingo es un TORNEO (JP, 14 nov 2026, estrena el 22 nov)
Las empresas compiten en 5 rondas (ventas, utilidad de operación, margen, ROE y PEG), con puntos 5-4-3-2-1, minigráfica
de evolución en las dos primeras y tabla final con una ganadora. El título promete un resultado; "5 empresas que estamos
vigilando" no dice nada. Plan de acción completo en `plan/torneo.md`; reglas en `/short` §1d.

---

# 6. El proyecto: estructura y reglas base

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
