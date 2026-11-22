# 🎬 finance-videos — Costa Studio Finance

Fábrica de video del canal de finanzas de **Costa Studio** (@jparmendariz). Todo se genera con código: no hay editor de video.

> **Fuente de verdad:** `CLAUDE.md` (las reglas, en 6 bloques) + `plan/PLAN.md` (la estrategia) + las skills en
> `../.claude/skills/`. Este README solo dice qué hay y cómo se pide; las reglas están allá.

## Los cuatro formatos

| Skill | Qué es | Cuándo se publica | Motor |
|---|---|---|---|
| **`/largo`** | Video largo 16:9, 6–7 min, educativo | **domingo 10:00** | `engine/long.js` |
| **`/historia`** | Historia 3D vertical, 75–90 s, maqueta de plastilina animada | **martes y jueves 12:00** (la del jueves anuncia el largo) | `engine3d/` (Three.js) |
| **`/short`** | Short vertical: contexto (viernes 19:00), Análisis + Potencial (sábado 19:00) o ranking/torneo (domingo 19:00) | ver tabla | `engine/engine.js` |
| **`/publicacion`** | 3–5 imágenes cuadradas con la noticia del día, pestaña Publicaciones | **lunes, miércoles y domingo** | `scripts/make_post.js` |

Calendario completo y el porqué de cada día: `CLAUDE.md` ("Ritmo"). Instrucciones de las tareas programadas: `plan/tareas.md`.

## Cómo se pide un video

Abre una sesión de Claude Code (claude.ai/code o la app) sobre el repo **Maven** y escribe la skill:

```
/short AAPL          /historia                /largo                /publicacion
```

Claude investiga, escribe el guion y **te manda capturas de las escenas para que apruebes antes de gastar voz o
renderizar** (regla de la aprobación visual). Con tu OK genera la voz, sincroniza, revisa y entrega el MP4, la
miniatura, el título, la descripción y el primer comentario listos para copiar.

## Estructura

```
assets/brand/      marca: colores, tipografías, logo como máscara
engine/            motor Canvas 1080x1920 y 1920x1080 (shorts, largos, publicaciones)
engine3d/          motor Three.js: lib.js + cine.js (luz de cine, actores articulados), JP en 3D
scripts/           el pipeline: datos → guion → voz → sincronía → render → QC
plan/              estrategia, calendario de 55 semanas, bancos de ideas, métricas, revisiones
videos/<fecha>-<ID>/   una carpeta por short, historia o publicación
largos/<domingo>/      una carpeta por video largo
canal/             banner, foto de perfil y configuración del canal
```

Un solo MP4 por pieza en el repo (sin renders de prueba). `build/`, `images/_cand/` y los `.wav` no se versionan.

## Rama

El tronco es **`main`**. Cada sesión de Claude en la nube trabaja en su propia rama `claude/<algo>` y pushea ahí; a
`main` se junta con el OK de JP. *(La vieja `costa-studio-finance` ya no existe: corregido el 22 nov 2026.)*

## Costos

Costo cero por defecto: el modo sin voz (`scripts/no_voice.py`) arma el teleprompter y JP graba su voz encima. La voz
de IA (vidIQ, plan Boost: 2,000 créditos al mes, se renuevan el 17) cuesta **28 créditos por cada 1,000 caracteres** y
se genera **en una sola toma**, nunca por piezas.

No es asesoría financiera. Nunca recomendaciones de compra/venta ni precios objetivo.
