// Anthropic sale a la bolsa — short 3D de contexto · motor narrativo: EL DESMONTAJE
// Datos verificados: 424(b)(4) ante la SEC + cierre de Yahoo Finance, 19 nov 2026. Ver guion.md.
// Sin logotipos reales dentro del mundo 3D (regla de la casa).
//
// GEOMETRÍA (fov 30, vertical 9:16). EL ANCHO ES LO QUE MANDA:
//   alto_del_cuadro  = 0.536  x distancia
//   ANCHO_del_cuadro = 0.3015 x distancia   ← 1.78 veces menor que el alto
//   → distancia = ancho_del_objeto / (0.3015 x fracción_que_debe_ocupar)
// Por eso ningún objeto de este mundo pasa de ~4.8 de ancho.

const P  = (lt, s) => lt / (s.t1 - s.t0);
const mv = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const cam = (w, pos, tgt, fov) => { w.cam.position.set(...pos); w.cam.lookAt(...tgt);
  if (fov && Math.abs(w.cam.fov - fov) > .01) { w.cam.fov = fov; w.cam.updateProjectionMatrix(); } };

// paleta con significado fijo (20 nov 2026): el problema en terracota, lo que lo resuelve en mostaza
const TERRA = '#BB6F58', MOSTAZA = '#C7A317', ARENA = '#EBE6BA', AZUL = '#4173D1', GRIS = '#9AA3B8', TINTA = '#0A0A0A';

const INVER = { shirt: '#4173D1', pants: '#2B3A55', shoes: '#DADADA', hair: '#2E2118', hairStyle: 'short', seed: 23 };
const JPC   = { shirt: '#BB6F58', pants: '#2B3A55', shoes: '#F2F0E8', hair: '#1E1710', hairStyle: 'short', collar: 'crew', seed: 5 };

// ANT el día del debut: colocación 83 → apertura 111.50 → máx 115.10 → cierre 97.17
const PRECIO = [83, 111.5, 115.1, 109, 103.5, 99.4, 101.2, 98.3, 97.17];

// gráfica anclada a la IZQUIERDA: escalando el grupo en x la línea se va trazando
const grafica = (L, w, h, pts, col, bg) => {
  const pl = L.plaque(w, h, (g, W2, H2) => {
    g.fillStyle = bg; g.fillRect(0, 0, W2, H2);
    g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2;
    for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(0, H2 * i / 4); g.lineTo(W2, H2 * i / 4); g.stroke(); }
    const mn = 76, mx = 122, r = mx - mn;
    const X = i => 26 + i * (W2 - 56) / (pts.length - 1), Y = v => H2 - 30 - ((v - mn) / r) * (H2 - 62);
    g.strokeStyle = 'rgba(255,255,255,.34)'; g.lineWidth = 3; g.setLineDash([11, 10]);
    g.beginPath(); g.moveTo(0, Y(83)); g.lineTo(W2, Y(83)); g.stroke(); g.setLineDash([]);
    g.fillStyle = 'rgba(255,255,255,.5)'; g.font = '700 26px "Space Grotesk"'; g.textAlign = 'left';
    g.fillText('colocación  $83', 30, Y(83) - 14);
    g.strokeStyle = col; g.lineWidth = 11; g.lineJoin = 'round'; g.lineCap = 'round';
    g.beginPath(); pts.forEach((v, i) => i ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v))); g.stroke();
  }, 760);
  pl.material.transparent = true; pl.material.depthWrite = false;
  const grp = new L.THREE.Group(); pl.position.x = w / 2; grp.add(pl); return grp;
};

const torre = (L, n, anc, alt, col, x, z) => {
  const g = new L.THREE.Group(); g.position.set(x, 0, z);
  for (let i = 0; i < n; i++) { const b = L.rbox(anc, alt * .84, anc, .04, L.clay2(col, .62));
    b.position.y = alt * (i + .5); b.scale.setScalar(.001); g.add(b); }
  return g;
};

