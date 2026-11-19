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
    return { ...w, kah, tve, bo };
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
    return { ...w, segura, volado, coin, kah };
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
    const gana = plato(-1, 'GANAR', L.B.musgo);
    const pierde = plato(1, 'PERDER', L.B.terracota);
    return { ...w, beam, gana, pierde };
  },

  // 5 · el inversionista frente a la pantalla
  mercado(L) {
    const { THREE, B, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#22346A', bg2: '#0F1838', floor: '#39405A', fog: [32, 95], hemi: .34, sky: '#9DB4FF', ground: '#2A2F45', key: 1.1, keyPos: [-9, 12, 9], keyCol: '#A9BEFF', rim: 1.0, rimCol: '#8FA8FF', fill: .25 });
    w.vig = .5;
    const esc = rbox(7.0, 4.0, .3, .12, clay2('#141A2E', .35, .4)); esc.position.set(0, 4.0, -4.4); w.scene.add(esc);
    const marco = rbox(7.3, 4.3, .18, .08, clay2('#2E3448', .6)); marco.position.set(0, 4.0, -4.52); w.scene.add(marco);
    const fila = (y, txt, col) => { const t = L.label3d(txt, 3.8, .36, { bg: null, ink: col, font: '800 54px Unbounded', ls: 1, pw: 1024 });
      t.position.set(0, y, -4.22); w.scene.add(t); return t; };
    const verde = fila(4.9, 'LA QUE GANA   +40%', '#BBD08A');
    const roja = fila(3.3, 'LA QUE PIERDE   −40%', '#E09277');
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
    const silla = new THREE.Group(); silla.position.set(3.2, 0, -.6); w.scene.add(silla);
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
    return { ...w, inv, esp };
  },
};

// ---------------------------------------------------------------- escenas
const head = (L, k1, title, sub, ink, lt, col, pronto) => {
  L.kicker(k1, 360, L.seg(lt, pronto ? .02 : .1, pronto ? .3 : .5), ink);
  title.forEach((ln, i) => L.rise(ln, 90, 470 + i * 96, L.seg(lt, (pronto ? .04 : .25) + i * .1, (pronto ? .42 : .8) + i * .1),
    { f: L.F.d, w: 800, s: 78, c: i === title.length - 1 && col ? col : ink }));
  if (sub) L.rise(sub, 90, 470 + title.length * 96 - 26, L.seg(lt, pronto ? .5 : .7, pronto ? 1.0 : 1.2), { s: 38, c: ink, a: .8 });
};

