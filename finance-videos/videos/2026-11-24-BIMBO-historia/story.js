// Bimbo: de una pastelería heredada a 96 países — historia 3D "Costa Diorama v2"
// MOTOR NARRATIVO: **el alejamiento** (/historia §4). Es un hecho humano que necesita contexto para
// pesar: un muchacho de 19 años deja la carrera porque se le murió el padre. Contado solo, es una
// anécdota. La cámara sale de él al mostrador, del mostrador a la ciudad y de la ciudad al mundo, y
// el dato se siente en vez de explicarse. No lleva contador (compite con el alejamiento) ni recuadro
// esquema (rompería el único efecto que tiene).
// PALETA ÚNICA: masa / horno. Trigo profundo → trigo medio → trigo claro. Nunca sale de esa familia.

const P = (lt, s) => lt / (s.t1 - s.t0);
const mixv = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
const cam = (w, pos, tgt) => { w.cam.position.set(...pos); w.cam.lookAt(...tgt); };

// ---------------------------------------------------------------- reparto
const LORENZO = { shirt: '#F2EDE2', pants: '#4A4255', shoes: '#3A2A1E', hair: '#2A1D14', hairStyle: 'side', collar: 'shirt', seed: 5 };
const SOCIO_A = { shirt: '#C9A227', pants: '#473C2E', shoes: '#3A2A1E', hair: '#3A2A1C', hairStyle: 'short', seed: 13 };
const SOCIO_B = { shirt: '#8A5F45', pants: '#3E3627', shoes: '#2E2218', hair: '#1F1711', hairStyle: 'short', seed: 19 };

// una hogaza de pan de caja: la pieza que se repite en toda la historia
function hogaza(L, col, esc = 1) {
  const { THREE, clay2, rbox } = L;
  const g = new THREE.Group();
  const cuerpo = rbox(1.5, .72, .92, .26, clay2(col || '#C98A4B', .62));
  cuerpo.position.y = .36; g.add(cuerpo);
  const copete = rbox(1.34, .34, .8, .3, clay2(col || '#C98A4B', .55));
  copete.position.y = .82; g.add(copete);
  g.scale.setScalar(esc);
  return g;
}

// un edificio simple de la ciudad; se usa por docenas
function edificio(L, an, al, pr, col) {
  const { clay2, rbox } = L;
  const b = rbox(an, al, pr, .06, clay2(col, .82));
  b.position.y = al / 2;
  return b;
}

