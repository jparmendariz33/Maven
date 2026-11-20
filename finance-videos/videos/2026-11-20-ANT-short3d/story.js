// Anthropic sale a la bolsa — short 3D de contexto · motor: EL DESMONTAJE
// Datos: 424(b)(4) y S-1 enmendado ante la SEC + cierre de Yahoo Finance, 19 nov 2026. Ver guion.md.
// Sin logotipos reales dentro del mundo 3D. Nadie es identificable como una persona real.
//
// GEOMETRÍA (fov 30, vertical 9:16): alto = 0.536·d · ANCHO = 0.3015·d ← el ancho es lo que manda.
// PALETA (regla del 20 nov): UNA sola familia, el naranja. Cambia la luz, no el color.
//   nasdaq  #6E3118 noche  →  plaza #A85634 noche  →  sala #C47A4A media  →  taller #E0A571 clara
//   →  cierre: la plaza otra vez, al amanecer (más clara que el inicio: el arco de luz).

const P  = (lt, s) => lt / (s.t1 - s.t0);
const mv = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const cam = (w, pos, tgt, fov) => { w.cam.position.set(...pos); w.cam.lookAt(...tgt);
  if (fov && Math.abs(w.cam.fov - fov) > .01) { w.cam.fov = fov; w.cam.updateProjectionMatrix(); } };

const TERRA = '#BB6F58', MOSTAZA = '#C7A317', ARENA = '#EBE6BA', AZUL = '#4173D1', TINTA = '#2A1409', CREMA = '#F0E6D2';

const INV  = { shirt: '#4173D1', pants: '#2B3A55', shoes: '#DADADA', hair: '#2E2118', hairStyle: 'short', seed: 23 };
const EQUIPO = [{ ...INV, shirt: '#C7A317', hair: '#4A3020', seed: 31 }, { ...INV, shirt: CREMA, pants: '#3A2A1E', seed: 44 },
                { ...INV, shirt: '#7E8C54', seed: 52 }, { ...INV, shirt: '#BB6F58', seed: 61 }];
const ORADOR = { shirt: '#2B2B30', pants: '#23232A', shoes: '#1B1B1B', hair: '#3A2A1E', hairStyle: 'short', collar: 'suit', seed: 77 };

const PRECIO = [83, 111.5, 115.1, 109, 103.5, 99.4, 101.2, 98.3, 97.17];

// una pantalla que BRILLA sola (sin esto queda un cartel apagado)
const pantalla = (L, w, h, dib, pw) => { const pl = L.plaque(w, h, dib, pw || 620);
  pl.material.transparent = true; pl.material.depthWrite = false;
  pl.material.emissive = new L.THREE.Color(0xFFFFFF);
  pl.material.emissiveMap = pl.material.map; pl.material.emissiveIntensity = 1.2; return pl; };

// letrero de relleno para las fachadas de Times Square (fachadas ENTERAS de pantalla, no ladrillo)
const letrero = (L, w, h, seed) => { const r = L.rng(seed);
  return pantalla(L, w, h, (g, W2, H2) => {
    const base = ['#1C0E05', '#2A1206', '#160A04'][Math.floor(r() * 3)];
    g.fillStyle = base; g.fillRect(0, 0, W2, H2);
    const col = ['#C7A317', '#BB6F58', '#E8DCC6', '#7FA9F0', '#9FD08A'][Math.floor(r() * 5)];
    const modo = r();
    if (modo < .4) { for (let i = 0; i < 7; i++) { g.fillStyle = col; g.globalAlpha = .25 + r() * .6;
        g.fillRect(W2 * .1, H2 * (.1 + i * .12), W2 * (.3 + r() * .6), H2 * .06); } g.globalAlpha = 1; }
    else if (modo < .72) { g.fillStyle = col; g.globalAlpha = .8;
      g.beginPath(); g.arc(W2 / 2, H2 / 2, Math.min(W2, H2) * .3, 0, 7); g.fill(); g.globalAlpha = 1;
      g.fillStyle = base; g.font = '800 ' + Math.round(H2 * .18) + 'px Unbounded'; g.textAlign = 'center';
      g.fillText('$', W2 / 2, H2 / 2 + H2 * .07); }
    else { for (let i = 0; i < 40; i++) { g.fillStyle = col; g.globalAlpha = .12 + r() * .5;
        g.fillRect(r() * W2, r() * H2, W2 * .09, H2 * .035); } g.globalAlpha = 1; }
  }, 256); };

