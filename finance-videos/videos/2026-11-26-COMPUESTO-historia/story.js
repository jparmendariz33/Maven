// El interés compuesto: $5 al día durante 40 años — historia 3D "Costa Diorama v2"
// PUENTE al largo del domingo 29: "Cómo empezar a invertir desde cero en México".
// Guion aprobado por JP el 27 nov 2026: videos/2026-11-26-COMPUESTO-historia/guion.md
//
// MOTOR: el contador. Dos fichas fijas arriba (AÑOS / VALOR) que suben con la voz, y el mundo cambia de
// escala para que la gráfica quepa. La gráfica es una ESCALERA que el personaje sube (convención de la
// casa: lo que crece año con año se cuenta subiendo escaleras).
//
// ARITMÉTICA: $160/mes, 10% anual compuesto, 40 años → $1,011,853. Aportado $76,800 (7.6%).
// El 10% es un SUPUESTO nuestro: va rotulado "supone 10% anual · ilustrativo" en las 10 escenas.
// ESCALA DEL MUNDO: 1 unidad = $50,000. Año 40 = 20.24 unidades de alto.
//
// CORRECCIONES DE JP (27 nov, 2a pasada) — y dónde vive cada una:
//  1. El texto nunca encima de nada  → TEXTO + encuadra(): la franja de arriba es del rótulo y la
//     cámara mete la acción en la mitad de abajo. NINGUNA escena pone la cámara a mano.
//  2. Las columnas son dinero        → texBillete(): billetes con "$" repetidos en toda la columna.
//  3. "los dorados pagan más dorados" → fuera. Ahora "los intereses generan intereses" (guion v5).
//  4. Mirada                         → MIRA_CAMARA / MIRA_SUBIENDO: de perfil cuando trepa, a cámara
//     solo cuando llega a un hito.
//  5. La multitud flotaba            → la cima del año 40 es un descanso de 4.2 x 4.6 con terraza.
//  6. Textos encimados en el cierre  → la escena 9 ya no lleva rótulo 2D (el pizarrón ES el texto) y
//     en la 10 el pizarrón se va antes de que entre la pregunta.
//  7. La casa antes que el coche     → un hito, una vez puesto, NO se vuelve a esconder.
//  8. Los edificios parecían linternas → texVentana(): rejilla de ventanas, con unas apagadas.

const P = (lt, s) => lt / (s.t1 - s.t0);
const mixv = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const mix = (a, b, k) => a + (b - a) * k;
const cam = (w, pos, tgt) => { w.cam.position.set(...pos); w.cam.lookAt(...tgt); };

// ---------------------------------------------------------------- la aritmética, en el código
const TASA = 0.10 / 12, CUOTA = 160, U = 50000, PASO = 0.45;
const VAL = y => CUOTA * ((Math.pow(1 + TASA, 12 * y) - 1) / TASA);
const ALT = y => VAL(y) / U;                                  // alto total de la barra del año y
const VERDE = y => Math.min(CUOTA * 12 * y, VAL(y)) / U;      // la parte que pusiste tú
const X = y => (y - 1) * PASO;                                // dónde cae el año y en el eje
const HITOS = { coche: 5, casa: 18, barco: 31, millon: 40 };
const ES_HITO = y => Object.values(HITOS).includes(y);

// Un descanso ancho corre el centro del grupo: ANCHO(y) y CX(y) son la única verdad sobre dónde está
// cada barra. (La lección de CLAUDE.md: un grupo que se escala o se corre NO mide lo que crees.)
const ANCHO_BARRA = .38, ANCHO_DESCANSO = 4.0, ANCHO_CIMA = 4.2;
const ANCHO = y => y === 40 ? ANCHO_CIMA : ES_HITO(y) ? ANCHO_DESCANSO : ANCHO_BARRA;
const FONDO = y => y === 40 ? 5.6 : ES_HITO(y) ? 5.0 : 3.0;   // hondas: caben tres planos
const Z_CAMINA = 1.1;      // sobre la barra (fondo 3.0 => -1.5..1.5) y MUY por delante de los hitos
const Z_HITO_ATRAS = -2.5; // los hitos pegados al fondo del descanso (5.0 => -2.5..2.5)
const CX = y => X(y) + (ANCHO(y) - ANCHO_BARRA) / 2;          // centro real del descanso
const DER = CX(40) + ANCHO_CIMA / 2;                          // borde derecho de la gráfica
const MEDIO = (-ANCHO_BARRA / 2 + DER) / 2;                   // centro de la gráfica entera

// ---------------------------------------------------------------- ZONA SEGURA DEL TEXTO
// El rótulo 2D vive en la franja de arriba (fichas en y 272, rótulo hasta y ~900 de 1920). Nada de la
// maqueta puede entrar ahí. Con fov 30 vertical: alto_de_cuadro = 0.536·d y ancho = 0.3015·d.
// encuadra() despeja esa franja SOLA: calcula la distancia y hacia dónde apunta la cámara para que la
// acción quepa completa en la mitad de abajo. Ninguna escena vuelve a poner la cámara a ojo.
const TEXTO = .49;
function encuadra(w, { cx, yBot, yTop, ancho, aire = 1.15, texto = TEXTO, tilt = 0, cz = 0 }) {
  const d = Math.max(((yTop - yBot) * aire) / (.536 * (1 - texto)), ancho / .3015);
  const yc = (yBot + yTop) / 2 + .536 * d * texto / 2;        // centra la acción en la franja libre
  cam(w, [cx, yc + tilt, cz + d], [cx, yc, cz]);
  return d;
}

// ---------------------------------------------------------------- miradas (corrección 4 de JP)
// yaw 0 = de frente a cámara; yaw negativo = mira hacia donde camina (+x).
const MIRA_CAMARA = -.12;
// rotation.y POSITIVO mira hacia +x (la dirección en la que sube). Lo tenía en negativo y caminaba
// de espaldas. La cabeza se gira al REVÉS que el cuerpo, para que se le siga viendo la cara.
const CUERPO_SUBE = .55, MIRA_SUBIENDO = -.30;
// Cuánto mide de verdad: cuello 1.62 + radio de la cabeza .62 + pelo. NO es 1.95.
const ALTO_PERSONA = 2.35;

const AHORRADOR = { shirt: '#3E7A5E', pants: '#2E3A47', shoes: '#E8E3D8', hair: '#2A1D14', hairStyle: 'short', seed: 31 };
const MIRON = s => ({ shirt: ['#5B6B8C', '#7E6A54', '#6B5B7E', '#4A6B6B', '#8C6B5B'][s % 5], pants: '#2E3240', shoes: '#DADADA', hair: '#241A12', hairStyle: s % 2 ? 'short' : 'side', seed: 40 + s });

