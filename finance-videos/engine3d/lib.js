// Costa Diorama — librería compartida para historias 3D (Three.js + capa editorial Costa Studio).
// Todo es función del tiempo t (determinista): renderAt(t) siempre dibuja el mismo cuadro.
import * as THREE from 'three';
export { THREE };

export const W = 1080, H = 1920;
export const B = { arena: '#EBE6BA', arenaOsc: '#DCCF8E', azul: '#4173D1', azulClaro: '#C3D8EC', azulNoche: '#2F5CB4',
  terracota: '#BB6F58', terracotaClaro: '#E8CDB0', musgo: '#7E8C54', mostaza: '#C7A317', negro: '#0A0A0A', blanco: '#FFFFFF', gris: '#F5F5F5' };
export const F = { d: 'Unbounded', b: '"Space Grotesk"', s: '"Instrument Serif"' };

// ---------- tiempo / easing ----------
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ex = k => 1 - Math.pow(1 - k, 3);                    // salida suave
export const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
export const back = k => { const c = 1.9; return k <= 0 ? 0 : k >= 1 ? 1 : 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); }; // con rebote
export const pop = (t, t0, d = .45) => back(seg(t, t0, t0 + d));    // aparece con "squash & stretch"
export function rng(seed) { let s = seed % 2147483647 || 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// ---------- renderer ----------
export const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;   // cine.js usa sombras más baratas si la historia lo pide
renderer.toneMapping = THREE.NeutralToneMapping; renderer.outputColorSpace = THREE.SRGBColorSpace;

// ---------- materiales / mallas ----------
const matCache = {};
export const clay = (c, r = .88) => matCache[c + r] || (matCache[c + r] = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0 }));
export const glow = c => new THREE.MeshBasicMaterial({ color: c });
export function mesh(g, m, cast = true) { const o = new THREE.Mesh(g, m); o.castShadow = cast; o.receiveShadow = true; return o; }
export function canvasTex(draw, w = 512, h = 256) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
export function plaque(w, h, draw, pw = 512) {
  const ph = Math.round(pw * h / w);
  return mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ roughness: .9, map: canvasTex(draw, pw, ph) }), false);
}

// mundo: escena + luces + papel
export function world({ bg = B.arena, dark = false, paper = true, fog = null } = {}) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(bg);
  if (fog) scene.fog = new THREE.Fog(bg, fog[0], fog[1]);
  scene.add(new THREE.HemisphereLight(dark ? '#c9d8ff' : '#fffaf0', dark ? '#1c2a55' : '#b9a978', dark ? 1.15 : 1.6));
  const sun = new THREE.DirectionalLight(dark ? '#ffe9c4' : '#fff4e0', dark ? 2.2 : 2.4);
  sun.position.set(-14, 26, 18); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 10; sun.shadow.blurSamples = 16;
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 90 }); sun.shadow.bias = -.0005;
  scene.add(sun, sun.target);
  if (paper) { const p = mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShadowMaterial({ opacity: .18 }), false); p.rotation.x = -Math.PI / 2; scene.add(p); }
  const cam = new THREE.PerspectiveCamera(30, W / H, .1, 600);
  return { scene, cam, sun };
}

