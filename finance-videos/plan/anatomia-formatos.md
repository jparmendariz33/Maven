# Anatomía de cada formato · qué DEBE llevar cada pieza
**Pedido por JP el 20 nov 2026.** Este archivo es la referencia única de qué compone cada formato. Los skills
(`/historia`, `/short`, `/largo`, `/publicacion`) ejecutan el procedimiento; `CLAUDE.md` explica el porqué de cada
regla; **aquí está la lista de lo que no puede faltar.** Si algo de aquí no está en la pieza, la pieza no se entrega.

Cada punto marcado con 📊 está respaldado por datos del canal (medición del 20 nov 2026 vía vidIQ).

---

## 🎬 HISTORIA 3D (vertical · 60–90 s · martes y jueves 12:00)

### Los primeros 3 segundos — el gancho: TRES CAPAS A LA VEZ
📊 *SpaceX retuvo al 86.5% y Nubank al 5.9% con la misma cantidad de impresiones del feed (1,164 vs 1,158). El gancho
es la única variable que explica esa diferencia.*

El gancho **no es solo el texto**. Son tres cosas que tienen que llegar juntas desde el cuadro 1 (JP, 20 nov 2026):

**1. Qué se dice y cómo se dice — la narración.**
- **La primera frase hablada ES la frase del gancho.** No hay frase de entrada, ni respiración previa, ni rampa.
  La voz arranca antes de 0.1 s diciendo lo que importa.
- **La cifra o la contradicción cae en las primeras 8 palabras.** Si llega en la segunda frase, llega tarde.
- **Frase corta de golpe, luego una larga que explica.** El monótono viene de frases iguales.
- Con voz de IA: registro limpio, sin muletillas, y la prosodia hace el trabajo. Un `…` para respirar **después**
  del dato, nunca antes.

**2. Lo que se ve — el texto en pantalla.**
- Frase escrita **desde el cuadro 1**, grande. Tiene que entenderse **aunque el espectador vea en silencio**
  (muchos lo hacen) — lo cual **no significa que el video vaya mudo**: significa que el texto se basta solo.
- Dice **lo mismo que la voz, al mismo tiempo**.

**3. Lo que se oye de fondo — la música.**
- 📊 *Hasta el 20 nov la partitura entraba al 15% de su máximo y crecía: el gancho era la parte con MENOS música de
  todo el video, justo donde se decide si el espectador se queda. Corregido: ahora entra al 36% y se asienta para
  dejar sitio al crescendo.*
- **La música entra desde el cuadro 1**, con cuerpo, y se asienta en cuanto empieza el desarrollo.
- El fundido de entrada es de 0.18 s, no de 0.4: casi medio segundo de silencio al arranque es medio segundo perdido.

**El contenido del gancho, en cualquiera de las tres capas:**
- Nombra **algo que el espectador ya conoce** (Apple, SpaceX, un personaje famoso). Si el tema es desconocido, el
  gancho se ancla a algo que sí lo sea.
- Abre con **una contradicción** ("casi quiebra… y luego la IPO más grande") **o una cifra con escala**
  ("de cada $100, $28 son ganancia"). Una idea completa, no el principio de una.
