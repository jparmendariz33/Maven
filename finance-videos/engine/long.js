/* Motor de VIDEOS LARGOS 16:9 (1920x1080) — Costa Studio Finance, by JP Armendáriz.
 * Mismo lenguaje visual que los shorts (engine.js): paleta Costa, Unbounded / Space Grotesk / Instrument Serif,
 * revelados que "suben", transición de marea, grano, una idea por pantalla.
 * Extra para largos: teleprompter abajo (frase actual + siguiente), barra de avance con capítulos,
 * nombre del capítulo arriba a la derecha y escenas educativas (chapter, bignum, list, compare, line, bars,
 * cascade, donut, metric, quote, formula, timeline, table, news, catalyst, outro). También window.renderThumb().
 */
(() => {
const V = window.VIDEO, W = 1920, H = 1080, FPS = 30;
const B = V.brand.colors;
const F = { d: '"Unbounded", sans-serif', b: '"Space Grotesk", sans-serif', s: '"Instrument Serif", serif' };
const cv = document.getElementById('c'), X = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const LA = mk(), LB = mk();
const D = V.data || {}, PS = D.series || [];
const L = 140, RX = 1780, CW = RX - L;          // márgenes y ancho útil
const TP_Y = 924, TP_H = 124;                    // banda del teleprompter

// ---------------- helpers (idénticos a engine.js) ----------------
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => cl((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - x, 3);
const ex = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const back = x => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const lerp = (a, b, k) => a + (b - a) * k;
const rnd = (a, b = 0) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };
const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fmtD = s => { const p = String(s).split('-'); return p.length === 3 ? (+p[2]) + ' ' + MON[p[1] - 1] + ' ' + p[0].slice(2) : String(s); };
const toneC = t => t === 'down' ? B.terracota : t === 'up' ? B.musgo : t === 'accent' ? B.mostaza : t === 'blue' ? B.azul : t === 'ink' ? B.negro : B.negro;
const fmtNum = (v, dec = 0) => { const s = Math.abs(v).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (v < 0 ? '−' : '') + s; };
const fmtV = (v, s) => (s.prefix || '') + fmtNum(v, s.decimals ?? 0) + (s.suffix || '');

let C;
function font(f, w, s) { C.font = `${w} ${s}px ${f}`; }
function txt(s, x, y, o = {}) {
  C.save(); font(o.f || F.b, o.w || 500, o.s || 40);
  C.textAlign = o.al || 'left'; C.textBaseline = o.bl || 'alphabetic';
  if (o.ls) C.letterSpacing = o.ls + 'px';
  C.globalAlpha *= o.a == null ? 1 : o.a; C.fillStyle = o.c || B.negro; C.fillText(s, x, y); C.restore();
}
function tw(s, f, w, size, ls) { C.save(); font(f, w, size); if (ls) C.letterSpacing = ls + 'px'; const m = C.measureText(s).width; C.restore(); return m; }
function wrap(s, f, w, size, maxW) {
  const words = String(s || '').split(/\s+/).filter(Boolean), lines = []; let cur = '';
  for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (tw(t, f, w, size) > maxW && cur) { lines.push(cur); cur = wd; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
function rise(s, x, y, k, o = {}) {
  if (k <= 0 || !s) return; const size = o.s || 40;
  C.save(); C.beginPath(); C.rect(0, y - size * 1.15, W, size * 1.45); C.clip();
  txt(s, x, y + (1 - ex(k)) * size * 1.2, o); C.restore();
}
function riseLines(lines, x, y, lh, t0, t, o = {}, stagger = .09) {
  lines.forEach((l, i) => rise(l, x, y + i * lh, seg(t, t0 + i * stagger, t0 + i * stagger + .6), o));
}
function fit(s, f, w, size, maxW, min = 30) { while (tw(s, f, w, size) > maxW && size > min) size -= 2; return size; }
function rr(x, y, w, h, r) { C.beginPath(); C.roundRect(x, y, w, h, r); }
function scaleAt(x, y, s) { C.translate(x, y); C.scale(s, s); C.translate(-x, -y); }
function kicker(s, x, y, t0, t, col) {
  if (!s) return; const k = seg(t, t0, t0 + .5); if (k <= 0) return;
  C.save(); C.globalAlpha *= k; C.fillStyle = col; C.fillRect(x, y - 9, 40 * ex(k), 3);
  txt(String(s).toUpperCase(), x + 56, y, { f: F.b, w: 500, s: 24, ls: 4, c: col }); C.restore();
}
function cueT(s, name, def) { const v = s[name]; return typeof v === 'number' ? v : s.t0 + def; }
function cueOf(o, def) { return typeof o.cue === 'number' ? o.cue : def; }
function inkOf(s) { return themeOf(s) === 'blue' ? B.arena : B.negro; }
function sub2(s) { return themeOf(s) === 'blue' ? 'rgba(235,230,186,.8)' : '#3a3a3a'; }
// título estándar de escena: kicker + título (+ subtítulo). Devuelve la y donde empieza el contenido.
function header(s, t, def = {}) {
  const ink = inkOf(s); kicker(s.kicker || def.kicker, L, 214, s.t0 + .1, t, ink);
  let y = 214;
  if (s.title) { const size = s.title_size || 62, ls = wrap(s.title, F.d, 800, size, s.title_w || CW); riseLines(ls, L, 300, size * 1.18, s.t0 + .2, t, { f: F.d, w: 800, s: size, c: ink }); y = 300 + (ls.length - 1) * size * 1.18; }
  if (s.subtitle) { y += 56; rise(s.subtitle, L, y, seg(t, s.t0 + .4, s.t0 + 1), { f: F.b, w: 500, s: 36, c: sub2(s) }); }
  return y + 50;
}

// ---------------- grano y logo ----------------
const grain = (() => { const g = document.createElement('canvas'); g.width = 640; g.height = 360;
  const c = g.getContext('2d'), im = c.createImageData(640, 360);
  for (let p = 0; p < im.data.length; p += 4) { const v = rnd(p, 0) * 255; im.data[p] = im.data[p + 1] = im.data[p + 2] = v; im.data[p + 3] = 255; }
  c.putImageData(im, 0, 0); return g; })();
const logo = new Image(); logo.src = V.brand.logo_data || '';
const tinted = {};
function logoTint(col) {
  if (!logo.complete || !logo.naturalWidth) return null;
  if (!tinted[col]) { const c = document.createElement('canvas'); c.width = logo.naturalWidth; c.height = logo.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(logo, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); tinted[col] = c; }
  return tinted[col];
}

// ---------------- imágenes reales (fetch_images.py → build_timeline.py las incrusta en V.images) ----------------
const IMG = {}, imgWait = [];
for (const [k, src] of Object.entries(V.images || {})) { const im = new Image(); imgWait.push(new Promise(r => { im.onload = im.onerror = r; })); im.src = src; IMG[k] = im; }
// anfitrión 3D (JP): recortes con fondo transparente (engine3d/render_host.js), chicos y encima de la escena (igual que en los shorts)
const HOSTF = {};
for (const [i, h] of Object.entries(V.host || {})) { HOSTF[i] = []; for (let k = 0; k < h.n; k++) { const im = new Image(); imgWait.push(new Promise(r => { im.onload = im.onerror = r; }));
  im.src = h.dir + String(k).padStart(4, '0') + '.png'; HOSTF[i].push(im); } }
function drawHost(s, t) {
  const i = V.scenes.indexOf(s), fr = HOSTF[i], h = (V.host || {})[i]; if (!s.host || !fr || !fr.length) return;
  const im = fr[Math.max(0, Math.min(fr.length - 1, Math.floor((t - s.t0) * h.fps + 1e-6)))]; if (!im.complete || !im.naturalWidth) return;
  const o = typeof s.host === 'object' ? s.host : {}, size = o.size || 380, pos = o.pos || 'br';
  const x = o.x ?? (pos === 'bl' ? 30 : pos === 'bc' ? (W - size) / 2 : W - size - 30), yb = o.y ?? 885, k = seg(t, s.t0 + .05, s.t0 + .5);
  C.save(); C.globalAlpha *= Math.min(1, k * 2); C.shadowColor = 'rgba(0,0,0,.4)'; C.shadowBlur = 28; C.shadowOffsetY = 8;
  C.drawImage(im, x, yb - size + (1 - back(k)) * 110, size, size); C.restore();
}
window.IMAGES_READY = Promise.all(imgWait);
function img(k) { const im = k && IMG[k]; return im && im.complete && im.naturalWidth ? im : null; }
function cover(im, x, y, w, h, z = 1, fx = .5, fy = .5) {
  const s = Math.max(w / im.naturalWidth, h / im.naturalHeight) * z, dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  C.drawImage(im, x + (w - dw) * fx, y + (h - dh) * fy, dw, dh);
}
function contain(im, x, y, w, h) {
  const s = Math.min(w / im.naturalWidth, h / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  C.drawImage(im, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
const kb = (s, t) => 1.03 + .07 * seg(t, s.t0, s.t1 + .6);
const focus = s => s.focus || [.5, .5];
function credit(s, key, x, y, col, al = 'left', a = .75) {
  const c = s.credit || (V.credits || {})[key]; if (!c) return;
  txt(c, x, y, { f: F.b, w: 500, s: 17, c: col, al, a });
}

// ---------------- fondos y marco ----------------
const THEME = { personal: 'blue', hook: 'blue', statement: 'blue', chapter: 'blue', catalyst: 'blue', outro: 'blue', quote: 'blue' };
const _lt = {};
function logoLight(k, im) {   // ¿el logo es casi del color de la arena? (luminancia media de los píxeles opacos)
  if (!(k in _lt)) { const c = document.createElement('canvas'); c.width = c.height = 48; const g = c.getContext('2d'); g.drawImage(im, 0, 0, 48, 48);
    const d = g.getImageData(0, 0, 48, 48).data; let l = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 128) { l += (.2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]) / 255; n++; }
    _lt[k] = !n || l / n > .72; }
  return _lt[k];
}
function themeOf(s) { return s.theme || (s.type === 'photo' ? (s.layout === 'split' || s.layout === 'logo' ? 'sand' : 'blue') : THEME[s.type]) || 'sand'; }
function bg(s, t) {
  const th = themeOf(s), lt = t - s.t0;
  C.fillStyle = th === 'blue' ? B.azul : th === 'white' ? B.gris : B.arena; C.fillRect(0, 0, W, H);
  const bi = img(s.bg_image);
  if (bi) { const [fx, fy] = focus(s); C.save(); C.filter = 'grayscale(1) contrast(1.15)'; cover(bi, 0, 0, W, H, kb(s, t), fx, fy); C.restore();
    C.fillStyle = th === 'blue' ? 'rgba(65,115,209,.80)' : th === 'white' ? 'rgba(245,245,245,.88)' : 'rgba(235,230,186,.87)'; C.fillRect(0, 0, W, H); }
  C.save(); C.strokeStyle = th === 'blue' ? 'rgba(235,230,186,.26)' : 'rgba(65,115,209,.2)'; C.lineWidth = 2;
  for (let k = 0; k < 2; k++) { C.beginPath();
    for (let x = 0; x <= W; x += 14) { const y = 884 + k * 18 + Math.sin(x / 170 + t * .9 + k) * 8; x ? C.lineTo(x, y) : C.moveTo(x, y); }
    C.stroke(); }
  C.restore();
  if (th === 'blue') { C.save(); C.globalAlpha = .08; C.fillStyle = B.arena; C.beginPath(); C.arc(1600, 230 - lt * 3, 250, 0, 7); C.fill(); C.restore(); }
}
function chrome(s, t) {
  const col = inkOf(s), lg = logoTint(col); C.save(); C.globalAlpha = .9;
  if (lg) C.drawImage(lg, 110, 44, 80, 70);
  txt(V.brand.division || 'FINANCE', 205, 80, { f: F.d, w: 800, s: 21, ls: 6, c: col });
  const sb = [V.brand.byline, V.brand.handle].filter(Boolean).join('  ·  ');
  if (sb) txt(sb, 205, 108, { f: F.b, w: 500, s: 19, c: col, a: .7 });
  // capítulo actual arriba a la derecha
  const ch = chapterAt(t);
  if (ch && s.type !== 'chapter' && s.type !== 'hook' && s.type !== 'outro')
    txt(ch.title.toUpperCase(), RX, 86, { f: F.b, w: 500, s: 19, ls: 3, al: 'right', c: col, a: .55 });
  C.restore();
}
function chapterAt(t) { let c = null; for (const ch of (V.chapters || [])) if (t >= ch.t0) c = ch; return c && c.index > 0 ? c : null; }
function progress(t) {
  const y = H - 6, k = cl(t / V.duration);
  X.save(); X.fillStyle = 'rgba(10,10,10,.10)'; X.fillRect(0, y, W, 6);
  X.fillStyle = B.mostaza; X.fillRect(0, y, W * k, 6);
  (V.chapters || []).forEach(ch => { if (ch.t0 > 0) { X.fillStyle = 'rgba(10,10,10,.55)'; X.fillRect(W * ch.t0 / V.duration - 1, y - 4, 3, 10); } });
  X.restore();
}

// ---------------- ESCENAS ----------------
const R = {};

R.hook = (s, t) => {
  const ink = B.arena;
  kicker(s.kicker, L, 250, s.t0 + .1, t, ink);
  const tl = wrap(s.title || '', F.d, 800, s.title_size || 88, s.value != null ? 980 : CW);
  riseLines(tl, L, 370, (s.title_size || 88) * 1.15, s.t0 + .2, t, { f: F.d, w: 800, s: s.title_size || 88, c: ink });
  if (s.value != null) {
    const tv = cueT(s, 'cue_value', .9), k = eo(seg(t, tv, tv + 1.4)), dec = s.decimals ?? 0;
    const num = typeof s.value === 'number';
    const str = num ? (s.prefix || '') + (s.value < 0 ? '−' : s.signed ? '+' : '') + fmtNum(Math.abs(s.value * k), dec) + (s.unit ?? '') : String(s.value);
    C.save(); C.globalAlpha *= seg(t, tv - .1, tv + .3); scaleAt(RX, 560, .94 + .06 * ex(seg(t, tv, tv + .6)));
    txt(str, RX, 620, { f: F.d, w: 800, s: fit(str, F.d, 800, 250, 720, 120), al: 'right', c: s.tone === 'down' ? '#F3C3B4' : s.tone === 'up' ? '#DDE8B8' : ink });
    C.restore();
    if (s.caption) { const tc = tv + .8; rise(s.caption, RX, 700, seg(t, tc, tc + .6), { f: F.b, w: 500, s: 42, al: 'right', c: ink }); }
  }
  if (s.question) { const tq = cueT(s, 'cue_question', 3); rise(s.question, L, 820, seg(t, tq - .1, tq + .5), { f: F.s, w: 400, s: 118, c: B.mostaza }); }
};

R.statement = (s, t) => {
  const th = themeOf(s), ink = th === 'blue' ? B.arena : B.negro, em = th === 'blue' ? B.mostaza : B.azul;
  if (s.kicker) kicker(s.kicker, L, 300, s.t0 + .1, t, ink);
  const size = s.size || 86, lines = wrap(s.text, F.d, 600, size, CW), lh = size * 1.22;
  const y0 = 520 - (lines.length - 1) * lh / 2, emw = (s.emphasis || '').toLowerCase().split(/\s+/).filter(Boolean).map(w => w.replace(/[^\p{L}\p{N}%$]/gu, ''));
  lines.forEach((l, i) => {
    const k = seg(t, s.t0 + .15 + i * .12, s.t0 + .75 + i * .12); if (k <= 0) return;
    C.save(); C.beginPath(); C.rect(0, y0 + i * lh - size * 1.2, W, size * 1.5); C.clip();
    let x = L; const y = y0 + i * lh + (1 - ex(k)) * size * 1.2;
    l.split(' ').forEach(wd => { const c = wd.toLowerCase().replace(/[^\p{L}\p{N}%$]/gu, ''), isE = emw.length && emw.includes(c);
      const f = isE ? F.s : F.d, w = isE ? 400 : 600, sz = isE ? size * 1.25 : size;
      txt(wd, x, y, { f, w, s: sz, c: isE ? em : ink }); x += tw(wd + ' ', f, w, sz); });
    C.restore();
  });
  if (s.sub) rise(s.sub, L, y0 + lines.length * lh + 30, seg(t, s.t0 + .9, s.t0 + 1.5), { f: F.b, w: 500, s: 42, c: ink, a: .85 });
};

R.chapter = (s, t) => {
  const ink = B.arena, n = String(s.number ?? '');
  C.save(); C.globalAlpha = .13 * seg(t, s.t0 + .1, s.t0 + .9);
  txt(n, RX + 30, 820 + (1 - ex(seg(t, s.t0, s.t0 + 1))) * 80, { f: F.d, w: 800, s: 620, al: 'right', c: ink }); C.restore();
  kicker(s.kicker || ('Capítulo ' + n), L, 360, s.t0 + .1, t, ink);
  const ls = wrap(s.title, F.d, 800, 96, 1300);
  riseLines(ls, L, 490, 112, s.t0 + .25, t, { f: F.d, w: 800, s: 96, c: ink });
  if (s.sub) rise(s.sub, L, 490 + ls.length * 112 + 20, seg(t, s.t0 + .8, s.t0 + 1.4), { f: F.s, w: 400, s: 70, c: B.mostaza });
};

R.bignum = (s, t) => {
  const ink = inkOf(s);
  kicker(s.kicker, L, 230, s.t0 + .1, t, ink);
  if (s.label) riseLines(wrap(s.label, F.b, 500, 50, CW), L, 330, 62, s.t0 + .2, t, { f: F.b, w: 500, s: 50, c: ink });
  const tv = cueT(s, 'cue_value', .7), k = eo(seg(t, tv, tv + 1.2));
  const str = typeof s.value === 'number' ? (s.prefix || '') + (s.signed && s.value > 0 ? '+' : '') + fmtNum(s.value * k, s.decimals ?? 0) + (s.suffix || '') : String(s.value);
  const col = s.tone ? (themeOf(s) === 'blue' && s.tone !== 'accent' ? ink : toneC(s.tone)) : (themeOf(s) === 'blue' ? B.mostaza : B.azul);
  C.save(); C.globalAlpha *= seg(t, tv - .1, tv + .3); scaleAt(L, 600, .95 + .05 * ex(seg(t, tv, tv + .5)));
  txt(str, L, 670, { f: F.d, w: 800, s: fit(str, F.d, 800, 270, CW, 100), c: col }); C.restore();
  if (s.sub) { const ts = Math.max(cueT(s, 'cue_sub', 1.6), tv + .9); riseLines(wrap(s.sub, F.b, 500, 44, CW), L, 770, 56, ts, t, { f: F.b, w: 500, s: 44, c: sub2(s) }); }
};

R.list = (s, t) => {
  const ink = inkOf(s); let y = header(s, t) + 30;
  const items = s.items || [], n = items.length, cols = n > 4 ? 2 : 1, rows = Math.ceil(n / cols);
  const rh = Math.min(130, (860 - y) / rows), cw = CW / cols;
  items.forEach((it, i) => {
    const o = typeof it === 'string' ? { text: it } : it, tc = cueOf(o, s.t0 + 1 + i * 1.1), k = seg(t, tc, tc + .5); if (k <= 0) return;
    const cx = L + Math.floor(i / rows) * cw, cy = y + (i % rows) * rh;
    C.save(); C.globalAlpha *= k; C.translate((1 - ex(k)) * 40, 0);
    C.fillStyle = o.tone ? toneC(o.tone) : B.azul; C.beginPath(); C.arc(cx + 30, cy + 20, 30, 0, 7); C.fill();
    txt(String(o.n ?? i + 1), cx + 30, cy + 32, { f: F.d, w: 800, s: 30, al: 'center', c: B.arena });
    txt(o.text, cx + 84, cy + 36, { f: F.b, w: 700, s: fit(o.text, F.b, 700, 54, cw - 110, 30), c: ink });
    if (o.sub) txt(o.sub, cx + 84, cy + 82, { f: F.b, w: 400, s: fit(o.sub, F.b, 400, 34, cw - 110, 22), c: sub2(s), a: seg(t, tc + .3, tc + .8) });
    C.restore();
  });
};

R.compare = (s, t) => {
  const ink = inkOf(s); const y = header(s, t) + 20, cards = s.items || [], n = cards.length || 1, gap = 40;
  const w = (CW - gap * (n - 1)) / n, h = Math.min(430, 870 - y);
  cards.forEach((c, i) => {
    const tc = cueOf(c, s.t0 + 1 + i * 1.2), k = seg(t, tc, tc + .5); if (k <= 0) return;
    const x = L + i * (w + gap);
    C.save(); C.globalAlpha *= k; C.translate(0, (1 - ex(k)) * 40);
    rr(x, y, w, h, 26); C.fillStyle = c.highlight ? B.azul : 'rgba(255,255,255,.42)'; C.fill();
    if (!c.highlight) { C.strokeStyle = B.negro; C.lineWidth = 2; C.stroke(); }
    const fg = c.highlight ? B.arena : B.negro;
    txt(String(c.label || '').toUpperCase(), x + 40, y + 70, { f: F.b, w: 500, s: 26, ls: 3, c: fg, a: .8 });
    const vs = String(c.value ?? '');
    txt(vs, x + 40, y + 200, { f: F.d, w: 800, s: fit(vs, F.d, 800, 96, w - 80, 40), c: c.highlight ? B.arena : toneC(c.tone) });
    wrap(c.sub || '', F.b, 500, 34, w - 80).slice(0, 4).forEach((l, j) => txt(l, x + 40, y + 280 + j * 44, { f: F.b, w: 500, s: 34, c: fg, a: .85 }));
    C.restore();
  });
};

// ---- gráfica de línea genérica (también precio de una acción con use_price) ----
function niceStep(r) { const e = Math.pow(10, Math.floor(Math.log10(r || 1))), f = r / e; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * e; }
function pin(t, x, y, m, dir, col, box) {
  const k = seg(t, m.t, m.t + .45); if (k <= 0) return;
  let Ln = m.len || 90; if (dir < 0 && y - Ln - 70 < box.y0 - 60) dir = 1; if (dir > 0 && y + Ln + 60 > 900) Ln = Math.max(30, 900 - y - 60);
  const len = (dir < 0 ? -1 : 1) * Ln;
  C.save(); C.globalAlpha *= k;
  C.strokeStyle = col; C.lineWidth = 2; C.setLineDash([6, 7]); C.beginPath(); C.moveTo(x, y); C.lineTo(x, y + len * ex(k)); C.stroke(); C.setLineDash([]);
  C.fillStyle = B.arena; C.strokeStyle = col; C.lineWidth = 4; C.beginPath(); C.arc(x, y, 10, 0, 7); C.fill(); C.stroke();
  const al = x < L + 180 ? 'left' : x > RX - 180 ? 'right' : 'center', ty = y + len + (dir < 0 ? -40 : 46);
  rise(m.label, x, ty, k, { f: F.d, w: 600, s: 34, al, c: col });
  if (m.sub) rise(m.sub, x, ty + (dir < 0 ? -42 : 38), seg(t, m.t + .15, m.t + .6), { f: F.b, w: 500, s: 24, al, c: '#4a4a4a' });
  C.restore();
}
R.line = (s, t) => {
  const top = header(s, t);
  let series = s.series;
  if (s.use_price) { const pts = (s.sessions ? PS.slice(-s.sessions) : PS).map(p => [p[0], p[1]]); series = [{ name: s.name || D.ticker, points: pts, tone: 'ink' }]; s.prefix = s.prefix ?? '$'; }
  if (!series || !series.length) return;
  const box = { x0: L + 90, x1: RX - (s.legend_right ? 260 : 20), y0: Math.max(top + 30, 420), y1: 820 };
  const all = series.flatMap(sr => sr.points.map(p => p[1]));
  let lo = s.y_min ?? Math.min(...all), hi = s.y_max ?? Math.max(...all); if (s.y_min == null) { const pad = (hi - lo) * .1 || 1; lo = Math.max(lo >= 0 ? 0 : -Infinity, lo - pad); if (s.zero) lo = 0; } hi += (hi - lo) * .08;
  const n = Math.max(...series.map(sr => sr.points.length));
  const px = i => box.x0 + (box.x1 - box.x0) * i / (n - 1), py = v => box.y1 - (v - lo) / (hi - lo) * (box.y1 - box.y0);
  // rejilla
  C.save(); C.strokeStyle = 'rgba(10,10,10,.12)'; C.lineWidth = 2; const step = niceStep((hi - lo) / 4);
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) { const y = py(v); C.beginPath(); C.moveTo(box.x0, y); C.lineTo(box.x1, y); C.stroke();
    txt(fmtV(v, { ...s, decimals: s.axis_decimals ?? (step < 1 ? 1 : 0) }), box.x0 - 16, y + 7, { f: F.b, w: 500, s: 22, al: 'right', c: 'rgba(10,10,10,.5)' }); }
  C.restore();
  const p0 = series[0].points, xl = s.x_labels || [0, Math.floor((n - 1) / 2), n - 1];
  xl.forEach(i => p0[i] && txt(s.x_fmt === 'raw' ? String(p0[i][0]) : fmtD(p0[i][0]), px(i), box.y1 + 38, { f: F.b, w: 500, s: 22, al: 'center', c: '#4a4a4a' }));
  const t0 = cueT(s, 'cue_draw', .6), t1 = Math.min(s.t1 - .6, typeof s.cue_end === 'number' ? s.cue_end : t0 + Math.max(2.5, (s.t1 - s.t0) * .55));
  series.forEach((sr, si) => {
    const st = typeof sr.cue === 'number' ? sr.cue : t0 + si * .4, p = (n - 1) * eio(seg(t, st, Math.max(st + 1.5, t1)));
    if (t < st) return;
    const vals = sr.points.map(q => q[1]), m = Math.floor(p), fr = p - m, col = toneC(sr.tone || (si ? 'blue' : 'ink'));
    if (si === 0 && series.length === 1) { const g = C.createLinearGradient(0, box.y0, 0, box.y1); g.addColorStop(0, 'rgba(65,115,209,.32)'); g.addColorStop(1, 'rgba(65,115,209,0)');
      C.beginPath(); C.moveTo(px(0), box.y1); for (let i = 0; i <= m; i++) C.lineTo(px(i), py(vals[i]));
      const hx = m < n - 1 ? lerp(px(m), px(m + 1), fr) : px(m), hy = m < n - 1 ? lerp(py(vals[m]), py(vals[m + 1]), fr) : py(vals[m]);
      C.lineTo(hx, hy); C.lineTo(hx, box.y1); C.closePath(); C.fillStyle = g; C.fill(); }
    C.lineCap = 'round'; C.lineJoin = 'round'; C.strokeStyle = col; C.lineWidth = sr.thick || 5; C.beginPath(); C.moveTo(px(0), py(vals[0]));
    for (let i = 1; i <= m; i++) C.lineTo(px(i), py(vals[i]));
    let hx = px(m), hy = py(vals[m]); if (m < n - 1 && m + 1 < vals.length) { hx = lerp(px(m), px(m + 1), fr); hy = lerp(py(vals[m]), py(vals[m + 1]), fr); C.lineTo(hx, hy); }
    C.stroke();
    C.fillStyle = col; C.beginPath(); C.arc(hx, hy, 9, 0, 7); C.fill();
    if (sr.name && series.length > 1) txt(sr.name + (sr.end_label ? '  ' + sr.end_label : ''), hx + 16, hy + 8, { f: F.b, w: 700, s: 26, c: col, a: seg(t, st + .3, st + .8) });
  });
  (s.annotations || []).forEach(a => {
    const sr = series[a.series || 0], i = a.i ?? Math.max(0, sr.points.findIndex(q => String(q[0]) >= String(a.date)));
    const v = sr.points[i][1]; pin(t, px(i), py(v), { ...a, t: cueOf(a, s.t0 + 2) }, a.dir || (v > (hi + lo) / 2 ? 1 : -1), toneC(a.tone), box);
  });
};

R.bars = (s, t) => {
  const ink = inkOf(s); const top = header(s, t);
  let items = s.items;
  if (!items && (s.quarters || D.quarterly)) { const Q = (s.quarters || D.quarterly).slice(-(s.count || 6));
    items = Q.map(q => { const d = new Date(q.period + 'T00:00:00Z'); return { label: `T${Math.floor(d.getUTCMonth() / 3) + 1} '${String(d.getUTCFullYear()).slice(2)}`, value: q.revenue / 1e9, value2: q.net_income / 1e9 }; });
    s.legend = s.legend || ['Ingresos', 'Utilidad neta']; s.prefix = s.prefix ?? '$'; s.suffix = s.suffix ?? ' B'; }
  if (!items) return;
  const pair = items.some(i => i.value2 != null), stack = !!s.stack;
  const maxv = Math.max(...items.map(i => stack ? (i.value || 0) + (i.value2 || 0) : Math.max(i.value || 0, i.value2 || 0)));
  const x0 = L + 40, x1 = RX - 40, base = 820, topY = Math.max(top + 70, 450), gw = (x1 - x0) / items.length, bw = Math.min(110, gw * (pair && !stack ? .3 : .5));
  if (s.legend) [[B.azul, s.legend[0]], [stack ? B.mostaza : B.negro, s.legend[1]]].forEach(([c, l], i) => { if (!l) return; const k = seg(t, s.t0 + .6 + i * .3, s.t0 + 1 + i * .3);
    C.save(); C.globalAlpha *= k; C.fillStyle = c; rr(RX - 520 + i * 270, 196, 28, 28, 7); C.fill(); txt(l, RX - 480 + i * 270, 220, { f: F.b, w: 700, s: 28, c: ink }); C.restore(); });
  C.fillStyle = ink; C.fillRect(x0 - 20, base, x1 - x0 + 40, 2);
  items.forEach((it, i) => {
    const cx = x0 + gw * (i + .5), tc = cueOf(it, cueT(s, 'cue_bars', .9) + i * (s.stagger ?? .18)), k = eo(seg(t, tc, tc + .7));
    const h1 = (it.value || 0) / maxv * (base - topY) * k, h2 = (it.value2 || 0) / maxv * (base - topY) * k;
    const c1 = it.tone ? toneC(it.tone) : B.azul;
    if (stack) { C.fillStyle = c1; rr(cx - bw / 2, base - h1, bw, h1, 0); C.fill(); C.fillStyle = B.mostaza; rr(cx - bw / 2, base - h1 - h2, bw, h2, [10, 10, 0, 0]); C.fill();
      if (k > .9) txt(fmtV((it.value || 0) + (it.value2 || 0), s), cx, base - h1 - h2 - 16, { f: F.b, w: 700, s: 26, al: 'center', c: ink }); }
    else if (pair) { C.fillStyle = c1; rr(cx - bw - 5, base - h1, bw, h1, [10, 10, 0, 0]); C.fill(); C.fillStyle = (it.value2 || 0) < 0 ? B.terracota : B.negro; rr(cx + 5, base - Math.abs(h2), bw, Math.abs(h2), [10, 10, 0, 0]); C.fill();
      if (k > .9) { txt(fmtV(it.value, s), cx - bw / 2 - 5, base - h1 - 14, { f: F.b, w: 700, s: 22, al: 'center', c: B.azul }); txt(fmtV(it.value2, s), cx + bw / 2 + 5, base - Math.abs(h2) - 14, { f: F.b, w: 700, s: 22, al: 'center', c: ink }); } }
    else { C.fillStyle = c1; rr(cx - bw / 2, base - h1, bw, h1, [12, 12, 0, 0]); C.fill(); if (k > .9) txt(it.display || fmtV(it.value, s), cx, base - h1 - 16, { f: F.d, w: 600, s: 30, al: 'center', c: it.tone ? c1 : ink }); }
    txt(it.label, cx, base + 42, { f: F.b, w: 500, s: fit(it.label, F.b, 500, 26, gw - 10, 16), al: 'center', c: '#4a4a4a', a: seg(t, s.t0 + .5, s.t0 + 1) });
  });
};

R.cascade = (s, t) => {
  const top = header(s, t), items = s.items || []; if (!items.length) return;
  const maxv = Math.max(...items.map(i => Math.abs(i.value))), x0 = L + 40, x1 = RX - 40, base = 820, topY = Math.max(top + 60, 440);
  const gw = (x1 - x0) / items.length, bw = gw * .58, sc = v => v / maxv * (base - topY);
  let level = 0;
  items.forEach((it, i) => {
    const tc = cueOf(it, cueT(s, 'cue_bars', 1) + i * .9), k = eo(seg(t, tc, tc + .6)), cx = x0 + gw * (i + .5);
    let ya, yb, col;
    if (it.kind === 'total' || i === 0) { level = it.value; ya = base - sc(it.value) * k; yb = base; col = i === 0 ? B.azul : B.musgo; }
    else { const prev = level; level = prev - Math.abs(it.value); ya = base - sc(prev); yb = ya + sc(Math.abs(it.value)) * k; col = B.terracota; }
    if (k <= 0) return;
    C.fillStyle = col; rr(cx - bw / 2, ya, bw, Math.max(2, yb - ya), 8); C.fill();
    if (i < items.length - 1) { C.strokeStyle = 'rgba(10,10,10,.35)'; C.setLineDash([5, 6]); C.lineWidth = 2; const yl = it.kind === 'total' || i === 0 ? ya : yb;
      C.beginPath(); C.moveTo(cx + bw / 2, yl); C.lineTo(cx + gw - bw / 2, yl); C.stroke(); C.setLineDash([]); }
    txt((it.kind === 'total' || i === 0 ? '' : '−') + fmtV(Math.abs(it.value), s), cx, ya - 16, { f: F.d, w: 600, s: 28, al: 'center', c: col, a: seg(t, tc + .3, tc + .7) });
    txt(it.label, cx, base + 42, { f: F.b, w: 500, s: fit(it.label, F.b, 500, 24, gw - 8, 15), al: 'center', c: '#3a3a3a', a: seg(t, tc, tc + .4) });
  });
};

R.donut = (s, t) => {
  const ink = inkOf(s); const top = header(s, t), sl = s.slices || [], tot = sl.reduce((a, b) => a + b.value, 0) || 1;
  const cx = L + 330, cy = Math.max(top + 230, 600), r = 230, k = eio(seg(t, cueT(s, 'cue_donut', .8), cueT(s, 'cue_donut', .8) + 1.6));
  const pal = [B.azul, B.mostaza, B.musgo, B.terracota, B.negro]; let a0 = -Math.PI / 2;
  sl.forEach((x, i) => { const a1 = a0 + x.value / tot * Math.PI * 2 * k; C.beginPath(); C.arc(cx, cy, r, a0, a1); C.arc(cx, cy, r * .58, a1, a0, true); C.closePath();
    C.fillStyle = x.tone ? toneC(x.tone) : pal[i % pal.length]; C.fill(); a0 = a1 + .0; });
  if (s.center) txt(s.center, cx, cy + 22, { f: F.d, w: 800, s: fit(s.center, F.d, 800, 64, r * 1.05), al: 'center', c: ink, a: seg(t, s.t0 + 1.4, s.t0 + 2) });
  sl.forEach((x, i) => { const tc = cueOf(x, s.t0 + 1 + i * .5), kk = seg(t, tc, tc + .4); if (kk <= 0) return; const y = cy - 170 + i * (360 / Math.max(1, sl.length - 1 || 1));
    C.save(); C.globalAlpha *= kk; C.fillStyle = x.tone ? toneC(x.tone) : pal[i % pal.length]; rr(L + 720, y - 30, 36, 36, 9); C.fill();
    txt(x.label, L + 780, y, { f: F.b, w: 700, s: 40, c: ink }); txt(x.display || (Math.round(x.value / tot * 100) + '%'), RX, y, { f: F.d, w: 800, s: 44, al: 'right', c: ink });
    C.restore(); });
};

R.metric = (s, t) => {
  kicker(s.kicker || 'Métrica', L, 214, s.t0 + .1, t, B.negro);
  rise(s.label, L, 360, seg(t, s.t0 + .2, s.t0 + .8), { f: F.d, w: 800, s: fit(s.label, F.d, 800, 110, 760) });
  if (s.fullname) rise(s.fullname, L, 420, seg(t, s.t0 + .35, s.t0 + .9), { f: F.b, w: 500, s: 36, c: '#3a3a3a' });
  const tv = cueT(s, 'cue_value', .7), k = eo(seg(t, tv, tv + 1.1));
  txt((s.prefix || '') + fmtNum((s.value || 0) * k, s.decimals ?? 1) + (s.suffix || ''), L, 640, { f: F.d, w: 800, s: 190, c: B.azul, a: seg(t, tv - .1, tv + .25) });
  if (s.explain) { const te = cueT(s, 'cue_explain', 1.6); riseLines(wrap(s.explain, F.b, 500, 42, 760), L, 730, 54, te, t, { f: F.b, w: 500, s: 42 }); }
  const sc = s.scale; if (!sc) return;
  const gx0 = 1020, gx1 = RX - 20, gy = 560, X_ = v => gx0 + (gx1 - gx0) * cl((v - sc.min) / (sc.max - sc.min));
  const tg = cueT(s, 'cue_gauge', 2.2), kg = seg(t, tg, tg + .6); if (kg <= 0) return;
  C.save(); C.globalAlpha *= kg;
  (sc.bands || []).forEach((b, i) => { const xa = X_(b[0]), xb = X_(b[1]); C.fillStyle = b[3] ? toneC(b[3]) : [B.musgo, B.mostaza, B.terracota][i % 3];
    rr(xa + 3, gy - 10, (xb - xa - 6) * ex(kg), 20, 10); C.fill(); txt(b[2], (xa + xb) / 2, gy + 62, { f: F.b, w: 700, s: 28, al: 'center', c: '#3a3a3a' }); });
  if (sc.ref) { const xr = X_(sc.ref.value); C.fillStyle = B.negro; C.fillRect(xr - 1.5, gy - 34, 3, 68); txt(sc.ref.label, xr, gy - 50, { f: F.b, w: 500, s: 24, al: 'center', c: '#3a3a3a' }); }
  const tm = tg + .5, km = eio(seg(t, tm, tm + 1.3)), xm = lerp(gx0, X_(s.value), km);
  C.fillStyle = B.negro; C.beginPath(); C.moveTo(xm, gy - 22); C.lineTo(xm - 18, gy - 52); C.lineTo(xm + 18, gy - 52); C.closePath(); C.fill();
  C.fillStyle = B.arena; C.strokeStyle = B.negro; C.lineWidth = 5; C.beginPath(); C.arc(xm, gy, 20, 0, 7); C.fill(); C.stroke();
  if (s.verdict && km > .98) rise(s.verdict, gx0, 740, seg(t, tm + 1.3, tm + 1.8), { f: F.s, w: 400, s: 70, c: toneC(s.verdict_tone || 'blue') });
  C.restore();
};

R.quote = (s, t) => {
  const ink = B.arena, size = s.size || 70, ls = wrap('“' + s.text + '”', F.s, 400, size, 1500), lh = size * 1.15;
  const y0 = 470 - (ls.length - 1) * lh / 2;
  riseLines(ls, 960, y0, lh, s.t0 + .2, t, { f: F.s, w: 400, s: size, al: 'center', c: ink }, .12);
  const ta = s.t0 + .6 + ls.length * .12;
  if (s.author) rise('— ' + s.author, 960, y0 + ls.length * lh + 30, seg(t, ta, ta + .6), { f: F.d, w: 600, s: 34, al: 'center', c: B.mostaza });
  if (s.source) rise(s.source, 960, y0 + ls.length * lh + 80, seg(t, ta + .2, ta + .8), { f: F.b, w: 500, s: 28, al: 'center', c: ink, a: .75 });
};

R.formula = (s, t) => {
  const ink = inkOf(s); kicker(s.kicker, L, 260, s.t0 + .1, t, ink);
  const parts = (s.parts || []).map(p => typeof p === 'string' ? { t: p } : p), size = s.size || 120;
  const sizes = parts.map(p => (p.op ? .7 : 1) * size), wsum = parts.reduce((a, p, i) => a + tw(p.t, F.d, 800, sizes[i]), 0) + 40 * (parts.length - 1);
  const k0 = Math.min(1, (CW) / wsum); let x = 960 - wsum * k0 / 2;
  let prevT = s.t0 + .4;
  parts.forEach((p, i) => { const tc = p.op ? prevT + .25 : cueOf(p, s.t0 + .4 + i * .45); prevT = tc; const k = seg(t, tc, tc + .45), sz = sizes[i] * k0, w = tw(p.t, F.d, 800, sz);
    const col = p.tone ? toneC(p.tone) : p.op ? (themeOf(s) === 'blue' ? 'rgba(235,230,186,.6)' : '#7a7a7a') : i === parts.length - 1 ? (themeOf(s) === 'blue' ? B.mostaza : B.azul) : ink;
    rise(p.t, x, 540, k, { f: F.d, w: 800, s: sz, c: col }); x += w + 40 * k0; });
  if (s.sub) { const ts = cueT(s, 'cue_sub', .6 + parts.length * .45); riseLines(wrap(s.sub, F.b, 500, 44, CW), 960, 680, 56, ts, t, { f: F.b, w: 500, s: 44, al: 'center', c: sub2(s) }); }
};

R.timeline = (s, t) => {
  const ink = inkOf(s); header(s, t); const ev = s.events || [], n = ev.length, y = 610, x0 = L + 60, x1 = RX - 60;
  const kl = seg(t, s.t0 + .5, s.t0 + 1.4); C.fillStyle = ink; C.fillRect(x0, y - 2, (x1 - x0) * eio(kl), 4);
  ev.forEach((e, i) => { const x = n > 1 ? x0 + (x1 - x0) * i / (n - 1) : (x0 + x1) / 2, tc = cueOf(e, s.t0 + 1 + i * 1.2), k = seg(t, tc, tc + .5); if (k <= 0) return;
    const up = i % 2 === 0, col = toneC(e.tone || 'blue'), al = i === 0 ? 'left' : i === n - 1 ? 'right' : 'center', tx = x + (al === 'left' ? -20 : al === 'right' ? 20 : 0);
    C.save(); C.globalAlpha *= k; C.fillStyle = B.arena; C.strokeStyle = col; C.lineWidth = 5; C.beginPath(); C.arc(x, y, 16 * back(k), 0, 7); C.fill(); C.stroke();
    txt(e.date, tx, up ? y - 110 : y + 80, { f: F.d, w: 800, s: 34, al, c: col });
    wrap(e.label, F.b, 700, 30, 360).slice(0, 2).forEach((l, j) => txt(l, tx, (up ? y - 70 : y + 120) + j * 36, { f: F.b, w: 700, s: 30, al, c: ink }));
    if (e.sub) txt(e.sub, tx, up ? y - 146 : y + 196, { f: F.b, w: 400, s: 24, al, c: sub2(s) });
    C.restore(); });
};

R.table = (s, t) => {
  const ink = inkOf(s); const top = header(s, t) + 10, hd = s.headers || [], rows = s.rows || [], nc = Math.max(hd.length, ...rows.map(r => r.length));
  const cw = CW / nc, rh = Math.min(84, (870 - top - 70) / Math.max(1, rows.length));
  const kh = seg(t, s.t0 + .5, s.t0 + 1);
  hd.forEach((h, j) => txt(String(h).toUpperCase(), L + j * cw + (j ? cw - 20 : 0), top + 30, { f: F.b, w: 500, s: 24, ls: 3, al: j ? 'right' : 'left', c: ink, a: kh * .7 }));
  C.fillStyle = ink; C.fillRect(L, top + 52, CW * ex(kh), 2);
  rows.forEach((r, i) => { const tc = (s.row_cues && typeof s.row_cues[i] === 'number') ? s.row_cues[i] : s.t0 + 1 + i * .5, k = seg(t, tc, tc + .4); if (k <= 0) return;
    const y = top + 52 + rh * (i + 1) - rh * .32, hl = s.highlight === i;
    C.save(); C.globalAlpha *= k; if (hl) { rr(L - 16, y - rh * .72, CW + 32, rh * .95, 14); C.fillStyle = 'rgba(199,163,23,.25)'; C.fill(); }
    r.forEach((c, j) => txt(String(c), L + j * cw + (j ? cw - 20 : 0), y, { f: j ? F.d : F.b, w: j ? 600 : 700, s: j ? 34 : 34, al: j ? 'right' : 'left', c: ink }));
    C.restore(); });
};

R.news = (s, t) => {
  const ink = inkOf(s); let y = header(s, t, { kicker: 'La noticia' }) + 30;
  (s.bullets || []).forEach((b, i) => {
    const tc = cueOf(b, s.t0 + 1.2 + i * 1.2), k = seg(t, tc, tc + .5); if (k <= 0) return;
    C.save(); C.globalAlpha *= k; C.translate((1 - ex(k)) * 40, 0);
    C.fillStyle = b.tone ? toneC(b.tone) : B.azul; C.beginPath(); C.arc(L + 26, y - 14, 26, 0, 7); C.fill();
    txt(String(i + 1), L + 26, y - 3, { f: F.d, w: 800, s: 26, al: 'center', c: B.arena });
    txt(b.text, L + 80, y, { f: F.b, w: 700, s: fit(b.text, F.b, 700, 44, CW - 100, 28), c: ink });
    if (b.sub) txt(b.sub, L + 80, y + 44, { f: F.b, w: 400, s: 32, c: sub2(s), a: seg(t, tc + .3, tc + .8) });
    C.restore(); y += b.sub ? 120 : 84;
  });
  if (s.source) txt('Fuente: ' + s.source, L, 868, { f: F.b, w: 500, s: 24, c: sub2(s), a: seg(t, s.t0 + 1, s.t0 + 1.5) });
};

R.catalyst = (s, t) => {
  const ink = B.arena; kicker(s.kicker || 'Lo que viene', L, 300, s.t0 + .1, t, ink);
  const td = cueT(s, 'cue_date', .5), k = seg(t, td, td + .7);
  if (k > 0) { C.save(); C.globalAlpha *= k; rr(L, 360, 760, 300, 28); C.strokeStyle = ink; C.lineWidth = 4; C.stroke();
    C.save(); C.beginPath(); C.rect(L, 360, 760, 300); C.clip(); const size = fit(s.date, F.d, 800, 180, 680, 80);
    txt(s.date, L + 380, 510 + size * .36 + (1 - ex(k)) * 200, { f: F.d, w: 800, s: size, al: 'center', c: ink }); C.restore(); C.restore(); }
  if (s.label) rise(s.label, 980, 480, seg(t, td + .4, td + 1), { f: F.d, w: 600, s: 56, c: ink });
  if (s.sub) riseLines(wrap(s.sub, F.b, 500, 40, 780), 980, 560, 52, td + .7, t, { f: F.b, w: 500, s: 40, c: ink });
};

R.outro = (s, t) => {
  const ink = B.arena, ta = cueT(s, 'cue_a', .3), tb = cueT(s, 'cue_b', 1.2);
  rise(s.question_a || '', 960, 300, seg(t, ta - .1, ta + .5), { f: F.s, w: 400, s: fit(s.question_a || '', F.s, 400, 120, CW), al: 'center', c: ink });
  rise(s.question_b || '', 960, 430, seg(t, tb - .1, tb + .5), { f: F.s, w: 400, s: fit(s.question_b || '', F.s, 400, 120, CW), al: 'center', c: B.mostaza });
  const tl = tb + .9;
  rise(V.brand.tagline, 960, 530, seg(t, tl, tl + .6), { f: F.s, w: 400, s: 48, al: 'center', c: ink });
  const kc = seg(t, tl + .4, tl + 1);
  if (kc > 0) { const label = s.cta || 'Suscríbete para el próximo video', w = tw(label, F.b, 700, 38) + 90;
    C.save(); C.globalAlpha *= kc; scaleAt(960, 630, .9 + .1 * back(kc)); rr(960 - w / 2, 584, w, 92, 46); C.fillStyle = ink; C.fill();
    txt(label, 960, 643, { f: F.b, w: 700, s: 38, al: 'center', c: B.azul }); C.restore(); }
  const kd = seg(t, tl + .8, tl + 1.3);
  txt(V.brand.handle, 960, 740, { f: F.d, w: 600, s: 38, al: 'center', c: ink, a: kd });
  txt((V.brand.name || '').toUpperCase() + (V.brand.byline ? '  ·  ' + V.brand.byline.toUpperCase() : ''), 960, 784, { f: F.d, w: 800, s: 20, ls: 4, al: 'center', c: B.mostaza, a: kd });
  txt(s.sources ? 'Fuentes: ' + s.sources : '', 960, 832, { f: F.b, w: 400, s: 24, al: 'center', c: ink, a: kd * .85 });
  txt(V.brand.disclaimer, 960, 866, { f: F.b, w: 400, s: 24, al: 'center', c: ink, a: kd * .85 });
};

R.personal = (s, t) => {   // pantalla en primera persona (presentación de JP o pregunta a la audiencia); se narra como las demás
  const ink = B.arena; kicker(s.kicker || 'En primera persona', L, 330, s.t0 + .1, t, ink);
  const ls = wrap(s.title || '', F.s, 400, 120, CW); riseLines(ls, L, 470, 128, s.t0 + .2, t, { f: F.s, w: 400, s: 120, c: ink });
  if (s.sub) rise(s.sub, L, 470 + ls.length * 128, seg(t, s.t0 + .7, s.t0 + 1.3), { f: F.b, w: 500, s: 44, c: B.mostaza });
};

// Foto real. layout: "full" (pantalla completa con texto abajo a la izquierda) · "split" (texto a la izquierda, foto a la derecha)
// · "logo" (logo en ficha blanca a la derecha). Campos: image, kicker, title, caption, credit, focus [fx, fy], cue_title, cue_caption.
R.photo = (s, t) => {
  const im = img(s.image), [fx, fy] = focus(s), lay = s.layout || 'full';
  if (lay === 'full') {
    const tall = im && im.naturalWidth / im.naturalHeight < 1.15;
    if (im && tall) { // foto vertical o cuadrada: completa a la derecha sobre la misma foto desenfocada
      C.save(); C.filter = 'blur(36px) brightness(.5)'; cover(im, -80, -80, W + 160, H + 160, 1.1, fx, fy); C.restore();
      const pw = Math.min(900, 860 * im.naturalWidth / im.naturalHeight); C.save(); rr(RX - pw, 40, pw, 840, 24); C.clip(); cover(im, RX - pw, 40, pw, 840, kb(s, t), fx, fy); C.restore();
    } else if (im) { C.save(); C.filter = 'saturate(.95) contrast(1.04)'; cover(im, 0, 0, W, H, kb(s, t), fx, fy); C.restore(); }
    let g = C.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, 'rgba(10,10,10,.5)'); g.addColorStop(1, 'rgba(10,10,10,0)'); C.fillStyle = g; C.fillRect(0, 0, W, 200);
    g = C.createLinearGradient(0, 480, 0, H); g.addColorStop(0, 'rgba(10,10,10,0)'); g.addColorStop(.5, 'rgba(10,10,10,.7)'); g.addColorStop(1, 'rgba(10,10,10,.9)'); C.fillStyle = g; C.fillRect(0, 480, W, H - 480);
    const ink = B.arena, size = s.size || 70, tl = wrap(s.title || '', F.d, 800, size, tall ? 820 : 1300), lh = size * 1.15;
    const y0 = 800 - (tl.length - 1) * lh - (s.caption ? 64 : 0);
    if (s.kicker) kicker(s.kicker, L, y0 - size - 24, s.t0 + .2, t, ink);
    riseLines(tl, L, y0, lh, cueT(s, 'cue_title', .35), t, { f: F.d, w: 800, s: size, c: ink });
    if (s.caption) rise(s.caption, L, y0 + (tl.length - 1) * lh + 70, seg(t, cueT(s, 'cue_caption', .8), cueT(s, 'cue_caption', .8) + .6), { f: F.s, w: 400, s: 54, c: B.mostaza });
    credit(s, s.image, RX, 900, ink, 'right', .7 * seg(t, s.t0 + .5, s.t0 + 1));
  } else if (lay === 'split') {
    const k = seg(t, s.t0 + .15, s.t0 + .9), x0 = 1000, w = RX - x0;
    if (im) { C.save(); rr(x0, 150, w, 720 * ex(k), 28); C.clip(); cover(im, x0, 150, w, 720, kb(s, t), fx, fy); C.restore(); }
    credit(s, s.image, RX, 900, '#4a4a4a', 'right', .8 * k);
    kicker(s.kicker, L, 250, s.t0 + .1, t, B.negro);
    const size = s.size || 64, tl = wrap(s.title || '', F.d, 800, size, 780);
    riseLines(tl, L, 360, size * 1.16, cueT(s, 'cue_title', .2), t, { f: F.d, w: 800, s: size });
    if (s.caption) riseLines(wrap(s.caption, F.b, 500, 38, 760), L, 360 + tl.length * size * 1.16 + 40, 52, cueT(s, 'cue_caption', .8), t, { f: F.b, w: 500, s: 38, c: '#3a3a3a' });
  } else { // logo
    const k = seg(t, s.t0 + .15, s.t0 + .8);
    if (im && k > 0) { C.save(); C.globalAlpha *= k; scaleAt(1390, 500, .88 + .12 * back(k));
      // logos PNG transparentes directo sobre el fondo (JP, 8 nov 2026); ficha blanca solo si el logo se perdería en la arena
      if (s.logo_card || logoLight(s.image, im)) { rr(1040, 230, 700, 540, 44); C.fillStyle = '#FFFFFF'; C.fill(); contain(im, 1110, 300, 560, 400); }
      else contain(im, 1060, 250, 660, 500);
      C.restore(); }
    kicker(s.kicker, L, 330, s.t0 + .1, t, B.negro);
    const size = s.size || 72, tl = wrap(s.title || '', F.d, 800, size, 820);
    riseLines(tl, L, 450, size * 1.16, cueT(s, 'cue_title', .3), t, { f: F.d, w: 800, s: size });
    if (s.caption) riseLines(wrap(s.caption, F.b, 500, 38, 800), L, 450 + tl.length * size * 1.16 + 40, 52, cueT(s, 'cue_caption', .8), t, { f: F.b, w: 500, s: 38, c: '#3a3a3a' });
  }
};

// ---------------- teleprompter ----------------
function teleprompter(t) {
  const CAPS = V.captions || []; let ci = -1;
  for (let i = 0; i < CAPS.length; i++) if (t >= CAPS[i][0][0] - .45) ci = i;   // aparece ~0.45 s antes para leer con calma
  if (ci < 0) return;
  const c = CAPS[ci], nx = CAPS[ci + 1];
  const gapEnd = nx ? nx[0][0] - .45 : c[c.length - 1][1] + 1.2; if (t > Math.max(gapEnd, c[c.length - 1][1] + .2) && !nx) return;
  const a = seg(t, c[0][0] - .45, c[0][0] - .2);
  const words = c.map(w => w[2]), line = words.join(' ');
  let S_ = 52; while (tw(line, F.b, 700, S_) > CW - 80 && S_ > 30) S_ -= 2;
  const gap = tw(' ', F.b, 700, S_), ws = words.map(w => tw(w, F.b, 700, S_)), total = ws.reduce((p, q) => p + q, 0) + gap * (words.length - 1);
  X.save(); X.globalAlpha = Math.max(a, ci > 0 ? 1 : a);
  rr(L, TP_Y, CW, TP_H, 30); C.fillStyle = 'rgba(10,10,10,.86)'; C.fill();
  let x = 960 - total / 2; const y = TP_Y + 62;
  c.forEach((w, i) => { const on = t >= w[0] - .04, cur = on && t < w[1] + .06;
    txt(w[2], x, y, { f: F.b, w: 700, s: S_, c: cur ? B.mostaza : on ? B.arena : 'rgba(235,230,186,.55)' }); x += ws[i] + gap; });
  // con voz real (novoice === false) se muestra solo el subtítulo, sin la siguiente frase
  if (nx && V.novoice !== false) { const nl = nx.map(w => w[2]).join(' '); txt(nl, 960, TP_Y + 106, { f: F.b, w: 500, s: fit(nl, F.b, 500, 30, CW - 120, 18), al: 'center', c: 'rgba(235,230,186,.5)' }); }
  X.restore();
}

// ---------------- miniatura ----------------
function renderThumb() {
  const T = V.thumbnail || {}; C = X; X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1;
  const th = T.theme || 'blue', ink = th === 'blue' ? B.arena : B.negro, em = th === 'blue' ? B.mostaza : B.azul;
  bg({ type: 'thumb', theme: th, t0: 0, t1: 1, bg_image: T.bg_image, focus: T.focus }, 0);
  const lg = logoTint(ink); if (lg) X.drawImage(lg, 90, 70, 130, 114);
  txt('FINANCE', 240, 128, { f: F.d, w: 800, s: 34, ls: 8, c: ink }); txt(V.brand.byline || '', 240, 168, { f: F.b, w: 500, s: 30, c: ink, a: .75 });
  const lines = (T.lines || [T.text || '']).slice(0, 3), emw = (T.emphasis || '').toLowerCase();
  const maxW = T.big ? 1060 : 1720;
  let size = T.size || 190; for (const l of lines) size = Math.min(size, fit(l, F.d, 800, size, maxW, 70));
  const lh = size * 1.3, y0 = 560 - (lines.length - 1) * lh / 2 + size * .35;
  lines.forEach((l, i) => { const isE = emw && l.toLowerCase().includes(emw);
    txt(l, 100, y0 + i * lh, { f: isE ? F.s : F.d, w: isE ? 400 : 800, s: isE ? size * 1.45 : size, c: isE ? em : ink }); });
  if (T.big) { const col = T.big_tone === 'down' ? B.terracota : T.big_tone === 'up' ? B.musgo : B.mostaza;
    X.save(); X.translate(1530, 560); X.rotate(-.06); rr(-300, -200, 600, 400, 40); X.fillStyle = col; X.fill();
    txt(T.big, 0, 60, { f: F.d, w: 800, s: fit(T.big, F.d, 800, 230, 540, 60), al: 'center', c: th === 'blue' ? B.negro : B.arena });
    if (T.big_sub) txt(T.big_sub, 0, 145, { f: F.b, w: 700, s: fit(T.big_sub, F.b, 700, 46, 540, 26), al: 'center', c: th === 'blue' ? B.negro : B.arena }); X.restore(); }
  X.save(); X.globalAlpha = .05; X.globalCompositeOperation = 'multiply'; X.drawImage(grain, 0, 0, W, H); X.restore();
}

// ---------------- composición ----------------
function drawScene(ctx, s, t) {
  C = ctx; C.setTransform(1, 0, 0, 1, 0, 0); C.globalAlpha = 1;
  bg(s, t);
  C.save(); scaleAt(W / 2, H * .42, 1 + .014 * seg(t, s.t0, s.t1));
  (R[s.type] || (() => txt('escena desconocida: ' + s.type, L, 500, { s: 50 })))(s, t);
  C.restore();
  drawHost(s, t);
  chrome(s, t);
}
function renderAt(t) {
  const SC = V.scenes; let i = SC.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = SC.length - 1;
  const s = SC[i], TR = .65, k = i > 0 ? seg(t, s.t0, s.t0 + TR) : 1;
  drawScene(LA.getContext('2d'), s, t);
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1;
  if (k < 1) {
    drawScene(LB.getContext('2d'), SC[i - 1], t);
    X.drawImage(LB, 0, (-ex(k)) * 60);
    const edge = H - eio(k) * (H + 140);
    X.save(); X.beginPath(); X.moveTo(0, H);
    for (let x = 0; x <= W; x += 24) X.lineTo(x, edge + Math.sin(x / 190 + t * 6) * 30 + Math.sin(x / 77) * 8);
    X.lineTo(W, H); X.closePath(); X.clip(); X.drawImage(LA, 0, (1 - eio(k)) * 80); X.restore();
  } else X.drawImage(LA, 0, 0);
  C = X; teleprompter(t); progress(t);
  X.save(); X.globalAlpha = .05; X.globalCompositeOperation = 'multiply'; X.drawImage(grain, 0, 0, W, H); X.restore();
  const fo = seg(t, V.duration - .6, V.duration); if (fo > 0) { X.fillStyle = `rgba(10,10,10,${fo * .9})`; X.fillRect(0, 0, W, H); }
}
window.renderAt = renderAt; window.renderThumb = renderThumb; window.DUR = V.duration; window.FPS = FPS;
if (!new URLSearchParams(location.search).has('render')) { const s0 = performance.now();
  (function loop() { renderAt(((performance.now() - s0) / 1000) % V.duration); requestAnimationFrame(loop); })(); }
})();
