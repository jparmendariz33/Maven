#!/usr/bin/env python3
"""Descarga todos los datos de una acción para un short.

Uso:  python3 scripts/fetch_data.py AAPL videos/2026-11-04-AAPL

Genera en la carpeta de salida:
  data.json    -> datos completos (los consume el motor de video)
  summary.md   -> resumen legible para escribir el guion
Fuente: Yahoo Finance (chart, quoteSummary, fundamentals-timeseries, search).
"""
import json, sys, os, time, datetime as dt, http.cookiejar, urllib.request, urllib.parse

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
opener.addheaders = [("User-Agent", UA), ("Accept", "application/json,text/plain,*/*")]


def get(url, tries=3):
    for i in range(tries):
        try:
            with opener.open(url, timeout=30) as r:
                return r.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            if e.code == 404 and "fc.yahoo.com" in url:
                return ""  # fc.yahoo.com responde 404 pero deja la cookie
            if i == tries - 1:
                raise
        except Exception:
            if i == tries - 1:
                raise
        time.sleep(2 ** i)


def raw(d, *keys):
    for k in keys:
        if not isinstance(d, dict) or k not in d:
            return None
        d = d[k]
    if isinstance(d, dict):
        return d.get("raw", None) if "raw" in d else (None if not d else d)
    return d