const worlds = {
  // UN SOLO MUNDO que cambia de escala: la escalera crece y la cámara se aleja (escenas 1–8)
  camino(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#2A3B4D', bg2: '#16222E', floor: '#3A5468', fog: [60, 440],
      hemi: .55, key: 3.1, keyPos: [-16, 22, 18], keyCol: '#FFE9C4', rim: 2.0, rimPos: [14, 12, -8], rimCol: '#9FD0E8', fill: .4 });

    // ---- CORRECCIÓN 2: las columnas tienen que leerse como DINERO, no como montañitas de color.
    // Un billete con su "$" y sus cantos, repetido a lo alto de cada columna. Mayormente blanco porque
    // la textura multiplica el color de la plastilina (verde o dorado).
    const ALTO_BILLETE = .42;
    const texBillete = L.canvasTex((g, cw, ch) => {
      g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, cw, ch);
      g.strokeStyle = 'rgba(0,0,0,.42)'; g.lineWidth = Math.max(2, ch * .085);
      g.beginPath(); g.moveTo(0, ch * .05); g.lineTo(cw, ch * .05);
      g.moveTo(0, ch * .95); g.lineTo(cw, ch * .95); g.stroke();
      g.fillStyle = 'rgba(0,0,0,.30)'; g.font = `900 ${Math.round(ch * .62)}px Unbounded`;
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', cw * .5, ch * .54);
      g.strokeStyle = 'rgba(0,0,0,.16)'; g.lineWidth = Math.max(1, ch * .03);
      g.strokeRect(cw * .08, ch * .2, cw * .84, ch * .6);
    }, 192, 112);
    // rbox sale de ExtrudeGeometry: sus UV están en UNIDADES DEL MUNDO (x,y del vértice), no en 0..1.
    // Por eso repeat = 1/medida da exactamente un billete por ese tramo, sea cual sea el tamaño.
    const vestir = (mat, anchoCara) => {
      const t = texBillete.clone(); t.needsUpdate = true;
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / anchoCara, 1 / ALTO_BILLETE);
      const m = mat.clone(); m.map = t; return m;
    };

    // ---- la escalera: 40 barras, verde abajo (lo que pones) y dorado arriba (lo que paga el interés)
    w.barras = [];
    for (let y = 1; y <= 40; y++) {
      const an = ANCHO(y), fo = FONDO(y), g = new THREE.Group();
      const mv = vestir(clay2('#4E9E6A', .62), an), mo = vestir(clay2('#E0B24B', .42), an);
      const verde = rbox(an, 1, fo, .04, mv); verde.position.y = .5; g.add(verde);
      const oro = rbox(an, 1, fo, .04, mo); oro.position.y = .5; g.add(oro);
      g.position.set(CX(y), 0, 0);
      g.visible = false; w.scene.add(g);
      w.barras.push({ g, verde, oro, y, mv, mo });
    }
    w.hasta = 0;
    w.dibuja = (anio) => {
      w.hasta = anio;
      w.barras.forEach(b => {
        if (b.y > anio) { b.g.visible = false; return; }
        b.g.visible = true;
        const tot = ALT(b.y), vrd = Math.min(VERDE(b.y), tot), oro = Math.max(.001, tot - vrd);
        b.verde.scale.y = Math.max(.001, vrd); b.verde.position.y = vrd / 2;
        b.oro.scale.y = oro; b.oro.position.y = vrd + oro / 2;
        // los billetes miden siempre lo mismo: la textura se repite tantas veces como quepa
        b.mv.map.repeat.y = Math.max(.08, vrd) / ALTO_BILLETE; b.mv.map.offset.y = b.mv.map.repeat.y / 2;
        b.mo.map.repeat.y = oro / ALTO_BILLETE; b.mo.map.offset.y = b.mo.map.repeat.y / 2;
      });
    };

    // ---- los hitos. CORRECCIÓN 7: una vez puesto, un hito NO se esconde. w.pon(n) deja a la vista
    // todo lo que ya se ganó, así que la casa nunca puede aparecer antes que el coche.
    // premio() guarda el tamaño FINAL de cada pieza en userData.k: las escenas animan la aparición
    // con w.sale(obj, k) en vez de setScalar(1), que borraría la escala propia del objeto.
    const premio = (o, y, z = 0) => { o.userData.k = o.scale.x || 1; o.scale.setScalar(.001); o.position.set(CX(y), ALT(y), z); w.scene.add(o); return o; };
    w.sale = (o, k) => o.scale.setScalar(Math.max(.001, (o.userData.k || 1) * k));

    w.coche = new THREE.Group();
    const carr = rbox(2.0, .55, .95, .18, clay2('#C94F3C', .5)); carr.position.y = .45; w.coche.add(carr);
    const cab = rbox(1.1, .45, .85, .18, clay2('#D9694F', .45)); cab.position.set(-.1, .92, 0); w.coche.add(cab);
    // Las llantas se veían como rectángulos: el cilindro tenía el eje en X, así que a la cámara
    // (que mira desde +z) le daba el costado. El eje de una rueda va en Z para que se vea el círculo.
    [[-.65, .5], [.65, .5], [-.65, -.5], [.65, -.5]].forEach(([a, b]) => {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(.26, .26, .18, 20), clay2('#22262C', .6));
      r.rotation.x = Math.PI / 2; r.position.set(a, .26, b); w.coche.add(r);
      const rin = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .2, 16), clay2('#C9C3B5', .5));
      rin.rotation.x = Math.PI / 2; rin.position.set(a, .26, b); w.coche.add(rin); });
    const vidrio = clay2('#1A2E3E', .25);
    const parab = rbox(.92, .34, .88, .06, vidrio); parab.position.set(-.1, .95, 0); w.coche.add(parab);
    [-1, 1].forEach(sg => { const faro = rbox(.2, .17, .14, .06, clay2('#FFF3D0', .3));
      faro.material = faro.material.clone();
      faro.material.emissive = new THREE.Color('#FFE39A'); faro.material.emissiveIntensity = 1.3;
      faro.position.set(1.04, .52, sg * .32); w.coche.add(faro); });
    w.humo = [0, 1, 2].map(i => { const h = new THREE.Mesh(new THREE.SphereGeometry(.13, 12, 10), clay2('#8C93A0', .9));
      h.userData.f = i / 3; h.position.set(-1.05, .3, .28); w.coche.add(h); return h; });
    w.echaHumo = (t) => w.humo.forEach(h => {       // humo del escape: sube, se abre y se deshace
      const k = ((t * .55 + h.userData.f) % 1);
      h.position.set(-1.05 - k * .7, .3 + k * .55, .28);
      h.scale.setScalar(Math.max(.001, (.5 + k * 1.3) * (1 - k)));
    });
    w.coche.scale.setScalar(1.9); premio(w.coche, 5, Z_HITO_ATRAS + .95 * 1.9);   // al fondo del descanso

    w.casa = new THREE.Group();
    const cuerpo = rbox(2.0, 1.5, 1.6, .06, clay2('#E8E0CE', .78)); cuerpo.position.y = .75; w.casa.add(cuerpo);
    const techo = rbox(2.3, .5, 1.9, .1, clay2('#9A4B38', .7)); techo.position.y = 1.72; w.casa.add(techo);
    w.puerta = rbox(.5, .9, .12, .04, clay2('#6B4A33', .6)); w.puerta.position.set(-.45, .45, .82); w.casa.add(w.puerta);
    const vent = rbox(.55, .5, .1, .04, clay2('#FFD79A', .3));
    vent.material = vent.material.clone();
    vent.material.emissive = new THREE.Color('#FFC46A'); vent.material.emissiveIntensity = .9;
    vent.position.set(.5, .85, .82); w.casa.add(vent);
    w.casa.scale.setScalar(1.5); premio(w.casa, 18, Z_HITO_ATRAS + .8 * 1.5);

    w.barco = new THREE.Group();
    const casco = rbox(2.6, .5, 1.0, .24, clay2('#E8E2D4', .7)); casco.position.y = .25; w.barco.add(casco);
    const borda = rbox(2.1, .22, .8, .1, clay2('#C94F3C', .55)); borda.position.y = .58; w.barco.add(borda);
    const mastil = rbox(.09, 2.6, .09, .03, clay2('#8A7B66', .5)); mastil.position.set(-.15, 1.85, 0); w.barco.add(mastil);
    // velas: TRIÁNGULOS de verdad (un cono de 3 lados no da la silueta de una vela)
    const vela = (an, al, mat) => {
      const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(an, 0); sh.lineTo(0, al); sh.closePath();
      return new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .07, bevelEnabled: false }), mat);
    };
    const matVela = clay2('#FBF8EE', .72);
    const mayor = vela(1.25, 2.1, matVela); mayor.position.set(-.1, .62, -.035); w.barco.add(mayor);   // la grande, atrás del mástil
    const foque = vela(-.85, 1.5, matVela); foque.position.set(-.2, .62, -.035); w.barco.add(foque);   // el foque, al frente
    w.barco.scale.setScalar(1.6); premio(w.barco, 31, Z_HITO_ATRAS + .5 * 1.6);

    // ---- la cifra encima de cada hito (sale de VAL(y), así nunca discrepa del contador)
    // alto REAL de cada hito ya escalado, y su z: la etiqueta va a la MISMA profundidad que el objeto
    // (si va más cerca de la cámara, baja en el cuadro y se encima con el techo).
    const ALTO_HITO = { coche: 1.17 * 1.9, casa: 1.97 * 1.5, barco: 2.72 * 1.6 };   // el velero es más alto
    const Z_HITO = { coche: Z_HITO_ATRAS + .95 * 1.9, casa: Z_HITO_ATRAS + .8 * 1.5, barco: Z_HITO_ATRAS + .5 * 1.6 };
    w.datos = {};
    const QUE_COMPRA = { coche: 'coche', casa: 'casa', barco: 'velero' };
    [['coche', 5], ['casa', 18], ['barco', 31]].forEach(([k, y]) => {
      const m = L.label3d('$' + Math.round(VAL(y)).toLocaleString('en-US') + ' · ' + QUE_COMPRA[k], 4.3, .72,
        { bg: '#0E1A24', ink: '#F2C84B', font: '800 112px Unbounded', ls: 1, pw: 2048 });
      m.position.set(CX(y), ALT(y) + ALTO_HITO[k] + .4, Z_HITO[k]);   // pegada al objeto, no flotando
      m.visible = false; w.scene.add(m); w.datos[k] = m;
    });
    w.dato = (k, v) => { w.datos[k].visible = v > .02; w.datos[k].scale.setScalar(Math.max(.001, v)); };

    // ---- 5. LA FLECHA EXPONENCIAL (JP: "un indicador de cómo es exponencial"). Un rastro de marcas
    // que sigue la punta real de la gráfica —no una curva dibujada a ojo— y remata en punta de flecha.
    w.curva = new THREE.Group(); w.curva.visible = false; w.scene.add(w.curva);
    const matC = new THREE.MeshStandardMaterial({ color: '#FFF3D0', emissive: new THREE.Color('#FFD36A'), emissiveIntensity: 1.5, roughness: .45 });
    // Paso de 0.4 años, no 1.5: en la parte empinada (año 39.6 a 40) la curva sube 0.4 unidades y el
    // cubo mide 0.5, así que se TOCAN. Con 1.5 quedaban huecos justo donde más se nota.
    // Y toda la curva corrida 0.9 a la izquierda, para que la punta no caiga sobre el personaje.
    const DESV = 0, PASO_MARCA = .32, ALTO_CURVA = 1.8, Z_CURVA = -2.5;
    // Las marcas se reparten por DISTANCIA sobre la curva, no por años: con paso fijo de años la
    // curva sube 0.8 unidades por paso al final (el cubo mide 0.5) y el rastro se abría justo
    // arriba, donde más se nota. Caminando la curva de 0.05 en 0.05 quedan siempre traslapadas.
    w.marcas = [];
    let my = 2, mx = X(2), mh = ALT(2);
    const pon = (px, py) => { const mk = rbox(.5, .5, .5, .14, matC);
      mk.position.set(px - DESV, py + ALTO_CURVA, Z_CURVA); w.curva.add(mk); w.marcas.push(mk); };
    pon(mx, mh);
    while (my < 40) {
      my = Math.min(40, my + .05);
      const px = X(my), py = ALT(my);
      if (Math.hypot(px - mx, py - mh) >= PASO_MARCA || my >= 40) { pon(px, py); mx = px; mh = py; }
    }
    w.flecha = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.4, 4), matC);
    w.flecha.position.set(X(40) - DESV, ALT(40) + ALTO_CURVA + 1.55, Z_CURVA); w.flecha.rotation.z = -.18;
    w.curva.add(w.flecha);
    w.rotuloExp = L.label3d('exponencial', 16, 2.7, { bg: null, ink: '#FFE39A', font: '800 470px Unbounded', ls: 2, pw: 4096 });
    w.rotuloExp.material.emissive = new THREE.Color('#FFE39A');
    w.rotuloExp.material.emissiveMap = w.rotuloExp.material.map;
    w.rotuloExp.material.emissiveIntensity = 1.1;              // en el cielo oscuro no le llega luz
    w.rotuloExp.position.set(X(40) - 12, ALT(40) + 2.6, Z_CURVA); w.curva.add(w.rotuloExp);
    w.traza = (k) => {                       // k 0..1: la flecha se dibuja de izquierda a derecha
      w.curva.visible = k > .01;
      w.marcas.forEach((m, i) => m.scale.setScalar(Math.max(.001, L.seg(k, i / w.marcas.length * .8, i / w.marcas.length * .8 + .18))));
      const fin = L.back(L.seg(k, .82, 1));
      w.flecha.scale.setScalar(Math.max(.001, fin));
      w.rotuloExp.scale.setScalar(Math.max(.001, fin));
    };

    // ---- CORRECCIÓN 5: la multitud ya no flota. La cima del año 40 es un descanso de 4.2 x 4.6 y
    // encima va una terraza con cara visible, así que se ve el suelo bajo los pies.
    w.gente = new THREE.Group(); w.gente.scale.setScalar(.001); w.scene.add(w.gente);
    const terraza = rbox(ANCHO_CIMA - .18, .26, 4.42, .08, clay2('#C79A3E', .5));
    terraza.position.y = -.13; w.gente.add(terraza);
    // El PODIO es un escalón dorado más de la columna (no una tarima aparte): el protagonista queda
    // un escalón ARRIBA y los que festejan un escalón ABAJO, rodeándolo, sin taparle la cara.
    w.ALTO_PODIO = .9;
    const podio = rbox(1.7, w.ALTO_PODIO, 1.7, .07, clay2('#E0B24B', .42));
    podio.position.set(0, w.ALTO_PODIO / 2, .05); w.gente.add(podio);
    w.festejan = [];
    for (let i = 0; i < 5; i++) {
      const a = L.actor(MIRON(i)), ang = -1.12 + (i / 4) * 2.24;
      a.scale.setScalar(.72);
      a.position.set(Math.sin(ang) * 1.75, 0, 1.2 + Math.cos(ang) * .7);   // en arco, DELANTE de él
      a.rotation.y = -ang * .45 + Math.PI;                                  // mirándolo a él
      a.userData.fase = i * 1.26;                                           // cada quien brinca a su ritmo
      w.gente.add(a); w.festejan.push(a);
    }
    // confeti: tres estallidos desfasados sobre la cima (burst ya existía en lib.js y no lo usábamos)
    w.confeti = [0, 1, 2, 3, 4].map(i => { const b = L.burst(11 + i * 7, .42);
      b.position.set((i - 2) * 1.5, 2.2 + (i % 3) * .7, .4 + (i % 2) * .5); w.gente.add(b); return b; });
    // BRINCAN de verdad: se mueven en y, no solo de pose. k 0..1 enciende la fiesta.
    w.fiesta = (k, t, conf = k) => {       // conf aparte: en el primer plano el confeti estorba
      w.festejan.forEach((a, i) => {
        const salto = k <= 0 ? 0 : Math.max(0, Math.sin(t * 6.2 + a.userData.fase)) * .42 * k;
        a.position.y = salto;
        L.pose(a, { armR: [1.45 + salto * .6, .45, .45], armL: [1.45 + salto * .6, -.45, .45],
          head: [-.22, 0, 0], brow: .55, smile: .75, bob: salto * .12,
          lid: Math.max(.15, L.blink(L.on2(t), 3 + i)) });
      });
      w.confeti.forEach((b, i) => b.userData.update(conf <= .02 ? 0 : ((t * .55 + i * .34) % 1)));
    };
    w.gente.position.set(CX(40), ALT(40), 0);

    // ---- CORRECCIÓN 8: los edificios parecían linternas (una sola ventana gigante). Ahora llevan
    // rejilla de ventanas, con unas apagadas. La textura va de `map` Y de `emissiveMap`: así las
    // divisiones se ven incluso con la ciudad a oscuras, y al encender solo brillan los vidrios.
    const texVentana = L.canvasTex((g, cw, ch) => {
      g.fillStyle = '#0D151D'; g.fillRect(0, 0, cw, ch);
      const cols = 4, rows = 6, mx = cw * .105, my = ch * .085;
      const vw = (cw - mx * (cols + 1)) / cols, vh = (ch - my * (rows + 1)) / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const on = ((r * 7 + c * 5 + (r * c)) % 11) > 3;      // ~70% encendidas: ninguna torre está llena
        g.fillStyle = on ? '#FFD9A0' : '#1B2836';
        g.fillRect(mx + c * (vw + mx), my + r * (vh + my), vw, vh);
      }
    }, 160, 240);
    const VENT_X = 2.2, VENT_Y = 3.3;                          // una rejilla cada 2.2 x 3.3 unidades
    w.ciudad = new THREE.Group(); w.scene.add(w.ciudad);
    const rng = L.rng(7);
    for (let i = 0; i < 46; i++) {
      const an = 1.4 + rng() * 2.6, al = 2.4 + rng() * 9.6;
      const b = rbox(an, al, an, .05, clay2(['#2E4458', '#26384A', '#35506A', '#1F2E3D'][i % 4], .85));
      b.position.set(-14 + rng() * 54, al / 2, -34 - rng() * 46);
      b.userData.orden = rng(); b.scale.y = .001;
      const t = texVentana.clone(); t.needsUpdate = true;
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / VENT_X, 1 / VENT_Y);
      const mv = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: new THREE.Color('#FFC46A'), emissiveIntensity: 0, roughness: .7 });
      const v = rbox(an * .86, al * .9, .1, .02, mv);
      v.position.set(0, 0, an / 2 + .05); b.add(v); b.userData.vent = mv;
      w.ciudad.add(b);
    }
    w.fondo = (k, luz) => {                       // k: 0 baldío → 1 ciudad entera · luz: 0 → 1 encendida
      w.ciudad.children.forEach(b => {
        const q = L.eio(L.seg(k, b.userData.orden * .8, b.userData.orden * .8 + .25));
        // no solo salen más edificios: TODOS crecen con la historia, así ninguno le estorba al rótulo
        // en las escenas de cámara baja (3, 4, 5) y la ciudad solo se vuelve alta cuando la cámara sube.
        b.scale.y = Math.max(.001, q * (.2 + .8 * k));
        b.userData.vent.emissiveIntensity = luz * q * 1.25;
      });
    };

    // ---- maqueta del MECANISMO (solo escena 2). La barra real del año 1 mide 0.04 unidades, o sea
    // nada: para explicar verde y dorado hace falta una columna aparte, a escala legible, con el
    // MISMO lenguaje que la gráfica (billetes con "$"), lejos del eje para que no se cruce.
    const MW = 2.6, MH = .62, MD = 1.2;
    w.mec = new THREE.Group(); w.mec.position.set(-7, 0, 4); w.mec.scale.setScalar(.001); w.scene.add(w.mec);
    const billete = (col, em) => {
      const m = vestir(clay2(col, em ? .42 : .62), MW);
      if (em) { m.emissive = new THREE.Color('#C9962F'); m.emissiveIntensity = .3; }
      return rbox(MW, MH, MD, .06, m);
    };
    for (let i = 0; i < 3; i++) { const b = billete('#4E9E6A'); b.position.y = MH * (i + .5); w.mec.add(b); }
    w.mecOro = [];
    for (let i = 0; i < 5; i++) {
      const b = billete('#E0B24B', 1);
      b.position.set((i % 2 ? .1 : -.08), MH * (3 + i + .5), (i % 2) * .06);
      b.scale.setScalar(.001); w.mec.add(b); w.mecOro.push(b);
    }
    w.mecAlto = MH * 8;
    // "cada mes pones ciento sesenta dólares": que se VEA cuánto es ese fajo verde
    w.mecDato = L.label3d('$160 al mes', 2.3, .62, { bg: '#0E1A24', ink: '#6FD093', font: '800 150px Unbounded', ls: 1, pw: 1024 });
    w.mecDato.position.set(-7, MH * 1.5, 4 + MD / 2 + .08);   // pegado al frente del fajo verde
    w.mecDato.visible = false; w.mec.add(w.mecDato);

    // ---- el ahorrador
    w.per = L.actor(AHORRADOR); w.per.position.set(0, 0, 1.3); w.scene.add(w.per);
    return w;
  },

  // el pizarrón del aviso y la pregunta (escenas 9 y 10)
  cierre(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#35506A', bg2: '#1F2E3D', floor: '#46637A', fog: [30, 160],
      hemi: .62, key: 3.0, keyPos: [-10, 13, 11], keyCol: '#FFEDD0', rim: 2.0, rimPos: [9, 9, -5], rimCol: '#A8D6EC', fill: .44 });
    // pared grande: con la cámara lejos (d≈25) el cuadro mide 13 de alto, y la de 13 dejaba huecos
    const pared = rbox(36, 32, .4, .1, clay2('#2E4458', .9)); pared.position.set(0, 11, -7); w.scene.add(pared);
    w.per = L.actor(AHORRADOR); w.per.position.set(0, 0, 1.0); w.scene.add(w.per);

    // OJO: label3d usa `ink` y `font` (cadena CSS), nunca `fg`/`size`; y el texto que no cabe en `pw`
    // se recorta: caracteres × 0.62 × tamaño + ls × caracteres ≤ pw.
    w.aviso = new THREE.Group();
    const mrc = rbox(6.6, 3.2, .2, .08, clay2('#16222E', .7)); w.aviso.add(mrc);
    const l1 = L.label3d('ESTE DOMINGO 10:00', 5.8, .76, { bg: '#16222E', ink: '#F2C84B', font: '800 92px Unbounded', ls: 3, pw: 2048 });
    l1.position.set(0, .74, .12); w.aviso.add(l1);
    const sub = rbox(2.5, .07, .04, .02, clay2('#F2C84B', .3));
    sub.material = sub.material.clone();
    sub.material.emissive = new THREE.Color('#F2C84B'); sub.material.emissiveIntensity = .8;
    sub.position.set(.15, .38, .14); sub.rotation.z = -.012; w.aviso.add(sub);
    const l2 = L.label3d('Empezar a invertir', 5.2, .6, { bg: '#16222E', ink: '#EFE7D4', font: '800 76px Unbounded', ls: 1, pw: 2048 });
    l2.position.set(0, -.18, .12); w.aviso.add(l2);
    const l3 = L.label3d('desde cero en México', 5.2, .6, { bg: '#16222E', ink: '#EFE7D4', font: '800 76px Unbounded', ls: 1, pw: 2048 });
    l3.position.set(0, -.92, .12); w.aviso.add(l3);
    w.aviso.position.set(0, 4.3, -2.2); w.aviso.scale.setScalar(.001); w.scene.add(w.aviso);
    return w;
  },
};