const worlds = {
  // ───────────── A · EL PISO (azul noche) · escenas 1–4 ─────────────
  piso(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#1B2742', bg2: '#0A0F1E', floor: '#28314C', fog: [30, 90], hemi: .5,
      sky: '#9DB4FF', ground: '#232A40', key: 2.7, keyPos: [-9, 13, 10], keyCol: '#CFE0FF',
      rim: 2.3, rimPos: [8, 9, -5], rimCol: '#8FA8FF', fill: .42 });
    // FONDO: muro + tablero de 4.4 de ancho (a d=16 ocupa el 91% del ancho del cuadro)
    const muro = rbox(22, 14, .5, .1, clay2('#141C33', .9)); muro.position.set(0, 6.5, -9.6); w.scene.add(muro);
    const marco = rbox(4.78, 3.18, .26, .08, clay2('#0A101E', .66)); marco.position.set(0, 4.7, -9.25); w.scene.add(marco);
    const linea = grafica(L, 4.4, 2.8, PRECIO, MOSTAZA, '#0A101E');
    linea.position.set(-2.2, 4.7, -9.06); linea.scale.x = .001; w.scene.add(linea);
    // MEDIO: el inversionista, a un lado para no tapar el tablero
    const inv = L.actor(INVER); inv.position.set(-2.35, 0, -7.4); inv.rotation.y = Math.PI * .95; w.scene.add(inv);
    // las dos columnas del récord (escena 2): juntas miden 4.3 de ancho
    const cSx = torre(L, 5, .92, .50, GRIS, -1.12, -6.2);
    const cAn = torre(L, 6, .92, .50, AZUL,  1.12, -6.2); w.scene.add(cSx); w.scene.add(cAn);
    const eti = (txt, ink) => { const e = L.label3d(txt, 1.42, .68, { bg: null, ink, font: '800 40px Unbounded', pw: 430 });
      e.material.transparent = true; e.material.depthWrite = false; e.scale.setScalar(.001); w.scene.add(e); return e; };
    const eSx = eti('SpaceX\n$75 mil M', GRIS), eAn = eti('ANT\n$81.3 mil M', '#BFD2FF');
    eSx.position.set(-1.12, 2.92, -6.0); eAn.position.set(1.12, 3.42, -6.0);
    // la plancha de periódico que CAE y tapa el tablero (escena 4): 3.9 de ancho
    const diario = new THREE.Group(); diario.position.set(0, 4.8, -8.5); diario.scale.setScalar(.001); w.scene.add(diario);
    diario.add(rbox(3.9, 2.5, .14, .05, clay2('#EDE7D4', .92)));
    const dtx = L.plaque(3.62, 2.24, (g, W2, H2) => {
      g.fillStyle = '#EDE7D4'; g.fillRect(0, 0, W2, H2);
      g.strokeStyle = 'rgba(20,20,20,.18)'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(34, 70); g.lineTo(W2 - 34, 70); g.stroke();
      g.textAlign = 'center'; g.fillStyle = '#2A2620'; g.font = '600 22px "Space Grotesk"'; g.letterSpacing = '6px';
      g.fillText('LOS TITULARES', W2 / 2, 48); g.letterSpacing = '0px';
      // 9 caracteres x 0.62 x 92 = 513 px sobre un lienzo de 620: cabe
      g.fillStyle = TERRA; g.font = '800 92px Unbounded'; g.fillText('SUBIÓ 17%', W2 / 2, H2 / 2 + 18);
      g.fillStyle = 'rgba(20,20,20,.45)'; g.font = '600 22px "Space Grotesk"';
      g.fillText('la cifra que repitió casi todo el mundo', W2 / 2, H2 - 40);
    }, 620);
    dtx.position.z = .09; diario.add(dtx);
    // PRIMER PLANO: esquina de escritorio con una pantallita, pegada a cámara
    const esq = rbox(3.4, .18, 2.2, .06, clay2('#1C2640', .5)); esq.position.set(2.9, 1.25, 4.6); w.scene.add(esq);
    const mon = rbox(1.3, .82, .09, .04, clay2('#0A101E', .5)); mon.position.set(2.7, 1.75, 4.1); mon.rotation.y = -.35; w.scene.add(mon);
    return { ...w, linea, inv, cSx, cAn, eSx, eAn, diario };
  },

  // ───────────── B · LA TORRE (beige cálido) · escenas 5–6 ─────────────
  torreM(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#E6DFBE', bg2: '#C2B488', floor: '#B5A480', fog: [38, 110], hemi: .56,
      key: 3.0, keyPos: [-10, 15, 11], keyCol: '#FFEFD6', rim: 2.2, rimPos: [8, 10, -5], rimCol: '#FFE2B8', fill: .44 });
    const muro = rbox(26, 20, .5, .1, clay2('#DAD0AB', .95)); muro.position.set(0, 9, -11); w.scene.add(muro);
    // 20 bloques de 1.5 de ancho x 0.52: la torre mide 10.4 de alto (a d=24 ocupa el 81% del ALTO)
    const T = new THREE.Group(); T.position.set(.5, 0, -2.0); w.scene.add(T);
    const bloques = [];
    for (let i = 0; i < 20; i++) {
      const b = rbox(1.5, .44, 1.5, .05, clay2(i < 2 ? MOSTAZA : TERRA, .62));
      b.position.y = .26 + i * .52; b.scale.setScalar(.001); T.add(b); bloques.push(b); }
    const rot = L.label3d('PÉRDIDA NETA\n$104,039 M', 3.0, 1.18, { bg: null, ink: '#4A3A2A', font: '800 48px Unbounded', pw: 620 });
    rot.material.transparent = true; rot.material.depthWrite = false;
    rot.position.set(.5, 10.5, -1.85); rot.scale.setScalar(.001); w.scene.add(rot);
    const inv = L.actor(INVER); inv.position.set(-2.3, 0, -.9); inv.rotation.y = .55; w.scene.add(inv);
    // PRIMER PLANO: monedas sobre una mesa, pegadas a cámara
    const mesa = rbox(4, .18, 2.2, .06, clay2('#8A5F45', .6)); mesa.position.set(3.4, 1.2, 4.6); w.scene.add(mesa);
    for (let i = 0; i < 6; i++) { const c = L.mesh(new THREE.CylinderGeometry(.22, .22, .06, 20), clay2(MOSTAZA, .42));
      c.position.set(2.6 + (i % 3) * .55, 1.32 + Math.floor(i / 3) * .07, 4.2 + (i % 2) * .5); w.scene.add(c); }
    return { ...w, T, bloques, rot, inv };
  },

  // ───────────── C · EL MOSTRADOR (claro) · escenas 7–9 ─────────────
  mostrador(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#F7F3E4', bg2: '#E4DCC2', floor: '#D6CBA8', fog: [45, 130], hemi: .74,
      key: 3.3, keyPos: [-8, 14, 9], keyCol: '#FFF6E6', rim: 2.0, rimPos: [7, 9, -5], fill: .52 });
    // mesa de 3.4 de ancho: a d=12 ocupa el 94% del ancho del cuadro
    const mesa = rbox(3.4, .28, 3.4, .08, clay2('#C6B58A', .6)); mesa.position.set(0, 1.5, 0); w.scene.add(mesa);
    [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]].forEach(([a, b]) => {
      const lg = rbox(.24, 1.5, .24, .06, clay2('#A8946C', .7)); lg.position.set(a, .75, b); w.scene.add(lg); });
    // Una HOJA sobre la mesa con las dos barras y sus letreros dibujados en el mismo lienzo:
    // un solo objeto, legible desde arriba. (Las monedas contables no servían: nadie distingue 20 de 19,
    // y el dato real no es contar, es comparar −224 contra −3.)
    const hoja = (frac) => { const pl = L.plaque(2.9, 2.0, (g, W2, H2) => {
      g.fillStyle = '#F4EFDC'; g.fillRect(0, 0, W2, H2);
      const x0 = 46, anc = W2 - 92, esc = v => anc * v / 224;
      // sin título propio: el rótulo 2D ya dice "de cada $100". El valor va ARRIBA de la barra,
      // no al final, porque la barra larga llega al borde y se lo comía.
      g.textAlign = 'left';
      const fila = (y, etq, val, w, col) => {
        g.fillStyle = '#4A3A2A'; g.font = '700 32px "Space Grotesk"'; g.fillText(etq, x0, y - 22);
        g.fillStyle = col; g.font = '800 46px Unbounded'; g.textAlign = 'right';
        g.fillText(val, W2 - 46, y - 16); g.textAlign = 'left';
        g.fillStyle = 'rgba(74,58,42,.12)'; g.fillRect(x0, y, anc, 62);
        g.fillStyle = col; g.fillRect(x0, y, Math.max(5, esc(w) * frac), 62); };
      fila(132, 'Hace un año perdía', '−$224', 224, TERRA);
      fila(330, 'Ahora pierde',       '−$3',     3, TERRA);
      g.fillStyle = 'rgba(74,58,42,.55)'; g.font = '600 26px "Space Grotesk"';
      g.fillText('misma escala · 424(b)(4) ante la SEC', x0, H2 - 38);
    }, 740); pl.material.transparent = true;
      // PLACA VERTICAL de frente a cámara, no acostada: un plano tumbado sobre la mesa no se lee
      // (y con cámara cenital ni siquiera renderiza). Es la misma corrección que las cartas de Kahneman.
      pl.position.set(0, 3.05, -1.6); return pl; };
    const papel = hoja(1); papel.material.opacity = 0; w.scene.add(papel);
    const atril = rbox(3.1, .12, .5, .04, clay2('#C6B58A', .6)); atril.position.set(0, 1.74, -1.45); w.scene.add(atril);
    const jp = L.actor(JPC); jp.position.set(.1, 0, 3.1); jp.rotation.y = .05; jp.scale.setScalar(.001); w.scene.add(jp);
    return { ...w, papel, jp };
  },
};