// ---------- personaje de plastilina ----------
export function guy(o = {}) {
  const r = rng(o.seed || 11), g = new THREE.Group(), skin = clay('#F6F1E4', .7);
  const body = mesh(new THREE.CapsuleGeometry(.42, .55, 8, 20), clay(o.shirt || B.negro)); body.position.y = .62; g.add(body);
  if (o.mark) { const l = mesh(new THREE.CircleGeometry(.12, 24), clay(o.mark, .6), false); l.position.set(.16, .95, .41); l.rotation.y = .3; g.add(l); }
  [-1, 1].forEach(s => { const lg = mesh(new THREE.CapsuleGeometry(.13, .3, 4, 10), clay('#2a2a2a')); lg.position.set(s * .18, .05, 0); g.add(lg); });
  const head = new THREE.Group(); head.position.y = 1.62; g.add(head);
  head.add(mesh(new THREE.SphereGeometry(.62, 48, 36), skin));
  const hairM = clay(o.hair || '#3B2A1E', .95);
  const cap = mesh(new THREE.SphereGeometry(.648, 48, 24, 0, Math.PI * 2, 0, 1.0), hairM); cap.rotation.x = -.3; head.add(cap);
  for (let i = 0; i < 90; i++) {
    const b = mesh(new THREE.SphereGeometry(.085 + r() * .04, 10, 8), hairM, false);
    b.position.setFromSphericalCoords(.655, r() * .98, r() * Math.PI * 2); b.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), -.3); head.add(b);
  }
  const lids = [], brows = [];
  [-1, 1].forEach(s => {
    const e = mesh(new THREE.SphereGeometry(.075, 16, 12), clay('#121212', .35), false); e.scale.set(1, 1.2, .45); e.position.set(s * .2, .03, .595); head.add(e);
    const hl = mesh(new THREE.SphereGeometry(.018, 8, 6), clay('#ffffff', .3), false); hl.position.set(s * .2 + .02, .06, .625); head.add(hl);
    const lid = mesh(new THREE.SphereGeometry(.098, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), skin, false);
    lid.scale.set(1.1, 1, .55); lid.position.set(s * .2, .03, .595); head.add(lid); lids.push(lid);
    const br = mesh(new THREE.CapsuleGeometry(.025, .14, 4, 8), hairM, false); br.position.set(s * .2, .2, .585); head.add(br); brows.push([br, s]);
  });
  const mouth = mesh(new THREE.TorusGeometry(.12, .022, 8, 24, 1.6), clay('#4a2626', .5), false); mouth.scale.z = .5; head.add(mouth);
  const nose = mesh(new THREE.SphereGeometry(.06, 12, 10), skin, false); nose.position.set(0, -.07, .62); head.add(nose);
  const sweat = new THREE.Group(); const sd = mesh(new THREE.SphereGeometry(.07, 12, 10), clay(B.azulClaro, .3), false); const sc = mesh(new THREE.ConeGeometry(.068, .12, 12), clay(B.azulClaro, .3), false);
  sc.position.y = .09; sweat.add(sd, sc); sweat.position.set(-.5, .32, .38); sweat.visible = false; head.add(sweat);
  const arms = {};
  [-1, 1].forEach(s => { const pivot = new THREE.Group(); pivot.position.set(s * .44, .98, 0); g.add(pivot);
    const a = mesh(new THREE.CapsuleGeometry(.11, .5, 4, 10), clay(o.shirt || B.negro)); a.position.y = -.33; pivot.add(a); pivot.rotation.z = s * .25; arms[s] = pivot; });
  g.userData = { head, lids, brows, mouth, sweat, arms };
  face(g, {}); return g;
}
// expresión: lid 0 (abiertos) .. 1 (cerrados, "confiado"); brow -1 preocupado .. 1 arrogante; smile 1 sonrisa .. -1 tristeza
export function face(g, { lid = .55, brow = 0, smile = 1, sweat = false } = {}) {
  const u = g.userData;
  u.lids.forEach(l => l.rotation.x = lerp(.05, 1.0, lid));
  u.brows.forEach(([b, s]) => { b.rotation.z = Math.PI / 2 + s * (-.2 + brow * -.35); b.position.y = .2 + (brow < 0 ? -brow * .05 : brow * .03 * (s > 0 ? 1 : 0)); });
  const m = u.mouth;
  if (smile >= 0) { m.rotation.z = -Math.PI / 2 - .8 + .35 * smile; m.position.set(.06 * smile, -.2, .565); m.scale.set(1, lerp(.4, 1, smile), .5); }
  else { m.rotation.z = Math.PI / 2 - .8; m.position.set(0, -.3, .55); m.scale.set(.8, -smile * .8, .5); }
  u.sweat.visible = sweat;
}

