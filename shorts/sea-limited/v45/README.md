# Versión 45 s — con voz en off (IA, masculina)

- Voz: "Daniel – Steady Broadcaster" (vidIQ / ElevenLabs), pausas recortadas con `tighten.py` y acelerada 5%.
- `caps.js` — subtítulos palabra por palabra (tiempos obtenidos con faster-whisper).
- `index.html` — animación sincronizada con la voz (46 s).
- `sfx45.py` — mezcla: voz + música de fondo (con ducking bajo la voz) + SFX → `mix45.wav`.

```bash
python3 sfx45.py voice.wav mix45.wav
node render45.js $PWD/index.html $PWD/mix45.wav $PWD/../SE_short_45s.mp4
```
