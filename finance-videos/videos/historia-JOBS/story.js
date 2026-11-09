// Steve Jobs: lo corrieron de su propia empresa — historia 3D "Costa Diorama v2" (luz de cine + actores articulados)
// Cada escena: d (duración estimada; la voz real la reemplaza vía build/timing.js), world, cap (subtítulo), update(), overlay().
import SERIES from './series.js';

const P = (lt, s) => lt / (s.t1 - s.t0);
const mixv = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const cam = (w, pos, tgt) => { w.cam.position.set(...pos); w.cam.lookAt(...tgt); };

// ---------------------------------------------------------------- reparto
const JOBS_85 = { shirt: '#27365A', pants: '#27365A', shoes: '#1B1B1B', hair: '#2A1D14', hairStyle: 'mop', collar: 'suit', bow: '#BB6F58', seed: 3 };
const JOBS_76 = { shirt: '#EFE7D2', pants: '#3F5E8C', shoes: '#8A6A4A', hair: '#2A1D14', hairStyle: 'mop', beard: '#2A1D14', seed: 3 };
const JOBS_07 = { shirt: '#111111', pants: '#4A6FA5', shoes: '#DADADA', hair: '#B9B6AE', hairStyle: 'short', beard: '#A9A69E', glasses: '#9A9A9A', collar: 'turtle', seed: 3 };
const JOBS_86 = { shirt: '#17171B', pants: '#2B2F3A', shoes: '#1B1B1B', hair: '#2A1D14', hairStyle: 'mop', collar: 'turtle', seed: 3 };
const JOBS_97 = { shirt: '#111111', pants: '#4A6FA5', shoes: '#DADADA', hair: '#5A5048', hairStyle: 'side', glasses: '#9A9A9A', collar: 'turtle', seed: 3 };
const WOZ_76 = { shirt: '#7E8C54', pants: '#5B4A3A', shoes: '#2A2A2A', hair: '#2E2118', hairStyle: 'mop', beard: '#2E2118', glasses: true, size: 1.08, seed: 8 };
const BOARD = [
  { shirt: '#4A4E57', hair: '#C9C5BB', hairStyle: 'short', glasses: true, tie: '#BB6F58' }, { shirt: '#2F3B4F', hair: '#3B2A1E', hairStyle: 'side', tie: '#C7A317' },
  { shirt: '#5A4638', hair: '#8A8378', hairStyle: 'bald', tie: '#4173D1' }, { shirt: '#3A3F4A', hair: '#1E1A17', hairStyle: 'side', glasses: true, tie: '#7E8C54' },
  { shirt: '#4F5563', hair: '#D8D4CA', hairStyle: 'side', tie: '#BB6F58' }, { shirt: '#2B2F3A', hair: '#5A4030', hairStyle: 'short', tie: '#C7A317' },
].map((o, i) => ({ ...o, pants: o.shirt, shoes: '#1B1B1B', collar: 'suit', seed: 20 + i }));

// la sede: de día (1985, lo sacan) y de noche (1997, regresa)
function hq(L, night) {
    const { THREE, B, mesh, clay2, rbox } = L, wins = [];
    const w = night
      ? L.cineWorld({ bg: '#27376E', bg2: '#101A40', floor: '#3A4160', fog: [40, 110], hemi: .34, sky: '#9DB4FF', ground: '#2A2F45', key: 1.0, keyPos: [-10, 14, 10], keyCol: '#A9BEFF', rim: 1.1, rimCol: '#8FA8FF', fill: .25 })
      : L.cineWorld({ bg: '#F0C9A4', bg2: '#E79C7A', floor: '#D8C7A0', fog: [40, 110], hemi: .5, key: 3.1, keyPos: [-13, 8, 9], keyCol: '#FFD6A0', rim: 2.8, rimPos: [10, 9, -12], rimCol: '#FFB98A', fill: .35 });
    const bld = new THREE.Group(); bld.position.set(.6, 0, -4.2); w.scene.add(bld);
    const wall = rbox(15, 5.0, 1.2, .2, clay2('#EFE9DA', .9)); wall.position.y = 2.5; bld.add(wall);
    const trim = rbox(15.6, .35, 1.6, .1, clay2('#C9BFA6', .9)); trim.position.y = 5.1; bld.add(trim);
    [-2, -1, 1, 2].forEach(c => { const win = rbox(1.5, 1.9, .2, .12, clay2(B.azulNoche, .35, .3)); win.material = win.material.clone(); wins.push(win); win.position.set(c * 2.35 + Math.sign(c) * .5, 2.3, .62); bld.add(win);
      const sill = rbox(1.7, .14, .3, .05, clay2('#DCD3BD', .9)); sill.position.set(c * 2.35 + Math.sign(c) * .5, 1.25, .68); bld.add(sill); });
    const frame = rbox(3.3, 3.5, .4, .15, clay2('#3A3F4A', .6)); frame.position.set(0, 1.75, .55); bld.add(frame);
    const doors = [-1, 1].map(s => { const d = rbox(1.45, 3.0, .12, .06, clay2(B.azulClaro, .25, .2)); d.position.set(s * .75, 1.6, .78); bld.add(d);
      const h = rbox(.08, .7, .1, .03, clay2('#C7A317', .4)); h.position.set(-s * .5, 0, .1); d.add(h); return d; });
    const sign = L.label3d('APPLE COMPUTER', 3.6, .62, { font: '800 70px Unbounded', ls: 4 }); sign.position.set(0, 4.1, .64); bld.add(sign);
    [[0, .12, 1.6, 5.4, .24, 1.6], [0, .36, 1.2, 4.6, .24, .9]].forEach(([x, y, z, a, b, c]) => { const st = rbox(a, b, c, .08, clay2('#CFC4A6', .95)); st.rotation.x = 0; st.position.set(x, y, z); bld.add(st); });
    w.scene.add(L.tree(-3.9, -1.2, 1.5), L.tree(4.6, -1.6, 1.7, '#8E9A5E'), L.tree(-5.4, 2.4, 1.1, '#94A064'));
    const jobs = L.actor(night ? JOBS_97 : JOBS_85); w.scene.add(jobs);
    const inside = new THREE.PointLight('#FFC56E', 0, 14, 1.6); inside.position.set(.6, 2.2, -2.2); w.scene.add(inside);
    if (night) { w.vig = .5; w.scene.add(L.stars(110, 12)); return { ...w, jobs, doors, bld, wins, inside }; }
    const box = new THREE.Group(); box.position.set(0, .62, .66); jobs.userData.torso.add(box);
    box.add(rbox(.98, .58, .72, .05, clay2('#B98B5E', .95)));
    const pot = mesh(new THREE.CylinderGeometry(.13, .1, .2, 12), clay2(B.terracota)); pot.position.set(-.26, .38, 0); box.add(pot);
    [[0, .62, 0, .17], [-.12, .55, .05, .12], [.1, .56, -.04, .13]].forEach(([x, y, z, r]) => { const lf = mesh(new THREE.SphereGeometry(r, 12, 10), clay2(B.musgo)); lf.position.set(-.26 + x, y, z); box.add(lf); });
    const fr = rbox(.3, .4, .05, .03, clay2('#2B2B2B', .5)); fr.position.set(.2, .44, .05); fr.rotation.z = -.2; box.add(fr);
    const bk = rbox(.34, .34, .1, .03, clay2(B.mostaza, .8)); bk.position.set(.05, .36, -.18); bk.rotation.x = .3; box.add(bk);
    return { ...w, jobs, doors, bld, wins, inside };
}

