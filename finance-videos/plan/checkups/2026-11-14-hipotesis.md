# Hipótesis registrada ANTES de ver los datos · 14 nov 2026

JP decidió el 14 de noviembre **no cambiar nada durante una o dos semanas** y tomar la decisión con evidencia
sistemática. Este documento escribe la predicción **hoy**, antes de tener los datos, para que al revisarlos no se
pueda acomodar el relato al resultado. Es la diferencia entre evidencia y anécdota.

## La pregunta
¿Un short más largo gana más tiempo visto, o solo diluye el porcentaje de retención?

## Las dos hipótesis
- **H1 (la que sugieren los datos del 14 nov):** los segundos vistos los topa la atención del espectador, no la
  duración del video. La gente ve ~39 s y se va. Alargar no gana tiempo visto; solo baja el %.
- **H0 (lo que asumimos el 13 nov al planear largos de 6–7 min y shorts de 75–90 s):** más duración da más tiempo
  visto, aunque el porcentaje baje.

## Base de la que partimos (11 shorts, corte del 14 nov 2026)
- Segundos vistos: media **38.9 s**, rango 28–49, desviación 7.1.
- Duración: media 74 s, rango 60–88.
- Correlación duración ↔ segundos vistos: **+0.08**. Duración ↔ % retención: **−0.46**.

## Predicción (escrita el 14 nov, antes de los datos nuevos)
En los shorts publicados entre el 15 y el 28 de noviembre:
1. Los segundos vistos se van a quedar en la banda **30–50 s**, con media entre 34 y 44 s.
2. La correlación duración ↔ segundos vistos se va a quedar **por debajo de +0.30**.
3. Los shorts de más de 80 s van a marcar **menos de 50%** de retención; los de menos de 70 s, **más de 55%**.

## Regla de decisión, fijada de antemano
- **H1 confirmada** si se cumplen 1 y 2 → se recorta el formato a 45–55 s en diciembre.
- **H1 refutada** si la correlación duración ↔ segundos vistos sube **por encima de +0.50** o si la media de
  segundos vistos sube por encima de 50 s → el formato largo se queda y yo me equivoqué.
- **Sin conclusión** si queda entre +0.30 y +0.50, o si hay menos de 6 shorts nuevos: se espera otra ronda.

## El problema de diseño que hay que cuidar
La correlación de hoy sale de que el catálogo **varía de 60 a 88 s por accidente**. Si las dos semanas que vienen
todos los shorts salen de 75 a 90 s, la variación se encoge y **los datos nuevos no van a poder responder la
pregunta**: se va a ver una nube de puntos en la misma duración, que no distingue entre H0 y H1.

No hace falta cambiar la estrategia para evitarlo. Basta con **no forzar la duración en ninguna dirección**: que
cada guion dure lo que el tema pida (unos saldrán de 50 s, otros de 85) y se anote el dato. Eso conserva la
variación sin decidir de antemano quién tiene razón. Forzar todo a 85 s es lo único que sí arruinaría la medición.

## Qué hace falta de JP, el 28 de noviembre
La misma tabla de YouTube Studio: por video, **duración, vistas, % reproducido y duración media**. Con eso:

```bash
python3 scripts/retencion.py plan/datos/2026-11-28.md
```

El script calcula las correlaciones, separa por formato y avisa solo si la variación de duraciones es
demasiado chica para concluir.
