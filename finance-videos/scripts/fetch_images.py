#!/usr/bin/env python3
"""Imágenes reales para los videos (logos, sucursales, productos, sedes, personas). Costo cero.

Fuentes (en este orden):
  1. Openverse (api.openverse.org): busca en Wikimedia Commons, Flickr y otros, solo licencias que permiten uso comercial
     y modificación (CC0, dominio público, CC BY, CC BY-SA). Nada NC ni ND.
  2. Logos: archivo de Wikimedia Commons por nombre ("Costco Wholesale logo 2010-10-26.svg"); se baja como PNG transparente.
     El nombre exacto se saca de la página de Wikipedia de la empresa (WebSearch/WebFetch: "File:...svg").
  3. `add`: cualquier URL (sala de prensa / media kit oficial de la empresa). Anota siempre la fuente.

Uso (DIR = carpeta del video, p. ej. videos/2026-11-06-COST o largos/2026-11-15):
  python3 scripts/fetch_images.py search DIR "costco warehouse" [--n 12] [--source wikimedia|flickr|all]
        → baja vistas previas a DIR/images/_cand/ y una hoja numerada DIR/images/_cand/sheet.jpg (míra la hoja con Read)
  python3 scripts/fetch_images.py pick DIR 3 tienda            → la candidata #3 de la ÚLTIMA búsqueda → DIR/images/tienda.jpg
  python3 scripts/fetch_images.py commons DIR tienda "Costco_Mountain_View.jpg" --credit "Foto: Autor · CC BY-SA 4.0 · Wikimedia Commons"
        → baja un archivo de Commons por nombre (paciente con los límites de Wikimedia). El nombre, autor y licencia se sacan de
          la página del archivo con WebFetch (commons.wikimedia.org/wiki/File:…) o del buscador
          commons.wikimedia.org/w/index.php?search=costco+store&title=Special:MediaSearch&type=image
  python3 scripts/fetch_images.py icon DIR logo costco        → logo de simple-icons (jsDelivr) con el color de la marca → images/logo.png
  python3 scripts/fetch_images.py logo DIR logo "Costco Wholesale logo 2010-10-26.svg"   → logo de Commons → DIR/images/logo.png

Nota: desde los servidores de la nube Wikimedia suele responder 429 (límite de velocidad). El script reintenta solo, con espera
creciente (hasta ~3 min por archivo); Openverse a veces responde 504: entonces usa `commons` o `add`. jsDelivr (simple-icons) es estable.
Si Wikimedia sigue bloqueando, usa `search … --source flickr` (Flickr baja sin límite; también licencias libres).
  python3 scripts/fetch_images.py add DIR fachada "https://…/foto.jpg" --credit "Foto: Costco (sala de prensa)"
  python3 scripts/fetch_images.py credits DIR                  → DIR/images/creditos.md (pégalo en youtube.md)

En el storyboard se usan como "images/tienda.jpg" (campos `image`, `bg_image`, `logo`). build_timeline.py las incrusta.
Créditos en DIR/images/credits.json (los usa el motor para el pie de foto y `credits` para la descripción).
"""
import sys, os, json, re, time, hashlib, urllib.request, urllib.parse, io, argparse

UA = 'CostaStudioFinance/1.0 (https://github.com/jparmendariz33/Maven; contenido educativo)'
OK_LIC = 'commercial,modification'
LIC_NAME = {'cc0': 'CC0', 'pdm': 'Dominio público', 'by': 'CC BY', 'by-sa': 'CC BY-SA'}


def get(url, tries=4, binary=False):
    if 'wikimedia.org' in url: tries = max(tries, 7)   # Wikimedia limita por IP: paciencia (esperas de 15–60 s)
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
            with urllib.request.urlopen(req, timeout=40) as r:
                b = r.read(); return b if binary else b.decode('utf-8')
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and i < tries - 1: time.sleep(min(60, 15 * (i + 1)) if 'wikimedia.org' in url else 3 * (i + 1)); continue
            if i == tries - 1: raise
        except Exception:
            if i == tries - 1: raise
        time.sleep(2 * (i + 1))


