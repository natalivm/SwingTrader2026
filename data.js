// ── Second table name (optional — leave empty for no label) ──────────────────
const TABLE2_NAME = 'Optional trades';

// ── Ticker alerts ────────────────────────────────────────────────────────────
const TICKER_DATA = [
  { tier: 'warning',        icon: '⚠', symbol: 'MU',   body: 'Short <strong>$498.36</strong> → current <strong>$521.26</strong> · moved against entry <strong>-4.6%</strong>' },
  { tier: 'high-potential', icon: '↗', symbol: 'ARM',  body: 'Short · enter at <strong>$215.17</strong> · <strong>19.1%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'BE',   body: 'Short · enter at <strong>$234.53</strong> · <strong>21.1%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'STX',  body: 'Short · enter at <strong>$591.65</strong> · <strong>39.0%</strong> potential' },
  { tier: 'setup',          icon: '↗', symbol: 'AMD',  body: 'Short · enter at <strong>$334.80</strong> · setup intact' },
  { tier: 'setup',          icon: '↗', symbol: 'DELL', body: 'Short · enter at <strong>$214.59</strong> · setup intact' },
  { tier: 'setup',          icon: '↗', symbol: 'NVDA', body: 'Short · enter at <strong>$209.40</strong> · setup intact' },
];

// ── Open equity positions ────────────────────────────────────────────────────
// Fields: symbol, cat (Long|Short), entered, entry, stop (null=n/a), current,
//         target (null=n/a), plPct, plDol, shares, toStop (null=n/a), toTarget (null=n/a),
//         progressW (bar width %), progressV (display value), tier (null|'warning'|'high-potential'|'setup')
const POSITIONS_DATA = [
  { symbol: 'Q',     cat: 'Long',  entered: "Apr 21 '26", entry: 136.76, stop: 132.00, current: 141.09, target: 165.00, plPct: '+3.2%',  plDol: '+$17',    shares:   4, toStop: '6.4%',  toTarget: '17.0%', progressW: 15, progressV: '+15%', tier: null },
  { symbol: 'MU',    cat: 'Short', entered: "Apr 24 '26", entry: 498.36, stop: null,   current: 521.26, target: null,   plPct: '-4.6%',  plDol: '-$298',   shares:  13, toStop: null,    toTarget: null,    progressW: 0,  progressV: 'n/a',  tier: 'warning' },
  { symbol: 'PANW',  cat: 'Long',  entered: "Apr 23 '26", entry: 170.28, stop: 159.00, current: 183.51, target: 210.00, plPct: '+7.8%',  plDol: '+$132',   shares:  10, toStop: '13.4%', toTarget: '14.4%', progressW: 33, progressV: '+33%', tier: null },
  { symbol: 'KMB',   cat: 'Long',  entered: "Apr 7 '26",  entry:  96.05, stop: null,   current:  97.89, target: 132.00, plPct: '+1.9%',  plDol: '+$103',   shares:  56, toStop: null,    toTarget: '34.8%', progressW:  5, progressV: '+5%',  tier: null },
  { symbol: 'FIGS',  cat: 'Long',  entered: "Apr 22 '26", entry:  15.78, stop:  14.50, current:  15.40, target:  20.00, plPct: '-2.4%',  plDol: '-$63',    shares: 166, toStop: '5.8%',  toTarget: '29.9%', progressW:  0, progressV: '-9%',  tier: null },
  { symbol: 'NBIS',  cat: 'Short', entered: "Apr 15 '26", entry: 163.76, stop: null,   current: 140.25, target: 128.39, plPct: '+14.4%', plDol: '+$494',   shares:  21, toStop: null,    toTarget: '8.5%',  progressW: 66, progressV: '+66%', tier: null },
  { symbol: 'NXT',   cat: 'Long',  entered: "Apr 24 '26", entry: 124.70, stop: 113.50, current: 118.28, target: 160.00, plPct: '-5.1%',  plDol: '-$51',    shares:   8, toStop: '4.0%',  toTarget: '35.3%', progressW:  0, progressV: '-18%', tier: null },
  { symbol: 'AVGO',  cat: 'Short', entered: "Apr 22 '26", entry: 415.98, stop: null,   current: 415.45, target: null,   plPct: '+0.1%',  plDol: '+$11',    shares:  21, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'GOOGL', cat: 'Short', entered: "Apr 14 '26", entry: 334.85, stop: null,   current: 351.08, target: null,   plPct: '-4.8%',  plDol: '-$211',   shares:  13, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'DELL',  cat: 'Short', entered: "Apr 22 '26", entry: 210.53, stop: null,   current: 214.59, target: null,   plPct: '-1.9%',  plDol: '-$97',    shares:  24, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'setup' },
  { symbol: 'TXN',   cat: 'Short', entered: "Apr 23 '26", entry: 273.35, stop: null,   current: 271.56, target: 257.00, plPct: '+0.7%',  plDol: '+$63',    shares:  35, toStop: null,    toTarget: '5.4%',  progressW: 11, progressV: '+11%', tier: null },
  { symbol: 'STX',   cat: 'Short', entered: "Apr 16 '26", entry: 521.53, stop: null,   current: 591.65, target: 361.00, plPct: '-13.4%', plDol: '-$1,473', shares:  21, toStop: null,    toTarget: '39.0%', progressW:  0, progressV: '-44%', tier: 'high-potential' },
  { symbol: 'BE',    cat: 'Short', entered: "Apr 21 '26", entry: 223.58, stop: null,   current: 234.53, target: 185.00, plPct: '-4.9%',  plDol: '-$460',   shares:  42, toStop: null,    toTarget: '21.1%', progressW:  0, progressV: '-28%', tier: 'high-potential' },
  { symbol: 'NVDA',  cat: 'Short', entered: "Apr 17 '26", entry: 200.27, stop: null,   current: 209.40, target: null,   plPct: '-4.6%',  plDol: '-$429',   shares:  47, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'setup' },
  { symbol: 'SOFI',  cat: 'Long',  entered: "Jan 30 '26", entry:  23.14, stop: null,   current:  18.80, target: null,   plPct: '-18.8%', plDol: '-$260',   shares:  60, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'NET',   cat: 'Long',  entered: "Apr 27 '26", entry: 205.52, stop: 189.00, current: 207.62, target: 240.00, plPct: '+1.0%',  plDol: '+$21',    shares:  10, toStop: '9.0%',  toTarget: '15.6%', progressW:  6, progressV: '+6%',  tier: null },
];

// ── Second positions table ────────────────────────────────────────────────────
const POSITIONS_DATA_2 = [
  { symbol: 'AMD',  cat: 'Short', entered: "Apr 23 '26", entry: 307.96, stop: null, current: 334.80, target: 285.00, plPct: '-8.7%',  plDol: '-$778',  shares: 29, toStop: null, toTarget: '14.9%', progressW: 0, progressV: '0%',   tier: 'high-potential' },
  { symbol: 'MRVL', cat: 'Short', entered: "Apr 25 '26", entry: 159.69, stop: null, current: 154.81, target: null,   plPct: '+3.1%',  plDol: '+$83',   shares: 17, toStop: null, toTarget: null,    progressW: 0, progressV: 'n/a',  tier: null },
  { symbol: 'ARM',  cat: 'Short', entered: "Apr 23 '26", entry: 206.11, stop: null, current: 215.17, target: 174.00, plPct: '-4.4%',  plDol: '-$290',  shares: 32, toStop: null, toTarget: '19.1%', progressW: 0, progressV: '-28%', tier: 'high-potential' },
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