const scenes = [
  // El gancho lleva el texto desde el primer cuadro (regla del 14 nov 2026)
  { id: 'gancho', world: 'estudio', d: 8, sfx: [[.1, 'ticks', .5, .3], [.9, 'pop']], year: '1979',
    cap: 'En 1979, dos psicólogos publicaron un artículo en una revista de economía.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = L.talkAt(L.CAPS, q);
      L.pose(w.kah, { armR: [1.15, .35, .45], armL: [.15, .2, .3], head: [-.08, -.3, 0], lid: Math.max(.1, L.blink(q, 2)), brow: .35, smile: .4, talk: talk * .8 });
      L.pose(w.tve, { armL: [1.05, -.3, .5], armR: [.15, -.2, .3], head: [-.05, .34, 0], lid: Math.max(.1, L.blink(q, 4)), brow: .3, smile: .5 });
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
      L.pose(w.kah, { armR: [.9, .5, .9], armL: [.2, .2, .3], head: [-.02, -.18, 0], lid: Math.max(.1, L.blink(q, 3)), brow: .1, smile: .2, talk: talk * .7 });
      L.pose(w.tve, { armL: [.3, -.2, .4], armR: [.2, -.2, .3], head: [.08, .2, 0], lid: Math.max(.2, L.blink(q, 6)), brow: -.1, smile: .1 });
      cam(w, mixv([1.6, 3.6, 13.0], [-.6, 3.3, 11.4], L.eio(p)), mixv([0, 4.2, -5], [0, 4.0, -5.5], L.eio(p)));
      w.focusOn(w.bo, 1.0); w.aperture = .0002;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 760, .78, '233,223,198');
      head(L, 'Lo que se daba por hecho', ['Que decides', 'como una', 'calculadora'], 'La economía suponía que siempre eliges lo que más te conviene', ink, lt, L.B.azul);
    } },

  { id: 'apuesta', world: 'apuesta', d: 9, sfx: [[.45, 'pop'], [1.1, 'pop'], [1.6, 'shine', .7]], year: '1979',
    cap: 'Ellos hicieron una pregunta simple: ¿prefieres ganar 100 dólares seguros, o lanzar una moneda por 200?',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), d = this.t1 - this.t0, talk = L.talkAt(L.CAPS, q);
      w.segura.scale.setScalar(Math.max(.001, L.back(L.seg(lt, .45 * d / 9, .45 * d / 9 + .45))));
      w.volado.scale.setScalar(Math.max(.001, L.back(L.seg(lt, 1.1 * d / 9, 1.1 * d / 9 + .45))));
      const cs = L.pop(lt, 1.6 * d / 9, .5); w.coin.scale.setScalar(Math.max(.001, cs));
      w.coin.rotation.y = t * 7.5; w.coin.position.y = 1.6 + Math.abs(Math.sin(t * 3.2)) * .5 * cs;
      L.pose(w.kah, { armR: [1.2, .3, .5], armL: [1.1, -.3, .5], head: [-.14, 0, 0], lid: Math.max(.1, L.blink(q, 2)), brow: .5, smile: .5, talk: talk * .8 });
      cam(w, mixv([-.5, 5.0, 19.8], [.2, 4.6, 17.4], L.eio(p)), mixv([0, 2.2, -.6], [0, 2.1, -.6], L.eio(p)));
      w.focusOn(w.segura, .8); w.aperture = .00022;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 720, .72, '235,230,186');
      head(L, 'El experimento', ['¿$100 seguros…', 'o un volado', 'por $200?'], null, ink, lt, L.B.mostaza);
    } },

  { id: 'balanza', world: 'balanza', d: 9.5, sfx: [[.5, 'shine', .7], [1.3, 'fall', .8]], year: 'LA CLAVE',
    cap: 'Y encontraron algo que lo cambió todo: perder 100 duele casi el doble de lo que gusta ganar 100.',
    update(w, lt, t, L) {
      const p = P(lt, this), tip = L.eio(L.seg(p, .32, .78));
      w.beam.rotation.z = -tip * .18;
      w.pierde.blk.scale.set(1 + tip * .6, 1 + tip * .7, 1 + tip * .6);
      w.pierde.blk.position.y = .5 + tip * .36;
      cam(w, mixv([-.4, 5.8, 20.8], [.3, 5.5, 18.7], L.eio(p)), mixv([0, 4.8, -.8], [0, 4.6, -.8], L.eio(p)));
      w.focusOn(w.pierde.blk, 1.2); w.aperture = .00024;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 760, .8, '240,201,164');
      head(L, 'Lo que descubrieron', ['Perder duele', 'el doble de lo', 'que gusta ganar'], 'Con la misma cantidad de dinero', ink, lt, L.B.terracota);
    } },

  { id: 'bolsa', world: 'mercado', d: 9, sfx: [[.3, 'ticks', .5, .6], [1.2, 'pop']], year: 'EN LA BOLSA', ink: '#EBE6BA',
    cap: 'Por eso aguantas la acción que va perdiendo, y vendes la que va ganando.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const agarra = L.eio(L.seg(p, .35, .8));
      L.pose(w.inv, { armL: [1.25 * agarra + .15, -.45, .5], armR: [.2, .25, .3], head: [-.18, -.22 * agarra, 0],
        lid: Math.max(.25, L.blink(q, 3)), brow: -.6, smile: -.45 });
      w.verde.position.x = L.lerp(0, 1.1, agarra);
      cam(w, mixv([-.3, 3.8, 15.0], [.4, 3.6, 12.8], L.eio(p)), mixv([0, 4.2, -4], [0, 4.0, -4], L.eio(p)));
      w.focusOn(w.esc, 1.0); w.aperture = .00022;
    },
    overlay(lt, t, L) {
      const ink = '#EBE6BA'; L.scrim(L.C, 0, 760, .55, '8,12,30');
      head(L, 'Cómo se ve invirtiendo', ['Aguantas la', 'que pierde.', 'Vendes la que gana'], null, ink, lt, L.B.mostaza);
    } },

  { id: 'nobel', world: 'nobel', d: 8.5, sfx: [[.6, 'shine', .9], [1.4, 'pop']], year: '2002', ink: '#EBE6BA',
    cap: 'En 2002, Daniel Kahneman ganó el Nobel de Economía. Y era psicólogo, no economista.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), d = this.t1 - this.t0;
      const m = L.back(L.seg(lt, .6 * d / 8.5, .6 * d / 8.5 + .6));
      w.medalla.scale.setScalar(Math.max(.001, m)); w.medalla.rotation.z = t * .7;
      w.silla.visible = false;
      L.pose(w.kah, { armR: [.35, .2, .3], armL: [.35, -.2, .3], head: [-.06, 0, 0], lid: Math.max(.1, L.blink(q, 3)), brow: .4, smile: .8 });
      cam(w, mixv([-1.4, 3.6, 11.5], [-.4, 3.3, 9.4], L.eio(p)), mixv([-.6, 2.6, -1.4], [-.3, 2.5, -1.4], L.eio(p)));
      w.focusOn(w.medalla, .9); w.aperture = .00024;
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
      const mira = L.eio(L.seg(p, .3, .7));
      L.pose(w.kah, { armR: [.3, .2, .3], armL: [.3, -.2, .3], head: [.04, mira * .62, 0], lid: Math.max(.3, L.blink(q, 4)), brow: -.3, smile: -.2 });
      cam(w, mixv([-.2, 3.2, 12.0], [.4, 2.9, 9.8], L.eio(p)), mixv([.3, 2.4, -.6], [.7, 2.2, -.6], L.eio(p)));
      w.focusOn(w.silla, 1.1); w.aperture = .00026;
    },
    overlay(lt, t, L) {
      const ink = '#EBE6BA'; L.scrim(L.C, 0, 800, .64, '20,15,38');
      head(L, 'El que faltó', ['Tversky murió', 'en 1996'], 'El Nobel no se entrega póstumo: Kahneman lo recibió solo', ink, lt, L.B.terracota);
    } },

  { id: 'cierre', world: 'cierre', d: 8, sfx: [[.5, 'shine', .6]], year: 'HOY',
    cap: 'Tu peor enemigo invirtiendo no está en la pantalla. Está de este lado.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      L.pose(w.inv, { armR: [.3, .2, .3], armL: [.3, -.2, .3], head: [-.05, 0, 0], lid: Math.max(.15, L.blink(q, 3)), brow: .1, smile: .25 });
      cam(w, mixv([-.5, 3.2, 11.5], [.2, 3.0, 9.4], L.eio(p)), mixv([0, 2.6, -2], [0, 2.5, -2], L.eio(p)));
      w.focusOn(w.esp, 1.0); w.aperture = .00022;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 780, .78, '235,230,186');
      head(L, 'Finanzas conductuales', ['Tu peor enemigo', 'no está en', 'la pantalla'], 'Está de este lado', ink, lt, L.B.azul);
    } },
];

export default { id: '2026-11-21-KAHNEMAN-historia', title: 'Los psicólogos que rompieron la economía', tail: 1.2, worlds, scenes };
