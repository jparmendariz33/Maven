// Costa Diorama v2 — "luz de cine": iluminación de tres puntos, oclusión de contacto, profundidad de campo,
// plastilina con huellas y actores articulados (caminan, parpadean, hablan, usan las manos).
// Se suma a lib.js (player.js expone todo junto como L). Todo sigue siendo función del tiempo (determinista).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { renderer, W, H, B, mesh, rng, clamp, lerp, back, canvasTex } from './lib.js';

// ---------- plastilina con huellas ----------
let bumpTex = null;
function clayBump() {
  if (bumpTex) return bumpTex;
  bumpTex = canvasTex((g, w, h) => {
    const r = rng(77); g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {                       // abolladuras suaves (dedos)
      const x = r() * w, y = r() * h, s = 18 + r() * 60, v = r() > .5 ? 255 : 0, gr = g.createRadialGradient(x, y, 0, x, y, s);
      gr.addColorStop(0, `rgba(${v},${v},${v},${.05 + r() * .09})`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
      g.fillStyle = gr; g.fillRect(x - s, y - s, s * 2, s * 2);
    }
    g.lineWidth = 1.3;
    for (let i = 0; i < 26; i++) {                        // huellas dactilares: arcos concéntricos
      const x = r() * w, y = r() * h, a0 = r() * 6.28, n = 7 + (r() * 6 | 0); g.strokeStyle = `rgba(40,40,40,${.10 + r() * .10})`;
      for (let k = 1; k <= n; k++) { g.beginPath(); g.ellipse(x, y, k * 4.2, k * 5.4, a0, .3, 2.6 + r() * .6); g.stroke(); }
    }
    for (let i = 0; i < 2600; i++) { const v = r() > .5 ? 255 : 0; g.fillStyle = `rgba(${v},${v},${v},.05)`; g.fillRect(r() * w, r() * h, 2, 2); }  // grano fino
  }, 512, 512);
  bumpTex.wrapS = bumpTex.wrapT = THREE.RepeatWrapping; bumpTex.colorSpace = THREE.NoColorSpace; return bumpTex;
}
const m2 = {};
export function clay2(c, r = .82, bump = 1) {
  const k = c + '|' + r + '|' + bump;
  return m2[k] || (m2[k] = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0, bumpMap: clayBump(), bumpScale: 2.2 * bump }));
}
export const emit = (c, i = 1) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: .6 });
// caja con bordes redondeados (todo en plastilina tiene cantos suaves)
export function rbox(w, h, d, r = .08, mat) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const bz = Math.min(r * .6, d / 2 - .001), g = new THREE.ExtrudeGeometry(s, { depth: Math.max(.001, d - bz * 2), bevelEnabled: true, bevelThickness: bz, bevelSize: bz, bevelSegments: 4, curveSegments: 8 });
  g.translate(0, 0, -(d - bz * 2) / 2); return mesh(g, mat);
}
// stop-motion: cuantiza el tiempo a 12 cuadros por segundo (animación "en doses")
export const on2 = (t, fps = 12) => Math.floor(t * fps + 1e-6) / fps;

