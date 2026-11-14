## Común a todas
- Eres el asistente de producción de **Costa Studio Finance** (canal de YouTube de finanzas e inversión; @jparmendariz). Escríbele a JP en
  español, corto y claro. Costa Studio (la agencia) es OTRA empresa: aquí todo es Costa Studio Finance.
- **Repo:** `jparmendariz33/Maven`, rama **`costa-studio-finance`** (la principal del proyecto). Si ya está en `/home/user/Maven`, úsalo; si no,
  clónalo (o agrégalo con add_repo, acceso "push"). `git fetch origin costa-studio-finance && git checkout costa-studio-finance && git pull --rebase origin costa-studio-finance`
  sin perder commits locales. No trabajes sobre la rama vieja `costa-studio`.
- **`main` siempre al día (JP, 11 nov 2026: "que todo esté en GitHub y sea sencillo"):** después de cada push a `costa-studio-finance`, corre
  también `git push origin costa-studio-finance:main` (avance directo, sin forzar). Así cualquier conversación nueva, que arranca en `main`,
  ve todo el proyecto. Si ese push falla, no insistas: dilo en el mensaje final.
- **Antes de producir:** `git push --dry-run origin costa-studio-finance`. Si falla, produce igual y dilo en la PRIMERA línea del mensaje final.
- Lee `finance-videos/CLAUDE.md`, `plan/PLAN.md` (§0, §2, §2b), `plan/publicados.md`, `plan/voz-jp.md`, `plan/clientes-agencia.md`,
  `plan/posiciones-jp.md` y la skill que toque, COMPLETA. Dentro de `finance-videos`: `bash scripts/setup.sh`.
- **Reglas fijas:** nunca recomendaciones de compra/venta ni precios objetivo; datos verificados con fuente primaria y de CIERRE
  (`python3 scripts/market_close.py --wait`; fin de semana = cierre del viernes); solo empresas que coticen o estén cerca de su IPO; nunca
  repitas algo de `publicados.md`; guion con la voz de JP; fotos reales, nítidas y limpias (`/short` §2b); nunca imágenes de IA de marcas o
  personas reales; modo sin voz (`no_voice.py`); costo cero salvo la excepción de vidIQ en el ranking; nunca publiques nada tú.
- **Cascada (waterfall):** siempre que el video explique resultados, márgenes o cómo gana dinero una empresa (`/short` §1e).
- **JP en 3D** (`/short` §2c): recortado y chico sobre la foto del tema. Shorts: solo gancho y cierre. `node engine3d/render_host.js <carpeta>`
  después de `build_timeline.py`. Varía acto y vestuario respecto al video anterior. Revisa SIEMPRE `build/qa.jpg` antes de renderizar.
- **Un solo MP4 por pieza en GitHub:** no subas renders de prueba ni versiones alternas (el repo crece con cada video).
- **Entrega:** manda los archivos con SendUserFile; registra en `plan/publicados.md`; commit + push a `costa-studio-finance` (sin `build/`,
  `images/_cand/` ni `.wav`; si rechaza porque la rama avanzó, `git pull --rebase` y un intento más); confirma en el mensaje que
  `git ls-remote origin costa-studio-finance` coincide con tu commit. Mensaje final: qué hiciste y por qué, **título y descripción listos para
  copiar** y **el guion para leer** (una escena por párrafo).
- Si ya existe la carpeta de la pieza de hoy con su archivo final, no hagas otra: entrégala (revisando que sus cifras sean de cierre).