// ---------------------------------------------------------------- mundos
const worlds = {
  // 1 · 1985: la puerta se cierra detrás de él
  exit(L) { return hq(L, false); },
  back(L) { return hq(L, true); },
  // 2 · 1976: el garaje
  garage(L) {
    const { THREE, B, mesh, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#22346A', bg2: '#0F1838', floor: '#39405A', fog: [30, 90], hemi: .32, sky: '#9DB4FF', ground: '#2A2F45', key: .9, keyPos: [-10, 14, 10], keyCol: '#A9BEFF', rim: .9, rimCol: '#8FA8FF', fill: .2 });
    w.vig = .5; w.scene.add(L.stars(120, 6));
    const g = new THREE.Group(); g.position.set(0, 0, -1.2); w.scene.add(g);
    const wallM = clay2('#D9C49A', .95), outM = clay2('#EDE6D2', .9);
    const back = rbox(6.2, 4.3, .3, .1, wallM); back.position.set(0, 2.15, -2.6); g.add(back);
    [-1, 1].forEach(s => { const sd = rbox(.3, 4.3, 5.2, .1, outM); sd.position.set(s * 3.1, 2.15, -.1); g.add(sd); });
    const flr = rbox(6.2, .16, 5.2, .06, clay2('#8E8672', .95)); flr.position.set(0, .08, -.1); g.add(flr);
    const roof = rbox(7.2, .3, 6, .12, clay2('#8C5A45', .9)); roof.position.set(0, 4.45, -.1); g.add(roof);
    const door = rbox(5.9, .9, .14, .06, clay2('#C9BFA6', .9)); door.position.set(0, 4.0, 2.42); g.add(door);   // portón enrollado
    // foco colgante + luz cálida
    const cord = mesh(new THREE.CylinderGeometry(.015, .015, .7, 6), clay2('#1b1b1b'), false); cord.position.set(0, 3.95, .2); g.add(cord);
    const bulb = mesh(new THREE.SphereGeometry(.14, 16, 12), L.emit('#FFD98A', 3), false); bulb.position.set(0, 3.55, .2); g.add(bulb);
    const sp = new THREE.SpotLight('#FFC56E', 260, 16, 1.15, .7, 1.6); sp.position.set(0, 3.5, .2); sp.target.position.set(0, 0, .6); sp.castShadow = true; sp.shadow.mapSize.set(1024, 1024); sp.shadow.radius = 6; sp.shadow.bias = -.001; g.add(sp, sp.target);
    const pl = new THREE.PointLight('#FFB85C', 14, 9, 1.8); pl.position.set(0, 3.2, .2); g.add(pl);
    const front = new THREE.PointLight('#FFD9A8', 22, 12, 1.6); front.position.set(-2.2, 2.6, 4.2); g.add(front);   // relleno cálido de frente para las caras
    // banco de trabajo, tablero de herramientas, repisas
    const wood = clay2('#A8703E', .9), bench = new THREE.Group(); bench.position.set(.75, 0, .1); g.add(bench);
    const top = rbox(3.0, .16, 1.15, .05, wood); top.position.y = 1.3; bench.add(top);
    [[-1.35, -.45], [1.35, -.45], [-1.35, .45], [1.35, .45]].forEach(([x, z]) => { const lg = rbox(.14, 1.2, .14, .03, clay2('#7C4F2B', .9)); lg.position.set(x, .62, z); bench.add(lg); });
    const peg = rbox(2.6, 1.4, .08, .05, clay2('#B89A6A', .95)); peg.position.set(1.2, 2.9, -2.4); g.add(peg);
    [[-.9, .3, .5, .1, B.terracota], [-.3, .25, .12, .7, '#8A8A8A'], [.3, .3, .6, .12, B.azul], [.85, .2, .14, .6, B.mostaza], [0, -.35, .9, .1, '#555']].forEach(([x, y, a, b, c]) => { const tl = rbox(a, b, .08, .03, clay2(c, .6)); tl.position.set(1.2 + x, 2.9 + y, -2.32); g.add(tl); });
    const shelf = rbox(1.9, .1, .5, .03, wood); shelf.position.set(-1.9, 2.7, -2.25); g.add(shelf);
    [[-2.5, B.azul, .5], [-2.0, B.terracota, .62], [-1.5, B.musgo, .42]].forEach(([x, c, h]) => { const bx = rbox(.4, h, .36, .04, clay2(c, .9)); bx.position.set(x, 2.75 + h / 2, -2.25); g.add(bx); });
    const crate = rbox(.9, .7, .8, .05, clay2('#B98B5E', .95)); crate.position.set(-2.3, .5, -1.6); g.add(crate);
    // la computadora: caja de madera, teclado y monitor
    const pc = new THREE.Group(); pc.position.set(-.35, 1.38, .05); bench.add(pc);
    const cs = rbox(1.25, .2, .82, .05, clay2('#B5793F', .85)); cs.position.y = .1; pc.add(cs);
    const kb = rbox(1.0, .06, .36, .03, clay2('#2A2A2A', .6)); kb.position.set(0, .22, .18); kb.rotation.x = -.12; pc.add(kb);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 11; j++) { const ky = rbox(.06, .03, .06, .012, clay2('#E8E2D0', .6)); ky.castShadow = false; ky.position.set(-.4 + j * .08, .262 - i * .0085, .06 + i * .075); ky.rotation.x = -.12; pc.add(ky); }
    const mon = rbox(.82, .66, .6, .09, clay2('#D9D2BF', .7)); mon.position.set(-.18, .56, -.18); pc.add(mon);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(.6, .44), new THREE.MeshBasicMaterial({ map: L.canvasTex((c, W2, H2) => { c.fillStyle = '#0B1A10'; c.fillRect(0, 0, W2, H2); c.fillStyle = '#7CF29A'; c.font = '700 46px monospace';
      ['APPLE 1', '> HOLA_'].forEach((s, i) => c.fillText(s, 26, 70 + i * 62)); }, 256, 192) })); scr.position.set(-.18, .57, .125); pc.add(scr);
    const pcl = new THREE.PointLight('#7CF29A', 1.6, 2.5, 2); pcl.position.set(-.18, .6, .6); pc.add(pcl);
    pc.scale.setScalar(.001);
    const jobs = L.actor(JOBS_76); jobs.position.set(-1.25, .16, .75); jobs.rotation.y = .55; g.add(jobs);
    const woz = L.actor(WOZ_76); woz.position.set(2.05, .16, -1.2); woz.rotation.y = -.45; g.add(woz);
    return { ...w, g, pc, jobs, woz, bulb, sp, pl };
  },
  // 3 · 1985: el consejo vota
  board(L) {
    const { THREE, B, mesh, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#E9DFC6', bg2: '#D2BF95', floor: '#7A5A45', fog: [45, 120], hemi: .6, key: 2.9, keyPos: [-11, 12, 9], keyCol: '#FFF0DA', rim: 2.0, rimPos: [9, 9, -4], rimCol: '#FFE2B8', fill: .4 });
    const wallB = rbox(14, 11, .4, .1, clay2('#E6DCC0', .95)); wallB.position.set(0, 4.5, -6.6); w.scene.add(wallB);
    const wains = rbox(14, 1.5, .5, .08, clay2('#8A5F45', .7)); wains.position.set(0, .75, -6.5); w.scene.add(wains);
    const table = rbox(1.7, .2, 8.2, .1, clay2('#5B3A29', .55, .5)); table.position.set(0, 1.28, -.6); w.scene.add(table);
    [-3, 2].forEach(z => { const ped = rbox(1.0, 1.2, 1.0, .1, clay2('#472C1F', .7)); ped.position.set(0, .6, z - .1); w.scene.add(ped); });
    const members = BOARD.map((o, i) => { const s = i % 2 ? 1 : -1, z = -2.9 + Math.floor(i / 2) * 2.3, a = L.actor(o);
      a.position.set(s * 1.5, -.3, z); a.rotation.y = -s * .95; w.scene.add(a);
      const ch = rbox(1.0, 1.9, .16, .08, clay2('#2E2A28', .6)); ch.position.set(s * 2.05, 1.5, z); ch.rotation.y = -s * Math.PI / 2; w.scene.add(ch);
      const pad = new THREE.Group(); pad.position.y = -.4; a.userData.arms[s].el.add(pad);            // paleta de voto
      const stick = rbox(.07, .7, .07, .02, clay2('#E8E2D0', .8)); stick.position.y = -.3; pad.add(stick);
      const disc = mesh(new THREE.CylinderGeometry(.36, .36, .07, 28), clay2(B.terracota, .8)); disc.rotation.x = Math.PI / 2; disc.position.y = -.85; pad.add(disc);
      [-1, 1].forEach(k => { const x1 = rbox(.42, .08, .03, .02, clay2('#F4F1E8', .8)); x1.castShadow = false; x1.rotation.z = k * Math.PI / 4; x1.position.set(0, -.85, .05); pad.add(x1);
        const x2 = x1.clone(); x2.position.z = -.05; pad.add(x2); });
      pad.scale.setScalar(.001); a.userData.pad = pad;
      const pp = rbox(.5, .02, .66, .01, clay2('#F4F1E8', .8)); pp.castShadow = false; pp.position.set(s * .5, 1.4, z + .05); pp.rotation.y = s * .15; w.scene.add(pp); return a; });
    const jobs = L.actor(JOBS_85); jobs.position.set(0, 0, -5.3); w.scene.add(jobs);
    return { ...w, members, jobs };
  },
  // 4 · 1985-1996: Jobs funda NeXT; Apple pierde el rumbo
  next(L) {
    const { THREE, B, mesh, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#EBE6BA', bg2: '#DCCF8E', floor: '#DCCF8E', fog: [45, 120], hemi: .55, key: 3.0, keyPos: [-10, 14, 11], rim: 2.4, fill: .4 });
    const plinth = rbox(2.2, .3, 2.2, .08, clay2('#CFC4A6', .9)); plinth.position.set(-1.0, .15, .6); w.scene.add(plinth);
    const cube = rbox(1.5, 1.5, 1.5, .07, clay2('#17171B', .32, .4)); cube.position.set(-1.0, 1.05, .6); cube.rotation.y = .5; w.scene.add(cube);
    const nx = L.label3d('NeXT', 1.1, .5, { bg: null, ink: '#F4F1E8', font: '800 150px Unbounded', pw: 512 }); nx.position.set(0, .15, .76); cube.add(nx);
    const jobs = L.actor(JOBS_86); jobs.position.set(-2.3, 0, 1.7); jobs.rotation.y = .7; w.scene.add(jobs);
    // la torre de Apple al fondo: cajas beige que se van cayendo
    const tower = new THREE.Group(); tower.position.set(1.75, 0, -2.6); w.scene.add(tower);
    const r = L.rng(31), boxes = [];
    for (let i = 0; i < 6; i++) { const bx = rbox(1.5 - i * .06, .74, 1.3 - i * .05, .08, clay2(i % 2 ? '#E4DCC6' : '#D8CFB6', .85)); bx.userData = { y: .37 + i * .74, dx: (r() - .3) * 2.4, dz: 1 + r() * 2.6, rz: (r() - .5) * 3, rx: r() * 2 };
      const stripe = rbox(.5, .07, .02, .01, clay2(['#7E8C54', '#C7A317', '#BB6F58', '#4173D1'][i % 4], .7)); stripe.castShadow = false; stripe.position.set(-.35, .2, (1.3 - i * .05) / 2 + .012); bx.add(stripe); tower.add(bx); boxes.push(bx); }
    const sign = L.label3d('APPLE', 1.2, .34, { font: '800 120px Unbounded', pw: 512 }); sign.position.set(0, .05, .66); boxes[0].add(sign);
    return { ...w, cube, jobs, boxes, tower };
  },
  // 7 · hoy: la escalera es la gráfica real de la acción (mensual, escala logarítmica)
  climb(L) {
    const { THREE, B, mesh, clay2 } = L;
    const w = L.cineWorld({ bg: '#EBE6BA', bg2: '#F2ECC9', floor: '#DCCF8E', fog: [50, 130], hemi: .55, key: 3.0, keyPos: [-9, 15, 12], rim: 2.6, fill: .4 });
    const N = 52, lo = Math.log10(Math.min(...SERIES.map(a => a[1]))), hi = Math.log10(Math.max(...SERIES.map(a => a[1])));
    const pts = Array.from({ length: N }, (_, i) => SERIES[Math.round(i * (SERIES.length - 1) / (N - 1))]);
    const hs = pts.map(a => .5 + (Math.log10(a[1]) - lo) / (hi - lo) * 5.9), SW = .112, x0 = -(N - 1) * SW / 2;
    const iDeath = pts.findIndex(a => a[0] >= '2011-10'), bars = [];
    pts.forEach((a, i) => { const m = clay2(i <= iDeath ? B.azul : B.mostaza, .8), b = mesh(new THREE.BoxGeometry(SW * .9, 1, 1.5), m); b.position.set(x0 + i * SW, 0, 0); w.scene.add(b); bars.push(b); });
    const jobs = L.actor({ ...JOBS_07, size: .5 }); w.scene.add(jobs);
    const star = mesh(new THREE.SphereGeometry(.16, 20, 16), L.emit('#FFE08A', 2.5), false); w.scene.add(star);
    const sl = new THREE.PointLight('#FFD98A', 6, 5, 1.8); star.add(sl);
    return { ...w, bars, hs, pts, jobs, star, x0, SW, N, iDeath };
  },
  // 6 · 1998-2007: el escenario
  stage(L) {
    const { THREE, B, mesh, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#0D0E14', bg2: '#06060A', floor: '#17181F', fog: [30, 80], hemi: .1, key: 0, rim: 1.7, rimPos: [6, 9, -12], rimCol: '#8FB0FF', fill: .12 });
    w.vig = .55; w.floor.material.roughness = .42;
    const riser = rbox(9, .5, 6, .12, clay2('#1D1F28', .5, .4)); riser.position.set(0, .25, -.8); w.scene.add(riser);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 6.6), new THREE.MeshBasicMaterial({ map: L.canvasTex((c, W2, H2) => {
      const gr = c.createLinearGradient(0, 0, 0, H2); gr.addColorStop(0, '#152A66'); gr.addColorStop(1, '#0A1230'); c.fillStyle = gr; c.fillRect(0, 0, W2, H2);
 }, 880, 1076) }));
    screen.position.set(0, 4.6, -4.2); w.scene.add(screen);
    const screenOn = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 6.6), new THREE.MeshBasicMaterial({ transparent: true, map: L.canvasTex((c, W2, H2) => {
      c.strokeStyle = '#EBE6BA'; c.lineWidth = 11; c.beginPath(); c.roundRect(W2 * .66 - 84, 440, 168, 310, 30); c.stroke();
      c.fillStyle = '#EBE6BA'; c.beginPath(); c.arc(W2 * .66, 716, 14, 0, 7); c.fill(); c.fillRect(W2 * .66 - 24, 464, 48, 7); }, 880, 1076) }));
    screenOn.position.set(0, 4.6, -4.18); w.scene.add(screenOn);
    // pedestales: iMac (1998) y iPod (2001)
    const mkPed = x => { const g = new THREE.Group(); g.position.set(x, .5, .1); w.scene.add(g); const c = mesh(new THREE.CylinderGeometry(.42, .48, 1.5, 28), clay2('#2A2C38', .5, .4)); c.position.y = .75; g.add(c); const top = new THREE.Group(); top.position.y = 1.5; g.add(top); return { g, top }; };
    const pedA = mkPed(.75), pedB = mkPed(1.85);
    const teal = new THREE.MeshStandardMaterial({ color: '#2FB3A8', roughness: .3, transparent: true, opacity: .9 });
    const im = rbox(.86, .78, .7, .3, teal); im.position.y = .5; pedA.top.add(im);
    const imS = new THREE.Mesh(new THREE.PlaneGeometry(.56, .42), new THREE.MeshBasicMaterial({ color: '#BFE3FF' })); imS.position.set(0, .54, .36); pedA.top.add(imS);
    const imB = rbox(.6, .1, .5, .05, clay2('#EDEDED', .4, 0)); imB.position.y = .06; pedA.top.add(imB);
    const ip = rbox(.44, .76, .1, .09, clay2('#F4F4F2', .3, 0)); ip.position.y = .44; ip.rotation.x = -.12; pedB.top.add(ip);
    const ipS = new THREE.Mesh(new THREE.PlaneGeometry(.32, .25), new THREE.MeshBasicMaterial({ color: '#C9D6C2' })); ipS.position.set(0, .2, .056); ip.add(ipS);
    const ipW = mesh(new THREE.CylinderGeometry(.13, .13, .02, 28), clay2('#D5D5D2', .4, 0), false); ipW.rotation.x = Math.PI / 2; ipW.position.set(0, -.15, .056); ip.add(ipW);
    [pedA, pedB].forEach(pd => { const l = new THREE.SpotLight('#FFF2DA', 160, 16, .16, .6, 1.5); l.position.set(pd.g.position.x - 1.5, 10, 6); l.target = pd.top; w.scene.add(l); pd.light = l; });
    // cierre: un banco con sus lentes
    const stool = new THREE.Group(); stool.position.set(-.85, .5, .6); w.scene.add(stool);
    const seat = mesh(new THREE.CylinderGeometry(.42, .42, .1, 28), clay2('#8A5F45', .6)); seat.position.y = 1.25; stool.add(seat);
    [0, 1, 2].forEach(i => { const lg = rbox(.07, 1.25, .07, .02, clay2('#6B4632', .6)); const a = i * 2.094; lg.position.set(Math.cos(a) * .3, .62, Math.sin(a) * .3); lg.rotation.set(Math.sin(a) * -.12, 0, Math.cos(a) * .12); stool.add(lg); });
    const fold = rbox(.56, .12, .46, .05, clay2('#111111', .9)); fold.position.y = 1.36; stool.add(fold);
    [-1, 1].forEach(k => { const rg = mesh(new THREE.TorusGeometry(.1, .012, 8, 28), clay2('#B5B5B5', .3, 0), false); rg.position.set(k * .12, 1.46, .05); rg.rotation.x = -1.2; stool.add(rg); });
    const bez = rbox(5.8, 7.0, .2, .1, clay2('#0B0B0F', .5)); bez.position.set(0, 4.6, -4.35); w.scene.add(bez);
    const glowL = new THREE.PointLight('#5C86FF', 30, 14, 1.6); glowL.position.set(0, 4.5, -3.2); w.scene.add(glowL);
    const spot = new THREE.SpotLight('#FFF2DA', 900, 30, .2, .55, 1.5); spot.position.set(-3.5, 13, 8); spot.target.position.set(-.85, 1.8, .6); spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.radius = 6; spot.shadow.bias = -.0008; w.scene.add(spot, spot.target);
    const jobs = L.actor(JOBS_07); jobs.position.set(-.85, .5, .6); w.scene.add(jobs);
    const phone = new THREE.Group(); phone.position.set(0, -.5, .1); jobs.userData.arms[1].el.add(phone);
    phone.add(rbox(.3, .54, .05, .05, clay2('#1A1A1A', .3, 0)));
    const ps = new THREE.Mesh(new THREE.PlaneGeometry(.25, .44), new THREE.MeshBasicMaterial({ color: '#DDE9FF' })); ps.position.z = .03; phone.add(ps);
    const pg = new THREE.PointLight('#CFE0FF', 2.5, 3, 2); pg.position.z = .3; phone.add(pg);
    // público: siluetas en primer plano (quedan fuera de foco)
    const r = L.rng(41), crowd = [];
    for (let row = 0; row < 3; row++) for (let i = 0; i < 6 + row; i++) { const p = new THREE.Group(), m = clay2(['#15161C', '#1B1D26', '#20222C'][(i + row) % 3], .9);
      const hd = mesh(new THREE.SphereGeometry(.5, 20, 16), m), bd = mesh(new THREE.CapsuleGeometry(.55, .5, 6, 16), m); hd.position.y = 1.45; bd.position.y = .5; p.add(hd, bd);
      p.position.set((i - (5 + row) / 2) * 1.25 + (r() - .5) * .4, -.5 - row * .1, 6.2 + row * 1.7); p.userData.ph = r() * 6; w.scene.add(p); crowd.push(p); }
    return { ...w, jobs, phone, crowd, spot, screen, screenOn, pedA, pedB, stool };
  },
};

