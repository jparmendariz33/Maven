// SpaceX: de casi quebrar a la IPO más grande de la historia — historia 3D "Costa Diorama" (~60 s)
// Cada escena: d (duración estimada; la voz real la reemplaza vía build/timing.js), world (mundo 3D),
// cap (subtítulo con dígitos), update(w, lt) (anima el mundo), overlay(lt) (capa editorial).
import SERIES from './series.js';

const IPO = 135, PEAK = 211.39, NOW = 134.27;
const P = (lt, s) => lt / (s.t1 - s.t0);   // progreso 0..1 de la escena

// ---------------------------------------------------------------- mundos
const worlds = {
  // 1 · la costa: despegue el día de la IPO
  coast(L) {
    const { THREE, B, mesh, clay } = L, w = L.world({ fog: [70, 140] }), base = new THREE.Group(); w.scene.add(base);
    const sea = mesh(new THREE.CylinderGeometry(9, 9, 1.2, 96, 1, false, Math.PI * .5, Math.PI), clay(B.azul, .55)); sea.position.y = .6; base.add(sea);
    const beach = mesh(new THREE.CylinderGeometry(9, 9, 1.35, 96, 1, false, -Math.PI * .5, Math.PI), clay(B.arenaOsc, .95)); beach.position.y = .675; base.add(beach);
    const r = L.rng(5), waves = [];
    for (let i = 0; i < 26; i++) { const wv = mesh(new THREE.CapsuleGeometry(.08, .9, 4, 8), clay(B.azulClaro, .6), false); wv.rotation.z = Math.PI / 2;
      const z = -1.5 - r() * 6.5, x = (r() * 2 - 1) * Math.sqrt(Math.max(0, 81 - z * z)) * .85; wv.position.set(x, 1.22, z); wv.userData.ph = r() * 6; base.add(wv); waves.push(wv); }
    const tw = new THREE.Group(); tw.position.set(5.2, 1.35, -2.6); base.add(tw); const dk = clay('#1E1F24', .7);
    [[-.45, -.45], [.45, -.45], [-.45, .45], [.45, .45]].forEach(([x, z]) => { const p = mesh(new THREE.BoxGeometry(.12, 6.5, .12), dk); p.position.set(x, 3.25, z); tw.add(p); });
    for (let y = .6; y < 6.5; y += .9) { const b = mesh(new THREE.BoxGeometry(1.0, .08, 1.0), dk); b.position.y = y; tw.add(b); }
    const pad = mesh(new THREE.CylinderGeometry(1.6, 1.8, .4, 32), clay('#BDB28A', .9)); pad.position.set(3.3, 1.55, -2.6); base.add(pad);
    const rk = L.rocket(5.2); base.add(rk);
    const sm = L.puffs(34, 3.0, .85, 3); sm.position.set(3.3, 1.7, -2.6); base.add(sm);
    [[-6, 3], [-4.6, 5.2], [5.5, 4.4]].forEach(([x, z]) => base.add(L.palm(x, z, 1.35)));
    [[3.5, 6.5], [-2.5, 7.3], [6.8, 1.5]].forEach(([x, z]) => { const k = mesh(new THREE.DodecahedronGeometry(.45), clay(B.terracota)); k.position.set(x, 1.5, z); base.add(k); });
    const elon = L.guy({ mark: B.azul }); elon.scale.setScalar(1.25); elon.position.set(-2.3, 1.35, 3.0); elon.rotation.y = .75; base.add(elon);
    return { ...w, rk, sm, elon, waves };
  },
  // 2-3 · la isla de 2008: tres cohetes perdidos y el cuarto que sí llegó
  island(L) {
    const { THREE, B, mesh, clay } = L, w = L.world({ bg: B.terracotaClaro, fog: [80, 160] });
    const sea = mesh(new THREE.CylinderGeometry(10, 10, 1, 96), clay(B.azul, .55)); sea.position.y = .5; w.scene.add(sea);
    const isl = mesh(new THREE.CylinderGeometry(4.6, 5.2, 1.5, 48), clay(B.arenaOsc, .95)); isl.position.y = .75; w.scene.add(isl);
    const r = L.rng(8);
    for (let i = 0; i < 30; i++) { const a = r() * 6.28, d = 5.6 + r() * 3.6, wv = mesh(new THREE.CapsuleGeometry(.07, .7, 4, 8), clay(B.azulClaro, .6), false);
      wv.rotation.set(0, -a, Math.PI / 2); wv.position.set(Math.cos(a) * d, 1.02, Math.sin(a) * d); w.scene.add(wv); }
    [[-3.2, -1.8], [-2.6, -3], [3.4, 1.6]].forEach(([x, z]) => w.scene.add(L.palm(x, z, 1.5)));
    const pad = mesh(new THREE.CylinderGeometry(1.1, 1.3, .3, 32), clay('#BDB28A', .9)); pad.position.set(1.4, 1.65, -1.2); w.scene.add(pad);
    const rockets = [0, 1, 2, 3].map(() => { const k = L.rocket(3.6); k.scale.setScalar(.8); k.visible = false; w.scene.add(k); return k; });
    const booms = [0, 1, 2].map(i => { const b = L.burst(10 + i, .9); w.scene.add(b); return b; });
    const sm = L.puffs(20, 1.8, .6, 7); sm.position.set(1.4, 1.7, -1.2); w.scene.add(sm);
    // estela del cuarto cohete (se revela con drawRange)
    const path = new THREE.CatmullRomCurve3([[1.4, 3.4, -1.2], [1.6, 9, -1.4], [3, 18, -2.5], [7, 30, -5]].map(a => new THREE.Vector3(...a)));
    const trailG = new THREE.TubeGeometry(path, 120, .16, 10); const trail = mesh(trailG, clay(B.mostaza, .7), false); w.scene.add(trail);
    // monedas del contrato con la NASA
    const NC = 70, coins = new THREE.InstancedMesh(new THREE.CylinderGeometry(.32, .32, .08, 24), clay(B.mostaza, .45), NC); coins.castShadow = true; w.scene.add(coins);
    const cd = []; for (let i = 0; i < NC; i++) cd.push({ x: (r() - .5) * 7, z: (r() - .5) * 5 + .8, d: r() * 1.4, sp: 6 + r() * 4, rx: r() * 6, ry: r() * 6 });
    const elon = L.guy({ mark: B.azul }); elon.position.set(-1.6, 1.5, 2.2); elon.rotation.y = .35; w.scene.add(elon);
    return { ...w, rockets, booms, sm, trail, trailG, path, coins, cd, elon };
  },
  // 4 · Starlink: el globo, los satélites y el anillo de ingresos
  starlink(L) {
    const { THREE, B, mesh, clay } = L, w = L.world({});
    const sys = new THREE.Group(); sys.position.y = 3.3; sys.scale.setScalar(.7); w.scene.add(sys);
    const g = L.globe(4.2); sys.add(g);
    const rings = [], sats = [];
    [[1.1, .2], [1.45, -.5], [.75, .9]].forEach(([rx, rz], k) => { const ring = new THREE.Group(); ring.rotation.set(rx, 0, rz); sys.add(ring);
      ring.add(mesh(new THREE.TorusGeometry(5.3 + k * .35, .02, 6, 160), clay(B.azulClaro, .6), false)); rings.push(ring);
      for (let i = 0; i < 14; i++) { const s = new THREE.Group(), a = i / 14 * Math.PI * 2; s.position.set(Math.cos(a) * (5.3 + k * .35), Math.sin(a) * (5.3 + k * .35), 0);
        s.add(mesh(new THREE.BoxGeometry(.22, .22, .22), clay(B.gris, .6))); const pn = mesh(new THREE.BoxGeometry(.7, .03, .26), clay('#1A2C66', .4)); s.add(pn);
        s.userData.at = (i * 3 + k) / 42; ring.add(s); sats.push(s); } });
    // anillo de ingresos: 100 segmentos de 1%
    const rev = new THREE.Group(); rev.rotation.set(.95, 0, -.12); sys.add(rev);
    const segs = []; for (let i = 0; i < 100; i++) { const sg = mesh(new THREE.TorusGeometry(6.2, .3, 12, 6, Math.PI * 2 / 100 * 1.04), clay(i < 61 ? B.mostaza : B.azulClaro, .7));
      sg.rotation.z = Math.PI / 2 - i / 100 * Math.PI * 2; sg.scale.setScalar(.001); rev.add(sg); segs.push(sg); }
    return { ...w, g, rings, sats, rev, segs, sys };
  },
  // 5 · la fusión con xAI y el centro de datos en órbita
  orbit(L) {
    const { THREE, B, mesh, clay } = L, w = L.world({ bg: B.azul, dark: true, paper: false });
    w.scene.add(L.stars());
    const earth = mesh(new THREE.SphereGeometry(9, 96, 64), clay(B.azulNoche, .8)); earth.position.set(0, -6.5, -2); w.scene.add(earth);
    const r = L.rng(21);
    for (let i = 0; i < 16; i++) { const c = mesh(new THREE.SphereGeometry(1 + r() * 1.6, 24, 18), clay(r() > .5 ? B.musgo : B.arenaOsc, .95)); c.scale.z = .25;
      const v = new THREE.Vector3().setFromSphericalCoords(8.85, r() * 1.2, r() * 6.28); c.position.copy(v).add(earth.position); c.lookAt(earth.position); c.rotateX(Math.PI / 2); w.scene.add(c); }
    const block = (label, col, ink) => { const b = new THREE.Group(); b.add(mesh(new THREE.BoxGeometry(1.8, 1.0, 1.0), clay(col, .7)));
      const p = L.plaque(1.65, .66, (g, W, H) => { g.fillStyle = col; g.fillRect(0, 0, W, H); g.fillStyle = ink; g.font = `800 ${H * .5}px Unbounded`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, W / 2, H / 2 + 6); });
      p.position.z = .51; b.add(p); w.scene.add(b); return b; };
    const bx = block('SpaceX', B.gris, B.negro), bai = block('xAI', '#1E1F24', B.arena);
    const flash = L.puffs(18, 1.2, .45, 4, B.mostaza); flash.position.set(0, 6.3, 0); w.scene.add(flash);
    const dc = L.satellite({ dc: true }); dc.scale.setScalar(1.8); dc.position.set(0, 6.3, 0); w.scene.add(dc);
    const arc = new THREE.CatmullRomCurve3([[-7, .5, 3], [-3.5, 3.0, 5], [0, 3.8, 5.6], [3.5, 3.0, 5], [7, .5, 3]].map(a => new THREE.Vector3(...a)));
    const arcM = mesh(new THREE.TubeGeometry(arc, 80, .045, 8), clay(B.mostaza, .6), false); w.scene.add(arcM);
    const fleet = [.12, .3, .7, .88].map(u => { const s = L.satellite({}); s.position.copy(arc.getPoint(u)); s.scale.setScalar(.7); s.rotation.set(.35, -(u - .5) * 1.2, 0); w.scene.add(s); return s; });
    const elon = L.guy({ mark: B.azul }); elon.scale.setScalar(.8); w.scene.add(elon);
    return { ...w, bx, bai, flash, dc, arcM, fleet, elon };
  },
  // 6-7 · la montaña rusa: la gráfica real de SPCX como pista
  coaster(L) {
    const { THREE, B, mesh, clay } = L, w = L.world({ fog: [60, 130] });
    const pts = [[ '2026-06-12', IPO ], ...SERIES], N = pts.length, DX = .42, X0 = -2;
    const Y = p => 1.0 + (p - 100) * .075;
    const v = pts.map(([d, p], i) => new THREE.Vector3(X0 + i * DX, Y(p), 0));
    const shape = new THREE.Shape(); shape.moveTo(v[0].x, 0); v.forEach(p => shape.lineTo(p.x, p.y)); shape.lineTo(v[N - 1].x, 0); shape.closePath();
    const wall = mesh(new THREE.ExtrudeGeometry(shape, { depth: .9, bevelEnabled: true, bevelThickness: .08, bevelSize: .08, bevelSegments: 3 }), clay(B.azul, .8));
    wall.position.z = -.45; w.scene.add(wall);
    const curve = new THREE.CatmullRomCurve3(v.map(p => p.clone().add(new THREE.Vector3(0, .12, 0))), false, 'centripetal');
    [-.3, .3].forEach(z => { const rail = mesh(new THREE.TubeGeometry(curve, 600, .055, 8), clay('#1E1F24', .5), false); rail.position.z = z; w.scene.add(rail); });
    for (let i = 0; i < N; i += 2) { const tie = mesh(new THREE.BoxGeometry(.1, .06, .8), clay(B.terracota, .8), false); tie.position.copy(v[i]).add(new THREE.Vector3(0, .08, 0)); w.scene.add(tie); }
    const slab = mesh(new THREE.BoxGeometry(N * DX + 3, .3, 3.4), clay(B.arenaOsc, .95)); slab.position.set(X0 + N * DX / 2, -.15, 0); w.scene.add(slab);
    // línea punteada del precio de salida
    for (let x = X0 - 1; x < X0 + N * DX + 1; x += .5) { const d = mesh(new THREE.BoxGeometry(.28, .06, .06), clay(B.mostaza, .6), false); d.position.set(x, Y(IPO), .62); w.scene.add(d); }
    const label = (txt, sub, col, ink) => L.plaque(2.6, 1.0, (g, W, H) => { g.fillStyle = col; g.beginPath(); g.roundRect(0, 0, W, H, 40); g.fill(); g.fillStyle = ink;
      g.font = `800 ${H * .4}px Unbounded`; g.fillText(txt, 30, H * .52); g.font = `500 ${H * .2}px "Space Grotesk"`; g.globalAlpha = .75; g.fillText(sub, 32, H * .82); });
    const lIPO = label('$135', 'Precio de salida · 12 jun', B.mostaza, B.negro); lIPO.position.set(X0 - .2, Y(IPO) + 1.6, .7); w.scene.add(lIPO);
    const iPk = pts.findIndex(p => p[1] === PEAK);
    const lPk = label('$211.39', 'Máximo · 16 jun', B.arena, B.negro); lPk.position.set(v[iPk].x + 1.2, v[iPk].y + 1.5, .7); w.scene.add(lPk);
    const lNow = label('$134.27', 'Hoy · 6 nov', B.negro, B.arena); lNow.position.set(v[N - 1].x - .4, v[N - 1].y + 2.2, .7); w.scene.add(lNow);
    const lQ3 = L.plaque(3.4, 1.4, (g, W, H) => { g.fillStyle = B.musgo; g.beginPath(); g.roundRect(0, 0, W, H, 50); g.fill(); g.fillStyle = B.arena;
      g.font = `800 ${H * .34}px Unbounded`; g.fillText('+$4,400 M', 34, H * .5); g.font = `500 ${H * .17}px "Space Grotesk"`; g.fillText('Utilidad neta · T3 2026', 36, H * .8); });
    lQ3.position.set(v[N - 1].x - 2.4, v[N - 1].y + 5.0, .7); w.scene.add(lQ3);
    // carrito con Elon
    const cart = new THREE.Group(), body = mesh(new THREE.BoxGeometry(1.0, .45, .8), clay(B.terracota, .6)); body.position.y = .35; cart.add(body);
    [[-.32, .42], [.32, .42], [-.32, -.42], [.32, -.42]].forEach(([x, z]) => { const wh = mesh(new THREE.CylinderGeometry(.14, .14, .1, 16), clay('#1E1F24')); wh.rotation.x = Math.PI / 2; wh.position.set(x, .12, z); cart.add(wh); });
    const elon = L.guy({ mark: B.azul }); elon.scale.setScalar(.5); elon.position.set(-.05, .25, 0); elon.rotation.y = .9; cart.add(elon);
    w.scene.add(cart);
    return { ...w, pts, v, curve, cart, elon, Y, iPk, labels: { lIPO, lPk, lNow, lQ3 } };
  },
  // 8 · cierre: noche azul, satélites y Elon en la Luna
  night(L) {
    const { THREE, B, mesh, clay } = L, w = L.world({ bg: B.azul, dark: true, paper: false });
    w.scene.add(L.stars(160, 6));
    const earth = mesh(new THREE.SphereGeometry(9, 96, 64), clay(B.azulNoche, .8)); earth.position.set(0, -5.5, -2); w.scene.add(earth);
    const r = L.rng(31);
    for (let i = 0; i < 16; i++) { const c = mesh(new THREE.SphereGeometry(1 + r() * 1.6, 24, 18), clay(r() > .5 ? B.musgo : B.arenaOsc, .95)); c.scale.z = .25;
      const v = new THREE.Vector3().setFromSphericalCoords(8.85, r() * 1.2, r() * 6.28); c.position.copy(v).add(earth.position); c.lookAt(earth.position); c.rotateX(Math.PI / 2); w.scene.add(c); }
    const arc = new THREE.CatmullRomCurve3([[-7, .5, 3], [-3.5, 3.0, 5], [0, 3.8, 5.6], [3.5, 3.0, 5], [7, .5, 3]].map(a => new THREE.Vector3(...a)));
    w.scene.add(mesh(new THREE.TubeGeometry(arc, 80, .045, 8), clay(B.mostaza, .6), false));
    const sats = [.12, .3, .5, .7, .88].map(u => { const s = L.satellite({}); s.position.copy(arc.getPoint(u)); s.scale.setScalar(.75); s.rotation.set(.35, -(u - .5) * 1.2, 0); w.scene.add(s); return s; });
    const moon = mesh(new THREE.SphereGeometry(1.4, 48, 32), clay(B.arenaOsc, .95)); moon.position.set(2.6, 6.6, 1.5); w.scene.add(moon);
    const elon = L.guy({ mark: B.azul }); elon.scale.setScalar(.75); elon.position.set(2.5, 7.85, 1.7); elon.rotation.y = -.5; w.scene.add(elon);
    return { ...w, sats, elon };
  },
};