const worlds = {
  // ───── 1 · EL BOTÓN: el momento de salir a bolsa. Podio, discurso, equipo celebrando. ─────
  // JP: "una persona dando un discurso y la gente celebrando, como en la bolsa, presionando el botón".
  // Nadie es identificable: es el equipo, no un fundador real.
  nasdaq(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#6E3118', bg2: '#2A1008', floor: '#4A2412', fog: [26, 86], hemi: .66,
      sky: '#FFC08A', ground: '#3A1C0E', key: 3.0, keyPos: [-8, 13, 10], keyCol: '#FFD9B0',
      rim: 2.8, rimPos: [7, 9, -5], rimCol: '#FF9A55', fill: .52 });
    const muro = rbox(24, 16, .5, .1, clay2('#5A2611', .92)); muro.position.set(0, 7, -9.4); w.scene.add(muro);
    // muro de pantallas detrás del podio
    const pant = pantalla(L, 4.3, 2.3, (g, W2, H2) => {
      g.fillStyle = '#1C0E05'; g.fillRect(0, 0, W2, H2); g.textAlign = 'center';
      g.fillStyle = CREMA; g.font = '800 150px Unbounded'; g.fillText('ANT', W2 / 2, 190);
      g.fillStyle = '#9FD08A'; g.font = '800 72px Unbounded'; g.fillText('+34%', W2 / 2, 288);
      g.fillStyle = '#FFD98A'; g.font = '700 24px "Space Grotesk"'; g.letterSpacing = '8px';
      g.fillText('PRIMER DÍA DE COTIZACIÓN', W2 / 2, 360); g.letterSpacing = '0px'; }, 760);
    pant.position.set(0, 5.0, -9.1); w.scene.add(pant);
    [[-3.3, 3.5], [3.3, 3.5]].forEach(([x, y], i) => { const l = letrero(L, 1.5, 2.6, 5 + i);
      l.position.set(x, y, -9.1); w.scene.add(l); });
    // el podio y quien habla
    const pod = rbox(1.25, 1.35, .8, .07, clay2('#8A4A24', .72)); pod.position.set(0, .68, -4.2); w.scene.add(pod);
    const pfr = pantalla(L, 1.05, .6, (g, W2, H2) => { g.fillStyle = '#C7A317'; g.fillRect(0, 0, W2, H2); }, 160);
    pfr.position.set(0, .82, -3.79); w.scene.add(pfr);
    const mic = rbox(.05, .7, .05, .02, clay2('#2A2A2A', .5)); mic.position.set(.2, 1.7, -3.95); w.scene.add(mic);
    const orador = L.actor(ORADOR); orador.position.set(0, 0, -4.9); w.scene.add(orador);
    // el botón de la campana, sobre un pedestal al lado
    const ped = rbox(.5, 1.1, .5, .06, clay2('#8A4A24', .72)); ped.position.set(2.0, .55, -4.4); w.scene.add(ped);
    const boton = L.mesh(new THREE.CylinderGeometry(.17, .19, .12, 22), clay2('#C23A28', .4));
    boton.position.set(2.0, 1.16, -4.4); w.scene.add(boton);
    // el equipo, en semicírculo, aplaudiendo
    const gente = EQUIPO.map((o, i) => { const a = L.actor(o), x = [-2.3, -1.3, 1.25, 2.25][i];
      a.position.set(x, 0, -2.5 + Math.abs(x) * .28); a.rotation.y = Math.PI + x * .14; w.scene.add(a); return a; });
    // confeti
    const conf = new THREE.Group(); w.scene.add(conf); const rc = L.rng(17);
    for (let i = 0; i < 70; i++) { const c = rbox(.1, .1, .018, .01, clay2([MOSTAZA, CREMA, TERRA, AZUL][i % 4], .5));
      c.userData = { x: -4 + rc() * 8, z: -8 + rc() * 7, y0: 7 + rc() * 6, sp: .8 + rc() * 1.1, r: rc() * 6 };
      conf.add(c); }
    return { ...w, pant, orador, boton, gente, conf };
  },

  // ───── 2 y 10 · TIMES SQUARE: fachadas ENTERAS de pantalla, el edificio en cuña, fuegos. ─────
  // Investigado: la zonificación OBLIGA a cubrir las fachadas de anuncios luminosos; One Times Square
  // es una cuña con un panel LED enorme; los letreros van apilados sin pared visible entre ellos.
  plaza(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#A85634', bg2: '#30120A', floor: '#3A2418', fog: [30, 104], hemi: .8,
      sky: '#FFD2A2', ground: '#4A3020', key: 3.2, keyPos: [-9, 15, 11], keyCol: '#FFE3C0',
      rim: 3.0, rimPos: [7, 10, -6], rimCol: '#FFB070', fill: .6 });
    // la CUÑA del centro, tapizada de pantallas de arriba abajo
    const cuna = new THREE.Group(); cuna.position.set(.1, 0, -13); w.scene.add(cuna);
    const cuerpo = L.mesh(new THREE.CylinderGeometry(1.5, 1.9, 15, 3), clay2('#3A1A0C', .9));
    cuerpo.rotation.y = Math.PI; cuerpo.position.y = 7.5; cuna.add(cuerpo);
    // el panel grande (el de ~100 m) y debajo, letreros apilados SIN pared entre ellos
    const grande = pantalla(L, 2.5, 5.4, (g, W2, H2) => {
      g.fillStyle = '#1C0E05'; g.fillRect(0, 0, W2, H2); g.textAlign = 'center';
      g.fillStyle = '#FFD98A'; g.font = '700 26px "Space Grotesk"'; g.letterSpacing = '8px';
      g.fillText('SALE A BOLSA', W2 / 2, 120); g.letterSpacing = '0px';
      g.fillStyle = CREMA; g.font = '800 128px Unbounded'; g.fillText('ANT', W2 / 2, 300);
      g.fillStyle = '#9FD08A'; g.font = '800 86px Unbounded'; g.fillText('+34%', W2 / 2, 430);
      g.fillStyle = 'rgba(240,230,210,.45)'; g.font = '600 26px "Space Grotesk"';
      g.fillText('apertura  $111.50', W2 / 2, 495);
      g.fillStyle = 'rgba(240,230,210,.28)'; g.font = '600 24px "Space Grotesk"';
      g.fillText('19 · 11 · 2026', W2 / 2, 1120); }, 560);
    grande.position.set(0, 9.2, 1.62); cuna.add(grande);
    [[0, 4.6, 2.5, 3.0], [0, 2.2, 2.5, 2.0]].forEach(([x, y, aw, ah], i) => {
      const l = letrero(L, aw, ah, 21 + i); l.position.set(x, y, 1.62); cuna.add(l); });
    // dos torres laterales, también cubiertas
    [[-4.9, -11.5, 3.2, 13, 31], [5.2, -11, 3.0, 11, 44]].forEach(([x, z, aw, ah, sd]) => {
      const t = rbox(aw + .3, ah, 2.4, .1, clay2('#30150A', .9)); t.position.set(x, ah / 2, z); w.scene.add(t);
      for (let i = 0; i < 4; i++) { const h = ah / 4.6, l = letrero(L, aw, h, sd + i);
        l.position.set(x, 1.4 + i * (h + .28), z + 1.22); w.scene.add(l); } });
    // las escaleras rojas del TKTS, que es lo otro que identifica la plaza
    for (let i = 0; i < 7; i++) { const e = rbox(4.2, .22, .42, .03, clay2('#C23A28', .35));
      e.position.set(-.2, .18 + i * .2, 3.6 + i * .42); w.scene.add(e); }
    const gente = EQUIPO.map((o, i) => { const a = L.actor(o), x = [-2.9, -1.5, 1.6, 3.0][i];
      a.position.set(x, 0, -7.6 + (i % 2) * .8); a.rotation.y = Math.PI + x * .05; w.scene.add(a); return a; });
    // FUEGOS ARTIFICIALES (JP): tres estallidos escalonados, arriba
    const fuegos = [0, 1, 2].map(i => { const g = new THREE.Group(), r = L.rng(90 + i);
      g.position.set([-4.2, 1.8, 5.0][i], [12.5, 14.2, 11.6][i], -9 - i * 2);
      for (let j = 0; j < 34; j++) { const p2 = L.mesh(new THREE.SphereGeometry(.09, 7, 6),
          L.emit([MOSTAZA, '#FFD98A', TERRA, '#9FD08A'][i % 4], 1.6));
        const th = r() * 6.283, ph = Math.acos(2 * r() - 1), v = .7 + r() * .5;
        p2.userData = { dx: Math.sin(ph) * Math.cos(th) * v, dy: Math.cos(ph) * v, dz: Math.sin(ph) * Math.sin(th) * v };
        g.add(p2); }
      w.scene.add(g); return g; });
    // la pantalla del CIERRE: la misma torre, ya sin nadie, con la pregunta
    const preg = pantalla(L, 2.5, 5.4, (g, W2, H2) => {
      g.fillStyle = '#1C0E05'; g.fillRect(0, 0, W2, H2); g.textAlign = 'center';
      g.fillStyle = CREMA; g.font = 'italic 600 70px "Instrument Serif"';
      ['¿Cuántas veces', 'te has quedado', 'solo con', 'el titular?'].forEach((l, i) => g.fillText(l, W2 / 2, 330 + i * 92));
      g.fillStyle = 'rgba(240,230,210,.4)'; g.font = '600 26px "Space Grotesk"';
      g.fillText('Desde la costa, todo se ve con claridad.', W2 / 2, 840); }, 560);
    preg.position.set(0, 9.2, 1.63); preg.material.opacity = 0; cuna.add(preg);
    const solo = L.actor(INV); solo.position.set(.3, 0, -6.4); solo.rotation.y = Math.PI; solo.scale.setScalar(.001); w.scene.add(solo);
    const conf = new THREE.Group(); w.scene.add(conf); const rc = L.rng(17);
    for (let i = 0; i < 80; i++) { const c = rbox(.11, .11, .018, .01, clay2([MOSTAZA, CREMA, TERRA, AZUL][i % 4], .5));
      c.userData = { x: -5 + rc() * 10, z: -9 + rc() * 6, y0: 9 + rc() * 7, sp: .9 + rc() * 1.1, r: rc() * 6 };
      conf.add(c); }
    return { ...w, grande, preg, solo, gente, fuegos, conf };
  },
};

