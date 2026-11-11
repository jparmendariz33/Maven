#!/usr/bin/env node
/* Renderiza al anfitrión 3D (JP) de las escenas con "host" como RECORTES con fondo transparente (PNG 640x640, 12 cuadros/s).
 * El motor 2D los dibuja encima de la escena, chicos y en una esquina: el protagonista es el tema, no JP.
 *   node engine3d/render_host.js videos/<id>            → build/host/<n>/0000.png ... (solo las escenas que cambiaron)
 *   node engine3d/render_host.js videos/<id> --force    → vuelve a renderizar todas
 *   node engine3d/render_host.js --sheet out.jpg        → hoja de pruebas del personaje (todos los actos y vestuarios)
 * Va DESPUÉS de build_timeline.py (necesita la duración de cada escena) y ANTES de render.js.
 * En el storyboard: "host": {"outfit": ...} a nivel del video (opcional) y "host": {"act": "hook", "mood": "up"} en cada escena.
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const FPS = 12, PAD = .75, JOBS = 3;
const ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'];
const url = 'file://' + path.join(__dirname, 'host.html') + '?render=1&alpha=1';
const engineKey = ['host.js', 'cine.js', 'lib.js', 'host_player.js'].map(f => fs.statSync(path.join(__dirname, f)).size + ':' + crypto.createHash('md5').update(fs.readFileSync(path.join(__dirname, f))).digest('hex').slice(0, 8)).join('|');
async function page() { const b = await chromium.launch({ args: ARGS }), pg = await b.newPage({ viewport: { width: 640, height: 640 } });
  pg.on('pageerror', e => console.log('ERROR en el motor 3D:', e.message)); await pg.goto(url); await pg.waitForFunction(() => window.ENGINE_READY, null, { timeout: 120000 }); return { b, pg }; }
const shotAt = async (pg, lt, d, bg = null) => Buffer.from((await pg.evaluate(([lt, d, bg]) => { renderHost(lt, d, bg); return document.getElementById('c').toDataURL('image/png'); }, [lt, d, bg])).split(',')[1], 'base64');

(async () => {
  if (!fs.existsSync(path.join(__dirname, 'node_modules', 'three'))) execFileSync('npm', ['i', '--silent'], { cwd: __dirname, stdio: 'inherit' });
  if (process.argv[2] === '--sheet') {                    // hoja de pruebas: cada acto al inicio y al final, con vestuarios distintos
    const out = path.resolve(process.argv[3] || 'host_sheet.jpg'), tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'host-'));
    const logo = process.argv[4] ? 'file://' + path.resolve(process.argv[4]) : null;
    const list = [['escritorio', 'up', 'negra', 'ninguno', 'r'], ['escritorio', 'down', 'hoodie', 'reloj', 'l'], ['cafe', 'neutral', 'blazer', 'lentes', 'r'], ['logo', 'up', 'polo', 'ninguno', 'r'], ['logo', 'down', 'negra', 'gorra', 'l'],
      ['senala', 'up', 'sueter', 'audifonos', 'r'], ['senala', 'down', 'blanca', 'ninguno', 'l'], ['piensa', 'neutral', 'negra', 'lentes', 'r'], ['telefono', 'down', 'hoodie', 'ninguno', 'r'], ['camina', 'up', 'blazer', 'ninguno', 'r'], ['cierre', 'neutral', 'negra', 'ninguno', 'r']];
    const { b, pg } = await page(); let n = 0;
    for (const [act, mood, outfit, accessory, side] of list) { await pg.evaluate(c => setHost(c), { act, mood, outfit, accessory, side, prop: 'ninguno', seed: 's', logo });
      for (const lt of [.4, 2.6, 5.4]) fs.writeFileSync(path.join(tmp, String(n++).padStart(3, '0') + '.png'), await shotAt(pg, lt, 6, '#7b8497')); }
    await b.close(); const cols = 9;
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(tmp, '%03d.png'), '-vf', `scale=230:230,tile=${cols}x${Math.ceil(n / cols)}`, '-frames:v', '1', out]); console.log('hoja: ' + out); return;
  }
  const vdir = path.resolve(process.argv[2] || ''), force = process.argv.includes('--force');
  const sb = JSON.parse(fs.readFileSync(path.join(vdir, 'storyboard.json'))), tlp = path.join(vdir, 'build', 'timeline.json');
  if (!fs.existsSync(tlp)) { console.error('Falta build/timeline.json (corre build_timeline.py antes)'); process.exit(1); }
  const tl = JSON.parse(fs.readFileSync(tlp)), jobs = [];
  tl.scenes.forEach((s, i) => { if (!s.host) return; const d = +(s.t1 - s.t0).toFixed(3), n = Math.ceil((d + PAD) * FPS);
    const cfg = { seed: path.basename(vdir), ...(sb.host || {}), ...(typeof s.host === 'object' ? s.host : {}) };
    if (!cfg.act) cfg.act = i === 0 ? 'escritorio' : i === tl.scenes.length - 1 ? 'cierre' : 'senala';
    if (!cfg.mood && s.tone) cfg.mood = s.tone;
    if (!cfg.accent && sb.brand_colors && sb.brand_colors.primary) cfg.accent = sb.brand_colors.primary;
    // lado: el recorte va a la derecha (pos "br", por defecto) o a la izquierda ("bl"); JP mira hacia el centro. Logo: el de la empresa.
    cfg.side = /l$/.test(cfg.pos || 'br') ? 'l' : 'r';
    const firstLogo = (tl.scenes.find(x => x.logo) || {}).logo, lrel = cfg.logo === false ? null : (cfg.logo || firstLogo), la = lrel && fs.existsSync(path.join(vdir, lrel)) ? path.join(vdir, lrel) : null;
    cfg.logo = la ? 'file://' + la : null; cfg._sig = la ? fs.statSync(la).size : 0;
    if (['hook', 'statement', 'catalyst', 'outro'].includes(s.type) && !(s.bg_image && s.bg_full)) console.log(`⚠️  escena ${i + 1} (${s.type}): pon "bg_image" + "bg_full": true con la foto del tema; sin ella JP sale sobre un fondo liso y la escena no dice de qué trata`);
    const dir = path.join(vdir, 'build', 'host', String(i)), key = crypto.createHash('md5').update(JSON.stringify([cfg, d, n, FPS, engineKey])).digest('hex');
    const kf = path.join(dir, 'key.txt'); if (!force && fs.existsSync(kf) && fs.readFileSync(kf, 'utf8') === key) { console.log(`escena ${i + 1}: sin cambios`); return; }
    jobs.push({ i, d, n, cfg, dir, key, kf }); });
  if (!jobs.length) { console.log('anfitrión 3D: nada que renderizar'); return; }
  const s0 = Date.now(); let next = 0;
  await Promise.all(Array.from({ length: Math.min(JOBS, jobs.length) }, async () => { const { b, pg } = await page();
    for (;;) { const j = jobs[next++]; if (!j) break; fs.rmSync(j.dir, { recursive: true, force: true }); fs.mkdirSync(j.dir, { recursive: true });
      const info = await pg.evaluate(c => setHost(c), j.cfg);
      for (let f = 0; f < j.n; f++) fs.writeFileSync(path.join(j.dir, String(f).padStart(4, '0') + '.png'), await shotAt(pg, f / FPS, j.d));
      fs.writeFileSync(j.kf, j.key); console.log(`escena ${j.i + 1}: ${info.act} · ${info.mood} · ${info.look.outfit} + ${info.look.accessory} + ${info.look.prop} → ${j.n} cuadros`); }
    await b.close(); }));
  console.log(`anfitrión 3D listo en ${Math.round((Date.now() - s0) / 1000)} s`);
})();
