#!/usr/bin/env python3
"""¿Ya cerró la bolsa? Regla del cierre de Costa Studio Finance (pedida por JP, 9 nov 2026):
ningún video con datos de mercado se termina ni se entrega antes del cierre de la sesión ordinaria de Wall Street
(16:00 de Nueva York = 15:00 CDMX en invierno, 14:00 CDMX en el verano de EE.UU.; la BMV cierra a la misma hora).

Uso:  python3 scripts/market_close.py            → dice el estado y termina (código 0 = datos finales, 1 = todavía abierta)
      python3 scripts/market_close.py --wait     → si está abierta, ESPERA hasta 12 min después del cierre y entonces termina con 0
Estados:
  CERRADO     la sesión de hoy ya terminó: los datos de Yahoo son los de cierre. Úsalos.
  ABIERTO     la sesión sigue: prepara guion, imágenes y fuentes, pero NO escribas cifras de precio ni renderices todavía.
  SIN SESIÓN  hoy no hay mercado (fin de semana o festivo): los datos finales son los del último cierre; nombra ese día en el guion.
Fuente: Yahoo Finance (^GSPC: horario de la sesión regular y hora del último precio).
"""
import sys, json, time, datetime as dt
sys.path.insert(0, __import__('os').path.dirname(__file__))
from fetch_data import get

MARGIN = 12 * 60   # Yahoo tarda unos minutos en fijar el cierre oficial
DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']


def state():
    m = json.loads(get('https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?range=5d&interval=1d'))['chart']['result'][0]['meta']
    now = time.time(); off = m.get('gmtoffset', -18000); reg = m['currentTradingPeriod']['regular']; last = m['regularMarketTime']
    ny = lambda ts: dt.datetime.fromtimestamp(ts + off, dt.UTC)
    today, lastday = ny(now).date(), ny(last).date()
    if reg['start'] <= now < reg['end'] + MARGIN and ny(reg['start']).date() == today:
        return 'ABIERTO', reg['end'] + MARGIN - now, today
    if lastday == today: return 'CERRADO', 0, lastday
    if now < reg['start'] and ny(reg['start']).date() == today: return 'ABIERTO', reg['end'] + MARGIN - now, today   # antes de la apertura
    return 'SIN SESIÓN', 0, lastday


def main():
    wait = '--wait' in sys.argv
    st, left, day = state()
    while st == 'ABIERTO' and wait:
        print(f'ABIERTO: faltan {left / 60:.0f} min para tener datos de cierre; esperando…', flush=True)
        time.sleep(min(left + 5, 900)); st, left, day = state()
    d = f'{DIAS[day.weekday()]} {day.isoformat()}'
    if st == 'CERRADO': print(f'CERRADO: la sesión del {d} ya terminó. Los datos de Yahoo son los de cierre: úsalos.')
    elif st == 'ABIERTO': print(f'ABIERTO: la sesión del {d} sigue (faltan {left / 60:.0f} min para datos finales). No escribas cifras de precio ni renderices todavía; usa --wait.')
    else: print(f'SIN SESIÓN: hoy no hay mercado. El último cierre es el del {d}: nombra ese día en el guion.')
    sys.exit(1 if st == 'ABIERTO' else 0)


if __name__ == '__main__':
    main()
