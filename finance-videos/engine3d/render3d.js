#!/usr/bin/env node
/* Renderiza una historia 3D (Costa Diorama).
 *   node engine3d/render3d.js videos/<id>              → videos/<id>/<id>.mp4 (con audio/mix.wav si existe; si no, animatic mudo)
 *   node engine3d/render3d.js videos/<id> --qa         → build/qa.jpg (2 cuadros por escena)
 *   node engine3d/render3d.js videos/<id> --at 3.5 12  → build/frame_3.5.png ...
 *   --fps 30 (por defecto)
 */
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');

(async () => {
  const vdir = path.resolve(process.argv[2] || ''), mode = process.argv[3] || 'video';
  const fpsArg = process.argv.indexOf('--fps'), FPS = fpsArg > 0 ? +process.argv[fpsArg + 1] : 30;
  if (!fs.existsSync(path.join(vdir, 'story.js'))) { console.error('Falta ' + path.join(vdir, 'story.js')); process.exit(1); }
  if (!fs.existsSync(path.join(__dirname, 'node_modules', 'three'))) execFileSync('npm', ['i', '--silent'], { cwd: __dirname, stdio: 'inherit' });
  const build = path.join(vdir, 'build'); fs.mkdirSync(build, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERROR en el motor:', e.message));
  pg.on('console', m => { if (m.type() === 'error') console.log('consola:', m.text()); });
  await pg.goto('file://' + path.join(__dirname, 'index.html') + '?render=1&v=' + encodeURIComponent('file://' + path.join(vdir, 'story.js')));
  await pg.waitForFunction(() => window.ENGINE_READY, null, { timeout: 120000 });
  const DUR = await pg.evaluate(() => window.DUR), TL = await pg.evaluate(() => window.TIMELINE);
  const frame = async (t, type = 'jpeg', q = .92) => Buffer.from((await pg.evaluate(([t, type, q]) => { renderAt(t); return document.getElementById('c').toDataURL('image/' + type, q); }, [t, type, q])).split(',')[1], 'base64');

  if (mode === '--qa' || mode === '--at') {
    const times = mode === '--at' ? process.argv.slice(4).filter(x => !isNaN(+x)).map(Number)
      : TL.flatMap(s => [+(s.t0 + Math.min(1.4, (s.t1 - s.t0) * .3)).toFixed(2), +(s.t1 - .5).toFixed(2)]);
    const files = [];
    for (const [i, t] of times.entries()) { const f = path.join(build, mode === '--qa' ? `qa_${String(i).padStart(2, '0')}.jpg` : `frame_${t}.png`);
      fs.writeFileSync(f, await frame(t, mode === '--qa' ? 'jpeg' : 'png', .88)); files.push(f); }
    if (mode === '--qa') {
      const cols = 8, rows = Math.ceil(files.length / cols);
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(build, 'qa_%02d.jpg'), '-vf', `scale=360:640,tile=${cols}x${rows}`, '-frames:v', '1', path.join(build, 'qa.jpg')]);
      files.forEach(f => fs.unlinkSync(f)); console.log('hoja de revisión: ' + path.join(build, 'qa.jpg') + '  tiempos: ' + times.join(', '));
    } else console.log(files.join('\n'));
    await b.close(); return;
  }

  const id = path.basename(vdir), mix = path.join(vdir, 'audio', 'mix.wav'), hasAudio = fs.existsSync(mix);
  const out = path.join(vdir, hasAudio ? `${id}.mp4` : `${id}_animatic.mp4`);
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-'];
  if (hasAudio) args.push('-i', mix, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', out);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(DUR * FPS), s0 = Date.now();
  for (let f = 0; f < N; f++) {
    if (!ff.stdin.write(await frame(f / FPS))) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 60 === 0) process.stdout.write(`\r${Math.round(f / N * 100)}%  (${Math.round((Date.now() - s0) / 1000)} s)`);
  }
  ff.stdin.end(); ff.on('close', c => { console.log(`\r100% → ${out} (ffmpeg ${c})`); b.close(); });
})();
