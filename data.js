// ── Second table name (optional — leave empty for no label) ──────────────────
const TABLE2_NAME = 'Optional trades';

// ── Ticker alerts ────────────────────────────────────────────────────────────
const TICKER_DATA = [
  { tier: 'warning',        icon: '⚠', symbol: 'TSEM',  body: 'Long · enter at <strong>$200.75</strong> · stop <strong>$179.00</strong> · target <strong>$250.00</strong> · wide stop — go small!' },
  { tier: 'high-potential', icon: '↗', symbol: 'STX',   body: 'Short · current <strong>$645.82</strong> · target <strong>$361.00</strong> · <strong>44.1%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'BE',    body: 'Short · current <strong>$279.48</strong> · target <strong>$185.00</strong> · <strong>33.8%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'AMD',   body: 'Short · current <strong>$351.50</strong> · target <strong>$285.00</strong> · <strong>18.9%</strong> potential' },
  { tier: 'setup',          icon: '↗', symbol: 'NBIS',  body: 'Earnings today · watch for push up to re-enter Short' },
  { tier: 'setup',          icon: '↗', symbol: 'GOOGL', body: 'Short · current <strong>$383.60</strong> · large position · <strong>-9.3%</strong> · watching' },
];

// ── Open equity positions ────────────────────────────────────────────────────
// Fields: symbol, cat (Long|Short), entered, entry, stop (null=n/a), current,
//         target (null=n/a), plPct, plDol, shares, toStop (null=n/a), toTarget (null=n/a),
//         progressW (bar width %), progressV (display value), tier (null|'warning'|'high-potential'|'setup')
const POSITIONS_DATA = [
  { symbol: 'MU',    cat: 'Short', entered: "Apr 24 '26", entry: 518.25, stop: null,   current: 509.00, target: null,   plPct: '+1.8%',  plDol: '+$111',   shares:  12, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'FIGS',  cat: 'Long',  entered: "Apr 22 '26", entry:  15.71, stop:  14.50, current:  14.84, target:  20.00, plPct: '-5.5%',  plDol: '-$174',   shares: 200, toStop: '2.3%',  toTarget: '34.8%', progressW:  0, progressV: '-72%', tier: null },
  { symbol: 'NXT',   cat: 'Long',  entered: "Apr 24 '26", entry: 124.70, stop: 113.50, current: 122.58, target: 160.00, plPct: '-1.7%',  plDol: '-$17',    shares:   8, toStop: '7.4%',  toTarget: '30.5%', progressW:  0, progressV: '-6%',  tier: null },
  { symbol: 'AVGO',  cat: 'Short', entered: "Apr 22 '26", entry: 419.45, stop: null,   current: 412.48, target: null,   plPct: '+1.62%', plDol: '+$105',   shares:  15, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'INTC',  cat: 'Short', entered: "Apr 30 '26", entry:  91.96, stop: null,   current:  94.10, target: null,   plPct: '-2.3%',  plDol: '-$428',   shares: 200, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'GOOGL', cat: 'Short', entered: "Apr 14 '26", entry: 351.00, stop: null,   current: 383.60, target: null,   plPct: '-9.3%',  plDol: '-$1,043', shares:  32, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'DELL',  cat: 'Short', entered: "Apr 22 '26", entry: 210.53, stop: null,   current: 205.64, target: null,   plPct: '+2.3%',  plDol: '+$117',   shares:  24, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'setup' },
  { symbol: 'STX',   cat: 'Short', entered: "Apr 16 '26", entry: 553.79, stop: null,   current: 645.82, target: 361.00, plPct: '-16.6%', plDol: '-$2,577', shares:  28, toStop: null,    toTarget: '44.1%', progressW:  0, progressV: '-48%', tier: 'high-potential' },
  { symbol: 'BE',    cat: 'Short', entered: "Apr 21 '26", entry: 253.03, stop: null,   current: 279.48, target: 185.00, plPct: '-10.5%', plDol: '-$1,587', shares:  60, toStop: null,    toTarget: '33.8%', progressW:  0, progressV: '-39%', tier: 'high-potential' },
  { symbol: 'NVDA',  cat: 'Short', entered: "Apr 17 '26", entry: 201.31, stop: null,   current: 199.63, target: null,   plPct: '+0.8%',  plDol: '+$20',    shares:  12, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'setup' },
];

