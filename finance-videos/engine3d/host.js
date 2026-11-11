// "JP" — el anfitrión 3D del canal (Costa Studio Finance).
// REGLA DE JP (11 nov 2026): el protagonista es el TEMA del video, no él. Por eso JP se renderiza como un RECORTE con fondo
// transparente (él + los objetos con los que interactúa, nada más) y el motor 2D lo pone encima de la escena, chico (≈1/8 de la
// pantalla), en una esquina. Detrás se ve completa la foto de la noticia, la gráfica o el texto, y JP reacciona a eso.
// Mismo personaje siempre (rasgos fijos); en cada video cambia de ropa, accesorio, objeto y actividad. Sin párpados.
//
// cfg ("host" global del storyboard + "host" de la escena):
//   act     'escritorio' | 'cafe' | 'logo' | 'senala' | 'piensa' | 'telefono' | 'camina' | 'cierre'
//   mood    'up' | 'down' | 'neutral'   → reacción de JP y color de la luz / flecha
//   logo    logo de la empresa: en la laptop (escritorio, cafe) o como ficha grande en la que JP se apoya (logo, cierre)
//   side    'r' | 'l'  lado de la pantalla donde va el recorte (JP mira hacia el centro, donde está el contenido)
//   who     rasgos de una persona famosa (opciones de L.actor): reemplaza a JP en esa escena
//   outfit  'negra' | 'blanca' | 'hoodie' | 'blazer' | 'polo' | 'sueter' · accessory 'ninguno' | 'lentes' | 'gorra' | 'audifonos' | 'reloj'
//   prop    'ninguno' | 'cafe' | 'telefono' · color (prenda) · accent (color de la empresa) · seed (varía el vestuario; por defecto la carpeta)

// Rasgos fijos de JP (de su foto): pelo oscuro corto con copete, cejas marcadas, sin barba.
export const JP = { skin: '#EBC6A6', hair: '#1F1612', hairStyle: 'quiff', browW: .034, eyeStyle: 'full', eyes: '#4A2F1B', neck: true, pants: '#2B3A55', shoes: '#F2F0E8' };

const OUTFITS = {
  negra:  { shirt: '#2A2A31', collar: 'crew', trim: '#1c1c21', sleeves: 'short' },
  blanca: { shirt: '#EFECE2', collar: 'crew', trim: '#DAD6C8', sleeves: 'short' },
  hoodie: { shirt: '#4173D1', collar: 'hoodie', trim: '#F4F1E8' },
  blazer: { shirt: '#24324F', collar: 'suit' },
  polo:   { shirt: '#7E8C54', collar: 'polo', trim: '#F4F1E8', sleeves: 'short' },
  sueter: { shirt: '#BB6F58', collar: 'turtle' },
};
const ACCESSORIES = ['ninguno', 'reloj', 'lentes', 'ninguno', 'gorra', 'audifonos'];
const PROPS = ['ninguno', 'cafe', 'ninguno', 'telefono'];
export const ACTS = ['escritorio', 'cafe', 'logo', 'senala', 'piensa', 'telefono', 'camina', 'cierre'];
const ALIAS = { hook: 'escritorio', explica: 'senala' };