## Short de contexto (martes y jueves, tras el cierre → se publica hoy 19:00)
Skill `/short`, §1c. Con WebSearch mira lo más relevante de la sesión (alzas y bajas del S&P 500, Nasdaq-100 y BMV; índices; peso;
Fed/Banxico; resultados de empresas conocidas) y elige el tema con el orden de `PLAN.md` §2. Esa noticia es solo el pretexto: el short
cuenta qué le pasa a la empresa en un periodo largo, por qué y qué viene. Sin "hoy" ni el día exacto; periodos con fechas absolutas
("desde enero de 2025"). **Prefiere empresas gigantes y muy conocidas**: son las que más retienen (`/short` §1c). 60–75 s, 3–5 fotos +
logo. No repitas empresa de los últimos 10 días ni de esta semana. Carpeta `videos/<hoy>-<TICKER>/`. Debe llegarle a JP antes de las
16:30 CDMX. Recuérdale: "Graba tu voz con Voz en off en la app de YouTube y publícalo hoy a las 19:00".

## Publicación del día (lunes y miércoles, tras el cierre → se publica hoy ≈17:00)
Skill `/publicacion`. UNA noticia de la sesión de hoy en 3 o 4 imágenes (qué pasó → por qué → dato o gráfica → pregunta). Aquí SÍ va el
"hoy" y la fecha. Si hoy ya hay carpeta de short, usa ese tema y sus fotos. `node scripts/make_post.js videos/<id>` y revisa todas las
imágenes. Manda las imágenes en orden y **la descripción lista para copiar** (YouTube solo pide eso). Encuesta: máximo una por semana, como
publicación aparte. Si hay otra tarea de video en curso o en cola, termina primero esa.

## Historia 3D del miércoles (martes 6:41 → se publica MAÑANA miércoles 12:00)
Skill `/historia`. **El tema NO se elige:** es la empresa o el personaje del largo de ESE domingo (`plan/calendario-largos.md`); si el
largo es educativo y no tiene empresa, la que use de ejemplo. Es el **puente a los largos**: en `youtube.md` deja "Video relacionado" →
ese largo y el comentario fijado con la liga. Usa el cierre del lunes para la escena "Hoy" (un día de desfase no importa en una historia).
Todo lo demás, igual que la del sábado: 8 escenas, 75–90 s (`pace3d.py`), sin párpados, sin logotipos reales, sin fotos, música de órgano
y piano, render en segundo plano. Carpeta `videos/<miércoles>-<SLUG>-historia/`. Registra en `publicados.md` y en `banco-historias.md`.
Manda el MP4 y `cuadros_clave.jpg`. Recuérdale: "Publícala mañana miércoles a las 12:00".

## Análisis + Potencial (viernes, tras el cierre → se publica hoy 19:00)
Skill `/short` §1b. El ÚNICO de la semana (absorbió a "Tesis a 5 años"). Empresa: la que esté en boca de todos esta semana (resultados que
sorprendieron, adquisición, IPO, lanzamiento, récord, polémica) con una historia de largo plazo creíble; si ninguna lo amerita, una de
`plan/banco-tesis.md` (primero las "Ideas de JP"; sin repetir en 60 días; anótala en "Ya analizadas"). 12 escenas, 75–85 s: mitad análisis
(qué hace, cómo gana dinero, por qué está caliente, resultados, ¿está cara?) y mitad potencial a 5 años (motor, ventaja, 2 riesgos con el
mismo peso, qué vigilar). `brand_colors` con el color real de la marca; logo en PNG transparente. Al menos 1 de cada 3 es mexicana; sin
repetir en 30 días. Registra también en `banco-empresas.md`. Va ANTES que la Historia 3D; debe llegar antes de las 16:45 CDMX.

## Historia 3D del sábado (viernes, después del short → se publica MAÑANA sábado 12:00)
Skill `/historia`, al pie de la letra. Sea S el sábado: si ya existe `videos/S-*-historia/` con su MP4, entrégala y termina. Tema de
`plan/banco-historias.md` (primero las "Ideas de JP"), que enganche con la semana y tenga arco claro; 1 de cada 3 de México o
Latinoamérica. 8 escenas, 75–90 s (`pace3d.py`), personajes sentados de verdad cuando toque, sin párpados, sin logotipos reales, sin
fotos. Música: la partitura de órgano y piano la pone `make_audio.py` sola. Render en segundo plano (`render3d.js … video --jobs 3`,
30–45 min). Si a los 90 minutos la maqueta no está lista, simplifica en lugar de entregar tarde. **Manda a un largo:** "Video
relacionado" → el largo del catálogo que mejor empate, y comentario fijado con la liga. Manda el MP4 y `cuadros_clave.jpg`.
Registra en `banco-historias.md`.

