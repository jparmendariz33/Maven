// Kahneman y Tversky: los psicólogos que rompieron la economía — historia 3D "Costa Diorama v2"
import SERIES from './series.js';

const P = (lt, s) => lt / (s.t1 - s.t0);
const mixv = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const cam = (w, pos, tgt) => { w.cam.position.set(...pos); w.cam.lookAt(...tgt); };

// ---------------------------------------------------------------- reparto
const KAH_79 = { shirt: '#5B6B8C', pants: '#3A4255', shoes: '#4A3A2A', hair: '#4A4036', hairStyle: 'side', glasses: '#9A9A9A', collar: 'shirt', seed: 7 };
const TVE_79 = { shirt: '#7E8C54', pants: '#4A4255', shoes: '#2A2A2A', hair: '#2A1D14', hairStyle: 'short', seed: 11 };
const KAH_02 = { shirt: '#17171B', pants: '#17171B', shoes: '#1B1B1B', hair: '#D8D4CA', hairStyle: 'side', glasses: '#9A9A9A', collar: 'suit', bow: '#17171B', seed: 7 };
const INVER   = { shirt: '#4173D1', pants: '#2B3A55', shoes: '#DADADA', hair: '#2E2118', hairStyle: 'short', seed: 23 };

// una mesa de trabajo con papeles: sirve de base en varios mundos
function desk(L, w, x, z, col) {
  const { THREE, clay2, rbox } = L;
  const top = rbox(4.4, .18, 2.0, .08, clay2(col || '#8A5F45', .6)); top.position.set(x, 1.22, z); w.scene.add(top);
  [[-1.9, -.8], [1.9, -.8], [-1.9, .8], [1.9, .8]].forEach(([a, b]) => {
    const lg = rbox(.16, 1.2, .16, .05, clay2('#5B3A29', .7)); lg.position.set(x + a, .6, z + b); w.scene.add(lg); });
  for (let i = 0; i < 5; i++) { const p = rbox(.56, .02, .74, .01, clay2('#F4F1E8', .85));
    p.castShadow = false; p.position.set(x - 1.3 + (i % 3) * 1.2, 1.32 + i * .01, z + (i > 2 ? .4 : -.3)); p.rotation.y = (i - 2) * .12; w.scene.add(p); }
  return top;
}

