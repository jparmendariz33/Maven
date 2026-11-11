// Reproductor del anfitrión 3D (JP): dibuja SOLO a JP y sus objetos, con fondo transparente (640x640). El motor 2D lo pone encima.
// Vista previa: host.html?alpha=1&act=logo&mood=up&outfit=hoodie&d=6   ·   render: engine3d/render_host.js
import * as L0 from './lib.js';
import * as CINE from './cine.js';
import { buildHost } from './host.js';
const L = new Proxy({}, { get: (_, k) => k in CINE ? CINE[k] : L0[k] });
const params = new URLSearchParams(location.search), N = 640;
L.renderer.setSize(N, N, false); L.renderer.shadowMap.type = L.THREE.PCFSoftShadowMap;
const X = document.getElementById('c').getContext('2d'); let cur = null;
const loadImg = src => src ? new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = src; }) : null;
window.setHost = async cfg => { cfg.logoEl = await loadImg(cfg.logo); cur = buildHost(L, cfg); window.HOST = cur; return { look: cur.look, act: cur.act, mood: cur.mood }; };
window.renderHost = (lt, d, bg) => { cur.update(lt, d); cur.render(); X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, N, N); if (bg) { X.fillStyle = bg; X.fillRect(0, 0, N, N); } X.drawImage(L.renderer.domElement, 0, 0, N, N); };
window.ENGINE_READY = true;
if (!params.has('render')) { const cfg = Object.fromEntries(params), d = +(params.get('d') || 6), s0 = performance.now();
  window.setHost(cfg).then(() => (function loop() { window.renderHost(((performance.now() - s0) / 1000) % d, d); requestAnimationFrame(loop); })()); }