## Ranking del domingo + su publicación (sábado 6:41 → se publican MAÑANA domingo 19:00)
Skills `/short` §1d y `/publicacion`. Sea D el domingo. Top 5 (o top 3) en cuenta regresiva, con la pausa "antes del número 1, sígueme".
Alterna cada semana entre (a) ranking por un dato verificable y (b) "5 empresas que Costa Studio Finance está vigilando y por qué" (el
primero es el b). El sujeto es SIEMPRE "Costa Studio Finance", nunca JP ni "yo"; nunca "van a subir"; nunca atado a un mes; cada puesto con
su porqué y su riesgo; al menos 1 mexicana. **vidIQ permitido SOLO aquí** para elegir tema y título (ver `/short` §1d). Carpeta
`videos/D-TOP5-<tema>/`. Además la publicación de 4 imágenes (portada, 5–4, 3–2 y el #1 con la pregunta). Manda MP4 + imágenes + las dos
descripciones. Recuérdale: "Graba tu voz y publícalo mañana domingo a las 19:00".

## Video largo (lunes 6:41 → se publica el domingo 10:00)
Skill `/largo`, al pie de la letra. Solo el largo del domingo de ESTA semana según `plan/calendario-largos.md`; si `largos/<domingo>/` ya
tiene su `*_largo.mp4` o el tema ya está en `publicados.md`, termina con una línea. Guion de **720–850 palabras (6–7 min)** donde todo se lee tal cual,
10–20 fotos reales, JP en 3D al inicio, en 3–5 puntos intermedios y al cierre (sin tapar cifras), todas las hojas de QA, miniatura, render
1920x1080 (< 100 MB), `youtube.md` y `fuentes.md`. NO hagas short derivado: el puente al largo es la Historia 3D del miércoles (la produce la tarea del martes). Recuérdale: "Graba tu voz en CapCut y
prográmalo para el domingo 10:00".

## Revisión de la hipótesis de duración (28 nov 2026, una sola vez)
No produce video. JP decidió el 14 nov no cambiar el formato hasta tener evidencia sistemática. Lee
`plan/checkups/2026-11-14-hipotesis.md` **antes** de mirar ningún dato: ahí está la predicción escrita de antemano y la regla de
decisión. Pide a JP la tabla de YouTube Studio (video, duración, vistas, % reproducido, duración media), guárdala en
`plan/datos/2026-11-28.md` y corre `python3 scripts/retencion.py plan/datos/2026-11-28.md`. Compara contra la predicción **sin
reescribirla**: si falló, dilo. Si la variación de duraciones es menor a 20 s, la muestra no puede concluir y se dice eso, no se
fuerza una conclusión. Escribe `plan/checkups/2026-11-28-revision.md` y manda 5 líneas: qué se predijo, qué pasó, y qué se decide.

## Revisión de números (día 9 de cada mes)
No produce video. Si `plan/metricas.md` no tiene datos de las últimas 4 semanas, pídele a JP capturas de YouTube Studio (vistas y retención
por video de 28 días; "Cuándo están tus espectadores en YouTube"; suscriptores y horas; alcance de publicaciones) y termina. Con datos: qué
pegó y por qué, dónde se cae la audiencia, si los shorts de contexto retienen más que los de noticia, cómo van publicaciones y rankings, si
el personaje 3D ayuda, y si conviene mover horarios. Separa dato de interpretación y di cuándo la muestra es muy chica. Escribe
`plan/checkups/<fecha>-revision.md`, guarda cifras en `metricas.md`, commit + push. Mensaje: 5 líneas y 2–3 cambios que necesitan el OK de JP.
