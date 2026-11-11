// Reproductor: arma la línea de tiempo de una historia y expone window.renderAt(t) / window.DUR.
// Uso: index.html?v=<ruta a story.js>   (?render=1 para no animar en loop)
import * as L0 from './lib.js';
import * as CINE from './cine.js';
import { JP } from './host.js';   // rasgos del anfitrión del canal: L.actor({ ...L.JP })
const EXTRA = { JP };   // datos del reproductor que las historias pueden leer (p. ej. L.CAPS para mover la boca)
const L = new Proxy({}, { get: (_, k) => k in EXTRA ? EXTRA[k] : k in CINE ? CINE[k] : L0[k] });
const { W, H, B } = L0;

const params = new URLSearchParams(location.search);
const storyURL = new URL(params.get('v'), location.href).href;
const story = (await import(storyURL)).default;

await Promise.all(['800 40px Unbounded', '600 40px Unbounded', '500 40px "Space Grotesk"', '700 40px "Space Grotesk"', 'italic 400 40px "Instrument Serif"'].map(f => document.fonts.load(f)));
await L.loadLogo(new URL('../assets/brand/logo_mask_small.png', import.meta.url).href);

// tiempos: si existe build/timing.js (generado desde la voz real) manda; si no, duraciones estimadas del guion
let timing = null;
try { timing = (await import(new URL('build/timing.js', storyURL).href)).default; } catch (e) { /* animatic */ }
// rs = escala del render 3D (0.75 por defecto en video: la capa editorial se sigue dibujando a 1080x1920, nítida)
const RS = Math.max(.25, Math.min(1, +(params.get('rs') || 1)));
L.renderer.setSize(Math.round(W * RS), Math.round(H * RS), false);
if (params.get('shadow') === 'pcf') L.renderer.shadowMap.type = L.THREE.PCFSoftShadowMap;
const SC = story.scenes; let t = 0;
SC.forEach((s, i) => { s.t0 = timing ? timing.scenes[i][0] : t; s.t1 = timing ? timing.scenes[i][1] : t + s.d; t = s.t1; });
if (!timing) SC[SC.length - 1].t1 += story.tail || 0;
const DUR = SC[SC.length - 1].t1;
const CAPS = timing ? timing.caps : L.autoCaptions(SC);
EXTRA.CAPS = CAPS;

// mundos 3D (uno por clave; escenas consecutivas pueden compartir mundo = plano secuencia)
const worlds = {};
for (const s of SC) if (!worlds[s.world]) worlds[s.world] = story.worlds[s.world](L);

const out = document.getElementById('c'), X = out.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const LA = mk(), LB = mk();

function draw(canvas, i, t) {
  const s = SC[i], w = worlds[s.world], lt = t - s.t0, ctx = canvas.getContext('2d');
  s.update(w, lt, t, L);
  if (w.render) w.render(); else L.renderer.render(w.scene, w.cam);   // w.render = mundo con luz de cine (cine.js)
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(L.renderer.domElement, 0, 0, W, H);
  if (w.render && w.vig !== 0) L.grade(ctx, w.vig == null ? .34 : w.vig, w.tint);
  L.setCtx(ctx);
  if (s.overlay) s.overlay(lt, t, L, s, w);
  L.chrome(s.ink || B.negro);
  if (s.year) { const prev = i > 0 ? SC[i - 1].year : null, ch = i > 0 && prev !== s.year; L.yearChip(s.year, ch ? prev : null, ch ? L.seg(lt, .1, .7) : 1, s.ink || B.negro); }
  (s.big || []).forEach(([word, at, col]) => L.bigWord(word, t, s.t0 + at * (s.t1 - s.t0), col || B.negro));
}

function renderAt(t) {
  let i = SC.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = SC.length - 1;
  const s = SC[i], TR = .7, k = i > 0 && s.trans !== 'cont' ? L.seg(t, s.t0, s.t0 + TR) : 1;
  draw(LA, i, t);
  X.setTransform(1, 0, 0, 1, 0, 0);
  if (k < 1) { draw(LB, i - 1, t); L.tide(X, LA, LB, k, t); } else X.drawImage(LA, 0, 0);
  L.setCtx(X); L.captions(CAPS, t); L.grain();
  const fo = L.seg(t, DUR - .5, DUR); if (fo > 0) { X.fillStyle = `rgba(10,10,10,${fo * .9})`; X.fillRect(0, 0, W, H); }
}
window.renderAt = renderAt; window.DUR = DUR; window.WORLDS = worlds; window.L = L;
// sfx de cada escena: [[fracción 0..1 de la escena, nombre, volumen?, duración como fracción?], ...] → tiempos absolutos para make_audio.py
window.TIMELINE = SC.map(s => ({ id: s.id, t0: s.t0, t1: s.t1, sfx: (s.sfx || []).map(([f, name, g, dur]) => [+(s.t0 + f * (s.t1 - s.t0)).toFixed(3), name, g == null ? 1 : g, dur ? +(dur * (s.t1 - s.t0)).toFixed(3) : 0]) }));
window.ENGINE_READY = true;
if (!params.has('render')) { const s0 = performance.now(); (function loop() { renderAt(((performance.now() - s0) / 1000) % DUR); requestAnimationFrame(loop); })(); }
