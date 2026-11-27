// El interés compuesto: $5 al día durante 40 años — historia 3D "Costa Diorama v2"
// PUENTE al largo del domingo 29: "Cómo empezar a invertir desde cero en México".
// Guion aprobado por JP el 27 nov 2026: videos/2026-11-26-COMPUESTO-historia/guion.md
//
// MOTOR: el contador. Dos fichas fijas arriba (AÑOS / VALOR) que suben con la voz, y el mundo cambia de
// escala para que la gráfica quepa. La gráfica es una ESCALERA que el personaje sube (convención de la
// casa: lo que crece año con año se cuenta subiendo escaleras).
//
// ARITMÉTICA: $160/mes, 10% anual compuesto, 40 años → $1,011,853. Aportado $76,640 (7.6%).
// El 10% es un SUPUESTO nuestro: va rotulado "supone 10% anual · ilustrativo" en las 10 escenas.
// ESCALA DEL MUNDO: 1 unidad = $50,000. Año 40 = 20.24 unidades de alto, 17.6 de ancho.

const P = (lt, s) => lt / (s.t1 - s.t0);
const mixv = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const cam = (w, pos, tgt) => { w.cam.position.set(...pos); w.cam.lookAt(...tgt); };

// ---------------------------------------------------------------- la aritmética, en el código
const TASA = 0.10 / 12, CUOTA = 160, U = 50000, PASO = 0.45;
const VAL = y => CUOTA * ((Math.pow(1 + TASA, 12 * y) - 1) / TASA);
const ALT = y => VAL(y) / U;                                  // alto total de la barra del año y
const VERDE = y => Math.min(CUOTA * 12 * y, VAL(y)) / U;      // la parte que pusiste tú
const X = y => (y - 1) * PASO;                                // dónde cae el año y en el eje
const HITOS = { coche: 5, casa: 18, barco: 31, millon: 40 };

const AHORRADOR = { shirt: '#3E7A5E', pants: '#2E3A47', shoes: '#E8E3D8', hair: '#2A1D14', hairStyle: 'short', seed: 31 };
const MIRON = s => ({ shirt: ['#5B6B8C', '#7E6A54', '#6B5B7E', '#4A6B6B'][s % 4], pants: '#2E3240', shoes: '#DADADA', hair: '#241A12', hairStyle: s % 2 ? 'short' : 'side', seed: 40 + s });

