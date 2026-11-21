# QC de una pieza 3D · plan de acción
**Pedido por JP el 21 nov 2026**, al terminar el short de Anthropic. Esa pieza necesitó **cinco vueltas y
19 correcciones**, y al revisarlas una por una salió el dato que ordena todo este plan:

> **14 de los 19 defectos eran mecánicos y medibles.** No hacía falta criterio para encontrarlos: hacía falta
> medirlos. Solo 5 necesitaban ojo humano.

De ahí la idea: **lo medible lo revisa un script, y el ojo se reserva para lo que de verdad lo necesita.**

---

## 1. El script: `scripts/qc3d.py`
```
.venv/bin/python scripts/qc3d.py videos/<id>
```
Devuelve **ERROR** (bloquea voz y render) o **aviso** (hay que decidir). Hoy revisa:

| Qué | Por qué está (el defecto real que lo motivó) |
|---|---|
| La capa 2D no está dentro de `update()` | `L.C` es null ahí: el render crasheaba |
| Ancho del cuadro por escena, con la fórmula correcta | mis objetos salían 2 y 3 veces más anchos que el cuadro |
| Dos escenas seguidas con el mismo plano y el mismo mundo | "el corte no se nota" — la corrección de JP del 20 nov |
| Cuántas familias de plano hay en la pieza | "todas las tomas son a la misma altura" |
| Texto que no cabe en su lienzo | "ECONOMETRICA · 1979" perdía letras; "Anthropic" salía "Anthroj" |
| Logos declarados sin archivo | — |
| Número de efectos y repetidos seguidos | "hay muchos sonidos que se repiten" |
| Caracteres, bloques y créditos de la narración | 1,010 caracteres cuestan el doble que 990 |
| Palabras y duración estimada con la voz | — |
| Pico de la mezcla y huecos de silencio | — |
| Nivel de los primeros 3 s | "el gancho era la parte con menos música" |
| Miniatura 1080x1920 | se subían sin miniatura propia |
| Un solo MP4 y que pese menos de 95 MB | el repo crece con cada vuelta |
| Hoja de contacto del MP4 completo | la regla del barrido, del 13 nov |

**Lo que el script NO puede juzgar y por eso va abajo:** si la historia se entiende, si el gancho engancha, si
las cifras son del mismo periodo, si la fuente es primaria y si la imagen dice lo que dice la voz.

---

## 2. Las cuatro puertas
Nada pasa a la siguiente sin cerrar la anterior.

### Puerta 1 · Antes de escribir una sola escena
- [ ] **Titulares buscados**, en español y en inglés: qué dijeron todos, qué dijo casi nadie, en qué no coinciden.
- [ ] **Un motor narrativo elegido, y escrito por qué.** Máximo dos recursos extra.
- [ ] **El gancho, en tres capas** (voz en 0.0 s, texto desde el cuadro 1, música con cuerpo).
- [ ] **Todas las cifras del MISMO periodo.** El error de Anthropic: pérdida de nueve meses con margen trimestral.
- [ ] **Fuente primaria citada como lo que es.** Si es cobertura y no el documento, se dice.
- [ ] **Ningún renglón calculado por resta.** El "otras partidas −8,479" era un residuo inventado.
- [ ] Números simulados marcados `ilustrativo`; números reales, con fuente.
- [ ] Sin recomendación de compra/venta ni precio objetivo. Conflicto de interés declarado si lo hay.

### Puerta 2 · Antes de pedirle las capturas a JP
- [ ] `qc3d.py` **sin errores**, y cada aviso contestado (corregido o justificado).
- [ ] Hoja de QA (`render3d.js --qa`) mirada **entrecerrando los ojos**: ningún cuadro parece de otro video.
- [ ] Cuadros sueltos (`--at`) de cada momento con acción, a tamaño completo.
- [ ] En cada escena **pasa algo**, no solo se mueve la cámara.
- [ ] Las gráficas llevan personaje: escaleras para lo que crece, carrito para una curva, columnas con ejes para comparar.
- [ ] Ninguna persona mira a cámara cuando debería mirar lo que está haciendo.

### Puerta 3 · Antes de gastar créditos de voz
- [ ] **JP dijo que sí, explícitamente.** No se infiere de un "va".
- [ ] El guion no cambió desde que lo aprobó. Si cambió, se vuelve a aprobar: la voz se paga una vez.
- [ ] La narración cae justo debajo de un múltiplo de 1,000 caracteres.
- [ ] Se manda en **una sola llamada**.

### Puerta 4 · Antes de entregar
- [ ] `qc3d.py` otra vez, ya con audio y MP4.
- [ ] **Barrido del MP4 completo** (lo genera el script en `build/barrido.jpg`), no solo la hoja de QA.
- [ ] Ninguna palabra tapada por la música; balance medido en dB.
- [ ] Se borra el MP4 sin voz: **un solo archivo por pieza**.
- [ ] `youtube.md` con título, descripción y la tabla de verificación dato · fuente · resultado.

---

## 3. Los 19 defectos de Anthropic, y quién los habría atrapado
| # | Defecto | Lo atrapa |
|---|---|---|
| 1 | Capa 2D en `update()` → crash | script |
| 2 | Objetos 2–3× más anchos que el cuadro | script |
| 3 | Distancia de primer plano mal (3.7 en vez de 6.0) | script |
| 4 | Plano acostado que no renderiza en cenital | ojo (hoja de QA) |
| 5 | Texto cortado en un lienzo | script |
| 6 | Titular encimado con el 3D | ojo |
| 7 | Pantalla sin brillo propio | ojo |
| 8 | Gráficas anchas y bajas | script (familias de plano) |
| 9 | Barras negativas fuera del cuadro | ojo |
| 10 | 18 efectos de sonido | script |
| 11 | La paleta saltaba a beige y blanco | ojo (entrecerrando) |
| 12 | Cortes que no se notaban | script |
| 13 | El gancho no se entendía | **criterio** |
| 14 | Cifras de periodos distintos | **criterio** |
| 15 | Un renglón inventado por resta | **criterio** |
| 16 | Cifras de fuente secundaria sin verificar | **criterio** |
| 17 | Personaje mirando a cámara en vez de a la acción | ojo |
| 18 | Subtítulo quemado en la miniatura | script |
| 19 | El dato envejeció (el mercado se movió) | **criterio** |

**8 los atrapa el script · 6 el ojo con la hoja de QA · 5 solo el criterio.**

---

## 4. Lo que falta por automatizar
- **Consistencia de paleta**: medir el tono dominante de cada cuadro de la hoja de QA y avisar si uno se sale de la familia.
- **Colisión rótulo / objeto 3D**: comprobar que nada del mundo cae en la franja del titular (y_px 300–1010).
- **Palabra tapada**: cruzar `whisper.json` con la envolvente de la música y avisar si alguna cae bajo el ruido.
- **Lo que dice la voz contra lo que se ve**: comparar los `cap:` con los rótulos y avisar si una cifra se dice y no aparece.
