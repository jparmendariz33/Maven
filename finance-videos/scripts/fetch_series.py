#!/usr/bin/env python3
"""Serie histórica de precios (Yahoo Finance) lista para pegar en una escena `line` de un video largo.

Uso:  python3 scripts/fetch_series.py SIMBOLO DESDE [intervalo] [salida.json]
  SIMBOLO   ^GSPC (S&P 500), ^IXIC (Nasdaq), ^MXX (IPC), ^N225 (Nikkei), MXN=X (dólar/peso), AAPL…
  DESDE     AAAA-MM-DD
  intervalo 1mo (def.), 1wk o 1d
Imprime y guarda [["AAAA-MM-DD", cierre], ...]. Las fuentes de video son datos; verifica cifras clave en el guion.
"""
import sys, json, datetime as dt, os
sys.path.insert(0, os.path.dirname(__file__))
from fetch_data import get

def main(sym, since, interval='1mo', out=None):
    p1 = int(dt.datetime.fromisoformat(since).replace(tzinfo=dt.UTC).timestamp()); p2 = int(dt.datetime.now(dt.UTC).timestamp())
    import urllib.parse
    j = json.loads(get(f"https://query2.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(sym)}?period1={p1}&period2={p2}&interval={interval}"))
    r = j['chart']['result'][0]; ts = r['timestamp']; c = r['indicators']['quote'][0]['close']
    pts = [[dt.datetime.fromtimestamp(a, dt.UTC).strftime('%Y-%m-%d'), round(b, 2)] for a, b in zip(ts, c) if b is not None]
    if out: json.dump(pts, open(out, 'w'))
    print(f'{sym}: {len(pts)} puntos, {pts[0]} → {pts[-1]}'); return pts

if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    main(*sys.argv[1:5])
