---
name: publicacion
description: Crea una publicación de YouTube (pestaña Publicaciones) de 3–4 imágenes cuadradas que cuenta UNA noticia del día del mercado, en el estilo Costa Studio Finance, con el personaje 3D de JP recortado en la primera y la última imagen, más el texto y una encuesta para copiar. Úsala cuando digan "/publicacion", "haz la publicación de hoy", "post de la noticia", o cuando la tarea programada de lunes, miércoles y viernes lo pida.
---
> # ⚠️ LEE ESTO PRIMERO: `finance-videos/plan/anatomia-formatos.md`
> Ahí está **qué debe llevar** cada pieza. Este skill es **cómo** se hace.
>
> **La lámina 1 es el gancho** y pasa el mismo filtro de 3 segundos que un short: algo conocido + una contradicción o
> una cifra con escala. Lleva el logo.
> **Nunca "hoy" ni "ayer":** las fechas van explícitas ("el martes", "el miércoles 18"), porque JP puede subirla al día
> siguiente y entonces "hoy bajó 2.89%" ya es falso (pasó el 19 nov 2026).
> **Máximo 3 viñetas por lámina** o se desbordan.
> **Noticias:** fuente primaria + al menos dos fuentes independientes del mismo día, las tres citadas. **Un número que
> no se puede verificar no se publica.** Comprueba la fecha en hora de México, no la del contenedor (corre en UTC).
> **Conflicto de interés:** cualquier relación entre quien escribe y la empresa analizada se declara.
> **Antes de renderizar: capturas a JP.**


> ## Lo aprendido el 15 nov 2026 (publicación del primer torneo)
> - **Las láminas no son párrafos.** Si una lámina es una lista de viñetas con cifras, conviértela en gráfica: el tipo
>   `rondas` dibuja logo · barra proporcional · valor · puntos, igual que el video. JP: "es mucho texto, le falta la parte visual".
> - **No repitas el nombre si ya está el logo.** En las filas va solo el logo; poner "Spotify" junto a su logo amontona
>   y obliga a encoger la barra. **Matiz (16 nov 2026):** eso vale con marcas que cualquiera reconoce (Amazon, Google,
>   Spotify). Con logos que no se identifican solos — el óvalo rojo de Oracle, el círculo de Palantir — el nombre vuelve:
>   `"show_names": true` en la lámina. La prueba es si tú reconoces la empresa tapando el texto.
> - **Siempre una lámina de conclusión al final**, con el remate del video. Antes terminaba en la pregunta y se sentía cortada.
> - **De 3–4 láminas se puede pasar a 6** si el tema lo pide (JP lo autorizó). Ojo: YouTube suele limitar el carrusel a 5;
>   si no deja subir todas, se quita la lámina menos esencial y se dice en `youtube.md`.
> - **Los logos de la portada van en bloque 3 + 2 debajo del subtítulo**, no en fila y no encima del texto.
> - Cada lámina se revisa contra el personaje 3D: es lo que más se encima (`host_size` baja a 200–250 cuando hay texto largo).
> **Voz de JP (obligatorio):** antes de escribir, lee `finance-videos/plan/voz-jp.md`. El texto no debe sonar a IA.

# /publicacion — la noticia del día en 3–4 imágenes (Costa Studio Finance)

