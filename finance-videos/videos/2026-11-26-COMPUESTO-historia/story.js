// Interés compuesto: los últimos 5 años valen más que los primeros 20 — historia 3D "Costa Diorama v2"
// PUENTE al largo del domingo 29: "Cómo empezar a invertir desde cero en México (con poco dinero)".
//
// MOTOR NARRATIVO: **el contador** (/historia §4). Aquí el protagonista ES un número que crece, así que
// van dos fichas fijas arriba (AÑOS y VALOR) que nunca se van y suben con la voz, mientras el mundo
// cambia de escala para que la columna quepa, con su base clavada en el mismo punto de la pantalla.
// Sin cadena de "construido desde cero": competiría con el número (lo dice el propio banco).
//
// ARITMÉTICA (verificada, no es un dato de nadie): $1,000 al 10% anual compuesto.
//   año 10 = $2,594 · año 20 = $6,727 · año 25 = $10,835 · año 30 = $17,449
//   últimos 5 años: +$6,615 · primeros 20 años: +$5,727 → los últimos 5 ganan.
// El 10% es un SUPUESTO nuestro, no una promesa: va rotulado "supone 10% anual · ilustrativo"
// pegado a la cifra en pantalla (regla del número ilustrativo, 20 nov 2026).

const P = (lt, s) => lt / (s.t1 - s.t0);
const mixv = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const cam = (w, pos, tgt) => { w.cam.position.set(...pos); w.cam.lookAt(...tgt); };

const AHORRADOR = { shirt: '#3E6B8C', pants: '#2E3A47', shoes: '#E8E3D8', hair: '#2A1D14', hairStyle: 'short', seed: 31 };

// valor de $1,000 al 10% compuesto en el año n
const VAL = n => 1000 * Math.pow(1.10, n);
// la columna mide lo que vale, en unidades del mundo: 1 unidad = $1,000
const ALTO = n => VAL(n) / 1000;
// el grupo se arma con 36 discos de .5 = 18 unidades de alto, así que el factor es ALTO/18
const H0 = 18;
const ESC = n => ALTO(n) / H0;

const worlds = {
  // un solo mundo que cambia de escala: la columna crece y la cámara se aleja
  columna(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#2E4356', bg2: '#1B2835', floor: '#3A5468', fog: [40, 220],
      hemi: .55, key: 3.1, keyPos: [-12, 16, 13], keyCol: '#FFE9C4', rim: 2.0, rimPos: [11, 10, -6], rimCol: '#9FD0E8', fill: .4 });

    // la base: una plancha donde se apoya todo
    const base = rbox(9, .5, 9, .12, clay2('#2A3C4B', .8)); base.position.y = -.25; w.scene.add(base);

    // la columna de monedas. Se construye con 36 discos y se revela escalando el grupo en y,
    // con la base clavada en y=0 para que el crecimiento se lea desde el suelo.
    w.col = new THREE.Group(); w.scene.add(w.col);
    const N = 36;
    for (let i = 0; i < N; i++) {
      const d = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, .48, 28), clay2(i % 2 ? '#E0B24B' : '#C99A33', .45));
      d.castShadow = true; d.position.y = .24 + i * .5;
      w.col.add(d);
    }
    w.col.scale.y = .001;

    // el ahorrador, al lado: da la escala. Sin él, la columna es un palo sin tamaño.
    w.per = L.actor(AHORRADOR); w.per.position.set(2.6, 0, 1.2); w.per.rotation.y = -.5; w.scene.add(w.per);

    // la marca del año 20, para que el golpe final se vea y no solo se diga
    w.marca = L.label3d('AÑO 20', 3.0, .62, { bg: '#16222E', ink: '#9FD0E8', font: '800 150px Unbounded', ls: 5, pw: 1024 });
    w.marca.position.set(-2.3, ALTO(20), .1); w.marca.scale.setScalar(.001); w.scene.add(w.marca);
    return w;
  },

  // el pizarrón del aviso y la pregunta de cierre
  cierre(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#3A5468', bg2: '#243545', floor: '#46637A', fog: [30, 140],
      hemi: .62, key: 3.0, keyPos: [-10, 13, 11], keyCol: '#FFEDD0', rim: 2.0, rimPos: [9, 9, -5], rimCol: '#A8D6EC', fill: .44 });
    const pared = rbox(18, 12, .4, .1, clay2('#334B5E', .9)); pared.position.set(0, 5, -7); w.scene.add(pared);

    w.per = L.actor(AHORRADOR); w.per.position.set(0, 0, 1.0); w.scene.add(w.per);

    // el pizarrón que anuncia el largo del domingo
    w.aviso = new THREE.Group();
    const mrc = rbox(6.4, 3.0, .2, .08, clay2('#1B2835', .7)); w.aviso.add(mrc);
    // OJO: label3d usa `ink` (no `fg`) y `font` como cadena CSS completa (no `size`).
    // Con `fg`/`size` los ignora y escribe en NEGRO por defecto, que sobre un pizarrón oscuro no se lee.
    const pl = L.label3d('ESTE DOMINGO 10:00', 5.6, .74, { bg: '#16222E', ink: '#F2C84B', font: '800 92px Unbounded', ls: 3, pw: 2048 });
    pl.position.set(0, .68, .12); w.aviso.add(pl);
    const pl2 = L.label3d('Empezar a invertir', 5.2, .6, { bg: '#16222E', ink: '#EFE7D4', font: '800 76px Unbounded', ls: 1, pw: 2048 });
    pl2.position.set(0, -.14, .12); w.aviso.add(pl2);
    const pl3 = L.label3d('desde cero en México', 5.2, .6, { bg: '#16222E', ink: '#EFE7D4', font: '800 76px Unbounded', ls: 1, pw: 2048 });
    pl3.position.set(0, -.86, .12); w.aviso.add(pl3);
    w.aviso.position.set(0, 3.9, -2.2); w.aviso.scale.setScalar(.001); w.scene.add(w.aviso);
    return w;
  },
};