const worlds = {
  // 1, 2 y 3 · 1945: adentro de la panadería
  panaderia(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#6B4A2A', bg2: '#4A3119', floor: '#5B3F26', fog: [26, 96],
      hemi: .5, key: 3.2, keyPos: [-9, 11, 9], keyCol: '#FFE0AE', rim: 2.0, rimPos: [8, 8, -5], rimCol: '#FFC98A', fill: .38 });

    // pared de ladrillo y el horno al fondo: el horno es lo que da la luz del mundo
    const pared = rbox(20, 12, .5, .1, clay2('#7A5431', .9)); pared.position.set(0, 5, -7.4); w.scene.add(pared);
    const horno = rbox(5.2, 4.2, .9, .3, clay2('#4A3119', .7)); horno.position.set(-4.6, 2.6, -6.8); w.scene.add(horno);
    const boca = rbox(3.4, 2.2, .5, .25, clay2('#D98A3C', .25));
    boca.material.emissive = new THREE.Color('#FF9A3C'); boca.material.emissiveIntensity = .85;
    boca.position.set(-4.6, 2.4, -6.4); w.scene.add(boca);
    w.boca = boca;

    // el mostrador
    const most = rbox(9.2, 1.9, 2.6, .12, clay2('#8A5F45', .72)); most.position.set(0, .95, -4.0); w.scene.add(most);
    const tabla = rbox(9.5, .22, 2.9, .08, clay2('#A9743F', .6)); tabla.position.set(0, 1.98, -4.0); w.scene.add(tabla);

    // las hogazas sobre el mostrador: en la escena 1 solo hay una
    w.panes = new THREE.Group(); w.scene.add(w.panes);
    for (let i = 0; i < 7; i++) {
      const h = hogaza(L, i % 2 ? '#C98A4B' : '#B87A3E', .92);
      h.position.set(-3.4 + i * 1.15, 2.09, -4.0 + (i % 2 ? .35 : -.3));
      h.rotation.y = (i - 3) * .09;
      h.scale.setScalar(.001);
      w.panes.add(h);
    }

    // el letrero de la casa (sin logotipos reales: tipografía propia)
    // label3d usa `ink` y `font` (cadena CSS), no `fg`/`size`: con los nombres mal el texto sale
    // en negro por defecto. 12 caracteres a 96px con ls 6 piden 786 px, así que 1024 alcanza.
    w.letrero = L.label3d('PANIFICACIÓN', 4.6, .7, { bg: '#F2EDE2', ink: '#4A3119', font: '800 96px Unbounded', ls: 6, pw: 1024 });
    w.letrero.position.set(0, 4.3, -7.1); w.letrero.scale.setScalar(.001); w.scene.add(w.letrero);

    // Lorenzo detrás del mostrador
    w.lor = L.actor(LORENZO); w.lor.position.set(0, 0, .5); w.scene.add(w.lor);
    // los socios llegan en la escena 3
    w.s1 = L.actor(SOCIO_A); w.s1.position.set(-1.95, 0, .2); w.s1.scale.setScalar(.001); w.scene.add(w.s1);
    w.s2 = L.actor(SOCIO_B); w.s2.position.set(1.95, 0, .2); w.s2.scale.setScalar(.001); w.scene.add(w.s2);
    return w;
  },

  // 4 y 5 · la ciudad: la panadería es UN edificio
  ciudad(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#C49A62', bg2: '#9A7342', floor: '#8A6A42', fog: [60, 240],
      hemi: .62, key: 3.0, keyPos: [-16, 22, 16], keyCol: '#FFE6BE', rim: 1.8, rimPos: [14, 14, -8], rimCol: '#FFD39A', fill: .42 });

    // la panadería: el único edificio con el horno encendido
    w.casa = new THREE.Group();
    const cuerpo = edificio(L, 3.4, 3.0, 3.0, '#C98A4B'); w.casa.add(cuerpo);
    const techo = rbox(3.8, .4, 3.4, .1, clay2('#8A5F45', .7)); techo.position.y = 3.2; w.casa.add(techo);
    const luz = rbox(1.5, 1.0, .25, .1, clay2('#FF9A3C', .25));
    luz.material.emissive = new THREE.Color('#FF9A3C'); luz.material.emissiveIntensity = 1.0;
    luz.position.set(0, 1.1, 1.56); w.casa.add(luz);
    w.casa.position.set(0, 0, 0); w.scene.add(w.casa);

    // la ciudad alrededor: sube del suelo escalonada (el mundo HACE algo durante la escena)
    w.ciudad = new THREE.Group(); w.scene.add(w.ciudad);
    const rng = L.rng(4);
    for (let i = 0; i < 64; i++) {
      const ang = rng() * Math.PI * 2, rad = 6 + rng() * 30;
      const an = 2 + rng() * 2.2, al = 2 + rng() * 6.5;
      const b = edificio(L, an, al, an, ['#B98B5C', '#A87A4E', '#C9A277', '#97693F'][i % 4]);
      b.position.set(Math.cos(ang) * rad, al / 2, Math.sin(ang) * rad);
      b.userData.h = al; b.scale.y = .001;
      w.ciudad.add(b);
    }

    // las 251 plantas: puntos que se encienden sobre el suelo, lejos
    w.plantas = new THREE.Group(); w.scene.add(w.plantas);
    const rng2 = L.rng(9);
    for (let i = 0; i < 60; i++) {
      const ang = rng2() * Math.PI * 2, rad = 22 + rng2() * 52;
      const p = rbox(1.1, 1.3, 1.1, .1, clay2('#F2C879', .4));
      p.material.emissive = new THREE.Color('#FFB44A'); p.material.emissiveIntensity = .7;
      p.position.set(Math.cos(ang) * rad, .65, Math.sin(ang) * rad);
      p.scale.setScalar(.001);
      w.plantas.add(p);
    }
    return w;
  },

  // 6, 7 y 8 · el mundo
  mundo(L) {
    const { THREE, clay2, rbox } = L;
    const w = L.cineWorld({ bg: '#E6CFA4', bg2: '#C9A86E', floor: '#B89459', fog: [50, 220],
      hemi: .7, key: 3.0, keyPos: [-14, 18, 14], keyCol: '#FFF0D2', rim: 1.9, rimPos: [12, 12, -7], rimCol: '#FFDCA8', fill: .46 });

    // el globo: una esfera de plastilina, sin mapa real (caricatura, no cartografía)
    const geo = new THREE.SphereGeometry(5.2, 48, 32);
    w.globo = new THREE.Mesh(geo, clay2('#C98A4B', .62));
    w.globo.position.set(0, 6.2, 0); w.globo.castShadow = true; w.scene.add(w.globo);

    // 96 puntos encendidos sobre la esfera
    w.puntos = new THREE.Group(); w.globo.add(w.puntos);
    const rng = L.rng(21);
    for (let i = 0; i < 96; i++) {
      const u = rng() * Math.PI * 2, v = Math.acos(2 * rng() - 1), r = 5.26;
      const p = new THREE.Mesh(new THREE.SphereGeometry(.17, 10, 8), clay2('#FFF0D2', .3));
      p.material.emissive = new THREE.Color('#FFC46A'); p.material.emissiveIntensity = 1.0;
      p.position.set(r * Math.sin(v) * Math.cos(u), r * Math.cos(v), r * Math.sin(v) * Math.sin(u));
      p.scale.setScalar(.001);
      w.puntos.add(p);
    }

    // los camiones: lo que casi nadie cuenta
    w.camiones = new THREE.Group(); w.scene.add(w.camiones);
    for (let i = 0; i < 14; i++) {
      const c = new THREE.Group();
      const caja = rbox(1.5, .9, .8, .1, clay2('#F2EDE2', .7)); caja.position.y = .72; c.add(caja);
      const cab = rbox(.6, .6, .78, .1, clay2('#C9A227', .6)); cab.position.set(-1.0, .55, 0); c.add(cab);
      const ang = (i / 14) * Math.PI * 2;
      c.position.set(Math.cos(ang) * (9 + (i % 3)), .1, Math.sin(ang) * (9 + (i % 3)));
      c.rotation.y = -ang + Math.PI / 2;
      c.scale.setScalar(.001);
      w.camiones.add(c);
    }

    w.hog = hogaza(L, '#C98A4B', 1.6); w.hog.position.set(0, 1.2, 7.5); w.hog.scale.setScalar(.001); w.scene.add(w.hog);
    return w;
  },
};