function hash(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function lookFor(cfg = {}) {              // vestuario del video: sale de la fecha/carpeta (cambia cada día) o se fija en el storyboard
  const h = hash(cfg.seed || 'costa'), names = Object.keys(OUTFITS);
  return { outfit: OUTFITS[cfg.outfit] ? cfg.outfit : names[h % names.length], accessory: cfg.accessory || ACCESSORIES[(h >>> 5) % ACCESSORIES.length],
    prop: cfg.prop || PROPS[(h >>> 9) % PROPS.length], color: cfg.color || null };
}

export function buildHost(L, cfg = {}) {
  const { THREE, B, clay2, rbox, mesh, actor, pose, on2, seg, ex, eio, back, lerp, clamp } = L;
  const mood = cfg.mood || 'neutral', a0 = ALIAS[cfg.act] || cfg.act, look = lookFor(cfg), sd = cfg.side === 'l' ? -1 : 1;   // sd: 1 = recorte a la derecha (mira a la izquierda)
  let act = ACTS.includes(a0) ? a0 : 'escritorio'; if (act === 'logo' && !cfg.logoEl) act = 'senala';
  const MC = mood === 'up' ? '#8FE39A' : mood === 'down' ? '#FF7A62' : '#A9C8FF';
  const OBJ = cfg.accent || (mood === 'up' ? '#8FB36B' : mood === 'down' ? B.terracota : B.mostaza);
  const desk = act === 'escritorio' || act === 'cafe';

  // ---------- escena SIN fondo: solo luces, una sombra de contacto y lo que JP usa ----------
  const S = new THREE.Scene(), R = new THREE.Group(); S.add(R);                       // R gira todo el conjunto hacia el contenido
  S.add(new THREE.HemisphereLight('#FFF6E8', '#566488', .8));
  const key = new THREE.DirectionalLight('#FFE6C2', 3.1); key.position.set(-5 * sd, 8, 7); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.bias = -.0006;
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 5, bottom: -2, near: 1, far: 40 });
  const rim = new THREE.DirectionalLight(cfg.accent || '#9FC0FF', 2.8); rim.position.set(6 * sd, 6, -8);
  const fill = new THREE.DirectionalLight('#C7D8FF', .4); fill.position.set(7 * sd, 3, 9); S.add(key, rim, fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: .34 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; S.add(ground);
  const cam = new THREE.PerspectiveCamera(30, 1, .1, 100);

  // ---------- JP ----------
  // who: si la escena habla de una persona famosa, el muñeco es ESA persona (caricatura con sus rasgos públicos), no JP.
  //      Ej.: {"who": {"skin": "#F0D2B8", "hair": "#8A8A8A", "hairStyle": "short", "glasses": true, "shirt": "#111111", "collar": "turtle", "pants": "#3F5E8C"}}
  const o = OUTFITS[look.outfit], ao = cfg.who ? { eyeStyle: 'full', neck: true, browW: .03, pants: '#2B3A55', shoes: '#F2F0E8', ...cfg.who, seed: 31 } : { ...JP, ...o, seed: 23 };
  if (!cfg.who && look.color) ao.shirt = look.color;
  if (!cfg.who && look.accessory === 'lentes') ao.glasses = '#1b1b1d';
  if (!cfg.who && look.accessory === 'gorra') ao.cap = cfg.accent || B.azul;
  if (!cfg.who && look.accessory === 'audifonos') ao.headphones = '#F4F1E8';
  if (!cfg.who && look.accessory === 'reloj' || look.outfit === 'blazer') ao.watch = '#1b1b1d';
  const jp = actor(ao), U = jp.userData; R.add(jp);

  const mug = new THREE.Group(); { const m = clay2('#F4F1E8', .5, .4);
    const c = mesh(new THREE.CylinderGeometry(.12, .105, .24, 20), m); const hd = mesh(new THREE.TorusGeometry(.075, .022, 8, 16, Math.PI), m, false); hd.rotation.z = -Math.PI / 2; hd.position.x = .12;
    const cf = mesh(new THREE.CylinderGeometry(.1, .1, .01, 18), clay2('#3a2317', .4, 0), false); cf.position.y = .118;
    const band = mesh(new THREE.CylinderGeometry(.123, .118, .07, 20), clay2(B.azul, .6, 0), false); band.position.y = -.02; mug.add(c, hd, cf, band); }
  const phone = new THREE.Group(); { const b = rbox(.2, .38, .035, .03, clay2('#16161a', .35, 0));
    const sc = mesh(new THREE.PlaneGeometry(.17, .34), new THREE.MeshBasicMaterial({ color: MC }), false); sc.position.z = .019; phone.add(b, sc); }
  const holdMug = act === 'cafe' || (look.prop === 'cafe' && !desk && act !== 'logo'), holdPhone = act === 'telefono';

  // logo de la empresa: textura sobre ficha blanca
  const logoMat = cfg.logoEl ? (() => { const lt = L.canvasTex((g, cw, ch) => { g.fillStyle = '#F7F5EE'; g.fillRect(0, 0, cw, ch);
    const im = cfg.logoEl, s = Math.min(cw * .74 / im.naturalWidth, ch * .74 / im.naturalHeight); g.drawImage(im, (cw - im.naturalWidth * s) / 2, (ch - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s); }, 384, 384);
    return new THREE.MeshBasicMaterial({ map: lt }); })() : null;

  // ---------- utilería ----------
  let glow = null, arrow = null, coin = null, lid = null, card = null;
  if (desk) {
    const wood = clay2('#8A5A3C', .85), dark = clay2('#22262f', .5, .3);
    const top = rbox(2.25, .12, 1.05, .05, wood); top.position.set(0, .93, .74); R.add(top);
    [-1, 1].forEach(s => { const leg = rbox(.12, .9, .85, .04, clay2('#5E3D28', .9)); leg.position.set(s * 1.0, .45, .74); R.add(leg); });
    const chair = rbox(1.0, 1.25, .14, .1, clay2('#2C3D66', .9)); chair.position.set(0, 1.05, -.52); chair.rotation.x = -.08; R.add(chair);
    const base = rbox(.74, .04, .5, .03, dark); base.position.set(.04, 1.008, .92); R.add(base);
    lid = new THREE.Group(); lid.position.set(.04, 1.02, 1.16); const lp = rbox(.74, .5, .035, .03, dark); lp.position.y = .25; lid.add(lp);
    if (logoMat) { const st = mesh(new THREE.PlaneGeometry(.36, .36), logoMat, false); st.position.set(0, .26, .021); lid.add(st); }
    else { const dot = mesh(new THREE.CircleGeometry(.055, 20), clay2(B.arena, .5, 0), false); dot.position.set(0, .26, .02); lid.add(dot); }
    lid.rotation.x = .42; R.add(lid);
    glow = new THREE.PointLight(MC, .6, 3.2, 1.8); glow.position.set(.04, 1.38, .86); R.add(glow);
    const lb = mesh(new THREE.CylinderGeometry(.13, .15, .05, 18), dark); lb.position.set(-.8 * sd, 1.015, .66); R.add(lb);
    const stem = mesh(new THREE.CylinderGeometry(.022, .022, .72, 8), dark); stem.position.set(-.8 * sd, 1.37, .66); R.add(stem);
    const shade = mesh(new THREE.ConeGeometry(.2, .26, 20, 1, true), clay2(B.mostaza, .6, .3)); shade.material.side = THREE.DoubleSide; shade.position.set(-.72 * sd, 1.76, .68); shade.rotation.z = -.75 * sd; R.add(shade);
    const bulb = mesh(new THREE.SphereGeometry(.07, 12, 10), new THREE.MeshBasicMaterial({ color: '#FFE9B8' }), false); bulb.position.set(-.67 * sd, 1.71, .68); R.add(bulb);
    const lampL = new THREE.PointLight('#FFD79A', 1.3, 3, 1.8); lampL.position.copy(bulb.position); R.add(lampL);
    if (!holdMug) { mug.position.set(.74 * sd, 1.11, .9); R.add(mug); }
    else { const pot = mesh(new THREE.CylinderGeometry(.13, .1, .2, 16), clay2(B.terracota, .9)); pot.position.set(.78 * sd, 1.09, .62); R.add(pot);
      const lv = []; for (let i = 0; i < 10; i++) { const a = i * 2.4, rr = .05 + (i % 4) * .03; lv.push([.78 * sd + Math.cos(a) * rr, 1.28 + (i % 5) * .05, .62 + Math.sin(a) * rr, .09]); } R.add(L.blobs(lv, clay2(B.musgo, .9))); }
  }
  if (logoMat && (act === 'logo' || act === 'cierre')) {       // ficha grande con el logo: JP se apoya en ella / la presenta
    card = new THREE.Group(); const bd = rbox(1.12, 1.12, .12, .1, clay2('#F7F5EE', .7, .3)); bd.position.y = .56; const fc = mesh(new THREE.PlaneGeometry(.98, .98), logoMat, false); fc.position.set(0, .56, .065);
    const ft = rbox(.5, .06, .4, .03, clay2('#D9D5C6', .8)); ft.position.set(0, .03, 0); card.add(bd, fc, ft); card.position.set(-.86 * sd, 0, .18); card.rotation.y = .22 * sd; R.add(card);
  }
  if (act === 'senala' || (act === 'cierre' && !card)) {
    arrow = new THREE.Group(); const am = clay2(OBJ, .7);
    const sh = rbox(.26, 1, .26, .07, am); sh.position.y = .5; const hd = mesh(new THREE.ConeGeometry(.32, .46, 4), am); hd.rotation.y = Math.PI / 4; hd.position.y = 1.22; arrow.add(sh, hd);
    arrow.userData = { sh, hd }; R.add(arrow);
  }
  if (act === 'piensa') {
    coin = mesh(new THREE.CylinderGeometry(.34, .34, .09, 36), clay2(B.mostaza, .45, .3)); R.add(coin);
    const rimc = mesh(new THREE.TorusGeometry(.26, .03, 8, 28), clay2('#A8870F', .5, 0), false); rimc.rotation.x = Math.PI / 2; rimc.position.y = .05; coin.add(rimc);
  }
  if (holdMug) { mug.position.set(0, -.02, .2); U.arms[1].hand.add(mug); }
  if (holdPhone) { phone.rotation.set(-1.9, 0, 0); phone.position.set(0, -.16, .13); U.arms[-1].hand.add(phone); }

  const QW = new THREE.Quaternion(), LOOK = -.5 * sd;                               // LOOK: giro de cabeza hacia el contenido (centro de la pantalla)
  // reacción al dato, mirando hacia arriba, al contenido
  const react = (k, tt) => mood === 'up' ? { smile: 1, brow: -.1, armR: [lerp(.9, 2.55, k) + Math.sin(tt * 9) * .14 * k, .8 * k, lerp(1.2, .55, k), 1], bob: Math.abs(Math.sin(tt * 9)) * .05 * k }
    : mood === 'down' ? { smile: lerp(.3, -.9, k), brow: .85 * k, sweat: k > .5, armL: [lerp(.9, 2.25, k), .95 * k, lerp(1.2, 2.1, k), 1] }
    : { smile: .4, brow: -.05, armR: [lerp(.9, 1.75, k), 0, lerp(1.2, 2.45, k), 1] };

  function update(lt, d) {
    const tt = on2(lt, 12), br = Math.sin(tt * 2.2) * .012, end = eio(seg(tt, d - 1.1, d - .6));     // al final voltea a cámara
    let p = {}; jp.position.set(0, 0, 0); jp.rotation.set(0, 0, 0); R.rotation.y = -.3 * sd;
    const up = [lerp(-.34, 0, end), lerp(LOOK * .55, .3 * sd, end), 0];              // cabeza hacia el contenido (arriba y al centro)
    if (desk) {
      const t1 = Math.min(1.1, d * .24), k = back(seg(tt, t1, t1 + .4)), kr = ex(seg(tt, t1 + .3, t1 + .95));   // teclea → levanta la vista al dato → reacciona
      const ty = Math.sin(tt * 17) * .07, ty2 = Math.sin(tt * 17 + 2) * .07;
      p = { sit: 1, bob: -.2 + br, lean: lerp(.16, .02, k), head: [lerp(.4, up[0], k), lerp(0, up[1], k), 0], brow: 0, smile: .3,
        armL: [.92 + ty * (1 - k), .1, 1.22, 1], armR: [.92 + ty2 * (1 - k), .1, 1.22, 1], talk: seg(tt, t1 + .05, t1 + .2) * (1 - seg(tt, t1 + .35, t1 + .6)) * .85 };
      if (act === 'cafe') { const ks = eio(seg(tt, .12, .6)) * (1 - eio(seg(tt, t1 - .1, t1 + .3))); p.armR = [lerp(.92, 2.05, ks), .1, lerp(1.22, 2.3, ks), 1]; p.head = [lerp(p.head[0], -.12, ks), p.head[1], 0]; }
      if (kr > 0) { const hd = p.head; Object.assign(p, react(kr, tt)); p.head = hd; p.sit = 1; p.bob = -.2 + br + (p.bob || 0);
        if (act === 'cafe' && mood !== 'down') p.armR = [lerp(.92, 1.9, kr), .5 * kr, 1.5, 1]; }
      if (glow) glow.intensity = (.55 + Math.sin(tt * 23) * .1) * (1 + .9 * seg(tt, t1 - .15, t1 + .1) * (1 - .5 * seg(tt, t1 + .3, t1 + 1.2)));
    } else if (act === 'logo') {                             // presenta la ficha del logo y se apoya en ella
      const kc = back(seg(tt, .15, .6)), kl = eio(seg(tt, .5, 1.0)); card.scale.setScalar(Math.max(.001, kc)); card.rotation.z = Math.sin(tt * 2) * .015;
      jp.position.set(.42 * sd, 0, 0);
      const lean = [.12, lerp(.14, 1.05, kl), .2, 1], free = mood === 'up' ? [lerp(0, 2.5, kl) + Math.sin(tt * 8) * .1, .7, .5, 1] : mood === 'down' ? [lerp(0, 2.2, kl), .95, 2.1, 1] : [.5, .5, 1.6, 1];
      p = { head: up, brow: mood === 'down' ? .7 : -.1, smile: mood === 'down' ? -.6 : 1, sweat: mood === 'down' && kl > .6, bob: br, lean: 0, talk: .15 * Math.abs(Math.sin(tt * 8)) * (1 - end) };
      if (sd > 0) { p.armL = lean; p.armR = free; } else { p.armR = lean; p.armL = free; }
      jp.rotation.z = -.05 * sd * kl;
    } else if (act === 'senala') {                           // señala hacia arriba, al dato; la flecha sube o baja a su lado
      const kg = eio(seg(tt, .3, 1.4)), kp = back(seg(tt, .2, .65)); jp.position.set(.38 * sd, 0, 0);
      const pt = [lerp(.2, 2.35, kp) + Math.sin(tt * 4) * .04, .55, .15, 1], other = [.6 + Math.sin(tt * 5) * .12, .25, 1.4, 1];
      p = { head: up, brow: mood === 'down' ? .6 : -.05, smile: mood === 'down' ? -.3 : .8, bob: br, talk: (.2 + .5 * Math.abs(Math.sin(tt * 8.5))) * (1 - end) };
      if (sd > 0) { p.armL = pt; p.armR = other; } else { p.armR = pt; p.armL = other; }
      const upw = mood !== 'down', A = arrow.userData, h = lerp(.2, 1.35, kg) + Math.sin(tt * 3) * .03;
      A.sh.scale.y = h; A.sh.position.y = h / 2; A.hd.position.y = h + .2; arrow.position.set(-.82 * sd, upw ? 0 : 1.95, .2); arrow.rotation.set(upw ? 0 : Math.PI, 0, Math.sin(tt * 2.5) * .03);
    } else if (act === 'piensa') {
      p = { head: [lerp(-.3, 0, end), lerp(LOOK * .6, .3 * sd, end), .1 * sd], brow: -.1, smile: .5, bob: br, armR: [1.72, .05, 2.5, 1], armL: [.5, .2, 1.5, 1] };
      coin.position.set(-.85 * sd, 2.2 + Math.sin(tt * 2.4) * .08, .2); coin.rotation.set(Math.PI / 2, 0, tt * 2.6);
    } else if (act === 'camina') {
      const tw = Math.min(1.4, d * .4), kw = seg(tt, 0, tw), stop = kw >= 1, kk = ex(seg(tt, tw, tw + .35));
      jp.position.x = lerp(1.5 * sd, .1 * sd, ex(kw)); jp.rotation.y = lerp(-1.05 * sd, 0, kk);
      p = stop ? { smile: 1, brow: -.1, bob: br, head: up, armR: [.3, 2.35 + Math.sin(tt * 10) * .28, .45, 1] } : { walk: tt * 9, amp: .6, smile: .7 };
    } else if (act === 'telefono') {
      const t1 = Math.min(1.2, d * .28), k = back(seg(tt, t1, t1 + .4)), kr = ex(seg(tt, t1 + .3, t1 + .95));
      p = { head: [lerp(.5, up[0], k), lerp(-.18, up[1], k), 0], smile: .3, bob: br, armL: [1.05, .05, 1.75, 1], armR: [.1, .16, .3, 1] };
      if (kr > 0) { const hd = p.head, al = p.armL; Object.assign(p, react(kr, tt)); p.head = hd; p.armL = al; p.bob = br + (p.bob || 0); if (mood !== 'up') p.armR = [lerp(.1, 2.25, kr), .95 * kr, lerp(.3, 2.1, kr), 1]; }
    } else {                                                 // cierre: junto al logo (o la flecha), se encoge de hombros con la pregunta y señala a cámara
      const t1 = Math.max(1.1, d * .45), ks = eio(seg(tt, .2, .7)) * (1 - eio(seg(tt, t1 - .25, t1 + .1))), kp = back(seg(tt, t1, t1 + .4));
      jp.position.set(card || arrow ? .42 * sd : 0, 0, 0); if (card) card.scale.setScalar(Math.max(.001, back(seg(tt, .1, .55))));
      if (arrow) { const A = arrow.userData; A.sh.scale.y = 1.1; A.sh.position.y = .55; A.hd.position.y = 1.3; arrow.position.set(-.82 * sd, 0, .2); }
      const sh = [lerp(0, .55, ks), lerp(.14, .75, ks), lerp(.1, 1.75, ks), 1], pt = [lerp(sh[0], 1.48, kp), lerp(sh[1], .02, kp), lerp(sh[2], .12, kp), 1];
      p = { head: [0, lerp(LOOK * .35, .3 * sd, kp), .14 * ks * sd], brow: -.12, smile: lerp(.45, 1, kp), bob: br + ks * .04, talk: ks * .5 * Math.abs(Math.sin(tt * 8)), armL: holdMug ? pt : sh, armR: holdMug ? [1.1, .12, 1.45, 1] : pt };
    }
    pose(jp, p);
    if (mug.parent && mug.parent !== R) { R.updateMatrixWorld(true); mug.parent.getWorldQuaternion(QW); mug.quaternion.copy(QW.invert()); }   // la taza siempre derecha
    const k = eio(clamp(lt / Math.max(1, d)));              // encuadre cuadrado que contiene a JP y sus objetos; empuje muy leve
    if (desk) { cam.position.set(0, 2.0, lerp(6.5, 6.3, k)); cam.lookAt(0, 1.5, .3); }
    else { cam.position.set(-.12 * sd, 1.9, lerp(6.9, 6.7, k)); cam.lookAt(-.12 * sd, 1.58, 0); }
  }
  function render() { L.renderer.setClearColor(0x000000, 0); L.renderer.render(S, cam); }
  return { update, render, look, act, mood };
}
