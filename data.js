// ── Second table name (optional — leave empty for no label) ──────────────────
const TABLE2_NAME = 'Optional trades';

// ── Ticker alerts ────────────────────────────────────────────────────────────
const TICKER_DATA = [
  { tier: 'warning', icon: '⚠', symbol: 'TSEM', body: 'Long · enter at <strong>$200.75</strong> · stop <strong>$179.00</strong> · target <strong>$250.00</strong> · wide stop — go small!' },
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
  { symbol: 'NBIS', cat: 'Short', entered: "Apr 15 '26", entry: 163.76, stop: null, current: 137.60, target: 128.39, plPct: '+16.0%', plDol: '+$549',  shares: 21, toStop: null, toTarget: '6.7%',  progressW: 74, progressV: '+74%',  tier: null },
  { symbol: 'ROAD', cat: 'Long',  entered: "Apr 30 '26", entry: 116.35, stop: null, current: 122.85, target: null,   plPct: '+5.6%',  plDol: '+$33',   shares:  5, toStop: null, toTarget: null,    progressW: 0, progressV: 'n/a',   tier: null },
  { symbol: 'AMD',  cat: 'Short', entered: "Apr 23 '26", entry: 309.14, stop: null, current: 351.50, target: 285.00, plPct: '-13.7%', plDol: '-$1,313', shares: 31, toStop: null, toTarget: '18.9%', progressW: 0, progressV: '-176%', tier: 'high-potential' },
  { symbol: 'MRVL', cat: 'Short', entered: "Apr 25 '26", entry: 159.69, stop: null, current: 164.65, target: null,   plPct: '-3.1%',  plDol: '-$84',   shares: 17, toStop: null, toTarget: null,    progressW: 0, progressV: 'n/a',   tier: null },
  { symbol: 'ARM',  cat: 'Short', entered: "Apr 23 '26", entry: 206.11, stop: null, current: 214.60, target: 174.00, plPct: '-4.1%',  plDol: '-$272',  shares: 32, toStop: null, toTarget: '18.9%', progressW: 0, progressV: '-26%',  tier: 'high-potential' },
];

// ── Options positions ────────────────────────────────────────────────────────
const OPTIONS_DATA = [
  { symbol: 'GDX',  type: 'Long Put',  typeCls: 'long-put',  strike: '$89.00', expiry: "May 15 '26", contracts: 1, avgPrice: '$2.83', current: '$2.10', plPct: '-25.8%', plDol: '-$73'  },
  { symbol: 'SPXU', type: 'Long Call', typeCls: 'long-call', strike: '$46.00', expiry: "May 1 '26",  contracts: 2, avgPrice: '$1.80', current: '$0.40', plPct: '-77.8%', plDol: '-$280' },
  { symbol: 'SPXU', type: 'Long Call', typeCls: 'long-call', strike: '$45.00', expiry: "May 15 '26", contracts: 2, avgPrice: '$2.80', current: '$1.30', plPct: '-53.6%', plDol: '-$300' },
];

// ── Closed trades ────────────────────────────────────────────────────────────
const CLOSED_TRADES_DATA = [
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
  { date: "Apr 28 '26", symbol: 'FSLY', tier: 'warning', cat: 'Long', entry: '$26.00', stop: '$22.70', target: '$33.00', outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: 'sell on 5/6 close', notes: 'Only software play still in uptrend after AI fear · excellent growth metrics · false headwind from Anthropic launch should see bounce into earnings · stop wide at $22.70 — go small!' },
  { date: "Apr 23 '26", symbol: 'EQT',  tier: 'setup',   cat: 'Long', entry: '$58.86',  stop: '$55.90',  target: '$67.00',  outcomeCls: 'outcome-open', outcomeLabel: 'Open', outcomeDetail: null,                notes: 'HOLD' },
  { date: "Mar 26 '26", symbol: 'BWA',  tier: 'warning', cat: 'Long', entry: '$55.50',  stop: '$53.70',  target: '$70.00',  outcomeCls: 'outcome-open', outcomeLabel: 'Raise Stop', outcomeDetail: null,            notes: 'Raise stop' },
];
