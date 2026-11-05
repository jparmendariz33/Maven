#!/usr/bin/env node
/* Arte del canal: banner 2560x1440 (zona segura 1546x423 al centro) y foto de perfil 800x800 → canal/ */
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), B = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/brand/brand.json'))), C = B.colors;
const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'assets/brand/logo_mask.png')).toString('base64');
const css = ['Unbounded-800', 'Unbounded-600', 'SpaceGrotesk-500', 'SpaceGrotesk-700'].map(f => { const [n, w] = f.split('-');
  return `@font-face{font-family:'${n === 'SpaceGrotesk' ? 'Space Grotesk' : n}';src:url('file://${ROOT}/assets/fonts/${f}.ttf');font-weight:${w}}`; }).join('') +
  `@font-face{font-family:'Instrument Serif';src:url('file://${ROOT}/assets/fonts/InstrumentSerif-400.ttf');font-style:italic}`;
const draw = (W, H, kind) => `<html><head><meta charset="utf-8"><style>${css}body{margin:0}</style></head><body><canvas id=c width=${W} height=${H}></canvas><script>
const C=${JSON.stringify(C)},X=document.getElementById('c').getContext('2d'),W=${W},H=${H};
const img=new Image();img.src='${logo}';
window.go=async()=>{await document.fonts.load('800 40px Unbounded');await document.fonts.load('700 40px "Space Grotesk"');await document.fonts.load('500 40px "Space Grotesk"');await document.fonts.load('italic 40px "Instrument Serif"');await img.decode();
X.fillStyle=C.azul;X.fillRect(0,0,W,H);
X.strokeStyle='rgba(235,230,186,.28)';X.lineWidth=3;for(let k=0;k<3;k++){X.beginPath();for(let x=0;x<=W;x+=10){const y=H*(${kind === 'banner' ? '.80' : '.86'})+k*${kind === 'banner' ? 34 : 22}+Math.sin(x/180+k)*12;x?X.lineTo(x,y):X.moveTo(x,y)}X.stroke()}
X.globalAlpha=.09;X.fillStyle=C.arena;X.beginPath();X.arc(W*${kind === 'banner' ? '.78' : '.75'},H*.3,${kind === 'banner' ? 330 : 260},0,7);X.fill();X.globalAlpha=1;
const t=document.createElement('canvas');t.width=img.width;t.height=img.height;const g=t.getContext('2d');g.drawImage(img,0,0);g.globalCompositeOperation='source-in';g.fillStyle=C.arena;g.fillRect(0,0,t.width,t.height);
const txt=(s,x,y,f,c,al='left',ls=0)=>{X.font=f;X.fillStyle=c;X.textAlign=al;X.letterSpacing=ls+'px';X.fillText(s,x,y)};
if('${kind}'==='banner'){const cx=W/2,cy=H/2; const lw=250,lh=lw*img.height/img.width;
 X.drawImage(t,cx-700,cy-lh/2-10,lw,lh);
 txt('COSTA STUDIO',cx-420,cy-60,'800 92px Unbounded',C.arena,'left',4);txt('FINANCE',cx-420,cy+40,'800 92px Unbounded',C.mostaza,'left',18);
 txt('by JP Armendáriz  ·  Inversiones y qué hacer con tu dinero',cx-420,cy+110,'500 40px "Space Grotesk"',C.arena);
 txt('Desde la costa, todo se ve con claridad.',cx,cy+190,'italic 54px "Instrument Serif"',C.arena,'center');
 txt('Nuevo video largo cada domingo · Shorts lun, mar, mié y jue',cx,H*.80-30,'700 34px "Space Grotesk"','rgba(235,230,186,.85)','center');}
else{const lw=W*.62,lh=lw*img.height/img.width;X.drawImage(t,(W-lw)/2,H*.42-lh/2,lw,lh);txt('FINANCE',W/2,H*.78,'800 74px Unbounded',C.mostaza,'center',10);}
return document.getElementById('c').toDataURL('image/png')}</script></body></html>`;
(async () => { const b = await chromium.launch(); for (const [k, W, H] of [['banner', 2560, 1440], ['perfil', 800, 800]]) {
  const p = await b.newPage({ viewport: { width: W, height: H } }); const f = path.join(ROOT, 'canal', `_${k}.html`); fs.writeFileSync(f, draw(W, H, k));
  await p.goto('file://' + f); const d = await p.evaluate(() => window.go()); fs.writeFileSync(path.join(ROOT, 'canal', `${k}.png`), Buffer.from(d.split(',')[1], 'base64')); fs.unlinkSync(f); console.log('canal/' + k + '.png'); }
  await b.close(); })();