// ---------------------------------------------------------------- escenas
const head = (L, k1, title, sub, ink, lt, col) => {
  L.kicker(k1, 360, L.seg(lt, .1, .5), ink);
  title.forEach((ln, i) => L.rise(ln, 90, 470 + i * 96, L.seg(lt, .25 + i * .12, .8 + i * .12), { f: L.F.d, w: 800, s: 78, c: i === title.length - 1 && col ? col : ink }));
  if (sub) L.rise(sub, 90, 470 + title.length * 96 - 26, L.seg(lt, .7, 1.2), { s: 38, c: ink, a: .8 });
};

const scenes = [
  { id: 'gancho', world: 'exit', d: 7.5, year: '1985',
    cap: 'En 1985, a Steve Jobs lo sacaron de Apple. La empresa que él mismo había fundado.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), k = L.eio(L.seg(p, 0, .72)), z = L.lerp(-2.2, 3.4, k), x = L.lerp(.6, -.9, k), moving = p < .72;
      w.jobs.position.set(x, moving && z < -.6 ? .5 - L.seg(z, -2.2, -.6) * .5 : 0, z); w.jobs.rotation.y = -.22; w.inside.intensity = 0;
      const back = L.eio(L.seg(p, .76, .92));                                    // se detiene y voltea a ver el edificio
      L.pose(w.jobs, { walk: moving ? q * 7.5 : null, amp: .5, armL: [1.0, .02, 1.0, 1], armR: [1.0, .02, 1.0, 1], head: [.22 - back * .3, back * 1.9, 0], lean: .06,
        lid: Math.max(.35, L.blink(q, 1)), brow: -.9, smile: -.6 });
      w.doors.forEach((d, i) => d.position.x = (i ? 1 : -1) * L.lerp(2.1, .75, L.eio(L.seg(p, .25, .5))));
      cam(w, mixv([-1.6, 2.8, 22], [-2.4, 2.3, 19.5], L.eio(p)), mixv([.1, 3.9, 0], [-.4, 3.7, 0], L.eio(p))); w.focusOn(w.jobs, 1.8); w.aperture = .0003;
    },
    overlay(lt, t, L, s, w) {
      const ink = L.B.negro; L.scrim(L.C, 0, 820, .85, '240,201,164'); head(L, '1985 · Cupertino, California', ['Lo sacaron', 'de su propia', 'empresa'], null, ink, lt, L.B.terracota);
      L.tag('Steve Jobs · 30 años', w.jobs, w.cam, L.seg(lt, .9, 1.5), 3.0);
    } },

  { id: '1976', world: 'garage', d: 7, year: '1976', ink: '#EBE6BA',
    cap: 'Todo empezó en 1976, en un garaje: dos amigos y una computadora armada a mano.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = L.talkAt(L.CAPS, q);
      w.pc.scale.setScalar(Math.max(.001, L.pop(lt, .45 * (this.t1 - this.t0), .5)));
      w.bulb.position.x = Math.sin(t * 1.3) * .05; const fl = 1 + Math.sin(t * 23) * .02; w.sp.intensity = 260 * fl;
      L.pose(w.jobs, { armR: [1.25 + Math.sin(q * 3) * .06, .5, .35], armL: [.1, .2, .3], head: [-.05, .35 + Math.sin(q * 1.1) * .08, 0], lid: Math.max(.1, L.blink(q, 2)), brow: .5, smile: 1, talk: talk * .8, bob: Math.abs(Math.sin(q * 3)) * .02 });
      L.pose(w.woz, { armL: [.9, .1, 1.3 + Math.sin(q * 6) * .12], armR: [.85, .1, 1.2 - Math.sin(q * 6) * .12], head: [.28, -.1, 0], lid: Math.max(.3, L.blink(q, 5)), brow: .2, smile: .7 });
      cam(w, mixv([-.6, 3.0, 18.5], [.2, 2.7, 15.2], L.eio(p)), mixv([0, 3.7, 0], [.2, 3.5, 0], L.eio(p))); w.focusOn(w.pc, .3); w.aperture = .00024;
    },
    overlay(lt, t, L, s, w) {
      const ink = '#EBE6BA'; L.scrim(L.C, 0, 760, .55, '8,12,30'); head(L, '1976 · Los Altos, California', ['Un garaje,', 'dos amigos'], 'y una computadora armada a mano', ink, lt, L.B.mostaza);
      L.tag('Steve Wozniak', w.woz, w.cam, L.seg(lt, 1.6, 2.2), 3.3);
    } },

  { id: 'consejo', world: 'board', d: 9, year: '1985',
    cap: 'Nueve años después, chocó con el director que él mismo había contratado. Y el consejo no lo eligió a él.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), d = this.t1 - this.t0;
      w.members.forEach((m, i) => { const up = L.back(L.seg(lt, .5 * d + i * .16, .5 * d + i * .16 + .4)), s = i % 2 ? 1 : -1, arm = [up * 2.85, .14 + up * .12, .1, 1]; m.userData.pad.scale.setScalar(Math.max(.001, up));
        L.pose(m, { [s > 0 ? 'armR' : 'armL']: arm, head: [.05, s * -.25 * L.seg(p, .2, .4), 0], lid: Math.max(.3, L.blink(q, i * 2)), brow: .6, smile: -.2 }); });
      const hurt = L.seg(p, .55, .88), talk = p < .45 ? L.talkAt(L.CAPS, q) : 0;
      L.pose(w.jobs, { head: [.1 + hurt * .3, Math.sin(q * 1.2) * .25 * (1 - hurt), 0], lid: Math.max(.1 + hurt * .4, L.blink(q, 3)), brow: p < .45 ? .8 : -hurt, smile: L.lerp(.1, -.8, hurt), talk, sweat: p > .65,
        armL: p < .45 ? [.9 + Math.sin(q * 5) * .2, .5, .6] : [0, .12, .1], armR: p < .45 ? [.9 - Math.sin(q * 5) * .2, .5, .6] : [0, .12, .1], lean: hurt * .08 });
      cam(w, mixv([0, 8.2, 20], [0, 6.6, 16.5], L.eio(p)), mixv([0, 3.3, -2], [0, 3.2, -3], L.eio(p))); w.focusOn(w.jobs, 1.8); w.aperture = .0002;
    },
    overlay(lt, t, L, s, w) {
      const ink = L.B.negro; head(L, '1985 · La sala del consejo', ['El consejo', 'votó en', 'su contra'], null, ink, lt, L.B.terracota);
    } },

  { id: 'fuera', world: 'next', d: 7.5, year: '1985–96',
    cap: 'Jobs se fue y fundó otra empresa: NeXT. Mientras, Apple perdía el rumbo.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = p < .45 ? L.talkAt(L.CAPS, q) : 0;
      const ck = L.pop(lt, .5, .5); w.cube.scale.setScalar(Math.max(.001, ck)); w.cube.rotation.y = .5 + Math.sin(t * .6) * .06;
      w.boxes.forEach((b, i) => { const u = b.userData, f = .42 + (5 - i) * .1, k = i < 2 ? 0 : L.ex(L.seg(p, f, f + .2)), kq = Math.floor(k * 9) / 9;
        b.position.set(u.dx * kq, L.lerp(u.y, .4, kq * kq) + Math.sin(kq * Math.PI) * .5, u.dz * kq); b.rotation.set(u.rx * kq, 0, u.rz * kq); });
      const look2 = L.eio(L.seg(p, .5, .7));                                       // voltea a ver cómo se cae la torre
      L.pose(w.jobs, { armR: [1.1 * (1 - look2), .55, .3], armL: [.1, .2, .3], head: [-.05, .3 - look2 * 1.3, 0], lid: Math.max(.12, L.blink(q, 2)), brow: L.lerp(.6, -.3, look2), smile: L.lerp(.9, .1, look2), talk });
      cam(w, mixv([-1.1, 3.0, 21], [-.3, 2.7, 18.5], L.eio(p)), mixv([-.45, 4.1, 0], [-.25, 3.9, 0], L.eio(p)));
      p < .5 ? w.focusOn(w.cube) : w.focusOn(w.tower, 2); w.aperture = .00022;
    },
    overlay(lt, t, L, s, w) {
      const ink = L.B.negro, p = P(lt, s); L.scrim(L.C, 0, 800, .8, '235,230,186');
      head(L, '1985 – 1996 · Los años fuera', ['Él fundó NeXT.', 'Apple perdió', 'el rumbo'], null, ink, lt, L.B.terracota);
    } },

  { id: 'regreso', world: 'back', d: 12.5, year: '1997', ink: '#EBE6BA',
    cap: 'En 1997, Apple perdió más de 1,000 millones de dólares. Según Jobs, estaba a 90 días de la quiebra. Y lo llamaron de vuelta.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), turn = L.eio(L.seg(p, .5, .6)), k = L.eio(L.seg(p, .58, .9)), moving = p > .58 && p < .9;
      const z = L.lerp(4.2, -2.3, k), x = L.lerp(-1.0, .6, k);
      w.jobs.position.set(x, z < -.6 ? L.seg(-z, .6, 2.2) * .5 : 0, z); w.jobs.rotation.y = L.lerp(.35, Math.PI, turn);
      L.pose(w.jobs, { walk: moving ? q * 7.5 : null, amp: .5, head: [p < .5 ? -.25 : 0, p < .5 ? Math.sin(q * .9) * .12 : 0, 0], lid: Math.max(.15, L.blink(q, 6)), brow: .6, smile: p < .5 ? .1 : .7,
        armL: [0, .14, .15], armR: [0, .14, .15] });
      const open = L.eio(L.seg(p, .72, .86)); w.doors.forEach((d, i) => d.position.x = (i ? 1 : -1) * L.lerp(.75, 2.1, open)); w.inside.intensity = open * 90;
      w.wins.forEach((m, i) => { const on = L.seg(p, .84 + i * .035, .88 + i * .035); m.material.emissive.set('#FFC56E'); m.material.emissiveIntensity = on * 1.5; });
      cam(w, mixv([-1.2, 2.6, 22], [-.3, 2.5, 19], L.eio(p)), mixv([.1, 3.9, 0], [.3, 3.8, 0], L.eio(p))); w.focusOn(w.jobs, 1.8); w.aperture = .00028;
    },
    overlay(lt, t, L, s, w) {
      const ink = '#EBE6BA', p = P(lt, s), red = '#F0937C'; L.scrim(L.C, 0, 860, .6, '8,12,30');
      L.kicker('Año fiscal 1997 · Apple', 360, L.seg(lt, .1, .5), ink);
      const n = Math.round(1045 * L.ex(L.seg(p, .04, .22)));
      L.rise('−$' + L.fmt(n) + ' M', 90, 480, L.seg(lt, .25, .8), { f: L.F.d, w: 800, s: 104, c: red });
      L.rise('de pérdida en un solo año', 90, 545, L.seg(lt, .7, 1.2), { s: 40, c: ink, a: .85 });
      L.rise('“A 90 días de la quiebra”', 90, 660, L.seg(p, .3, .36), { f: L.F.s, it: 1, s: 74, c: L.B.mostaza });
      L.rise('— Steve Jobs, años después', 90, 712, L.seg(p, .34, .4), { s: 32, c: ink, a: .75 });
      L.tag('Steve Jobs · 42 años', w.jobs, w.cam, L.seg(p, .42, .47) * (1 - L.seg(p, .6, .64)), 3.0);
    } },

  { id: 'giro', world: 'stage', d: 10.5, year: '1998–07', ink: '#EBE6BA',
    cap: 'Recortó la mayoría de los productos y apostó por unos cuantos: el iMac, el iPod... y en 2007, el iPhone.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), up = L.back(L.seg(p, .74, .86)), talk = L.talkAt(L.CAPS, q);
      w.jobs.visible = true; w.stool.visible = false; w.crowd.forEach(c => c.visible = true);
      [[w.pedA, .42], [w.pedB, .56]].forEach(([pd, at]) => { const k = L.back(L.seg(p, at, at + .08)); pd.g.visible = k > 0; pd.g.scale.set(1, Math.max(.001, k), 1); pd.top.scale.setScalar(Math.max(.001, L.back(L.seg(p, at + .04, at + .12)))); pd.light.intensity = 160 * k; });
      w.phone.scale.setScalar(p > .72 ? 1 : .001); w.screenOn.material.opacity = L.seg(p, .82, .92);
      const point = L.seg(p, .4, .46) * (1 - L.seg(p, .68, .74));
      L.pose(w.jobs, { armR: [up * 2.1, .25, .5 - up * .2, 1], armL: [.5 + point * .6, .35 + point * .5, .7 * (1 - point) + Math.sin(q * 4) * .08], head: [-.08, up * .25 - point * .5, 0], lid: Math.max(.12, L.blink(q, 4)), brow: .7, smile: 1, talk: talk * .7 });
      w.jobs.rotation.y = -.15 + Math.sin(q * .8) * .05 - point * .35;
      w.crowd.forEach(c => { c.rotation.z = Math.sin(q * 1.4 + c.userData.ph) * .03; });
      cam(w, mixv([.9, 2.0, 17.5], [.2, 2.3, 14.2], L.eio(p)), mixv([.3, 4.4, 0], [.2, 4.1, 0], L.eio(p))); w.focusOn(w.jobs, 2); w.aperture = .00026;
    },
    overlay(lt, t, L, s, w) {
      const ink = '#EBE6BA', p = P(lt, s); L.scrim(L.C, 0, 780, .62, '5,5,10');
      head(L, '1998 – 2007 · El giro', ['Menos productos.', 'Mejores.'], null, ink, lt, L.B.mostaza);
      L.tag('iMac · 1998', w.pedA.top, w.cam, L.seg(p, .47, .52), 1.25); L.tag('iPod · 2001', w.pedB.top, w.cam, L.seg(p, .61, .66), 1.15);
      L.tag('iPhone · 2007', w.phone, w.cam, L.seg(p, .86, .91), .6);
    } },

  { id: 'hoy', world: 'climb', d: 10.5, year: 'Hoy',
    cap: 'Hoy, el iPhone es más de la mitad de las ventas de Apple, que vale unos 5 billones de dólares.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), u = L.lerp(0, w.iDeath, L.eio(L.seg(p, 0, .46))), walking = p < .46, rest = L.seg(p, .5, .82);
      const front = walking ? u + 2.5 : w.iDeath + 2.5 + rest * (w.N - w.iDeath);
      w.bars.forEach((b, i) => { const k = L.ex(L.clamp(front - i)), h = Math.max(.001, w.hs[i] * k); b.scale.y = h; b.position.y = h / 2; });
      const i0 = Math.floor(u), f = u - i0, hy = L.lerp(w.hs[i0], w.hs[Math.min(w.N - 1, i0 + 1)], f), turn = L.eio(L.seg(p, .46, .54));
      w.jobs.position.set(w.x0 + u * w.SW, Math.max(w.hs[i0], hy), .15); w.jobs.rotation.y = L.lerp(Math.PI / 2, .25, turn);
      L.pose(w.jobs, { walk: walking ? q * 9 : null, amp: .5, head: [-turn * .45, turn * .5, 0], lid: Math.max(.12, L.blink(q, 4)), brow: .5, smile: 1,
        armR: p > .56 ? [0, 2.5 + Math.sin(q * 7) * .25, .2, 1] : [0, .14, .1], armL: [0, .14, .1] });
      const li = Math.min(w.N - 1, Math.max(w.iDeath + 1, Math.floor(front - 1.2))); w.star.visible = p > .5;
      w.star.position.set(w.x0 + li * w.SW, w.hs[li] * L.clamp(front - li) + .32 + Math.sin(t * 3) * .04, 0);
      const k = L.eio(L.seg(p, .1, .8)); cam(w, mixv([w.x0 + 1.6, 2.4, 14], [.4, 4.4, 25], k), mixv([w.x0 + 1.3, 3.0, 0], [.1, 5.5, 0], k));
      p < .5 ? w.focusOn(w.jobs, .8) : w.focusOn(w.star); w.aperture = .00016;
      this._i = Math.round(walking ? u : Math.min(w.N - 1, front - 1.5)); this._pt = w.pts[Math.max(0, Math.min(w.N - 1, this._i))];
    },
    overlay(lt, t, L, s, w) {
      const ink = L.B.negro, p = P(lt, s); L.scrim(L.C, 0, 860, .9, '235,230,186');
      if (p < .8) { const [d, pr] = s._pt || w.pts[0], a = 1 - L.seg(p, .76, .8);
        L.C.save(); L.C.globalAlpha = a; L.kicker('Acción de Apple · ' + MES[+d.slice(5) - 1] + ' ' + d.slice(0, 4), 360, L.seg(lt, .1, .5), ink);
        L.rise('$' + L.fmt(pr, pr < 10 ? 2 : 0), 90, 490, L.seg(lt, .2, .7), { f: L.F.d, w: 800, s: 120, c: s._i > w.iDeath ? L.B.mostaza : L.B.azul });
        L.rise('por acción · ajustado por splits · escala logarítmica', 90, 552, L.seg(lt, .5, 1), { s: 32, c: ink, a: .75 }); L.C.restore();
      } else { const l2 = lt - .8 * (s.t1 - s.t0);
        L.kicker('Año fiscal 2026 · Apple', 360, L.seg(l2, 0, .4), ink);
        L.rise('53%', 90, 500, L.seg(l2, .05, .5), { f: L.F.d, w: 800, s: 150, c: L.B.mostaza });
        L.rise('de sus ventas: el iPhone', 90, 572, L.seg(l2, .2, .7), { f: L.F.d, w: 600, s: 46, c: ink });
        L.rise('Valor de mercado ≈ $5 billones', 90, 640, L.seg(l2, .5, 1), { s: 40, c: ink, a: .8 }); }
      L.tag('Steve Jobs · 1955–2011', w.jobs, w.cam, L.seg(p, .52, .58), 1.6);
    } },

  { id: 'cierre', world: 'stage', d: 6, year: null, ink: '#EBE6BA',
    cap: '¿Genio irrepetible... o una empresa capaz de reinventarse?',
    update(w, lt, t, L) {
      const p = P(lt, this);
      w.jobs.visible = false; w.stool.visible = true; w.crowd.forEach(c => c.visible = false); [w.pedA, w.pedB].forEach(pd => { pd.g.visible = false; pd.light.intensity = 0; }); w.screenOn.material.opacity = 0;
      cam(w, mixv([.4, 2.4, 14], [-.2, 2.1, 12], L.eio(p)), mixv([-.6, 3.5, 0], [-.7, 3.3, 0], L.eio(p))); w.focusOn(w.stool, 1.3); w.aperture = .0003;
    },
    overlay(lt, t, L) {
      const a = L.B.arena; L.scrim(L.C, 0, 900, .7, '5,5,10');
      L.rise('¿Genio irrepetible…', 540, 470, L.seg(lt, .15, .8), { f: L.F.s, it: 1, s: 106, c: a, al: 'center' });
      L.rise('o una empresa capaz', 540, 590, L.seg(lt, .9, 1.5), { f: L.F.s, it: 1, s: 96, c: L.B.mostaza, al: 'center' });
      L.rise('de reinventarse?', 540, 690, L.seg(lt, 1.1, 1.7), { f: L.F.s, it: 1, s: 96, c: L.B.mostaza, al: 'center' });
      L.rise('Desde la costa, todo se ve con claridad.', 540, 780, L.seg(lt, 1.8, 2.4), { f: L.F.s, it: 1, s: 44, c: a, al: 'center', a: .85 });
      L.txt('Contenido educativo · No es asesoría financiera', 540, 1790, { s: 26, c: a, al: 'center', a: .6 * L.seg(lt, 2, 2.6) });
    } },
];
const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export default { id: 'historia-JOBS', title: 'Steve Jobs: lo sacaron de su propia empresa', tail: 1.2, worlds, scenes };
