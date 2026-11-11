// "JP" — el anfitrión 3D del canal (Costa Studio Finance). Sale en el gancho, a la mitad y en el cierre de cada video.
// Es el mismo personaje siempre (rasgos fijos), pero en cada video cambia de ropa, accesorio, objeto y actividad.
// Todo es función del tiempo (determinista) y se anima "a doses" (12 cuadros/s) como stop-motion de plastilina.
//
// cfg (storyboard: "host" global del video + "host" de la escena):
//   act     'hook' | 'cafe' | 'telefono' | 'explica' | 'piensa' | 'camina' | 'cierre'
//   mood    'up' | 'down' | 'neutral'   → reacción de JP y color de la luz de pantalla / flecha
//   outfit  'negra' | 'hoodie' | 'blazer' | 'polo' | 'sueter' | 'blanca'      (si falta: se elige por la fecha del video)
//   accessory 'ninguno' | 'lentes' | 'gorra' | 'audifonos' | 'reloj'          (ídem)
//   prop    'ninguno' | 'cafe' | 'telefono'                                   (ídem)
//   color   color de la prenda (hex) · accent  color de la empresa (contraluz y objetos)
//   image   foto real del TEMA de la escena (ruta dentro del video): va en la pantalla gigante detrás de JP — obligatoria: sin ella la escena no dice de qué trata el video
//   focus   [x, y] 0..1 punto de interés de la foto · logo  logo de la empresa (en la laptop o en la pared)
//   seed    texto para variar (por defecto, el nombre de la carpeta del video)

// Rasgos fijos de JP (de su foto): pelo oscuro corto con volumen arriba, cejas marcadas, sin barba.
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
export const ACTS = ['hook', 'cafe', 'telefono', 'explica', 'piensa', 'camina', 'cierre'];

