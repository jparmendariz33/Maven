# 🎬 Finance Videos — shorts de acciones (estilo Costa Studio)

Ruta del proyecto: **`Maven/finance-videos/`** (repo `jparmendariz33/Maven`).

## Cómo pedir un video
1. Abre una sesión de **Claude Code** (claude.ai/code o la app) sobre el repo **Maven**.
2. Escribe:
   ```
   /short AAPL
   ```
   (o "/short Tesla", "/short NVDA enfócate en los resultados", etc.)
3. Claude junta datos y noticias, escribe el guion y **te lo muestra para que lo apruebes** (antes de gastar créditos de voz).
4. Con tu OK genera la voz, sincroniza, revisa y te entrega el **MP4 (45–60 s, 1080x1920)** + título, descripción y hashtags.

Cada video queda guardado en `finance-videos/videos/<fecha>-<TICKER>/`.

## Qué incluye cada video
Gancho · qué hace la empresa · precio 12 meses · el movimiento reciente y sus noticias · ingresos y utilidad neta por trimestre ·
P/E · PEG · ROE · próximos resultados · pregunta de cierre. Voz en off (Daniel), subtítulos palabra por palabra, música y efectos.

## Créditos de voz
Se usan los de tu cuenta de **vidIQ** (conectada a Claude): 28 créditos por video (guion < 1,000 caracteres; vidIQ cobra 28 por cada 1,000).
Plan actual: 150 créditos/mes, se renuevan cada día 4. ≈5 videos al mes.

## Estilo
Paleta y tono de costastudio.mx. Tipografías libres (OFL) que sustituyen a PP Neue Machina y Seneca:
Unbounded, Space Grotesk e Instrument Serif.

## 🎞️ Historias 3D (nuevo, experimental)
Videos con historia y personajes de plastilina en 3D (estilo **Costa Diorama**), con los mismos datos verificados y la misma marca.
Ejemplo: `videos/2026-11-09-SPCX-historia/` (SpaceX, ~60 s). Ver `guion.md` de ese folder y la sección "Historias 3D" de `CLAUDE.md`.