// rótulo con autoajuste; `dos` = remate en DOS TIEMPOS (la última línea entra después, en acento)
const head = (L, k1, title, sub, ink, lt, col, pronto, dos) => {
  L.kicker(k1, 360, L.seg(lt, pronto ? .02 : .1, pronto ? .3 : .5), ink);
  const largo = Math.max(...title.map(l => l.length));
  const ts = largo > 18 ? Math.max(54, Math.floor(78 * 18 / largo)) : 78;
  title.forEach((ln, i) => { const t0 = (pronto ? .04 : .25) + i * (dos && i ? .3 : .1);
    L.rise(ln, 90, 470 + i * 96, L.seg(lt, t0, t0 + .36),
      { f: L.F.d, w: 800, s: ts, c: i === title.length - 1 && col ? col : ink }); });
  if (sub) L.rise(sub, 90, 470 + title.length * 96 - 24, L.seg(lt, pronto ? .74 : .7, pronto ? 1.16 : 1.2),
    { s: sub.length > 46 ? Math.max(27, Math.floor(38 * 46 / sub.length)) : 38, c: ink, a: .8 });
};

const scenes = [
  // 1 · GANCHO — DETALLE de la línea (d≈2.4) que se abre a GENERAL (d≈16). Texto desde el cuadro 1, en dos tiempos.
  { id: 'gancho', world: 'piso', d: 7, ink: ARENA, year: '2026', sfx: [[.02, 'ticks', .5, .35], [.55, 'whoosh', .7]],
    cap: 'Le quitó el récord a SpaceX. Abrió ganando 34%… y cerró ganando 17.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.linea.scale.x = 1;                                   // ya trazada: el detalle abre sobre la caída
      const k = L.eio(L.seg(p, .26, 1));
      cam(w, mv([1.05, 4.58, -6.1], [0, 4.9, 6.9], k), mv([1.05, 4.58, -9.06], [0, 3.6, -7.4], k), 30);
      L.pose(w.inv, { head: [0, 0, 0], armL: [.1, .12, .1], armR: [.1, .12, .1], bob: Math.sin(q * 1.6) * .012 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .66);
      head(L, 'ANTHROPIC · 19 DE NOVIEMBRE DE 2026', ['Le quitó el récord', 'a SpaceX'], null, ARENA, p, null, true, true);
      L.rise('ABRIÓ EN +34%  ·  CERRÓ EN +17%', 90, 690, L.seg(p, .42, .66), { f: L.F.d, w: 800, s: 44, c: MOSTAZA });
    } },

  // 2 · EL RÉCORD — ENTERO EN PICADO (d≈16, +30°). Dos columnas crecen; la de ANT rebasa a la de SpaceX.
  { id: 'record', world: 'piso', d: 8, ink: ARENA, year: '2026', trans: 'cont',
    sfx: [[.14, 'thud', .6], [.46, 'thud', .6], [.72, 'rise', .7]],
    cap: 'El 19 de noviembre de 2026, Anthropic salió a la bolsa y levantó 81 mil millones de dólares. Nunca una empresa había levantado tanto.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.linea.scale.x = Math.max(.001, 1 - L.seg(p, 0, .18));   // la gráfica se apaga: aquí manda el récord
      const k = L.eio(L.seg(p, 0, .34));                        // llega RÁPIDO a las columnas
      cam(w, mv([0, 4.9, 6.9], [0, 4.6, 5.4], k), mv([0, 3.6, -7.4], [0, 2.25, -6.2], k), 30);
      const sub = (g, kk) => g.children.forEach((b, i) => b.scale.setScalar(Math.max(.001, L.back(L.seg(kk, i * .12, i * .12 + .3)))));
      sub(w.cSx, L.seg(p, .12, .52)); sub(w.cAn, L.seg(p, .36, .84));
      [[w.eSx, .42], [w.eAn, .68]].forEach(([e, t0]) => e.scale.setScalar(Math.max(.001, L.back(L.seg(p, t0, t0 + .2)))));
      L.pose(w.inv, { head: [0, .3, 0], bob: Math.sin(q * 1.6) * .012 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .64);
      head(L, 'LA MÁS GRANDE DE LA HISTORIA', ['81,300 millones', 'de dólares'], 'Le ganó el récord a SpaceX, de junio', ARENA, p, MOSTAZA);
    } },

  // 3 · LOS PRECIOS — MEDIO sobre el tablero (d≈16). La línea sube a 111 y se cae a 97.
  { id: 'precios', world: 'piso', d: 8, ink: ARENA, year: '2026', trans: 'cont',
    sfx: [[.2, 'rise', .6], [.54, 'fall', .7]],
    cap: 'Vendió sus acciones en 83 dólares. Abrieron en 111 y cerraron en 97.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.linea.scale.x = L.eio(L.seg(p, .18, .62));              // vuelve a trazarse cuando se habla de precios
      [w.cSx, w.cAn].forEach(g => g.children.forEach(b => b.scale.setScalar(Math.max(.001, 1 - L.seg(p, 0, .2)))));
      [w.eSx, w.eAn].forEach(e => e.scale.setScalar(Math.max(.001, 1 - L.seg(p, 0, .16))));
      const k = L.eio(L.seg(p, .06, .96));
      cam(w, mv([0, 4.6, 5.4], [0, 4.8, 6.6], k), mv([0, 2.25, -6.2], [0, 4.7, -9.1], k), 30);
      L.pose(w.inv, { head: [0, 0, 0], bob: Math.sin(q * 1.6) * .012 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .64);
      head(L, 'EL DÍA DEL DEBUT', ['Colocó en $83.', 'Abrió en $111.50'], 'Cerró su primer día en $97.17', ARENA, p, MOSTAZA);
    } },

  // 4 · EL TITULAR — CONTRAPICADO (d≈15, +18°): la plancha de periódico CAE y tapa el tablero.
  { id: 'titular', world: 'piso', d: 7, ink: ARENA, year: '2026', trans: 'cont',
    sfx: [[.26, 'whoosh', .7], [.44, 'thud', .9]],
    cap: 'Casi todos los titulares se quedaron con ese 17%.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t); w.linea.scale.x = 1;
      const k = L.eio(L.seg(p, 0, .72));
      cam(w, mv([0, 4.8, 6.6], [0, 1.1, 5.4], k), mv([0, 4.7, -9.1], [0, 5.6, -8.9], k), 30);
      const cae = L.eio(L.seg(p, .24, .48));
      w.diario.scale.setScalar(1); w.diario.position.y = L.lerp(13, 4.8, cae); w.diario.rotation.z = (1 - cae) * .05;
      L.pose(w.inv, { head: [-.25, 0, 0], lean: -.05, bob: Math.sin(q * 1.6) * .012 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 980, .6);
      head(L, 'LO QUE SE CONTÓ', ['Casi todos se', 'quedaron con eso'], null, ARENA, p, TERRA);
    } },

  // 5 · LA TORRE — GENERAL (d≈24): se construye bloque a bloque; el inversionista es la referencia de tamaño.
  { id: 'torre', world: 'torreM', d: 9, ink: TINTA, year: '2026', sfx: [[.1, 'ticks', .55, .55], [.82, 'thud', .7]],
    cap: 'Pero en el documento que entregó a la bolsa hay otra cifra: perdió 104 mil millones de dólares en nueve meses.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([-1.3, 6.6, 25.5], [.5, 7.0, 22.4], k), mv([.5, 7.1, -2], [.5, 7.4, -2], k), 30);
      const cre = L.seg(p, .16, .9);
      w.bloques.forEach((b, i) => b.scale.setScalar(Math.max(.001, L.back(L.seg(cre, i * .042, i * .042 + .15)))));
      w.rot.scale.setScalar(Math.max(.001, L.back(L.seg(p, .86, 1))));
      L.pose(w.inv, { head: [-.45, .25, 0], lean: -.04, bob: Math.sin(q * 1.6) * .012 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .5, '240,233,205');
      head(L, 'LO QUE DICE EL DOCUMENTO', ['Perdió $104,039', 'millones'], 'En los primeros nueve meses de 2026', TINTA, p, TERRA);
    } },

  // 6 · EL HUMO — ENTERO (d≈12). EL MOMENTO: 18 de 20 bloques se vuelven translúcidos y se van. Quedan 2, en mostaza.
  { id: 'humo', world: 'torreM', d: 9, ink: TINTA, year: '2026', trans: 'cont', sfx: [[.2, 'whoosh', .6], [.58, 'shine', .8]],
    cap: 'De esa cifra, 94 mil millones nunca salieron de la caja. Son un ajuste en los libros. Nadie firmó un cheque.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const k = L.eio(L.seg(p, 0, .9));
      cam(w, mv([.5, 7.0, 22.4], [.3, 3.1, 11.6], k), mv([.5, 7.4, -2], [.5, 1.9, -2], k), 30);
      w.rot.scale.setScalar(Math.max(.001, 1 - L.seg(p, 0, .14)));
      w.bloques.forEach((b, i) => {
        b.scale.setScalar(1); b.material.transparent = true;
        if (i < 2) { b.material.opacity = 1; return; }
        const kk = L.eio(L.seg(p, .18 + (i - 2) * .025, .18 + (i - 2) * .025 + .3));
        b.material.opacity = 1 - kk * .93;
        b.position.y = .26 + i * .52 + kk * (1.8 + i * .18);
        b.position.x = Math.sin(i * 1.7) * kk * 1.1; b.rotation.z = Math.sin(i * .9) * kk * .55;
        b.scale.setScalar(Math.max(.001, 1 - kk * .3));
      });
      L.pose(w.inv, { head: [-.15, .3, 0], armL: [.55, .3, .5], armR: [.55, .3, .5], bob: Math.sin(q * 1.6) * .012 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .52, '240,233,205');
      head(L, 'DE ESOS $104,039 M', ['$94,300 millones', 'nunca salieron'], 'Un ajuste en los libros: nadie firmó un cheque', TINTA, p, MOSTAZA);
    } },

  // 7 · EL NEGOCIO — CENITAL (d≈12, recto hacia abajo): entran 100 monedas, salen 97.
  { id: 'negocio', world: 'mostrador', d: 8, ink: TINTA, year: '2026', sfx: [[.14, 'coins', .7], [.58, 'coins', .55]],
    cap: '¿Y el negocio? De cada 100 dólares que vendió, perdió 3. Un año antes perdía 224.',
    update(w, lt, t, L) {
      const p = P(lt, this);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([0, 5.5, 9.4], [0, 4.5, 8.2], k), mv([0, 4.15, -1.6], [0, 3.95, -1.6], k), 30);
      const ap = L.eio(L.seg(p, .12, .46));                      // la hoja aterriza en la mesa
      w.papel.material.opacity = ap; w.papel.scale.setScalar(L.lerp(.9, 1, ap));
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .46, '243,239,224');
      head(L, 'EL RESULTADO DEL NEGOCIO', ['De cada $100,', 'perdió $3'], 'Un año antes perdía $224 de cada $100', TINTA, p, MOSTAZA);
    } },

  // 8 · LA LECCIÓN — PRIMER PLANO. El ancho manda: la cara mide 1.35, así que d≈7.5 con fov 24 (NO 3.7).
  { id: 'leccion', world: 'mostrador', d: 7, ink: TINTA, year: '2026', trans: 'cont', sfx: [[.1, 'pop', .5]],
    cap: 'La utilidad neta te dice qué quedó hasta abajo. No te dice cómo va el negocio.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = L.talkAt(L.CAPS, q);
      w.papel.material.opacity = Math.max(0, 1 - L.seg(p, 0, .2));
      w.jp.scale.setScalar(Math.max(.001, L.back(L.seg(p, .04, .3))));
      const k = L.eio(L.seg(p, 0, .88));
      cam(w, mv([0, 4.5, 8.2], [.15, 2.2, 10.4], k), mv([0, 3.95, -1.6], [.1, 2.12, 3.1], k), L.lerp(30, 24, k));
      L.pose(w.jp, { talk, head: [0, -.03, 0], armL: [.12, .14, .12], armR: [.12, .14, .12], smile: .3, bob: Math.sin(q * 1.6) * .014 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 300, 1010, .52, '243,239,224');
      head(L, 'LO QUE NO TE DICE', ['La utilidad neta', 'no es el negocio'], null, TINTA, p, MOSTAZA);
    } },

  // 9 · CIERRE CON PREGUNTA (convención de la casa) + el conflicto de interés EN PANTALLA
  { id: 'pregunta', world: 'mostrador', d: 7, ink: TINTA, year: '2026', trans: 'cont', sfx: [[.08, 'shine', .5]],
    cap: '¿Cuántas veces te has quedado solo con el titular?',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t), talk = L.talkAt(L.CAPS, q);
      w.jp.scale.setScalar(1);
      const k = L.eio(L.seg(p, 0, 1));
      cam(w, mv([.15, 2.2, 10.4], [.1, 2.45, 11.6], k), mv([.1, 2.12, 3.1], [.1, 1.9, 3.1], k), L.lerp(24, 30, k));
      L.pose(w.jp, { talk, head: [0, .02, 0], smile: .45, bob: Math.sin(q * 1.6) * .014 });
    },
    overlay(lt, t, L, s) { const p = lt / (s.t1 - s.t0);
      L.scrim(L.C, 240, 1920, .64, '243,239,224');
      ['¿Cuántas veces te has', 'quedado solo con', 'el titular?'].forEach((ln, i) =>
        L.rise(ln, 540, 520 + i * 86, L.seg(p, .06 + i * .1, .5 + i * .1), { f: L.F.s, w: 600, s: 66, c: TINTA, al: 'center', it: 1 }));
      L.rise('Desde la costa, todo se ve con claridad.', 540, 886, L.seg(p, .44, .82), { s: 32, c: TINTA, a: .72, al: 'center' });
      L.rise('Guion asistido por Claude, producto de Anthropic.', 540, 1714, L.seg(p, .56, .9), { s: 23, c: TINTA, a: .62, al: 'center' });
      L.rise('Contenido educativo. No es asesoría financiera.', 540, 1750, L.seg(p, .6, .94), { s: 23, c: TINTA, a: .62, al: 'center' });
    } },
];

export default { id: '2026-11-20-ANT-short3d', title: 'Anthropic sale a la bolsa', tail: 1.3, worlds, scenes };
