// ── Second table name (optional — leave empty for no label) ──────────────────
const TABLE2_NAME = 'Optional trades';

// ── Ticker alerts ────────────────────────────────────────────────────────────
const TICKER_DATA = [
  { tier: 'warning',        icon: '⚠', symbol: 'FSLY', body: 'Long · enter at <strong>$26.00</strong> · stop <strong>$22.70</strong> · target <strong>$33.00</strong> · go small!' },
  { tier: 'warning',        icon: '⚠', symbol: 'MU',   body: 'Short <strong>$498.36</strong> → current <strong>$524.56</strong> · moved against entry <strong>-5.3%</strong>' },
  { tier: 'high-potential', icon: '↗', symbol: 'ARM',  body: 'Short · enter at <strong>$215.88</strong> · <strong>19.4%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'BE',   body: 'Short · enter at <strong>$234.68</strong> · <strong>21.2%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'STX',  body: 'Short · enter at <strong>$595.86</strong> · <strong>39.4%</strong> potential' },
  { tier: 'setup',          icon: '↗', symbol: 'AMD',  body: 'Short · enter at <strong>$334.63</strong> · setup intact' },
  { tier: 'setup',          icon: '↗', symbol: 'DELL', body: 'Short · enter at <strong>$215.97</strong> · setup intact' },
  { tier: 'setup',          icon: '↗', symbol: 'NVDA', body: 'Short · enter at <strong>$216.61</strong> · setup intact' },
];

// ── Open equity positions ────────────────────────────────────────────────────
// Fields: symbol, cat (Long|Short), entered, entry, stop (null=n/a), current,
//         target (null=n/a), plPct, plDol, shares, toStop (null=n/a), toTarget (null=n/a),
//         progressW (bar width %), progressV (display value), tier (null|'warning'|'high-potential'|'setup')
const POSITIONS_DATA = [
  { symbol: 'Q',     cat: 'Long',  entered: "Apr 21 '26", entry: 136.76, stop: 132.00, current: 143.85, target: 165.00, plPct: '+5.2%',  plDol: '+$28',    shares:   4, toStop: '8.2%',  toTarget: '14.7%', progressW: 25, progressV: '+25%', tier: null },
  { symbol: 'MU',    cat: 'Short', entered: "Apr 24 '26", entry: 498.36, stop: null,   current: 524.56, target: null,   plPct: '-5.3%',  plDol: '-$341',   shares:  13, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'warning' },
  { symbol: 'PANW',  cat: 'Long',  entered: "Apr 23 '26", entry: 170.28, stop: 159.00, current: 182.90, target: 210.00, plPct: '+7.4%',  plDol: '+$126',   shares:  10, toStop: '13.1%', toTarget: '14.8%', progressW: 32, progressV: '+32%', tier: null },
  { symbol: 'KMB',   cat: 'Long',  entered: "Apr 7 '26",  entry:  96.05, stop: null,   current:  98.25, target: 132.00, plPct: '+2.3%',  plDol: '+$123',   shares:  56, toStop: null,    toTarget: '34.4%', progressW:  6, progressV: '+6%',  tier: null },
  { symbol: 'FIGS',  cat: 'Long',  entered: "Apr 22 '26", entry:  15.78, stop:  14.50, current:  15.61, target:  20.00, plPct: '-1.1%',  plDol: '-$28',    shares: 166, toStop: '7.1%',  toTarget: '28.1%', progressW:  0, progressV: '-4%',  tier: null },
  { symbol: 'NBIS',  cat: 'Short', entered: "Apr 15 '26", entry: 163.76, stop: null,   current: 144.96, target: 128.39, plPct: '+11.5%', plDol: '+$395',   shares:  21, toStop: null,    toTarget: '11.4%', progressW: 53, progressV: '+53%', tier: null },
  { symbol: 'NXT',   cat: 'Long',  entered: "Apr 24 '26", entry: 124.70, stop: 113.50, current: 122.58, target: 160.00, plPct: '-1.7%',  plDol: '-$17',    shares:   8, toStop: '7.4%',  toTarget: '30.5%', progressW:  0, progressV: '-6%',  tier: null },
  { symbol: 'AVGO',  cat: 'Short', entered: "Apr 22 '26", entry: 415.98, stop: null,   current: 418.20, target: null,   plPct: '-0.5%',  plDol: '-$47',    shares:  21, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'GOOGL', cat: 'Short', entered: "Apr 14 '26", entry: 334.85, stop: null,   current: 350.34, target: null,   plPct: '-4.6%',  plDol: '-$201',   shares:  13, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: null },
  { symbol: 'DELL',  cat: 'Short', entered: "Apr 22 '26", entry: 210.53, stop: null,   current: 215.97, target: null,   plPct: '-2.6%',  plDol: '-$131',   shares:  24, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'setup' },
  { symbol: 'TXN',   cat: 'Short', entered: "Apr 23 '26", entry: 273.35, stop: null,   current: 269.50, target: 257.00, plPct: '+1.4%',  plDol: '+$135',   shares:  35, toStop: null,    toTarget: '4.6%',  progressW: 24, progressV: '+24%', tier: null },
  { symbol: 'STX',   cat: 'Short', entered: "Apr 16 '26", entry: 521.53, stop: null,   current: 595.86, target: 361.00, plPct: '-14.3%', plDol: '-$1,561', shares:  21, toStop: null,    toTarget: '39.4%', progressW:  0, progressV: '-46%', tier: 'high-potential' },
  { symbol: 'BE',    cat: 'Short', entered: "Apr 21 '26", entry: 223.58, stop: null,   current: 234.68, target: 185.00, plPct: '-5.0%',  plDol: '-$466',   shares:  42, toStop: null,    toTarget: '21.2%', progressW:  0, progressV: '-29%', tier: 'high-potential' },
  { symbol: 'NVDA',  cat: 'Short', entered: "Apr 17 '26", entry: 200.27, stop: null,   current: 216.61, target: null,   plPct: '-8.2%',  plDol: '-$768',   shares:  47, toStop: null,    toTarget: null,    progressW:  0, progressV: 'n/a',  tier: 'setup' },
  { symbol: 'NET',   cat: 'Long',  entered: "Apr 27 '26", entry: 205.52, stop: 189.00, current: 212.36, target: 240.00, plPct: '+3.3%',  plDol: '+$68',    shares:  10, toStop: '11.0%', toTarget: '13.0%', progressW: 20, progressV: '+20%', tier: null },
];