// ───── helpers de gráfica: ejes, escalera y carrito (reglas permanentes del 20 nov) ─────
const ejes = (L, anc, alt, marcas) => {           // eje X y eje Y visibles, con marcas rotuladas
  const { THREE, clay2, rbox } = L, g = new THREE.Group();
  const ejeY = rbox(.045, alt, .045, .01, clay2('#6A3A1E', .6)); ejeY.position.set(0, alt / 2, 0); g.add(ejeY);
  const ejeX = rbox(anc, .045, .045, .01, clay2('#6A3A1E', .6)); ejeX.position.set(anc / 2, 0, 0); g.add(ejeX);
  marcas.forEach(([frac, txt]) => {
    const m = rbox(.16, .03, .03, .01, clay2('#6A3A1E', .6)); m.position.set(-.07, alt * frac, 0); g.add(m);
    const r = rbox(anc, .012, .012, .005, clay2('#8A5230', .7)); r.position.set(anc / 2, alt * frac, -.02); g.add(r);
    const e = L.label3d(txt, .95, .2, { bg: null, ink: '#8A5230', font: '700 44px "Space Grotesk"', pw: 300 });
    e.material.transparent = true; e.material.depthWrite = false; e.position.set(-.62, alt * frac, 0); g.add(e); });
  return g;
};
// el precio como RECORRIDO: una vía de bloques por la que va un carrito (estilo SpaceX)
const via = (L, pts, anc, alt) => {
  const { THREE, clay2, rbox } = L, g = new THREE.Group(), mn = 78, mx = 118;
  const X = i => (i / (pts.length - 1)) * anc, Y = v => ((v - mn) / (mx - mn)) * alt;
  const P2 = pts.map((v, i) => [X(i), Y(v)]);
  for (let i = 0; i < P2.length - 1; i++) {
    const [x0, y0] = P2[i], [x1, y1] = P2[i + 1], dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    const t = rbox(len, .12, .34, .04, clay2(MOSTAZA, .5));
    t.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); t.rotation.z = Math.atan2(dy, dx); g.add(t); }
  g.userData.at = f => { const u = Math.max(0, Math.min(.999, f)) * (P2.length - 1), i = Math.floor(u), k = u - i;
    const [x0, y0] = P2[i], [x1, y1] = P2[Math.min(i + 1, P2.length - 1)];
    return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, a: Math.atan2(y1 - y0, x1 - x0) }; };
  return g;
};
const carrito = (L) => {
  const { THREE, clay2, rbox } = L, g = new THREE.Group();
  const caja = rbox(.62, .3, .46, .06, clay2(TERRA, .55)); caja.position.y = .26; g.add(caja);
  [-.22, .22].forEach(x => { const r = L.mesh(new THREE.CylinderGeometry(.12, .12, .07, 16), clay2('#2A1409', .4));
    r.rotation.x = Math.PI / 2; r.position.set(x, .12, .25); g.add(r); });
  return g;
};