def main(ticker, out):
    os.makedirs(out, exist_ok=True)
    T = ticker.upper()
    # ---------- precio diario 1 año ----------
    ch = json.loads(get(f"https://query1.finance.yahoo.com/v8/finance/chart/{T}?range=1y&interval=1d"))
    r = ch["chart"]["result"][0]
    meta = r["meta"]
    q = r["indicators"]["quote"][0]
    series = []
    for ts, c, v in zip(r["timestamp"], q["close"], q["volume"]):
        if c is None:
            continue
        series.append([dt.datetime.fromtimestamp(ts, dt.UTC).strftime("%Y-%m-%d"), round(c, 2), int(v or 0)])

    # ---------- fundamentales (requiere crumb) ----------
    get("https://fc.yahoo.com")
    crumb = get("https://query2.finance.yahoo.com/v1/test/getcrumb").strip()
    mods = "price,summaryDetail,defaultKeyStatistics,financialData,calendarEvents,assetProfile,earnings,recommendationTrend"
    qs = json.loads(get(f"https://query2.finance.yahoo.com/v10/finance/quoteSummary/{T}?modules={mods}&crumb={urllib.parse.quote(crumb)}"))
    s = qs["quoteSummary"]["result"][0]

    # ---------- trimestres: ingresos, utilidad neta, EPS ----------
    p1 = int(time.time() - 3.2 * 365 * 86400)
    p2 = int(time.time() + 86400)
    types = "quarterlyTotalRevenue,quarterlyNetIncome,quarterlyDilutedEPS,annualTotalRevenue,annualNetIncome,quarterlyStockholdersEquity"
    tsj = json.loads(get(f"https://query2.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/{T}?type={types}&period1={p1}&period2={p2}"))
    fs = {}
    for res in tsj["timeseries"]["result"]:
        typ = res["meta"]["type"][0]
        for row in res.get(typ, []) or []:
            if row and row.get("reportedValue"):
                fs.setdefault(typ, {})[row["asOfDate"]] = row["reportedValue"]["raw"]
    def table(prefix):
        rv = fs.get(prefix + "TotalRevenue", {}); ni = fs.get(prefix + "NetIncome", {}); eps = fs.get(prefix + "DilutedEPS", {})
        dates = sorted(set(rv) | set(ni))
        return [{"period": d, "revenue": rv.get(d), "net_income": ni.get(d), "eps": eps.get(d)} for d in dates]
    quarterly, annual = table("quarterly"), table("annual")

    # ---------- noticias recientes (semilla; verificar con búsqueda web) ----------
    news = []
    try:
        sj = json.loads(get(f"https://query2.finance.yahoo.com/v1/finance/search?q={T}&newsCount=12&quotesCount=0"))
        for n in sj.get("news", []):
            news.append({"date": dt.datetime.fromtimestamp(n.get("providerPublishTime", 0), dt.UTC).strftime("%Y-%m-%d"),
                         "title": n.get("title"), "publisher": n.get("publisher"), "link": n.get("link")})
    except Exception as e:
        news.append({"error": str(e)})

    # ---------- métricas calculadas ----------
    closes = [x[1] for x in series]
    last = closes[-1]
    def chg(n):
        return round((last / closes[-1 - n] - 1) * 100, 2) if len(closes) > n else None
    hi_i = max(range(len(closes)), key=lambda i: closes[i]); lo_i = min(range(len(closes)), key=lambda i: closes[i])
    ytd_base = next((x[1] for x in series if x[0][:4] == series[-1][0][:4]), closes[0])
    moves = []
    for i in range(max(1, len(series) - 60), len(series)):
        pct = (series[i][1] / series[i - 1][1] - 1) * 100
        prev = [x[2] for x in series[max(0, i - 21):i - 1]] or [1]
        moves.append({"date": series[i][0], "close": series[i][1], "pct": round(pct, 2),
                      "volume": series[i][2], "vol_x": round(series[i][2] / (sum(prev) / len(prev) or 1), 2)})
    moves = sorted(moves, key=lambda m: -abs(m["pct"]))[:8]

    pe = raw(s, "summaryDetail", "trailingPE"); fpe = raw(s, "summaryDetail", "forwardPE")
    peg = raw(s, "defaultKeyStatistics", "pegRatio") or raw(s, "defaultKeyStatistics", "trailingPegRatio")
    eg = raw(s, "financialData", "earningsGrowth")
    peg_note = "yahoo"
    if not peg and pe and eg and eg > 0:
        peg = round(pe / (eg * 100), 2); peg_note = "calculado: P/E ÷ crecimiento de utilidades (%)"
    roe = raw(s, "financialData", "returnOnEquity")
    edates = raw(s, "calendarEvents", "earnings", "earningsDate") or []
    nxt = None
    if isinstance(edates, list) and edates:
        e0 = edates[0]; nxt = dt.datetime.fromtimestamp(e0["raw"] if isinstance(e0, dict) else e0, dt.UTC).strftime("%Y-%m-%d")

    data = {
        "ticker": T,
        "name": raw(s, "price", "longName") or meta.get("longName") or T,
        "short_name": raw(s, "price", "shortName"),
        "exchange": meta.get("fullExchangeName") or meta.get("exchangeName"),
        "currency": meta.get("currency"),
        "sector": raw(s, "assetProfile", "sector"), "industry": raw(s, "assetProfile", "industry"),
        "business_summary": raw(s, "assetProfile", "longBusinessSummary"),
        "as_of": series[-1][0], "fetched_at": dt.datetime.now(dt.UTC).isoformat(timespec="seconds"),
        "price": last,
        "high_52w": meta.get("fiftyTwoWeekHigh"), "low_52w": meta.get("fiftyTwoWeekLow"),
        "close_high_1y": {"date": series[hi_i][0], "close": closes[hi_i]},
        "close_low_1y": {"date": series[lo_i][0], "close": closes[lo_i]},
        "change_pct": {"1d": chg(1), "5s": chg(5), "15s": chg(15), "1m": chg(21), "3m": chg(63), "6m": chg(126),
                        "1y": round((last / closes[0] - 1) * 100, 2), "ytd": round((last / ytd_base - 1) * 100, 2),
                        "from_1y_high": round((last / closes[hi_i] - 1) * 100, 2)},
        "biggest_moves_60s": moves,
        "metrics": {
            "market_cap": raw(s, "price", "marketCap") or raw(s, "summaryDetail", "marketCap"),
            "pe_trailing": pe, "pe_forward": fpe, "peg": peg, "peg_source": peg_note,
            "roe": roe, "profit_margin": raw(s, "financialData", "profitMargins"),
            "revenue_growth_yoy": raw(s, "financialData", "revenueGrowth"), "earnings_growth_yoy": eg,
            "eps_trailing": raw(s, "defaultKeyStatistics", "trailingEps"),
            "beta": raw(s, "summaryDetail", "beta"), "dividend_yield": raw(s, "summaryDetail", "dividendYield"),
            "debt_to_equity": raw(s, "financialData", "debtToEquity"),
            "free_cash_flow": raw(s, "financialData", "freeCashflow"),
            "target_mean_price": raw(s, "financialData", "targetMeanPrice"),
            "recommendation": raw(s, "financialData", "recommendationKey"),
            "analysts": raw(s, "financialData", "numberOfAnalystOpinions"),
        },
        "next_earnings": nxt,
        "quarterly": quarterly[-8:], "annual": annual[-4:],
        "news_seed": news,
        "series": series,
    }
    json.dump(data, open(os.path.join(out, "data.json"), "w"), ensure_ascii=False, indent=1)
    open(os.path.join(out, "summary.md"), "w").write(summary(data))
    print(summary(data))