// ---------- mundo con luz de cine ----------
let composer = null, rp, gtao, bokeh;
function post() {
  if (composer) return;
  const sz = renderer.getSize(new THREE.Vector2()), RW = sz.x, RH = sz.y;        // tamaño real del render (player.js aplica ?rs=)
  composer = new EffectComposer(renderer); composer.setPixelRatio(1); composer.setSize(RW, RH);
  const dummyS = new THREE.Scene(), dummyC = new THREE.PerspectiveCamera(30, W / H, .1, 600);
  rp = new RenderPass(dummyS, dummyC); composer.addPass(rp);
  gtao = new GTAOPass(dummyS, dummyC, RW, RH); gtao.updateGtaoMaterial({ radius: .55, distanceExponent: 1.4, thickness: 1.2, scale: 1.25, samples: 12 });
  gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 8 }); composer.addPass(gtao);
  bokeh = new BokehPass(dummyS, dummyC, { focus: 20, aperture: .0001, maxblur: .008 }); composer.addPass(bokeh);
  composer.addPass(new OutputPass());
}
// key = luz principal (cálida, con sombra) · rim = contraluz que recorta la silueta · fill = relleno frío y bajo
export function cineWorld({ bg = B.arena, bg2 = null, floor = null, fog = null, hemi = .55, key = 3.0, rim = 2.4, fill = .45,
  keyPos = [-9, 15, 12], rimPos = [11, 10, -15], keyCol = '#FFF1DC', rimCol = '#FFE2B8', fillCol = '#BFD4FF', sky = '#FFF8EC', ground = '#8E8466',
  ao = false, dof = true, shadow = 22 } = {}) {
  post();
  const scene = new THREE.Scene();
  scene.background = canvasTex((g, w, h) => {              // ciclorama: degradado de estudio
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, bg2 || bg); gr.addColorStop(.62, bg); gr.addColorStop(1, bg); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }, 8, 512);
  if (fog) scene.fog = new THREE.Fog(bg, fog[0], fog[1]);
  scene.add(new THREE.HemisphereLight(sky, ground, hemi));
  const sun = new THREE.DirectionalLight(keyCol, key); sun.position.set(...keyPos); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 7; sun.shadow.blurSamples = 16;
  Object.assign(sun.shadow.camera, { left: -shadow, right: shadow, top: shadow, bottom: -shadow, near: 1, far: 90 }); sun.shadow.bias = -.0006;
  const rimL = new THREE.DirectionalLight(rimCol, rim); rimL.position.set(...rimPos);
  const fillL = new THREE.DirectionalLight(fillCol, fill); fillL.position.set(12, 5, 14);
  scene.add(sun, sun.target, rimL, rimL.target, fillL);
  let floorM = null;
  if (floor !== false) { floorM = mesh(new THREE.PlaneGeometry(500, 500), clay2(floor || bg, .95, .6), false); floorM.material = floorM.material.clone();
    floorM.material.bumpMap = floorM.material.bumpMap.clone(); floorM.material.bumpMap.repeat.set(60, 60); floorM.rotation.x = -Math.PI / 2; scene.add(floorM); }
  const cam = new THREE.PerspectiveCamera(30, W / H, .1, 600);
  const w = { scene, cam, sun, rim: rimL, fill: fillL, floor: floorM, focus: 20, aperture: .00016, maxblur: .009, ao, dof,
    look(x, y, z) { cam.lookAt(x, y, z); },
    // enfoca a un objeto o punto (la distancia se mide sobre el eje de la cámara)
    focusOn(o, dy = 0) { const v = new THREE.Vector3(); o.isVector3 ? v.copy(o) : o.getWorldPosition(v); v.y += dy; cam.updateMatrixWorld();
      w.focus = Math.max(.5, -v.applyMatrix4(cam.matrixWorldInverse).z); },
    render() {
      rp.scene = gtao.scene = bokeh.scene = scene; rp.camera = gtao.camera = bokeh.camera = cam;
      gtao.enabled = w.ao; bokeh.enabled = w.dof;
      bokeh.uniforms.focus.value = w.focus; bokeh.uniforms.aperture.value = w.aperture; bokeh.uniforms.maxblur.value = w.maxblur;
      bokeh.uniforms.nearClip.value = cam.near; bokeh.uniforms.farClip.value = cam.far; bokeh.uniforms.aspect.value = cam.aspect;
      composer.render();
    } };
  return w;
}
// viñeta + calidez (se dibuja sobre el cuadro 3D, debajo de la capa editorial)
export function grade(C, k = .34, tint = null) {
  const g = C.createRadialGradient(W / 2, H * .52, H * .28, W / 2, H * .52, H * .78); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(8,6,14,${k})`);
  C.save(); C.fillStyle = g; C.fillRect(0, 0, W, H);
  if (tint) { C.globalCompositeOperation = 'soft-light'; C.fillStyle = tint; C.fillRect(0, 0, W, H); } C.restore();
}
// franja oscura suave para que el texto se lea sobre cualquier escena
export function scrim(C, y0, y1, a = .5, col = '10,10,10') {
  const g = C.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); C.save(); C.fillStyle = g; C.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0)); C.restore();
}

// fusiona muchas piezas pequeñas del mismo material en UNA malla (una llamada de dibujo en vez de cien: clave para la velocidad)
export function blobs(list, mat, cast = true) {      // list: [[x, y, z, radio], ...]
  const gs = list.map(([x, y, z, r]) => { const g = new THREE.SphereGeometry(r, 9, 7); g.translate(x, y, z); return g; });
  const m = mesh(mergeGeometries(gs), mat, cast); gs.forEach(g => g.dispose()); return m;
}
export function merged(meshes, mat, cast = true) {   // fusiona mallas ya colocadas (usa su posición/rotación/escala locales)
  const gs = meshes.map(o => { o.updateMatrix(); const g = o.geometry.clone(); g.applyMatrix4(o.matrix); return g; });
  return mesh(mergeGeometries(gs), mat, cast);
}

// ---------- actor articulado ----------
// o: skin, shirt, pants, shoes, hair, hairStyle ('mop' | 'short' | 'side' | 'bald'), glasses, beard (color), collar ('turtle' | 'suit' | 'tee'), tie (color), bow (color), size
export function actor(o = {}) {
  const r = rng(o.seed || 11), g = new THREE.Group(), u = {};
  const skin = clay2(o.skin || '#F2D6BF', .72, .7), shirt = clay2(o.shirt || B.negro, .9), pants = clay2(o.pants || '#3F5E8C', .9), shoe = clay2(o.shoes || '#F2F0E8', .6, .5), hairM = clay2(o.hair || '#3B2A1E', .95);
  const root = new THREE.Group(); g.add(root); u.root = root;
  const sh0 = new THREE.Mesh(new THREE.CircleGeometry(.75, 32), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: canvasTex((c, w, h) => {
    const gr = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,.42)'); gr.addColorStop(.6, 'rgba(0,0,0,.16)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); }, 128, 128) }));
  sh0.rotation.x = -Math.PI / 2; sh0.position.y = .012; g.add(sh0); u.blob = sh0;
  u.legs = {};
  [-1, 1].forEach(s => { const hip = new THREE.Group(); hip.position.set(s * .2, .52, 0); root.add(hip);
    const leg = mesh(new THREE.CapsuleGeometry(.145, .24, 6, 14), pants); leg.position.y = -.2; hip.add(leg);
    const sh = mesh(new THREE.SphereGeometry(.17, 18, 14), shoe); sh.scale.set(1, .62, 1.55); sh.position.set(0, -.42, .09); hip.add(sh); u.legs[s] = hip; });
  const torso = new THREE.Group(); torso.position.y = .5; root.add(torso); u.torso = torso;
  const body = mesh(new THREE.CapsuleGeometry(.42, .45, 8, 26), shirt); body.position.y = .5; torso.add(body);
  if (o.collar === 'turtle') { const c = mesh(new THREE.CylinderGeometry(.27, .31, .2, 24), shirt); c.position.y = 1.1; torso.add(c); }
  if (o.collar === 'suit') {                                  // camisa blanca + corbata o moño
    const v = mesh(new THREE.ConeGeometry(.17, .42, 3), clay2('#F4F1E8', .8), false); v.rotation.set(Math.PI, Math.PI / 6 + Math.PI, 0); v.scale.z = .35; v.position.set(0, .82, .385); torso.add(v);
    if (o.tie) { const t = mesh(new THREE.ConeGeometry(.055, .34, 4), clay2(o.tie, .7), false); t.rotation.x = Math.PI; t.scale.z = .5; t.position.set(0, .8, .44); torso.add(t); }
    if (o.bow) [-1, 1].forEach(s => { const b = mesh(new THREE.ConeGeometry(.075, .15, 12), clay2(o.bow, .7), false); b.rotation.z = s * Math.PI / 2; b.position.set(s * .07, .99, .43); torso.add(b); });
  }
  u.arms = {};
  [-1, 1].forEach(s => { const sh = new THREE.Group(); sh.position.set(s * .47, .9, 0); torso.add(sh);
    const up = mesh(new THREE.CapsuleGeometry(.115, .2, 6, 12), shirt); up.position.y = -.19; sh.add(up);
    const el = new THREE.Group(); el.position.y = -.38; sh.add(el);
    const fo = mesh(new THREE.CapsuleGeometry(.105, .18, 6, 12), shirt); fo.position.y = -.16; el.add(fo);
    const hand = mesh(new THREE.SphereGeometry(.135, 16, 12), skin); hand.position.y = -.37; el.add(hand);
    u.arms[s] = { sh, el, hand }; });
  const head = new THREE.Group(); head.position.y = 1.62; torso.add(head); u.head = head;
  head.add(mesh(new THREE.SphereGeometry(.62, 48, 36), skin));
  [-1, 1].forEach(s => { const ear = mesh(new THREE.SphereGeometry(.1, 12, 10), skin, false); ear.scale.z = .5; ear.position.set(s * .61, -.02, 0); head.add(ear); });
  const st = o.hairStyle || 'mop';
  if (st === 'mop' || st === 'side') {
    const cap = mesh(new THREE.SphereGeometry(.65, 48, 24, 0, Math.PI * 2, 0, st === 'mop' ? 1.12 : .98), hairM); cap.rotation.x = -.32; head.add(cap);
    const hb = [], ax = new THREE.Vector3(1, 0, 0), v = new THREE.Vector3();
    for (let i = 0; i < (st === 'mop' ? 120 : 60); i++) { const rad = .085 + r() * .05; v.setFromSphericalCoords(.655, r() * (st === 'mop' ? 1.18 : .95), r() * Math.PI * 2).applyAxisAngle(ax, -.32); hb.push([v.x, v.y, v.z, rad]); }
    if (st === 'mop') [-1, 1].forEach(s => { for (let i = 0; i < 9; i++) hb.push([s * (.6 + r() * .04), .12 - i * .05, -.1 + r() * .16, .09 + r() * .03]); });
    head.add(blobs(hb, hairM, false));
  } else if (st === 'short') {                                // corto y con entradas
    const cap = mesh(new THREE.SphereGeometry(.634, 48, 24, 0, Math.PI * 2, 0, 1.12), hairM); cap.rotation.x = -.36; head.add(cap);
    const top = mesh(new THREE.SphereGeometry(.628, 40, 16, 0, Math.PI * 2, 0, .62), hairM, false); top.rotation.x = -.08; head.add(top);   // pelo ralo arriba (que no se vea calvo de frente)
    [-1, 1].forEach(s => { const sb = mesh(new THREE.SphereGeometry(.2, 14, 10), hairM, false); sb.scale.set(.35, 1, .8); sb.position.set(s * .585, .1, -.05); head.add(sb); });
  }
  if (o.beard) { const bd = mesh(new THREE.SphereGeometry(.631, 40, 20, 0, Math.PI * 2, 1.95, 1.2), clay2(o.beard, .98), false); bd.rotation.x = .42; head.add(bd); }
  const mz = o.beard ? .03 : 0; u.lids = []; u.brows = [];
  [-1, 1].forEach(s => {
    const e = mesh(new THREE.SphereGeometry(.075, 16, 12), clay2('#121212', .3, 0), false); e.scale.set(1, 1.2, .45); e.position.set(s * .2, .03, .595); head.add(e);
    const hl = mesh(new THREE.SphereGeometry(.02, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffffff' }), false); hl.position.set(s * .2 + .022, .062, .628); head.add(hl);
    const lid = mesh(new THREE.SphereGeometry(.098, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), skin, false); lid.scale.set(1.1, 1, .55); lid.position.set(s * .2, .03, .595); head.add(lid); u.lids.push(lid);
    const br = mesh(new THREE.CapsuleGeometry(.026, .14, 4, 8), hairM, false); br.position.set(s * .2, .2, .588); head.add(br); u.brows.push([br, s]);
  });
  if (o.glasses) { const gm = clay2(o.glasses === true ? '#2B2B2B' : o.glasses, .35, 0);
    [-1, 1].forEach(s => { const ring = mesh(new THREE.TorusGeometry(.125, .013, 8, 32), gm, false); ring.position.set(s * .2, .03, .655); head.add(ring);
      const tm = mesh(new THREE.CylinderGeometry(.01, .01, .62, 6), gm, false); tm.rotation.x = Math.PI / 2; tm.position.set(s * .345, .04, .35); tm.rotation.y = 0; tm.rotation.z = 0; tm.rotation.set(Math.PI / 2, 0, s * -.42); head.add(tm); });
    const bridge = mesh(new THREE.CylinderGeometry(.011, .011, .16, 6), gm, false); bridge.rotation.z = Math.PI / 2; bridge.position.set(0, .05, .665); head.add(bridge); }
  const nose = mesh(new THREE.SphereGeometry(.062, 12, 10), skin, false); nose.position.set(0, -.07, .625); head.add(nose);
  u.smile = mesh(new THREE.TorusGeometry(.12, .022, 8, 24, 1.6), clay2('#4a2626', .5, 0), false); u.smile.scale.z = .5; head.add(u.smile);
  u.open = mesh(new THREE.SphereGeometry(.1, 16, 12), clay2('#3a1c1c', .5, 0), false); head.add(u.open);
  u.sweat = new THREE.Group(); const sd = mesh(new THREE.SphereGeometry(.07, 12, 10), clay2(B.azulClaro, .3, 0), false), sc = mesh(new THREE.ConeGeometry(.068, .12, 12), clay2(B.azulClaro, .3, 0), false);
  sc.position.y = .09; u.sweat.add(sd, sc); u.sweat.position.set(-.5, .32, .38); head.add(u.sweat);
  u.mz = mz; g.userData = u; if (o.size) g.scale.setScalar(o.size); pose(g, {}); return g;
}
// pose: walk (fase en rad, null = quieto) · amp · armL/armR [levantar al frente, abrir al lado, doblar codo] en rad · head [rx, ry, rz]
// lid 0 abiertos..1 cerrados · brow -1 triste..1 decidido · smile -1..1 · talk 0..1 (boca abierta) · lean · bob · sweat
export function pose(g, p = {}) {
  const u = g.userData, q = { walk: null, amp: .55, lid: .12, brow: 0, smile: .5, talk: 0, sweat: false, head: [0, 0, 0], armL: [0, .14, .1], armR: [0, .14, .1], lean: 0, bob: 0, ...p };
  const ph = q.walk, sw = ph == null ? 0 : Math.sin(ph) * q.amp;
  u.legs[-1].rotation.x = sw; u.legs[1].rotation.x = -sw;
  u.root.position.y = (ph == null ? 0 : Math.abs(Math.cos(ph)) * .055) + q.bob; u.torso.rotation.x = q.lean; u.torso.rotation.z = ph == null ? 0 : Math.sin(ph) * .035;
  [[-1, q.armL], [1, q.armR]].forEach(([s, a]) => { const A = u.arms[s]; A.sh.rotation.set(-a[0] + (ph == null || a[3] ? 0 : s * sw * .8), 0, s * a[1]); A.el.rotation.x = -a[2]; });
  u.head.rotation.set(q.head[0], q.head[1], q.head[2] || 0);
  u.lids.forEach(l => l.rotation.x = lerp(-.25, 1.0, q.lid));
  u.brows.forEach(([b, s]) => { b.rotation.z = Math.PI / 2 + s * (-.12 + q.brow * -.38); b.position.y = .2 + (q.brow < 0 ? -q.brow * .05 : 0); });
  const m = u.smile, z = u.mz;
  if (q.smile >= 0) { m.rotation.z = -Math.PI / 2 - .8; m.position.set(0, -.2, .565 + z); m.scale.set(1, lerp(.25, 1, q.smile), .5); }
  else { m.rotation.z = Math.PI / 2 - .8; m.position.set(0, -.31, .55 + z); m.scale.set(.8, -q.smile * .8, .5); }
  m.visible = q.talk < .12; u.open.visible = !m.visible;
  u.open.position.set(0, -.24, .56 + z); u.open.scale.set(1.05, .25 + q.talk * .75, .35);
  u.sweat.visible = q.sweat;
}
// boca que se mueve con los subtítulos: 0..1 según la palabra que se está diciendo (CAPS de player.js)
export function talkAt(CAPS, t) {
  for (const c of CAPS) for (const w of c) if (t >= w[0] && t <= w[1]) { const k = (t - w[0]) / Math.max(.05, w[1] - w[0]), syl = Math.max(1, Math.round(w[2].length / 3)); return .25 + .75 * Math.abs(Math.sin(k * Math.PI * syl)); }
  return 0;
}
// parpadeo determinista: devuelve lid extra 0..1
export function blink(t, seed = 0) { const p = (t + seed * 1.37) % 3.1; return p < .12 ? 1 : 0; }
// utilería común
export function tree(x, z, s = 1, col = B.musgo) {
  const g = new THREE.Group(), tr = mesh(new THREE.CylinderGeometry(.1 * s, .15 * s, 1.5 * s, 10), clay2(B.terracota)); tr.position.y = .75 * s; g.add(tr);
  [[0, 2.0, 0, 1], [-.5, 1.6, .2, .7], [.5, 1.7, -.2, .75], [0, 2.7, 0, .6]].forEach(([a, b, c, k]) => { const f = mesh(new THREE.SphereGeometry(.8 * s * k, 20, 16), clay2(col, .95)); f.position.set(a * s, b * s, c * s); g.add(f); });
  g.position.set(x, 0, z); return g;
}
export function label3d(text, w, h, { bg = '#F4F1E8', ink = B.negro, font = '800 64px Unbounded', pw = 1024, ls = 0 } = {}) {
  const ph = Math.round(pw * h / w), m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ roughness: .85, transparent: bg === null, map: canvasTex((g, W2, H2) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, W2, H2); } g.fillStyle = ink; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; if (ls) g.letterSpacing = ls + 'px';
    String(text).split('\n').forEach((ln, i, a) => g.fillText(ln, W2 / 2, H2 / 2 + (i - (a.length - 1) / 2) * parseInt(font.match(/(\d+)px/)[1]) * 1.15)); }, pw, ph) }));
  m.receiveShadow = true; return m;
}
export { THREE, clamp, lerp, back };