- **Prohibido:** presentar el tema ("En 1979, dos psicólogos publicaron…"), anunciar el formato ("RANKEANDO 5
  acciones: 6 rondas"), o abrir con una empresa que nadie ubica.
- **Meta: ≥49%** de stayed-to-watch (promedio del canal). **Objetivo: 70%.**

### El cuerpo — 8 a 10 escenas
- **Cada escena cambia de mundo o de situación.** Dos escenas seguidas en el mismo sitio y con la misma acción se
  sienten como una sola escena larga.
- **En cada escena pasa algo**, no solo se mueve la cámara:
  - el personaje **actúa**: camina, gira, voltea a ver lo que importa, señala, se encoge de hombros, se le caen
    los hombros. No basta con que hable.
  - **un objeto cambia de estado por una causa**: caen monedas y por eso se hunde la balanza; las cartas entran
    deslizándose; la que gana se va volando; la medalla baja.
- **Los rótulos del mundo 3D aparecen cuando se dicen**, no están puestos desde el cuadro uno.
- **Transiciones:** la ola (`tide`) solo entre **mundos distintos**. Entre escenas del mismo lugar va `trans: 'cont'`
  con las cámaras encadenadas (cada escena arranca donde terminó la anterior) y los objetos se encogen para salir.

### El cierre — dos escenas
- **Si es la historia puente** (jueves): penúltima escena con el **pizarrón de aviso** del largo del domingo
  ("ESTE DOMINGO 10:00" + el título, DOMINGO subrayado a mano).
- **Siempre, la última:** la **pregunta de cierre**, en serif itálica centrada, con la línea *"Desde la costa, todo
  se ve con claridad."* y el aviso legal.

### Texto y datos
- Se entiende **sin saber de finanzas**: si una frase pide deducir algo, está mal. Nada de palabras cultas
  ("póstumo") ni metáforas que haya que descifrar ("una calculadora en la cabeza").
- **La imagen dice lo mismo que la frase, al mismo tiempo.** Si hay que explicar la escena, la escena está mal.
- Todo dato con fuente verificada; nunca recomendación de compra o venta.
- Caricaturas editoriales, nunca retratos ni logotipos reales; solo hechos públicos de la vida profesional.

### Voz y sonido
- **Una sola toma** de vidIQ (Francisco), registro limpio y profesional, lo humano por prosodia, **nunca muletillas**.
- Texto hablado **por debajo de 1,000 caracteres** = 1 bloque = 28 créditos.
- `voz3d.py --aire 0.7` para sincronizar; **música al 60% del nivel de la voz**, medido en dB.

### Entrega
- **Miniatura propia** con el frame del gancho (hoy YouTube escoge frames de en medio).
- Hoja de QA + cuadros de acción **a JP y su OK ANTES** de generar voz y renderizar.
- Barrido del MP4 terminado, un cuadro cada 3 s.
- `youtube.md` con título, descripción, comentario fijado, video relacionado y tabla de verificación de fuentes.

---

## 📈 SHORT (vertical · 60–85 s · viernes contexto, sábado Análisis+Potencial, domingo torneo)

### Los primeros 3 segundos
- Mismo filtro que la historia, **más el logo o la foto de la empresa**: el gancho tiene que decir de quién habla.
- 📊 *El torneo sacó 19.8% abriendo con "RANKEANDO 5 acciones: 6 rondas". El formato no es un gancho: el resultado sí
  ("gana Alphabet, 25 de 30").*

### El cuerpo
- Una idea por pantalla. Números con su rótulo: ningún número sin decir qué es.
- Distinguir siempre **utilidad de operación** de **utilidad neta**.
- Cascadas con **montos reales**, nunca normalizadas a $100.
- Logos oficiales; varios logos en bloque 3+2, nunca en fila.
- JP en 3D solo en el gancho y el cierre.
- **Short de contexto:** sin "hoy" ni fecha; el ángulo dura meses.

### El cierre
- Pregunta al espectador + CTA.
- En rankings, la última frase es **un principio general, nunca un veredicto sobre una acción**.
- Si JP tiene posición, el chip "En lo personal tengo posición" en la ronda de esa empresa.

---

## 🎥 LARGO (16:9 · 6–7 min · domingo 10:00)

### Los primeros 15 segundos, con la promesa en los primeros 5
📊 *La búsqueda es el mejor tráfico del canal: 68.4% de retención y 61 s de duración promedio. Los largos son la
apuesta por búsqueda.*
- El gancho puede durar hasta 15 s, pero **en los primeros 5 ya se dijo qué va a aprender el espectador**.
- El tema y el título se eligen con **`keyword_research` de vidIQ**, no por intuición.

### El cuerpo
- Estructura: gancho → la promesa en una línea → presentación de JP (una frase) → 3–4 capítulos → cierre.
- Cada capítulo abre con su propia mini-promesa.
- Datos verificados con fuente primaria; los visuales explican, no decoran.

### El cierre
- Pregunta + CTA al siguiente video de la serie.
- **La historia 3D del jueves anterior ya lo anunció en pantalla**, así que el largo no es negociable.

---

## 📌 PUBLICACIÓN (3–5 imágenes · lunes, miércoles y domingo)

- **Lámina 1 = el gancho.** El título de la primera lámina pasa el mismo filtro de 3 segundos. Lleva el logo.
- **Fechas explícitas, nunca "hoy" ni "ayer"**: tiene que seguir siendo cierta el día que se suba.
- Bullets cortos: **máximo 3 por lámina** o se desbordan.
- Última lámina: la idea general + pregunta + CTA.
- **Noticias:** fuente primaria (SEC, reporte, bolsa) + **al menos dos fuentes independientes del mismo día**, las tres citadas.
- **Un número que no se puede verificar no se publica.**
- Portafolios por sector, nunca con nombres de empresas reales.

---

## ✅ Checklist de entrega (los 4 formatos)
1. ¿Los primeros 3 s pasan el filtro del gancho? ¿Se entiende sin sonido?
2. ¿Hay pregunta de cierre?
3. ¿Ningún rótulo desbordado? ¿Ningún número sin decir qué es?
4. ¿Todas las fuentes verificadas y citadas? ¿Fechas explícitas?
5. ¿Capturas enviadas a JP y aprobadas ANTES de gastar voz y render?
6. ¿Miniatura propia?
7. ¿Barrido del MP4 completo sin defectos?
8. ¿Registrado en `publicados.md` y en el banco que corresponda?