// ---------------------------------------------------------------- overlay 2D
// El rótulo vive SIEMPRE en la franja de arriba (TEXTO), que encuadra() mantiene vacía de maqueta.
function head(L, kicker, lineas, pie, ink, lt, acento) {
  L.kicker(kicker, 476, L.seg(lt, .1, .5), ink);
  let ts = 78; while (ts > 46 && lineas.some(l => L.tw(l, { f: L.F.d, w: 800, s: ts }) > 900)) ts -= 2;
  lineas.forEach((l, i) => L.rise(l, 90, 586 + i * 96, L.seg(lt, .25 + i * .1, .8 + i * .1),
    { f: L.F.d, w: 800, s: ts, c: i === lineas.length - 1 && acento ? acento : ink }));
  if (pie) { let ps = 38; while (ps > 22 && L.tw(pie, { f: L.F.b, w: 500, s: ps }) > 900) ps -= 1;
    L.rise(pie, 90, 586 + lineas.length * 96 - 26, L.seg(lt, .7, 1.2), { s: ps, c: ink, a: .8 }); }
}

// LAS DOS FICHAS DEL CONTADOR: fijas arriba, suben con la voz. Sin ellas no hay formato contador.
function fichas(L, anio, valor) {
  const C = L.C, y = 272, h = 104;
  [[90, 'AÑOS', String(Math.round(anio)), L.B.arena],
   [560, 'VALOR', '$' + Math.round(valor).toLocaleString('en-US'), '#F2C84B']].forEach(([x, et, v, col]) => {
    C.save(); C.fillStyle = 'rgba(12,20,28,.74)';
    if (C.roundRect) { C.beginPath(); C.roundRect(x, y, 430, h, 26); C.fill(); } else C.fillRect(x, y, 430, h);
    L.txt(et, x + 26, y + 38, { s: 26, c: L.B.arena, a: .72, ls: 3 });
    L.txt(v, x + 26, y + 86, { f: L.F.d, w: 800, s: 54, c: col });
    C.restore();
  });
  // el supuesto va PEGADO a la cifra, en pantalla, no en la descripción (regla del número ilustrativo)
  L.txt('supone 10% anual · ilustrativo', 90, y + h + 30, { s: 24, c: L.B.arena, a: .6 });
}