// ── Second positions table ────────────────────────────────────────────────────
const POSITIONS_DATA_2 = [
  { symbol: 'SIMO', cat: 'Short', entered: "Apr 30 '26", entry: 201.99, stop: null, current: 212.49, target: null,   plPct: '-5.2%',  plDol: '-$179',  shares:  17, toStop: null, toTarget: null,    progressW:  0, progressV: 'n/a',   tier: null },
  { symbol: 'ZS',   cat: 'Long',  entered: "Apr 30 '26", entry: 135.82, stop: null, current: 129.60, target: null,   plPct: '-4.6%',  plDol: '-$124',  shares:  20, toStop: null, toTarget: null,    progressW:  0, progressV: 'n/a',   tier: null },
  { symbol: 'TXN',  cat: 'Short', entered: "Apr 23 '26", entry: 276.10, stop: null, current: 279.20, target: 257.00, plPct: '-1.1%',  plDol: '-$31',   shares:  10, toStop: null, toTarget: '7.9%',  progressW:  0, progressV: '-16%',  tier: null },
  { symbol: 'CAG',  cat: 'Long',  entered: "Apr 30 '26", entry:  14.13, stop: null, current:  14.23, target: null,   plPct: '+0.7%',  plDol: '+$20',   shares: 200, toStop: null, toTarget: null,    progressW:  0, progressV: 'n/a',   tier: null },
  { symbol: 'KMB',  cat: 'Long',  entered: "Apr 7 '26",  entry:  96.05, stop: null, current:  97.42, target: 132.00, plPct: '+1.4%',  plDol: '+$77',   shares: 56, toStop: null, toTarget: '35.5%', progressW:  4, progressV: '+4%',   tier: null },
  { symbol: 'ROAD', cat: 'Long',  entered: "Apr 30 '26", entry: 116.35, stop: null, current: 122.85, target: null,   plPct: '+5.6%',  plDol: '+$33',   shares:  5, toStop: null, toTarget: null,    progressW: 0, progressV: 'n/a',   tier: null },
  { symbol: 'AMD',  cat: 'Short', entered: "Apr 23 '26", entry: 309.14, stop: null, current: 351.50, target: 285.00, plPct: '-13.7%', plDol: '-$1,313', shares: 31, toStop: null, toTarget: '18.9%', progressW: 0, progressV: '-176%', tier: 'high-potential' },
  { symbol: 'MRVL', cat: 'Short', entered: "Apr 25 '26", entry: 159.69, stop: null, current: 164.65, target: null,   plPct: '-3.1%',  plDol: '-$84',   shares: 17, toStop: null, toTarget: null,    progressW: 0, progressV: 'n/a',   tier: null },
  { symbol: 'ARM',  cat: 'Short', entered: "Apr 23 '26", entry: 206.11, stop: null, current: 214.60, target: 174.00, plPct: '-4.1%',  plDol: '-$272',  shares: 32, toStop: null, toTarget: '18.9%', progressW: 0, progressV: '-26%',  tier: 'high-potential' },
];

// ── Options positions ────────────────────────────────────────────────────────
const OPTIONS_DATA = [
  { symbol: 'SPXU', type: 'Long Call', typeCls: 'long-call', strike: '$46.00', expiry: "May 1 '26",  contracts: 2, avgPrice: '$1.80', current: '$0.40', plPct: '-77.8%', plDol: '-$280' },
  { symbol: 'SPXU', type: 'Long Call', typeCls: 'long-call', strike: '$45.00', expiry: "May 15 '26", contracts: 2, avgPrice: '$2.80', current: '$1.30', plPct: '-53.6%', plDol: '-$300' },
];

// ── Closed trades ────────────────────────────────────────────────────────────
const CLOSED_TRADES_DATA = [
  { symbol: 'NBIS', closeDate: 'Apr 30', result: 'gain', returnPct: '+15.7%', plDol: '+$436'   },
  { symbol: 'GDX',  closeDate: 'Apr 28', result: 'gain', returnPct: '+36.7%', plDol: '+$104'   },
  { symbol: 'Q',    closeDate: 'Apr 30', result: 'gain', returnPct: '+3.0%',  plDol: '+$23'    },
  { symbol: 'NVDA', closeDate: 'Apr 30', result: 'gain', returnPct: '+1.0%',  plDol: '+$52'    },
  { symbol: 'NVDA', closeDate: 'Apr 30', result: 'gain', returnPct: '+0.4%',  plDol: '+$10'    },
  { symbol: 'AVGO', closeDate: 'Apr 28', result: 'gain', returnPct: '+2.3%',  plDol: '+$48'    },
  { symbol: 'SOXS', closeDate: 'Apr 30', result: 'loss', returnPct: '-83.5%', plDol: '-$152'   },
  { symbol: 'SOXS', closeDate: 'Apr 29', result: 'loss', returnPct: '-85.6%', plDol: '-$243'   },
  { symbol: 'NET',  closeDate: 'Apr 30', result: 'even', returnPct: '0.0%',   plDol: '$0'      },
  { symbol: 'PANW', closeDate: 'Apr 30', result: 'even', returnPct: '0.0%',   plDol: '$0'      },
  { symbol: 'CRDO', closeDate: 'Apr 27', result: 'gain', returnPct: '+8.6%',  plDol: '+$33'    },
  { symbol: 'CIEN', closeDate: 'Apr 27', result: 'gain', returnPct: '+4.5%',  plDol: '+$232'   },
  { symbol: 'COHR', closeDate: 'Apr 27', result: 'gain', returnPct: '+9.6%',  plDol: '+$328'   },
  { symbol: 'POET', closeDate: 'Apr 27', result: 'gain', returnPct: '+35.4%', plDol: '+$1,012' },
];

// ── Trade alerts table ────────────────────────────────────────────────────────
const ALERTS_DATA = [
  { date: "Apr 30 '26", symbol: 'TSEM', tier: 'warning', cat: 'Long', entry: '$200.75', stop: '$179.00', target: '$250.00', outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: null, notes: 'Top-rated semicon play out of Israel · should get a nice boost from QCOM earnings and is set to break the recent pullback · wide stop at $179 — go small!' },
];