**Para qué sirve este formato (plan del 11 nov 2026, `plan/PLAN.md` §2b):** las publicaciones son lo TEMPORAL del canal. Cuentan qué pasó
hoy y abren conversación con quien ya sigue a JP. Aquí sí va la fecha y el "hoy" (los shorts ya no: son de contexto y duran meses).
Ritmo: **3 por semana: lunes y miércoles (la noticia del día, después del cierre)** + **el ranking del domingo** (`/short` §1d: portada, puestos 5–4,
puestos 3–2 y el #1 con la pregunta; ese no lleva "hoy", es el mismo ranking del short del domingo). JP las publica a mano; nunca publiques nada tú.

## 0. Preparar
```bash
cd finance-videos && bash scripts/setup.sh && python3 scripts/market_close.py --wait   # Regla del cierre: datos finales del día
```
Lee `plan/publicados.md`. Si hoy ya hay un short en `videos/<hoy>-<TICKER>/`, **haz la publicación sobre la noticia del día de ese mismo
tema** y reutiliza su carpeta (datos, fotos y logo ya verificados). Si no, elige la noticia más relevante de la sesión (mismos criterios del
short reactivo, `plan/PLAN.md` §2), crea `videos/<hoy>-<TICKER>/`, corre `fetch_data.py` y baja 2–3 fotos reales + logo con `fetch_images.py`
(reglas de `/short` §2b: licencias libres, mira cada imagen, nunca IA de marcas o personas reales).

### Antes del gancho: busca los titulares (JP, 20 nov 2026)
**Obligatorio en toda pieza sobre una noticia, ANTES de escribir la primera frase.** Busca en español y en inglés
(El Financiero y CNN en Español pesan más para nuestro público que CNBC). Anota tres listas:
- **Lo que dijeron TODOS** → con eso se ABRE. Si el espectador no reconoce la historia en 3 segundos, desliza.
- **Lo que dijo CASI NADIE** → ese es el cuerpo y la razón para quedarse.
- **Las cifras en las que los medios NO coinciden** → alerta roja: se verifican con fuente primaria o se omiten.
**La fórmula: lo que ya oyeron + el giro que no.** Y si engancha con algo que el canal ya publicó, mejor.
Los titulares eligen el ÁNGULO; los números siguen saliendo de la fuente primaria. Un titular nunca es la fuente de
una cifra.

## 1. Escribir `videos/$ID/post.json` (3 o 4 imágenes; nunca más, nunca menos)
Cada publicación cuenta UNA cosa, en este orden: **qué pasó → por qué → el dato o la gráfica → pregunta a la audiencia.**
```json
{
 "title": "Take-Two sube 8.3% por las preventas de GTA VI",
 "logo": "images/logo.png",
 "host": {"outfit": "hoodie"},
 "sources": "Take-Two (SEC) · Yahoo Finance",
 "slides": [
  {"type": "portada", "image": "images/producto.jpg", "focus": [0.5, 0.3], "kicker": "10 nov · Take-Two (TTWO)", "title": "La dueña de GTA subió 8.3% hoy", "sub": "Y eso que ayer reportó pérdidas.", "host": {"act": "logo", "mood": "up"}, "credit": "Foto: autor · licencia · fuente"},
  {"type": "dato", "kicker": "Lo que reportó", "title": "Vendió menos y perdió dinero", "bullets": ["…", "…", "…"]},
  {"type": "grafica", "kicker": "12 meses", "title": "De $258 a $225", "sub": "…", "note": "Cierre del 10 nov: $224.64"},
  {"type": "pregunta", "image": "images/otra.jpg", "kicker": "Tu turno", "question": "¿…?", "cta": "Te leo en los comentarios 👇", "host": {"act": "cierre"}}
 ],
 "text": "Texto de la publicación (3–5 líneas, con la fecha, la pregunta y 2–3 hashtags). Termina con: Contenido educativo. No es asesoría financiera.",
 "poll": {"question": "…", "options": ["…", "…", "…"]}
}
```
- Tipos: `portada` (foto del tema a todo el fondo + título), `dato` (`big` para una cifra gigante con `tone` up/down, `text`, `bullets`),
  `grafica` (usa `series` de `data.json`; `days` para acotar), `pregunta` (`question`, `options` opcionales, `cta`).
- **JP en 3D solo en la primera y la última imagen** (`"host"`), recortado y chico, interactuando con el logo o el texto. Actos y vestuario:
  los de `/short` §2c. Si la noticia es de una persona famosa, usa `"who"` (§2c) en lugar de JP.
- **La foto del tema va a todo el fondo** en la portada y en la pregunta; usa fotos distintas o distinto `focus`.
- Títulos cortos (≤ 8 palabras), una idea por imagen, cifras exactas y verificadas con fuente primaria. Nunca recomendación de compra/venta.
- **Cifras, igual que en los videos (`/short` §1e):** acompaña el monto con su porcentaje cuando ayude a dimensionarlo, escribe los negativos
  **entre paréntesis y sin signo** —`($709 M)`, no `−$709 M`— y los positivos limpios. Si la publicación desglosa un estado de resultados,
  usa el mismo orden: ingresos → lo que sale → lo que queda.
- `poll`: la encuesta va como publicación aparte (YouTube no mezcla imágenes y encuesta en la misma publicación). Es opcional; úsala 1 vez por semana.

**Calidad de las imágenes:** aplica la regla de `/short` §2b ("Calidad de las imágenes"): nítidas (≥ 1600 px), limpias, con el sujeto solo y sin ruido de fondo.

## 2. Generar y revisar
```bash
node scripts/make_post.js videos/$ID        # → videos/$ID/post/01.png … + post/publicacion.md
```
Mira TODAS las imágenes: que nada se encime, que JP no tape texto, que el tema se reconozca y que los créditos de las fotos estén.

### Gráficas con personaje y una sola paleta (JP, 20 nov 2026 — vale para todos los formatos)
- **Ventas / algo que crece → el personaje SUBE escaleras**, un escalón por periodo (el estilo de Steve Jobs).
- **Una curva con movimiento → el personaje va EN UN CARRITO** sobre la línea (el estilo de SpaceX).
- **Comparar dos cantidades → columnas VERTICALES con eje X y eje Y visibles**, no barras horizontales.
- **Una gráfica donde solo se mueve la línea está prohibida.**
- **Un video entero lleva UNA paleta.** Los mundos cambian de luz y de valor, no de familia de color: naranja
  profundo → naranja medio → naranja claro, nunca naranja → beige → blanco. Mira la hoja de QA entrecerrando los
  ojos: si un cuadro parece de otro video, está mal.
- **Máximo 6–8 efectos de sonido en toda la pieza**, ninguno repetido seguido, y la "ola" solo al cambiar de mundo.

## 3. Entregar
1. Envía las imágenes con SendUserFile (todas juntas, en orden).
2. **Siempre** pega en el mensaje, en un bloque para copiar, la **DESCRIPCIÓN de la publicación** (es lo único que pide YouTube además de las
   imágenes: el campo `text`; no lleva título). Debe tener sentido por sí sola: qué pasó, la fecha, la pregunta y 2–3 hashtags. Si hay encuesta, pégala aparte.
3. Agrega la publicación a `plan/publicados.md` (tabla "Publicaciones") y haz commit + push a la rama de trabajo de la sesión (`git branch --show-current`).
4. Recuérdale: "Publícala hoy alrededor de las 17:00 desde YouTube → Crear → Crear publicación → Imagen".