Object.assign(worlds, {
  // ───── 3, 4 y 5 · LA SALA: columnas con ejes, la vía del precio, la multitud con el periódico ─────
  sala(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#C47A4A', bg2: '#6A3418', floor: '#A05C30', fog: [34, 110], hemi: .78,
      sky: '#FFD9AE', ground: '#6A3C20', key: 3.2, keyPos: [-10, 14, 11], keyCol: '#FFE6C6',
      rim: 2.6, rimPos: [8, 9, -5], rimCol: '#FFAE72', fill: .58 });
    const muro = rbox(26, 18, .5, .1, clay2('#B06A3C', .94)); muro.position.set(0, 8, -8.6); w.scene.add(muro);
    // COLUMNAS VERTICALES con ejes (JP: "que sean columnas verticales y que se vea el eje X, eje Y")
    const col = new THREE.Group(); col.position.set(-1.3, .5, -5.6); w.scene.add(col);
    col.add(ejes(L, 2.5, 4.3, [[0, '0'], [.333, '30'], [.666, '60'], [1, '90']]));
    const barra = (x, v, c) => { const h = 4.3 * v / 90, b = rbox(.64, h, .64, .05, clay2(c, .6));
      const gr = new THREE.Group(); b.position.y = h / 2; gr.add(b); gr.position.set(x, 0, 0);
      gr.scale.y = .001; col.add(gr); return gr; };
    const bSx = barra(.85, 75, CREMA), bAn = barra(1.85, 81.3, AZUL);
    const rot = (txt, x, ink) => { const e = L.label3d(txt, 1.35, .62, { bg: null, ink, font: '700 38px "Space Grotesk"', pw: 400 });
      e.material.transparent = true; e.material.depthWrite = false; e.position.set(x, -.42, .1); e.scale.setScalar(.001); col.add(e); return e; };
    const eSx = rot('SpaceX\n$75 mil M', .85, '#5A2E14'), eAn = rot('ANT\n$81.3 mil M', 1.85, '#1E3C7A');
    const uni = L.label3d('miles de millones de dólares', 1.9, .18, { bg: null, ink: '#8A5230', font: '600 34px "Space Grotesk"', pw: 520 });
    uni.material.transparent = true; uni.material.depthWrite = false; uni.rotation.z = Math.PI / 2;
    uni.position.set(-1.05, 2.2, 0); col.add(uni);
    // LA VÍA DEL PRECIO con su carrito
    const vg = new THREE.Group(); vg.position.set(-1.5, .7, -4.2); w.scene.add(vg);
    vg.add(ejes(L, 3.0, 3.7, [[0, '$83'], [.5, '$100'], [1, '$118']]));
    const v = via(L, PRECIO, 3.0, 3.7); vg.add(v);
    const cart = carrito(L); vg.add(cart);
    const pilo = L.actor(INV); pilo.scale.setScalar(.42); cart.add(pilo);
    pilo.position.y = .38;
    // LA MULTITUD CON EL MISMO PERIÓDICO
    const diarios = [], lectores = EQUIPO.map((o, i) => {
      const a = L.actor(o), x = [-1.95, -.65, .65, 1.95][i];
      a.position.set(x, 0, -1.4 + (i % 2) * .55); a.rotation.y = Math.PI + x * .06; a.scale.setScalar(.001); w.scene.add(a);
      const d = pantalla(L, .78, .56, (g, W2, H2) => {
        g.fillStyle = '#EDE7D4'; g.fillRect(0, 0, W2, H2); g.textAlign = 'center';
        g.fillStyle = TERRA; g.font = '800 78px Unbounded'; g.fillText('+17%', W2 / 2, H2 / 2 + 26); }, 300);
      d.material.emissiveIntensity = .25;
      d.position.set(x, 1.62, -1.4 + (i % 2) * .55 + .45); d.rotation.x = -.35; d.scale.setScalar(.001);
      w.scene.add(d); diarios.push(d); return a; });
    return { ...w, col, bSx, bAn, eSx, eAn, vg, v, cart, pilo, lectores, diarios };
  },
});

