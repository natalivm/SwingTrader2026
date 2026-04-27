#!/usr/bin/env python3
"""
fetch_prices.py – pulls live stock prices from Yahoo Finance and compares
them against the entry prices recorded in data.js.

Usage:
    python fetch_prices.py            # print table to stdout
    python fetch_prices.py --json     # also dump raw prices as JSON
"""

import argparse
import json
import sys
from datetime import datetime

try:
    import yfinance as yf
except ImportError:
    sys.exit("yfinance is required.  Run:  pip install yfinance")


# ---------------------------------------------------------------------------
# Positions mirrored from data.js — update entries here when you add trades
# ---------------------------------------------------------------------------
POSITIONS = [
    # Table 1
    {"symbol": "Q",     "cat": "Long",  "entry": 136.76},
    {"symbol": "MU",    "cat": "Short", "entry": 498.36},
    {"symbol": "PANW",  "cat": "Long",  "entry": 170.28},
    {"symbol": "KMB",   "cat": "Long",  "entry":  96.05},
    {"symbol": "FIGS",  "cat": "Long",  "entry":  15.78},
    {"symbol": "NBIS",  "cat": "Short", "entry": 163.76},
    {"symbol": "NXT",   "cat": "Long",  "entry": 124.70},
    {"symbol": "AVGO",  "cat": "Short", "entry": 415.98},
    {"symbol": "GOOGL", "cat": "Short", "entry": 334.85},
    {"symbol": "DELL",  "cat": "Short", "entry": 210.53},
    {"symbol": "TXN",   "cat": "Short", "entry": 273.35},
    {"symbol": "STX",   "cat": "Short", "entry": 521.53},
    {"symbol": "BE",    "cat": "Short", "entry": 223.58},
    {"symbol": "NVDA",  "cat": "Short", "entry": 200.27},
    {"symbol": "SOFI",  "cat": "Long",  "entry":  23.14},
    {"symbol": "NET",   "cat": "Long",  "entry": 205.52},
    # Table 2
    {"symbol": "AMD",   "cat": "Short", "entry": 307.96},
    {"symbol": "MRVL",  "cat": "Short", "entry": 159.69},
    {"symbol": "ARM",   "cat": "Short", "entry": 206.11},
]

# Extra tickers to show price only (options underlyings, ETFs, etc.)
WATCHLIST = ["GDX", "SOXS", "SPXU"]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def fetch_prices(symbols: list[str]) -> dict[str, float | None]:
    """Return {symbol: last_price} for each symbol via yfinance."""
    tickers = yf.Tickers(" ".join(symbols))
    result: dict[str, float | None] = {}
    for sym in symbols:
        try:
            result[sym] = round(tickers.tickers[sym].fast_info.last_price, 2)
        except Exception:
            result[sym] = None
    return result


def pl_pct(entry: float, current: float, direction: str) -> float:
    """P&L % from entry, sign-flipped for short positions."""
    raw = (current - entry) / entry * 100
    return -raw if direction == "Short" else raw


def fmt_pct(val: float) -> str:
    sign = "+" if val >= 0 else ""
    return f"{sign}{val:.1f}%"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch live stock prices from Yahoo Finance.")
    parser.add_argument("--json", action="store_true", help="Dump raw prices as JSON to stdout")
    args = parser.parse_args()

    all_symbols = [p["symbol"] for p in POSITIONS] + WATCHLIST
    print(f"Fetching {len(all_symbols)} symbols from Yahoo Finance…", flush=True)

    prices = fetch_prices(all_symbols)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

    # ── Positions table ──────────────────────────────────────────────────────
    col = "{:<8} {:<6} {:>9} {:>9} {:>9}"
    divider = "─" * 52

    print(f"\n{divider}")
    print(f"  OPEN POSITIONS  ({timestamp})")
    print(divider)
    print(" ", col.format("SYMBOL", "DIR", "ENTRY", "CURRENT", "P/L %"))
    print(" ", col.format("─" * 8, "─" * 6, "─" * 9, "─" * 9, "─" * 9))

    for pos in POSITIONS:
        sym = pos["symbol"]
        current = prices.get(sym)
        if current is None:
            print(" ", col.format(sym, pos["cat"], f"{pos['entry']:.2f}", "N/A", "N/A"))
            continue
        pnl = pl_pct(pos["entry"], current, pos["cat"])
        print(" ", col.format(sym, pos["cat"], f"{pos['entry']:.2f}", f"{current:.2f}", fmt_pct(pnl)))

    # ── Watchlist ────────────────────────────────────────────────────────────
    print(f"\n{divider}")
    print("  WATCHLIST / ETFs")
    print(divider)
    for sym in WATCHLIST:
        current = prices.get(sym)
        val = f"${current:.2f}" if current is not None else "N/A"
        print(f"  {sym:<8} {val}")

    print(f"\n{divider}\n")

    # ── Optional JSON dump ───────────────────────────────────────────────────
    if args.json:
        print(json.dumps(prices, indent=2))


if __name__ == "__main__":
    main()