def big(v):
    if v is None:
        return "n/d"
    a = abs(v)
    for d, u in ((1e12, "T"), (1e9, "B"), (1e6, "M")):
        if a >= d:
            return f"{v / d:.2f}{u}"
    return f"{v:,.0f}"


def pct(v):
    return "n/d" if v is None else f"{v * 100:.1f}%"


def summary(d):
    m, c = d["metrics"], d["change_pct"]
    L = [f"# {d['name']} ({d['ticker']}) — {d['exchange']} — datos al {d['as_of']}",
         f"Sector: {d['sector']} / {d['industry']}", "",
         f"**Precio:** {d['price']} {d['currency']} | 52s: {d['low_52w']}–{d['high_52w']}",
         f"Máx. cierre 1a: {d['close_high_1y']['close']} ({d['close_high_1y']['date']}) | Mín. cierre 1a: {d['close_low_1y']['close']} ({d['close_low_1y']['date']})",
         "**Cambios:** " + " | ".join(f"{k}: {v}%" for k, v in c.items()), "",
         f"**Valuación:** Market cap {big(m['market_cap'])} | P/E {m['pe_trailing']} | P/E fwd {m['pe_forward']} | PEG {m['peg']} ({m['peg_source']})",
         f"**Rentabilidad:** ROE {pct(m['roe'])} | Margen neto {pct(m['profit_margin'])} | Crec. ingresos a/a {pct(m['revenue_growth_yoy'])} | Crec. utilidad a/a {pct(m['earnings_growth_yoy'])}",
         f"**Analistas:** objetivo medio {m['target_mean_price']} | recomendación {m['recommendation']} ({m['analysts']})",
         f"**Próximos resultados:** {d['next_earnings']}", "",
         "## Trimestres (ingresos / utilidad neta / EPS)"]
    for qq in d["quarterly"]:
        L.append(f"- {qq['period']}: {big(qq['revenue'])} / {big(qq['net_income'])} / {qq['eps']}")
    L += ["", "## Movimientos diarios más grandes (últimas 60 sesiones)"]
    for mv in d["biggest_moves_60s"]:
        L.append(f"- {mv['date']}: {mv['pct']:+.2f}% → {mv['close']} (volumen {mv['vol_x']}x el promedio)")
    L += ["", "## Titulares (semilla, VERIFICAR)"]
    for n in d["news_seed"]:
        L.append(f"- {n.get('date')} · {n.get('publisher')}: {n.get('title')}")
    L += ["", "## Resumen del negocio", (d["business_summary"] or "")[:900]]
    return "\n".join(L) + "\n"


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