// ── Second positions table ────────────────────────────────────────────────────
const POSITIONS_DATA_2 = [
  { symbol: 'AMD',  cat: 'Short', entered: "Apr 23 '26", entry: 307.96, stop: null, current: 334.63, target: 285.00, plPct: '-8.7%',  plDol: '-$773',  shares: 29, toStop: null, toTarget: '14.8%', progressW: 0, progressV: '-116%', tier: 'high-potential' },
  { symbol: 'MRVL', cat: 'Short', entered: "Apr 25 '26", entry: 159.69, stop: null, current: 158.21, target: null,   plPct: '+0.9%',  plDol: '+$25',   shares: 17, toStop: null, toTarget: null,    progressW: 0, progressV: 'n/a',   tier: null },
  { symbol: 'ARM',  cat: 'Short', entered: "Apr 23 '26", entry: 206.11, stop: null, current: 215.88, target: 174.00, plPct: '-4.7%',  plDol: '-$313',  shares: 32, toStop: null, toTarget: '19.4%', progressW: 0, progressV: '-30%',  tier: 'high-potential' },
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
  { date: "Apr 28 '26", symbol: 'FSLY', tier: 'warning', cat: 'Long', entry: '$26.00', stop: '$22.70', target: '$33.00', outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: 'sell on 5/6 close', notes: 'Only software play still in uptrend after AI fear · excellent growth metrics · false headwind from Anthropic launch should see bounce into earnings · stop wide at $22.70 — go small!' },
  { date: "Apr 23 '26", symbol: 'EQT',  tier: 'setup',   cat: 'Long', entry: '$58.86',  stop: '$55.90',  target: '$67.00',  outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: null,                notes: 'HOLD' },
  { date: "Apr 17 '26", symbol: 'ONDS', tier: 'setup',   cat: 'Long', entry: '$10.40',  stop: '$9.80',   target: '$14.00',  outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: null,                notes: 'HOLD' },
  { date: "Mar 26 '26", symbol: 'BWA',  tier: 'warning', cat: 'Long', entry: '$55.50',  stop: '$53.70',  target: '$70.00',  outcomeCls: 'outcome-open', outcomeLabel: 'Raise Stop', outcomeDetail: null,            notes: 'Raise stop' },
];
