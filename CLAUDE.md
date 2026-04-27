# SwingTrader2026

## fetch_prices.py — Setup & Usage

Pulls live stock prices from Yahoo Finance for all open positions in `data.js`.

### First-time setup (Mac)

Requirements: Python 3.10+, installed via Homebrew (`brew install python`).

```bash
# From the repo root
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Run

```bash
source .venv/bin/activate   # skip if already active (prompt shows (.venv))
python3 fetch_prices.py
python3 fetch_prices.py --json   # also dump raw {symbol: price} JSON
```

### Each new terminal session

```bash
cd SwingTrader2026
source .venv/bin/activate
python3 fetch_prices.py
```

### Notes

- Fetches tickers one by one — normal, yfinance batch API is unreliable.
- Symbols and entry prices are hardcoded in `fetch_prices.py` — update them when adding new trades.
- P&L % is sign-flipped automatically for Short positions.