// ---------- utilería ----------
export function rocket(h = 5.2, label = null) {
  const r = new THREE.Group(), steel = clay('#E9E6DF', .45), dark = clay(B.negro, .6);
  r.add(mesh(new THREE.CylinderGeometry(.55, .55, h, 32), steel));
  if (label) { // nombre pintado a lo largo del cuerpo (tipografía de marca, no logotipo)
    const L = new THREE.Mesh(new THREE.CylinderGeometry(.556, .556, h * .5, 32, 1, true, -Math.PI * .22, Math.PI * .44),
      new THREE.MeshStandardMaterial({ roughness: .5, transparent: true, map: canvasTex((g, W, Hh) => { g.translate(W / 2, Hh / 2); g.rotate(-Math.PI / 2);
        g.fillStyle = B.negro; g.font = `800 ${W * .5}px Unbounded`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, 0, 4); }, 256, 1024) }));
    L.position.y = h * .02; r.add(L); }
  const nc = mesh(new THREE.SphereGeometry(.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), steel); nc.scale.y = 2.2; nc.position.y = h / 2; r.add(nc);
  [h * .3, -h * .2].forEach(y => { const b = mesh(new THREE.CylinderGeometry(.56, .56, .12, 32), dark); b.position.y = y; r.add(b); });
  [-1, 1].forEach(i => { const f = mesh(new THREE.BoxGeometry(.08, 1.2, .7), dark); f.position.set(i * .6, -h / 2 + .6, 0); r.add(f); });
  const fl = new THREE.Group(); fl.position.y = -h / 2;
  const f1 = new THREE.Mesh(new THREE.ConeGeometry(.5, 2.4, 24), glow('#F2C14E')); f1.rotation.x = Math.PI; f1.position.y = -1.2;
  const f2 = new THREE.Mesh(new THREE.ConeGeometry(.28, 1.4, 24), glow('#FFF6D8')); f2.rotation.x = Math.PI; f2.position.y = -.75; fl.add(f1, f2); r.add(fl);
  r.userData.flame = fl; return r;
}
// nubes de humo que crecen: update(k) con k 0..1
export function puffs(n, spread, size, seed = 3, col = '#FBF8EE') {
  const r = rng(seed), g = new THREE.Group(), list = [];
  for (let i = 0; i < n; i++) { const a = r() * 6.28, d = r() * spread;
    const p = mesh(new THREE.SphereGeometry(size * (.5 + r() * .7), 18, 14), clay(col, .95)); p.position.set(Math.cos(a) * d, r() * size * .8, Math.sin(a) * d);
    p.userData.delay = d / spread * .5 + r() * .2; g.add(p); list.push(p); }
  g.userData.update = k => list.forEach(p => { const s = back(clamp((k - p.userData.delay) / .5)); p.scale.setScalar(Math.max(.001, s)); });
  return g;
}
// explosión de plastilina: update(k) 0..1 (crece, luego se encoge)
export function burst(seed = 5, size = 1) {
  const r = rng(seed), g = new THREE.Group(), cols = [B.terracota, B.mostaza, '#8A8A8A', '#FBF8EE'], list = [];
  for (let i = 0; i < 22; i++) { const p = mesh(new THREE.SphereGeometry(size * (.35 + r() * .45), 14, 10), clay(cols[i % 4], .9), false);
    const v = new THREE.Vector3(r() - .5, r() - .3, r() - .5).normalize().multiplyScalar(size * (1.2 + r() * 1.8)); p.userData.v = v; g.add(p); list.push(p); }
  g.userData.update = k => list.forEach(p => { const e = ex(clamp(k * 1.6)); p.position.copy(p.userData.v).multiplyScalar(e);
    const s = k <= 0 ? .001 : k < .35 ? back(k / .35) : Math.max(.001, 1 - (k - .35) / .65); p.scale.setScalar(s); p.visible = k > 0 && k < 1; });
  return g;
}
// satélite / centro de datos con corte: update(open 0..1)
export function satellite({ dc = false, seed = 2 } = {}) {
  const s = new THREE.Group(), halves = [];
  [-1, 1].forEach(k => { const h = new THREE.Group(); const b = mesh(new THREE.BoxGeometry(.4, .8, .8), clay(B.gris, .6)); b.position.x = k * .2; h.add(b); s.add(h); halves.push([h, k]); });
  [-1, 1].forEach(k => { const pn = mesh(new THREE.BoxGeometry(1.3, .05, .7), clay('#1A2C66', .4)); pn.position.x = k * 1.15; halves[(k + 1) / 2][0].add(pn);
    for (let j = -1; j <= 1; j++) { const ln = mesh(new THREE.BoxGeometry(.02, .06, .7), clay(B.azulClaro, .5), false); ln.position.x = k * 1.15 + j * .4; halves[(k + 1) / 2][0].add(ln); } });
  [.18, 0, -.18].forEach((y, i) => { const led = mesh(new THREE.BoxGeometry(.55, .06, .02), glow(i % 2 ? '#F2C14E' : '#9FE8B4'), false); led.position.set(0, y, .41); s.add(led); s.userData.leds = (s.userData.leds || []).concat(led); });
  let inner = null;
  if (dc) { // racks de servidores que aparecen al abrir
    inner = new THREE.Group(); const r = rng(seed);
    for (let i = 0; i < 3; i++) { const rack = mesh(new THREE.BoxGeometry(.18, .66, .62), clay('#22252d', .6)); rack.position.x = (i - 1) * .22; inner.add(rack);
      for (let j = 0; j < 6; j++) { const l = mesh(new THREE.BoxGeometry(.02, .025, .025), glow(r() > .5 ? '#9FE8B4' : '#F2C14E'), false); l.position.set((i - 1) * .22 + .1, -.25 + j * .1, .2 - r() * .3); inner.add(l); } }
    inner.scale.setScalar(.001); s.add(inner);
  }
  s.userData.update = (open, t = 0) => {
    halves.forEach(([h, k]) => h.position.x = k * open * 1.1);
    if (inner) inner.scale.setScalar(Math.max(.001, back(clamp(open * 1.3))));
    s.userData.leds.forEach((l, i) => l.visible = open < .1 && Math.sin(t * 6 + i * 2) > -.6);
  };
  return s;
}
// globo terráqueo de plastilina
export function globe(R = 4, seed = 9) {
  const g = new THREE.Group(), r = rng(seed);
  g.add(mesh(new THREE.SphereGeometry(R, 72, 48), clay(B.azulNoche, .8)));
  const dots = [];
  for (let i = 0; i < 18; i++) { const c = mesh(new THREE.SphereGeometry(R * (.12 + r() * .16), 24, 18), clay(r() > .5 ? B.musgo : B.arenaOsc, .95), false); c.scale.z = .22;
    const v = new THREE.Vector3().setFromSphericalCoords(R * .985, .35 + r() * 2.4, r() * 6.28); c.position.copy(v); c.lookAt(0, 0, 0); g.add(c);
    for (let j = 0; j < 9; j++) { const d = mesh(new THREE.SphereGeometry(R * .025, 10, 8), glow('#F2C14E'), false);
      const u = v.clone().normalize().add(new THREE.Vector3(r() - .5, r() - .5, r() - .5).multiplyScalar(.22)).normalize().multiplyScalar(R * 1.01); d.position.copy(u); d.userData.at = r(); d.visible = false; g.add(d); dots.push(d); } }
  g.userData.lightUp = k => dots.forEach(d => d.visible = d.userData.at < k);
  return g;
}
export function palm(x, z, y = 0) {
  const g = new THREE.Group(); const tr = mesh(new THREE.CylinderGeometry(.08, .14, 2.4, 10), clay(B.terracota)); tr.position.y = 1.2; tr.rotation.z = .12; g.add(tr);
  for (let k = 0; k < 6; k++) { const l = mesh(new THREE.CapsuleGeometry(.12, 1.1, 4, 8), clay(B.musgo)); l.position.set(.15 + Math.cos(k) * .55, 2.4, Math.sin(k) * .55); l.rotation.set(Math.sin(k) * 1.1, 0, Math.cos(k) * 1.1); g.add(l); }
  g.position.set(x, y, z); return g;
}
export function stars(n = 160, seed = 4) {
  const r = rng(seed), m = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 4), glow(B.arena), n), d = new THREE.Object3D();
  for (let i = 0; i < n; i++) { d.position.set((r() - .5) * 70, -2 + r() * 40, -22 - r() * 12); d.updateMatrix(); m.setMatrixAt(i, d.matrix); } return m;
}