// rótulo de la casa (el motor 3D no tiene L.fit: el bloque se achica solo, como en /historia)
function head(L, kicker, lineas, pie, ink, lt, acento) {
  L.kicker(kicker, 360, L.seg(lt, .1, .5), ink);
  // a 78px caben ~18 caracteres en los 900 px útiles: si una línea se pasa, TODO el bloque se achica
  const largo = Math.max(...lineas.map(l => l.length));
  const ts = largo > 18 ? Math.max(54, Math.floor(78 * 18 / largo)) : 78;
  lineas.forEach((l, i) => L.rise(l, 90, 470 + i * 96, L.seg(lt, .25 + i * .1, .8 + i * .1),
    { f: L.F.d, w: 800, s: ts, c: i === lineas.length - 1 && acento ? acento : ink }));
  // el pie es de una sola línea: a 38px caben ~46 caracteres, así que se encoge solo
  if (pie) L.rise(pie, 90, 470 + lineas.length * 96 - 26, L.seg(lt, .7, 1.2),
    { s: pie.length > 46 ? Math.max(26, Math.floor(38 * 46 / pie.length)) : 38, c: ink, a: .8 });
}

const scenes = [
  // 1 · GANCHO (3 s, tres capas): una hogaza sola, y la frase que no cuadra
  { id: 'gancho', world: 'panaderia', d: 9, sfx: [[.15, 'pop']], year: '1945',
    cap: 'Una panadería que abrió en 1945, en la Ciudad de México, hoy hornea en 96 países. Y empezó porque a un muchacho se le murió el padre.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const sale = L.back(L.seg(p, .02, .22));
      w.panes.children.forEach((h, i) => h.scale.setScalar(Math.max(.001, L.back(L.seg(p, .02 + i * .04, .26 + i * .04)) * .92)));
      w.boca.material.emissiveIntensity = .85 + Math.sin(t * 2.2) * .12;
      L.pose(w.lor, { armR: [.3, .2, .3], armL: [.3, -.2, .3], head: [.1, .1, 0],
        lid: Math.max(.15, L.blink(q, 4)), brow: .1, smile: .15 });
      // detalle de la hogaza que se abre a plano medio: la imagen se reconoce desde el cuadro 1
      // Lorenzo está entre la cámara y el mostrador, así que no se puede abrir con un detalle del pan
      // sin metérsele en la cara. El gancho abre en plano abierto de la panadería —se reconoce al
      // instante— y se acerca a plano medio. (Regla del gancho: se ve antes de entenderse.)
      cam(w, mixv([0, 3.7, 13.2], [0, 3.0, 9.6], L.eio(p)), mixv([0, 2.15, .5], [0, 2.3, .5], L.eio(p)));
      w.focusOn(w.panes.children[3], 1.0); w.aperture = .00024;
    },
    overlay(lt, t, L) {
      const ink = '#F6EEDC'; L.scrim(L.C, 0, 780, .6, '42,26,12');
      head(L, 'Ciudad de México · 1945', ['Una panadería', 'de 1945'], 'Hoy hornea en 96 países', ink, lt, L.B.mostaza);
    } },

  // 2 · el hecho humano, en plano cerrado
  { id: 'padre', world: 'panaderia', trans: 'cont', d: 11, sfx: [[.4, 'thud', .5]], year: '1937',
    cap: 'En 1937, a Lorenzo Servitje se le murió el padre de repente. Estudiaba contaduría en la UNAM. Dejó la carrera y se hizo cargo de la pastelería de la familia, El Molino.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      w.panes.children.forEach((h, i) => h.scale.setScalar(i === 3 ? .92 : .001));
      const pesa = L.eio(L.seg(p, .25, .75));
      L.pose(w.lor, { armR: [.3 - pesa * .1, .2, .3], armL: [.3 - pesa * .1, -.2, .3],
        head: [.1 + pesa * .3, .1 - pesa * .22, 0], lean: pesa * .09, bob: -pesa * .06,
        lid: Math.max(.25 + pesa * .3, L.blink(q, 5)), brow: -.2 - pesa * .3, smile: -.15 - pesa * .3 });
      // primer plano: a fov 30° el ancho de cuadro es 0.3015·d, así que d≈6 deja la cara llena sin deformarla
      cam(w, mixv([0, 3.0, 9.8], [.1, 2.9, 6.5], L.eio(p)), mixv([0, 2.3, .5], [0, 2.7, .5], L.eio(p)));
      w.focusOn(w.lor, 1.2); w.aperture = .00030;
    },
    overlay(lt, t, L) {
      const ink = '#F6EEDC'; L.scrim(L.C, 0, 820, .66, '42,26,12');
      head(L, '1937 · tenía 19 años', ['Se le murió', 'el padre'], 'Dejó la carrera y se hizo cargo de la pastelería', ink, lt, L.B.terracota);
    } },

  // 3 · 1945: los socios y el pan de caja. Plano entero, otra familia de plano
  { id: 'socios', world: 'panaderia', d: 11, sfx: [[.3, 'pop'], [1.6, 'shine', .6]], year: '1945',
    cap: 'Ocho años estuvo ahí. Y en 1945, él y cuatro socios abrieron algo distinto: una fábrica de pan de caja. La llamaron Panificación Bimbo.',
    update(w, lt, t, L) {
      const p = P(lt, this), q = L.on2(t);
      const llegan = L.back(L.seg(p, .1, .42)), panes = L.seg(p, .4, .9);
      w.s1.scale.setScalar(Math.max(.001, llegan)); w.s2.scale.setScalar(Math.max(.001, llegan));
      w.panes.children.forEach((h, i) => {
        const k = i === 3 ? 1 : L.seg(panes, i * .11, i * .11 + .3);
        h.scale.setScalar(Math.max(.001, k * .92));
      });
      w.letrero.scale.setScalar(Math.max(.001, L.back(L.seg(p, .55, .85))));
      [w.lor, w.s1, w.s2].forEach((a, i) => L.pose(a, { armR: [.34, .2, .32], armL: [.34, -.2, .32],
        head: [0, (i - 1) * .18, 0], lid: Math.max(.15, L.blink(q, 3 + i)), brow: .25, smile: .4 }));
      cam(w, mixv([.1, 2.9, 6.5], [0, 3.4, 18.9], L.eio(p)), mixv([0, 2.7, .5], [0, 2.1, .3], L.eio(p)));
      w.focusOn(w.lor, 1.6); w.aperture = .00015;
    },
    overlay(lt, t, L) {
      const ink = '#F6EEDC'; L.scrim(L.C, 0, 800, .62, '42,26,12');
      head(L, '1945 · cinco socios', ['Abrieron una', 'fábrica de pan'], 'Lorenzo Servitje, Jaime Jorba, Jaime Sendra, Alfonso Velasco y José T. Mata', ink, lt, L.B.mostaza);
    } },

  // 4 · PRIMER ALEJAMIENTO: la panadería es un edificio
  { id: 'ciudad', world: 'ciudad', d: 10, sfx: [[.2, 'wave', .7]], year: '1945',
    cap: 'Alejémonos. Vista desde arriba, en ese entonces era un edificio en la ciudad. Uno solo.',
    update(w, lt, t, L) {
      const p = P(lt, this);
      const sube = L.eio(L.seg(p, .12, .78));
      w.ciudad.children.forEach((b, i) => {
        const k = L.eio(L.seg(sube, (i % 16) * .035, (i % 16) * .035 + .4));
        b.scale.y = Math.max(.001, k);
      });
      w.plantas.children.forEach(pl => pl.scale.setScalar(.001));
      // el alejamiento: de la azotea de la panadería a toda la manzana
      cam(w, mixv([1.6, 3.4, 13.6], [12, 22, 30], L.eio(p)), mixv([0, 1.7, 0], [0, 1.5, 0], L.eio(p)));
      w.focusOn(w.casa, 2.2); w.aperture = .00010;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 760, .5, '244,236,214');
      head(L, 'El primer día', ['Era un edificio.', 'Uno.'], 'Una panadería en la Ciudad de México', ink, lt, L.B.azul);
    } },

  // 5 · SEGUNDO ALEJAMIENTO: 251 panaderías y plantas
  { id: 'plantas', world: 'ciudad', trans: 'cont', d: 10, sfx: [[.5, 'shine', .6]], year: 'HOY',
    cap: 'Alejémonos otra vez. Hoy son 251 panaderías y plantas, repartidas por el continente.',
    update(w, lt, t, L) {
      const p = P(lt, this);
      w.ciudad.children.forEach(b => { b.scale.y = 1; });
      const enc = L.seg(p, .1, .85);
      w.plantas.children.forEach((pl, i) => {
        const k = L.back(L.seg(enc, (i / 60) * .8, (i / 60) * .8 + .2));
        pl.scale.setScalar(Math.max(.001, k));
      });
      cam(w, mixv([12, 22, 30], [20, 58, 68], L.eio(p)), mixv([0, 1.5, 0], [0, 1.0, 0], L.eio(p)));
      w.focusOn(w.casa, 3.4); w.aperture = .00006;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 780, .54, '244,236,214');
      head(L, 'Hoy', ['251 panaderías', 'y plantas'], 'Grupo Bimbo · cifras de su propio sitio', ink, lt, L.B.azul);
    } },

  // 6 · TERCER ALEJAMIENTO: el mundo
  { id: 'mundo', world: 'mundo', d: 11, sfx: [[.2, 'wave', .7], [1.2, 'pop', .5]], year: 'HOY',
    cap: 'Y una vez más. Están en 96 países: operan directo en 39 y llegan a otros 57 con socios. Es la panificadora más grande del mundo.',
    update(w, lt, t, L) {
      const p = P(lt, this);
      w.globo.rotation.y = -.4 + L.eio(p) * .9;
      const enc = L.seg(p, .12, .9);
      w.puntos.children.forEach((pt, i) => {
        const k = L.back(L.seg(enc, (i / 96) * .85, (i / 96) * .85 + .14));
        pt.scale.setScalar(Math.max(.001, k));
      });
      w.camiones.children.forEach(c => c.scale.setScalar(.001));
      w.hog.scale.setScalar(.001);
      // ancho útil = 0.3015·d; el globo mide 10.4 de diámetro, así que d≈35 lo deja con aire
      cam(w, mixv([0, 7.0, 30], [0, 6.6, 44], L.eio(p)), [0, 6.2, 0]);
      w.focusOn(w.globo, 2.0); w.aperture = .00009;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 760, .5, '248,240,220');
      head(L, 'Hoy', ['96 países'], 'Opera directo en 39 · llega a otros 57 con socios', ink, lt, L.B.azul);
    } },

  // 7 · lo que casi nadie cuenta: el negocio no es el pan, es el reparto
  { id: 'reparto', world: 'mundo', trans: 'cont', d: 11, sfx: [[.3, 'pop'], [2.0, 'thud', .45]], year: 'HOY',
    cap: 'Pero lo que la hizo grande no fue el pan, fue cómo llega: más de 1,600 centros de ventas. El pan dura pocos días, así que el camión tiene que salir todos los días.',
    update(w, lt, t, L) {
      const p = P(lt, this);
      w.globo.rotation.y = .5 + L.eio(p) * .5;
      w.puntos.children.forEach(pt => pt.scale.setScalar(1));
      const sale = L.seg(p, .1, .75);
      w.camiones.children.forEach((c, i) => {
        const k = L.back(L.seg(sale, (i / 14) * .7, (i / 14) * .7 + .25));
        c.scale.setScalar(Math.max(.001, k));
        c.position.y = .1 + Math.sin(t * 2 + i) * .05;
      });
      w.hog.scale.setScalar(.001);
      cam(w, mixv([0, 6.6, 44], [0, 10, 30], L.eio(p)), mixv([0, 6.2, 0], [0, 3.2, 0], L.eio(p)));
      w.focusOn(w.camiones.children[0], 1.8); w.aperture = .00011;
    },
    overlay(lt, t, L) {
      const ink = L.B.negro; L.scrim(L.C, 0, 800, .56, '248,240,220');
      head(L, 'Lo que casi nadie cuenta', ['No fue el pan.', 'Fue el reparto'], 'Más de 1,600 centros de ventas · el pan dura días', ink, lt, L.B.azul);
    } },

  // 8 · cierre de la casa: una pregunta
  { id: 'cierre', world: 'mundo', trans: 'cont', d: 9.5, sfx: [[.2, 'shine', .5]], year: null,
    cap: 'De una pastelería heredada a 96 países. ¿Qué negocio de tu colonia crees que podría crecer así?',
    update(w, lt, t, L) {
      const p = P(lt, this);
      w.camiones.children.forEach(c => c.scale.setScalar(Math.max(.001, 1 - L.eio(L.seg(p, 0, .22)))));
      w.puntos.children.forEach(pt => pt.scale.setScalar(1));
      w.globo.rotation.y = 1.0 + L.eio(p) * .25;
      const entra = L.back(L.seg(p, .18, .5));
      w.hog.scale.setScalar(Math.max(.001, entra * 1.6));
      w.hog.position.y = 1.2 + Math.sin(t * 1.3) * .06;
      cam(w, mixv([0, 10, 30], [0, 4.6, 19], L.eio(p)), mixv([0, 3.2, 0], [0, 3.0, 0], L.eio(p)));
      w.focusOn(w.hog, 1.4); w.aperture = .00014;
    },
    overlay(lt, t, L) {
      const a = L.B.negro; L.scrim(L.C, 0, 900, .7, '248,240,220');
      L.rise('¿Qué negocio de tu colonia', 540, 430, L.seg(lt, .15, .8), { f: L.F.s, it: 1, s: 92, c: a, al: 'center' });
      L.rise('crees que podría', 540, 548, L.seg(lt, .85, 1.45), { f: L.F.s, it: 1, s: 92, c: a, al: 'center' });
      L.rise('crecer así?', 540, 648, L.seg(lt, 1.05, 1.65), { f: L.F.s, it: 1, s: 92, c: L.B.azul, al: 'center' });
      L.rise('Desde la costa, todo se ve con claridad.', 540, 742, L.seg(lt, 1.8, 2.4), { f: L.F.s, it: 1, s: 42, c: a, al: 'center', a: .85 });
      L.txt('Contenido educativo · No es asesoría financiera', 540, 1790, { s: 26, c: a, al: 'center', a: .6 * L.seg(lt, 2, 2.6) });
    } },
];

export default { id: '2026-11-24-BIMBO-historia', title: 'De una pastelería heredada a 96 países', tail: 1.2, worlds, scenes };