def wm_thumb(url, width):
    """URL de upload.wikimedia.org → miniatura de ancho estándar (960/1280/1920) si el original es más grande."""
    m = re.match(r'https://upload\.wikimedia\.org/wikipedia/commons/(\w)/(\w\w)/([^/]+)$', url)
    if not m: return url
    name = m.group(3); ext = name.rsplit('.', 1)[-1].lower()
    suffix = '.png' if ext in ('svg', 'tif', 'tiff') else ''
    return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{m.group(1)}/{m.group(2)}/{name}/{width}px-{name}{suffix}'


def commons_url(filename):
    n = filename.replace('File:', '').replace('Archivo:', '').strip().replace(' ', '_')
    n = urllib.parse.unquote(n); h = hashlib.md5(n.encode()).hexdigest()
    return f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(n)}', n


def save_img(data, out, max_side=2200, keep_alpha=False):
    from PIL import Image, ImageOps
    im = Image.open(io.BytesIO(data)); im = ImageOps.exif_transpose(im)
    if max(im.size) > max_side: im.thumbnail((max_side, max_side))
    if keep_alpha:
        im = im.convert('RGBA'); im.save(out, 'PNG', optimize=True)
    else:
        if im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA'); bgc = Image.new('RGB', im.size, (255, 255, 255)); bgc.paste(im, mask=im.split()[-1]); im = bgc
        im.convert('RGB').save(out, 'JPEG', quality=86, optimize=True, progressive=True)
    return im.size


def credits_path(d): return os.path.join(d, 'images', 'credits.json')


def load_credits(d):
    p = credits_path(d)
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}