Object.assign(worlds, {
  // ───── 6 a 9 · EL TALLER: la escalera de ingresos y el waterfall ─────
  taller(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#E0A571', bg2: '#A05C30', floor: '#C98A58', fog: [38, 120], hemi: .86,
      sky: '#FFE6C8', ground: '#8A5230', key: 3.4, keyPos: [-10, 15, 11], keyCol: '#FFF0DC',
      rim: 2.4, rimPos: [8, 9, -5], rimCol: '#FFC48A', fill: .64 });
    const muro = rbox(28, 20, .5, .1, clay2('#D69A66', .94)); muro.position.set(0, 9, -9); w.scene.add(muro);

    // ESCALERA DE INGRESOS (regla: ventas → el personaje SUBE escaleras, un escalón por periodo)
    const esc = new THREE.Group(); esc.position.set(-1.9, 0, -4.6); w.scene.add(esc);
    const ING = [[2024, 1.0], [2025, 4.1], [2026, 33.242]];      // miles de millones, 9 meses en 2026
    const alturas = ING.map(([, v]) => .35 + Math.sqrt(v / 33.242) * 2.55);   // raíz: si no, los dos primeros no se ven
    const pelda = ING.map(([a, v], i) => { const h = alturas[i];
      const b = rbox(1.15, h, 1.3, .05, clay2(i === 2 ? MOSTAZA : '#C08A5E', .6));
      const g = new THREE.Group(); b.position.y = h / 2; g.add(b); g.position.set(i * 1.2, 0, 0);
      g.scale.y = .001; esc.add(g);
      const e = L.label3d(String(a) + (i === 2 ? '\n$33,242 M' : ''), 1.1, i === 2 ? .5 : .24,
        { bg: null, ink: '#5A2E14', font: '700 40px "Space Grotesk"', pw: 330 });
      e.material.transparent = true; e.material.depthWrite = false;
      e.position.set(i * 1.2, -.3, .7); esc.add(e); return g; });
    const trepa = L.actor(INV); trepa.position.set(-.9, 0, .95); esc.add(trepa);

    // WATERFALL (JP: "hay que hacerlo como un waterfall, ingresos, costos, utilidades")
    // Dos escalas, porque el ajuste contable aplasta todo lo demás: primero el negocio, luego el salto.
    const cascada = (datos, anc, alt, tope) => {
      const g = new THREE.Group(); let acum = 0;
      const col = datos.map(([etq, val, tipo], i) => {
        const y0 = tipo === 'total' ? 0 : acum, y1 = tipo === 'total' ? val : acum + val;
        if (tipo !== 'total') acum += val;
        const a0 = Math.min(y0, y1) / tope * alt, a1 = Math.max(y0, y1) / tope * alt, h = Math.max(.05, a1 - a0);
        const c = val >= 0 && tipo !== 'total' ? MOSTAZA : (tipo === 'total' ? '#8A5230' : TERRA);
        const b = rbox(anc * .62, h, .5, .04, clay2(c, .6));
        const gr = new THREE.Group(); b.position.y = h / 2; gr.add(b);
        gr.position.set(i * anc, a0, 0); gr.scale.y = .001; g.add(gr);
        const e = L.label3d(etq, anc * .96, .46, { bg: null, ink: '#5A2E14', font: '700 34px "Space Grotesk"', pw: 330 });
        e.material.transparent = true; e.material.depthWrite = false;
        e.position.set(i * anc, -.42, .3); g.add(e);
        return gr; });
      return { g, col };
    };
    // beat A · el negocio: ingresos − gastos = pérdida de operación (escala 35,000)
    const wa = cascada([['Ingresos\n33,242', 33242, 'sube'], ['Gastos\n−34,502', -34502, 'baja'],
                        ['Operación\n−1,260', -1260, 'total']], 1.05, 4.0, 35000);
    wa.g.position.set(-1.05, .9, -4.2); w.scene.add(wa.g);
    // beat B · el salto: la operación es una rayita al lado del ajuste contable (escala 104,039)
    const wb = cascada([['Operación\n−1,260', -1260, 'total'], ['Ajuste en libros\n−94,324', -94324, 'baja'],
                        ['Intereses, otros\ne impuestos\n−8,455', -8455, 'baja'], ['PÉRDIDA NETA\n−104,039', -104039, 'total']],
                       .95, 4.4, 104039);
    wb.g.position.set(-1.42, 1.0, -4.2); wb.g.visible = false; w.scene.add(wb.g);
    const baja = L.actor(INV); baja.position.set(2.6, 0, -2.6); baja.rotation.y = -.5; w.scene.add(baja);
    // CALLOUT (JP: "eso valdría la pena ponerlo como un call out en el waterfall")
    const callout = pantalla(L, 2.6, 1.35, (g, W2, H2) => {
      g.fillStyle = '#FBF5E6'; g.fillRect(0, 0, W2, H2);
      g.strokeStyle = TERRA; g.lineWidth = 7; g.strokeRect(4, 4, W2 - 8, H2 - 8);
      g.textAlign = 'center'; g.fillStyle = '#5A2E14'; g.font = '700 34px "Space Grotesk"';
      g.fillText('DE CADA $100 QUE VENDIÓ', W2 / 2, 62);
      g.fillStyle = TERRA; g.font = '800 72px Unbounded'; g.fillText('perdió $3.79', W2 / 2, 164);
      g.fillStyle = 'rgba(90,46,20,.62)'; g.font = '600 32px "Space Grotesk"';
      g.fillText('un año antes perdía $205', W2 / 2, 222); }, 680);
    callout.material.emissiveIntensity = .3;
    callout.position.set(.4, 4.4, -3.4); callout.scale.setScalar(.001); w.scene.add(callout);
    return { ...w, pelda, alturas, trepa, wa, wb, baja, callout };
  },
});