// rótulo de la casa (el motor 3D no tiene L.fit: el bloque se achica solo)
function head(L, kicker, lineas, pie, ink, lt, acento) {
  L.kicker(kicker, 476, L.seg(lt, .1, .5), ink);   // 476: debajo de las fichas del contador
  const largo = Math.max(...lineas.map(l => l.length));
  const ts = largo > 18 ? Math.max(54, Math.floor(78 * 18 / largo)) : 78;
  lineas.forEach((l, i) => L.rise(l, 90, 586 + i * 96, L.seg(lt, .25 + i * .1, .8 + i * .1),
    { f: L.F.d, w: 800, s: ts, c: i === lineas.length - 1 && acento ? acento : ink }));
  if (pie) L.rise(pie, 90, 586 + lineas.length * 96 - 26, L.seg(lt, .7, 1.2),
    { s: pie.length > 46 ? Math.max(26, Math.floor(38 * 46 / pie.length)) : 38, c: ink, a: .8 });
}

// LAS DOS FICHAS DEL CONTADOR: fijas arriba, nunca se van, suben con la voz.
// Es lo que define este formato; sin ellas no hay contador.
function fichas(L, anio, valor) {
  const C = L.C, y = 272, h = 104;   // debajo de la firma y encima del rótulo
  [[90, 'AÑOS', String(Math.round(anio)), L.B.arena],
   [560, 'VALOR', '$' + Math.round(valor).toLocaleString('en-US'), '#F2C84B']].forEach(([x, et, v, col]) => {
    C.save();
    C.fillStyle = 'rgba(16,26,35,.72)';
    if (C.roundRect) { C.beginPath(); C.roundRect(x, y, 430, h, 26); C.fill(); } else C.fillRect(x, y, 430, h);
    L.txt(et, x + 26, y + 40, { s: 26, c: L.B.arena, a: .72, ls: 3 });
    L.txt(v, x + 26, y + 88, { f: L.F.d, w: 800, s: 54, c: col });
    C.restore();
  });
  // el supuesto va PEGADO a la cifra, no en la descripción (regla del número ilustrativo)
  L.txt('supone 10% anual · ilustrativo', 90, y + h + 30, { s: 24, c: L.B.arena, a: .6 });
}

