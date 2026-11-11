// Reproductor del anfitrión 3D (JP): dibuja SOLO el cuadro 3D de una escena "host"; el texto lo pone el motor 2D encima.
// Vista previa: host.html?act=hook&mood=up&outfit=hoodie&d=6   ·   render: engine3d/render_host.js
import * as L0 from './lib.js';
import * as CINE from './cine.js';
import { buildHost } from './host.js';
const L = new Proxy({}, { get: (_, k) => k in CINE ? CINE[k] : L0[k] });
const { W, H } = L0, params = new URLSearchParams(location.search);
const RS = Math.max(.25, Math.min(1, +(params.get('rs') || 1)));
L.renderer.setSize(Math.round(W * RS), Math.round(H * RS), false);
if (params.get('shadow') === 'pcf') L.renderer.shadowMap.type = L.THREE.PCFSoftShadowMap;
const X = document.getElementById('c').getContext('2d'); let cur = null;
const loadImg = src => src ? new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = src; }) : null;
window.setHost = async cfg => { cfg.imageEl = await loadImg(cfg.image); cfg.logoEl = await loadImg(cfg.logo); cur = buildHost(L, cfg); window.HOST = cur; return { look: cur.look, act: cur.act, mood: cur.mood }; };
window.renderHost = (lt, d) => { cur.update(lt, d); cur.w.render(); X.setTransform(1, 0, 0, 1, 0, 0); X.imageSmoothingQuality = 'high';
  X.drawImage(L.renderer.domElement, 0, 0, W, H); L.grade(X, cur.w.vig ?? .4, cur.w.tint); };
window.ENGINE_READY = true;
if (!params.has('render')) { const cfg = Object.fromEntries(params), d = +(params.get('d') || 6), s0 = performance.now(); window.setHost(cfg);
  (function loop() { window.renderHost(((performance.now() - s0) / 1000) % d, d); requestAnimationFrame(loop); })(); }