// ---------- capa editorial 2D (idéntica a los shorts) ----------
export let C = null; export const setCtx = c => C = c;
export function txt(s, x, y, o = {}) {
  C.save(); C.font = `${o.it ? 'italic ' : ''}${o.w || 500} ${o.s || 40}px ${o.f || F.b}`; C.fillStyle = o.c || B.negro; C.textAlign = o.al || 'left';
  C.textBaseline = 'alphabetic'; if (o.ls) C.letterSpacing = o.ls + 'px'; if (o.a != null) C.globalAlpha *= o.a; C.fillText(s, x, y); C.restore();
}
export function tw(s, o) { C.save(); C.font = `${o.it ? 'italic ' : ''}${o.w || 500} ${o.s}px ${o.f || F.b}`; const w = C.measureText(s).width; C.restore(); return w; }
export function rise(s, x, y, k, o = {}) {           // texto que sube desde una máscara
  if (k <= 0) return; const size = o.s || 40;
  C.save(); C.beginPath(); C.rect(0, y - size * 1.15, W, size * 1.45); C.clip(); txt(s, x, y + (1 - ex(k)) * size * 1.2, o); C.restore();
}
export function kicker(s, y, k, ink) {
  if (k <= 0) return; C.save(); C.globalAlpha *= k; C.fillStyle = ink; C.fillRect(90, y - 11, 46 * ex(k), 3);
  txt(s.toUpperCase(), 154, y, { s: 28, ls: 4, c: ink }); C.restore();
}
let logo = null; const tinted = {};
export async function loadLogo(src) { logo = new Image(); logo.src = src; await logo.decode(); }
export function chrome(ink) {
  if (logo) { if (!tinted[ink]) { const c = document.createElement('canvas'); c.width = logo.width; c.height = logo.height; const g = c.getContext('2d');
    g.drawImage(logo, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = ink; g.fillRect(0, 0, c.width, c.height); tinted[ink] = c; }
    C.save(); C.globalAlpha = .9; C.drawImage(tinted[ink], 60, 150, 102, 90); C.restore(); }
  txt('@jparmendariz', 180, 205, { s: 28, c: ink, a: .8 });
}
// ficha del año (línea del tiempo viva), arriba a la derecha
export function yearChip(year, prev, k, ink) {
  const x = 1000, y = 205; C.save(); C.beginPath(); C.rect(700, y - 44, 330, 60); C.clip();
  if (prev && k < 1) txt(prev, x, y - ex(k) * 50, { f: F.d, w: 600, s: 34, c: ink, al: 'right', a: 1 - k });
  txt(year, x, y + (1 - ex(k)) * 50, { f: F.d, w: 600, s: 34, c: ink, al: 'right' });
  C.restore();
  const wv = tw(year, { f: F.d, w: 600, s: 34 }); C.fillStyle = B.mostaza; C.beginPath(); C.arc(x - wv - 22, y - 12, 8, 0, 7); C.fill();
}
export function fmt(n, dec = 0) { return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
// palabra gigante en momentos clave
export function bigWord(s, t, t0, col = B.negro, d = 1.1) {
  const k = seg(t, t0, t0 + d); if (k <= 0 || k >= 1) return;
  const sc = k < .25 ? lerp(1.35, 1, ex(k / .25)) : 1, a = k < .12 ? k / .12 : k > .8 ? (1 - k) / .2 : 1;
  C.save(); C.globalAlpha = a; C.translate(W / 2, 1060); C.scale(sc, sc);
  C.font = `800 170px ${F.d}`; C.textAlign = 'center'; C.lineJoin = 'round'; C.lineWidth = 22; C.strokeStyle = B.arena; C.strokeText(s, 0, 0);
  C.fillStyle = col; C.fillText(s, 0, 0); C.restore();
}
// subtítulos: píldora oscura, palabra activa en mostaza (mismo estilo que el motor 2D)
export function captions(CAPS, t) {
  let ci = -1; for (let i = 0; i < CAPS.length; i++) if (t >= CAPS[i][0][0] - .08) ci = i;
  if (ci < 0) return; const c = CAPS[ci], nextT = CAPS[ci + 1] ? CAPS[ci + 1][0][0] - .08 : Infinity, endT = Math.min(nextT, c[c.length - 1][1] + 1.0);
  if (t > endT) return; const a = seg(t, c[0][0] - .08, c[0][0] + .05) * (1 - seg(t, endT - .1, endT));
  const S = 52, gap = 20, ws = c.map(w => tw(w[2], { w: 700, s: S })), total = ws.reduce((p, q) => p + q, 0) + gap * (c.length - 1);
  let x = W / 2 - total / 2; const y = 1650;
  C.save(); C.globalAlpha *= a; C.beginPath(); C.roundRect(W / 2 - total / 2 - 32, y - 60, total + 64, 86, 43); C.fillStyle = 'rgba(10,10,10,.86)'; C.fill();
  c.forEach((w, i) => { const on = t >= w[0] - .05, cur = on && (t < w[1] + .05 || (i === c.length - 1 && t < w[1] + .4));
    txt(w[2], x, y, { w: 700, s: S, c: cur ? B.mostaza : on ? B.arena : 'rgba(235,230,186,.4)' }); x += ws[i] + gap; });
  C.restore();
}
// reparte palabras en el tiempo (animatic, antes de tener la voz): pausa tras cada punto/?/:/… y al final de la escena
export const PACE = { lead: .35, sentence: .7, tail: 1.0 };
export const sentenceEnd = w => /[.:?!…]$/.test(w);
export function autoCaptions(scenes) {
  const groups = [];
  scenes.forEach(s => {
    if (!s.cap) return; const words = s.cap.split(/\s+/).filter(Boolean);
    const nPause = words.slice(0, -1).filter(sentenceEnd).length, a = s.t0 + PACE.lead, speak = (s.t1 - PACE.tail) - a - nPause * PACE.sentence;
    const wts = words.map(w => w.length + 2), tot = wts.reduce((p, q) => p + q, 0); let t = a, cur = [];
    words.forEach((w, i) => { const d = speak * wts[i] / tot; cur.push([t, t + d * .9, w]); t += d;
      const end = sentenceEnd(w); if (end && i < words.length - 1) t += PACE.sentence;
      if (cur.length >= 4 || /[,]$/.test(w) || end || i === words.length - 1) { groups.push(cur); cur = []; } });
  });
  return groups;
}
// etiqueta 2D que sigue a un punto 3D (p. ej. el nombre de un personaje)
export function tag(text, obj, cam, k, dy = 1.0) {
  if (k <= 0) return; const v = new THREE.Vector3(); obj.getWorldPosition(v); v.y += dy; v.project(cam);
  const x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H, o = { w: 700, s: 34 }, tw0 = tw(text, o) + 48;
  C.save(); C.globalAlpha *= clamp(k * 2); C.translate(x, y); C.scale(back(k), back(k));
  C.fillStyle = B.negro; C.beginPath(); C.roundRect(-tw0 / 2, -62, tw0, 58, 29); C.fill();
  C.beginPath(); C.moveTo(-12, -5); C.lineTo(12, -5); C.lineTo(0, 12); C.fill();
  txt(text, 0, -22, { ...o, c: B.arena, al: 'center' }); C.restore();
}
// grano de película fijo
let grainC = null;
export function grain() {
  if (!grainC) { grainC = document.createElement('canvas'); grainC.width = 360; grainC.height = 640; const g = grainC.getContext('2d'), im = g.createImageData(360, 640), r = rng(99);
    for (let p = 0; p < im.data.length; p += 4) { const v = r() * 255; im.data[p] = im.data[p + 1] = im.data[p + 2] = v; im.data[p + 3] = 255; } g.putImageData(im, 0, 0); }
  C.save(); C.globalAlpha = .055; C.globalCompositeOperation = 'multiply'; C.drawImage(grainC, 0, 0, W, H); C.restore();
}
// transición de marea: la escena nueva sube con borde de ola
export function tide(X, A, Bc, k, t) {
  X.drawImage(Bc, 0, -ex(k) * 90);
  const edge = H - eio(k) * (H + 160);
  X.save(); X.beginPath(); X.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) X.lineTo(x, edge + Math.sin(x / 150 + t * 6) * 38 + Math.sin(x / 61) * 10);
  X.lineTo(W, H); X.closePath(); X.clip(); X.drawImage(A, 0, (1 - eio(k)) * 120); X.restore();
  // espuma de la ola
  X.save(); X.strokeStyle = 'rgba(195,216,236,.9)'; X.lineWidth = 14; X.beginPath();
  for (let x = 0; x <= W; x += 20) { const y = edge + Math.sin(x / 150 + t * 6) * 38 + Math.sin(x / 61) * 10; x ? X.lineTo(x, y) : X.moveTo(x, y); } X.stroke(); X.restore();
}