const scenes = [
  // 1 · GANCHO (3 s, tres capas): el número que no cuadra
  { id: 'gancho', world: 'columna', d: 9, sfx: [[.15, 'pop']], year: null,
    cap: 'Mil pesos. Los dejas quietos 30 años y se vuelven 17 mil. Sin meter un peso más.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.col.scale.y = Math.max(.001, L.back(L.seg(p, .05, .3)) * ESC(0));
      w.marca.scale.setScalar(.001);
      L.pose(w.per, { armR: [.32, .2, .3], armL: [.32, -.2, .3], head: [.05, -.3, 0],
        lid: Math.max(.15, L.blink(q, 4)), brow: .2, smile: .25 });
      // una moneda sola junto a una persona: alto útil = 0.536·d, con d≈7 cabe la persona (3) con aire
      cam(w, mixv([1.0, 2.2, 7.2], [1.2, 2.6, 8.0], L.eio(p)), mixv([.9, 1.1, .6], [1.0, 1.5, .6], L.eio(p)));
      w.focusOn(w.per, 1.1); w.aperture = .00024;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 800, .6, '12,20,28');
      head(L, 'Interés compuesto', ['Mil pesos', 'se vuelven 17 mil'], 'En 30 años, sin meter un peso más', ink, lt, L.B.mostaza);
      fichas(L, 0, VAL(0));
    } },

  // 2 · qué es, en una frase
  { id: 'que-es', world: 'columna', trans: 'cont', d: 9, sfx: [[.3, 'shine', .5]], year: null,
    cap: 'El interés compuesto es simple: el segundo año no ganas sobre tus mil pesos, ganas sobre lo que ya tenías.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const n = 3 * L.eio(p);
      w.col.scale.y = ESC(n);
      w.marca.scale.setScalar(.001);
      L.pose(w.per, { armL: [.9 * L.eio(L.seg(p, .3, .7)) + .3, -.55, .7], armR: [.32, .2, .3],
        head: [0, -.42, 0], lid: Math.max(.15, L.blink(q, 3)), brow: .3, smile: .35 });
      cam(w, mixv([1.2, 2.6, 8.0], [1.4, 3.0, 9.0], L.eio(p)), mixv([1.0, 1.5, .6], [1.0, 1.9, .6], L.eio(p)));
      w.focusOn(w.col, 1.2); w.aperture = .00022;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 820, .6, '12,20,28');
      head(L, 'Cómo funciona', ['Ganas sobre', 'lo que ya ganaste'], 'No sobre lo que metiste', ink, lt, L.B.mostaza);
      fichas(L, 3 * L.eio(P(lt, this)), VAL(3 * L.eio(P(lt, this))));
    } },

  // 3 · año 10: parece que no pasa nada
  { id: 'anio10', world: 'columna', trans: 'cont', d: 10, sfx: [[.25, 'thud', .4]], year: 'AÑO 10',
    cap: 'Y aquí es donde casi todos se rinden. Después de 10 años llevas 2,594 pesos. Parece que no pasa nada.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const n = 3 + 7 * L.eio(p);
      w.col.scale.y = ESC(n);
      w.marca.scale.setScalar(.001);
      L.pose(w.per, { armR: [.3, .2, .3], armL: [.3, -.2, .3], head: [.22, -.3, 0],
        lean: .06, bob: -.04, lid: Math.max(.3, L.blink(q, 5)), brow: -.3, smile: -.3 });
      // la columna mide 2.6: con d≈11 cabe de sobra y la persona sigue dando escala
      cam(w, mixv([1.4, 3.0, 9.0], [1.6, 3.2, 11.0], L.eio(p)), mixv([1.0, 1.9, .6], [.9, 2.0, .6], L.eio(p)));
      w.focusOn(w.per, 1.2); w.aperture = .00020;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 830, .62, '12,20,28');
      head(L, 'Año 10', ['Parece que', 'no pasa nada'], 'Aquí es donde casi todos se rinden', ink, lt, L.B.terracota);
      fichas(L, 3 + 7 * L.eio(P(lt, this)), VAL(3 + 7 * L.eio(P(lt, this))));
    } },

  // 4 · año 20: ya se nota, y queda marcado
  { id: 'anio20', world: 'columna', trans: 'cont', d: 10, sfx: [[.3, 'shine', .55]], year: 'AÑO 20',
    cap: 'En el año 20 ya llevas 6,727. Acuérdate de este número, porque en un momento vuelve.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const n = 10 + 10 * L.eio(p);
      w.col.scale.y = ESC(n);
      w.marca.scale.setScalar(Math.max(.001, L.back(L.seg(p, .6, .9))));
      L.pose(w.per, { armL: [1.0 * L.eio(L.seg(p, .4, .8)) + .3, -.5, .6], armR: [.32, .2, .3],
        head: [-.08, -.4, 0], lid: Math.max(.15, L.blink(q, 4)), brow: .35, smile: .4 });
      // columna 6.7 de alto → d = 6.7·1.15/0.536 ≈ 14.4, más aire para la persona
      cam(w, mixv([1.6, 3.2, 11.0], [2.2, 4.4, 16.5], L.eio(p)), mixv([.9, 2.0, .6], [.6, 3.4, .6], L.eio(p)));
      w.focusOn(w.col, 1.6); w.aperture = .00014;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 820, .6, '12,20,28');
      head(L, 'Año 20', ['Ya se nota'], 'Acuérdate de esta cifra: vuelve en un momento', ink, lt, L.B.mostaza);
      fichas(L, 10 + 10 * L.eio(P(lt, this)), VAL(10 + 10 * L.eio(P(lt, this))));
    } },

  // 5 · año 30: la columna ya no cabe
  { id: 'anio30', world: 'columna', trans: 'cont', d: 10, sfx: [[.2, 'wave', .6]], year: 'AÑO 30',
    cap: 'Y en el año 30, 17,449. La columna ya ni cabe en la pantalla.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const n = 20 + 10 * L.eio(p);
      w.col.scale.y = ESC(n);
      w.marca.scale.setScalar(1);
      L.pose(w.per, { armR: [.32, .2, .3], armL: [.32, -.2, .3], head: [-.3 - L.eio(p) * .2, -.3, 0],
        lid: Math.max(.1, L.blink(q, 4)), brow: .5, smile: .3 });
      // columna 17.4 → el alto útil debe ser ~20: d = 20/0.536 ≈ 37
      cam(w, mixv([2.2, 4.4, 16.5], [4.5, 9.5, 37], L.eio(p)), mixv([.6, 3.4, .6], [.4, 8.6, .6], L.eio(p)));
      w.focusOn(w.col, 3.0); w.aperture = .00006;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 800, .58, '12,20,28');
      head(L, 'Año 30', ['17,449 pesos'], 'De los mil que dejaste quietos', ink, lt, L.B.mostaza);
      fichas(L, 20 + 10 * L.eio(P(lt, this)), VAL(20 + 10 * L.eio(P(lt, this))));
    } },

  // 6 · EL GOLPE: los últimos 5 años ganan a los primeros 20
  { id: 'golpe', world: 'columna', trans: 'cont', d: 11, sfx: [[.4, 'pop'], [1.4, 'thud', .5]], year: null,
    cap: 'Ahora el dato que nadie espera: los últimos 5 años te dieron 6,615 pesos. Los primeros 20, solo 5,727.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.col.scale.y = ESC(30);
      w.marca.scale.setScalar(1);
      L.pose(w.per, { armL: [1.1, -.6, .8], armR: [.32, .2, .3], head: [-.26, -.34, 0],
        lid: Math.max(.1, L.blink(q, 3)), brow: .55, smile: .5, bob: Math.sin(t * 2) * .015 });
      cam(w, mixv([4.5, 9.5, 37], [3.4, 10.5, 33], L.eio(p)), mixv([.4, 8.6, .6], [.4, 9.4, .6], L.eio(p)));
      w.focusOn(w.col, 3.0); w.aperture = .00007;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 880, .66, '12,20,28');
      head(L, 'El dato que nadie espera', ['Los últimos 5 años', 'ganan a los primeros 20'], '+$6,615 contra +$5,727', ink, lt, L.B.mostaza);
      fichas(L, 30, VAL(30));
    } },

  // 7 · por qué: la base, no la velocidad
  { id: 'porque', world: 'columna', trans: 'cont', d: 10, sfx: [[.3, 'shine', .5]], year: null,
    cap: 'No es que el dinero crezca más rápido al final. Crece igual de rápido. Lo que cambió es sobre cuánto crece.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.col.scale.y = ESC(30);
      w.marca.scale.setScalar(Math.max(.001, 1 - L.eio(L.seg(p, .1, .4))));
      L.pose(w.per, { armL: [.6, -.5, .55], armR: [.6, .5, .55], head: [-.2, -.2, 0],
        lid: Math.max(.15, L.blink(q, 4)), brow: .3, smile: .35 });
      cam(w, mixv([3.4, 10.5, 33], [2.6, 9.0, 29], L.eio(p)), mixv([.4, 9.4, .6], [.5, 8.4, .6], L.eio(p)));
      w.focusOn(w.col, 2.6); w.aperture = .00008;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 850, .62, '12,20,28');
      head(L, 'Por qué', ['No crece más rápido.', 'Crece sobre más'], 'El 10% del año 30 es de una base siete veces mayor', ink, lt, L.B.mostaza);
      fichas(L, 30, VAL(30));
    } },

  // 8 · lo único que controlas (sin recomendación: es tiempo, no asignación)
  { id: 'tiempo', world: 'columna', trans: 'cont', d: 9, sfx: [[.3, 'pop', .5]], year: null,
    cap: 'Por eso en esto el ingrediente caro no es el dinero. Es el tiempo, y es el único que no se puede comprar después.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.col.scale.y = ESC(30);
      w.marca.scale.setScalar(.001);
      L.pose(w.per, { armR: [.32, .2, .3], armL: [.32, -.2, .3], head: [-.1, -.1 + L.eio(p) * .1, 0],
        lid: Math.max(.15, L.blink(q, 4)), brow: .25, smile: .4 });
      cam(w, mixv([2.6, 9.0, 29], [2.0, 5.0, 15], L.eio(p)), mixv([.5, 8.4, .6], [1.2, 2.6, .6], L.eio(p)));
      w.focusOn(w.per, 1.6); w.aperture = .00013;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 840, .62, '12,20,28');
      head(L, 'Lo que sí controlas', ['El ingrediente caro', 'es el tiempo'], 'Es el único que no se compra después', ink, lt, L.B.mostaza);
      fichas(L, 30, VAL(30));
    } },

  // 9 · AVISO del largo del domingo (va antes de la pregunta, como manda la casa)
  { id: 'aviso', world: 'cierre', d: 7, sfx: [[.25, 'pop'], [.5, 'shine', .55]], year: 'EL DOMINGO',
    cap: 'Y este domingo subimos el video completo: cómo empezar a invertir desde cero en México, con poco dinero.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const sale = L.back(L.seg(p, .1, .45));
      w.aviso.scale.setScalar(Math.max(.001, sale));
      w.aviso.position.y = 3.9 + Math.sin(t * 1.2) * .04;
      L.pose(w.per, { armL: [1.25 * sale + .2, -.5, .5], armR: [.3, .2, .3],
        head: [-.12, -.3 * sale, 0], lid: Math.max(.15, L.blink(q, 3)), brow: .4, smile: .55 });
      // el pizarrón mide 6.4 de ancho: ancho útil = 0.3015·d → d ≈ 24 para que quepa con aire
      cam(w, mixv([0, 4.8, 25.5], [.4, 4.4, 23.0], L.eio(p)), mixv([0, 3.4, -2.2], [0, 3.3, -2.2], L.eio(p)));
      w.focusOn(sale > .4 ? w.aviso : w.per, 1.6); w.aperture = .00013;
    },
    overlay(lt, t, L) {
      const ink = '#EFE7D4'; L.scrim(L.C, 0, 760, .56, '12,20,28');
      head(L, 'Lo que sigue', ['El video completo', 'este domingo'], 'Empezar a invertir desde cero en México · 10:00', ink, lt, L.B.mostaza);
    } },

  // 10 · cierre de la casa: una pregunta
  { id: 'cierre-pregunta', world: 'cierre', trans: 'cont', d: 7.5, sfx: [[.15, 'shine', .5]], year: null,
    cap: '¿Cuántos años llevas pensando en empezar?',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.aviso.scale.setScalar(Math.max(.001, 1 - L.eio(L.seg(p, 0, .18))));
      const pre = L.eio(L.seg(p, .2, .6));
      L.pose(w.per, { armL: [.55 * pre + .28, -.62 * pre - .18, .62 * pre + .28],
        armR: [.55 * pre + .28, .62 * pre + .18, .62 * pre + .28],
        head: [-.05 - pre * .05, 0, 0], lid: Math.max(.15, L.blink(q, 4)), brow: .2 + pre * .4, smile: .35 });
      cam(w, mixv([.4, 4.4, 23.0], [.1, 3.0, 11.0], L.eio(p)), mixv([0, 3.3, -2.2], [0, 2.5, .6], L.eio(p)));
      w.focusOn(w.per, 1.3); w.aperture = .00020;
    },
    overlay(lt, t, L) {
      const a = '#EFE7D4'; L.scrim(L.C, 0, 900, .7, '12,20,28');
      L.rise('¿Cuántos años llevas', 540, 430, L.seg(lt, .15, .8), { f: L.F.s, it: 1, s: 96, c: a, al: 'center' });
      L.rise('pensando', 540, 548, L.seg(lt, .85, 1.45), { f: L.F.s, it: 1, s: 96, c: a, al: 'center' });
      L.rise('en empezar?', 540, 648, L.seg(lt, 1.05, 1.65), { f: L.F.s, it: 1, s: 96, c: L.B.mostaza, al: 'center' });
      L.rise('Desde la costa, todo se ve con claridad.', 540, 742, L.seg(lt, 1.8, 2.4), { f: L.F.s, it: 1, s: 42, c: a, al: 'center', a: .85 });
      L.txt('Supone 10% anual · ejemplo ilustrativo · Contenido educativo · No es asesoría financiera',
        540, 1790, { s: 23, c: a, al: 'center', a: .6 * L.seg(lt, 2, 2.6) });
    } },
];

export default { id: '2026-11-26-COMPUESTO-historia', title: 'Los últimos 5 años valen más que los primeros 20', tail: 1.2, worlds, scenes };
