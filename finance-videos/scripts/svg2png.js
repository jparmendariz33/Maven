#!/usr/bin/env node
/* Convierte un SVG (logo) a PNG transparente con Chromium.  node scripts/svg2png.js in.svg out.png [ancho=1200] [color #hex]
 * Si se da color, se aplica como relleno (los íconos de simple-icons vienen en negro). */
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [inp, out, w = '1200', color] = process.argv.slice(2);
  let svg = fs.readFileSync(inp, 'utf8');
  if (color) svg = svg.replace('<svg', `<svg fill="${color}"`);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: +w, height: +w } });
  await pg.setContent(`<html><body style="margin:0;background:transparent"><div id="x" style="width:${w}px;display:inline-block">${svg.replace('<svg', '<svg style="width:100%;height:auto;display:block"')}</div></body></html>`);
  const el = await pg.$('#x'); await el.screenshot({ path: out, omitBackground: true }); await b.close();
})();