const worlds = {
  // UN SOLO MUNDO que cambia de escala: la escalera crece y la cámara se aleja (escenas 1–8)
  camino(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#2A3B4D', bg2: '#16222E', floor: '#3A5468', fog: [60, 400],
      hemi: .55, key: 3.1, keyPos: [-16, 22, 18], keyCol: '#FFE9C4', rim: 2.0, rimPos: [14, 12, -8], rimCol: '#9FD0E8', fill: .4 });

    // ---- la escalera: 40 barras, verde abajo (lo que pones) y dorado arriba (lo que paga el interés).
    // Cada barra se arma con altura 1 y se escala, así que el factor es el valor en unidades (no hay
    // altura construida que dividir: se construyen de 1 a propósito, para que escalar sea directo).
    w.barras = [];
    const anchoNormal = .38, anchoDescanso = 2.2;
    for (let y = 1; y <= 40; y++) {
      const esHito = Object.values(HITOS).includes(y);
      const an = esHito ? anchoDescanso : anchoNormal;
      const g = new THREE.Group();
      const verde = rbox(an, 1, esHito ? 2.0 : .9, .04, clay2('#4E9E6A', .62));
      verde.position.y = .5; g.add(verde);
      const oro = rbox(an, 1, esHito ? 2.0 : .9, .04, clay2('#E0B24B', .42));
      oro.position.y = .5; g.add(oro);
      g.position.set(X(y) + (esHito ? (anchoDescanso - anchoNormal) / 2 : 0), 0, 0);
      g.visible = false;
      w.scene.add(g);
      w.barras.push({ g, verde, oro, y, esHito });
    }
    // hasta qué año está construida la escalera (lo mueve cada escena)
    w.hasta = 0;
    w.dibuja = (anio) => {
      w.hasta = anio;
      w.barras.forEach(b => {
        if (b.y > anio) { b.g.visible = false; return; }
        b.g.visible = true;
        const tot = ALT(b.y), vrd = VERDE(b.y);
        b.verde.scale.y = Math.max(.001, vrd);
        b.verde.position.y = vrd / 2;
        b.oro.scale.y = Math.max(.001, tot - vrd);
        b.oro.position.y = vrd + (tot - vrd) / 2;
      });
    };

    // ---- el coche (año 5)
    w.coche = new THREE.Group();
    const carr = rbox(2.0, .55, .95, .18, clay2('#C94F3C', .5)); carr.position.y = .45; w.coche.add(carr);
    const cab = rbox(1.1, .45, .85, .18, clay2('#D9694F', .45)); cab.position.set(-.1, .92, 0); w.coche.add(cab);
    [[-.65, .5], [.65, .5], [-.65, -.5], [.65, -.5]].forEach(([a, b]) => {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, .18, 18), clay2('#22262C', .6));
      r.rotation.z = Math.PI / 2; r.position.set(a, .26, b); w.coche.add(r); });
    w.coche.scale.setScalar(.001); w.scene.add(w.coche);

    // ---- la casa (año 18)
    w.casa = new THREE.Group();
    const cuerpo = rbox(2.0, 1.5, 1.6, .06, clay2('#E8E0CE', .78)); cuerpo.position.y = .75; w.casa.add(cuerpo);
    const techo = rbox(2.3, .5, 1.9, .1, clay2('#9A4B38', .7)); techo.position.y = 1.72; w.casa.add(techo);
    w.puerta = rbox(.5, .9, .12, .04, clay2('#6B4A33', .6)); w.puerta.position.set(-.45, .45, .82); w.casa.add(w.puerta);
    const vent = rbox(.55, .5, .1, .04, clay2('#FFD79A', .3));
    vent.material.emissive = new THREE.Color('#FFC46A'); vent.material.emissiveIntensity = .9;
    vent.position.set(.5, .85, .82); w.casa.add(vent);
    w.casa.scale.setScalar(.001); w.scene.add(w.casa);

    // ---- el barco (año 31)
    w.barco = new THREE.Group();
    const casco = rbox(2.6, .6, 1.0, .3, clay2('#F2EDE2', .7)); casco.position.y = .3; w.barco.add(casco);
    const cabina = rbox(1.1, .55, .8, .2, clay2('#D8D2C4', .6)); cabina.position.set(-.2, .88, 0); w.barco.add(cabina);
    const mastil = rbox(.1, 1.6, .1, .03, clay2('#C9C3B5', .5)); mastil.position.set(.5, 1.4, 0); w.barco.add(mastil);
    w.barco.scale.setScalar(.001); w.scene.add(w.barco);

    // ---- el fondo que cuenta el tiempo: baldío → pueblo → ciudad → ciudad iluminada.
    // Los edificios suben del suelo y sus ventanas se encienden conforme avanza la historia.
    w.ciudad = new THREE.Group(); w.scene.add(w.ciudad);
    const rng = L.rng(7);
    for (let i = 0; i < 46; i++) {
      const an = 1.2 + rng() * 2.4, al = 2 + rng() * 14;
      const b = rbox(an, al, an, .05, clay2(['#2E4458', '#26384A', '#35506A', '#1F2E3D'][i % 4], .85));
      b.position.set(-10 + rng() * 42, al / 2, -26 - rng() * 26);
      b.userData.al = al; b.userData.orden = rng();
      b.scale.y = .001;
      // ventanas: un plano emisivo pegado a la cara de enfrente
      const v = rbox(an * .7, al * .55, .08, .02, clay2('#FFD79A', .3));
      v.material.emissive = new THREE.Color('#FFC46A'); v.material.emissiveIntensity = 0;
      v.position.set(0, 0, an / 2 + .05); b.add(v); b.userData.vent = v;
      w.ciudad.add(b);
    }
    w.fondo = (k, luz) => {                       // k: 0 baldío → 1 ciudad entera · luz: 0 apagada → 1 encendida
      w.ciudad.children.forEach(b => {
        const q = L.seg(k, b.userData.orden * .8, b.userData.orden * .8 + .25);
        b.scale.y = Math.max(.001, L.eio(q));
        b.userData.vent.material.emissiveIntensity = luz * L.eio(q) * 1.1;
      });
    };

    // ---- maqueta del MECANISMO (solo escena 2): la barra real del año 1 mide 0.04 unidades, o sea
    // nada. Para que se vea un billete verde y los dorados brotando hace falta una maqueta aparte,
    // a escala legible, puesta lejos de la gráfica.
    w.mec = new THREE.Group(); w.mec.position.set(-7, 0, 4); w.mec.scale.setScalar(.001); w.scene.add(w.mec);
    const billete = (col, em) => { const b = rbox(1.5, .09, .72, .03, clay2(col, em ? .35 : .6));
      if (em) { b.material.emissive = new THREE.Color('#C9962F'); b.material.emissiveIntensity = .35; } return b; };
    w.mecVerde = [];
    for (let i = 0; i < 4; i++) { const b = billete('#4E9E6A'); b.position.y = .05 + i * .1; w.mec.add(b); w.mecVerde.push(b); }
    w.mecOro = [];
    for (let i = 0; i < 7; i++) { const b = billete('#E0B24B', 1); b.position.set((i % 3 - 1) * .12, .46 + i * .1, (i % 2) * .08);
      b.scale.setScalar(.001); w.mec.add(b); w.mecOro.push(b); }

    // ---- el ahorrador
    w.per = L.actor(AHORRADOR); w.per.position.set(0, 0, 1.3); w.scene.add(w.per);

    // ---- la multitud del final (8 personajes, como la historia de Jobs)
    w.gente = new THREE.Group(); w.gente.scale.setScalar(.001); w.scene.add(w.gente);
    for (let i = 0; i < 8; i++) {
      const a = L.actor(MIRON(i));
      const ang = -.9 + (i / 7) * 1.8;
      a.scale.setScalar(.82);
      a.position.set(Math.sin(ang) * 5.4, 0, 4.2 + Math.cos(ang) * 3.0);
      a.rotation.y = -ang + Math.PI;
      w.gente.add(a);
    }
    return w;
  },

  // el pizarrón del aviso y la pregunta (escenas 9 y 10)
  cierre(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#35506A', bg2: '#1F2E3D', floor: '#46637A', fog: [30, 150],
      hemi: .62, key: 3.0, keyPos: [-10, 13, 11], keyCol: '#FFEDD0', rim: 2.0, rimPos: [9, 9, -5], rimCol: '#A8D6EC', fill: .44 });
    const pared = rbox(20, 13, .4, .1, clay2('#2E4458', .9)); pared.position.set(0, 5.5, -7); w.scene.add(pared);
    w.per = L.actor(AHORRADOR); w.per.position.set(0, 0, 1.0); w.scene.add(w.per);

    // OJO: label3d usa `ink` y `font` (cadena CSS), nunca `fg`/`size`; y el texto que no cabe en `pw`
    // se recorta: caracteres × 0.62 × tamaño + ls × caracteres ≤ pw.
    w.aviso = new THREE.Group();
    const mrc = rbox(6.6, 3.2, .2, .08, clay2('#16222E', .7)); w.aviso.add(mrc);
    const l1 = L.label3d('ESTE DOMINGO 10:00', 5.8, .76, { bg: '#16222E', ink: '#F2C84B', font: '800 92px Unbounded', ls: 3, pw: 2048 });
    l1.position.set(0, .74, .12); w.aviso.add(l1);
    // "DOMINGO subrayado a mano" (lo pide plan/anatomia-formatos.md)
    const sub = rbox(2.5, .07, .04, .02, clay2('#F2C84B', .3));
    sub.material.emissive = new THREE.Color('#F2C84B'); sub.material.emissiveIntensity = .8;
    sub.position.set(.15, .38, .14); sub.rotation.z = -.012; w.aviso.add(sub);
    const l2 = L.label3d('Empezar a invertir', 5.2, .6, { bg: '#16222E', ink: '#EFE7D4', font: '800 76px Unbounded', ls: 1, pw: 2048 });
    l2.position.set(0, -.18, .12); w.aviso.add(l2);
    const l3 = L.label3d('desde cero en México', 5.2, .6, { bg: '#16222E', ink: '#EFE7D4', font: '800 76px Unbounded', ls: 1, pw: 2048 });
    l3.position.set(0, -.92, .12); w.aviso.add(l3);
    w.aviso.position.set(0, 4.0, -2.2); w.aviso.scale.setScalar(.001); w.scene.add(w.aviso);
    return w;
  },
};

