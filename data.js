// ── Second table name (optional — leave empty for no label) ──────────────────
const TABLE2_NAME = 'Optional trades';

// ── Ticker alerts ────────────────────────────────────────────────────────────
const TICKER_DATA = [
  { tier: 'warning',        icon: '⚠', symbol: 'MU',   body: 'Short <strong>$498.36</strong> → current <strong>$494.32</strong> · still near entry <strong>+0.8%</strong>' },
  { tier: 'high-potential', icon: '↗', symbol: 'ARM',  body: 'Short · enter at <strong>$234.53</strong> · <strong>25.8%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'BE',   body: 'Short · enter at <strong>$232.50</strong> · <strong>20.4%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'STX',  body: 'Short · enter at <strong>$586.66</strong> · <strong>38.5%</strong> potential' },
  { tier: 'setup',          icon: '↗', symbol: 'AMD',  body: 'Short · enter at <strong>$348.84</strong> · setup intact' },
  { tier: 'setup',          icon: '↗', symbol: 'DELL', body: 'Short · enter at <strong>$216.15</strong> · setup intact' },
  { tier: 'setup',          icon: '↗', symbol: 'NVDA', body: 'Short · enter at <strong>$208.10</strong> · setup intact' },
];

// ── Open equity positions ────────────────────────────────────────────────────
// Fields: symbol, cat (Long|Short), entered, entry, stop (null=n/a), current,
//         target (null=n/a), plPct, plDol, toStop (null=n/a), toTarget (null=n/a),
//         progressW (bar width %), progressV (display value), tier (null|'warning'|'high-potential'|'setup')
const POSITIONS_DATA = [
  { symbol: 'Q',     cat: 'Long',  entered: "Apr 21 '26", entry: 136.76, stop: 132.00, current: 144.60, target: 165.00, plPct: '+5.7%',  plDol: '+$31',    toStop: '8.7%',  toTarget: '14.1%', progressW: 28, progressV: '+28%', tier: null },
  { symbol: 'MU',    cat: 'Short', entered: "Apr 24 '26", entry: 498.36, stop: null,   current: 494.32, target: null,   plPct: '+0.8%',  plDol: '+$53',    toStop: null,    toTarget: null,    progressW: 0,  progressV: 'n/a',  tier: 'warning' },
  { symbol: 'PANW',  cat: 'Long',  entered: "Apr 23 '26", entry: 170.28, stop: 159.00, current: 178.40, target: 210.00, plPct: '+4.8%',  plDol: '+$81',    toStop: '10.9%', toTarget: '17.7%', progressW: 20, progressV: '+20%', tier: null },
  { symbol: 'KMB',   cat: 'Long',  entered: "Apr 7 '26",  entry:  96.05, stop: null,   current:  98.15, target: 132.00, plPct: '+2.2%',  plDol: '+$118',   toStop: null,    toTarget: '34.5%', progressW:  6, progressV: '+6%',  tier: null },
  { symbol: 'FIGS',  cat: 'Long',  entered: "Apr 22 '26", entry:  15.78, stop:  14.50, current:  16.60, target:  20.00, plPct: '+5.2%',  plDol: '+$135',   toStop: '12.7%', toTarget: '20.5%', progressW: 19, progressV: '+19%', tier: null },
  { symbol: 'NBIS',  cat: 'Short', entered: "Apr 15 '26", entry: 163.76, stop: null,   current: 146.00, target: 128.39, plPct: '+10.8%', plDol: '+$373',   toStop: null,    toTarget: '12.1%', progressW: 50, progressV: '+50%', tier: null },
  { symbol: 'NXT',   cat: 'Long',  entered: "Apr 24 '26", entry: 124.70, stop: 113.50, current: 121.63, target: 160.00, plPct: '-2.5%',  plDol: '-$25',    toStop: '6.7%',  toTarget: '31.5%', progressW:  0, progressV: '-9%',  tier: null },
  { symbol: 'AVGO',  cat: 'Short', entered: "Apr 22 '26", entry: 415.98, stop: null,   current: 420.10, target: null,   plPct: '-1.0%',  plDol: '-$82',    toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'GOOGL', cat: 'Short', entered: "Apr 14 '26", entry: 334.85, stop: null,   current: 343.59, target: null,   plPct: '-2.6%',  plDol: '-$114',   toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'DELL',  cat: 'Short', entered: "Apr 22 '26", entry: 210.53, stop: null,   current: 216.15, target: null,   plPct: '-2.7%',  plDol: '-$135',   toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'setup' },
  { symbol: 'TXN',   cat: 'Short', entered: "Apr 23 '26", entry: 273.35, stop: null,   current: 277.20, target: 257.00, plPct: '-1.4%',  plDol: '-$135',   toStop: null,    toTarget: '7.3%',  progressW:  0, progressV: '-24%', tier: null },
  { symbol: 'STX',   cat: 'Short', entered: "Apr 16 '26", entry: 521.53, stop: null,   current: 586.66, target: 361.00, plPct: '-12.5%', plDol: '-$1,368', toStop: null,    toTarget: '38.5%', progressW:  0, progressV: '-41%', tier: 'high-potential' },
  { symbol: 'BE',    cat: 'Short', entered: "Apr 21 '26", entry: 223.58, stop: null,   current: 232.50, target: 185.00, plPct: '-4.0%',  plDol: '-$375',   toStop: null,    toTarget: '20.4%', progressW:  0, progressV: '-23%', tier: 'high-potential' },
  { symbol: 'NVDA',  cat: 'Short', entered: "Apr 17 '26", entry: 200.27, stop: null,   current: 208.10, target: null,   plPct: '-3.9%',  plDol: '-$368',   toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'setup' },
  { symbol: 'SOFI',  cat: 'Long',  entered: "Jan 30 '26", entry:  23.14, stop: null,   current:  18.49, target: null,   plPct: '-20.1%', plDol: '-$279',   toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'NET',   cat: 'Long',  entered: "Apr 27 '26", entry: 205.52, stop: 189.00, current: 205.46, target: 240.00, plPct: '-0.0%',  plDol: '-$0',     toStop: '8.0%',  toTarget: '16.8%', progressW:  0, progressV: '0%',   tier: null },
];

