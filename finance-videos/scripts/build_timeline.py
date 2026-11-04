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

MIN_DUR, MAX_DUR = 60.0, 95.0   # video de ~1.5 min
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
    data = load(os.path.join(vdir, 'data.json'))
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
    duration = round(max(MIN_DUR, min(MAX_DUR, voice_end + TAIL)), 2)
    if voice_end + TAIL > MAX_DUR: print(f'⚠️  La voz termina en {voice_end:.1f}s: el video se recortará a {MAX_DUR:.0f} s.')
    scenes = []
    for si, s in enumerate(sb['scenes']):
        t0 = 0.0 if si == 0 else round(times[first[si]][0] - 0.3, 3) if si in first else None
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
    for k, (tok, (a, b)) in enumerate(zip(toks, times)):
        if cur and (owner[k] != owner[k - 1] or a - cur[-1][1] > .6 or len(cur) >= 4): caps.append(cur); cur = []
        cur.append([round(a, 3), round(b, 3), tok])
        if re.search(r'[.,:;?!…]$', tok): caps.append(cur); cur = []
    if cur: caps.append(cur)
    keep = {k: data[k] for k in ('ticker', 'name', 'short_name', 'exchange', 'currency', 'series', 'quarterly', 'metrics', 'price', 'as_of')}
    import base64
    br = brand(); lp = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'brand', 'logo_mask_small.png')
    if os.path.exists(lp): br['logo_data'] = 'data:image/png;base64,' + base64.b64encode(open(lp, 'rb').read()).decode()
    video = {'duration': duration, 'offset': OFFSET, 'brand': br, 'data': keep, 'scenes': scenes, 'captions': caps}
    os.makedirs(os.path.join(vdir, 'build'), exist_ok=True)
    open(os.path.join(vdir, 'build', 'video.js'), 'w').write('window.VIDEO=' + json.dumps(video, ensure_ascii=False) + ';')
    json.dump({'duration': duration, 'offset': OFFSET, 'scenes': scenes}, open(os.path.join(vdir, 'build', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'duración del video: {duration:.1f}s (voz hasta {voice_end:.1f}s)')
    for s in scenes: print(f'  {s["t0"]:6.2f}–{s["t1"]:6.2f}  {s["type"]}')


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__)
    main(sys.argv[1])
