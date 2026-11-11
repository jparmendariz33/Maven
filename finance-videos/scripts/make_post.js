#!/usr/bin/env node
/* Publicación de YouTube (pestaña Publicaciones): 3–4 imágenes cuadradas 1080x1080 que cuentan UNA noticia del día.
 *   node scripts/make_post.js videos/<id>          → videos/<id>/post/01.png … + post/publicacion.md (texto y encuesta para copiar)
 * Lee videos/<id>/post.json (ver .claude/skills/publicacion/SKILL.md). JP en 3D sale recortado y chico en la primera y la última imagen.
 */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'];
const dataURL = f => 'data:image/' + (f.toLowerCase().endsWith('.png') ? 'png' : 'jpeg') + ';base64,' + fs.readFileSync(f).toString('base64');

(async () => {
  const vdir = path.resolve(process.argv[2] || ''), pj = path.join(vdir, 'post.json');
  if (!fs.existsSync(pj)) { console.error('Falta ' + pj); process.exit(1); }
  const P = JSON.parse(fs.readFileSync(pj)), out = path.join(vdir, 'post'); fs.mkdirSync(out, { recursive: true });
  const brand = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'brand', 'brand.json')));
  const dj = path.join(vdir, 'data.json'), data = fs.existsSync(dj) ? JSON.parse(fs.readFileSync(dj)) : {};
  const img = r => r && fs.existsSync(path.join(vdir, r)) ? dataURL(path.join(vdir, r)) : null;
  const n = P.slides.length; if (n < 3 || n > 4) console.log(`⚠️  la publicación lleva ${n} imágenes; JP pidió 3 o 4`);
  const b = await chromium.launch({ args: ARGS });
  // 1) JP recortado (un cuadro fijo por imagen que lo lleve)
  const hp = await b.newPage({ viewport: { width: 640, height: 640 } });
  await hp.goto('file://' + path.join(ROOT, 'engine3d', 'host.html') + '?render=1&alpha=1'); await hp.waitForFunction(() => window.ENGINE_READY, null, { timeout: 120000 });
  const logoAbs = P.logo && fs.existsSync(path.join(vdir, P.logo)) ? 'file://' + path.join(vdir, P.logo) : null;
  for (const [i, s] of P.slides.entries()) { if (!s.host) continue;
    const cfg = { seed: path.basename(vdir), ...(P.host || {}), ...(typeof s.host === 'object' ? s.host : {}), logo: logoAbs }; cfg.side = /l$/.test(cfg.pos || 'br') ? 'l' : 'r';
    if (!cfg.act) cfg.act = i === 0 ? 'logo' : 'cierre';
    await hp.evaluate(c => setHost(c), cfg); s._host = await hp.evaluate(() => { renderHost(3.4, 6); return document.getElementById('c').toDataURL('image/png'); }); }
  await hp.close();
  // 2) las imágenes
  const pg = await b.newPage({ viewport: { width: 1080, height: 1080 } }), fonts = path.join(ROOT, 'assets', 'fonts');
  await pg.setContent(`<style>
@font-face{font-family:Unbounded;src:url(file://${fonts}/Unbounded-800.ttf);font-weight:800}@font-face{font-family:Unbounded;src:url(file://${fonts}/Unbounded-600.ttf);font-weight:600}
@font-face{font-family:"Space Grotesk";src:url(file://${fonts}/SpaceGrotesk-500.ttf);font-weight:500}@font-face{font-family:"Space Grotesk";src:url(file://${fonts}/SpaceGrotesk-700.ttf);font-weight:700}
@font-face{font-family:"Instrument Serif";src:url(file://${fonts}/InstrumentSerif-400.ttf);font-style:italic}body{margin:0}</style><canvas id="c" width="1080" height="1080"></canvas>`);
  await pg.goto('file://' + path.join(ROOT, 'engine', 'post.html'));
  await pg.evaluate(async () => { await Promise.all(['800 40px Unbounded', '600 40px Unbounded', '500 40px "Space Grotesk"', '700 40px "Space Grotesk"', 'italic 400 40px "Instrument Serif"'].map(f => document.fonts.load(f))); });
  for (const [i, s] of P.slides.entries()) {
    const payload = { s, i, n, brand, image: img(s.image), logo: img(P.logo), series: s.type === 'grafica' ? (data.series || []) : null, sources: P.sources || '' };
    const png = await pg.evaluate(p => window.drawSlide(p), payload);
    fs.writeFileSync(path.join(out, String(i + 1).padStart(2, '0') + '.png'), Buffer.from(png.split(',')[1], 'base64'));
  }
  await b.close();
  const poll = P.poll ? `\n## Encuesta (publicación aparte, tipo "Encuesta")\n**${P.poll.question}**\n${P.poll.options.map(o => '- ' + o).join('\n')}\n` : '';
  fs.writeFileSync(path.join(out, 'publicacion.md'), `# Publicación · ${P.title || path.basename(vdir)}\n\n## ✅ Texto para copiar y pegar\n\`\`\`\n${P.text || ''}\n\`\`\`\n\nImágenes (en este orden): ${P.slides.map((_, i) => String(i + 1).padStart(2, '0') + '.png').join(', ')}\n${poll}\n## Cómo publicarla\nYouTube → Crear → Crear publicación → Imagen → sube las imágenes en orden → pega el texto → Publicar.\n`);
  console.log(`publicación lista: ${n} imágenes → ${out}`);
})();