// rótulo con autoajuste; `dos` = remate en dos tiempos
const head = (L, k1, title, sub, ink, lt, col, pronto, dos) => {
  L.kicker(k1, 360, L.seg(lt, pronto ? .02 : .1, pronto ? .3 : .5), ink);
  const largo = Math.max(...title.map(l => l.length));
  const ts = largo > 18 ? Math.max(54, Math.floor(78 * 18 / largo)) : 78;
  title.forEach((ln, i) => { const t0 = (pronto ? .04 : .25) + i * (dos && i ? .3 : .1);
    L.rise(ln, 90, 470 + i * 96, L.seg(lt, t0, t0 + .36),
      { f: L.F.d, w: 800, s: ts, c: i === title.length - 1 && col ? col : ink }); });
  if (sub) L.rise(sub, 90, 470 + title.length * 96 - 24, L.seg(lt, pronto ? .74 : .7, pronto ? 1.16 : 1.2),
    { s: sub.length > 46 ? Math.max(27, Math.floor(38 * 46 / sub.length)) : 38, c: ink, a: .8 });
};
const caeConfeti = (L, conf, q, k, desde) => conf.children.forEach((c, i) => {
  const u = c.userData, y = u.y0 - (desde + k) * u.sp * 22 - i * .035;
  c.visible = y > .1 && y < 14; c.position.set(u.x + Math.sin(q * 1.4 + u.r) * .45, y, u.z);
  c.rotation.set(q * 2 + u.r, q * 1.6 + u.r, 0); });