// ---------------------------------------------------------------- overlay 2D
// rótulo de la casa: el bloque se achica solo (el motor 3D no tiene L.fit)
function head(L, kicker, lineas, pie, ink, lt, acento) {
  L.kicker(kicker, 476, L.seg(lt, .1, .5), ink);
  let ts = 78; while (ts > 46 && lineas.some(l => L.tw(l, { f: L.F.d, w: 800, s: ts }) > 900)) ts -= 2;
  lineas.forEach((l, i) => L.rise(l, 90, 586 + i * 96, L.seg(lt, .25 + i * .1, .8 + i * .1),
    { f: L.F.d, w: 800, s: ts, c: i === lineas.length - 1 && acento ? acento : ink }));
  if (pie) { let ps = 38; while (ps > 22 && L.tw(pie, { f: L.F.b, w: 500, s: ps }) > 900) ps -= 1;
    L.rise(pie, 90, 586 + lineas.length * 96 - 26, L.seg(lt, .7, 1.2), { s: ps, c: ink, a: .8 }); }
}

// LAS DOS FICHAS DEL CONTADOR: fijas arriba, suben con la voz. Sin ellas no hay formato contador.
function fichas(L, anio, valor) {
  const C = L.C, y = 272, h = 104;
  [[90, 'AÑOS', String(Math.round(anio)), L.B.arena],
   [560, 'VALOR', '$' + Math.round(valor).toLocaleString('en-US'), '#F2C84B']].forEach(([x, et, v, col]) => {
    C.save(); C.fillStyle = 'rgba(12,20,28,.74)';
    if (C.roundRect) { C.beginPath(); C.roundRect(x, y, 430, h, 26); C.fill(); } else C.fillRect(x, y, 430, h);
    L.txt(et, x + 26, y + 38, { s: 26, c: L.B.arena, a: .72, ls: 3 });
    L.txt(v, x + 26, y + 86, { f: L.F.d, w: 800, s: 54, c: col });
    C.restore();
  });
  // el supuesto va PEGADO a la cifra, en pantalla, no en la descripción (regla del número ilustrativo)
  L.txt('supone 10% anual · ilustrativo', 90, y + h + 30, { s: 24, c: L.B.arena, a: .6 });
}

