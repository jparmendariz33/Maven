#!/usr/bin/env node
/* Renderiza el video final, cuadros de revisión o la miniatura. Detecta short (1080x1920) o largo (1920x1080)
 * por build/timeline.json → "format".
 *   node scripts/render.js videos/<id>             → short: <TICKER>_short.mp4 · largo: <slug>_largo.mp4
 *   node scripts/render.js videos/<id> --qa        → build/qa.jpg (hoja de contacto)
 *   node scripts/render.js videos/<id> --at 3.5 12 → build/frame_3.5.jpg ...
 *   node scripts/render.js videos/<id> --thumb     → miniatura.jpg (1280x720, solo largos)
 * Largos: se renderizan en paralelo (WORKERS=3 por defecto) y se unen sin recomprimir.
 */
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');

async function openPage(b, vjs, long) {
  const pg = await b.newPage({ viewport: long ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERROR en el motor:', e.message));
  await pg.goto('file://' + path.join(ROOT, 'engine', long ? 'long.html' : 'index.html') + '?render=1&v=' + encodeURIComponent('file://' + vjs));
  await pg.evaluate(() => window.ENGINE_READY);
  await pg.evaluate(() => window.IMAGES_READY);   // fotos y logos incrustados (fetch_images.py)
  await pg.evaluate(async () => { await document.fonts.ready;
    await Promise.all(['800 40px Unbounded', '600 40px Unbounded', '500 40px "Space Grotesk"', '700 40px "Space Grotesk"', '400 40px "Space Grotesk"', 'italic 400 40px "Instrument Serif"'].map(f => document.fonts.load(f)));
    await new Promise(r => setTimeout(r, 300)); });
  return pg;
}
const grab = async (pg, t, q = .95) => Buffer.from((await pg.evaluate(([t, q]) => { renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', q); }, [t, q])).split(',')[1], 'base64');

function encode(out, frames, audio, opts = {}) {
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-'];
  if (audio) args.push('-i', audio);
  args.push('-c:v', 'libx264', '-preset', opts.preset || 'slow', '-crf', String(opts.crf || 20), ...(opts.tune ? ['-tune', opts.tune] : []), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-g', '60');
  if (audio) args.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-movflags', '+faststart', out);
  return spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
}
async function renderRange(b, vjs, long, f0, f1, out, audio, label, opts) {
  const pg = await openPage(b, vjs, long), ff = encode(out, f1 - f0, audio, opts);
  const done = new Promise(r => ff.on('close', r));
  for (let f = f0; f < f1; f++) {
    if (!ff.stdin.write(await grab(pg, f / 30, long ? .92 : .95))) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) process.stdout.write(`\r${label} ${Math.round((f - f0) / (f1 - f0) * 100)}%   `);
  }
  ff.stdin.end(); const code = await done; await pg.close(); return code;
}

(async () => {
  const vdir = path.resolve(process.argv[2] || '');
  const mode = process.argv[3] || 'video';
  const build = path.join(vdir, 'build'), vjs = path.join(build, 'video.js');
  if (!fs.existsSync(vjs)) { console.error('Falta ' + vjs + ' (corre build_timeline.py)'); process.exit(1); }
  const tl = JSON.parse(fs.readFileSync(path.join(build, 'timeline.json'))), long = tl.format === 'long';
  const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });

  if (mode === '--thumb') {
    const pg = await openPage(b, vjs, true);
    // variante opcional: node render.js <dir> --thumb <nombre> '<json con campos de thumbnail>'
    const name = process.argv[4], over = process.argv[5] ? JSON.parse(process.argv[5]) : null;
    const img = Buffer.from((await pg.evaluate((o) => { if (o) window.VIDEO.thumbnail = o; renderThumb(); return document.getElementById('c').toDataURL('image/png'); }, over)).split(',')[1], 'base64');
    const tmp = path.join(build, 'thumb_full.png'); fs.writeFileSync(tmp, img);
    const out = path.join(vdir, name ? `miniatura_${name}.jpg` : 'miniatura.jpg');
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', tmp, '-vf', 'scale=1280:720:flags=lanczos', '-q:v', '2', out]);
    console.log('miniatura: ' + out); await b.close(); return;
  }

  if (mode === '--qa' || mode === '--at') {
    const pg = await openPage(b, vjs, long);
    let times;
    if (mode === '--at') times = process.argv.slice(4).map(Number);
    else { times = []; tl.scenes.forEach(s => { const d = s.t1 - s.t0; times.push(+(s.t0 + Math.min(1.2, d / 2)).toFixed(2)); times.push(+(s.t1 - .7).toFixed(2)); }); }
    const files = [];
    for (const [i, t] of times.entries()) { const f = path.join(build, mode === '--qa' ? `qa_${String(i).padStart(3, '0')}.jpg` : `frame_${t}.jpg`); fs.writeFileSync(f, await grab(pg, t, .85)); files.push(f); }
    if (mode === '--qa') {
      const cols = long ? 4 : 6, per = long ? 24 : 999, sheets = [];
      for (let s0 = 0, k = 0; s0 < files.length; s0 += per, k++) {
        const chunk = files.slice(s0, s0 + per), rows = Math.ceil(chunk.length / cols), list = path.join(build, `qa_list_${k}.txt`);
        chunk.forEach((f, j) => fs.copyFileSync(f, path.join(build, `qs_${String(j).padStart(3, '0')}.jpg`)));
        const out = path.join(build, long ? `qa_${k + 1}.jpg` : 'qa.jpg');
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(build, 'qs_%03d.jpg'), '-vf', `${long ? 'scale=640:360' : 'scale=360:640'},tile=${cols}x${rows}`, '-frames:v', '1', out]);
        fs.readdirSync(build).filter(n => n.startsWith('qs_')).forEach(n => fs.unlinkSync(path.join(build, n))); sheets.push(out);
      }
      files.forEach(f => fs.unlinkSync(f));
      console.log('hojas de revisión:\n' + sheets.join('\n') + (long ? `\n(cada hoja: ${per / 2} escenas, 2 cuadros por escena)` : '  tiempos: ' + times.join(', ')));
    } else console.log(files.join('\n'));
    await b.close(); return;
  }

  const mix = path.join(vdir, 'audio', 'mix.wav');
  const N = Math.round(tl.duration * 30);
  if (!long) {
    const dj = path.join(vdir, 'data.json'), ticker = (fs.existsSync(dj) && JSON.parse(fs.readFileSync(dj)).ticker) || tl.slug || 'video';
    const out = path.join(vdir, `${ticker}_short.mp4`);
    const code = await renderRange(b, vjs, false, 0, N, out, mix, 'render', {});
    console.log(`\r100% → ${out} (ffmpeg ${code})`); await b.close(); return;
  }
  const WORKERS = +(process.env.WORKERS || 3), parts = [], per = Math.ceil(N / WORKERS);
  const t0 = Date.now();
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const bw = w === 0 ? b : await chromium.launch({ args: ['--allow-file-access-from-files'] }), f0 = w * per, f1 = Math.min(N, f0 + per);
    const out = path.join(build, `part_${w}.mp4`); parts[w] = out;
    const code = await renderRange(bw, vjs, true, f0, f1, out, null, `parte ${w + 1}/${WORKERS}`, { preset: 'medium', crf: 25, tune: 'animation' });   // ~50 MB por 9 min: cabe en GitHub (<100 MB)
    if (code !== 0) throw new Error('ffmpeg falló en parte ' + w);
    if (w) await bw.close();
  }));
  const list = path.join(build, 'parts.txt'); fs.writeFileSync(list, parts.map(p => `file '${p}'`).join('\n'));
  const out = path.join(vdir, `${tl.slug || 'video'}_largo.mp4`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-i', mix, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out]);
  parts.forEach(p => fs.unlinkSync(p));
  if (fs.statSync(out).size > 95e6) {   // GitHub no acepta archivos > 100 MB: recomprime una vez más
    const tmp = out.replace('.mp4', '_tmp.mp4');
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', out, '-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', tmp]);
    fs.renameSync(tmp, out); console.log(`\nrecomprimido a ${(fs.statSync(out).size / 1e6).toFixed(0)} MB`); }
  console.log(`\n100% → ${out} (${((Date.now() - t0) / 60000).toFixed(1)} min)`); await b.close();
})();