def put_credit(d, rel, rec):
    c = load_credits(d); c[rel] = rec
    json.dump(c, open(credits_path(d), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


def short_credit(r):
    if r.get('credit'): return r['credit']
    who = r.get('creator') or 'autor desconocido'
    return f"Foto: {who} · {r.get('license', '')} · {r.get('provider', 'Wikimedia Commons')}".replace(' ·  ·', ' ·')


def cmd_search(a):
    cand = os.path.join(a.dir, 'images', '_cand'); os.makedirs(cand, exist_ok=True)
    for f in os.listdir(cand): os.remove(os.path.join(cand, f))
    q = {'q': a.query, 'page_size': str(min(20, a.n * 2)), 'license_type': OK_LIC, 'mature': 'false'}
    if a.source != 'all': q['source'] = a.source
    res = json.loads(get('https://api.openverse.org/v1/images/?' + urllib.parse.urlencode(q)))['results']
    out = []
    for r in res:
        if len(out) >= a.n: break
        w, h = r.get('width') or 0, r.get('height') or 0
        if w and max(w, h) < 700: continue      # muy chica para video
        try:
            time.sleep(.6)   # Wikimedia limita la velocidad; solo acepta anchos estándar (330, 960, 1280, 1920)
            try: data = get(f"https://api.openverse.org/v1/images/{r['id']}/thumb/", tries=2, binary=True)   # caché de Openverse
            except Exception: data = None
            thumb = wm_thumb(r['url'], 330) if 'upload.wikimedia.org' in r['url'] and (w or 9999) > 330 else None
            if not data and thumb: data = get(thumb, tries=2, binary=True)
        except Exception as e:
            print('  (sin vista previa:', r.get('title', '')[:50], e, ')'); continue
        i = len(out) + 1; fn = os.path.join(cand, f'c{i:02d}.jpg')
        try: save_img(data, fn, 600)
        except Exception: continue
        lic = LIC_NAME.get(r.get('license'), (r.get('license') or '').upper()) + (' ' + r['license_version'] if r.get('license_version') and r.get('license') not in ('cc0', 'pdm') else '')
        rec = {'n': i, 'title': r.get('title'), 'creator': re.sub(r'<[^>]+>', '', r.get('creator') or '').strip(), 'license': lic,
               'license_url': r.get('license_url'), 'source_url': r.get('foreign_landing_url'), 'url': r['url'], 'width': w, 'height': h,
               'provider': {'wikimedia': 'Wikimedia Commons', 'flickr': 'Flickr'}.get(r.get('source'), r.get('source'))}
        out.append(rec)
        print(f"#{i:2d} {rec['width']}x{rec['height']} {rec['license']:12s} {(rec['title'] or '')[:70]}")
    json.dump(out, open(os.path.join(cand, 'index.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if out: sheet(cand, out); print('hoja de candidatas:', os.path.join(cand, 'sheet.jpg'))
    else: print('Sin resultados útiles. Prueba otra búsqueda (en inglés suele haber más) o usa `add` con la sala de prensa.')


def sheet(cand, out):
    from PIL import Image, ImageDraw, ImageFont
    cols, cw, ch = 4, 360, 300; rows = (len(out) + cols - 1) // cols
    S = Image.new('RGB', (cols * cw, rows * ch), (20, 20, 20)); dr = ImageDraw.Draw(S)
    fp = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'fonts', 'SpaceGrotesk-700.ttf')
    font = ImageFont.truetype(fp, 26) if os.path.exists(fp) else ImageFont.load_default()
    for k, r in enumerate(out):
        im = Image.open(os.path.join(cand, f"c{r['n']:02d}.jpg")); im.thumbnail((cw - 10, ch - 44))
        x, y = (k % cols) * cw, (k // cols) * ch; S.paste(im, (x + 5, y + 5))
        dr.rectangle([x + 5, y + ch - 40, x + cw - 5, y + ch - 4], fill=(10, 10, 10))
        dr.text((x + 12, y + ch - 38), f"#{r['n']}  {r['width']}x{r['height']}", fill=(235, 230, 186), font=font)
    S.save(os.path.join(cand, 'sheet.jpg'), quality=85)


def cmd_pick(a):
    cand = os.path.join(a.dir, 'images', '_cand'); idx = json.load(open(os.path.join(cand, 'index.json'), encoding='utf-8'))
    r = next(x for x in idx if x['n'] == a.n)
    url = r['url']
    if 'upload.wikimedia.org' in url and (r.get('width') or 0) > 1920: url = wm_thumb(url, 1920)
    data = get(url, binary=True)
    rel = f'images/{a.name}.jpg'; size = save_img(data, os.path.join(a.dir, rel))
    rec = {k: r[k] for k in ('title', 'creator', 'license', 'license_url', 'source_url', 'provider')}
    put_credit(a.dir, rel, rec); print(f'✅ {rel} {size[0]}x{size[1]} · {short_credit(rec)}')


def cmd_logo(a):
    url, n = commons_url(a.file)
    data = None
    for w in (1280, 960):
        try: data = get(wm_thumb(url, w) if n.lower().endswith('.svg') else url, binary=True); break
        except Exception as e: err = e
    if data is None: sys.exit(f'No se pudo bajar {n}: {err}')
    rel = f'images/{a.name}.png'; size = save_img(data, os.path.join(a.dir, rel), 1400, keep_alpha=True)
    put_credit(a.dir, rel, {'title': n, 'credit': 'Logo: marca registrada de su titular · vía Wikimedia Commons', 'source_url': 'https://commons.wikimedia.org/wiki/File:' + n, 'kind': 'logo'})
    print(f'✅ {rel} {size[0]}x{size[1]}')


def cmd_commons(a):
    url, n = commons_url(a.file)
    try: data = get(wm_thumb(url, a.width), binary=True)
    except Exception: data = get(url, binary=True)   # el original (si es chico no hay miniatura de ese ancho)
    rel = f'images/{a.name}.jpg'; size = save_img(data, os.path.join(a.dir, rel))
    put_credit(a.dir, rel, {'title': n, 'credit': a.credit, 'source_url': 'https://commons.wikimedia.org/wiki/File:' + n, 'provider': 'Wikimedia Commons'})
    print(f'✅ {rel} {size[0]}x{size[1]} · {a.credit}')


def cmd_icon(a):
    import subprocess, tempfile
    ver = 'simple-icons@13.21.0'
    svg = get(f'https://cdn.jsdelivr.net/npm/{ver}/icons/{a.slug}.svg')
    color = a.color
    if not color:
        try:
            idx = json.loads(get(f'https://cdn.jsdelivr.net/npm/{ver}/_data/simple-icons.json'))['icons']
            slug = lambda t: re.sub(r'[^a-z0-9]', '', t.lower().replace('+', 'plus').replace('.', 'dot').replace('&', 'and'))
            hit = next((i for i in idx if i.get('slug') == a.slug or slug(i['title']) == a.slug), None)
            color = '#' + hit['hex'] if hit else '#0A0A0A'
        except Exception: color = '#0A0A0A'
    tmp = tempfile.NamedTemporaryFile(suffix='.svg', delete=False); tmp.write(svg.encode()); tmp.close()
    rel = f'images/{a.name}.png'; out = os.path.join(a.dir, rel)
    subprocess.run(['node', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'svg2png.js'), tmp.name, out, '1000', color], check=True)
    from PIL import Image
    im = Image.open(out); bb = im.getbbox(); im.crop(bb).save(out)
    put_credit(a.dir, rel, {'title': a.slug, 'credit': 'Logo: marca registrada de su titular · ícono de Simple Icons (CC0)', 'source_url': f'https://simpleicons.org/?q={a.slug}', 'kind': 'logo'})
    print(f'✅ {rel} (color {color})')


def cmd_add(a):
    data = get(a.url, binary=True); png = a.url.lower().split('?')[0].endswith('.png') or a.logo
    rel = f'images/{a.name}.' + ('png' if png else 'jpg'); size = save_img(data, os.path.join(a.dir, rel), keep_alpha=png)
    put_credit(a.dir, rel, {'title': a.name, 'credit': a.credit, 'source_url': a.source or a.url, 'kind': 'logo' if a.logo else 'photo'})
    print(f'✅ {rel} {size[0]}x{size[1]} · {a.credit}')


def cmd_credits(a):
    c = load_credits(a.dir); L = ['Imágenes:']
    for rel, r in c.items():
        if r.get('kind') == 'logo': L.append(f"- {r.get('credit')} ({r.get('source_url')})"); continue
        lic = f" · {r['license']} ({r['license_url']})" if r.get('license_url') else ''
        L.append(f"- {r.get('title') or rel}: {short_credit(r) if r.get('credit') else (r.get('creator') or 'autor desconocido') + lic} — {r.get('source_url')}")
    txt = '\n'.join(L) + '\n'; open(os.path.join(a.dir, 'images', 'creditos.md'), 'w', encoding='utf-8').write(txt); print(txt)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter); sp = p.add_subparsers(dest='cmd', required=True)
    s = sp.add_parser('search'); s.add_argument('dir'); s.add_argument('query'); s.add_argument('--n', type=int, default=12); s.add_argument('--source', default='wikimedia')
    s = sp.add_parser('pick'); s.add_argument('dir'); s.add_argument('n', type=int); s.add_argument('name')
    s = sp.add_parser('logo'); s.add_argument('dir'); s.add_argument('name'); s.add_argument('file')
    s = sp.add_parser('add'); s.add_argument('dir'); s.add_argument('name'); s.add_argument('url'); s.add_argument('--credit', required=True); s.add_argument('--source'); s.add_argument('--logo', action='store_true')
    s = sp.add_parser('credits'); s.add_argument('dir')
    s = sp.add_parser('commons'); s.add_argument('dir'); s.add_argument('name'); s.add_argument('file'); s.add_argument('--credit', required=True); s.add_argument('--width', type=int, default=1920)
    s = sp.add_parser('icon'); s.add_argument('dir'); s.add_argument('name'); s.add_argument('slug'); s.add_argument('--color')
    a = p.parse_args(); os.makedirs(os.path.join(a.dir, 'images'), exist_ok=True)
    {'search': cmd_search, 'pick': cmd_pick, 'logo': cmd_logo, 'add': cmd_add, 'credits': cmd_credits, 'commons': cmd_commons, 'icon': cmd_icon}[a.cmd](a)


if __name__ == '__main__':
    main()