// LA ETIQUETA QUE APUNTA: píldora + línea punteada hasta la cosa que nombra.
// Estaba escrita en CLAUDE.md como recurso de la casa pero no existía en el motor; se construye aquí.
function apunta(L, texto, px, py, destX, destY, color, k) {
  if (k <= 0) return;
  const C = L.C;
  C.save(); C.globalAlpha *= k;
  C.strokeStyle = color; C.lineWidth = 4; C.setLineDash([12, 10]);
  C.beginPath(); C.moveTo(px, py); C.lineTo(destX, destY); C.stroke();
  C.setLineDash([]);
  C.beginPath(); C.arc(destX, destY, 9, 0, 7); C.fillStyle = color; C.fill();
  const an = L.tw(texto, { f: L.F.b, w: 700, s: 34 }) + 52;
  C.fillStyle = 'rgba(12,20,28,.88)';
  if (C.roundRect) { C.beginPath(); C.roundRect(px - an / 2, py - 32, an, 60, 30); C.fill(); }
  C.strokeStyle = color; C.lineWidth = 3;
  if (C.roundRect) { C.beginPath(); C.roundRect(px - an / 2, py - 32, an, 60, 30); C.stroke(); }
  L.txt(texto, px, py + 8, { f: L.F.b, w: 700, s: 34, al: 'center', c: '#EFE7D4' });
  C.restore();
}

const ORO = '#F2C84B', VRD = '#6FD093', TINTA = '#EFE7D4';

// segunda línea del rótulo en dos tiempos: se achica sola, como head() (a 78px caben ~18 caracteres en 900)
function linea2(L, txt, y, k, col) {
  let ts = 78; while (ts > 44 && L.tw(txt, { f: L.F.d, w: 800, s: ts }) > 900) ts -= 2;   // medido, no estimado
  L.rise(txt, 90, y, k, { f: L.F.d, w: 800, s: ts, c: col });
}

