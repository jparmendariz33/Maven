#!/usr/bin/env python3
"""Une storyboard + datos + tiempos de la voz en build/video.js (lo que dibuja el motor).

Uso:  python3 scripts/build_timeline.py videos/<id>

- Alinea las palabras del guion con las de whisper (difflib) para tener el tiempo exacto de cada palabra.
- Cada escena empieza ~0.3 s antes de su primera palabra narrada.
- Cualquier campo `cue` o `cue_*` (texto) se convierte en el segundo en que esa palabra se dice dentro de su escena.
- Genera subtítulos (frases de máx. 4 palabras) con el texto del guion, no el de whisper.
"""
import sys, os, json, difflib, re
sys.path.insert(0, os.path.dirname(__file__))
from common import load, norm, tokens, brand

OFFSET = 0.45   # segundos de silencio antes de que empiece la voz
TAIL = 2.2      # segundos después de la última palabra


def align(script_toks, wh):
    A = [norm(t) for t in script_toks]
    Bw = [(s, e, norm(w)) for s, e, w in wh if norm(w)]
    Bn = [b[2] for b in Bw]
    times = [None] * len(A)
    sm = difflib.SequenceMatcher(None, A, Bn, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = [Bw[blk.b + k][0], Bw[blk.b + k][1]]
    # interpola huecos (palabras que whisper escribió distinto: números, nombres)
    i = 0
    while i < len(A):
        if times[i] is None:
            j = i
            while j < len(A) and times[j] is None: j += 1
            t0 = times[i - 1][1] if i > 0 else 0.0
            t1 = times[j][0] if j < len(A) else (Bw[-1][1] if Bw else t0 + 1)
            L = [max(1, len(A[k])) for k in range(i, j)]; tot = sum(L); acc = 0
            for k in range(i, j):
                a = t0 + (t1 - t0) * acc / tot; acc += L[k - i]; b = t0 + (t1 - t0) * acc / tot
                times[k] = [round(a, 3), round(b, 3)]
            i = j
        else: i += 1
    matched = sum(1 for blk in sm.get_matching_blocks() for _ in range(blk.size))
    return times, matched / max(1, len(A))


def main(vdir):
    sb = load(os.path.join(vdir, 'storyboard.json'))
    dp = os.path.join(vdir, 'data.json'); data = load(dp) if os.path.exists(dp) else {}
    LONG = sb.get('format') == 'long'
    wh = load(os.path.join(vdir, 'build', 'whisper.json'))
    toks, owner = [], []
    for si, s in enumerate(sb['scenes']):
        for t in tokens(s.get('say', '')): toks.append(t); owner.append(si)
    times, ratio = align(toks, wh['words'])
    print(f'alineación: {ratio:.0%} de las palabras del guion coinciden con la voz')
    times = [[a + OFFSET, b + OFFSET] for a, b in times]
    first = {}
    for k, si in enumerate(owner): first.setdefault(si, k)
    voice_end = times[-1][1]
    novoice = os.path.exists(os.path.join(vdir, 'audio', 'NO_VOICE'))
    MAXD = 90.0 if novoice else 60.0   # sin voz: margen para leer con calma (Shorts admite hasta 3 min)
    if LONG: MAXD = 3600.0              # video largo: sin tope
    duration = round(max(45.0 if not LONG else 5.0, min(MAXD, voice_end + TAIL)), 2)
    if voice_end + TAIL > MAXD: print(f'⚠️  La voz termina en {voice_end:.1f}s: el video se recortará a {MAXD:.0f} s.')
    scenes = []
    for si, s in enumerate(sb['scenes']):
        if si == 0: t0 = 0.0
        elif si in first: t0 = round(times[first[si]][0] - 0.3, 3)
        else:   # escena sin narración: empieza al terminar la frase anterior
            prev = [times[k][1] for k, o in enumerate(owner) if o < si]; t0 = round((prev[-1] if prev else 0) + .35, 3)
        s = json.loads(json.dumps(s)); s['t0'] = t0; scenes.append(s)
    for i, s in enumerate(scenes):
        if s['t0'] is None: s['t0'] = scenes[i - 1]['t0'] + 3
    for i, s in enumerate(scenes): s['t1'] = scenes[i + 1]['t0'] if i + 1 < len(scenes) else duration
    # resolver cues
    missing = []
    def find(si, text, after=0.0):
        want = [norm(w) for w in tokens(text) if norm(w)]
        idx = [k for k, o in enumerate(owner) if o == si]
        for a in range(len(idx)):
            if all(a + j < len(idx) and norm(toks[idx[a + j]]).startswith(want[j]) for j in range(len(want))):
                if times[idx[a]][0] >= after: return round(times[idx[a]][0], 3)
        return None
    def walk(o, si):
        if isinstance(o, dict):
            for k, v in list(o.items()):
                if (k == 'cue' or k.startswith('cue_')) and isinstance(v, str):
                    tt = find(si, v)
                    if tt is None: missing.append(f'escena {si} ({scenes[si]["type"]}): "{v}"'); o.pop(k)
                    else: o['_' + k] = v; o[k] = tt
                else: walk(v, si)
        elif isinstance(o, list):
            for v in o: walk(v, si)
    for si, s in enumerate(scenes): walk(s, si)
    for m in missing: print('⚠️  cue no encontrado (se usa tiempo por defecto):', m)
    # subtítulos
    caps, cur = [], []
    MAXW = 12 if LONG else 4   # largo: frases de teleprompter de hasta 12 palabras
    for k, (tok, (a, b)) in enumerate(zip(toks, times)):
        if cur and (owner[k] != owner[k - 1] or a - cur[-1][1] > (1.2 if LONG else .6) or len(cur) >= MAXW): caps.append(cur); cur = []
        cur.append([round(a, 3), round(b, 3), tok])
        if (re.search(r'[.:;?!…]$', tok)) or (re.search(r',$', tok) and (not LONG or len(cur) >= 6)): caps.append(cur); cur = []
    if cur: caps.append(cur)
    keep = {k: data[k] for k in ('ticker', 'name', 'short_name', 'exchange', 'currency', 'series', 'quarterly', 'metrics', 'price', 'as_of') if k in data}
    chapters = []
    if LONG:
        chapters = [{'index': 0, 't0': 0.0, 'title': sb.get('intro_title', 'Introducción')}]
        for sc in scenes:
            if sc['type'] == 'chapter': chapters.append({'index': len(chapters), 't0': sc['t0'], 'title': sc.get('chapter_name') or sc.get('title', '')})
    import base64
    br = brand(); lp = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'brand', 'logo_mask_small.png')
    if os.path.exists(lp): br['logo_data'] = 'data:image/png;base64,' + base64.b64encode(open(lp, 'rb').read()).decode()
    video = {'duration': duration, 'offset': OFFSET, 'brand': br, 'data': keep, 'scenes': scenes, 'captions': caps,
             'format': 'long' if LONG else 'short', 'novoice': novoice, 'chapters': chapters, 'thumbnail': sb.get('thumbnail', {}), 'slug': sb.get('slug', ''),
             'brand_colors': sb.get('brand_colors')}
    # imágenes reales (fetch_images.py): se incrustan como dataURL para que el render no dependa de rutas
    used, missing_img = set(), []
    def grab_imgs(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ('image', 'bg_image', 'logo') and isinstance(v, str): used.add(v)
                else: grab_imgs(v)
        elif isinstance(o, list):
            for v in o: grab_imgs(v)
    grab_imgs(scenes); grab_imgs(sb.get('thumbnail', {}))
    cp = os.path.join(vdir, 'images', 'credits.json'); cred = load(cp) if os.path.exists(cp) else {}
    video['images'], video['credits'] = {}, {}
    for rel in sorted(used):
        fp = os.path.join(vdir, rel)
        if not os.path.exists(fp): missing_img.append(rel); continue
        mime = 'image/png' if rel.lower().endswith('.png') else 'image/jpeg'
        video['images'][rel] = f'data:{mime};base64,' + base64.b64encode(open(fp, 'rb').read()).decode()
        r = cred.get(rel, {})
        if r.get('kind') != 'logo':
            c = r.get('credit') or ' · '.join(x for x in ['Foto: ' + (r.get('creator') or 'autor desconocido'), r.get('license'), r.get('provider')] if x)
            if r: video['credits'][rel] = c
    for m in missing_img: print('⚠️  imagen no encontrada (no se dibuja):', m)
    if used: print(f'imágenes: {len(used) - len(missing_img)} incrustadas')
    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True)
    open(os.path.join(vdir, 'build', 'video.js'), 'w').write('window.VIDEO=' + json.dumps(video, ensure_ascii=False) + ';')
    json.dump({'duration': duration, 'offset': OFFSET, 'scenes': scenes, 'format': 'long' if LONG else 'short', 'chapters': chapters, 'slug': sb.get('slug', '')},
              open(os.path.join(vdir, 'build', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    if LONG:
        fm = lambda x: f'{int(x // 60)}:{int(x % 60):02d}'
        open(os.path.join(vdir, 'capitulos.txt'), 'w').write('\n'.join(f"{fm(c['t0'])} {c['title']}" for c in chapters) + '\n')
        print('capítulos de YouTube:'); [print('  ', fm(c['t0']), c['title']) for c in chapters]
    print(f'duración del video: {duration:.1f}s (voz hasta {voice_end:.1f}s)')
    if not LONG:
        for s in scenes: print(f'  {s["t0"]:6.2f}–{s["t1"]:6.2f}  {s["type"]}')
    else:
        short = [s for s in scenes if s['t1'] - s['t0'] < 3.5]; longs = [s for s in scenes if s['t1'] - s['t0'] > 16]
        print(f'escenas: {len(scenes)} | muy cortas (<3.5 s): {len(short)} | muy largas (>16 s): {len(longs)}')
        for s in short + longs: print(f'  revisar escena {scenes.index(s)} ({s["type"]}): {s["t1"] - s["t0"]:.1f}s')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