// ---------------------------------------------------------------- utilidades de escena
function look(cam, p, t) { cam.position.set(...p); cam.lookAt(...t); }
function mixv(a, b, k) { return a.map((x, i) => x + (b[i] - x) * k); }
function headline(L, lt, l1, l2, c2, sub, ink, t0 = 0, y = 500, S = 104) {
  L.rise(l1, 90, y, L.seg(lt, t0 + .1, t0 + .7), { f: L.F.d, w: 800, s: S, c: ink });
  if (l2) L.rise(l2, 90, y + S * 1.1, L.seg(lt, t0 + .2, t0 + .8), { f: L.F.d, w: 800, s: S, c: c2 });
  if (sub) L.rise(sub, 90, y + (l2 ? 180 : 65), L.seg(lt, t0 + .35, t0 + .95), { s: 40, c: ink, a: .75 });
}

// ---------------------------------------------------------------- escenas
const scenes = [
  { id: 'gancho', world: 'coast', d: 6.6, year: '2026',
    cap: '¿Cómo una empresa que casi quiebra en 2008… hizo la salida a bolsa más grande de la historia?',
    update(w, lt, t, L) {
      const s = this, p = P(lt, s), rise = L.ex(L.seg(lt, .5, 6.5));
      w.rk.position.set(3.3, 1.75 + 2.6 + 2.6 + rise * rise * 4.5, -2.6); w.rk.userData.flame.scale.setScalar(.9 + .15 * Math.sin(t * 40));
      w.sm.userData.update(L.seg(lt, 0, 1.6) * .6 + .4 * L.seg(lt, .4, 2.4));
      w.waves.forEach(v => v.position.y = 1.22 + Math.sin(t * 2 + v.userData.ph) * .03);
      L.face(w.elon, { lid: .55, brow: .4, smile: 1 });
      w.elon.userData.arms[1].rotation.z = 2.5 + Math.sin(t * 9) * .35; w.elon.userData.head.rotation.set(-.3, -.6 + Math.sin(t * 1.3) * .06, 0);
      const k = L.eio(p); look(w.cam, mixv([-4, 10, 30], [-2.6, 9.4, 26.5], k), mixv([.4, 6.6, 0], [.8, 7.6, 0], k));
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.kicker('12 jun 2026 · Nasdaq: SPCX', 360, 1, ink);
      L.txt('$75,000', 90, 500, { f: L.F.d, w: 800, s: 120, c: ink }); L.txt('millones', 90, 615, { f: L.F.d, w: 800, s: 104, c: L.B.azul });
      L.txt('La IPO más grande de la historia', 90, 680, { s: 40, c: ink, a: .75 });
    } },

  { id: '2008', world: 'island', d: 7.0, year: '2008',
    cap: 'En 2008, SpaceX ya había perdido sus tres primeros cohetes. Solo le alcanzaba para un último intento.',
    big: [['ÚLTIMO', .8, '#BB6F58']],
    update(w, lt, t, L) {
      const s = this, p = P(lt, s), d = s.t1 - s.t0, T = [.1, .3, .5].map(f => f * d);
      w.rockets.forEach((r, i) => { r.visible = false; });
      T.forEach((ta, i) => { const r = w.rockets[i]; if (lt > ta - .5 && lt < ta + 1.1) { r.visible = true; const up = L.ex(L.seg(lt, ta, ta + 1.1));
        r.position.set(1.4, 3.2 + up * 5.5, -1.2); r.rotation.z = up * (i - 1) * .5; r.scale.setScalar(.8 * L.pop(lt, ta - .5, .35)); r.userData.flame.visible = lt > ta; }
        w.booms[i].position.set(1.4 + (i - 1) * 2.75 * .5 * 0, 3.2 + 5.5, -1.2); w.booms[i].userData.update(L.seg(lt, ta + 1.05, ta + 2.2)); });
      const r4 = w.rockets[3]; r4.visible = p > .7; r4.position.set(1.4, 3.2, -1.2); r4.rotation.z = 0; r4.scale.setScalar(.8 * L.pop(lt, .7 * d, .45)); r4.userData.flame.visible = false;
      w.sm.userData.update(0); w.trailG.setDrawRange(0, 0);
      w.coins.count = 0;
      const worry = L.seg(p, .15, .6);
      L.face(w.elon, { lid: L.lerp(.3, .1, worry), brow: -worry, smile: L.lerp(.3, -.7, worry), sweat: p > .35 });
      w.elon.userData.arms[1].rotation.z = p > .32 ? 2.6 + Math.sin(t * 7) * .15 : .25; // se rasca la cabeza
      w.elon.userData.head.rotation.set(-.35 + Math.sin(t * 1.5) * .03, .35, 0);
      const k = L.eio(p); look(w.cam, mixv([-7, 9.5, 27], [-5.5, 8.5, 23], k), mixv([.4, 5.4, 0], [.4, 5.0, 0], k));
    },
    overlay(lt, t, L, s) {
      const ink = L.B.negro, d = s.t1 - s.t0, T = [.1, .3, .5].map(f => f * d + 1.05);
      L.kicker('2006 – 2008 · Falcon 1', 360, L.seg(lt, .1, .6), ink);
      headline(L, lt, '3 cohetes', 'perdidos', L.B.terracota, null, ink);
      for (let i = 0; i < 4; i++) { const x = 120 + i * 96, y = 690, on = i < 3 ? lt > T[i] : lt > .7 * d, k = L.pop(lt, i < 3 ? T[i] : .7 * d, .4);
        L.C.save(); L.C.globalAlpha *= L.seg(lt, .3 + i * .08, .7 + i * .08); L.C.lineWidth = 5; L.C.strokeStyle = i < 3 ? ink : L.B.mostaza;
        L.C.beginPath(); L.C.arc(x, y, 32, 0, 7); L.C.stroke();
        if (on) { L.C.translate(x, y); L.C.scale(k, k);
          if (i < 3) { L.C.strokeStyle = L.B.terracota; L.C.lineWidth = 9; L.C.lineCap = 'round'; L.C.beginPath(); L.C.moveTo(-14, -14); L.C.lineTo(14, 14); L.C.moveTo(14, -14); L.C.lineTo(-14, 14); L.C.stroke(); }
          else { L.C.fillStyle = L.B.mostaza; L.C.font = `800 36px ${L.F.d}`; L.C.textAlign = 'center'; L.C.fillText('?', 0, 13); } }
        L.C.restore(); }
    } },

  { id: 'orbita', world: 'island', d: 7.3, year: '2008', trans: 'cont',
    cap: 'El cuarto llegó a órbita. Y tres meses después, la NASA le dio un contrato de 1,600 millones de dólares.',
    update(w, lt, t, L) {
      const s = this, p = P(lt, s), d = s.t1 - s.t0;
      w.rockets.forEach(r => r.visible = false); w.booms.forEach(b => b.userData.update(0));
      const r4 = w.rockets[3], u = L.seg(lt, .2, 2.6), uu = u * u;
      r4.visible = u < 1; const pt = w.path.getPoint(Math.min(.999, uu)), tg = w.path.getTangent(Math.min(.999, uu));
      r4.position.copy(pt).add(new L.THREE.Vector3(0, uu < .01 ? -.2 : 0, 0)); r4.scale.setScalar(.8); r4.userData.flame.visible = lt > .2;
      r4.rotation.z = -Math.atan2(tg.x, tg.y);
      w.sm.userData.update(L.seg(lt, .1, 1.2));
      w.trailG.setDrawRange(0, Math.floor(w.trailG.index.count * uu / 6) * 6);
      // lluvia de monedas
      const t0 = .45 * d, D = new L.THREE.Object3D(); w.coins.count = lt > t0 ? w.cd.length : 0;
      w.cd.forEach((c, i) => { const lt2 = lt - t0 - c.d, y = Math.max(1.6 + (i % 7) * .09, 14 - Math.max(0, lt2) * c.sp);
        D.position.set(c.x, lt2 < 0 ? 40 : y, c.z); D.rotation.set(y > 1.8 ? c.rx + lt * 5 : 0, c.ry, 0); D.updateMatrix(); w.coins.setMatrixAt(i, D.matrix); });
      w.coins.instanceMatrix.needsUpdate = true;
      const joy = L.seg(p, .1, .3);
      L.face(w.elon, { lid: L.lerp(.1, .15, joy), brow: L.lerp(-1, .3, joy), smile: L.lerp(-.7, 1, joy), sweat: joy < .5 });
      const cheer = L.seg(p, .45, .55); w.elon.userData.arms[1].rotation.z = L.lerp(.25, 2.7, cheer) + Math.sin(t * 8) * .15 * cheer; w.elon.userData.arms[-1].rotation.z = L.lerp(-.25, -2.7, cheer) - Math.sin(t * 8) * .15 * cheer;
      w.elon.userData.head.rotation.set(L.lerp(-.9, -.3, L.seg(p, .32, .45)), L.lerp(.2, .35, cheer), 0);
      // cámara: sigue al cohete hacia arriba y regresa a Elon
      const up = L.eio(L.seg(p, 0, .12)) * (1 - L.eio(L.seg(p, .36, .5))), rp = w.path.getPoint(Math.min(.999, Math.min(uu, .75)));
      look(w.cam, mixv([-5.5, 8.5, 23], [rp.x - 5, rp.y - 1, 24], up), mixv([.4, 5.0, 0], [rp.x, rp.y + 3.2, rp.z], up));
      w.trail.visible = p < .45;
    },
    overlay(lt, t, L, s) {
      const ink = L.B.negro, d = s.t1 - s.t0, b = .43 * d;
      if (lt < b) { const k = 1 - L.seg(lt, b - .25, b); L.C.save(); L.C.globalAlpha = k;
        L.kicker('28 sep 2008 · 4.º intento', 360, L.seg(lt, .1, .6), ink); headline(L, lt, '¡Llegó a', 'órbita!', L.B.azul, 'El primer cohete privado de su tipo en lograrlo', ink); L.C.restore(); }
      else { const l2 = lt - b, n = 1600 * L.ex(L.seg(l2, .3, 1.5));
        L.kicker('Dic 2008 · NASA', 360, L.seg(l2, 0, .5), ink);
        L.rise('$' + L.fmt(Math.round(n)), 90, 500, L.seg(l2, .1, .6), { f: L.F.d, w: 800, s: 120, c: ink });
        L.rise('millones', 90, 615, L.seg(l2, .2, .8), { f: L.F.d, w: 800, s: 104, c: L.B.mostaza });
        L.rise('Contrato de carga a la Estación Espacial', 90, 680, L.seg(l2, .35, .95), { s: 40, c: ink, a: .75 }); }
    } },

  { id: 'starlink', world: 'starlink', d: 10.0, year: '2025',
    cap: 'Luego vino Starlink: internet desde el espacio en 164 países. En 2025, ya era el 61% de sus ingresos.',
    update(w, lt, t, L) {
      const s = this, p = P(lt, s);
      w.g.rotation.y = lt * .25; w.g.userData.lightUp(L.seg(p, .12, .45));
      w.g.scale.setScalar(L.pop(lt, 0, .6));
      w.rings.forEach((r, k) => r.rotation.y = lt * (.12 + k * .05));
      w.sats.forEach(sat => sat.scale.setScalar(Math.max(.001, L.pop(p, .05 + sat.userData.at * .4, .06))));
      const rk = L.seg(p, .55, .82); w.segs.forEach((sg, i) => sg.scale.setScalar(Math.max(.001, L.pop(rk * 100, i - 2, 4))));
      w.rev.rotation.z = -.12 + lt * .03;
      const k = L.eio(L.seg(p, .45, .6)); look(w.cam, mixv([0, 6.5, 30], [0, 11, 29], k), mixv([0, 5.0, 0], [0, 5.9, 0], k));
    },
    overlay(lt, t, L, s) {
      const ink = L.B.negro, d = s.t1 - s.t0, b = .5 * d;
      if (lt < b) { const n = Math.round(164 * L.ex(L.seg(lt, .12 * d, .45 * d))); L.C.save(); L.C.globalAlpha = 1 - L.seg(lt, b - .25, b);
        L.kicker('Starlink · internet satelital', 360, L.seg(lt, .1, .6), ink);
        L.rise(String(n), 90, 500, L.seg(lt, .1, .7), { f: L.F.d, w: 800, s: 120, c: ink }); L.rise('países', 90, 615, L.seg(lt, .2, .8), { f: L.F.d, w: 800, s: 104, c: L.B.azul });
        L.rise('Más de 10 millones de suscriptores', 90, 680, L.seg(lt, .35, .95), { s: 40, c: ink, a: .75 }); L.C.restore(); }
      else { const l2 = lt - b, n = Math.round(61 * L.ex(L.seg(lt, .55 * d, .82 * d)));
        L.kicker('Ingresos de SpaceX · 2025', 360, L.seg(l2, 0, .5), ink);
        L.rise(n + '%', 90, 500, L.seg(l2, .1, .6), { f: L.F.d, w: 800, s: 120, c: L.B.mostaza });
        L.rise('de sus ingresos', 90, 600, L.seg(l2, .2, .8), { f: L.F.d, w: 800, s: 80, c: ink });
        L.rise('$11,400 de $18,700 millones vinieron de Starlink', 90, 665, L.seg(l2, .35, .95), { s: 36, c: ink, a: .75 }); }
    } },

  { id: 'plan', world: 'orbit', d: 7.7, year: '2026', ink: '#EBE6BA',
    cap: 'En febrero, Elon fusionó SpaceX con xAI. ¿El plan? Llevar los centros de datos de inteligencia artificial… al espacio.',
    update(w, lt, t, L) {
      const s = this, p = P(lt, s), m = L.eio(L.seg(p, .05, .3)), merged = p > .3;
      w.bx.position.set(L.lerp(-2.0, -.92, m), 6.3, 0); w.bai.position.set(L.lerp(2.0, .92, m), 6.3, 0);
      w.bx.visible = w.bai.visible = !merged; w.bx.rotation.y = w.bai.rotation.y = -.15;
      w.flash.userData.update(merged ? L.seg(p, .3, .4) * (1 - L.seg(p, .42, .5)) : 0);
      w.dc.visible = merged; w.dc.scale.setScalar(2.1 * Math.max(.001, L.pop(p, .31, .07)));
      w.dc.userData.update(L.eio(L.seg(p, .55, .68)), t); w.dc.rotation.set(.25, -.5 + lt * .12, 0);
      w.fleet.forEach((f, i) => { f.userData.update(0, t + i); f.visible = p > .7; });
      w.elon.position.set(-2.3, 3.7 + Math.sin(t * 1.6) * .15, 2.5); w.elon.rotation.set(.1, .5, Math.sin(t) * .1);
      L.face(w.elon, { lid: .6, brow: .5, smile: 1 }); w.elon.userData.arms[1].rotation.z = 1.2;
      const k = L.eio(L.seg(p, .7, 1)); look(w.cam, mixv([0, 7.2, 27], [0, 7.6, 35], k), mixv([0, 5.6, 0], [0, 6.2, 0], k));
    },
    overlay(lt, t, L, s) {
      const ink = L.B.arena, d = s.t1 - s.t0, b = .5 * d;
      if (lt < b) { L.C.save(); L.C.globalAlpha = 1 - L.seg(lt, b - .25, b); L.kicker('2 feb 2026 · Fusión', 360, L.seg(lt, .1, .6), ink);
        headline(L, lt, 'SpaceX', '+ xAI', L.B.mostaza, 'Valuación combinada: $1.25 billones', ink); L.C.restore(); }
      else { const l2 = lt - b; L.kicker('El plan', 360, L.seg(l2, 0, .5), ink); headline(L, l2, 'Centros de datos', 'en órbita', L.B.mostaza, 'Inteligencia artificial alimentada por el Sol', ink, -.1, 500, 84); }
    } },

  { id: 'ipo', world: 'coaster', d: 8.9, year: '2026',
    cap: 'En junio salió a bolsa a 135 dólares, y recaudó 75,000 millones. A los pocos días, ya valía 211.',
    update(w, lt, t, L) {
      const s = this, p = P(lt, s), u = L.eio(L.seg(p, .55, .95)) * w.iPk;   // índice continuo sobre la serie
      placeCart(w, u, L); w.labels.lQ3.visible = false;
      w.labels.lPk.scale.setScalar(Math.max(.001, L.pop(p, .9, .08))); w.labels.lNow.visible = false; w.labels.lIPO.scale.setScalar(Math.max(.001, L.pop(p, .08, .08)));
      L.face(w.elon, { lid: L.lerp(.5, .2, L.seg(p, .55, .7)), brow: .4, smile: 1 });
      w.elon.userData.arms[1].rotation.z = p > .55 ? 2.8 : 1.2; w.elon.userData.arms[-1].rotation.z = p > .55 ? -2.8 : -.25;
      const c = w.cart.position; look(w.cam, [c.x - 4.5, c.y + 5, 26], [c.x + 2, c.y + 4, 0]);
    },
    overlay(lt, t, L, s) {
      const ink = L.B.negro, d = s.t1 - s.t0, b = .52 * d;
      if (lt < b) { L.C.save(); L.C.globalAlpha = 1 - L.seg(lt, b - .25, b); L.kicker('12 jun 2026 · IPO a $135', 360, L.seg(lt, .1, .6), ink);
        const n = 75000 * L.ex(L.seg(lt, .15, .45 * d)); L.rise('$' + L.fmt(Math.round(n / 100) * 100), 90, 500, L.seg(lt, .1, .7), { f: L.F.d, w: 800, s: 120, c: ink });
        L.rise('millones', 90, 615, L.seg(lt, .2, .8), { f: L.F.d, w: 800, s: 104, c: L.B.azul }); L.rise('Recaudados en un solo día', 90, 680, L.seg(lt, .35, .95), { s: 40, c: ink, a: .75 }); L.C.restore(); }
      else priceHUD(L, lt - b, this._price, this._date, ink);
    } },

  { id: 'hoy', world: 'coaster', d: 9.5, year: 'Hoy', trans: 'cont',
    cap: 'Hoy cotiza en 134: debajo de su precio de salida. Aunque en su último trimestre, por fin ganó 4,400 millones.',
    update(w, lt, t, L) {
      const s = this, p = P(lt, s), N = w.pts.length - 1, u = w.iPk + (N - w.iPk) * L.seg(p, 0, .55);
      placeCart(w, u, L);
      w.labels.lPk.scale.setScalar(1); w.labels.lNow.visible = true; w.labels.lNow.scale.setScalar(Math.max(.001, L.pop(p, .55, .06)));
      w.labels.lQ3.visible = false;
      const fear = L.seg(p, .05, .3), relief = L.seg(p, .7, .8);
      L.face(w.elon, { lid: L.lerp(.2, .05, fear), brow: L.lerp(.4, -1, fear) + relief * 1.2, smile: L.lerp(1, -.8, fear) + relief * 1.6, sweat: fear > .5 && relief < .5 });
      w.elon.userData.arms[1].rotation.z = L.lerp(2.8, .3, fear); w.elon.userData.arms[-1].rotation.z = L.lerp(-2.8, -.3, fear);
      const c = w.cart.position, wide = L.eio(L.seg(p, 0, .12)) * (1 - L.eio(L.seg(p, .2, .3)));
      const tail = L.eio(L.seg(p, .6, .75));
      const follow = [c.x - 4.5, c.y + 5, 26], fT = [c.x + 2, c.y + 4, 0];
      const mid = w.v[Math.round(w.v.length / 2)];
      let pos = mixv(follow, [mid.x, 8, 46], wide), tgt = mixv(fT, [mid.x, 6.5, 0], wide);
      pos = mixv(pos, [c.x - 3, c.y + 4.5, 24], tail); tgt = mixv(tgt, [c.x - .6, c.y + 3.4, 0], tail);
      look(w.cam, pos, tgt);
    },
    overlay(lt, t, L, s) {
      const ink = L.B.negro, d = s.t1 - s.t0, b = .68 * d;
      if (lt < b) { L.C.save(); L.C.globalAlpha = 1 - L.seg(lt, b - .25, b); priceHUD(L, 9, this._price, this._date, ink);
        const k = L.pop(lt, .55 * d, .4); if (k > 0) { L.C.save(); L.C.translate(90, 715); L.C.scale(k, k); L.C.fillStyle = L.B.terracota; L.C.beginPath(); L.C.roundRect(0, -46, 470, 62, 31); L.C.fill();
          L.txt('Debajo de su precio de salida', 26, -4, { w: 700, s: 30, c: L.B.arena }); L.C.restore(); } L.C.restore(); }
      else { const l2 = lt - b; L.kicker('T3 2026 · Resultados', 360, L.seg(l2, 0, .5), ink);
        const n = 4400 * L.ex(L.seg(l2, .2, 1.3)); L.rise('+$' + L.fmt(Math.round(n / 10) * 10), 90, 500, L.seg(l2, .1, .6), { f: L.F.d, w: 800, s: 120, c: L.B.musgo });
        L.rise('millones', 90, 615, L.seg(l2, .2, .8), { f: L.F.d, w: 800, s: 104, c: ink }); L.rise('Su primera utilidad desde la IPO', 90, 680, L.seg(l2, .35, .95), { s: 40, c: ink, a: .75 }); }
    } },

  { id: 'cierre', world: 'night', d: 3.6, year: null, ink: '#EBE6BA',
    cap: '¿Visión del siglo… o burbuja?',
    update(w, lt, t, L) {
      w.sats.forEach((s, i) => s.userData.update(0, t + i)); w.elon.userData.head.rotation.set(.15, .25 + Math.sin(t * 1.2) * .25, .1);
      L.face(w.elon, { lid: .4, brow: .6, smile: .6 });
      look(w.cam, [Math.sin(lt * .2) * 1.5, 7, 34 - lt * .4], [0, 7.4, 0]);
    },
    overlay(lt, t, L) {
      const a = L.B.arena;
      L.rise('¿Visión del siglo…', 540, 470, L.seg(lt, .15, .8), { f: L.F.s, it: 1, s: 118, c: a, al: 'center' });
      L.rise('o burbuja?', 540, 610, L.seg(lt, .9, 1.5), { f: L.F.s, it: 1, s: 150, c: L.B.mostaza, al: 'center' });
      L.rise('Desde la costa, todo se ve con claridad.', 540, 700, L.seg(lt, 1.6, 2.2), { f: L.F.s, it: 1, s: 44, c: a, al: 'center', a: .85 });
      L.txt('Contenido educativo · No es asesoría financiera', 540, 1790, { s: 26, c: a, al: 'center', a: .6 * L.seg(lt, 1.8, 2.4) });
    } },
];