const worlds = {
  // 1 y 2 · 1979: el despacho de la universidad
  estudio(L) {
    const { THREE, B, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#E9DFC6', bg2: '#CDBB93', floor: '#8A7458', fog: [40, 115], hemi: .55, key: 3.0, keyPos: [-11, 12, 10], keyCol: '#FFEFD6', rim: 2.1, rimPos: [9, 9, -4], rimCol: '#FFE2B8', fill: .4 });
    const wall = rbox(16, 11, .4, .1, clay2('#E4D9BC', .95)); wall.position.set(0, 4.5, -6.8); w.scene.add(wall);
    const zocalo = rbox(16, 1.3, .5, .08, clay2('#8A5F45', .7)); zocalo.position.set(0, .65, -6.7); w.scene.add(zocalo);
    // pizarrón con la fórmula
    const bo = rbox(6.6, 3.4, .22, .08, clay2('#2E3B33', .55)); bo.position.set(0, 3.5, -6.5); w.scene.add(bo);
    const mrc = rbox(6.9, 3.7, .12, .06, clay2('#6B4A33', .75)); mrc.position.set(0, 3.5, -6.62); w.scene.add(mrc);
    const eq = L.label3d('ECONOMETRICA · 1979', 3.2, .5, { bg: null, ink: '#E6DFC4', font: '800 58px Unbounded', ls: 3, pw: 1024 });
    eq.position.set(0, 4.25, -6.36); w.scene.add(eq);
    const curva = L.label3d('ganar  ·  perder', 2.4, .38, { bg: null, ink: '#9FB08C', font: '600 70px "Space Grotesk"', pw: 1024 });
    curva.position.set(0, 2.9, -6.36); w.scene.add(curva);
    desk(L, w, 0, -1.4);
    const kah = L.actor(KAH_79); kah.position.set(-1.6, 0, .3); kah.rotation.y = .42; w.scene.add(kah);
    const tve = L.actor(TVE_79); tve.position.set(1.6, 0, .3); tve.rotation.y = -.42; w.scene.add(tve);
    w.scene.add(L.tree(-6.2, -3.0, 1.3, '#8E9A5E'));
    // calculadora que aparece sobre el pizarrón en la escena 2
    const calc = new THREE.Group(); calc.position.set(2.45, 3.05, -5.6); calc.scale.setScalar(.001); w.scene.add(calc);
    const cbody = rbox(1.15, 1.55, .22, .09, clay2('#3A4255', .5)); calc.add(cbody);
    const cscr = rbox(.86, .4, .06, .03, clay2('#9FB08C', .35, .5)); cscr.position.set(0, .48, .13); calc.add(cscr);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const b = rbox(.2, .16, .05, .02, clay2('#CFC4A6', .7)); b.position.set(-.28 + c * .28, .02 - r * .26, .13); calc.add(b); }
    return { ...w, kah, tve, bo, eq, curva, calc };
  },

  // 3 · la apuesta: dos cartas y una moneda
  apuesta(L) {
    const { THREE, B, mesh, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#EBE6BA', bg2: '#D8CE98', floor: '#CFC4A6', fog: [40, 115], hemi: .6, key: 3.1, keyPos: [-9, 13, 10], rim: 2.3, fill: .45 });
    const mesa = rbox(7.0, .22, 3.2, .1, clay2('#6B4A33', .6)); mesa.position.set(0, 1.25, -.6); w.scene.add(mesa);
    [[-3.0, -1.2], [3.0, -1.2], [-3.0, .9], [3.0, .9]].forEach(([a, b]) => {
      const lg = rbox(.2, 1.25, .2, .06, clay2('#4F352A', .7)); lg.position.set(a, .62, b - .6); w.scene.add(lg); });
    // placas verticales: de frente a cámara, legibles en vertical
    const card = (x, l1, l2, col) => {
      const g = new THREE.Group(); g.position.set(x, 1.36, -.5); g.rotation.x = -.16; w.scene.add(g);
      const base = rbox(2.2, 1.6, .12, .1, clay2(col, .55)); base.position.y = .8; g.add(base);
      const pie = rbox(2.2, .12, .9, .05, clay2('#4F352A', .7)); pie.position.set(0, .06, .3); g.add(pie);
      const t1 = L.label3d(l1, 1.75, .46, { bg: null, ink: '#F4F1E8', font: '800 92px Unbounded', pw: 1024 });
      t1.position.set(0, 1.06, .075); g.add(t1);
      const t2 = L.label3d(l2, 1.75, .32, { bg: null, ink: '#F4F1E8', font: '600 62px \"Space Grotesk\"', pw: 1024 });
      t2.position.set(0, .54, .075); g.add(t2);
      g.scale.setScalar(.001); return g; };
    const segura = card(-2.0, '$100', 'seguros', B.musgo);
    const volado = card(2.0, '$200', 'o nada', B.azul);
    const coin = mesh(new THREE.CylinderGeometry(.42, .42, .09, 30), clay2(B.mostaza, .35, .55));
    coin.position.set(3.5, 1.95, .2); coin.rotation.z = Math.PI / 2; coin.scale.setScalar(.001); w.scene.add(coin);
    const kah = L.actor(KAH_79); kah.position.set(-4.3, 0, 1.6); kah.rotation.y = .55; w.scene.add(kah);
    return { ...w, segura, volado, coin, kah, mesa };
  },

  // 4 · la balanza: perder pesa el doble
  balanza(L) {
    const { THREE, B, mesh, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#F0C9A4', bg2: '#E08E6E', floor: '#D8C7A0', fog: [40, 115], hemi: .5, key: 3.0, keyPos: [-12, 10, 9], keyCol: '#FFD6A0', rim: 2.2, rimCol: '#FFC08A', fill: .4 });
    const base = rbox(1.6, .4, 1.6, .1, clay2('#5B3A29', .7)); base.position.set(0, .2, -.8); w.scene.add(base);
    const post = rbox(.3, 3.4, .3, .08, clay2('#6B4A33', .6)); post.position.set(0, 1.9, -.8); w.scene.add(post);
    const beam = new THREE.Group(); beam.position.set(0, 3.5, -.8); w.scene.add(beam);
    const bar = rbox(6.4, .22, .3, .08, clay2('#8A5F45', .55)); beam.add(bar);
    const plato = (s, label, col) => {
      const g = new THREE.Group(); g.position.set(s * 2.2, -1.1, 0); beam.add(g);
      const cuerda = rbox(.05, 1.1, .05, .02, clay2('#C9BFA6', .9)); cuerda.position.y = .55; g.add(cuerda);
      const pl = mesh(new THREE.CylinderGeometry(1.0, 1.0, .1, 28), clay2('#CFC4A6', .85)); g.add(pl);
      const blk = rbox(1.1, .9, 1.1, .1, clay2(col, .5)); blk.position.y = .5; g.add(blk);
      const tx = L.label3d(label, 1.5, .4, { bg: null, ink: '#F4F1E8', font: '800 76px Unbounded', pw: 1024 }); tx.position.set(0, .5, .58); blk.add(tx);
      return { g, blk }; };
    // monedas que caen sobre el plato de PERDER y lo hunden
    const monedas = [];
    for (let i = 0; i < 6; i++) {
      const c = mesh(new THREE.CylinderGeometry(.34, .34, .1, 24), clay2(B.mostaza, .3, .6));
      c.visible = false; w.scene.add(c); monedas.push(c); }
    const gana = plato(-1, 'GANAR', L.B.musgo);
    const pierde = plato(1, 'PERDER', L.B.terracota);
    return { ...w, beam, gana, pierde, monedas };
  },

  // 5 · el inversionista frente a la pantalla
  mercado(L) {
    const { THREE, B, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#22346A', bg2: '#0F1838', floor: '#39405A', fog: [32, 95], hemi: .52, sky: '#9DB4FF', ground: '#2A2F45', key: 2.0, keyPos: [-9, 12, 9], keyCol: '#A9BEFF', rim: 1.7, rimCol: '#8FA8FF', fill: .44 });
    w.vig = .5;
    const esc = rbox(7.0, 2.9, .3, .12, clay2('#141A2E', .35, .4)); esc.position.set(0, 4.0, -4.4); w.scene.add(esc);
    const marco = rbox(7.3, 3.2, .18, .08, clay2('#2E3448', .6)); marco.position.set(0, 4.0, -4.52); w.scene.add(marco);
    const fila = (y, txt, col) => { const t = L.label3d(txt, 3.8, .36, { bg: null, ink: col, font: '800 54px Unbounded', ls: 1, pw: 1024 });
      t.position.set(0, y, -4.22); w.scene.add(t); return t; };
    const verde = fila(4.62, 'LA QUE GANA   +40%', '#BBD08A');
    const roja = fila(3.52, 'LA QUE PIERDE   −40%', '#E09277');
    desk(L, w, 0, -1.8, '#3A3F4A');
    const inv = L.actor(INVER); inv.position.set(0, 0, 1.1); inv.rotation.y = Math.PI; w.scene.add(inv);
    return { ...w, verde, roja, inv, esc };
  },

  // 6 y 7 · 2002: el Nobel
  nobel(L) {
    const { THREE, B, mesh, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#2A2440', bg2: '#140F26', floor: '#4A3A52', fog: [35, 110], hemi: .3, sky: '#C9A9FF', ground: '#2A2140', key: 2.6, keyPos: [-8, 13, 9], keyCol: '#FFE6B8', rim: 2.4, rimPos: [8, 8, -4], rimCol: '#C9A9FF', fill: .3 });
    w.vig = .45;
    const tel = rbox(13, 9.5, .3, .1, clay2('#3A2A4E', .6)); tel.position.set(0, 4.5, -6.6); w.scene.add(tel);
    const alf = rbox(5.0, .1, 9.0, .04, clay2('#8A2F3A', .85)); alf.position.set(0, .05, -1.5); w.scene.add(alf);
    const pod = rbox(1.5, 2.3, 1.1, .12, clay2('#6B4A33', .55)); pod.position.set(-3.0, 1.15, -2.2); w.scene.add(pod);
    const medalla = mesh(new THREE.CylinderGeometry(.48, .48, .1, 32), clay2(B.mostaza, .28, .6));
    medalla.rotation.x = Math.PI / 2; medalla.position.set(-2.4, 3.2, -1.6); medalla.scale.setScalar(.001); w.scene.add(medalla);
    const kah = L.actor(KAH_02); kah.position.set(0, 0, -.4); w.scene.add(kah);
    // la silla que queda vacía
    const silla = new THREE.Group(); silla.position.set(2.15, 0, -.9); w.scene.add(silla);
    const as = rbox(1.1, .14, 1.0, .06, clay2('#8A5F45', .6)); as.position.y = 1.0; silla.add(as);
    const re = rbox(1.1, 1.4, .14, .06, clay2('#8A5F45', .6)); re.position.set(0, 1.7, -.45); silla.add(re);
    [[-.45, -.4], [.45, -.4], [-.45, .4], [.45, .4]].forEach(([a, b]) => {
      const lg = rbox(.12, 1.0, .12, .04, clay2('#6B4A33', .7)); lg.position.set(a, .5, b); silla.add(lg); });
    return { ...w, kah, medalla, silla };
  },

  // 8 · cierre
  cierre(L) {
    const { clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#EBE6BA', bg2: '#D8CE98', floor: '#CFC4A6', fog: [45, 120], hemi: .6, key: 3.0, keyPos: [-10, 13, 10], rim: 2.3, fill: .45 });
    const esp = rbox(2.6, 3.4, .22, .12, clay2('#9FB0C8', .3, .45)); esp.position.set(0, 2.5, -3.2); w.scene.add(esp);
    const mrc = rbox(2.9, 3.7, .12, .08, clay2('#8A5F45', .7)); mrc.position.set(0, 2.5, -3.32); w.scene.add(mrc);
    const inv = L.actor(INVER); inv.position.set(0, 0, -.6); w.scene.add(inv);
    // el reflejo: el mismo personaje dentro del espejo, de frente
    const refl = L.actor(INVER); refl.position.set(0, .95, -3.0); refl.scale.setScalar(.92); w.scene.add(refl);
    return { ...w, inv, esp, refl };
  },
};

// ---------------------------------------------------------------- escenas
const head = (L, k1, title, sub, ink, lt, col, pronto) => {
  L.kicker(k1, 360, L.seg(lt, pronto ? .02 : .1, pronto ? .3 : .5), ink);
  title.forEach((ln, i) => L.rise(ln, 90, 470 + i * 96, L.seg(lt, (pronto ? .04 : .25) + i * .1, (pronto ? .42 : .8) + i * .1),
    { f: L.F.d, w: 800, s: 78, c: i === title.length - 1 && col ? col : ink }));
  // el sub es de una sola línea: a 38px caben ~46 caracteres en los 990px útiles, así que se encoge solo
  if (sub) L.rise(sub, 90, 470 + title.length * 96 - 26, L.seg(lt, pronto ? .5 : .7, pronto ? 1.0 : 1.2),
    { s: sub.length > 46 ? Math.max(27, Math.floor(38 * 46 / sub.length)) : 38, c: ink, a: .8 });
};

const scenes = [
  // El gancho lleva el texto desde el primer cuadro (regla del 14 nov 2026)
  { id: 'gancho', world: 'estudio', d: 8, sfx: [[.1, 'ticks', .5, .3], [.9, 'pop']], year: '1979',
    cap: 'En 1979, dos psicólogos publicaron un artículo en una revista de economía.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = L.talkAt(L.CAPS, q);
      const escribe = L.seg(p, .02, .46), vuelta = L.eio(L.seg(p, .5, .7));
      w.eq.scale.setScalar(Math.max(.001, L.back(L.seg(p, .12, .42))));          // el título aparece al escribirlo
      w.curva.scale.setScalar(Math.max(.001, L.eio(L.seg(p, .42, .62))));
      w.kah.position.x = L.lerp(-1.95, -1.45, vuelta);                            // da un paso hacia Tversky
      w.kah.rotation.y = L.lerp(-.1, .5, vuelta);
      L.pose(w.kah, { walk: vuelta > .02 && vuelta < .98 ? q * 6 : null, amp: .3,
        armR: [L.lerp(1.5 + Math.sin(q * 6.5) * .22, .25, vuelta), L.lerp(.3 + Math.cos(q * 6.5) * .12, .2, vuelta), .4],
        armL: [.15, .2, .3], head: [L.lerp(-.2, -.02, vuelta), L.lerp(-.5, .42, vuelta), 0],
        lid: Math.max(.1, L.blink(q, 2)), brow: .35, smile: L.lerp(.3, .65, vuelta), talk: talk * .8 });
      L.pose(w.tve, { armL: [L.lerp(.3, 1.0, vuelta), -.3, .5], armR: [.15, -.2, .3],
        head: [Math.sin(q * 2.1) * .1 * vuelta, .34, 0], lid: Math.max(.1, L.blink(q, 4)), brow: .3 + vuelta * .3, smile: .4 + vuelta * .4 });
      cam(w, mixv([-.9, 3.2, 17.5], [.3, 2.9, 14.2], L.eio(p)), mixv([0, 3.6, -1], [.1, 3.4, -1], L.eio(p)));
      w.focusOn(w.kah, 1.4); w.aperture = .00026;
    },
    overlay(lt, t, L, s, w) {
      const ink = L.B.negro; L.scrim(L.C, 0, 800, .8, '233,223,198');
      head(L, '1979 · Universidad de Jerusalén', ['Dos psicólogos', 'rompieron', 'la economía'], null, ink, lt, L.B.terracota, true);
      L.tag('Daniel Kahneman', w.kah, w.cam, L.seg(lt, 2.2, 2.8), 3.0);
      L.tag('Amos Tversky', w.tve, w.cam, L.seg(lt, 3.4, 4.0), 3.0);
    } },

  { id: 'supuesto', world: 'estudio', d: 7, sfx: [[.4, 'ticks', .45, .5]], year: '1979',
    cap: 'Hasta entonces, la economía daba por hecho que decides con una calculadora en la cabeza.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = L.talkAt(L.CAPS, q);
      const cp = L.back(L.seg(p, .2, .52)), enc = L.eio(L.seg(p, .58, .84));
      w.calc.scale.setScalar(Math.max(.001, cp));
      w.calc.rotation.set(Math.sin(t * 1.1) * .12, Math.sin(t * .85) * .45, Math.sin(t * .7) * .07);
      w.calc.position.y = 3.05 + Math.sin(t * 1.5) * .14;                          // flota
      L.pose(w.kah, { armR: [L.lerp(.6, 1.35, cp), L.lerp(.3, .62, cp), .55], armL: [.2, .2, .3],
        head: [-.08, -.3 + cp * .16, 0], lid: Math.max(.1, L.blink(q, 3)), brow: .1 + cp * .4, smile: .2, talk: talk * .7 });
      L.pose(w.tve, { armL: [1.0 * enc, -.55 * enc - .2, 1.15 * enc + .3], armR: [1.0 * enc, .55 * enc + .2, 1.15 * enc + .3],
        head: [.08 - enc * .06, .2, 0], lid: Math.max(.2, L.blink(q, 6)), brow: -.1 + enc * .7, smile: .1, bob: enc * .05 });
      cam(w, mixv([1.6, 3.6, 13.0], [-.6, 3.3, 11.4], L.eio(p)), mixv([0, 4.2, -5], [0, 4.0, -5.5], L.eio(p)));
      w.focusOn(cp > .4 ? w.calc : w.bo, 1.0); w.aperture = .0002;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 905, .88, '233,223,198');
      head(L, 'Lo que se daba por hecho', ['Que decides', 'como una', 'calculadora'], 'Suponía que siempre eliges lo que te conviene', ink, lt, L.B.azul);
    } },

  { id: 'apuesta', world: 'apuesta', d: 9, sfx: [[.45, 'pop'], [1.1, 'pop'], [1.6, 'shine', .7]], year: '1979',
    cap: 'Ellos hicieron una pregunta simple: ¿prefieres ganar 100 dólares seguros, o lanzar una moneda por 200?',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = L.talkAt(L.CAPS, q);
      const a1 = L.eio(L.seg(p, .04, .3)), a2 = L.eio(L.seg(p, .26, .52)), g2 = L.eio(L.seg(p, .34, .56));
      w.segura.position.x = L.lerp(-9, -2.0, a1); w.segura.scale.setScalar(Math.max(.001, a1));
      w.volado.position.x = L.lerp(9, 2.0, a2); w.volado.scale.setScalar(Math.max(.001, a2));
      const vol = L.seg(p, .56, .9);                                               // el volado: sube, gira y cae
      w.coin.scale.setScalar(Math.max(.001, L.pop(lt, .56 * (this.t1 - this.t0), .3)));
      w.coin.position.set(3.5, 1.55 + Math.sin(vol * Math.PI) * 3.1, .2);
      w.coin.rotation.x = vol * 38; w.coin.rotation.z = Math.PI / 2;
      L.pose(w.kah, { armR: [1.2, L.lerp(.7, -.15, g2), .45], armL: [.25, .2, .3],
        head: [-.12, L.lerp(.3, -.34, g2), 0], lid: Math.max(.1, L.blink(q, 2)), brow: .5, smile: .5, talk: talk * .8 });
      cam(w, mixv([-.5, 5.0, 19.8], [.2, 4.6, 17.4], L.eio(p)), mixv([0, 2.2, -.6], [0, 2.1, -.6], L.eio(p)));
      w.focusOn(p < .5 ? w.segura : w.volado, .8); w.aperture = .00022;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 720, .72, '235,230,186');
      head(L, 'El experimento', ['¿$100 seguros…', 'o un volado', 'por $200?'], null, ink, lt, L.B.mostaza);
    } },

  { id: 'balanza', world: 'balanza', d: 9.5, sfx: [[.5, 'shine', .7], [1.3, 'fall', .8]], year: 'LA CLAVE',
    cap: 'Y encontraron algo que lo cambió todo: perder 100 duele casi el doble de lo que gusta ganar 100.',
    update(w, lt, t, L) {
      const p = P(lt, this), tip = L.eio(L.seg(p, .34, .82));
      w.beam.rotation.z = -tip * .18;
      // las monedas se apilan ENCIMA del bloque rojo: adentro no se verían
      w.pierde.g.updateWorldMatrix(true, false);
      const pw = new L.THREE.Vector3().setFromMatrixPosition(w.pierde.g.matrixWorld);
      const alto = (.5 + tip * .3) + .45 * (1 + tip * .6);                          // tapa del bloque
      w.monedas.forEach((c, i) => {
        const k = L.ex(L.seg(p, .18 + i * .05, .18 + i * .05 + .2));
        c.visible = k > 0;
        c.position.set(pw.x + (i % 2 ? .22 : -.22), L.lerp(pw.y + alto + 7, pw.y + alto + .09 + Math.floor(i / 2) * .13, k),
          pw.z + (i < 2 ? -.2 : i < 4 ? 0 : .2));
        c.rotation.z = (1 - k) * 2.6; });
      w.pierde.blk.scale.set(1 + tip * .5, 1 + tip * .6, 1 + tip * .5);
      w.pierde.blk.position.y = .5 + tip * .3;
      cam(w, mixv([-.4, 5.8, 20.8], [.3, 5.5, 18.7], L.eio(p)), mixv([0, 4.8, -.8], [0, 4.6, -.8], L.eio(p)));
      w.focusOn(w.pierde.blk, 1.2); w.aperture = .00024;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 895, .84, '240,201,164');
      head(L, 'Lo que descubrieron', ['Perder duele', 'el doble de lo', 'que gusta ganar'], 'Con la misma cantidad de dinero', ink, lt, L.B.terracota);
    } },

  { id: 'bolsa', world: 'mercado', d: 9, sfx: [[.3, 'ticks', .5, .6], [1.2, 'pop']], year: 'EN LA BOLSA', ink: '#EBE6BA',
    cap: 'Por eso aguantas la acción que va perdiendo, y vendes la que va ganando.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const agarra = L.eio(L.seg(p, .14, .46)), vende = L.eio(L.seg(p, .5, .84));
      w.roja.position.set(Math.sin(t * 11) * .04 * agarra, 3.52 - agarra * .12, -4.22);
      w.verde.position.set(L.lerp(0, 6.2, vende), 4.62 + vende * .5, -4.22);         // la que gana se va
      w.verde.scale.setScalar(Math.max(.04, 1 - vende * .75));
      L.pose(w.inv, { armL: [1.3 * agarra + .15, -.45, .5], armR: [1.05 * vende + .2, .42, .5],
        head: [-.18 - vende * .08, L.lerp(-.24, .34, vende), 0], lean: agarra * .06,
        lid: Math.max(.25, L.blink(q, 3)), brow: -.6, smile: -.45 });
      cam(w, mixv([-.4, 3.5, 12.6], [.4, 3.3, 10.8], L.eio(p)), mixv([0, 4.0, -4], [0, 3.8, -4], L.eio(p)));
      w.focusOn(w.esc, 1.0); w.aperture = .00022;
    },
    overlay(lt, t, L) {
      const ink = '#EBE6BA'; L.scrim(L.C, 0, 760, .55, '8,12,30');
      head(L, 'Cómo se ve invirtiendo', ['Aguantas la', 'que pierde.', 'Vendes la que gana'], null, ink, lt, L.B.mostaza);
    } },

  { id: 'nobel', world: 'nobel', d: 8.5, sfx: [[.6, 'shine', .9], [1.4, 'pop']], year: '2002', ink: '#EBE6BA',
    cap: 'En 2002, Daniel Kahneman ganó el Nobel de Economía. Y era psicólogo, no economista.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const k = L.eio(L.seg(p, .04, .36)), anda = p > .04 && p < .36, md = L.eio(L.seg(p, .32, .56));
      w.kah.position.set(L.lerp(-3.3, 0, k), 0, L.lerp(-1.7, -.4, k)); w.kah.rotation.y = L.lerp(.5, 0, k);
      w.medalla.scale.setScalar(Math.max(.001, L.back(L.seg(p, .3, .46))));
      w.medalla.position.set(-1.05, L.lerp(6.0, 2.75, md), -1.3); w.medalla.rotation.z = t * .7;
      w.silla.visible = false;
      L.pose(w.kah, { walk: anda ? q * 6.5 : null, amp: .42, armR: [.35, .2, .3], armL: [.35, -.2, .3],
        head: [L.lerp(-.02, -.24, md), 0, 0], lid: Math.max(.1, L.blink(q, 3)), brow: .3 + md * .4, smile: .5 + md * .4, bob: md * .03 });
      cam(w, mixv([-1.4, 3.6, 11.5], [-.4, 3.3, 9.4], L.eio(p)), mixv([-.6, 2.6, -1.4], [-.3, 2.5, -1.4], L.eio(p)));
      w.focusOn(md > .5 ? w.medalla : w.kah, .9); w.aperture = .00024;
    },
    overlay(lt, t, L, s, w) {
      const ink = '#EBE6BA'; L.scrim(L.C, 0, 780, .62, '20,15,38');
      head(L, '2002 · Estocolmo', ['Un psicólogo', 'ganó el Nobel', 'de Economía'], null, ink, lt, L.B.mostaza);
      L.tag('Daniel Kahneman', w.kah, w.cam, L.seg(lt, 2.4, 3.0), 3.0);
    } },

  { id: 'tversky', world: 'nobel', d: 9, sfx: [[.8, 'fall', .6]], year: '1996', ink: '#EBE6BA',
    cap: 'Amos Tversky había muerto en 1996. El Nobel no se entrega póstumo, así que no pudo compartirlo.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.medalla.scale.setScalar(.001); w.silla.visible = true;
      const mira = L.eio(L.seg(p, .2, .58)), baja = L.eio(L.seg(p, .58, .92));
      w.kah.rotation.y = mira * .48;
      L.pose(w.kah, { armR: [.3 - baja * .26, .2, .3], armL: [.3 - baja * .26, -.2, .3],
        head: [.04 + baja * .24, mira * .5, 0], lean: baja * .07, bob: -baja * .055,
        lid: Math.max(.3 + baja * .3, L.blink(q, 4)), brow: -.3 - baja * .35, smile: -.2 - baja * .35 });
      cam(w, mixv([-.3, 3.4, 12.8], [.5, 3.1, 10.6], L.eio(p)), mixv([.1, 2.4, -.6], [.95, 2.2, -.6], L.eio(p)));
      w.focusOn(mira > .5 ? w.silla : w.kah, 1.1); w.aperture = .00026;
    },
    overlay(lt, t, L) {
      const ink = '#EBE6BA'; L.scrim(L.C, 0, 800, .64, '20,15,38');
      head(L, 'El que faltó', ['Tversky murió', 'en 1996'], 'El Nobel no se entrega póstumo', ink, lt, L.B.terracota);
    } },

  { id: 'cierre', world: 'cierre', d: 8, sfx: [[.5, 'shine', .6]], year: 'HOY',
    cap: 'Tu peor enemigo invirtiendo no está en la pantalla. Está de este lado.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const sube = L.eio(L.seg(p, .38, .7));
      const base = { head: [-.05, 0, 0], lid: Math.max(.15, L.blink(q, 3)), brow: .1 + sube * .3, smile: .25 };
      L.pose(w.inv, { ...base, armR: [1.45 * sube + .3, .25, .35], armL: [.3, -.2, .3] });
      L.pose(w.refl, { ...base, armL: [1.45 * sube + .3, -.25, .35], armR: [.3, .2, .3] });   // el espejo invierte el lado
      cam(w, mixv([-.5, 3.2, 11.5], [.2, 3.0, 9.4], L.eio(p)), mixv([0, 2.6, -2], [0, 2.5, -2], L.eio(p)));
      w.focusOn(sube > .4 ? w.refl : w.inv, 1.0); w.aperture = .00022;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 895, .82, '235,230,186');
      head(L, 'Finanzas conductuales', ['Tu peor enemigo', 'no está en', 'la pantalla'], 'Está de este lado', ink, lt, L.B.azul);
    } },
];

export default { id: '2026-11-21-KAHNEMAN-historia', title: 'Los psicólogos que rompieron la economía', tail: 1.2, worlds, scenes };