// ── Second positions table ────────────────────────────────────────────────────
const POSITIONS_DATA_2 = [
  { symbol: 'AMD',  cat: 'Short', entered: "Apr 23 '26", entry: 307.96, stop: null, current: 348.84, target: 285.00, plPct: '-13.3%', plDol: '-$1,186', toStop: null, toTarget: '18.3%', progressW: 0, progressV: '0%',   tier: 'high-potential' },
  { symbol: 'MRVL', cat: 'Short', entered: "Apr 25 '26", entry: 159.69, stop: null, current: 163.06, target: null,   plPct: '-2.1%',  plDol: '-$57',    toStop: null, toTarget: null,    progressW: 0, progressV: 'n/a',  tier: null },
  { symbol: 'ARM',  cat: 'Short', entered: "Apr 23 '26", entry: 206.11, stop: null, current: 234.53, target: 174.00, plPct: '-13.8%', plDol: '-$909',   toStop: null, toTarget: '25.8%', progressW: 0, progressV: '0%',   tier: 'high-potential' },
];

// ── Options positions ────────────────────────────────────────────────────────
const OPTIONS_DATA = [
  { symbol: 'GDX',  type: 'Long Put',  typeCls: 'long-put',  strike: '$89.00', expiry: "May 15 '26", contracts: 1, avgPrice: '$2.83', current: '$2.10', plPct: '-25.8%', plDol: '-$73'  },
  { symbol: 'SOXS', type: 'Long Call', typeCls: 'long-call', strike: '$16.50', expiry: "May 8 '26",  contracts: 1, avgPrice: '$1.82', current: '$0.62', plPct: '-65.9%', plDol: '-$120' },
  { symbol: 'SOXS', type: 'Long Call', typeCls: 'long-call', strike: '$21.00', expiry: "May 15 '26", contracts: 1, avgPrice: '$2.84', current: '$0.41', plPct: '-85.6%', plDol: '-$243' },
  { symbol: 'SPXU', type: 'Long Call', typeCls: 'long-call', strike: '$46.00', expiry: "May 1 '26",  contracts: 2, avgPrice: '$1.80', current: '$0.40', plPct: '-77.8%', plDol: '-$280' },
  { symbol: 'SPXU', type: 'Long Call', typeCls: 'long-call', strike: '$45.00', expiry: "May 15 '26", contracts: 2, avgPrice: '$2.80', current: '$1.30', plPct: '-53.6%', plDol: '-$300' },
];

// ── Closed trades ────────────────────────────────────────────────────────────
const CLOSED_TRADES_DATA = [
  { symbol: 'CRDO', closeDate: 'Apr 27', result: 'gain', returnPct: '+8.6%',  plDol: '+$33'    },
  { symbol: 'CIEN', closeDate: 'Apr 27', result: 'gain', returnPct: '+4.5%',  plDol: '+$232'   },
  { symbol: 'COHR', closeDate: 'Apr 27', result: 'gain', returnPct: '+9.6%',  plDol: '+$328'   },
  { symbol: 'POET', closeDate: 'Apr 27', result: 'gain', returnPct: '+35.4%', plDol: '+$1,012' },
];

// ── Trade alerts table ────────────────────────────────────────────────────────
const ALERTS_DATA = [
  { date: "Apr 27 '26", symbol: 'NET',  tier: 'warning', cat: 'Long', entry: '$209.00', stop: '$189.00', target: '$240.00', outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: 'sell on 5/7 close', notes: 'CS software play with strongest EPS growth among major players · buying consolidation pattern up against RTL with fresh MACD buy signal' },
  { date: "Apr 23 '26", symbol: 'EQT',  tier: 'setup',   cat: 'Long', entry: '$58.86',  stop: '$55.90',  target: '$67.00',  outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: null,                notes: 'HOLD' },
  { date: "Apr 17 '26", symbol: 'ONDS', tier: 'setup',   cat: 'Long', entry: '$10.40',  stop: '$9.80',   target: '$14.00',  outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: null,                notes: 'HOLD' },
  { date: "Mar 26 '26", symbol: 'BWA',  tier: 'warning', cat: 'Long', entry: '$55.50',  stop: '$53.70',  target: '$70.00',  outcomeCls: 'outcome-open', outcomeLabel: 'Raise Stop', outcomeDetail: null,            notes: 'Raise stop' },
];