// carrito sobre la serie (u = índice continuo)
function placeCart(w, u, L) {
  const N = w.pts.length - 1, f = Math.min(.9999, Math.max(0, u / N)), pt = w.curve.getPoint(f), tg = w.curve.getTangent(f);
  w.cart.position.copy(pt); w.cart.rotation.z = Math.atan2(tg.y, tg.x);
  const i = Math.min(N - 1, Math.floor(u)), k = u - i, p0 = w.pts[i][1], p1 = w.pts[Math.min(N, i + 1)][1];
  scenes.forEach(s => { if (s.world === 'coaster') { s._price = p0 + (p1 - p0) * k; s._date = w.pts[Math.round(u)][0]; } });
}
const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function priceHUD(L, l2, price, date, ink) {
  if (price == null) return; const [y, m, d] = date.split('-').map(Number);
  L.kicker('Precio de SPCX · ' + d + ' ' + MES[m - 1], 360, L.seg(l2, 0, .4), ink);
  L.rise('$' + L.fmt(price, 2), 90, 500, L.seg(l2, .05, .5), { f: L.F.d, w: 800, s: 120, c: price >= IPO ? ink : L.B.terracota });
  const ch = (price / IPO - 1) * 100;
  L.rise((ch >= 0 ? '+' : '') + ch.toFixed(1) + '% vs. su precio de salida ($135)', 90, 570, L.seg(l2, .15, .6), { s: 38, c: ink, a: .75 });
}

export default { id: '2026-11-09-SPCX-historia', title: 'SpaceX: de casi quebrar a la IPO más grande de la historia', tail: 1.2, worlds, scenes };
