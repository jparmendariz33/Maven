/* Motor de shorts financieros — estilo Costa Studio.
 * Lee window.VIDEO (generado por scripts/build_timeline.py) y expone renderAt(t).
 * Reglas de diseño: una idea por pantalla, mucho aire, movimiento suave (revelados, mareas),
 * paleta Costa (arena / azul costa / terracota / musgo / mostaza / negro).
 */
(() => {
const V = window.VIDEO, W = 1080, H = 1920, FPS = 30;
const B = V.brand.colors;
const F = { d: '"Unbounded", sans-serif', b: '"Space Grotesk", sans-serif', s: '"Instrument Serif", serif' };
const cv = document.getElementById('c'), X = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const LA = mk(), LB = mk();
const D = V.data, S = D.series || [];

// ---------------- helpers ----------------
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => cl((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - x, 3);
const ex = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const back = x => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const lerp = (a, b, k) => a + (b - a) * k;
const rnd = (a, b = 0) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fmtD = s => { const [y, m, d] = s.split('-'); return (+d) + ' ' + MON[m - 1]; };
const money = (v, dec) => { if (v == null) return 'n/d'; const a = Math.abs(v), sg = v < 0 ? '−' : '';
  for (const [d, u] of [[1e12, ' T'], [1e9, ' B'], [1e6, ' M']]) if (a >= d) return sg + '$' + (a / d).toFixed(dec ?? (a / d >= 100 ? 0 : 1)) + u;
  return sg + '$' + a.toFixed(2); };
const toneC = t => t === 'down' ? B.terracota : t === 'up' ? B.musgo : t === 'accent' ? B.mostaza : t === 'blue' ? B.azul : B.negro;
const fmtNum = (v, dec = 0) => { const s = Math.abs(v).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (v < 0 ? '−' : '') + s; };

// ---------------- colores de la empresa (brand_colors en el storyboard) ----------------
// Reglas de JP (8 nov 2026):
//  · GANCHO, CATALIZADOR y CIERRE llevan DE FONDO el color de la empresa.
//  · El resto usa UN fondo institucional por video, el que combine con la marca:
//      marca de color FUERTE (rojo, verde, naranja, amarillo intenso, azul marino…) → ARENA;
//      marca TENUE / PASTEL (amarillo pastel, verde menta, rosa palo…)             → AZUL (si no, se ve demasiado colorido).
//    En los fondos de marca: color brillante o pastel → exacto con texto negro; oscuro → oscurecido lo justo con texto arena.
//    (se puede forzar con brand_colors.base: "arena" | "azul").
//  · En esas escenas, los DATOS de la empresa (nombre, cifras, barras, métricas, gráfica) van en su color; sube/baja en musgo/
//    terracota; nunca bloques rellenos del color de la empresa sobre el azul. "brand": false apaga la marca en una escena.
Object.assign(B, { g3: '#3a3a3a', g4: '#4a4a4a', grid: 'rgba(10,10,10,.12)', gridt: 'rgba(10,10,10,.45)' });
const B0 = { ...B };
const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const toHex = a => '#' + a.map(v => Math.round(cl(v, 0, 255)).toString(16).padStart(2, '0')).join('');
const mix = (a, b, k) => toHex(hex(a).map((v, i) => lerp(v, hex(b)[i], k)));
const lum = h => { const [r, g, b] = hex(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const rgba = (h, a) => `rgba(${hex(h).join(',')},${a})`;
// mezcla c hacia `to` (negro o blanco) hasta que contraste ≥ ratio con `ink`
function toward(c, to, ink, ratio) { let k = 0, o = c; while (contrast(o, ink) < ratio && k < 1) { k += .03; o = mix(c, to, k); } return o; }
const inkOn = f => ['#FFFFFF', '#0A0A0A'].sort((a, b) => contrast(b, f) - contrast(a, f))[0];
const BC = V.brand_colors && V.brand_colors.primary ? V.brand_colors : null;
// tono "pastel / tenue": muy claro, o claro y poco saturado (HSL). Solo estos usan el fondo base AZUL.
function hsl(h) { const [r, g, b] = hex(h).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  return { s: d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)), l }; }
const isPastel = c => { const { s, l } = hsl(c); return l >= .78 || (s <= .35 && l >= .62); };
const BRAND = BC ? (() => { const P = BC.primary, base = BC.base || (isPastel(P) ? 'azul' : 'arena'), bright = lum(P) > .45;
  return { P, base,
    // fondo de marca (gancho, catalizador, cierre): color brillante/pastel → exacto con texto negro; oscuro → oscurecido lo justo con texto arena
    bg: bright ? toward(P, '#FFFFFF', B0.negro, 4.5) : toward(P, '#0A0A0A', B0.arena, 3.6),
    ink: bright ? B0.negro : B0.arena,
    data: base === 'azul' ? toward(P, '#FFFFFF', B0.azul, 3) : toward(P, '#0A0A0A', B0.arena, 3) };   // datos sobre el fondo base
})() : null;
const BG_TYPES = { hook: 1, catalyst: 1, outro: 1 };
let BR = null, BGB = null; // marca activa en la escena · fondo de marca de la escena
function applyBrand(s) {
  Object.assign(B, B0); B.marca = B0.negro; BR = null; BGB = null;
  if (!BRAND || s.brand === false) return;
  const th = themeOf(s);
  if (th === 'brand') {
    BGB = B.azul = BRAND.bg; B.arena = BRAND.ink;
    if (contrast(B0.mostaza, BGB) < 2.4) B.mostaza = BRAND.ink;
    return;
  }
  if (th === 'blue') return;   // foto a pantalla completa u otra escena azul fija: Costa
  BR = BRAND; B.azul = B.marca = BRAND.data;
  if (th === 'dark') Object.assign(B, { negro: B0.arena, g3: rgba(B0.arena, .88), g4: rgba(B0.arena, .72), grid: rgba(B0.arena, .2), gridt: rgba(B0.arena, .6),
    musgo: '#DDE8B8', terracota: '#F3C3B4' });   // sube/baja en tonos claros para que se lean sobre el azul
}

let C; // contexto activo
function font(f, w, s) { C.font = `${w} ${s}px ${f}`; }
function txt(s, x, y, o = {}) {
  C.save(); font(o.f || F.b, o.w || 500, o.s || 40);
  C.textAlign = o.al || 'left'; C.textBaseline = o.bl || 'alphabetic';
  if (o.ls) C.letterSpacing = o.ls + 'px';
  C.globalAlpha *= o.a == null ? 1 : o.a; C.fillStyle = o.c || B.negro; C.fillText(s, x, y); C.restore();
}
function tw(s, f, w, size, ls) { C.save(); font(f, w, size); if (ls) C.letterSpacing = ls + 'px'; const m = C.measureText(s).width; C.restore(); return m; }
function wrap(s, f, w, size, maxW) {
  const words = String(s).split(/\s+/), lines = []; let cur = '';
  for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (tw(t, f, w, size) > maxW && cur) { lines.push(cur); cur = wd; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
// texto que "sube" desde una máscara (revelado editorial)
function rise(s, x, y, k, o = {}) {
  if (k <= 0) return; const size = o.s || 40;
  C.save(); C.beginPath(); C.rect(0, y - size * 1.15, W, size * 1.45); C.clip();
  txt(s, x, y + (1 - ex(k)) * size * 1.2, o); C.restore();
}
function riseLines(lines, x, y, lh, t0, t, o = {}, stagger = .09) {
  lines.forEach((l, i) => rise(l, x, y + i * lh, seg(t, t0 + i * stagger, t0 + i * stagger + .6), o));
}
function fit(s, f, w, size, maxW, min = 40) { while (tw(s, f, w, size) > maxW && size > min) size -= 2; return size; }
function rr(x, y, w, h, r) { C.beginPath(); C.roundRect(x, y, w, h, r); }
function scaleAt(x, y, s) { C.translate(x, y); C.scale(s, s); C.translate(-x, -y); }
function kicker(s, x, y, t0, t, col) {
  const k = seg(t, t0, t0 + .5); if (k <= 0) return;
  C.save(); C.globalAlpha *= k; C.fillStyle = col; C.fillRect(x, y - 11, 46 * ex(k), 3);
  txt(s.toUpperCase(), x + 64, y, { f: F.b, w: 500, s: 28, ls: 4, c: col }); C.restore();
}
function cueT(s, name, def) { const v = s[name]; return typeof v === 'number' ? v : s.t0 + def; }

// ---------------- textura de grano y logo ----------------
const grains = [0, 1, 2, 3].map(i => { const g = document.createElement('canvas'); g.width = 360; g.height = 640;
  const c = g.getContext('2d'), im = c.createImageData(360, 640);
  for (let p = 0; p < im.data.length; p += 4) { const v = rnd(p, i) * 255; im.data[p] = im.data[p + 1] = im.data[p + 2] = v; im.data[p + 3] = 255; }
  c.putImageData(im, 0, 0); return g; });
const logo = new Image(); logo.src = V.brand.logo_data || '';
const tinted = {};
function logoTint(col) {
  if (!logo.complete || !logo.naturalWidth) return null;
  if (!tinted[col]) { const c = document.createElement('canvas'); c.width = logo.naturalWidth; c.height = logo.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(logo, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); tinted[col] = c; }
  return tinted[col];
}

// ---------------- imágenes reales (logos, sucursales, productos) ----------------
// build_timeline.py incrusta en V.images {"images/x.jpg": dataURL} y en V.credits {"images/x.jpg": "Foto: …"}.
const IMG = {}, imgWait = [];
for (const [k, src] of Object.entries(V.images || {})) { const im = new Image(); imgWait.push(new Promise(r => { im.onload = im.onerror = r; })); im.src = src; IMG[k] = im; }
// anfitrión 3D (JP): recortes con fondo transparente (engine3d/render_host.js) que se dibujan ENCIMA de la escena, chicos, en una esquina.
// El protagonista es el tema: la foto o la gráfica ocupa toda la pantalla y JP solo reacciona a ella.
const HOSTF = {};
for (const [i, h] of Object.entries(V.host || {})) { HOSTF[i] = []; for (let k = 0; k < h.n; k++) { const im = new Image(); imgWait.push(new Promise(r => { im.onload = im.onerror = r; }));
  im.src = h.dir + String(k).padStart(4, '0') + '.png'; HOSTF[i].push(im); } }
const isHost = s => !!(s.host && (V.host || {})[V.scenes.indexOf(s)]);
function drawHost(s, t) {
  const i = V.scenes.indexOf(s), fr = HOSTF[i], h = (V.host || {})[i]; if (!fr || !fr.length) return;
  const im = fr[Math.max(0, Math.min(fr.length - 1, Math.floor((t - s.t0) * h.fps + 1e-6)))]; if (!im.complete || !im.naturalWidth) return;
  const o = typeof s.host === 'object' ? s.host : {}, size = o.size || (s.type === 'outro' ? 420 : 500), pos = o.pos || 'br';
  const x = o.x ?? (pos === 'bl' ? 0 : pos === 'bc' ? (W - size) / 2 : W - size), yb = o.y ?? 1585, k = seg(t, s.t0 + .05, s.t0 + .5);
  C.save(); C.globalAlpha *= Math.min(1, k * 2); C.shadowColor = 'rgba(0,0,0,.45)'; C.shadowBlur = 34; C.shadowOffsetY = 10;
  C.drawImage(im, x, yb - size + (1 - back(k)) * 140, size, size); C.restore();
}
window.IMAGES_READY = Promise.all(imgWait);
function img(k) { const im = k && IMG[k]; return im && im.complete && im.naturalWidth ? im : null; }
// dibuja la imagen cubriendo el rectángulo (como CSS cover), con zoom z y punto de foco (fx, fy)
function cover(im, x, y, w, h, z = 1, fx = .5, fy = .5) {
  const s = Math.max(w / im.naturalWidth, h / im.naturalHeight) * z, dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  C.drawImage(im, x + (w - dw) * fx, y + (h - dh) * fy, dw, dh);
}
function contain(im, x, y, w, h) {
  const s = Math.min(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  C.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
// Logos (PNG transparente): se dibujan directo sobre el fondo del video (JP, 8 nov 2026). Solo si el logo casi no contrasta con
// el fondo (p. ej. un logo blanco sobre arena) se pone sobre una ficha blanca.
const logoTone = {};
function logoNeedsCard(k, im, bgc) {
  if (!(k in logoTone)) { const c = document.createElement('canvas'); c.width = c.height = 48; const g = c.getContext('2d');
    g.drawImage(im, 0, 0, 48, 48); const d = g.getImageData(0, 0, 48, 48).data; let r = 0, gg = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++; }
    logoTone[k] = n ? toHex([r / n, gg / n, b / n]) : null; }
  return !logoTone[k] || contrast(logoTone[k], bgc) < 1.6;
}
const kb = (s, t) => 1.04 + .09 * seg(t, s.t0, s.t1 + .6);           // zoom lento tipo Ken Burns
const focus = s => s.focus || [.5, .5];
function credit(s, key, x, y, col, al = 'left', a = .75) {
  const c = s.credit || (V.credits || {})[key]; if (!c) return;
  txt(c, x, y, { f: F.b, w: 500, s: 21, c: col, al, a });
}

// ---------------- fondos ----------------
const THEME = { hook: 'blue', statement: 'blue', catalyst: 'blue', outro: 'blue' };
function themeOf0(s) { return s.theme || (s.type === 'photo' ? (!s.layout || s.layout === 'full' ? 'blue' : 'sand') : THEME[s.type]) || 'sand'; }
// fotos a pantalla completa (fondo negro): el texto va en el color base del video (arena, o azul si la marca es pastel)
const photoInk = () => BRAND && BRAND.base === 'azul' ? B0.azul : B0.arena;
const isFullPhoto = s => s.type === 'photo' && (!s.layout || s.layout === 'full');
// con brand_colors: 'brand' (fondo de la empresa) en gancho/catalizador/cierre; el resto, el fondo base (arena = 'sand', azul = 'dark' o 'blue')
function themeOf(s) {
  if (s.bg_full && s.bg_image) return 'blue';                    // foto del tema a pantalla completa: texto claro
  const t = themeOf0(s);
  if (!BRAND || s.brand === false || s.theme) return t;
  if (s.brand_bg ?? BG_TYPES[s.type]) return 'brand';
  if (s.type === 'photo' && t === 'blue') return t;           // foto a pantalla completa: sin cambios
  if (BRAND.base === 'azul') return t === 'sand' ? 'dark' : t;
  return t === 'blue' ? 'sand' : t;
}
const isDarkBg = th => th === 'blue' || th === 'brand' || th === 'dark';
function bg(s, t) {
  const th = themeOf(s), lt = t - s.t0;
  C.fillStyle = th === 'brand' ? BGB : isDarkBg(th) ? B0.azul : th === 'white' ? B.gris : B0.arena; C.fillRect(0, 0, W, H);
  const bf = s.bg_full && img(s.bg_image);
  if (bf) { const [fx, fy] = focus(s);                            // foto del tema a TODO el fondo, a color, con velo oscuro para leer el texto
    C.save(); C.filter = 'saturate(.92) contrast(1.05)'; cover(bf, 0, 0, W, H, kb(s, t), fx, fy); C.restore();
    const g = C.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(6,9,20,.78)'); g.addColorStop(.5, 'rgba(6,9,20,.5)'); g.addColorStop(1, 'rgba(6,9,20,.62)'); C.fillStyle = g; C.fillRect(0, 0, W, H);
    credit(s, s.bg_image, 60, 1560, B0.arena, 'left', .6); return; }
  const bi = img(s.bg_image);
  if (bi) { // foto de fondo en duotono con el color del tema (la escena sigue siendo legible)
    const [fx, fy] = focus(s); C.save(); C.filter = 'grayscale(1) contrast(1.15)'; cover(bi, 0, 0, W, H, kb(s, t), fx, fy); C.restore();
    C.fillStyle = th === 'brand' ? rgba(BGB, .80) : isDarkBg(th) ? rgba(B0.azul, .85) : th === 'white' ? 'rgba(245,245,245,.88)' : rgba(B0.arena, .87); C.fillRect(0, 0, W, H);
  }
  // línea de marea: horizonte suave que respira
  C.save(); C.strokeStyle = isDarkBg(th) ? rgba(B.arena, .28) : rgba(B0.azul, .22); C.lineWidth = 2;
  for (let k = 0; k < 2; k++) { C.beginPath();
    for (let x = 0; x <= W; x += 12) { const y = 1490 + k * 26 + Math.sin(x / 140 + t * .9 + k) * 9; x ? C.lineTo(x, y) : C.moveTo(x, y); }
    C.stroke(); }
  C.restore();
  // sol / círculo de marca
  if (th === 'blue' || th === 'brand') { C.save(); C.globalAlpha = .08; C.fillStyle = B.arena; C.beginPath(); C.arc(860, 300 - lt * 4, 260, 0, 7); C.fill(); C.restore(); }
}
function chrome(s, t) {
  const th = themeOf(s), col = isFullPhoto(s) ? photoInk() : th === 'blue' || th === 'brand' ? B.arena : B.negro;
  const lg = logoTint(col); C.save(); C.globalAlpha = .9;
  if (lg) C.drawImage(lg, 60, 150, 102, 90);
  if (V.brand.division) {   // sub-marca: "COSTA STUDIO" (logo) + "FINANCE"
    txt(V.brand.division, 180, 192, { f: F.d, w: 800, s: 26, ls: 7, c: col });
    const sub = [V.brand.byline, V.brand.handle].filter(Boolean).join('  ·  ');
    if (sub) txt(sub, 180, 230, { f: F.b, w: 500, s: 24, c: col, a: .7 });
  } else if (V.brand.handle) txt(V.brand.handle, 180, 205, { f: F.b, w: 500, s: 28, c: col, a: .8 });
  C.restore();
}

// ---------------- ESCENAS ----------------
const R = {};

R.hook = (s, t) => {
  const lt = t - s.t0, ink = B.arena;
  kicker(s.kicker || `${D.exchange || ''} · ${D.ticker}`, 90, 360, s.t0 + .1, t, ink);
  riseLines(wrap(s.title || D.short_name || D.name, F.d, 800, 104, 900), 90, 500, 118, s.t0 + .2, t, { f: F.d, w: 800, s: 104, c: ink });
  const tv = cueT(s, 'cue_value', .9), k = eo(seg(t, tv, tv + 1.4));
  const v = (s.value || 0) * k, dec = s.decimals ?? 1;
  const str = (s.prefix || '') + (s.value < 0 ? '−' : s.signed ? '+' : '') + Math.abs(v).toFixed(dec) + (s.unit ?? '%');
  const a = seg(t, tv - .1, tv + .3);
  C.save(); C.globalAlpha *= a; scaleAt(90, 860, .94 + .06 * ex(seg(t, tv, tv + .6)));
  let size = 230; while (tw(str, F.d, 800, size) > 900 && size > 120) size -= 10;
  txt(str, 90, 960, { f: F.d, w: 800, s: size, c: BGB ? ink : s.tone === 'down' ? '#F3C3B4' : s.tone === 'up' ? '#DDE8B8' : ink });
  C.restore();
  if (s.caption) { const tc = tv + .8; rise(s.caption, 90, 1060, seg(t, tc, tc + .6), { f: F.b, w: 500, s: 54, c: ink }); }
  if (s.question) { const tq = cueT(s, 'cue_question', 3); rise(s.question, 90, 1300, seg(t, tq - .1, tq + .5), { f: F.s, w: 400, s: 150, c: B.mostaza }); }
};

R.statement = (s, t) => {
  const th = themeOf(s), dk = th === 'blue' || th === 'brand', ink = dk ? B.arena : B.negro, em = dk ? B.mostaza : B.azul;
  if (s.kicker) kicker(s.kicker, 90, 520, s.t0 + .1, t, ink);
  const size = s.size || 84, lines = wrap(s.text, F.d, 600, size, 900), lh = size * 1.22;
  const y0 = 760 - (lines.length - 1) * lh / 2 + 80, emw = (s.emphasis || '').toLowerCase();
  lines.forEach((l, i) => {
    const k = seg(t, s.t0 + .15 + i * .12, s.t0 + .75 + i * .12); if (k <= 0) return;
    C.save(); C.beginPath(); C.rect(0, y0 + i * lh - size * 1.15, W, size * 1.45); C.clip();
    let x = 90; const y = y0 + i * lh + (1 - ex(k)) * size * 1.2;
    l.split(' ').forEach(wd => { const isE = emw && wd.toLowerCase().replace(/[^\p{L}\p{N}%]/gu, '').includes(emw.replace(/[^\p{L}\p{N}%]/gu, ''));
      txt(wd, x, y, { f: isE ? F.s : F.d, w: isE ? 400 : 600, s: isE ? size * 1.25 : size, c: isE ? em : ink }); x += tw(wd + ' ', isE ? F.s : F.d, isE ? 400 : 600, isE ? size * 1.25 : size); });
    C.restore();
  });
  if (s.sub) riseLines(wrap(s.sub, F.b, 500, 44, 820), 90, y0 + lines.length * lh + 50, 56, s.t0 + .9, t, { f: F.b, w: 500, s: 44, c: ink, a: .85 });
};

R.company = (s, t) => {
  kicker(s.kicker || 'La empresa', 90, 360, s.t0 + .1, t, B.negro);
  const lg = img(s.logo);
  if (lg) { const k = seg(t, s.t0 + .25, s.t0 + .85); if (k > 0) { C.save(); C.globalAlpha *= k; scaleAt(815, 415, .85 + .15 * back(k));
    if (s.logo_card || logoNeedsCard(s.logo, lg, themeOf(s) === 'dark' ? B0.azul : B0.arena)) {
      rr(700, 300, 230, 230, 34); C.fillStyle = '#FFFFFF'; C.fill(); C.strokeStyle = B.grid; C.lineWidth = 2; C.stroke(); contain(lg, 726, 326, 178, 178); }
    else contain(lg, 700, 300, 230, 230);
    C.restore(); } }
  riseLines(wrap(s.name || D.short_name || D.name, F.d, 800, 96, lg ? 580 : 900), 90, 490, 110, s.t0 + .2, t, { f: F.d, w: 800, s: lg ? fit(s.name || D.short_name || D.name, F.d, 800, 96, 580, 64) : 96, c: B.marca });
  const ll = wrap(s.line || '', F.b, 500, 46, 880);
  riseLines(ll, 90, 640, 60, s.t0 + .6, t, { f: F.b, w: 500, s: 46, c: B.g3 });
  let y = 700 + ll.length * 60, x = 90;
  (s.chips || []).forEach((c, i) => {
    const label = typeof c === 'string' ? c : c.label, tc = typeof c === 'object' && typeof c.cue === 'number' ? c.cue : s.t0 + 1.2 + i * .25;
    const k = seg(t, tc, tc + .45); const w = tw(label, F.b, 700, 38) + 64;
    if (x + w > 990) { x = 90; y += 96; }
    if (k > 0) { C.save(); C.globalAlpha *= k; C.translate(0, (1 - ex(k)) * 30);
      rr(x, y, w, 76, 38); C.fillStyle = i === 0 ? B.azul : 'rgba(255,255,255,.35)'; C.fill(); C.strokeStyle = B.negro; C.lineWidth = 2; if (i) C.stroke();
      txt(label, x + 32, y + 51, { f: F.b, w: 700, s: 38, c: i === 0 ? (BR ? inkOn(B.azul) : B.arena) : B.negro }); C.restore(); }
    x += w + 18;
  });
  y += 170;
  (s.stats || []).forEach((st, i) => {
    const tc = typeof st.cue === 'number' ? st.cue : s.t0 + 1.8 + i * .3, k = seg(t, tc, tc + .5); if (k <= 0) return;
    C.save(); C.globalAlpha *= k; C.fillStyle = B.negro; C.fillRect(90, y + i * 130, 900 * ex(k), 2);
    rise(st.label.toUpperCase(), 90, y + i * 130 + 70, k, { f: F.b, w: 500, s: 28, ls: 3, c: B.g4 });
    rise(st.value, 990, y + i * 130 + 82, k, { f: F.d, w: 800, s: 56, al: 'right', c: st.tone && st.tone !== 'blue' ? toneC(st.tone) : BR ? B.marca : toneC(st.tone) });
    C.restore();
  });
};

// --- gráfica de línea compartida por price y zoom ---
function lineChart(s, t, pts, box, opt) {
  const n = pts.length, vals = pts.map(p => p[1]);
  let lo = Math.min(...vals), hi = Math.max(...vals); const pad = (hi - lo) * .12 || 1; lo -= pad; hi += pad;
  const px = i => box.x0 + (box.x1 - box.x0) * i / (n - 1), py = v => box.y1 - (v - lo) / (hi - lo) * (box.y1 - box.y0);
  // rejilla
  C.save(); C.strokeStyle = B.grid; C.lineWidth = 2;
  const step = niceStep((hi - lo) / 4);
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) { const y = py(v); C.beginPath(); C.moveTo(box.x0, y); C.lineTo(box.x1, y); C.stroke();
    txt('$' + fmtNum(v, step < 1 ? 1 : 0), box.x0, y - 10, { f: F.b, w: 500, s: 22, c: B.gridt }); }
  C.restore();
  // progreso con keyframes por cue
  const K = [[s.t0 + .5, 0]];
  (opt.marks || []).slice().sort((a, b) => a.i - b.i).forEach(m => { const tt = Math.max(K[K.length - 1][0] + .3, m.t - .15); K.push([tt, m.i]); });
  K.push([Math.max(K[K.length - 1][0] + .6, opt.endT), n - 1]);
  let p = 0; if (t >= K[K.length - 1][0]) p = n - 1; else for (let i = 1; i < K.length; i++) if (t < K[i][0]) { p = lerp(K[i - 1][1], K[i][1], eio(seg(t, K[i - 1][0], K[i][0]))); break; }
  if (t < K[0][0]) p = 0;
  const m = Math.floor(p), fr = p - m;
  const head = m < n - 1 ? [lerp(px(m), px(m + 1), fr), lerp(py(vals[m]), py(vals[m + 1]), fr)] : [px(n - 1), py(vals[n - 1])];
  // área
  const g = C.createLinearGradient(0, box.y0, 0, box.y1); g.addColorStop(0, rgba(B.azul, .35)); g.addColorStop(1, rgba(B.azul, 0));
  C.beginPath(); C.moveTo(px(0), box.y1); for (let i = 0; i <= m; i++) C.lineTo(px(i), py(vals[i])); C.lineTo(head[0], head[1]); C.lineTo(head[0], box.y1); C.closePath(); C.fillStyle = g; C.fill();
  // línea (tramos de bajada en terracota si opt.tone)
  C.lineCap = 'round'; C.lineJoin = 'round';
  for (let i = 1; i <= Math.ceil(p); i++) {
    const k = i <= m ? 1 : fr; if (k <= 0) continue;
    const x0 = px(i - 1), y0 = py(vals[i - 1]), x1 = lerp(x0, px(i), k), y1 = lerp(y0, py(vals[i]), k);
    const dn = opt.toneSegments && vals[i] < vals[i - 1] * (1 - (opt.toneThreshold || 0));
    C.strokeStyle = dn ? B.terracota : B.negro; C.lineWidth = opt.thick || 5; C.beginPath(); C.moveTo(x0, y0); C.lineTo(x1, y1); C.stroke();
  }
  if (opt.dots) for (let i = 0; i <= m; i++) { C.fillStyle = B.negro; C.beginPath(); C.arc(px(i), py(vals[i]), 6, 0, 7); C.fill(); }
  // cabeza
  if (t > K[0][0]) { const pulse = (t * 1.2) % 1;
    C.strokeStyle = rgba(B.azul, 1 - pulse); C.lineWidth = 3; C.beginPath(); C.arc(head[0], head[1], 12 + 22 * pulse, 0, 7); C.stroke();
    C.fillStyle = B.azul; C.beginPath(); C.arc(head[0], head[1], 12, 0, 7); C.fill(); }
  return { px, py, p, vals, head, n };
}
function niceStep(r) { const e = Math.pow(10, Math.floor(Math.log10(r))), f = r / e; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * e; }
function idxOf(pts, date) { let best = 0; for (let i = 0; i < pts.length; i++) if (pts[i][0] <= date) best = i; return best; }
function pin(t, x, y, m, dir, col) {
  const k = seg(t, m.t, m.t + .45); if (k <= 0) return;
  let L = m.len || 120;
  if (dir < 0 && y - L - 90 < (m.minY || 0)) { L = y - (m.minY || 0) - 90; if (L < 45) { dir = 1; L = m.len || 120; } }
  const len = (dir < 0 ? -1 : 1) * L;
  C.save(); C.globalAlpha *= k;
  C.strokeStyle = col; C.lineWidth = 2; C.setLineDash([6, 7]); C.beginPath(); C.moveTo(x, y); C.lineTo(x, y + len * ex(k)); C.stroke(); C.setLineDash([]);
  C.fillStyle = B.arena; C.strokeStyle = col; C.lineWidth = 4; C.beginPath(); C.arc(x, y, 10, 0, 7); C.fill(); C.stroke();
  const al = x < 260 ? 'left' : x > 820 ? 'right' : 'center', tx = cl(x, 90, 990), ty = y + len + (dir < 0 ? -44 : 50);
  rise(m.label, tx, ty, k, { f: F.d, w: 600, s: 38, al, c: col });
  if (m.sub) rise(m.sub, tx, ty + (dir < 0 ? -48 : 42), seg(t, m.t + .15, m.t + .6), { f: F.b, w: 500, s: 27, al, c: B.g4 });
  C.restore();
}

R.price = (s, t) => {
  kicker(s.kicker || 'Últimos 12 meses', 90, 360, s.t0 + .1, t, B.negro);
  const first = S[0][1], lastv = S[S.length - 1][1];
  const pt = s.title || `De $${fmtNum(first, 0)} a $${fmtNum(lastv, 0)}`;
  rise(pt, 90, 480, seg(t, s.t0 + .2, s.t0 + .8), { f: F.d, w: 800, s: fit(pt, F.d, 800, 84, 900) });
  if (s.subtitle) rise(s.subtitle, 90, 545, seg(t, s.t0 + .4, s.t0 + 1), { f: F.b, w: 500, s: 40, c: B.g3 });
  const box = { x0: 90, x1: 930, y0: 760, y1: 1200 };
  const marks = (s.annotations || []).map(a => ({ ...a, i: idxOf(S, a.date), t: typeof a.cue === 'number' ? a.cue : s.t0 + 1.5 }));
  const endT = typeof s.cue_end === 'number' ? s.cue_end : Math.max(...marks.map(m => m.t), s.t0 + 1) + 1.2;
  const G = lineChart(s, t, S, box, { marks, endT: Math.min(endT, s.t1 - .8), toneSegments: false });
  marks.forEach(m => { const v = S[m.i][1]; const dir = m.dir || (v > (Math.max(...G.vals) + Math.min(...G.vals)) / 2 ? -1 : 1); pin(t, G.px(m.i), G.py(v), { ...m, minY: 580 }, dir, toneC(m.tone)); });
  (s.chips || []).forEach((c, i) => {
    const tc = typeof c.cue === 'number' ? c.cue : s.t1 - 2.2 + i * .25, k = seg(t, tc, tc + .45); if (k <= 0) return;
    const w = 280, x = 90 + i * 310, y = 1300;
    C.save(); C.globalAlpha *= k; C.translate(0, (1 - ex(k)) * 30);
    rr(x, y, w, 150, 20); C.fillStyle = 'rgba(255,255,255,.4)'; C.fill(); C.strokeStyle = B.negro; C.lineWidth = 2; C.stroke();
    txt(c.label.toUpperCase(), x + 24, y + 46, { f: F.b, w: 500, s: 24, ls: 2, c: B.g4 });
    txt(c.value, x + 24, y + 116, { f: F.d, w: 800, s: 50, c: toneC(c.tone) }); C.restore();
  });
};

R.zoom = (s, t) => {
  const N = s.sessions || 15, pts = S.slice(-N);
  kicker(s.kicker || `Últimas ${N} sesiones`, 90, 360, s.t0 + .1, t, B.negro);
  const zt = s.title || `${fmtD(pts[0][0])} → ${fmtD(pts[N - 1][0])}`;
  rise(zt, 90, 470, seg(t, s.t0 + .2, s.t0 + .8), { f: F.d, w: 800, s: fit(zt, F.d, 800, 72, 600) });
  const box = { x0: 100, x1: 920, y0: 640, y1: 1010 }, vb = { y0: 1060, y1: 1200 };
  const marks = (s.events || []).map(e => ({ ...e, i: idxOf(pts, e.date), t: typeof e.cue === 'number' ? e.cue : s.t0 + 1.5 }));
  const endT = Math.min(s.t1 - .8, Math.max(...marks.map(m => m.t), s.t0 + 1) + 1.6);
  const G = lineChart(s, t, pts, box, { marks, endT, toneSegments: true, dots: true, thick: 6 });
  // precio en vivo
  const m = Math.floor(G.p), cur = m < N - 1 ? lerp(pts[m][1], pts[m + 1][1], G.p - m) : pts[N - 1][1], chg = (cur / pts[0][1] - 1) * 100;
  const ka = seg(t, s.t0 + .4, s.t0 + .9);
  txt('$' + fmtNum(cur, 2), 990, 360, { f: F.d, w: 800, s: 54, al: 'right', a: ka });
  txt((chg >= 0 ? '+' : '−') + Math.abs(chg).toFixed(1) + '%', 990, 410, { f: F.b, w: 700, s: 38, al: 'right', c: chg < 0 ? B.terracota : B.musgo, a: ka });
  // volumen
  if (s.show_volume !== false) {
    const vmax = Math.max(...pts.map(p => p[2])), ev = new Set(marks.map(x => x.i));
    txt('VOLUMEN', 920, vb.y0 - 10, { f: F.b, w: 500, s: 22, ls: 3, al: 'right', c: B.g4 });
    pts.forEach((p, i) => { const g = cl(G.p - i + 1); if (g <= 0) return; const h = p[2] / vmax * (vb.y1 - vb.y0) * eo(g);
      C.fillStyle = ev.has(i) ? B.terracota : rgba(B.azul, .45); rr(G.px(i) - 18, vb.y1 - h, 36, h, 6); C.fill(); });
  }
  [0, Math.floor((N - 1) / 2), N - 1].forEach(i => txt(fmtD(pts[i][0]), G.px(i), vb.y1 + 40, { f: F.b, w: 500, s: 24, al: 'center', c: B.g4 }));
  marks.forEach(mm => { const v = pts[mm.i][1]; pin(t, G.px(mm.i), G.py(v), { ...mm, len: 90 }, mm.dir || 1, toneC(mm.tone || (mm.i > 0 && v < pts[mm.i - 1][1] ? 'down' : 'up'))); });
};

R.news = (s, t) => {
  kicker(s.kicker || 'La noticia', 90, 360, s.t0 + .1, t, B.negro);
  const ni = img(s.image), off = ni ? 430 : 0;
  if (ni) { const k = seg(t, s.t0 + .1, s.t0 + .8), [fx, fy] = focus(s);
    C.save(); rr(90, 400, 900, 380 * ex(k), 26); C.clip(); cover(ni, 90, 400, 900, 380, kb(s, t), fx, fy); C.restore();
    credit(s, s.image, 90, 808, B.g4, 'left', .8 * k); }
  const hl = wrap(s.headline || '', F.d, 600, 60, 900);
  riseLines(hl, 90, 480 + off, 76, s.t0 + .25, t, { f: F.d, w: 600, s: 60 });
  let y = 480 + off + hl.length * 76 + 60;
  const kc = seg(t, s.t0 + .6, s.t0 + 1.1);
  C.save(); C.globalAlpha *= kc; C.fillStyle = B.negro; C.fillRect(90, y - 30, 900 * ex(kc), 2); C.restore();
  y += 50;
  (s.bullets || []).forEach((b, i) => {
    const tc = typeof b.cue === 'number' ? b.cue : s.t0 + 1.4 + i * 1.2, k = seg(t, tc, tc + .5); if (k <= 0) return;
    const lines = wrap(b.text, F.b, 700, 46, 800);
    C.save(); C.globalAlpha *= k; C.translate((1 - ex(k)) * 40, 0);
    const bf = BR ? B.azul : b.tone ? toneC(b.tone) : B.azul;   // con brand_colors, todas las viñetas en el color de la empresa
    C.fillStyle = bf; C.beginPath(); C.arc(116, y - 15, 26, 0, 7); C.fill();
    txt(String(i + 1), 116, y - 3, { f: F.d, w: 800, s: 28, al: 'center', c: BR ? inkOn(bf) : B.arena });
    lines.forEach((l, j) => txt(l, 170, y + j * 56, { f: F.b, w: 700, s: 46 }));
    if (b.sub) txt(b.sub, 170, y + lines.length * 56 - 4, { f: F.b, w: 400, s: 34, c: B.g4, a: seg(t, tc + .4, tc + .9) });
    C.restore();
    y += lines.length * 56 + (b.sub ? 70 : 30) + 40;
  });
  if (s.source) txt('Fuente: ' + s.source, 90, Math.min(1540, Math.max(y + 20, 1380)), { f: F.b, w: 500, s: 28, c: B.g4, a: seg(t, s.t0 + 1, s.t0 + 1.5) });
};

R.bars = (s, t) => {
  kicker(s.kicker || 'Resultados trimestrales', 90, 360, s.t0 + .1, t, B.negro);
  const bt = s.title || 'Ingresos y utilidad neta';
  rise(bt, 90, 470, seg(t, s.t0 + .2, s.t0 + .8), { f: F.d, w: 800, s: fit(bt, F.d, 800, 70, 900) });
  const Q = (s.quarters || D.quarterly || []).slice(-(s.count || 6));
  const maxv = Math.max(...Q.map(q => Math.max(q.revenue || 0, Math.abs(q.net_income || 0))));
  const x0 = 110, x1 = 920, base = 1190, top = 680, gw = (x1 - x0) / Q.length, bw = Math.min(56, gw * .32);
  const tr = cueT(s, 'cue_revenue', .9), tn = cueT(s, 'cue_net', 2.2);
  // leyenda
  [[B.azul, 'Ingresos', tr], [B.negro, 'Utilidad neta', tn]].forEach(([c, l, tt], i) => { const k = seg(t, tt - .2, tt + .3); if (k <= 0) return;
    C.save(); C.globalAlpha *= k; C.fillStyle = c; rr(90 + i * 300, 540, 34, 34, 8); C.fill(); txt(l, 140 + i * 300, 568, { f: F.b, w: 700, s: 34 }); C.restore(); });
  C.fillStyle = B.negro; C.fillRect(x0 - 20, base, x1 - x0 + 40, 2);
  Q.forEach((q, i) => {
    const cx = x0 + gw * (i + .5), last = i === Q.length - 1;
    const kr = eo(seg(t, tr + i * .1, tr + i * .1 + .7)), kn = eo(seg(t, tn + i * .1, tn + i * .1 + .7));
    const hr = (q.revenue || 0) / maxv * (base - top) * kr, hn = Math.abs(q.net_income || 0) / maxv * (base - top) * kn;
    C.fillStyle = B.azul; rr(cx - bw - 4, base - hr, bw, hr, [10, 10, 0, 0]); C.fill();
    C.fillStyle = (q.net_income || 0) < 0 ? B.terracota : B.negro; rr(cx + 4, base - hn, bw, hn, [10, 10, 0, 0]); C.fill();
    if (kr > .9) txt(money(q.revenue, 0).replace(' ', ''), cx - bw / 2 - 4, base - hr - 14, { f: F.b, w: 700, s: 22, al: 'center', c: B.azul });
    if (kn > .9) txt(money(q.net_income, 0).replace(' ', ''), cx + bw / 2 + 4, base - hn - 14, { f: F.b, w: 700, s: 22, al: 'center' });
    const d = new Date(q.period + 'T00:00:00Z'), qq = Math.floor(d.getUTCMonth() / 3) + 1;
    txt(`T${qq} '${String(d.getUTCFullYear()).slice(2)}`, cx, base + 44, { f: F.b, w: last ? 700 : 500, s: 26, al: 'center', c: last ? B.negro : B.g4, a: seg(t, s.t0 + .5, s.t0 + 1) });
    if (last && s.note) { const k = seg(t, cueT(s, 'cue_note', 3.4), cueT(s, 'cue_note', 3.4) + .5); if (k > 0) { C.save(); C.globalAlpha *= k; C.fillStyle = B.mostaza; C.fillRect(cx - gw / 2 + 6, base + 62, gw - 12, 5); C.restore(); } }
  });
  if (s.note) { const tc = cueT(s, 'cue_note', 3.4);
    rise(s.note, 90, 1340, seg(t, tc, tc + .6), { f: F.d, w: 600, s: 52, c: toneC(s.note_tone || 'up') });
    if (s.note_sub) rise(s.note_sub, 90, 1400, seg(t, tc + .2, tc + .8), { f: F.b, w: 500, s: 36, c: B.g4 }); }
};

R.metric = (s, t) => {
  kicker(s.kicker || 'Valuación', 90, 360, s.t0 + .1, t, B.negro);
  rise(s.label, 90, 520, seg(t, s.t0 + .2, s.t0 + .8), { f: F.d, w: 800, s: fit(s.label, F.d, 800, 120, 900) });
  if (s.fullname) rise(s.fullname, 90, 590, seg(t, s.t0 + .35, s.t0 + .9), { f: F.b, w: 500, s: 38, c: B.g3 });
  const tv = cueT(s, 'cue_value', .7), k = eo(seg(t, tv, tv + 1.1));
  const str = (s.prefix || '') + fmtNum((s.value || 0) * k, s.decimals ?? 1) + (s.suffix || '');
  txt(str, 90, 850, { f: F.d, w: 800, s: 210, c: B.azul, a: seg(t, tv - .1, tv + .25) });
  if (s.explain) { const te = cueT(s, 'cue_explain', 1.6); riseLines(wrap(s.explain, F.b, 500, 46, 900), 90, 960, 60, te, t, { f: F.b, w: 500, s: 46 }); }
  // regla tipo "horizonte" con bandas
  const sc = s.scale; if (!sc) return;
  const gx0 = 110, gx1 = 900, gy = 1280, X_ = v => gx0 + (gx1 - gx0) * cl((v - sc.min) / (sc.max - sc.min));
  const tg = cueT(s, 'cue_gauge', 2.2), kg = seg(t, tg, tg + .6);
  if (kg <= 0) return;
  C.save(); C.globalAlpha *= kg;
  (sc.bands || []).forEach((b, i) => { const xa = X_(b[0]), xb = X_(b[1]); C.fillStyle = b[3] ? toneC(b[3]) : [B.musgo, B.mostaza, B.terracota][i % 3];
    rr(xa + 3, gy - 10, (xb - xa - 6) * ex(kg), 20, 10); C.fill();
    txt(b[2], (xa + xb) / 2, gy + 64, { f: F.b, w: 700, s: 30, al: 'center', c: B.g3 }); });
  if (sc.ref) { const xr = X_(sc.ref.value); C.fillStyle = B.negro; C.fillRect(xr - 1.5, gy - 36, 3, 72);
    txt(sc.ref.label, xr, gy - 52, { f: F.b, w: 500, s: 26, al: 'center', c: B.g3 }); }
  const tm = tg + .5, km = eio(seg(t, tm, tm + 1.3)), xm = lerp(gx0, X_(s.value), km);
  C.fillStyle = B.negro; C.beginPath(); C.moveTo(xm, gy - 22); C.lineTo(xm - 18, gy - 52); C.lineTo(xm + 18, gy - 52); C.closePath(); C.fill();
  C.fillStyle = B.arena; C.strokeStyle = B.negro; C.lineWidth = 5; C.beginPath(); C.arc(xm, gy, 20, 0, 7); C.fill(); C.stroke();
  if (s.verdict && km > .98) rise(s.verdict, 90, 1430, seg(t, tm + 1.3, tm + 1.8), { f: F.s, w: 400, s: 72, c: toneC(s.verdict_tone || 'blue') });
  C.restore();
};

// Foto real. layout: "full" (por defecto: pantalla completa sobre negro; el texto en el color base del video, arena o azul — JP,
// 8 nov 2026) · "framed" (foto en tarjeta redondeada sobre el fondo del video, texto debajo) · "card" (título arriba, foto grande) ·
// "logo" (logo grande en ficha blanca)
R.photo = (s, t) => {
  const im = img(s.image), [fx, fy] = focus(s), lay = s.layout || 'full';
  if (lay === 'framed') {
    const size = s.size || 72, tl = wrap(s.title || '', F.d, 800, size, 900), lh = size * 1.16;
    const textH = (s.kicker ? 70 : 0) + tl.length * lh + (s.caption ? 84 : 0) + 40;
    const ar = im ? im.naturalWidth / im.naturalHeight : 1.5, maxH = 1530 - 290 - 60 - textH;
    const ph = Math.max(380, Math.min(900 / ar * 1.35, maxH));                  // fotos horizontales: algo más altas (recorta los lados)
    const top = 290 + Math.max(0, 1530 - 290 - (ph + 60 + textH)) * .45, k = seg(t, s.t0, s.t0 + .9);   // bloque centrado
    if (im) { C.save(); rr(90, top, 900, ph * ex(k), 30); C.clip(); C.filter = 'saturate(.95) contrast(1.04)'; cover(im, 90, top, 900, ph, kb(s, t), fx, fy); C.restore();
      credit(s, s.image, 990, top + ph + 34, B.g4, 'right', .8 * k); }
    let y = top + ph + 60 + (s.kicker ? 50 : 0);
    if (s.kicker) kicker(s.kicker, 90, y - 50 + 28, s.t0 + .2, t, B.negro);
    y += size * .9;
    riseLines(tl, 90, y, lh, cueT(s, 'cue_title', .35), t, { f: F.d, w: 800, s: size });
    if (s.caption) rise(s.caption, 90, y + (tl.length - 1) * lh + 84, seg(t, cueT(s, 'cue_caption', .8), cueT(s, 'cue_caption', .8) + .6),
      { f: F.s, w: 400, s: fit(s.caption, F.s, 400, 60, 900, 36), c: BR ? B.marca : B.azul });
  } else if (lay === 'full') {
    const wide = im && im.naturalWidth / im.naturalHeight > .8 && s.fit !== 'cover';
    const tl = wrap(s.title || '', F.d, 800, s.size || 80, 860), lh = (s.size || 80) * 1.16;
    const y0 = (wide ? 1470 : 1430) - (tl.length - 1) * lh - (s.caption ? 70 : 0), top = y0 - (s.size || 80) - (s.kicker ? 120 : 30);
    if (im && wide) { // foto horizontal: completa arriba del texto, sobre la misma foto desenfocada (sin recortes extremos)
      C.save(); C.filter = 'blur(38px) brightness(.5) saturate(.8)'; cover(im, -80, -80, W + 160, H + 160, 1.1, fx, fy); C.restore();
      const room = top - 40 - 270, ph = Math.min(room, W / (im.naturalWidth / im.naturalHeight)), py = 270 + (room - ph) / 2, k = seg(t, s.t0, s.t0 + .9);
      C.save(); C.beginPath(); C.rect(0, py + ph * (1 - ex(k)) / 2, W, ph * ex(k)); C.clip(); C.filter = 'saturate(.95) contrast(1.04)';
      cover(im, 0, py, W, ph, kb(s, t), fx, fy); C.restore();
    } else if (im) { C.save(); C.filter = 'saturate(.92) contrast(1.04)'; cover(im, 0, 0, W, H, kb(s, t), fx, fy); C.restore(); }
    let g = C.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, 'rgba(10,10,10,.55)'); g.addColorStop(1, 'rgba(10,10,10,0)'); C.fillStyle = g; C.fillRect(0, 0, W, 420);
    const gy = wide ? 1200 : 900;
    g = C.createLinearGradient(0, gy, 0, H); g.addColorStop(0, 'rgba(10,10,10,0)'); g.addColorStop(.3, 'rgba(10,10,10,.78)'); g.addColorStop(1, 'rgba(10,10,10,.92)');
    C.fillStyle = g; C.fillRect(0, gy, W, H - gy);
    const ink = photoInk();
    if (s.kicker) kicker(s.kicker, 90, y0 - 110, s.t0 + .2, t, ink);
    riseLines(tl, 90, y0, lh, cueT(s, 'cue_title', .35), t, { f: F.d, w: 800, s: s.size || 80, c: ink });
    if (s.caption) rise(s.caption, 90, y0 + (tl.length - 1) * lh + 86, seg(t, cueT(s, 'cue_caption', .8), cueT(s, 'cue_caption', .8) + .6), { f: F.s, w: 400, s: 62, c: B.mostaza });
    credit(s, s.image, 990, 1555, ink, 'right', .7 * seg(t, s.t0 + .5, s.t0 + 1));
  } else if (lay === 'card') {
    if (s.kicker) kicker(s.kicker, 90, 360, s.t0 + .1, t, B.negro);
    const tl = wrap(s.title || '', F.d, 800, 70, 900).slice(0, 2);
    riseLines(tl, 90, 470, 82, s.t0 + .2, t, { f: F.d, w: 800, s: 70 });
    const y = 470 + tl.length * 82 + 10, h = 1440 - y - (s.caption ? 120 : 40), k = seg(t, s.t0 + .3, s.t0 + 1.1);
    if (im) { C.save(); rr(90, y, 900, h * ex(k), 30); C.clip(); cover(im, 90, y, 900, h, kb(s, t), fx, fy); C.restore(); }
    if (s.caption) rise(s.caption, 90, y + h + 74, seg(t, cueT(s, 'cue_caption', 1), cueT(s, 'cue_caption', 1) + .6), { f: F.b, w: 700, s: fit(s.caption, F.b, 700, 46, 900, 30) });
    credit(s, s.image, 90, Math.min(1545, y + h + (s.caption ? 124 : 40)), B.g4, 'left', .8 * k);
  } else { // logo
    const k = seg(t, s.t0 + .15, s.t0 + .8);
    if (s.kicker) kicker(s.kicker, 90, 360, s.t0 + .1, t, B.negro);
    if (im && k > 0) { C.save(); C.globalAlpha *= k; scaleAt(540, 760, .88 + .12 * back(k));
      if (s.logo_card || logoNeedsCard(s.image, im, themeOf(s) === 'dark' ? B0.azul : B0.arena)) { rr(140, 470, 800, 580, 48); C.fillStyle = '#FFFFFF'; C.fill(); contain(im, 220, 540, 640, 440); }
      else contain(im, 160, 490, 760, 540);
      C.restore(); }
    if (s.title) rise(s.title, 540, 1210, seg(t, cueT(s, 'cue_title', .6), cueT(s, 'cue_title', .6) + .6), { f: F.d, w: 800, s: fit(s.title, F.d, 800, 78, 880, 40), al: 'center' });
    if (s.caption) riseLines(wrap(s.caption, F.b, 500, 44, 860), 540, 1290, 58, cueT(s, 'cue_caption', 1), t, { f: F.b, w: 500, s: 44, al: 'center', c: B.g3 });
  }
};

R.catalyst = (s, t) => {
  const ink = B.arena;
  kicker(s.kicker || 'Próximo catalizador', 90, 520, s.t0 + .1, t, ink);
  const td = cueT(s, 'cue_date', .5), k = seg(t, td, td + .7);
  if (k > 0) { C.save(); C.globalAlpha *= k;
    rr(90, 600, 900, 330, 28); C.strokeStyle = ink; C.lineWidth = 4; C.stroke();
    C.save(); C.beginPath(); C.rect(90, 600, 900, 330); C.clip();
    let size = 200; while (tw(s.date, F.d, 800, size) > 820 && size > 90) size -= 10;
    txt(s.date, 540, 770 + size * .36 + (1 - ex(k)) * 200, { f: F.d, w: 800, s: size, al: 'center', c: ink });
    C.restore(); C.restore(); }
  if (s.label) rise(s.label, 540, 1040, seg(t, td + .4, td + 1), { f: F.d, w: 600, s: fit(s.label, F.d, 600, 58, 760, 34), al: 'center', c: ink });
  if (s.sub) riseLines(wrap(s.sub, F.b, 500, 42, 860), 540, 1120, 56, td + .7, t, { f: F.b, w: 500, s: 42, al: 'center', c: ink });
};

R.outro = (s, t) => {
  const ink = B.arena;
  const ta = cueT(s, 'cue_a', .3), tb = cueT(s, 'cue_b', 1.2);
  rise(s.question_a || '', 540, 640, seg(t, ta - .1, ta + .5), { f: F.s, w: 400, s: fit(s.question_a || '', F.s, 400, 150, 780, 70), al: 'center', c: ink });
  rise(s.question_b || '', 540, 800, seg(t, tb - .1, tb + .5), { f: F.s, w: 400, s: fit(s.question_b || '', F.s, 400, 150, 780, 70), al: 'center', c: B.mostaza });
  const tl = tb + .9;
  if (V.brand.tagline) rise(V.brand.tagline, 540, 960, seg(t, tl, tl + .6), { f: F.s, w: 400, s: 50, al: 'center', c: ink });
  const kc = seg(t, tl + .4, tl + 1);
  if (kc > 0) { const label = s.cta || V.brand.cta, w = tw(label, F.b, 700, 40) + 90;
    C.save(); C.globalAlpha *= kc; scaleAt(540, 1110, .9 + .1 * back(kc));
    rr(540 - w / 2, 1060, w, 96, 48); C.fillStyle = ink; C.fill(); txt(label, 540, 1122, { f: F.b, w: 700, s: 40, al: 'center', c: B.azul }); C.restore(); }
  const kd = seg(t, tl + .8, tl + 1.3);
  if (V.brand.handle) txt(V.brand.handle, 540, 1230, { f: F.d, w: 600, s: 40, al: 'center', c: ink, a: kd });
  if (V.brand.name) txt(V.brand.name.toUpperCase() + (V.brand.byline ? '  ·  ' + V.brand.byline.toUpperCase() : ''), 540, 1278, { f: F.d, w: 800, s: 19, ls: 3, al: 'center', c: B.mostaza, a: kd });
  txt(s.sources ? 'Datos: ' + s.sources : 'Datos: Yahoo Finance', 540, 1330, { f: F.b, w: 400, s: 28, al: 'center', c: ink, a: kd * .85 });
  txt(V.brand.disclaimer, 540, 1372, { f: F.b, w: 400, s: 28, al: 'center', c: ink, a: kd * .85 });
  if (s.disclosure) txt(s.disclosure, 540, 1414, { f: F.b, w: 700, s: 28, al: 'center', c: B.mostaza, a: kd });
};

// ---------------- subtítulos ----------------
function captions(t) {
  const CAPS = V.captions || []; let ci = -1;
  for (let i = 0; i < CAPS.length; i++) if (t >= CAPS[i][0][0] - .08) ci = i;
  if (ci < 0) return;
  const c = CAPS[ci], nextT = CAPS[ci + 1] ? CAPS[ci + 1][0][0] - .08 : Infinity, endT = Math.min(nextT, c[c.length - 1][1] + 1.0);
  if (t > endT) return;
  const a = seg(t, c[0][0] - .08, c[0][0] + .05) * (1 - seg(t, endT - .1, endT));
  const S_ = 52, gap = 20, ws = c.map(w => tw(w[2], F.b, 700, S_)), total = ws.reduce((p, q) => p + q, 0) + gap * (c.length - 1);
  let x = W / 2 - total / 2; const y = 1650;
  C.save(); C.globalAlpha *= a; rr(W / 2 - total / 2 - 32, y - 60, total + 64, 86, 43); C.fillStyle = 'rgba(10,10,10,.86)'; C.fill();
  c.forEach((w, i) => { const on = t >= w[0] - .05, cur = on && (t < w[1] + .05 || (i === c.length - 1 && t < w[1] + .4));
    txt(w[2], x, y, { f: F.b, w: 700, s: S_, c: cur ? B.mostaza : on ? B.arena : 'rgba(235,230,186,.4)' }); x += ws[i] + gap; });
  C.restore();
}

// ---------------- composición ----------------
function drawScene(ctx, s, t) {
  C = ctx; C.setTransform(1, 0, 0, 1, 0, 0); C.globalAlpha = 1;
  applyBrand(s);
  bg(s, t);
  C.save(); scaleAt(W / 2, H / 2, 1 + .018 * seg(t, s.t0, s.t1)); // deriva lenta de cámara
  if (isHost(s) && s.type === 'outro') C.translate(0, -200);        // cierre con JP: el bloque sube para dejarle la esquina de abajo
  (R[s.type] || (() => txt('escena desconocida: ' + s.type, 90, 900, { s: 50 })))(s, t);
  C.restore();
  if (isHost(s)) drawHost(s, t);
  chrome(s, t);
  Object.assign(B, B0); BR = null; BGB = null;
}
function renderAt(t) {
  const SC = V.scenes; let i = SC.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = SC.length - 1;
  const s = SC[i], TR = .65, k = i > 0 ? seg(t, s.t0, s.t0 + TR) : 1;
  drawScene(LA.getContext('2d'), s, t);
  X.setTransform(1, 0, 0, 1, 0, 0);
  if (k < 1) { // transición de marea: la escena nueva sube con borde de ola
    drawScene(LB.getContext('2d'), SC[i - 1], t);
    X.drawImage(LB, 0, (-ex(k)) * 90);
    const edge = H - eio(k) * (H + 160);
    X.save(); X.beginPath(); X.moveTo(0, H);
    for (let x = 0; x <= W; x += 20) X.lineTo(x, edge + Math.sin(x / 150 + t * 6) * 38 + Math.sin(x / 61) * 10);
    X.lineTo(W, H); X.closePath(); X.clip(); X.drawImage(LA, 0, (1 - eio(k)) * 120); X.restore();
  } else X.drawImage(LA, 0, 0);
  C = X; captions(t);
  // grano de película
  const fr = Math.round(t * FPS); X.save(); X.globalAlpha = .055; X.globalCompositeOperation = 'multiply';
  X.drawImage(grains[0], 0, 0, W, H); X.restore(); // grano fijo: se ve igual y el MP4 pesa ~4x menos
  // fundido de entrada/salida
  const fo = seg(t, V.duration - .5, V.duration); // sin fundido inicial: el 1er cuadro es la miniatura
  if (fo > 0) { X.fillStyle = `rgba(10,10,10,${fo * .9})`; X.fillRect(0, 0, W, H); }
}
window.renderAt = renderAt; window.DUR = V.duration; window.FPS = FPS;
if (!new URLSearchParams(location.search).has('render')) { const s0 = performance.now();
  (function loop() { renderAt(((performance.now() - s0) / 1000) % V.duration); requestAnimationFrame(loop); })(); }
})();