// LA ETIQUETA QUE APUNTA: píldora + línea punteada hasta la cosa que nombra.
// Estaba escrita en CLAUDE.md como recurso de la casa pero no existía en el motor; se construye aquí.
function apunta(L, texto, px, py, destX, destY, color, k) {
  if (k <= 0) return;
  const C = L.C;
  C.save(); C.globalAlpha *= k;
  C.strokeStyle = color; C.lineWidth = 4; C.setLineDash([12, 10]);
  C.beginPath(); C.moveTo(px, py); C.lineTo(destX, destY); C.stroke();
  C.setLineDash([]);
  C.beginPath(); C.arc(destX, destY, 9, 0, 7); C.fillStyle = color; C.fill();
  let s = 34; while (s > 22 && L.tw(texto, { f: L.F.b, w: 700, s }) + 52 > 620) s -= 1;
  const an = L.tw(texto, { f: L.F.b, w: 700, s }) + 52;
  C.fillStyle = 'rgba(12,20,28,.9)';
  if (C.roundRect) { C.beginPath(); C.roundRect(px - an / 2, py - 32, an, 60, 30); C.fill(); }
  C.strokeStyle = color; C.lineWidth = 3;
  if (C.roundRect) { C.beginPath(); C.roundRect(px - an / 2, py - 32, an, 60, 30); C.stroke(); }
  L.txt(texto, px, py + 8, { f: L.F.b, w: 700, s, al: 'center', c: '#EFE7D4' });
  C.restore();
}