// SONIDO: 7 efectos en toda la pieza (regla del 20 nov: máximo 6–8, ninguno repetido seguido)
const scenes = [
  // 1 · GANCHO — el botón: discurso, el equipo aplaude, cae confeti. Se entiende sin una palabra.
  { id: 'boton', world: 'nasdaq', d: 7, ink: ARENA, year: '2026', sfx: [[.1, 'applause', .6, .7]],
    cap: 'Le quitó el récord a SpaceX. Abrió ganando 34%… y cerró ganando 17.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = L.talkAt(L.CAPS, q);
      const k = L.eio(L.seg(p, .08, 1));
      cam(w, mv([-1.4, 3.9, 14.2], [.5, 3.4, 11.4], k), mv([0, 3.9, -5.4], [0, 3.6, -5.4], k), 30);
      const pulsa = L.eio(L.seg(p, .16, .3));
      w.boton.position.y = 1.16 - pulsa * .05 + (p > .36 ? .05 : 0);
      L.pose(w.orador, { talk, head: [0, .06, 0], armL: [.5, .3, .6], armR: [1.1 * L.seg(p, .3, .5), .4, .4], smile: .5, bob: Math.sin(q * 1.8) * .02 });
      w.gente.forEach((a, i) => { const s2 = L.eio(L.seg(p, .2 + i * .05, .44 + i * .05));
        L.pose(a, { armL: [1.7 * s2 + Math.sin(q * 9 + i) * .22 * s2, .5, .3], armR: [1.7 * s2 - Math.sin(q * 9 + i) * .22 * s2, .5, .3],
          smile: .7, bob: Math.sin(q * 4.5 + i) * .05 * s2, amp: .2 }); });
      caeConfeti(L, w.conf, q, L.seg(p, .3, 1), 0);
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .66);
      head(L, 'ANTHROPIC · 19 DE NOVIEMBRE DE 2026', ['Le quitó el récord', 'a SpaceX'], null, ARENA, p, null, true, true);
      L.rise('ABRIÓ EN +34%  ·  CERRÓ EN +17%', 90, 690, L.seg(p, .42, .66), { f: L.F.d, w: 800, s: 44, c: MOSTAZA });
    } },

  // 2 · TIMES SQUARE — otro lugar (va con ola), fachadas de pantallas y FUEGOS ARTIFICIALES.
  { id: 'plaza', world: 'plaza', d: 6, ink: ARENA, year: '2026', sfx: [[.22, 'rise', .5]],
    cap: 'El 19 de noviembre de 2026, Anthropic salió a la bolsa.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-1.6, 4.4, 10.5], [.5, 5.2, 7.6], k), mv([.1, 10.2, -13], [.1, 10.6, -13], k), 30);
      w.grande.material.opacity = 1; w.preg.material.opacity = 0; w.solo.scale.setScalar(.001);
      caeConfeti(L, w.conf, q, L.seg(p, 0, 1), .55);
      w.fuegos.forEach((g, j) => { const e = L.seg(p, .1 + j * .22, .1 + j * .22 + .5);
        g.visible = e > .001 && e < .999;
        g.children.forEach(pt => { const u = pt.userData, r = e * 3.1;
          pt.position.set(u.dx * r, u.dy * r - e * e * 1.5, u.dz * r);
          pt.scale.setScalar(Math.max(.001, 1 - e * .8)); }); });
      w.gente.forEach((a, i) => L.pose(a, { armL: [1.6, .5, .3], armR: [1.6, .5, .3], smile: .7, bob: Math.sin(q * 4 + i) * .05, amp: .2 }));
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1000, .6);
      head(L, 'NASDAQ · SÍMBOLO ANT', ['Anthropic sale', 'a la bolsa'], null, ARENA, p, MOSTAZA);
    } },

  // 3 · EL RÉCORD — columnas VERTICALES con eje X y eje Y (JP). Otro mundo: entra con ola.
  { id: 'record', world: 'sala', d: 7, ink: TINTA, year: '2026', sfx: [[.52, 'thud', .55]],
    cap: 'Levantó 81 mil millones de dólares. Nunca una empresa había levantado tanto.',
    update(w, lt, t, L) {
      const p = P(lt, this);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-.9, 3.6, 9.4], [.4, 3.4, 8.2], k), mv([0, 3.9, -5.6], [0, 3.75, -5.6], k), 30);
      w.vg.visible = false; w.lectores.forEach(a => a.scale.setScalar(.001)); w.diarios.forEach(d => d.scale.setScalar(.001));
      w.bSx.scale.y = Math.max(.001, L.eio(L.seg(p, .14, .46)));
      w.bAn.scale.y = Math.max(.001, L.eio(L.seg(p, .4, .78)));
      w.eSx.scale.setScalar(Math.max(.001, L.back(L.seg(p, .4, .56))));
      w.eAn.scale.setScalar(Math.max(.001, L.back(L.seg(p, .68, .84))));
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .52, '196,122,74');
      head(L, 'LA MÁS GRANDE DE LA HISTORIA', ['81,300 millones', 'de dólares'], 'Le ganó el récord a SpaceX, de junio', TINTA, p, MOSTAZA);
    } },

  // 4 · EL PRECIO — el personaje va EN UN CARRITO sobre la vía (regla permanente, estilo SpaceX).
  { id: 'precio', world: 'sala', d: 8, ink: TINTA, year: '2026', sfx: [[.58, 'fall', .6]],
    cap: 'Vendió sus acciones en 83 dólares. Abrieron en 111… y el primer día cerraron en 97.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.col.visible = false; w.vg.visible = true;
      w.lectores.forEach(a => a.scale.setScalar(.001)); w.diarios.forEach(d => d.scale.setScalar(.001));
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-.6, 3.3, 10.2], [.4, 3.1, 9.0], k), mv([0, 3.5, -4.2], [0, 3.4, -4.2], k), 30);
      const f = L.eio(L.seg(p, .1, .92)), pt = w.v.userData.at(f);
      w.cart.position.set(pt.x, pt.y + .06, 0); w.cart.rotation.z = pt.a * .6;
      L.pose(w.pilo, { armL: [1.5, .6, .3], armR: [1.5, .6, .3], head: [-.1, 0, 0],
        smile: pt.a > 0 ? .6 : -.5, bob: Math.sin(q * 7) * .03, amp: .2 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .52, '196,122,74');
      head(L, 'EL DÍA DEL DEBUT', ['Colocó en $83.', 'Abrió en $111.50'], 'Cerró su primer día en $97.17', TINTA, p, MOSTAZA);
    } },

  // 5 · EL TITULAR — todos leyendo el MISMO periódico: así se ve "casi todos se quedaron con eso".
  { id: 'titular', world: 'sala', d: 6, ink: TINTA, year: '2026', sfx: [[.2, 'pop', .5]],
    cap: 'Casi todos los titulares se quedaron con ese 17%.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.col.visible = false; w.vg.visible = false;
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-.6, 3.1, 14.6], [.5, 3.0, 13.0], k), mv([0, 2.9, -1.4], [0, 2.85, -1.4], k), 30);
      w.lectores.forEach((a, i) => { const s2 = L.back(L.seg(p, .08 + i * .07, .32 + i * .07));
        a.scale.setScalar(Math.max(.001, s2));
        L.pose(a, { armL: [1.15, .34, .9], armR: [1.15, .34, .9], head: [-.3, 0, 0], smile: .35, bob: Math.sin(q * 1.6 + i) * .012 });
        w.diarios[i].scale.setScalar(Math.max(.001, s2)); });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .54, '196,122,74');
      head(L, 'LO QUE SE CONTÓ', ['Casi todos se', 'quedaron con eso'], null, TINTA, p, TERRA);
    } },

  // 6 · LOS INGRESOS — el personaje SUBE la escalera, un escalón por año (regla permanente, estilo Jobs).
  { id: 'ingresos', world: 'taller', d: 8, ink: TINTA, year: '2026', sfx: [[.74, 'rise', .55]],
    cap: 'Pero el documento que entregó a la bolsa cuenta otra cosa. En nueve meses vendió 33 mil millones.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.wa.g.visible = false; w.wb.g.visible = false; w.callout.scale.setScalar(.001); w.baja.visible = false;
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-1.3, 3.2, 13.6], [.4, 3.6, 12.2], k), mv([-.1, 2.9, -4.6], [-.1, 3.2, -4.6], k), 30);
      w.pelda.forEach((g, i) => g.scale.y = Math.max(.001, L.eio(L.seg(p, .1 + i * .14, .34 + i * .14))));
      // sube escalón por escalón: cada tramo camina y luego brinca al siguiente
      const prog = L.seg(p, .18, .9) * 3, i = Math.min(2, Math.floor(prog)), f = prog - i;
      const y0 = i === 0 ? 0 : w.alturas[i - 1], y1 = w.alturas[i];
      w.trepa.position.set(-.9 + Math.min(prog, 3) * 1.2 * .92, L.lerp(y0, y1, L.eio(Math.min(1, f * 1.6))), .95);
      L.pose(w.trepa, { walk: q * 7, amp: .7, armL: [.7, .3, .5], armR: [.7, .3, .5], head: [-.15, 0, 0], lean: .1, smile: .4 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .5, '224,165,113');
      head(L, 'LO QUE DICE EL DOCUMENTO', ['Vendió $33,242', 'millones'], 'En los primeros nueve meses de 2026', TINTA, p, MOSTAZA);
    } },

  // 7 · EL WATERFALL DEL NEGOCIO — ingresos − gastos = pérdida de operación. El personaje BAJA al final.
  { id: 'cascada', world: 'taller', d: 8, ink: TINTA, year: '2026', sfx: [[.62, 'thud', .55]],
    cap: 'Gastó 34 mil. Así que el negocio perdió 1,260 millones.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.pelda.forEach(g => g.scale.y = .001); w.trepa.visible = false;
      w.wa.g.visible = true; w.wb.g.visible = false; w.baja.visible = true; w.callout.scale.setScalar(.001);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-.8, 3.5, 9.8], [.4, 3.3, 8.6], k), mv([0, 3.7, -4.2], [0, 3.55, -4.2], k), 30);
      w.wa.col.forEach((g, i) => g.scale.y = Math.max(.001, L.eio(L.seg(p, .1 + i * .2, .36 + i * .2))));
      L.pose(w.baja, { head: [-.2, -.5, 0], armL: [.3, .2, .3], armR: [.3, .2, .3],
        lean: L.seg(p, .5, .8) * .16, bob: Math.sin(q * 1.6) * .012, smile: -.4 * L.seg(p, .5, .8) });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .5, '224,165,113');
      head(L, 'EL NEGOCIO, SIN CONTABILIDAD', ['Gastó $34,502.', 'Perdió $1,260'], 'Ingresos menos gastos de operación', TINTA, p, TERRA);
    } },

  // 8 · EL CALLOUT dentro del waterfall (JP): de cada $100, perdió $3.80. Plano más cerrado.
  { id: 'callout', world: 'taller', d: 7, ink: TINTA, year: '2026', sfx: [[.14, 'shine', .5]],
    cap: 'De cada 100 dólares que vendió, perdió 3.79. Un año antes perdía 205.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.pelda.forEach(g => g.scale.y = .001); w.trepa.visible = false;
      w.wa.g.visible = true; w.wb.g.visible = false; w.baja.visible = true;
      w.wa.col.forEach(g => g.scale.y = 1);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([.4, 3.3, 8.6], [.45, 4.1, 5.4], k), mv([0, 3.55, -4.2], [.4, 4.5, -3.4], k), 30);
      w.callout.scale.setScalar(Math.max(.001, L.back(L.seg(p, .1, .34))));
      L.pose(w.baja, { head: [0, -.6, 0], lean: .16, bob: Math.sin(q * 1.6) * .012, smile: -.3 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      // sin head(): el callout de la maqueta YA dice la cifra, y repetirla la encimaba consigo misma
      L.scrim(L.C, 300, 560, .42, '224,165,113');
      L.kicker('EL MARGEN DE OPERACIÓN', 360, L.seg(p, .08, .4), TINTA);
    } },

  // 9 · EL SALTO — la pérdida de operación es una rayita al lado del ajuste contable.
  { id: 'ajuste', world: 'taller', d: 9, ink: TINTA, year: '2026', sfx: [[.3, 'whoosh', .55]],
    cap: '¿Y los 104 mil millones del titular? 94 mil nunca salieron de la caja: son un ajuste en los libros.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.pelda.forEach(g => g.scale.y = .001); w.trepa.visible = false; w.callout.scale.setScalar(.001);
      w.wa.g.visible = false; w.wb.g.visible = true; w.baja.visible = true;
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-.7, 3.8, 12.4], [.5, 3.6, 11.0], k), mv([0, 4.1, -4.2], [0, 3.9, -4.2], k), 30);
      w.wb.col.forEach((g, i) => g.scale.y = Math.max(.001, L.eio(L.seg(p, .06 + i * .17, .3 + i * .17))));
      L.pose(w.baja, { head: [-.5, -.4, 0], lean: .1, armL: [.2, .18, .2], armR: [.2, .18, .2], bob: Math.sin(q * 1.6) * .012, smile: -.5 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .5, '224,165,113');
      head(L, 'DE DÓNDE SALEN LOS $104,039 M', ['$94,324 millones', 'nunca salieron'], 'Un ajuste en los libros: nadie firmó un cheque', TINTA, p, TERRA);
    } },

  // 10 · CIERRE — vuelve la plaza, ya sin nadie, y la pantalla lleva la pregunta. El bookend del gancho.
  { id: 'pregunta', world: 'plaza', d: 8, ink: ARENA, year: '2026', sfx: [],
    cap: 'La utilidad neta te dice qué quedó hasta abajo. No te dice cómo va el negocio. ¿Cuántas veces te has quedado solo con el titular?',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const cam2 = L.seg(p, .3, .48);
      w.grande.material.opacity = 1 - cam2; w.preg.material.opacity = cam2;
      w.conf.children.forEach(c => c.visible = false); w.fuegos.forEach(g => g.visible = false);
      w.gente.forEach(a => a.scale.setScalar(.001));
      w.solo.scale.setScalar(1);
      L.pose(w.solo, { head: [-.3, 0, 0], armL: [.1, .12, .1], armR: [.1, .12, .1], bob: Math.sin(q * 1.4) * .012 });
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([.4, 4.0, 9.6], [.2, 4.6, 7.4], k), mv([.1, 10.0, -13], [.1, 9.6, -13], k), 30);
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 1380, 1920, .72);
      L.rise('La utilidad neta no te dice cómo va el negocio.', 540, 1560, L.seg(p, .1, .5),
        { s: 34, c: ARENA, a: .85, al: 'center' });
      L.rise('Guion asistido por Claude, producto de Anthropic.', 540, 1716, L.seg(p, .5, .84),
        { s: 23, c: ARENA, a: .6, al: 'center' });
      L.rise('Contenido educativo. No es asesoría financiera.', 540, 1752, L.seg(p, .54, .88),
        { s: 23, c: ARENA, a: .6, al: 'center' });
    } },
];

export default { id: '2026-11-20-ANT-short3d', title: 'Anthropic sale a la bolsa', tail: 1.3, worlds, scenes };
