---
name: publicacion
description: Crea una publicación de YouTube (pestaña Publicaciones) de 3–4 imágenes cuadradas que cuenta UNA noticia del día del mercado, en el estilo Costa Studio Finance, con el personaje 3D de JP recortado en la primera y la última imagen, más el texto y una encuesta para copiar. Úsala cuando digan "/publicacion", "haz la publicación de hoy", "post de la noticia", o cuando la tarea programada de lunes, miércoles y viernes lo pida.
---

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
- `poll`: la encuesta va como publicación aparte (YouTube no mezcla imágenes y encuesta en la misma publicación). Es opcional; úsala 1 vez por semana.

**Calidad de las imágenes:** aplica la regla de `/short` §2b ("Calidad de las imágenes"): nítidas (≥ 1600 px), limpias, con el sujeto solo y sin ruido de fondo.

## 2. Generar y revisar
```bash
node scripts/make_post.js videos/$ID        # → videos/$ID/post/01.png … + post/publicacion.md
```
Mira TODAS las imágenes: que nada se encime, que JP no tape texto, que el tema se reconozca y que los créditos de las fotos estén.

## 3. Entregar
1. Envía las imágenes con SendUserFile (todas juntas, en orden).
2. **Siempre** pega en el mensaje, en un bloque para copiar, la **DESCRIPCIÓN de la publicación** (es lo único que pide YouTube además de las
   imágenes: el campo `text`; no lleva título). Debe tener sentido por sí sola: qué pasó, la fecha, la pregunta y 2–3 hashtags. Si hay encuesta, pégala aparte.
3. Agrega la publicación a `plan/publicados.md` (tabla "Publicaciones") y haz commit + push a `costa-studio-finance`.
4. Recuérdale: "Publícala hoy alrededor de las 17:00 desde YouTube → Crear → Crear publicación → Imagen".