function hash(s) { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
// vestuario del video: sale de la fecha/carpeta (cambia cada día) y se puede fijar a mano en el storyboard
export function lookFor(cfg = {}) {
  const h = hash(cfg.seed || 'costa'), names = Object.keys(OUTFITS);
  const outfit = OUTFITS[cfg.outfit] ? cfg.outfit : names[h % names.length];
  const accessory = cfg.accessory || ACCESSORIES[(h >>> 5) % ACCESSORIES.length];
  const prop = cfg.prop || PROPS[(h >>> 9) % PROPS.length];
  return { outfit, accessory, prop, color: cfg.color || null };
}

export function buildHost(L, cfg = {}) {
  const { THREE, B, clay2, rbox, mesh, actor, pose, blink, on2, seg, ex, eio, back, lerp, clamp } = L;
  const mood = cfg.mood || 'neutral', act = ACTS.includes(cfg.act) ? cfg.act : 'hook', look = lookFor(cfg);
  const MC = mood === 'up' ? '#8FE39A' : mood === 'down' ? '#FF7A62' : '#A9C8FF';          // luz de la pantalla
  const OBJ = cfg.accent || (mood === 'up' ? '#8FB36B' : mood === 'down' ? B.terracota : B.mostaza);
  const desk = act === 'hook' || act === 'cafe';

  // ---------- mundo: estudio oscuro con claroscuro (luz cálida de lado + contraluz del color de la empresa) ----------
  const w = L.cineWorld({ bg: '#18274A', bg2: '#070C1C', floor: '#1B2A4D', hemi: .2, key: 3.5, rim: 3.2, fill: .16, sky: '#BFD4FF', ground: '#141B30',
    keyPos: [-7, 8.5, 6.5], rimPos: [7.5, 7, -9], keyCol: '#FFE4BD', rimCol: cfg.accent || '#8FB4FF', fillCol: '#9DB8FF', ao: false, dof: true, shadow: 7 });
  w.vig = .46; w.aperture = .00011; w.maxblur = .007;
  const S = w.scene;

  // ---------- JP ----------
  const o = OUTFITS[look.outfit], ao = { ...JP, ...o, seed: 23 };
  if (look.color) ao.shirt = look.color;
  if (look.accessory === 'lentes') ao.glasses = '#1b1b1d';
  if (look.accessory === 'gorra') ao.cap = cfg.accent || B.azul;
  if (look.accessory === 'audifonos') ao.headphones = '#F4F1E8';
  if (look.accessory === 'reloj' || look.outfit === 'blazer') ao.watch = '#1b1b1d';
  const jp = actor(ao), U = jp.userData; S.add(jp);

  // objetos de mano
  const mug = new THREE.Group(); { const m = clay2('#F4F1E8', .5, .4);
    const c = mesh(new THREE.CylinderGeometry(.12, .105, .24, 20), m); const hd = mesh(new THREE.TorusGeometry(.075, .022, 8, 16, Math.PI), m, false); hd.rotation.z = -Math.PI / 2; hd.position.x = .12;
    const cf = mesh(new THREE.CylinderGeometry(.1, .1, .01, 18), clay2('#3a2317', .4, 0), false); cf.position.y = .118;
    const band = mesh(new THREE.CylinderGeometry(.123, .118, .07, 20), clay2(B.azul, .6, 0), false); band.position.y = -.02; mug.add(c, hd, cf, band); }
  const phone = new THREE.Group(); { const b = rbox(.2, .38, .035, .03, clay2('#16161a', .35, 0));
    const sc = mesh(new THREE.PlaneGeometry(.17, .34), new THREE.MeshBasicMaterial({ color: MC }), false); sc.position.z = .019; phone.add(b, sc); }
  const holdMug = look.prop === 'cafe' || act === 'cafe', holdPhone = act === 'telefono' || (look.prop === 'telefono' && !desk && act !== 'explica');

  // ---------- utilería ----------
  let glow = null, arrow = null, coin = null, lid = null, bulb = null;
  if (desk) {
    const wood = clay2('#8A5A3C', .85), dark = clay2('#22262f', .5, .3);
    const top = rbox(2.9, .12, 1.15, .05, wood); top.position.set(0, .93, .78); S.add(top);
    [-1, 1].forEach(s => { const leg = rbox(.12, .9, .9, .04, clay2('#5E3D28', .9)); leg.position.set(s * 1.3, .45, .78); S.add(leg); });
    const chair = rbox(1.0, 1.25, .14, .1, clay2('#2C3D66', .9)); chair.position.set(0, 1.05, -.52); chair.rotation.x = -.08; S.add(chair);
    const base = rbox(.74, .04, .5, .03, dark); base.position.set(.06, 1.008, .98); S.add(base);
    lid = new THREE.Group(); lid.position.set(.06, 1.02, 1.22); const lp = rbox(.74, .46, .035, .03, dark); lp.position.y = .23; lid.add(lp);
    const dot = mesh(new THREE.CircleGeometry(.055, 20), clay2(B.arena, .5, 0), false); dot.position.set(0, .24, .02); lid.add(dot); lid.rotation.x = .5; S.add(lid);
    glow = new THREE.PointLight(MC, .6, 3.2, 1.8); glow.position.set(.06, 1.38, .9); S.add(glow);
    // lámpara de escritorio
    const lb = mesh(new THREE.CylinderGeometry(.13, .15, .05, 18), dark); lb.position.set(-.8, 1.015, .7); S.add(lb);
    const stem = mesh(new THREE.CylinderGeometry(.022, .022, .72, 8), dark); stem.position.set(-.8, 1.37, .7); stem.rotation.z = -.12; S.add(stem);
    const shade = mesh(new THREE.ConeGeometry(.2, .26, 20, 1, true), clay2(B.mostaza, .6, .3)); shade.material.side = THREE.DoubleSide; shade.position.set(-.7, 1.74, .72); shade.rotation.z = -.75; S.add(shade);
    bulb = mesh(new THREE.SphereGeometry(.07, 12, 10), new THREE.MeshBasicMaterial({ color: '#FFE9B8' }), false); bulb.position.set(-.65, 1.69, .72); S.add(bulb);
    const lampL = new THREE.PointLight('#FFD79A', 1.5, 3.2, 1.8); lampL.position.copy(bulb.position); S.add(lampL);
    // planta y libreta
    const pot = mesh(new THREE.CylinderGeometry(.14, .11, .22, 16), clay2(B.terracota, .9)); pot.position.set(.82, 1.1, .55); S.add(pot);
    const lv = []; for (let i = 0; i < 11; i++) { const a = i * 2.4, rr = .05 + (i % 4) * .035; lv.push([.82 + Math.cos(a) * rr, 1.3 + (i % 5) * .05, .55 + Math.sin(a) * rr, .095]); }
    S.add(L.blobs(lv, clay2(B.musgo, .9)));
    const nb = rbox(.42, .03, .3, .015, clay2(B.arena, .8)); nb.position.set(-.52, 1.005, 1.05); nb.rotation.y = .3; S.add(nb);
    if (!holdMug) { mug.position.set(.66, 1.11, 1.02); S.add(mug); }
  } else {
    // fondo de estudio: tarima redonda + columna de luz
    const st = mesh(new THREE.CylinderGeometry(1.75, 1.85, .1, 48), clay2('#24365F', .9)); st.position.y = .05; S.add(st);
    const pl = new THREE.PointLight(cfg.accent || '#6E96FF', 1.6, 7, 1.5); pl.position.set(-2.2, 2.6, -2.4); S.add(pl);
  }
  // ---------- contexto del video: pantalla gigante con la foto real del tema + logo de la empresa ----------
  const cover = (im, fx = .5, fy = .5, z = 1.04) => (g, cw, ch) => { const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight) * z, dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    g.fillStyle = '#0b1020'; g.fillRect(0, 0, cw, ch); g.drawImage(im, (cw - dw) * fx, (ch - dh) * fy, dw, dh); };
  let screen = null;
  if (cfg.imageEl) { const SW = desk ? 2.9 : 3.5, SH = desk ? 3.3 : 3.8, f = cfg.focus || [.5, .4];
    screen = mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: L.canvasTex(cover(cfg.imageEl, f[0], f[1]), 880, Math.round(880 * SH / SW)), color: '#c4c4c4' }), false);
    screen.position.set(0, desk ? 4.1 : 4.55, -2.3); S.add(screen);
    const fr = rbox(SW + .18, SH + .18, .1, .06, clay2('#0c1222', .6, .2)); fr.position.set(0, screen.position.y, -2.38); S.add(fr);
    const sl = new THREE.PointLight('#cdd9ff', 1.1, 6.5, 1.6); sl.position.set(0, 3.3, -1.3); S.add(sl); }
  if (cfg.logoEl) { const lt = L.canvasTex((g, cw, ch) => { g.fillStyle = '#F7F5EE'; g.beginPath(); g.roundRect(0, 0, cw, ch, 44); g.fill();
      const im = cfg.logoEl, s = Math.min(cw * .76 / im.naturalWidth, ch * .76 / im.naturalHeight); g.drawImage(im, (cw - im.naturalWidth * s) / 2, (ch - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s); }, 256, 256);
    lt.premultiplyAlpha = false; const lm = new THREE.MeshBasicMaterial({ map: lt, transparent: true });
    if (lid) { const st = mesh(new THREE.PlaneGeometry(.3, .3), lm, false); st.position.set(0, .24, .022); lid.add(st); }
    else { const cd = mesh(new THREE.PlaneGeometry(.62, .62), lm, false); cd.position.set(act === 'explica' ? 1.32 : -1.15, act === 'explica' ? 1.7 : 2.2, -2.2); S.add(cd); } }
  if (act === 'explica') {
    arrow = new THREE.Group(); const am = clay2(OBJ, .7);
    const sh = rbox(.26, 1, .26, .07, am); sh.position.y = .5; const hd = mesh(new THREE.ConeGeometry(.32, .46, 4), am); hd.rotation.y = Math.PI / 4; hd.position.y = 1.22; arrow.add(sh, hd);
    arrow.userData = { sh, hd }; S.add(arrow);
    [0, 1, 2].forEach(i => { const b = rbox(.26, .35 + i * .28, .26, .06, clay2(i === 2 ? OBJ : '#34497A', .85)); b.userData.h = .35 + i * .28; b.position.set(-1.12 + i * .3, 0, -.6); b.name = 'bar' + i; S.add(b); });
  }
  if (act === 'piensa') {
    coin = mesh(new THREE.CylinderGeometry(.34, .34, .09, 36), clay2(B.mostaza, .45, .3)); coin.rotation.x = Math.PI / 2; S.add(coin);
    const rimc = mesh(new THREE.TorusGeometry(.26, .03, 8, 28), clay2('#A8870F', .5, 0), false); rimc.rotation.x = Math.PI / 2; rimc.position.y = .05; coin.add(rimc);
  }
  if (holdMug && !(desk && act === 'hook')) { mug.position.set(0, -.02, .2); U.arms[1].hand.add(mug); }
  else if (holdMug) { mug.position.set(.66, 1.11, 1.02); S.add(mug); }
  if (holdPhone) { phone.rotation.set(-1.9, 0, 0); phone.position.set(0, -.16, .13); U.arms[-1].hand.add(phone); }

  const cam = w.cam, QW = new THREE.Quaternion();
  function shot(lt, d) {                                    // empuje lento de cámara; JP queda en la mitad baja (arriba va el texto)
    const k = eio(clamp(lt / Math.max(1, d)));
    if (desk) { cam.position.set(lerp(.18, .0, k), 2.2, lerp(7.3, 6.8, k)); w.look(0, 2.72, 0); }
    else if (act === 'camina') { cam.position.set(0, 2.1, lerp(10.6, 10.0, k)); w.look(0, 2.95, 0); }
    else { cam.position.set(lerp(-.2, 0, k), 2.15, lerp(8.9, 8.4, k)); w.look(act === 'explica' ? -.12 : 0, 2.92, 0); }
    w.focusOn(U.head);
  }
  const react = (k, tt) => mood === 'up' ? { smile: 1, brow: -.1, armR: [lerp(.9, 2.55, k) + Math.sin(tt * 9) * .14 * k, .8 * k, lerp(1.2, .55, k), 1], bob: Math.abs(Math.sin(tt * 9)) * .05 * k }
    : mood === 'down' ? { smile: lerp(.3, -.9, k), brow: .85 * k, sweat: k > .5, armL: [lerp(.9, 2.25, k), .95 * k, lerp(1.2, 2.1, k), 1], head: [.12 * k, Math.sin(tt * 7) * .13 * k, .1 * k] }
    : { smile: .35, brow: .4 * k, armR: [lerp(.9, 1.75, k), 0, lerp(1.2, 2.45, k), 1], head: [-.05 * k, 0, .14 * k] };

  function update(lt, d) {
    const tt = on2(lt, 12), bl = blink(tt, 3), br = Math.sin(tt * 2.2) * .012;
    let p = {}; jp.position.set(0, 0, 0); jp.rotation.set(0, 0, 0);
    if (desk) {
      const t1 = Math.min(1.25, d * .26), k = back(seg(tt, t1, t1 + .4)), kr = ex(seg(tt, t1 + .35, t1 + 1.0));   // mira la pantalla → voltea a cámara → reacciona
      const ty = Math.sin(tt * 17) * .07, ty2 = Math.sin(tt * 17 + 2) * .07;
      p = { sit: 1, bob: -.2 + br, lean: lerp(.16, .03, k), head: [lerp(.42, -.04, k), 0, 0], lid: lerp(.38, .05, k) + bl, brow: 0, smile: .3,
        armL: [.92 + ty * (1 - k), .1, 1.22, 1], armR: [.92 + ty2 * (1 - k), .1, 1.22, 1], talk: seg(tt, t1 + .05, t1 + .2) * (1 - seg(tt, t1 + .35, t1 + .6)) * .85 };
      if (act === 'cafe') { const ks = eio(seg(tt, .15, .7)) * (1 - eio(seg(tt, t1 - .1, t1 + .35)));                 // sorbo antes de voltear
        p.armR = [lerp(.92, 2.05, ks), .1, lerp(1.22, 2.3, ks), 1]; p.head = [lerp(p.head[0], -.12, ks), 0, 0]; p.lid = Math.max(p.lid, ks * .7); }
      const r = react(kr, tt); if (kr > 0) { const base = p.head; Object.assign(p, r); if (!r.head) p.head = base; p.lid = (mood === 'down' ? .2 : .04) + bl; p.sit = 1; p.bob = -.2 + br + (r.bob || 0);
        if (act === 'cafe' && mood !== 'down') p.armR = [lerp(.92, 1.9, kr), .5 * kr, 1.5, 1]; }
      jp.position.set(0, 0, -.05);
      if (glow) glow.intensity = (.55 + Math.sin(tt * 23) * .12) * (1 + .9 * seg(tt, t1 - .15, t1 + .1) * (1 - .5 * seg(tt, t1 + .3, t1 + 1.2)));
    } else if (act === 'explica') {
      const kg = eio(seg(tt, .35, 1.5)), kl = seg(tt, .15, .6) * (1 - seg(tt, d * .55, d * .55 + .4));              // señala la flecha y vuelve a cámara
      jp.position.set(.3, .1, 0); jp.rotation.y = -.22;
      p = { head: [0, lerp(.1, -.62, eio(kl)), 0], lid: .06 + bl, brow: mood === 'down' ? .6 : -.05, smile: mood === 'down' ? -.3 : .8, bob: br, talk: .2 + .55 * Math.abs(Math.sin(tt * 8.5)) * (1 - kl * .6),
        armL: [.35 + .25 * kg, 1.25 * kg + Math.sin(tt * 4) * .05, .25, 1], armR: [.75 + Math.sin(tt * 5) * .16, .28, 1.35 + Math.sin(tt * 5 + 1) * .2, 1] };
      const up = mood !== 'down', A = arrow.userData, h = lerp(.2, 1.5, kg) + Math.sin(tt * 3) * .03;
      A.sh.scale.y = h; A.sh.position.y = h / 2; A.hd.position.y = h + .2; arrow.position.set(-.8, up ? .12 : 2.75, .1); arrow.rotation.set(up ? 0 : Math.PI, 0, Math.sin(tt * 2.5) * .03);
      [0, 1, 2].forEach(i => { const b = S.getObjectByName('bar' + i), kk = back(seg(tt, .2 + i * .18, .75 + i * .18)), hh = b.userData.h * (up ? 1 : (3 - i) / (i + 1) * .6); b.scale.y = Math.max(.02, kk * hh / b.userData.h); b.position.y = .1 + kk * hh / 2; });
    } else if (act === 'piensa') {
      const k = eio(seg(tt, d * .5, d * .5 + .5));
      p = { head: [lerp(-.28, 0, k), lerp(-.3, 0, k), lerp(.12, 0, k)], lid: .1 + bl, brow: lerp(.5, .1, k), smile: lerp(.2, .9, k), bob: br, armR: [1.72, .05, 2.5, 1], armL: [.5, .2, 1.5, 1] };
      coin.position.set(-.85, 3.05 + Math.sin(tt * 2.4) * .08, .2); coin.rotation.set(Math.PI / 2, 0, tt * 2.6);
    } else if (act === 'camina') {
      const kw = seg(tt, 0, Math.min(1.5, d * .4)), x = lerp(-2.3, 0, ex(kw)), stop = kw >= 1, kk = ex(seg(tt, Math.min(1.5, d * .4), Math.min(1.5, d * .4) + .35));
      jp.position.x = x; jp.rotation.y = lerp(1.05, 0, kk);
      p = stop ? { lid: .06 + bl, smile: 1, brow: .2, bob: br, armR: [.3, 2.35 + Math.sin(tt * 10) * .28, .45, 1], head: [0, 0, .06] } : { walk: tt * 9, amp: .6, lid: .1 + bl, smile: .7 };
    } else if (act === 'telefono') {
      const t1 = Math.min(1.3, d * .3), k = back(seg(tt, t1, t1 + .4)), kr = ex(seg(tt, t1 + .35, t1 + 1.0));
      p = { head: [lerp(.5, -.03, k), lerp(-.18, 0, k), 0], lid: lerp(.4, .05, k) + bl, smile: .3, bob: br, armL: [1.05, .05, 1.75, 1], armR: [.1, .16, .3, 1] };
      const r = react(kr, tt); if (kr > 0) { const hd = p.head, al = p.armL; Object.assign(p, r); if (!r.head) p.head = hd; p.armL = al; p.lid = .05 + bl; p.bob = br + (r.bob || 0);
        if (mood !== 'up') p.armR = [lerp(.1, 2.25, kr), .95 * kr, lerp(.3, 2.1, kr), 1]; }
    } else {                                                 // cierre: se encoge de hombros con la pregunta y luego señala a cámara
      const t1 = Math.max(1.1, d * .45), ks = eio(seg(tt, .2, .7)) * (1 - eio(seg(tt, t1 - .25, t1 + .1))), kp = back(seg(tt, t1, t1 + .4));
      p = { head: [0, 0, lerp(0, .16, ks)], lid: .06 + bl + (kp > .9 && (tt - t1) % 2.4 < .16 ? 0 : 0), brow: -.12, smile: lerp(.45, 1, kp), bob: br + ks * .04,
        talk: ks * .5 * Math.abs(Math.sin(tt * 8)),
        armL: [lerp(0, .55, ks), lerp(.14, .75, ks), lerp(.1, 1.75, ks), 1],
        armR: [lerp(lerp(0, .55, ks), 1.48, kp), lerp(lerp(.14, .75, ks), .02, kp), lerp(lerp(.1, 1.75, ks), .12, kp), 1] };
      if (holdMug) p.armR = [lerp(.95, 1.25, kp), .12, 1.45, 1], p.armL = [lerp(lerp(0, .55, ks), 1.48, kp), lerp(lerp(.14, .75, ks), .02, kp), lerp(lerp(.1, 1.75, ks), .12, kp), 1];
    }
    p.lid = (p.lid ?? .1) - .3;                              // JP tiene los ojos bien abiertos (parpadea con blink)
    pose(jp, p); shot(lt, d);
    if (mug.parent && mug.parent !== S) { jp.updateMatrixWorld(true); mug.parent.getWorldQuaternion(QW); mug.quaternion.copy(QW.invert()); }   // la taza siempre derecha
  }
  return { w, update, look, act, mood };
}