const ORO = '#F2C84B', VRD = '#6FD093', TINTA = '#EFE7D4';

function linea2(L, txt, y, k, col) {
  let ts = 78; while (ts > 44 && L.tw(txt, { f: L.F.d, w: 800, s: ts }) > 900) ts -= 2;   // medido, no estimado
  L.rise(txt, 90, y, k, { f: L.F.d, w: 800, s: ts, c: col });
}

// cuánto de la gráfica hay que ver, según el año al que llegamos (para encuadra)

const scenes = [
  // 1 · GANCHO CON SALTO AL FUTURO: medio → gran general → medio
  { id: 'gancho', world: 'camino', d: 10, sfx: [[.27, 'wave', .75]], year: null,
    cap: 'Invierte cinco dólares al día y cuarenta años después serás millonario. No es un truco: es aritmética. Pero el camino sorprende.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const futuro = L.seg(p, .25, .42), vuelve = L.seg(p, .70, .86);
      const f = Math.max(0, futuro - vuelve);                      // 0 presente · 1 futuro
      w.dibuja(f > .02 ? 40 : 1); w.mec.scale.setScalar(.001);
      ['coche','casa','barco'].forEach(k => w.dato(k, 0)); w.traza(0);
      w.fondo(f, f);
      [w.coche, w.casa, w.barco].forEach(o => w.sale(o, f)); w.gente.scale.setScalar(Math.max(.001, f)); w.echaHumo(t);
      w.fiesta(f, t);
      w.per.position.set(f > .5 ? CX(40) : 0, f > .5 ? ALT(40) + w.ALTO_PODIO : 0, f > .5 ? .2 : 1.2);
      w.per.rotation.y = 0;
      L.pose(w.per, { armR: [.32 + f * .9, .2 + f * .3, .3], armL: [.32 + f * .9, -.2 - f * .3, .3],
        head: [-.05, MIRA_CAMARA, 0], lid: Math.max(.15, L.blink(q, 4)), brow: .2 + f * .3, smile: .2 + f * .4 });
      const d = encuadra(w, { cx: mix(0, MEDIO, f), yBot: 0,
        yTop: mix(ALTO_PERSONA + .25, ALT(40) + 2.6, f), ancho: mix(2.9, DER + 1.8, f), tilt: f * 2.2 });
      w.focusOn(w.per, f > .5 ? 3.2 : 1.1); w.aperture = f > .5 ? .00005 : .00024;
    },
    overlay(lt, t, L) {
      // el gancho en TRES tiempos (JP, 27 nov): la promesa va en medio, no al final
      L.scrim(L.C, 0, 890, .64, '8,14,20');
      head(L, 'Interés compuesto', ['Cinco dólares al día'], null, TINTA, lt);
      linea2(L, 'te vuelven millonario', 688, L.seg(lt, .85, 1.45), ORO);
      linea2(L, 'cuarenta años después', 790, L.seg(lt, 1.45, 2.05), TINTA);
      fichas(L, 1, VAL(1));
    } },

  // 2 · EL MECANISMO · la columna de billetes, de cerca. CORRECCIÓN 3: ya no hay "dorados", hay
  // intereses, y se dicen con su nombre.
  { id: 'mecanismo', world: 'camino', trans: 'cont', d: 13, sfx: [], year: null,
    cap: 'Cada mes pones ciento sesenta dólares: ese es tu dinero, el verde. Encima se apila lo que te pagan de intereses, el dorado. Y esos intereses generan más intereses.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 1 + 2 * L.eio(L.seg(p, .45, 1));
      w.dibuja(Math.ceil(anio)); w.fondo(.05, 0);
      [w.coche, w.casa, w.barco, w.gente].forEach(o => o.scale.setScalar(.001));
      ['coche','casa','barco'].forEach(k => w.dato(k, 0)); w.traza(0); w.fiesta(0, t);
      w.mec.scale.setScalar(1);
      w.mecDato.visible = L.seg(p, .1, .18) > .5;
      // los verdes ya están; los intereses BROTAN encima, cada vez más seguido
      const brota = L.seg(p, .22, .96);
      w.mecOro.forEach((b, i) => b.scale.setScalar(Math.max(.001, L.back(L.seg(brota, i * .15, i * .15 + .26)))));
      w.per.position.set(-4.3, 0, 5.0); w.per.rotation.y = -.5;
      // la mirada sigue a lo que se está explicando: abajo al verde, arriba al dorado
      const mira = L.eio(L.seg(p, .42, .62));            // 0 = al fajo verde · 1 = a los intereses
      L.pose(w.per, { armL: [.95 + mira * .55, -.62, .5 + mira * .2], armR: [.3, .2, .3],
        head: [L.lerp(.34, -.34, mira), .62, 0], brow: .2 + mira * .4, smile: .3 + mira * .2,
        lid: Math.max(.15, L.blink(q, 3)) });
      encuadra(w, { cx: -6.2, yBot: 0, yTop: mix(w.mecAlto * .72, w.mecAlto + .5, L.eio(p)),
        ancho: 4.4, cz: 4, tilt: 1.1 });
      w.focusOn(w.mec, 1.6); w.aperture = .00014;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 840, .62, '8,14,20');
      head(L, 'Cómo funciona', ['Los intereses', 'generan intereses'], null, TINTA, lt, ORO);
      const a = 1 + 2 * L.eio(L.seg(P(lt, this), .45, 1));
      fichas(L, a, VAL(a));
      // sin estas dos etiquetas el espectador no sabe qué es cada color
      apunta(L, 'VERDE · el dinero que tú pones', 320, 1430, 470, 1715, VRD, L.seg(lt, 1.6, 2.2));
      apunta(L, 'DORADO · los intereses que te pagan', 700, 1130, 540, 1310, ORO, L.seg(lt, 3.2, 3.8));
    } },

  // 3 · AÑO 5, EL COCHE · plano medio. Llega a un hito: AQUÍ sí mira a cámara.
  { id: 'coche', world: 'camino', d: 8, sfx: [[.45, 'pop', .7]], year: 'AÑO 5',
    cap: 'A los cinco años, doce mil dólares: ya es un coche. Casi todo lo pusiste tú.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 3 + 2 * L.eio(L.seg(p, 0, .5));
      w.dibuja(Math.ceil(anio)); w.fondo(.18, .05); w.mec.scale.setScalar(.001);
      const sale = L.back(L.seg(p, .3, .6)), sube = L.eio(L.seg(p, .62, .9));
      w.traza(0); w.echaHumo(t);
      w.sale(w.coche, sale); w.dato('coche', L.back(L.seg(p, .5, .78)));
      [w.casa, w.barco, w.gente].forEach(o => o.scale.setScalar(.001));
      // NO se encoge (JP: "se hace muy pequeño el personaje"). Camina hasta el coche y apoya la mano.
      w.per.position.set(CX(5) - 1.5 + sube * .62, ALT(5), Z_CAMINA + .7);
      w.per.scale.setScalar(1);
      w.per.rotation.y = .18 * sube;
      L.pose(w.per, { armR: [.32 + sube * .85, .2 + sube * .22, .3], armL: [.32, -.2, .3],
        head: [0, MIRA_CAMARA, 0], lid: Math.max(.15, L.blink(q, 4)), brow: .25, smile: .25 + sube * .3 });
      encuadra(w, { cx: CX(5), yBot: 0, yTop: ALT(5) + 3.35, ancho: mix(6.6, 5.8, L.eio(p)), tilt: .5 });   // coche 2.2 + su cifra encima
      w.focusOn(w.coche, 1.4); w.aperture = .00016;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 820, .7, '8,14,20');
      head(L, 'Año 5', ['Ya es un coche'], '≈ 244,000 pesos · 77% lo pusiste tú', TINTA, lt, ORO);
      fichas(L, 5, VAL(5));
    } },

  // 4 · LA CUESTA LARGA · plano GENERAL · SIN efectos (el silencio es parte del golpe)
  // Va SUBIENDO: mira hacia donde camina, no a cámara. Y el coche del año 5 sigue ahí.
  { id: 'cuesta', world: 'camino', trans: 'cont', d: 11, sfx: [], year: 'AÑO 18',
    cap: 'Y lo que nadie te cuenta: tardas dieciocho años en juntar los primeros cien mil. Casi la mitad del camino para el diez por ciento.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 5 + 13 * L.eio(p);
      w.dibuja(Math.ceil(anio)); w.fondo(.3 + L.eio(p) * .15, .1); w.mec.scale.setScalar(.001);
      w.traza(0); w.echaHumo(t);
      w.sale(w.coche, 1); w.dato('coche', 1);               // ya se ganó: se queda
      [w.casa, w.barco, w.gente].forEach(o => o.scale.setScalar(.001));
      w.per.scale.setScalar(1);
      w.per.position.set(X(anio), ALT(anio), Z_CAMINA);
      w.per.rotation.y = CUERPO_SUBE;
      L.pose(w.per, { armR: [.22, .18, .26], armL: [.22, -.18, .26], head: [.3, MIRA_SUBIENDO, 0],
        lean: .1, bob: Math.sin(t * 3.4) * .035 - .05, walk: t * 2.2,
        lid: Math.max(.34, L.blink(q, 5)), brow: -.3, smile: -.3 });
      encuadra(w, { cx: mix(CX(5) + .6, 5.6, L.eio(p)), yBot: 0,
        yTop: ALT(anio) + ALTO_PERSONA + .2, ancho: mix(6.4, 9.0, L.eio(p)), tilt: .8 });
      w.focusOn(w.per, 1.8); w.aperture = .00009;
    },
    overlay(lt, t, L) {
      const anio = 5 + 13 * L.eio(P(lt, this));
      L.scrim(L.C, 0, 850, .74, '8,14,20');
      head(L, '18 años', ['para el 10%', 'del dinero'], 'Aquí es donde casi todos se rinden', TINTA, lt, L.B.terracota);
      fichas(L, anio, VAL(anio));
    } },

  // 5 · MUNGER Y LA CASA · plano entero. Arranca ancho para que SE VEA EL COCHE a la izquierda
  // (corrección 7 de JP: el coche va antes que la casa, y tiene que verse que va antes).
  { id: 'casa', world: 'camino', d: 9, sfx: [[.78, 'door', .6]], year: 'AÑO 18',
    cap: 'Charlie Munger decía que los primeros cien mil son los más difíciles. Y cuando llegas, ya son una casa.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.dibuja(18); w.fondo(.5, .25); w.mec.scale.setScalar(.001);
      const sale = L.back(L.seg(p, .35, .65)), abre = L.eio(L.seg(p, .7, .92));
      w.sale(w.coche, 1);
      w.traza(0); w.echaHumo(t);
      w.sale(w.casa, sale); w.dato('coche', 1); w.dato('casa', L.back(L.seg(p, .55, .82)));
      w.puerta.rotation.y = abre * 1.1; w.puerta.position.x = -.45 - abre * .2;
      [w.barco, w.gente].forEach(o => o.scale.setScalar(.001));
      w.per.scale.setScalar(1);
      w.per.position.set(CX(18) - 1.6 + abre * .5, ALT(18), Z_CAMINA + .9);
      w.per.rotation.y = .3 - abre * .3;
      // llega arrastrando los pies mirando el suelo y se endereza hacia cámara al abrir
      L.pose(w.per, { armR: [.26 + abre * .5, .18, .28], armL: [.26, -.18, .28],
        head: [L.lerp(.28, -.08, abre), L.lerp(MIRA_SUBIENDO * .6, MIRA_CAMARA, abre), 0], lean: .08 - abre * .08,
        lid: Math.max(.2, L.blink(q, 4)), brow: L.lerp(-.2, .4, abre), smile: L.lerp(-.2, .5, abre) });
      // de 9.6 de ancho (entra el coche del año 5) a 5.8 (la casa manda)
      encuadra(w, { cx: mix((CX(5) + CX(18)) / 2 - .2, CX(18), L.eio(p)), yBot: 0,
        yTop: ALT(18) + 4.15, ancho: mix(10.4, 6.6, L.eio(p)), tilt: .6 });   // casa 3.0 + su cifra
      w.focusOn(w.casa, 1.5); w.aperture = .00015;
    },
    overlay(lt, t, L) {
      // JP la pidió textual y en inglés, en itálicas, con la grosería censurada. La salvedad
      // (no hay fuente primaria de la redacción exacta) va en la descripción, no en pantalla.
      L.scrim(L.C, 0, 900, .76, '8,14,20');
      L.kicker('Charlie Munger', 476, L.seg(lt, .1, .5), TINTA);
      let qs = 82; while (qs > 54 && L.tw('"The first $100,000', { f: L.F.s, it: 1, w: 400, s: qs }) > 900) qs -= 2;
      L.rise('"The first $100,000', 90, 586, L.seg(lt, .25, .8), { f: L.F.s, it: 1, w: 400, s: qs, c: TINTA });
      L.rise('is a b*tch"', 90, 586 + qs + 14, L.seg(lt, .45, 1.0), { f: L.F.s, it: 1, w: 400, s: qs, c: ORO });
      L.rise('Los primeros cien mil son los más difíciles', 90, 586 + qs * 2 + 54, L.seg(lt, .8, 1.3), { s: 36, c: TINTA, a: .88 });
      L.rise('$100,000 ≈ 2 millones de pesos', 90, 586 + qs * 2 + 102, L.seg(lt, 1.0, 1.5), { s: 32, c: TINTA, a: .7 });
      fichas(L, 18, VAL(18));
    } },

  // 6 · SE ACELERA, EL BARCO · plano general alto. Trepa: mirada de perfil otra vez.
  { id: 'barco', world: 'camino', trans: 'cont', d: 10, sfx: [], year: 'AÑO 31',
    cap: 'A los treinta y uno, cuatrocientos mil: el ochenta y cinco por ciento ya son intereses, no tu dinero.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 18 + 13 * L.eio(p);
      w.dibuja(Math.ceil(anio)); w.fondo(.72, .45); w.mec.scale.setScalar(.001);
      w.sale(w.coche, 1); w.sale(w.casa, 1);
      w.sale(w.barco, L.back(L.seg(p, .42, .72)));   // antes brotaba al final y no daba tiempo de verlo
      w.traza(0); w.echaHumo(t);
      w.dato('coche', 1); w.dato('casa', 1); w.dato('barco', L.back(L.seg(p, .55, .84)));
      w.gente.scale.setScalar(.001);
      w.per.scale.setScalar(1);
      w.per.position.set(X(anio), ALT(anio), Z_CAMINA);
      w.per.rotation.y = CUERPO_SUBE + .15;
      L.pose(w.per, { armR: [1.25 + Math.sin(t * 4) * .22, .34, .5], armL: [1.25 - Math.sin(t * 4) * .22, -.34, .5],
        head: [-.26, MIRA_SUBIENDO, 0], lean: -.12, bob: Math.sin(t * 4) * .06,
        lid: Math.max(.18, L.blink(q, 4)), brow: .35, smile: .1 });
      encuadra(w, { cx: mix(CX(18) - .6, CX(31) - 2.2, L.eio(p)), yBot: 0,
        yTop: ALT(anio) + 4.6, ancho: mix(8.0, 12.6, L.eio(p)), tilt: 1.4 });   // barco 3.5 + su cifra
      w.focusOn(w.per, 2.4); w.aperture = .00006;
    },
    overlay(lt, t, L) {
      const anio = 18 + 13 * L.eio(P(lt, this));
      L.scrim(L.C, 0, 830, .72, '8,14,20');
      head(L, 'Año 31', ['Ahora empuja', 'el interés'], '$400,000 · 85% ya no lo pusiste tú', TINTA, lt, ORO);
      fichas(L, anio, VAL(anio));
    } },

  // 7 · EL MILLÓN Y LA FAMA · gran general que cierra a PRIMER PLANO (el reverso de la escena 1)
  { id: 'millon', world: 'camino', trans: 'cont', d: 9,
    sfx: [[.14, 'thud', .7], [.56, 'shine', .65]], year: 'AÑO 40',
    cap: 'Y a los cuarenta: un millón de dólares.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const anio = 31 + 9 * L.eio(L.seg(p, 0, .45));
      const k = L.eio(L.seg(p, .62, 1)), ab = L.eio(L.seg(p, 0, .45));   // k: el cierre al primer plano
      w.dibuja(Math.ceil(anio)); w.fondo(1, 1); w.mec.scale.setScalar(.001);
      [w.coche, w.casa, w.barco].forEach(o => w.sale(o, 1));
      ['coche','casa','barco'].forEach(k => w.dato(k, 1)); w.traza(0); w.echaHumo(t);
      const fama = L.back(L.seg(p, .45, .72));
      w.gente.scale.setScalar(Math.max(.001, fama));
      w.fiesta(fama, t, fama * Math.max(0, 1 - k * 2.5));   // el confeti se va antes del primer plano
      w.per.scale.setScalar(1);
      w.per.position.set(CX(40), ALT(40) + w.ALTO_PODIO * fama, .2); w.per.rotation.y = 0;
      // en el primer plano los brazos BAJAN: levantados le tapaban la boca a esa distancia
      const alza = (1.5 * fama + .3) * (1 - k * .8);
      L.pose(w.per, { armR: [alza, .45 - k * .25, .5], armL: [alza, -.45 + k * .25, .5],
        head: [-.1, MIRA_CAMARA, 0], lid: Math.max(.12, L.blink(q, 4)), brow: .4, smile: .55 });
      // el plano general se ABRE con la gráfica (arranca donde lo dejó la escena 6, d≈44) y luego
      // cierra a su cara. Si se encuadrara de una para el año 40, media pantalla estaría vacía.
      encuadra(w, { cx: mix(mix(CX(31) - 2.2, MEDIO, ab), CX(40), k),
        yBot: mix(0, ALT(40) + w.ALTO_PODIO + .5, k),
        yTop: mix(ALT(anio) + 2.6, ALT(40) + w.ALTO_PODIO + 2.5, k),     // 2.5 = cuello 1.62 + radio .62 + pelo
        ancho: mix(mix(12, DER + 1.8, ab), 2.1, k),
        cz: mix(0, .25, k), tilt: mix(2.2, .1, k) });
      w.focusOn(w.per, k > .5 ? 1.0 : 3.2); w.aperture = k > .5 ? .00030 : .00005;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 800, .58, '8,14,20');
      head(L, 'Año 40', ['Un millón'], null, TINTA, lt);
      linea2(L, '$1,011,853', 700, L.seg(lt, .9, 1.5), ORO);
      fichas(L, 40, VAL(40));
    } },

  // 8 · EL GOLPE · la gráfica entera: el verde es una tirita pegada al suelo
  { id: 'golpe', world: 'camino', d: 10, sfx: [], year: null,
    cap: 'Tú pusiste setenta y seis mil; el interés, novecientos treinta y cinco mil. Noventa y dos de cada cien dólares.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.dibuja(40); w.fondo(1, 1); w.mec.scale.setScalar(.001);
      [w.coche, w.casa, w.barco].forEach(o => w.sale(o, 1));
      w.gente.scale.setScalar(.001); w.fiesta(0, t);
      ['coche','casa','barco'].forEach(k => w.dato(k, 1));
      w.traza(L.eio(L.seg(p, .18, .92))); w.echaHumo(t);     // la flecha se traza mientras habla del 92%
      w.per.scale.setScalar(1); w.per.position.set(CX(40), ALT(40), 1.3); w.per.rotation.y = 0;
      L.pose(w.per, { armR: [.3, .2, .3], armL: [.3, -.2, .3], head: [.3, MIRA_CAMARA, 0],
        lid: Math.max(.15, L.blink(q, 4)), brow: .25, smile: .2 });
      encuadra(w, { cx: MEDIO, yBot: 0, yTop: ALT(40) + 7.0,          // la flecha y su punta suben por encima de todo
        ancho: mix(DER + 2.4, DER + 1.2, L.eio(p)), tilt: 2.4 });
      w.focusOn(w.barras[39].g, 3.4); w.aperture = .00004;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 880, .66, '8,14,20');
      head(L, 'De quién es ese millón', ['Tú pusiste $76,800'], null, TINTA, lt);
      linea2(L, 'El interés puso $935,053', 700, L.seg(lt, 1.0, 1.6), ORO);
      L.rise('92 de cada 100 dólares', 90, 790, L.seg(lt, 1.5, 2.1), { s: 38, c: TINTA, a: .85 });
      fichas(L, 40, VAL(40));
    } },

  // 9 · EL AVISO DEL LARGO. CORRECCIÓN 6: el pizarrón ES el texto, así que NO lleva rótulo 2D encima.
  // Solo el kicker arriba, y por eso aquí la franja reservada es chica (texto: .20).
  { id: 'aviso', world: 'cierre', d: 7, sfx: [], year: 'EL DOMINGO',
    cap: 'Este domingo voy a subir el video completo: cómo empezar a invertir desde cero.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const sale = L.back(L.seg(p, .1, .45));
      w.aviso.scale.setScalar(Math.max(.001, sale));
      w.aviso.position.y = 4.3 + Math.sin(t * 1.2) * .04;
      w.per.rotation.y = -.2;
      L.pose(w.per, { armL: [1.25 * sale + .2, -.52, .5], armR: [.3, .2, .3],
        head: [-.12, .34 * sale, 0], lid: Math.max(.15, L.blink(q, 3)), brow: .4, smile: .55 });
      encuadra(w, { cx: 0, yBot: 0, yTop: 6.1, ancho: mix(7.6, 7.0, L.eio(p)), texto: .26, tilt: .4, cz: -1.0 });
      w.focusOn(sale > .4 ? w.aviso : w.per, 1.8); w.aperture = .00011;
    },
    overlay(lt, t, L) {
      L.kicker('Lo que sigue', 300, L.seg(lt, .15, .55), ORO);
    } },

  // 10 · LA PREGUNTA DE CIERRE. El pizarrón se va en medio segundo y la pregunta entra DESPUÉS:
  // cada texto con su espacio, nunca dos encima (corrección 6 de JP).
  { id: 'cierre-pregunta', world: 'cierre', trans: 'cont', d: 7.5, sfx: [], year: null,
    cap: '¿Cuántos años llevas pensando en empezar?',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.aviso.scale.setScalar(Math.max(.001, 1 - L.eio(L.seg(p, 0, .07))));
      const pre = L.eio(L.seg(p, .22, .62));
      w.per.rotation.y = 0;
      L.pose(w.per, { armL: [.55 * pre + .28, -.62 * pre - .18, .62 * pre + .28],
        armR: [.55 * pre + .28, .62 * pre + .18, .62 * pre + .28],
        head: [-.05 - pre * .05, MIRA_CAMARA, 0], lid: Math.max(.15, L.blink(q, 4)), brow: .2 + pre * .4, smile: .35 });
      encuadra(w, { cx: 0, yBot: 0, yTop: ALTO_PERSONA + .25, ancho: mix(3.6, 2.8, L.eio(p)), cz: 1.0 });
      w.focusOn(w.per, 1.3); w.aperture = .00020;
    },
    overlay(lt, t, L) {
      L.scrim(L.C, 0, 880, .7, '8,14,20');
      // la pregunta entra cuando el pizarrón ya se fue (0.55 s)
      L.rise('¿Cuántos años llevas', 540, 430, L.seg(lt, .6, 1.25), { f: L.F.s, it: 1, s: 96, c: TINTA, al: 'center' });
      L.rise('pensando', 540, 548, L.seg(lt, 1.3, 1.9), { f: L.F.s, it: 1, s: 96, c: TINTA, al: 'center' });
      L.rise('en empezar?', 540, 648, L.seg(lt, 1.5, 2.1), { f: L.F.s, it: 1, s: 96, c: ORO, al: 'center' });
      L.rise('Desde la costa, todo se ve con claridad.', 540, 778, L.seg(lt, 2.4, 3.0), { f: L.F.s, it: 1, s: 42, c: TINTA, al: 'center', a: .85 });
      // el aviso legal con su propia banda abajo, lejos de todo lo demás
      L.scrim(L.C, 1760, 1920, .55, '8,14,20');
      L.txt('Supone 10% anual · ejemplo ilustrativo · Contenido educativo · No es asesoría financiera',
        540, 1846, { s: 23, c: TINTA, al: 'center', a: .72 * L.seg(lt, 2.6, 3.2) });
    } },
];

export default { id: '2026-11-26-COMPUESTO-historia', title: 'Cinco dólares al día durante 40 años', tail: 1.2, worlds, scenes };
