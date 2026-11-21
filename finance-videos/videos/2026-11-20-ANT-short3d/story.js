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

// el recorrido real, media hora a media hora, de los DOS días (Yahoo Finance, velas de 30 min).
// Empieza en la colocación de $83, abre en $111.50 y termina en el cierre del viernes: $88.91.
const PRECIO = [83.0, 111.5, 105.03, 100.86, 96.69, 96.83, 95.75, 96.79, 96.34, 95.09, 96.91, 92.1, 86.94, 87.12, 87.74, 86.46, 84.38, 84.86, 85.23, 87.18, 87.92, 86.64, 87.36, 88.44, 88.91];

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
      // logo oficial (anthropic.com) + nombre, centrados como BLOQUE y medidos de verdad con
      // measureText: calcular el ancho a ojo fue lo que cortó "Anthropic" en la vuelta anterior.
      const im = L.IMGS.anthropic, LG = 92, GAP = 22;
      g.font = '800 76px Unbounded'; g.textBaseline = 'alphabetic'; g.textAlign = 'left';
      const wn = g.measureText('Anthropic').width, total = (im ? LG + GAP : 0) + wn, x0 = (W2 - total) / 2;
      if (im) g.drawImage(im, x0, 62, LG, LG);
      g.fillStyle = CREMA; g.fillText('Anthropic', x0 + (im ? LG + GAP : 0), 136);
      g.textAlign = 'center';
      g.fillStyle = '#9FD08A'; g.font = '800 68px Unbounded'; g.fillText('ANT   +34%', W2 / 2, 250);
      g.fillStyle = '#FFD98A'; g.font = '700 22px "Space Grotesk"'; g.letterSpacing = '7px';
      g.fillText('PRIMER DÍA DE COTIZACIÓN', W2 / 2, 322); g.letterSpacing = '0px'; }, 760);
    pant.position.set(0, 4.3, -9.1); w.scene.add(pant);
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

  // ───── 2 y 9 · NUEVA YORK: cielo azul, sol, nubes, edificios con ventanas y gente, coches ─────
  // JP: "que tengan ventanas, luces, que haya gente, que se vean las sombras, coches, muchos edificios...
  //      el fondo azul para que se vea como el cielo, nubes, el sol, literal una escena realista de NY".
  // Times Square de verdad: las fachadas son pantallas por ley, el edificio en cuña, los letreros apilados.
  plaza(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#6FA8DC', bg2: '#2E5F96', floor: '#6A5A4A', fog: [50, 170], hemi: 1.15,
      sky: '#BFE0FF', ground: '#8A7458', key: 4.2, keyPos: [-7, 18, 16], keyCol: '#FFF8EC',
      rim: 2.0, rimPos: [8, 11, -6], rimCol: '#CFE4FF', fill: .95 });
    // CIELO: sol y nubes de plastilina, bien arriba
    const sol = L.mesh(new THREE.SphereGeometry(1.5, 22, 16), L.emit('#FFE9A8', 1.5));
    sol.position.set(-7.5, 24, -26); w.scene.add(sol);
    const nube = (x, y, z, s) => { const g = new THREE.Group();
      [[0,0,0,1],[.9,-.15,.1,.72],[-.95,-.1,-.05,.66],[.35,.4,.05,.6]].forEach(([a,b,c,r]) => {
        const e = L.mesh(new THREE.SphereGeometry(r, 18, 12), clay2('#FFFFFF', .98, .3));
        e.position.set(a, b, c); g.add(e); });
      g.position.set(x, y, z); g.scale.setScalar(s); w.scene.add(g); return g; };
    const nubes = [nube(-9, 17.5, -19, 1.5), nube(6.5, 19.5, -21, 1.9), nube(1, 22.5, -24, 1.2)];
    // EDIFICIOS: nueve, con ventanas y siluetas de gente dentro
    const rb = L.rng(5);
    const edificio = (x, z, anc, alt, prof, col, sem) => {
      const e = rbox(anc, alt, prof, .1, clay2(col, .92)); e.position.set(x, alt / 2, z); w.scene.add(e);
      const r = L.rng(sem), cols = Math.max(2, Math.round(anc / .62)), filas = Math.round(alt / .92);
      for (let i = 0; i < cols; i++) for (let j = 1; j < filas; j++) {
        const on = r() > .42;
        const v = rbox(.34, .44, .05, .02, on ? L.emit('#FFE7B0', .55) : clay2('#3E4A5A', .7));
        v.position.set(x - anc / 2 + .42 + i * ((anc - .84) / Math.max(1, cols - 1)), j * .92, z + prof / 2 + .03);
        w.scene.add(v);
        // silueta de alguien adentro, en algunas ventanas encendidas
        if (on && r() > .62) { const si = rbox(.1, .2, .03, .02, clay2('#2A2018', .8));
          si.position.set(v.position.x + (r() - .5) * .1, j * .92 - .04, z + prof / 2 + .06); w.scene.add(si); } }
    };
    [[-7.6,-15,2.6,11,2.4,'#C08A68',11],[-4.6,-18,2.4,15,2.2,'#A87254',12],[4.9,-14.5,2.8,9.5,2.4,'#CE9A78',13],
     [7.8,-17,2.6,13,2.2,'#B07A5A',14],[-10.5,-21,3.0,17,2.6,'#96644A',15],[10.8,-20,2.8,15,2.4,'#A27052',16],
     [-2.2,-24,2.4,20,2.2,'#8A5C42',17],[3.0,-25,2.6,22,2.4,'#7E5440',18]
    ].forEach(a => edificio(...a));
    // LA CUÑA con la pantalla (One Times Square)
    const cuna = new THREE.Group(); cuna.position.set(.1, 0, -12.5); w.scene.add(cuna);
    const cuerpo = L.mesh(new THREE.CylinderGeometry(1.5, 1.9, 15, 3), clay2('#8A5C40', .9));
    cuerpo.rotation.y = Math.PI; cuerpo.position.y = 7.5; cuna.add(cuerpo);
    // la pantalla: FONDO NEGRO y el logo oficial al lado del ticker (JP)
    const panel = (dib) => { const pl = pantalla(L, 2.5, 3.1, dib, 560); pl.position.set(0, 8.2, 1.62); cuna.add(pl); return pl; };
    const grande = panel((g, W2, H2) => {
      g.fillStyle = '#000000'; g.fillRect(0, 0, W2, H2); g.textAlign = 'center';
      const im = L.IMGS.anthropic;
      if (im) { const d = 150; g.drawImage(im, (W2 - d) / 2, 60, d, d); }
      g.fillStyle = '#F4EFE2'; g.font = '800 96px Unbounded'; g.fillText('ANT', W2 / 2, 300);
      g.fillStyle = '#7FD08A'; g.font = '800 76px Unbounded'; g.fillText('+34%', W2 / 2, 400);
      g.fillStyle = 'rgba(244,239,226,.5)'; g.font = '600 24px "Space Grotesk"';
      g.fillText('apertura  $111.50  ·  19 nov 2026', W2 / 2, 452);
      g.fillStyle = 'rgba(244,239,226,.3)'; g.font = '600 22px "Space Grotesk"';
      g.fillText('SALE A BOLSA', W2 / 2, 650); });
    // la pantalla del cierre: la pregunta ARRIBA, para que no choque con el ticker (JP)
    const preg = panel((g, W2, H2) => {
      g.fillStyle = '#000000'; g.fillRect(0, 0, W2, H2); g.textAlign = 'center';
      g.fillStyle = '#F4EFE2'; g.font = 'italic 600 58px "Instrument Serif"';
      ['¿Cuántas veces', 'te has quedado', 'solo con', 'el titular?'].forEach((l, i) => g.fillText(l, W2 / 2, 120 + i * 74));
      g.fillStyle = 'rgba(244,239,226,.38)'; g.font = '600 24px "Space Grotesk"';
      g.fillText('Desde la costa, todo se ve con claridad.', W2 / 2, 470); });
    preg.material.opacity = 0;
    [[0, 5.4, 2.4, 1.9], [0, 3.2, 2.4, 1.7]].forEach(([x, y, aw, ah], i) => {
      const l = letrero(L, aw, ah, 21 + i); l.position.set(x, y, 1.62); cuna.add(l); });
    // COCHES en la calle, cruzando
    const coche = (col, x, z, dir) => { const g = new THREE.Group();
      g.add(rbox(1.5, .42, .74, .12, clay2(col, .45)));
      const t = rbox(.8, .34, .68, .1, clay2(col, .45)); t.position.set(-.1, .36, 0); g.add(t);
      [[-.5,.33],[.5,.33],[-.5,-.33],[.5,-.33]].forEach(([a,b]) => {
        const r2 = L.mesh(new THREE.CylinderGeometry(.17,.17,.1,14), clay2('#1A1410', .4));
        r2.rotation.x = Math.PI/2; r2.position.set(a, -.17, b); g.add(r2); });
      g.position.set(x, .3, z); g.rotation.y = dir < 0 ? Math.PI : 0; g.userData = { x0: x, dir };
      w.scene.add(g); return g; };
    const coches = [coche('#D8B84A', -9, -7.2, 1), coche('#C9542E', 2, -7.2, 1), coche('#E0D8C4', 9, -9.0, -1),
                    coche('#D8B84A', -1, -9.0, -1), coche('#4A6E9A', -14, -7.2, 1)];
    // las escaleras rojas del TKTS
    for (let i = 0; i < 7; i++) { const e = rbox(4.0, .22, .42, .03, clay2('#C23A28', .35));
      e.position.set(-.2, .18 + i * .2, 3.4 + i * .42); w.scene.add(e); }
    const gente = EQUIPO.map((o, i) => { const a = L.actor(o), x = [-2.9, -1.5, 1.6, 3.0][i];
      a.position.set(x, 0, -5.6 + (i % 2) * .8); a.rotation.y = Math.PI + x * .05; w.scene.add(a); return a; });
    const solo = L.actor(INV); solo.position.set(.3, 0, -4.6); solo.rotation.y = Math.PI; solo.scale.setScalar(.001); w.scene.add(solo);
    // FUEGOS: más grandes y saturados, porque de día tienen que pelear contra el cielo claro
    const fuegos = [0, 1, 2].map(i => { const g = new THREE.Group(), r = L.rng(90 + i);
      g.position.set([-5.2, 2.4, 6.4][i], [15.5, 17.5, 14.2][i], -10 - i * 2);
      for (let j = 0; j < 44; j++) { const p2 = L.mesh(new THREE.SphereGeometry(.13, 8, 6),
          L.emit(['#FFD24A', '#FF7A3C', '#FFF0B0', '#7FD08A'][i % 4], 2.4));
        const th = r() * 6.283, ph = Math.acos(2 * r() - 1), v = .85 + r() * .6;
        p2.userData = { dx: Math.sin(ph) * Math.cos(th) * v, dy: Math.cos(ph) * v, dz: Math.sin(ph) * Math.sin(th) * v };
        g.add(p2); }
      w.scene.add(g); return g; });
    const conf = new THREE.Group(); w.scene.add(conf); const rc = L.rng(17);
    for (let i = 0; i < 90; i++) { const c = rbox(.12, .12, .02, .01, clay2([MOSTAZA, CREMA, TERRA, AZUL][i % 4], .5));
      c.userData = { x: -6 + rc() * 12, z: -9 + rc() * 7, y0: 10 + rc() * 8, sp: .9 + rc() * 1.1, r: rc() * 6 };
      conf.add(c); }
    return { ...w, grande, preg, gente, solo, fuegos, conf, coches, nubes };
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
    const rot = (txt, x, ink) => { const e = L.label3d(txt, 1.5, .78, { bg: null, ink, font: '800 46px Unbounded', pw: 430 });
      e.material.transparent = true; e.material.depthWrite = false; e.position.set(x, -.56, .1); e.scale.setScalar(.001); col.add(e); return e; };
    const eSx = rot('SpaceX\n$75 mil M', .85, '#4A2410'), eAn = rot('Anthropic\n$81.3 mil M', 1.85, '#16346E');
    const uni = L.label3d('miles de millones de dólares', 1.9, .18, { bg: null, ink: '#8A5230', font: '600 34px "Space Grotesk"', pw: 520 });
    uni.material.transparent = true; uni.material.depthWrite = false; uni.rotation.z = Math.PI / 2;
    uni.position.set(-1.05, 2.2, 0); col.add(uni);
    // LA VÍA DEL PRECIO con su carrito
    const vg = new THREE.Group(); vg.position.set(-1.5, .7, -4.2); w.scene.add(vg);
    vg.add(ejes(L, 3.0, 3.7, [[0, '$83'], [.5, '$100'], [1, '$118']]));
    const v = via(L, PRECIO, 3.0, 3.7); vg.add(v);
    const cart = carrito(L); vg.add(cart);
    const pilo = L.actor(INV); pilo.scale.setScalar(.46); cart.add(pilo);
    pilo.position.set(-.04, .30, 0); pilo.rotation.y = Math.PI / 2;   // de perfil, mirando hacia adelante
    // MURO DE PANTALLAS: todas repitiendo el mismo +17%. Sustituye a la escena de los cuatro
    // con cartulinas, que JP descartó entera ("se entrecortan, no se ven las caras, el fondo vacío").
    const muroP = new THREE.Group(); muroP.position.set(0, 0, -5.2); w.scene.add(muroP);
    const panes = [];
    for (let i = 0; i < 6; i++) {
      const cx = -1.45 + (i % 3) * 1.45, cy = 3.35 - Math.floor(i / 3) * 1.15;
      const m = rbox(1.3, 1.0, .16, .05, clay2('#5A3018', .7)); m.position.set(cx, cy, 0); muroP.add(m);
      const pl = pantalla(L, 1.18, .88, (g, W2, H2) => {
        g.fillStyle = '#000000'; g.fillRect(0, 0, W2, H2); g.textAlign = 'center';
        g.fillStyle = '#7FD08A'; g.font = '800 104px Unbounded'; g.fillText('+17%', W2 / 2, H2 / 2 + 36);
        g.fillStyle = 'rgba(244,239,226,.34)'; g.font = '600 20px "Space Grotesk"';
        g.fillText('ANT · primer día', W2 / 2, H2 - 22); }, 300);
      pl.position.set(cx, cy, .1); pl.material.opacity = 0; muroP.add(pl); panes.push(pl); }
    const mira = L.actor(INV); mira.position.set(.2, 0, -2.4); mira.rotation.y = Math.PI; mira.scale.setScalar(.001); w.scene.add(mira);
    return { ...w, col, bSx, bAn, eSx, eAn, vg, v, cart, pilo, muroP, panes, mira };
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
      cam(w, mv([-1.4, 3.6, 14.6], [.5, 3.2, 11.8], k), mv([0, 4.5, -5.4], [0, 4.2, -5.4], k), 30);
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
      L.rise('ABRIÓ EN +34%  ·  CERRÓ EN +17%', 90, 800, L.seg(p, .42, .66), { f: L.F.d, w: 800, s: 44, c: MOSTAZA });
    } },

  // 2 · TIMES SQUARE — otro lugar (va con ola), fachadas de pantallas y FUEGOS ARTIFICIALES.
  { id: 'plaza', world: 'plaza', d: 6, ink: ARENA, year: '2026', sfx: [[.22, 'rise', .5]],
    cap: 'El 19 de noviembre de 2026, Anthropic salió a la bolsa.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-1.2, 7.8, 16.5], [.25, 8.4, -.8], k), mv([.1, 9.4, -12.5], [.1, 8.5, -12.6], k), 30);
      w.grande.material.opacity = 1; w.preg.material.opacity = 0; w.solo.scale.setScalar(.001);
      caeConfeti(L, w.conf, q, L.seg(p, 0, 1), .55);
      w.coches.forEach((c, i) => { c.position.x = ((c.userData.x0 + c.userData.dir * t * 2.4 + 18) % 36) - 18; });
      w.nubes.forEach((n, i) => n.position.x += .004 * (1 + i * .3));
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
      w.vg.visible = false; w.muroP.visible = false; w.mira.scale.setScalar(.001);
      w.bSx.scale.y = Math.max(.001, L.eio(L.seg(p, .14, .46)));
      w.bAn.scale.y = Math.max(.001, L.eio(L.seg(p, .4, .78)));
      w.eSx.scale.setScalar(Math.max(.001, L.back(L.seg(p, .4, .56))));
      w.eAn.scale.setScalar(Math.max(.001, L.back(L.seg(p, .68, .84))));
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .52, '196,122,74');
      head(L, 'LA MÁS GRANDE DE LA HISTORIA', ['81,300 millones', 'de dólares'], 'Le ganó el récord a SpaceX, de junio', TINTA, p, MOSTAZA);
    } },

  // 4 · EL PRECIO — el personaje va SENTADO en el carrito, de perfil, por el recorrido REAL de
  //     media hora en media hora de los dos días: de los 83 de colocación al cierre del viernes.
  { id: 'precio', world: 'sala', d: 11, ink: TINTA, year: '2026', sfx: [[.66, 'fall', .6]],
    cap: 'Vendió sus acciones en 83 dólares. Abrieron en 111… y el viernes cerraron en 88.91, con todo el mercado cayendo.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.col.visible = false; w.vg.visible = true; w.muroP.visible = false; w.mira.scale.setScalar(.001);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-.6, 3.3, 10.4], [.5, 3.1, 9.2], k), mv([0, 3.5, -4.2], [0, 3.4, -4.2], k), 30);
      const f = L.eio(L.seg(p, .06, .94)), pt = w.v.userData.at(f);
      w.cart.position.set(pt.x, pt.y + .06, 0); w.cart.rotation.z = Math.max(-.5, Math.min(.5, pt.a * .5));
      L.pose(w.pilo, { sit: 1, armL: [1.0, .5, .9], armR: [1.0, .5, .9], head: [pt.a > 0 ? -.2 : .25, 0, 0],
        smile: pt.a > 0 ? .6 : -.6, bob: Math.sin(q * 9) * .02, amp: .2 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .52, '196,122,74');
      head(L, 'DOS DÍAS EN LA BOLSA', ['Abrió en $111.50.', 'Cerró en $88.91'], 'El viernes cayó 8.5%, con el Nasdaq −5%: cayó todo el mercado', TINTA, p, TERRA);
    } },

  // 5 · EL TITULAR — muro de pantallas repitiendo el mismo +17%. (La escena de las cartulinas la
  //     descartó JP entera; esto dice lo mismo sin caras cortadas y con fondo lleno.)
  { id: 'titular', world: 'sala', d: 7, ink: TINTA, year: '2026', sfx: [[.26, 'pop', .5]],
    cap: 'Casi todos los titulares se quedaron con ese 17%.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.col.visible = false; w.vg.visible = false; w.muroP.visible = true;
      w.mira.scale.setScalar(1);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-.5, 3.0, 8.6], [.4, 2.9, 7.6], k), mv([0, 3.4, -5.2], [0, 3.3, -5.2], k), 30);
      w.panes.forEach((pl, i) => pl.material.opacity = L.seg(p, .08 + i * .06, .26 + i * .06));
      L.pose(w.mira, { head: [-.35, 0, 0], armL: [.12, .14, .12], armR: [.12, .14, .12], bob: Math.sin(q * 1.5) * .012 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .54, '196,122,74');
      head(L, 'LO QUE SE CONTÓ', ['Casi todos se', 'quedaron con eso'], null, TINTA, p, TERRA);
    } },

  // 6 · CIERRE — vuelve la plaza. La pregunta va ARRIBA, en la capa de texto: ponerla sobre la
  //     pantalla la encimaba con el logo y el +34% (JP).
  { id: 'pregunta', world: 'plaza', d: 9, ink: ARENA, year: '2026', sfx: [],
    cap: 'Un titular cuenta un día. La empresa sigue ahí el lunes. ¿Cuántas veces te has quedado solo con el titular?',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.grande.material.opacity = 1; w.preg.material.opacity = 0;      // la pantalla conserva el ticker
      w.conf.children.forEach(c => c.visible = false); w.fuegos.forEach(g => g.visible = false);
      w.gente.forEach(a => a.scale.setScalar(.001));
      w.coches.forEach(c => { c.position.x = ((c.userData.x0 + c.userData.dir * t * 1.6 + 18) % 36) - 18; });
      w.nubes.forEach((n, i) => n.position.x += .003 * (1 + i * .3));
      w.solo.scale.setScalar(1);
      L.pose(w.solo, { head: [-.3, 0, 0], armL: [.1, .12, .1], armR: [.1, .12, .1], bob: Math.sin(q * 1.4) * .012 });
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([.4, 7.0, 7.4], [.25, 7.4, 5.0], k), mv([.1, 9.6, -12.5], [.1, 9.4, -12.5], k), 30);
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1060, .66);
      ['¿Cuántas veces te has', 'quedado solo', 'con el titular?'].forEach((ln, i) =>
        L.rise(ln, 540, 470 + i * 92, L.seg(p, .08 + i * .1, .5 + i * .1),
          { f: L.F.s, w: 600, s: 70, c: ARENA, al: 'center', it: 1 }));
      L.rise('Un titular cuenta un día. La empresa sigue ahí el lunes.', 540, 830, L.seg(p, .42, .78),
        { s: 34, c: ARENA, a: .82, al: 'center' });
      L.scrim(L.C, 1560, 1920, .62);
      L.rise('Desde la costa, todo se ve con claridad.', 540, 1664, L.seg(p, .5, .84),
        { s: 30, c: ARENA, a: .74, al: 'center' });
      L.rise('Guion asistido por Claude, producto de Anthropic.', 540, 1716, L.seg(p, .56, .88),
        { s: 23, c: ARENA, a: .58, al: 'center' });
      L.rise('Contenido educativo. No es asesoría financiera.', 540, 1752, L.seg(p, .6, .92),
        { s: 23, c: ARENA, a: .58, al: 'center' });
    } },
];

export default { id: '2026-11-20-ANT-short3d', images: { anthropic: 'images/logo_anthropic.png' }, title: 'Anthropic sale a la bolsa', tail: 1.3, worlds, scenes };