const scenes = [
  // 1 · GANCHO CON SALTO AL FUTURO: medio → gran general → medio
  { id: 'gancho', world: 'camino', d: 10, sfx: [[2.4, 'wave', .75]], year: null,
    cap: 'Invierte cinco dólares al día y cuarenta años después serás millonario. No es un truco: es aritmética. Pero el camino sorprende.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      // tres tiempos: el baldío (0-.25) · el futuro (.25-.7) · de vuelta al baldío (.7-1)
      const futuro = L.seg(p, .25, .42), vuelve = L.seg(p, .70, .86);
      const f = Math.max(0, futuro - vuelve);                      // 0 presente · 1 futuro
      w.dibuja(f > .02 ? 40 : 1); w.mec.scale.setScalar(.001);
      w.fondo(f, f);
      w.coche.scale.setScalar(Math.max(.001, f));  w.coche.position.set(X(5) + .9, ALT(5), .2);
      w.casa.scale.setScalar(Math.max(.001, f));   w.casa.position.set(X(18) + .9, ALT(18), .1);
      w.barco.scale.setScalar(Math.max(.001, f));  w.barco.position.set(X(31) + .9, ALT(31), .1);
      w.gente.scale.setScalar(Math.max(.001, f));  w.gente.position.set(X(40) + .9, ALT(40), 0);
      w.per.position.set(f > .5 ? X(40) + .9 : 0, f > .5 ? ALT(40) : 0, 1.3);
      L.pose(w.per, { armR: [.32 + f * .9, .2 + f * .3, .3], armL: [.32 + f * .9, -.2 - f * .3, .3],
        head: [-.05, 0, 0], lid: Math.max(.15, L.blink(q, 4)), brow: .2 + f * .3, smile: .2 + f * .4 });
      // presente d≈9 (ancho 2.7, cabe la persona) · futuro d≈73 (ancho 22, cabe la gráfica de 17.6)
      const cerca = [0, 2.5, 9], lejos = [9.8, 12, 85];
      const tCer = [0, 1.6, 1.3], tLej = [9.8, 9.5, 0];
      cam(w, mixv(cerca, lejos, f), mixv(tCer, tLej, f));
      w.focusOn(w.per, f > .5 ? 3.2 : 1.1); w.aperture = f > .5 ? .00005 : .00024;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 820, .62, '8,14,20');
      head(L, 'Interés compuesto', ['Cinco dólares al día'], null, TINTA, lt);
      linea2(L, 'cuarenta años después', 700, L.seg(lt, .9, 1.5), ORO);
      fichas(L, 1, VAL(1));
    } },

  // 2 · EL MECANISMO · plano DETALLE, la única toma cerrada
  { id: 'mecanismo', world: 'camino', trans: 'cont', d: 13, sfx: [[1.1, 'pop']], year: null,
    cap: 'Cada mes pones ciento sesenta dólares: ese dinero tuyo son los billetes verdes. Lo que el interés paga encima son los dorados. Y esos dorados pagan más dorados.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 1 + 2 * L.eio(L.seg(p, .45, 1));
      w.dibuja(Math.ceil(anio)); w.fondo(.05, 0);
      [w.coche, w.casa, w.barco, w.gente].forEach(o => o.scale.setScalar(.001));
      w.mec.scale.setScalar(1);
      // los verdes ya están; los dorados BROTAN: uno, luego dos, luego cuatro
      const brota = L.seg(p, .25, .95);
      w.mecOro.forEach((b, i) => b.scale.setScalar(Math.max(.001, L.back(L.seg(brota, i * .13, i * .13 + .22)))));
      w.per.position.set(-5.2, 0, 5.4);
      L.pose(w.per, { armL: [1.05, -.5, .8], armR: [.32, .2, .3], head: [.1, .45, 0],
        lid: Math.max(.15, L.blink(q, 3)), brow: .3, smile: .35 });
      // detalle de la maqueta: d≈4.5 → ancho 1.36, el billete mide 1.5. Llena el cuadro, que es lo que toca.
      cam(w, mixv([-6.8, 1.5, 8.2], [-6.9, 1.2, 7.6], L.eio(p)), mixv([-7, .5, 4], [-7, .45, 4], L.eio(p)));
      w.focusOn(w.mec, 1.0); w.aperture = .00032;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 840, .62, '8,14,20');
      head(L, 'Cómo funciona', ['Los dorados', 'pagan más dorados'], null, TINTA, lt, ORO);
      fichas(L, 1 + 2 * L.eio(L.seg(P(lt, this), .45, 1)), VAL(1 + 2 * L.eio(L.seg(P(lt, this), .45, 1))));
      // las dos etiquetas que apuntan: el espectador tiene que saber qué es cada color
      apunta(L, 'VERDE · el dinero que tú pones', 330, 1290, 560, 1530, VRD, L.seg(lt, 1.6, 2.2));
      apunta(L, 'DORADO · lo que te paga el interés', 700, 1120, 560, 1320, ORO, L.seg(lt, 3.0, 3.6));
    } },

  // 3 · AÑO 5, EL COCHE · plano medio
  { id: 'coche', world: 'camino', d: 8, sfx: [[2.0, 'thud', .5]], year: 'AÑO 5',
    cap: 'A los cinco años llevas doce mil dólares: ya es un coche. Casi todo lo pusiste tú.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 3 + 2 * L.eio(L.seg(p, 0, .5));
      w.dibuja(Math.ceil(anio)); w.fondo(.18, .05); w.mec.scale.setScalar(.001);
      const sale = L.back(L.seg(p, .3, .6)), sube = L.eio(L.seg(p, .62, .9));
      w.coche.scale.setScalar(Math.max(.001, sale)); w.coche.position.set(X(5) + .9, ALT(5), .2);
      [w.casa, w.barco, w.gente].forEach(o => o.scale.setScalar(.001));
      w.per.position.set(X(5) + .9 - 1.5 + sube * 1.1, ALT(5), 1.5 - sube * .5);
      w.per.scale.setScalar(Math.max(.001, 1 - sube * .96));        // se mete al coche
      L.pose(w.per, { armR: [.32, .2, .3], armL: [.32, -.2, .3], head: [0, -.3, 0],
        lid: Math.max(.15, L.blink(q, 4)), brow: .25, smile: .4 });
      // ancho 5 → d≈17
      cam(w, mixv([X(5) + .6, 2.4, 15], [X(5) + 1.1, 2.2, 17.5], L.eio(p)), mixv([X(5) + .7, 1.0, 0], [X(5) + .9, .9, 0], L.eio(p)));
      w.focusOn(w.coche, 1.4); w.aperture = .00016;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 820, .6, '8,14,20');
      head(L, 'Año 5', ['Ya es un coche'], '≈ 237,000 pesos · 77% lo pusiste tú', TINTA, lt, ORO);
      fichas(L, 5, VAL(5));
    } },

  // 4 · LA CUESTA LARGA · plano GENERAL · SIN efectos (el silencio es parte del golpe)
  { id: 'cuesta', world: 'camino', trans: 'cont', d: 11, sfx: [], year: 'AÑO 18',
    cap: 'Y lo que nadie te cuenta: tardas dieciocho años en juntar los primeros cien mil. Casi la mitad del camino para el diez por ciento.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 5 + 13 * L.eio(p);
      w.dibuja(Math.ceil(anio)); w.fondo(.3 + L.eio(p) * .15, .1); w.mec.scale.setScalar(.001);
      [w.coche, w.casa, w.barco, w.gente].forEach(o => o.scale.setScalar(.001));
      w.per.scale.setScalar(1);
      w.per.position.set(X(anio), ALT(anio), 1.4);
      // hombros caídos: camina desmotivado mirando el suelo
      L.pose(w.per, { armR: [.22, .18, .26], armL: [.22, -.18, .26], head: [.3, -.12, 0],
        lean: .1, bob: Math.sin(t * 3.4) * .035 - .05, walk: t * 2.2,
        lid: Math.max(.34, L.blink(q, 5)), brow: -.3, smile: -.3 });
      // ancho 10 → d≈33: se ve lo plano que ha sido el camino
      cam(w, mixv([X(9), 2.2, 19], [X(12), 2.8, 31], L.eio(p)), mixv([X(8), .6, 0], [X(11), .8, 0], L.eio(p)));
      w.focusOn(w.per, 1.8); w.aperture = .00009;
    },
    overlay(lt, t, L) {
      const p = P(lt, this), anio = 5 + 13 * L.eio(p);
      L.scrim(L.C, 0, 850, .64, '8,14,20');
      head(L, '18 años', ['para el 10%', 'del dinero'], 'Aquí es donde casi todos se rinden', TINTA, lt, L.B.terracota);
      fichas(L, anio, VAL(anio));
    } },

  // 5 · MUNGER Y LA CASA · plano entero
  { id: 'casa', world: 'camino', d: 9, sfx: [[2.2, 'pop', .6]], year: 'AÑO 18',
    cap: 'Charlie Munger decía que los primeros cien mil son los más difíciles. Y cuando llegas, ya son una casa.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.dibuja(18); w.fondo(.5, .25); w.mec.scale.setScalar(.001);
      const sale = L.back(L.seg(p, .35, .65)), abre = L.eio(L.seg(p, .7, .92));
      w.casa.scale.setScalar(Math.max(.001, sale)); w.casa.position.set(X(18) + .9, ALT(18), .1);
      w.puerta.rotation.y = abre * 1.1; w.puerta.position.x = -.45 - abre * .2;
      [w.coche, w.barco, w.gente].forEach(o => o.scale.setScalar(.001));
      w.per.scale.setScalar(1);
      w.per.position.set(X(18) + .9 - 1.6 + abre * .5, ALT(18), 1.5);
      // llega arrastrando los pies y se endereza
      L.pose(w.per, { armR: [.26 + abre * .5, .18, .28], armL: [.26, -.18, .28],
        head: [L.lerp(.28, -.08, abre), -.25, 0], lean: .08 - abre * .08,
        lid: Math.max(.2, L.blink(q, 4)), brow: L.lerp(-.2, .4, abre), smile: L.lerp(-.2, .5, abre) });
      // ancho 5.5 → d≈18
      cam(w, mixv([X(18) + .3, 4.6, 21], [X(18) + 1.0, 4.2, 23.5], L.eio(p)), mixv([X(18) + .9, 3.1, 0], [X(18) + 1.0, 3.0, 0], L.eio(p)));
      w.focusOn(w.casa, 1.5); w.aperture = .00015;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 840, .62, '8,14,20');
      head(L, 'Los primeros $100,000', ['son los más', 'difíciles'], 'Charlie Munger · ≈ 1.9 millones de pesos', TINTA, lt, ORO);
      fichas(L, 18, VAL(18));
    } },

  // 6 · SE ACELERA, EL BARCO · plano general alto
  { id: 'barco', world: 'camino', trans: 'cont', d: 10, sfx: [[1.8, 'shine', .6]], year: 'AÑO 31',
    cap: 'De ahí empuja el interés: a los treinta y uno llevas cuatrocientos mil, y el ochenta y cinco por ciento es dorado.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 18 + 13 * L.eio(p);
      w.dibuja(Math.ceil(anio)); w.fondo(.72, .45); w.mec.scale.setScalar(.001);
      w.casa.scale.setScalar(1); w.casa.position.set(X(18) + .9, ALT(18), .1);
      w.barco.scale.setScalar(Math.max(.001, L.back(L.seg(p, .66, .92)))); w.barco.position.set(X(31) + .9, ALT(31), .1);
      [w.coche, w.gente].forEach(o => o.scale.setScalar(.001));
      w.per.scale.setScalar(1);
      w.per.position.set(X(anio), ALT(anio), 1.4);
      // ahora trepa: se impulsa con las manos, le cuesta
      L.pose(w.per, { armR: [1.25 + Math.sin(t * 4) * .22, .34, .5], armL: [1.25 - Math.sin(t * 4) * .22, -.34, .5],
        head: [-.18, -.1, 0], lean: -.12, bob: Math.sin(t * 4) * .06,
        lid: Math.max(.18, L.blink(q, 4)), brow: .35, smile: .1 });
      // ancho 16 → d≈53
      cam(w, mixv([X(22), 6, 36], [X(26), 11, 53], L.eio(p)), mixv([X(20), 3, 0], [X(24), 5.5, 0], L.eio(p)));
      w.focusOn(w.per, 2.4); w.aperture = .00006;
    },
    overlay(lt, t, L) {
      const anio = 18 + 13 * L.eio(P(lt, this));
      L.scrim(L.C, 0, 830, .6, '8,14,20');
      head(L, 'Año 31', ['Ahora empuja', 'el interés'], '$400,000 · 85% ya es interés', TINTA, lt, ORO);
      fichas(L, anio, VAL(anio));
    } },

  // 7 · EL MILLÓN Y LA FAMA · gran general que cierra a PRIMER PLANO
  { id: 'millon', world: 'camino', trans: 'cont', d: 9,
    sfx: [[.6, 'thud', .7], [2.6, 'shine', .65]], year: 'AÑO 40',
    cap: 'Y a los cuarenta: un millón de dólares.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 31 + 9 * L.eio(L.seg(p, 0, .45));
      w.dibuja(Math.ceil(anio)); w.fondo(1, 1); w.mec.scale.setScalar(.001);
      w.casa.scale.setScalar(1); w.barco.scale.setScalar(1);
      w.coche.scale.setScalar(1); w.coche.position.set(X(5) + .9, ALT(5), .2);
      const fama = L.back(L.seg(p, .45, .72));
      w.gente.scale.setScalar(Math.max(.001, fama)); w.gente.position.set(X(40) + .9, ALT(40), 0);
      w.gente.children.forEach((a, i) => L.pose(a, { armR: [1.3 + Math.sin(t * 5 + i) * .3, .4, .5],
        armL: [1.3 - Math.sin(t * 5 + i) * .3, -.4, .5], head: [-.2, 0, 0], brow: .5, smile: .6,
        lid: Math.max(.15, L.blink(q, 3 + i)) }));
      w.per.scale.setScalar(1);
      w.per.position.set(X(40) + .9, ALT(40), 1.2);
      L.pose(w.per, { armR: [1.5 * fama + .3, .45, .5], armL: [1.5 * fama + .3, -.45, .5],
        head: [-.1, 0, 0], lid: Math.max(.12, L.blink(q, 4)), brow: .4, smile: .55 });
      // gran general (d≈73, ancho 22: cabe la gráfica de 17.6) y cierra a su cara (d≈6)
      const gg = [9.8, 12, 85], pp = [X(40) + .9, ALT(40) + 2.1, 9.5];
      const k = L.eio(L.seg(p, .62, 1));
      cam(w, mixv(gg, pp, k), mixv([9.8, 9.5, 0], [X(40) + .9, ALT(40) + 1.8, 1.0], k));
      w.focusOn(w.per, k > .5 ? 1.0 : 3.2); w.aperture = k > .5 ? .00030 : .00005;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 800, .58, '8,14,20');
      head(L, 'Año 40', ['Un millón'], null, TINTA, lt);
      linea2(L, '$1,011,853', 700, L.seg(lt, .9, 1.5), ORO);
      fichas(L, 40, VAL(40));
    } },

  // 8 · EL GOLPE · plano general de la gráfica entera
  { id: 'golpe', world: 'camino', d: 10, sfx: [[.4, 'pop'], [2.4, 'thud', .5]], year: null,
    cap: 'Tú pusiste setenta y seis mil; el interés, novecientos treinta y cinco mil. Noventa y dos de cada cien dólares.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.dibuja(40); w.fondo(1, 1); w.mec.scale.setScalar(.001);
      [w.coche, w.casa, w.barco].forEach(o => o.scale.setScalar(1));
      w.gente.scale.setScalar(.001);
      w.per.scale.setScalar(1); w.per.position.set(X(40) + .9, ALT(40), 1.2);
      L.pose(w.per, { armR: [.3, .2, .3], armL: [.3, -.2, .3], head: [.35, -.2, 0],
        lid: Math.max(.15, L.blink(q, 4)), brow: .25, smile: .2 });
      cam(w, mixv([9.8, 12, 82], [9.8, 10, 88], L.eio(p)), mixv([9.8, 9, 0], [9.8, 8, 0], L.eio(p)));
      w.focusOn(w.barras[39].g, 3.4); w.aperture = .00004;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 880, .66, '8,14,20');
      head(L, 'De quién es ese millón', ['Tú pusiste $76,640'], null, TINTA, lt);
      linea2(L, 'El interés puso $935,053', 700, L.seg(lt, 1.0, 1.6), ORO);
      L.rise('92 de cada 100 dólares', 90, 790, L.seg(lt, 1.5, 2.1), { s: 38, c: TINTA, a: .85 });
      fichas(L, 40, VAL(40));
    } },

  // 9 · EL AVISO DEL LARGO (va ANTES de la pregunta, como manda la casa)
  { id: 'aviso', world: 'cierre', d: 7, sfx: [[.25, 'pop'], [.6, 'shine', .55]], year: 'EL DOMINGO',
    cap: 'Este domingo sube el video completo: cómo empezar a invertir desde cero.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const sale = L.back(L.seg(p, .1, .45));
      w.aviso.scale.setScalar(Math.max(.001, sale));
      w.aviso.position.y = 4.0 + Math.sin(t * 1.2) * .04;
      L.pose(w.per, { armL: [1.25 * sale + .2, -.5, .5], armR: [.3, .2, .3],
        head: [-.12, -.3 * sale, 0], lid: Math.max(.15, L.blink(q, 3)), brow: .4, smile: .55 });
      // el pizarrón mide 6.6 de ancho: ancho útil = 0.3015·d → d ≈ 26 para que quepa con aire
      cam(w, mixv([0, 4.9, 26], [.4, 4.5, 23.5], L.eio(p)), mixv([0, 3.5, -2.2], [0, 3.4, -2.2], L.eio(p)));
      w.focusOn(sale > .4 ? w.aviso : w.per, 1.6); w.aperture = .00013;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 760, .56, '8,14,20');
      head(L, 'Lo que sigue', ['El video completo', 'este domingo'], 'Empezar a invertir desde cero en México · 10:00', TINTA, lt, ORO);
    } },

  // 10 · LA PREGUNTA DE CIERRE
  { id: 'cierre-pregunta', world: 'cierre', trans: 'cont', d: 7.5, sfx: [[.15, 'pop', .5]], year: null,
    cap: '¿Cuántos años llevas pensando en empezar?',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.aviso.scale.setScalar(Math.max(.001, 1 - L.eio(L.seg(p, 0, .18))));
      const pre = L.eio(L.seg(p, .2, .6));
      L.pose(w.per, { armL: [.55 * pre + .28, -.62 * pre - .18, .62 * pre + .28],
        armR: [.55 * pre + .28, .62 * pre + .18, .62 * pre + .28],
        head: [-.05 - pre * .05, 0, 0], lid: Math.max(.15, L.blink(q, 4)), brow: .2 + pre * .4, smile: .35 });
      cam(w, mixv([.4, 4.5, 23.5], [.1, 3.1, 11], L.eio(p)), mixv([0, 3.4, -2.2], [0, 2.5, .6], L.eio(p)));
      w.focusOn(w.per, 1.3); w.aperture = .00020;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 900, .7, '8,14,20');
      L.rise('¿Cuántos años llevas', 540, 430, L.seg(lt, .15, .8), { f: L.F.s, it: 1, s: 96, c: TINTA, al: 'center' });
      L.rise('pensando', 540, 548, L.seg(lt, .85, 1.45), { f: L.F.s, it: 1, s: 96, c: TINTA, al: 'center' });
      L.rise('en empezar?', 540, 648, L.seg(lt, 1.05, 1.65), { f: L.F.s, it: 1, s: 96, c: ORO, al: 'center' });
      L.rise('Desde la costa, todo se ve con claridad.', 540, 742, L.seg(lt, 1.8, 2.4), { f: L.F.s, it: 1, s: 42, c: TINTA, al: 'center', a: .85 });
      L.txt('Supone 10% anual · ejemplo ilustrativo · Contenido educativo · No es asesoría financiera',
        540, 1790, { s: 23, c: TINTA, al: 'center', a: .6 * L.seg(lt, 2, 2.6) });
    } },
];

export default { id: '2026-11-26-COMPUESTO-historia', title: 'Cinco dólares al día durante 40 años', tail: 1.2, worlds, scenes };
