#!/usr/bin/env python3
"""
fetch_prices.py – pulls current prices for all tracked symbols from Yahoo Finance.

Usage:
    python3 fetch_prices.py
"""

import sys

try:
    import yfinance as yf
except ImportError:
    sys.exit("yfinance is required.  Run:  pip install yfinance")

SYMBOLS = [
    "MU", "KMB", "FIGS", "NBIS", "NXT",
    "AVGO", "GOOGL", "DELL", "TXN", "STX", "BE", "NVDA",
    "AMD", "MRVL", "ARM", "ROAD", "CAG", "ZS", "SIMO", "TSEM", "FSLY",
    "GDX", "SPXU",
]

for sym in SYMBOLS:
    try:
        price = yf.Ticker(sym).fast_info.last_price
        print(f"{sym:<8} ${price:.2f}" if price else f"{sym:<8} N/A")
    except Exception as e:
        print(f"{sym:<8} error ({e})")
