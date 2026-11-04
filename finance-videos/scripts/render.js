#!/usr/bin/env node
/* Renderiza el video final o cuadros de revisión.
 *   node scripts/render.js videos/<id>            → videos/<id>/<TICKER>_short.mp4
 *   node scripts/render.js videos/<id> --qa       → videos/<id>/build/qa.jpg (hoja de contacto)
 *   node scripts/render.js videos/<id> --at 3.5 12 → build/frame_3.5.jpg ...
 */
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');

(async () => {
  const vdir = path.resolve(process.argv[2] || '');
  const mode = process.argv[3] || 'video';
  const vjs = path.join(vdir, 'build', 'video.js');
  if (!fs.existsSync(vjs)) { console.error('Falta ' + vjs + ' (corre build_timeline.py)'); process.exit(1); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERROR en el motor:', e.message));
  await pg.goto('file://' + path.join(ROOT, 'engine', 'index.html') + '?render=1&v=' + encodeURIComponent('file://' + vjs));
  await pg.evaluate(() => window.ENGINE_READY);
  await pg.evaluate(async () => { await document.fonts.ready;
    await Promise.all(['800 40px Unbounded', '600 40px Unbounded', '500 40px "Space Grotesk"', '700 40px "Space Grotesk"', 'italic 400 40px "Instrument Serif"'].map(f => document.fonts.load(f)));
    await new Promise(r => setTimeout(r, 300)); });
  const DUR = await pg.evaluate(() => window.DUR);
  const frame = async (t, q = .95) => Buffer.from((await pg.evaluate(([t, q]) => { renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', q); }, [t, q])).split(',')[1], 'base64');
  const build = path.join(vdir, 'build');

  if (mode === '--qa' || mode === '--at') {
    let times;
    if (mode === '--at') times = process.argv.slice(4).map(Number);
    else { const tl = JSON.parse(fs.readFileSync(path.join(build, 'timeline.json')));
      times = []; tl.scenes.forEach(s => { times.push(+(s.t0 + Math.min(1.2, (s.t1 - s.t0) / 2)).toFixed(2)); times.push(+(s.t1 - .7).toFixed(2)); }); }
    const files = [];
    for (const [i, t] of times.entries()) { const f = path.join(build, mode === '--qa' ? `qa_${String(i).padStart(2, '0')}.jpg` : `frame_${t}.jpg`); fs.writeFileSync(f, await frame(t, .85)); files.push(f); }
    if (mode === '--qa') {
      const cols = 6, rows = Math.ceil(files.length / cols);
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(build, 'qa_%02d.jpg'), '-vf', `scale=360:640,tile=${cols}x${rows}`, '-frames:v', '1', path.join(build, 'qa.jpg')]);
      files.forEach(f => fs.unlinkSync(f)); console.log('hoja de revisión: ' + path.join(build, 'qa.jpg') + '  tiempos: ' + times.join(', '));
    } else console.log(files.join('\n'));
    await b.close(); return;
  }

  const ticker = JSON.parse(fs.readFileSync(path.join(vdir, 'data.json'))).ticker;
  const out = path.join(vdir, `${ticker}_short.mp4`), mix = path.join(vdir, 'audio', 'mix.wav');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-i', mix,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(DUR * 30);
  for (let f = 0; f < N; f++) {
    if (!ff.stdin.write(await frame(f / 30))) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) process.stdout.write(`\r${Math.round(f / N * 100)}%`);
  }
  ff.stdin.end(); ff.on('close', c => { console.log(`\r100% → ${out} (ffmpeg ${c})`); b.close(); });
})();
