(function () {
    'use strict';

    const hamburger   = document.getElementById('hamburger');
    const navMenu     = document.getElementById('navMenu');
    const navLinks    = document.querySelectorAll('.nav-link');
    const pages       = document.querySelectorAll('.page');
    const tbody       = document.querySelector('.positions-table tbody');
    const table       = document.querySelector('.positions-table');
    const tbody2      = document.querySelector('.positions-table-2 tbody');
    const table2      = document.querySelector('.positions-table-2');
    const tradesBody  = document.querySelector('.trades-table tbody');
    const tradesTable = document.querySelector('.trades-table');
    const alertsBody  = document.querySelector('.alerts-table tbody');

    // ── Data rendering ──────────────────────────────────────────────────────
    function renderPositionsInto(data, tbodyEl) {
        if (!tbodyEl || typeof data === 'undefined') return;
        const fmtP   = n => '$' + n.toFixed(2);
        const fmtCur = n => n.toFixed(2).replace('.', ',');
        const naCell  = v => v  != null ? `<td>${v}</td>`       : `<td class="neutral">n/a</td>`;
        const naPCell = n => n  != null ? `<td>${fmtP(n)}</td>` : `<td class="neutral">n/a</td>`;
        tbodyEl.innerHTML = data.map(p => {
            const isShort  = p.cat === 'Short';
            const tierAttr = p.tier ? ` data-tier="${p.tier}"` : '';
            const tierDot  = p.tier ? `<span class="tier-dot ${p.tier}"></span>` : '';
            const plCls    = p.plPct.startsWith('+') ? 'profit' : p.plPct.startsWith('-') ? 'loss' : 'neutral';
            const progCls  = p.progressV === 'n/a'        ? 'neutral'
                           : p.progressV.startsWith('+')  ? 'profit'
                           : p.progressV.startsWith('-')  ? 'loss' : 'neutral';
            const progColor = progCls === 'profit' ? 'rgba(16,185,129,0.09)' : progCls === 'loss' ? 'rgba(239,68,68,0.09)' : 'rgba(100,116,139,0.06)';
            return `<tr${tierAttr} style="background-image:linear-gradient(to right,${progColor} ${p.progressW}%,transparent ${p.progressW}%)">
                <td class="symbol">${tierDot}${p.symbol}</td>
                <td><span class="badge ${isShort ? 'short-trade' : 'swing-trade'}">${p.cat}</span></td>
                <td class="${plCls}">${p.plPct}</td>
                <td class="${plCls}">${p.plDol}</td>
                <td><span class="current-price">${fmtCur(p.current)}</span></td>
                ${naPCell(p.target)}
                <td>${fmtP(p.entry)}</td>
                ${naPCell(p.stop)}
                <td class="alloc-pct">—</td>
                <td>${p.entered}</td>
                ${naCell(p.toStop)}
                ${naCell(p.toTarget)}
                <td class="${progCls}">${p.progressV}</td>
            </tr>`;
        }).join('');
    }

    function renderPositions()  { renderPositionsInto(POSITIONS_DATA,   tbody);  }
    function renderPositions2() { renderPositionsInto(POSITIONS_DATA_2, tbody2); }

    function renderOptions() {
        const optBody = document.querySelector('.options-table tbody');
        if (!optBody || typeof OPTIONS_DATA === 'undefined') return;
        optBody.innerHTML = OPTIONS_DATA.map(o => {
            const plCls = o.plPct.startsWith('+') ? 'profit' : o.plPct.startsWith('-') ? 'loss' : 'neutral';
            return `<tr>
                <td class="symbol">${o.symbol}</td>
                <td><span class="badge ${o.typeCls}">${o.type}</span></td>
                <td>${o.strike}</td>
                <td>${o.expiry}</td>
                <td>${o.contracts}</td>
                <td>${o.avgPrice}</td>
                <td>${o.current}</td>
                <td class="${plCls}">${o.plPct}</td>
                <td class="${plCls}">${o.plDol}</td>
            </tr>`;
        }).join('');
        const countEl = document.querySelector('.options-title .position-count');
        if (countEl) countEl.textContent = `(${OPTIONS_DATA.length})`;
    }

    function renderTrades() {
        if (!tradesBody || typeof CLOSED_TRADES_DATA === 'undefined') return;
        tradesBody.innerHTML = CLOSED_TRADES_DATA.map(t => {
            const isGain   = t.result === 'gain';
            const badgeCls = isGain ? 'gain-badge' : 'loss-badge';
            const pctCls   = isGain ? 'profit' : 'loss';
            return `<tr data-result="${t.result}">
                <td class="symbol">${t.symbol}</td>
                <td>${t.closeDate}</td>
                <td><span class="badge ${badgeCls}">${t.result.toUpperCase()}</span></td>
                <td class="text-right ${pctCls}">${t.returnPct}</td>
                <td class="text-right ${pctCls}">${t.plDol ?? '—'}</td>
            </tr>`;
        }).join('');
    }

    function renderMetrics() {
        if (typeof CLOSED_TRADES_DATA === 'undefined' || CLOSED_TRADES_DATA.length === 0) return;
        const pct    = s => parseFloat(s.replace(/[+%]/g, ''));
        const gains  = CLOSED_TRADES_DATA.filter(t => t.result === 'gain');
        const losses = CLOSED_TRADES_DATA.filter(t => t.result === 'loss');
        const total  = CLOSED_TRADES_DATA.length;
        const wr     = gains.length / total;

        const avgGain = gains.length
            ? gains.reduce((s, t) => s + pct(t.returnPct), 0) / gains.length : null;
        const avgLoss = losses.length
            ? losses.reduce((s, t) => s + pct(t.returnPct), 0) / losses.length : null;
        const expectancy = wr * (avgGain ?? 0) + (1 - wr) * (avgLoss ?? 0);

        const sorted = [...CLOSED_TRADES_DATA].sort((a, b) => pct(b.returnPct) - pct(a.returnPct));
        const best   = sorted[0];
        const worst  = sorted[sorted.length - 1];

        const findMetric = label => {
            const card = Array.from(document.querySelectorAll('.metric-card'))
                .find(c => c.querySelector('.metric-label')?.textContent.trim() === label);
            return { val: card?.querySelector('.metric-value') ?? null,
                     sub: card?.querySelector('.metric-sub')   ?? null };
        };
        const set = (label, text, sub, cls) => {
            const { val, sub: subEl } = findMetric(label);
            if (val) { val.textContent = text; if (cls !== undefined) val.className = 'metric-value' + (cls ? ' ' + cls : ''); }
            if (subEl && sub !== undefined) subEl.textContent = sub;
        };

        const fmt = v => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
        set('Total Trades', total, `${gains.length} wins · ${losses.length} losses`);
        set('Win Rate',    (wr * 100).toFixed(1) + '%');
        set('Avg Gain',    avgGain !== null ? fmt(avgGain) : 'n/a', undefined, avgGain !== null ? 'profit' : '');
        set('Avg Loss',    avgLoss !== null ? fmt(avgLoss) : 'n/a', undefined, avgLoss !== null ? 'loss'   : '');
        set('Expectancy',  fmt(expectancy), undefined, expectancy >= 0 ? 'profit' : 'loss');
        set('Best Trade',  best  ? `${best.symbol} ${best.returnPct}`   : 'n/a', undefined, best  && pct(best.returnPct)  >= 0 ? 'profit' : 'loss');
        set('Worst Trade', worst ? `${worst.symbol} ${worst.returnPct}` : 'n/a', undefined, worst && pct(worst.returnPct) >= 0 ? 'profit' : 'loss');
    }

    function renderMonthly() {
        const monthlyBody = document.querySelector('.monthly-table tbody');
        const monthlyFoot = document.querySelector('.monthly-table tfoot');
        const chartBars   = document.querySelector('.chart-bars');
        const chartMonths = document.querySelector('.chart-month-row');
        if (!monthlyBody || typeof CLOSED_TRADES_DATA === 'undefined' || CLOSED_TRADES_DATA.length === 0) return;

        const pct         = s => parseFloat(s.replace(/[+%]/g, ''));
        const MONTH_ORDER = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };

        const groups = {};
        CLOSED_TRADES_DATA.forEach(t => {
            const m = t.closeDate.split(' ')[0];
            (groups[m] = groups[m] || []).push(t);
        });
        const months = Object.keys(groups).sort((a, b) => (MONTH_ORDER[a] || 0) - (MONTH_ORDER[b] || 0));

        const stats = months.map(m => {
            const ts     = groups[m];
            const gains  = ts.filter(t => t.result === 'gain').length;
            const losses = ts.filter(t => t.result === 'loss').length;
            const pcts   = ts.map(t => pct(t.returnPct));
            const sum    = pcts.reduce((s, v) => s + v, 0);
            return { m, trades: ts.length, gains, losses, winRate: (gains / ts.length * 100).toFixed(0), avg: sum / ts.length, sum };
        });

        const fmtPct = v => (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
        monthlyBody.innerHTML = stats.map(s => {
            const sc = s.sum >= 0 ? 'profit' : 'loss';
            return `<tr>
                <td class="monthly-name">${s.m} 2026</td>
                <td class="text-right">${s.trades}</td>
                <td class="text-right profit">${s.gains}</td>
                <td class="text-right ${s.losses ? 'loss' : ''}">${s.losses}</td>
                <td class="text-right">${s.winRate}%</td>
                <td class="text-right ${sc}">${fmtPct(s.avg)}</td>
                <td class="text-right monthly-sum ${sc}">${fmtPct(s.sum)}</td>
            </tr>`;
        }).join('');

        if (monthlyFoot) {
            const all    = CLOSED_TRADES_DATA;
            const ag     = all.filter(t => t.result === 'gain').length;
            const al     = all.filter(t => t.result === 'loss').length;
            const ytdSum = all.reduce((s, t) => s + pct(t.returnPct), 0);
            const ytdAvg = ytdSum / all.length;
            const ytdWR  = (ag / all.length * 100).toFixed(0);
            const sc     = ytdSum >= 0 ? 'profit' : 'loss';
            monthlyFoot.innerHTML = `<tr class="ytd-row">
                <td class="ytd-label">YTD 2026</td>
                <td class="text-right">${all.length}</td>
                <td class="text-right profit">${ag}</td>
                <td class="text-right ${al ? 'loss' : ''}">${al}</td>
                <td class="text-right">${ytdWR}%</td>
                <td class="text-right ${sc}">${fmtPct(ytdAvg)}</td>
                <td class="text-right monthly-sum ${sc}">${fmtPct(ytdSum)}</td>
            </tr>`;
        }

        if (chartBars && chartMonths) {
            const maxAbs = Math.max(...stats.map(s => Math.abs(s.sum)), 1);
            chartBars.innerHTML = stats.map(s => {
                const h   = Math.max(Math.abs(s.sum) / maxAbs * 100, 4);
                const cls = s.sum >= 0 ? 'bar-positive' : 'bar-negative';
                const lCls = s.sum >= 0 ? 'profit' : 'loss';
                return `<div class="chart-col">
                    <div class="chart-bar-label ${lCls}">${fmtPct(s.sum)}</div>
                    <div class="chart-bar ${cls}" style="height:${h}%"></div>
                </div>`;
            }).join('');
            chartMonths.innerHTML = stats.map(s => `<span>${s.m}</span>`).join('');
        }
    }

    function renderAlerts() {
        if (!alertsBody || typeof ALERTS_DATA === 'undefined') return;
        alertsBody.innerHTML = ALERTS_DATA.map(a => {
            const tierAttr = a.tier ? ` data-tier="${a.tier}"` : '';
            const tierDot  = a.tier ? `<span class="tier-dot ${a.tier}"></span>` : '';
            const catCls   = a.cat === 'Long' ? 'swing-trade' : 'short-trade';
            const stopTd   = a.stop   ? `<td class="text-right">${a.stop}</td>`   : `<td class="text-right neutral">n/a</td>`;
            const targetTd = a.target ? `<td class="text-right">${a.target}</td>` : `<td class="text-right neutral">n/a</td>`;
            const detail   = a.outcomeDetail ? `<span class="outcome-text">${a.outcomeDetail}</span>` : '';
            return `<tr${tierAttr}>
                <td class="alert-date">${a.date}</td>
                <td class="symbol">${tierDot}${a.symbol}</td>
                <td><span class="badge ${catCls}">${a.cat}</span></td>
                <td class="alert-entry text-right">${a.entry}</td>
                ${stopTd}
                ${targetTd}
                <td><div class="alert-outcome-cell"><span class="badge ${a.outcomeCls}">${a.outcomeLabel}</span>${detail}</div></td>
                <td class="alert-notes">${a.notes}</td>
            </tr>`;
        }).join('');
    }

    renderPositions();
    renderPositions2();
    renderOptions();
    renderTrades();
    renderMetrics();
    renderMonthly();
    renderAlerts();

    // ── Tab activation ──────────────────────────────────────────────────────
    function activateTab(tabName) {
        const link = document.querySelector(`.nav-link[data-tab="${tabName}"]`);
        const page = document.querySelector(`.page[data-page="${tabName}"]`);
        if (!link || !page) return false;
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        link.classList.add('active');
        page.classList.add('active');
        closeMenu();
        return true;
    }

    function closeMenu() {
        if (!hamburger || !navMenu) return;
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // ── Mobile menu ─────────────────────────────────────────────────────────
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const tabName = link.getAttribute('data-tab');
            if (tabName && activateTab(tabName)) {
                history.pushState({ tab: tabName }, '', `#${tabName}`);
            }
        });
    });

    window.addEventListener('popstate', e => {
        activateTab((e.state && e.state.tab) || location.hash.slice(1) || 'portfolio');
    });

    const initialTab = location.hash.slice(1);
    if (initialTab) activateTab(initialTab);

    // ── PWA install prompt ──────────────────────────────────────────────────
    let deferredInstallPrompt = null;
    const installBtn = document.getElementById('installBtn');
    const isInstalled = () =>
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredInstallPrompt = e;
        if (installBtn && !isInstalled()) installBtn.hidden = false;
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredInstallPrompt) return;
            deferredInstallPrompt.prompt();
            await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;
            installBtn.hidden = true;
        });
    }

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        if (installBtn) installBtn.hidden = true;
    });

    // ── Position count ──────────────────────────────────────────────────────
    const countEl = document.querySelector('.positions-section:not(.positions-section-2) .position-count');
    if (tbody && countEl) countEl.textContent = `(${tbody.rows.length})`;

    // ── Second table title ──────────────────────────────────────────────────
    const title2El = document.getElementById('table2Title');
    if (title2El && tbody2) {
        const name = (typeof TABLE2_NAME !== 'undefined' && TABLE2_NAME) ? TABLE2_NAME : 'Positions';
        title2El.innerHTML = `${name} <span class="position-count">(${tbody2.rows.length})</span>`;
    }

    // ── Totals + allocation — single pass over all rows ────────────────────
    const allTbodies = [tbody, tbody2].filter(Boolean);
    if (allTbodies.length > 0) {
        const naVal = s => !s || s === 'n/a' || s === '—';
        const findStat = label => {
            const el = Array.from(document.querySelectorAll('.stat-label'))
                .find(e => e.textContent.trim() === label);
            return el?.nextElementSibling ?? null;
        };

        let totalPL = 0, totalPortfolio = 0, hasData = false;
        const allRows = allTbodies.flatMap(tb => Array.from(tb.rows));
        const posData = allRows.map(row => {
            const plPctText = row.cells[2]?.textContent.trim();
            const plDolText = row.cells[3]?.textContent.trim();
            if (naVal(plPctText) || naVal(plDolText)) return null;
            const plPct = parseFloat(plPctText.replace(/[+%\s]/g, '')) / 100;
            const plDol = parseFloat(plDolText.replace(/[+$,\s]/g, ''));
            if (isNaN(plPct) || isNaN(plDol)) return null;
            if (Math.abs(plPct) < 0.0001) return null;
            const mktVal = Math.abs(plDol) / Math.abs(plPct) + plDol;
            totalPL += plDol;
            totalPortfolio += mktVal;
            hasData = true;
            return { mktVal };
        });

        if (hasData) {
            const portEl = findStat('Portfolio Value');
            if (portEl) {
                portEl.textContent = '$' + Math.round(totalPortfolio).toLocaleString('en-US');
                portEl.className = 'stat-value';
            }

            const plDolEl = findStat('Total P&L $');
            if (plDolEl) {
                const abs = Math.abs(Math.round(totalPL));
                plDolEl.textContent = (totalPL < 0 ? '-$' : '+$') + abs.toLocaleString('en-US');
                plDolEl.className = 'stat-value ' + (totalPL < 0 ? 'loss' : 'profit');
            }

            const plPctEl = findStat('Total P&L %');
            if (plPctEl) {
                const pct = (totalPL / totalPortfolio * 100).toFixed(1);
                plPctEl.textContent = (totalPL < 0 ? '' : '+') + pct + '%';
                plPctEl.className = 'stat-value ' + (totalPL < 0 ? 'loss' : 'profit');
            }

            posData.forEach((pos, i) => {
                const allocCell = allRows[i].querySelector('.alloc-pct');
                if (!allocCell) return;
                if (!pos) { allocCell.classList.add('neutral'); return; }
                allocCell.textContent = (pos.mktVal / totalPortfolio * 100).toFixed(1) + '%';
            });
        }
    }

    // ── Column visibility: hide TO TARGET %, remove TO STOP % ──────────────
    function applyColumnVisibility(tbl, tb) {
        if (!tbl || !tb) return;
        const ths = Array.from(tbl.querySelectorAll('thead th'));
        // Hide TO TARGET % (index 11) — kept in DOM for proximity alert logic
        if (ths[11]) ths[11].hidden = true;
        Array.from(tb.rows).forEach(row => {
            if (row.cells[11]) row.cells[11].hidden = true;
        });
        // Remove TO STOP % (index 10) — not needed
        if (ths[10]) ths[10].remove();
        Array.from(tb.rows).forEach(row => {
            if (row.cells[10]) row.cells[10].remove();
        });
    }
    applyColumnVisibility(table, tbody);
    applyColumnVisibility(table2, tbody2);

    // ── Tier explanation content ────────────────────────────────────────────
    const TIER_INFO = {
        warning: {
            label: 'Near Entry — Act Now',
            text: 'Price is still close to our original entry. Time-sensitive window — the setup is valid but may not stay at this level for long.',
        },
        'high-potential': {
            label: 'High Potential',
            text: 'Strong setup with significant upside still to target. Risk/reward is compelling — short entry conditions remain intact with 20%+ downside ahead.',
        },
        setup: {
            label: 'Setup Intact',
            text: 'Entry conditions are still valid. No confirmed percentage gap yet — monitoring for the ideal entry point.',
        },
    };

    function buildExplainRow(tier, colCount) {
        const { label, text } = TIER_INFO[tier];
        const tr = document.createElement('tr');
        tr.className = 'expand-row';
        const td = document.createElement('td');
        td.colSpan = colCount;
        td.innerHTML = `<div class="tier-explanation">
            <span class="exp-dot ${tier}"></span>
            <div>
                <div class="exp-label ${tier}">${label}</div>
                <div class="exp-text">${text}</div>
            </div>
        </div>`;
        tr.appendChild(td);
        return tr;
    }

    // ── Row selection ───────────────────────────────────────────────────────
    function addRowSelectionHandler(tb) {
        if (!tb) return;
        tb.addEventListener('click', e => {
            const row = e.target.closest('tr');
            if (!row || row.classList.contains('expand-row')) return;
            const tier = row.dataset.tier;
            const wasSelected = row.classList.contains('row-selected');
            tb.querySelectorAll('.expand-row').forEach(r => r.remove());
            tb.querySelectorAll('.row-selected').forEach(r => r.classList.remove('row-selected'));
            if (!wasSelected) {
                row.classList.add('row-selected');
                if (tier) row.after(buildExplainRow(tier, row.cells.length));
            }
        });
    }
    addRowSelectionHandler(tbody);
    addRowSelectionHandler(tbody2);
    addRowSelectionHandler(alertsBody);

    // ── Trade History filter & search ───────────────────────────────────────
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const symbolSearch = document.querySelector('.symbol-search');

    function applyTradesFilter() {
        if (!tradesBody) return;
        const filter    = document.querySelector('.filter-btn.active')?.dataset.filter ?? 'all';
        const searchVal = symbolSearch?.value.trim().toUpperCase() ?? '';
        Array.from(tradesBody.rows).forEach(row => {
            const symbol = row.querySelector('.symbol')?.textContent ?? '';
            row.style.display =
                (filter === 'all' || row.dataset.result === filter) &&
                (!searchVal || symbol.toUpperCase().includes(searchVal)) ? '' : 'none';
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyTradesFilter();
        });
    });

    if (symbolSearch) symbolSearch.addEventListener('input', applyTradesFilter);

    // ── Shared table sorting ────────────────────────────────────────────────
    const MONTHS = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6,
                     Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 };

    function parseCell(row, idx, useInfinity) {
        const cell = row.cells[idx];
        if (!cell) return '';
        const raw = cell.textContent.trim();
        if (useInfinity && (raw === '—' || raw === 'n/a')) return Infinity;
        const dm = raw.match(/^(\w{3})\s+(\d{1,2})(?:\s+'(\d{2}))?$/);
        if (dm) return new Date(dm[3] ? 2000 + +dm[3] : 2026, (MONTHS[dm[1]] || 1) - 1, +dm[2]).getTime();
        const n = parseFloat(raw.replace(/[$\s%+]/g, '').replace(',', '.'));
        return isNaN(n) ? raw.toLowerCase() : n;
    }

    function makeSorter(tableEl, bodyEl, useInfinity) {
        if (!tableEl || !bodyEl) return;
        let col = -1, asc = true;
        tableEl.querySelectorAll('thead th').forEach((th, idx) => {
            th.addEventListener('click', () => {
                asc = col === idx ? !asc : true;
                col = idx;
                Array.from(bodyEl.rows)
                    .sort((a, b) => {
                        const av = parseCell(a, idx, useInfinity);
                        const bv = parseCell(b, idx, useInfinity);
                        if (av === bv) return 0;
                        if (av === Infinity) return 1;
                        if (bv === Infinity) return -1;
                        return (av < bv ? -1 : 1) * (asc ? 1 : -1);
                    })
                    .forEach(r => bodyEl.appendChild(r));
                tableEl.querySelectorAll('thead th').forEach((th, i) => {
                    const icon = th.querySelector('.sort-icon');
                    if (icon) icon.textContent = i === col ? (asc ? '↑' : '↓') : '↕';
                });
            });
        });
    }

    makeSorter(table, tbody, true);
    makeSorter(table2, tbody2, true);
    makeSorter(tradesTable, tradesBody, false);

    // ── Positions card view ─────────────────────────────────────────────────
    const tableViewBtn    = document.getElementById('tableViewBtn');
    const cardViewBtn     = document.getElementById('cardViewBtn');
    const tableContainer  = document.querySelector('.positions-section:not(.positions-section-2) .table-container');
    const tableContainer2 = document.querySelector('.positions-section-2 .table-container');
    const cardGrid        = document.getElementById('positionsCardGrid');

    // ── Animation helpers ────────────────────────────────────────────────────
    function typeWriter(el, text, charDelay) {
        el.textContent = '';
        [...text].forEach((ch, i) => setTimeout(() => { el.textContent += ch; }, i * charDelay));
    }

    // ── Extract row data into a plain object ─────────────────────────────────
    function rowToCardData(row) {
        const parseP = s => parseFloat((s || '').replace(/[$,\s]/g, ''));
        const sym      = row.querySelector('.symbol')?.textContent.trim() ?? '';
        const isShort  = !!row.querySelector('.badge.short-trade');
        const cat      = row.querySelector('.badge')?.textContent.trim() ?? '';
        const entryText = row.cells[6]?.textContent.trim() ?? '—';
        const stopRaw   = row.cells[7]?.textContent.trim() ?? '—';
        const curRaw    = row.cells[4]?.querySelector('.current-price')?.textContent.trim().replace(',', '.') ?? null;
        const curText   = curRaw ? '$' + curRaw : '—';
        const targetRaw = row.cells[5]?.textContent.trim() ?? '—';
        const plPct     = row.cells[2]?.textContent.trim() ?? '—';
        const plDol     = row.cells[3]?.textContent.trim() ?? '—';
        const allocText = row.cells[8]?.textContent.trim() ?? '—';

        const curNum = curRaw ? parseFloat(curRaw) : NaN;
        const tgtNum = parseP(targetRaw);
        const stpNum = parseP(stopRaw);
        const entNum = parseP(entryText);

        let upside = null, rrStr = null;
        if (!isNaN(curNum) && !isNaN(tgtNum) && tgtNum > 0) {
            const uVal = isShort ? (curNum - tgtNum) / curNum * 100 : (tgtNum - curNum) / curNum * 100;
            if (uVal > 0) upside = uVal.toFixed(1) + '%';
        }
        if (!isNaN(curNum) && !isNaN(tgtNum) && !isNaN(stpNum) && stpNum > 0) {
            const rr = isShort ? (curNum - tgtNum) / (stpNum - curNum) : (tgtNum - curNum) / (curNum - stpNum);
            if (rr > 0 && isFinite(rr)) rrStr = rr.toFixed(1) + '×';
        }

        const plNum   = parseFloat(plPct.replace(/[+%\s]/g, ''));
        const plClass = plPct.startsWith('+') ? 'profit' : plPct.startsWith('-') ? 'loss' : 'neutral';
        const plAbs   = Math.abs(plNum).toFixed(1);
        const status  = isNaN(plNum) || plPct === '—' ? 'No P/L data available.'
                      : Math.abs(plNum) < 1            ? `Trading right at entry (${plPct} from entry).`
                      : plNum > 0                      ? `Up ${plAbs}% from entry.`
                      :                                  `Down ${plAbs}% from entry.`;
        const stopVal   = (stopRaw  === 'n/a' || stopRaw  === '—') ? '—' : stopRaw;
        const targetVal = (targetRaw === 'n/a' || targetRaw === '—') ? '—' : targetRaw;

        return { sym, cat, isShort, entryText, stopVal, curText, targetVal, plPct, plDol, plClass, status, upside, rrStr, allocText, curNum, tgtNum, stpNum, entNum };
    }

    // ── Open position detail modal ───────────────────────────────────────────
    function openPositionModal(d, tier = '') {
        document.querySelector('.pos-modal-overlay')?.remove();

        const metricsHTML = [
            { label: 'Stop',   val: d.stopVal,   cls: '' },
            d.upside && { label: 'Upside', val: d.upside,   cls: 'upside' },
            d.rrStr  && { label: 'R/R',    val: d.rrStr,    cls: 'rr' },
            { label: 'Size',   val: d.allocText, cls: '' },
            { label: 'P/L $',  val: d.plDol,     cls: d.plClass },
        ].filter(Boolean).map((m, i) => `
            <div class="pos-modal-metric" style="animation-delay:${0.22 + i * 0.07}s">
                <div class="pos-modal-metric-label">${m.label}</div>
                <div class="pos-modal-metric-val ${m.cls}">${m.val}</div>
            </div>`).join('');

        const tierExplainHTML = tier && TIER_INFO[tier] ? `
            <div class="pos-modal-tier-explanation">
                <span class="exp-dot ${tier}"></span>
                <div>
                    <div class="exp-label ${tier}">${TIER_INFO[tier].label}</div>
                    <div class="exp-text">${TIER_INFO[tier].text}</div>
                </div>
            </div>` : '';

        const overlay = document.createElement('div');
        overlay.className = 'pos-modal-overlay';
        overlay.innerHTML = `
            <div class="pos-modal" role="dialog" aria-modal="true"${tier ? ` data-tier="${tier}"` : ''}>
                <button class="pos-modal-close" aria-label="Close">✕</button>
                <div class="pos-modal-header">
                    <div class="pos-modal-sym-row">
                        <span class="pos-modal-symbol">${d.sym}</span>
                        <span class="badge ${d.isShort ? 'short-trade' : 'swing-trade'}">${d.cat}</span>
                    </div>
                    <span class="pos-modal-pl ${d.plClass}">${d.plPct}</span>
                </div>
                <div class="pos-modal-status"></div>
                <div class="pos-modal-prices">
                    <div class="pos-modal-price-col">
                        <div class="pos-modal-price-label">Entry</div>
                        <div class="pos-modal-price-val">${d.entryText}</div>
                    </div>
                    <div class="pos-modal-price-col">
                        <div class="pos-modal-price-label">Current</div>
                        <div class="pos-modal-price-val current">${d.curText}</div>
                    </div>
                    <div class="pos-modal-price-col">
                        <div class="pos-modal-price-label">Target</div>
                        <div class="pos-modal-price-val">${d.targetVal}</div>
                    </div>
                </div>
                <div class="pos-modal-metrics">${metricsHTML}</div>
                ${tierExplainHTML}
            </div>`;

        const borderSpeed = tier === 'high-potential' ? 3
            : tier === 'warning' ? 4
            : tier === 'setup'   ? 10 : null;
        if (borderSpeed) {
            const posModal = overlay.querySelector('.pos-modal');
            posModal.style.animation = `modalIn 0.38s cubic-bezier(0.16, 1, 0.3, 1), rotateBorderAngle ${borderSpeed}s linear infinite`;
        }

        document.body.appendChild(overlay);

        const close = () => {
            overlay.style.cssText = 'opacity:0; transition:opacity 0.15s ease';
            setTimeout(() => overlay.remove(), 150);
        };
        overlay.querySelector('.pos-modal-close').addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        const onEsc = e => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); } };
        document.addEventListener('keydown', onEsc);

        typeWriter(overlay.querySelector('.pos-modal-status'), d.status, 22);

    }

    // ── Build card grid from table rows ──────────────────────────────────────
    function buildPositionCards() {
        if (!cardGrid) return;
        cardGrid.innerHTML = '';
        const allCardRows = [
            ...(tbody  ? Array.from(tbody.rows)  : []),
            ...(tbody2 ? Array.from(tbody2.rows) : []),
        ];
        allCardRows.forEach((row, idx) => {
            const d = rowToCardData(row);
            const tier = row.dataset.tier ?? '';
            const card = document.createElement('div');
            const glowClass = d.plClass === 'profit' ? ' glow-profit' : d.plClass === 'loss' ? ' glow-loss' : '';
            card.className = 'pos-card' + (row.classList.contains('row-selected') ? ' row-selected' : '') + glowClass;
            if (tier) card.dataset.tier = tier;
            const entranceDelay = `${idx * 50}ms`;
            const borderAnim = tier === 'high-potential'
                ? `, rotateBorderAngle 3s linear infinite`
                : tier === 'warning'
                ? `, rotateBorderAngle 4s linear infinite`
                : tier === 'setup'
                ? `, rotateBorderAngle 10s linear infinite`
                : (d.plClass === 'profit' || d.plClass === 'loss')
                ? `, rotateBorderAngle 5s linear infinite`
                : '';
            card.style.animation = `cardEntrance 0.5s ${entranceDelay} cubic-bezier(0.16, 1, 0.3, 1) both${borderAnim}`;
            const arrowHtml = d.plClass === 'profit'
                ? '<span class="pl-arrow arrow-up">▲</span>'
                : d.plClass === 'loss'
                ? '<span class="pl-arrow arrow-down">▼</span>'
                : '';
            const tierDot = tier ? `<span class="tier-dot ${tier}"></span>` : '';
            card.innerHTML = `
                <div class="pos-card-header">
                    <div class="pos-card-sym-wrap">
                        ${tierDot}<span class="pos-card-symbol">${d.sym}</span>
                        <span class="badge ${d.isShort ? 'short-trade' : 'swing-trade'}">${d.cat}</span>
                    </div>
                    <span class="pos-card-pl ${d.plClass}">${arrowHtml}${d.plPct}</span>
                </div>
                <div class="pos-card-status">${d.status}</div>
                <div class="pos-card-prices">
                    <div class="pos-card-price-col">
                        <div class="pos-card-price-label">Entry</div>
                        <div class="pos-card-price-val">${d.entryText}</div>
                    </div>
                    <div class="pos-card-price-col">
                        <div class="pos-card-price-label">Current</div>
                        <div class="pos-card-price-val current">${d.curText}</div>
                    </div>
                    <div class="pos-card-price-col">
                        <div class="pos-card-price-label">Target</div>
                        <div class="pos-card-price-val">${d.targetVal}</div>
                    </div>
                </div>
                <div class="pos-card-footer">
                    <span>Stop: <strong>${d.stopVal}</strong></span>
                    ${d.upside ? `<span>Upside: <span class="upside">${d.upside}</span></span>` : ''}
                    ${d.rrStr  ? `<span>R/R: <span class="rr">${d.rrStr}</span></span>`          : ''}
                    <span>Size: <strong>${d.allocText}</strong></span>
                    <span>P/L: <span class="${d.plClass}">${d.plDol}</span></span>
                </div>`;

            card.addEventListener('click', () => {
                const wasSelected = row.classList.contains('row-selected');
                [tbody, tbody2].filter(Boolean).forEach(tb =>
                    tb.querySelectorAll('.row-selected').forEach(r => r.classList.remove('row-selected'))
                );
                cardGrid.querySelectorAll('.pos-card.row-selected').forEach(c => c.classList.remove('row-selected'));
                if (!wasSelected) { row.classList.add('row-selected'); card.classList.add('row-selected'); }
                openPositionModal(d, tier);
            });

            cardGrid.appendChild(card);
        });
    }

    function activateCardView() {
        buildPositionCards();
        cardViewBtn.classList.add('active');
        cardViewBtn.setAttribute('aria-pressed', 'true');
        tableViewBtn.classList.remove('active');
        tableViewBtn.setAttribute('aria-pressed', 'false');
        tableContainer.hidden = true;
        if (tableContainer2) tableContainer2.hidden = true;
        cardGrid.hidden = false;
        document.body.classList.add('dark-mode');
        localStorage.setItem('posView', 'card');
    }

    function activateTableView() {
        tableViewBtn.classList.add('active');
        tableViewBtn.setAttribute('aria-pressed', 'true');
        cardViewBtn.classList.remove('active');
        cardViewBtn.setAttribute('aria-pressed', 'false');
        tableContainer.hidden = false;
        if (tableContainer2) tableContainer2.hidden = false;
        cardGrid.hidden = true;
        document.body.classList.remove('dark-mode');
        localStorage.setItem('posView', 'table');
    }

    if (tableViewBtn && cardViewBtn && tableContainer && cardGrid) {
        tableViewBtn.addEventListener('click', activateTableView);
        cardViewBtn.addEventListener('click', activateCardView);

        if (localStorage.getItem('posView') === 'card') {
            activateCardView();
        }
    }

    // ── Portfolio Summary metrics toggle ────────────────────────────────────
    const portfolioToggle = document.getElementById('portfolioSummaryTitle');
    const metricsGridEl   = document.getElementById('metricsGrid');
    if (portfolioToggle && metricsGridEl) {
        function toggleMetrics() {
            const expanded = metricsGridEl.classList.toggle('expanded');
            portfolioToggle.classList.toggle('expanded', expanded);
            portfolioToggle.setAttribute('aria-expanded', String(expanded));
            metricsGridEl.setAttribute('aria-hidden', String(!expanded));
            localStorage.setItem('metricsExpanded', expanded ? '1' : '0');
        }
        portfolioToggle.addEventListener('click', toggleMetrics);
        portfolioToggle.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMetrics(); }
        });
        if (localStorage.getItem('metricsExpanded') === '1') toggleMetrics();
    }

})();

// ── Ticker CSS scroll + pause controls ──────────────────────────────────────
(function initTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    // Populate from data and duplicate for seamless loop
    if (typeof TICKER_DATA !== 'undefined' && TICKER_DATA.length) {
        const html = TICKER_DATA.map(t =>
            `<div class="ticker-item ${t.tier}"><span class="ticker-icon">${t.icon}</span><span class="ticker-title">${t.symbol}</span><span class="ticker-body">${t.body}</span></div><span class="ticker-sep">•</span>`
        ).join('');
        track.innerHTML = html + html;
    }

    track.addEventListener('mouseenter', () => { track.classList.add('paused'); });
    track.addEventListener('mouseleave', () => { track.classList.remove('paused'); });
    track.addEventListener('touchstart', () => { track.classList.toggle('paused'); }, { passive: true });
}());

