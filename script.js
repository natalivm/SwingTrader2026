(function () {
    'use strict';

    const hamburger   = document.getElementById('hamburger');
    const navMenu     = document.getElementById('navMenu');
    const navLinks    = document.querySelectorAll('.nav-link');
    const pages       = document.querySelectorAll('.page');
    const tbody       = document.querySelector('.positions-table tbody');
    const table       = document.querySelector('.positions-table');
    const tradesBody  = document.querySelector('.trades-table tbody');
    const tradesTable = document.querySelector('.trades-table');

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
    const countEl = document.querySelector('.position-count');
    if (tbody && countEl) countEl.textContent = `(${tbody.rows.length})`;

    // ── Totals + allocation — single pass over rows ─────────────────────────
    if (tbody) {
        const naVal = s => !s || s === 'n/a' || s === '—';
        const findStat = label => {
            const el = Array.from(document.querySelectorAll('.stat-label'))
                .find(e => e.textContent.trim() === label);
            return el?.nextElementSibling ?? null;
        };

        let totalPL = 0, totalPortfolio = 0, hasData = false;
        const rows = Array.from(tbody.rows);
        const posData = rows.map(row => {
            const plPctText = row.cells[7]?.textContent.trim();
            const plDolText = row.cells[8]?.textContent.trim();
            if (naVal(plPctText) || naVal(plDolText)) return null;
            const plPct = parseFloat(plPctText.replace(/[+%\s]/g, '')) / 100;
            const plDol = parseFloat(plDolText.replace(/[+$,\s]/g, ''));
            if (!plPct || isNaN(plPct) || isNaN(plDol)) return null;
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
                const allocCell = rows[i].querySelector('.alloc-pct');
                if (!allocCell) return;
                if (!pos) { allocCell.classList.add('neutral'); return; }
                allocCell.textContent = (pos.mktVal / totalPortfolio * 100).toFixed(1) + '%';
            });
        }
    }

    // ── Column visibility: hide TO TARGET %, remove TO STOP % ──────────────
    if (table && tbody) {
        const ths = Array.from(table.querySelectorAll('thead th'));

        // Hide TO TARGET % (index 11) — kept in DOM for proximity alert logic
        if (ths[11]) ths[11].style.display = 'none';
        Array.from(tbody.rows).forEach(row => {
            if (row.cells[11]) row.cells[11].style.display = 'none';
        });

        // Remove TO STOP % (index 10) — not needed
        if (ths[10]) ths[10].remove();
        Array.from(tbody.rows).forEach(row => {
            if (row.cells[10]) row.cells[10].remove();
        });
    }

    // ── Row selection ───────────────────────────────────────────────────────
    if (tbody) {
        tbody.addEventListener('click', e => {
            const row = e.target.closest('tr');
            if (!row) return;
            const wasSelected = row.classList.contains('row-selected');
            tbody.querySelectorAll('.row-selected').forEach(r => r.classList.remove('row-selected'));
            if (!wasSelected) row.classList.add('row-selected');
        });
    }

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

    function parseCell(row, idx, progress, useInfinity) {
        const cell = row.cells[idx];
        if (!cell) return '';
        const span = progress ? cell.querySelector('.progress-value') : null;
        const raw  = (span ? span.textContent : cell.textContent).trim();
        if (useInfinity && (raw === '—' || raw === 'n/a')) return Infinity;
        const dm = raw.match(/^(\w{3})\s+(\d{1,2})(?:\s+'(\d{2}))?$/);
        if (dm) return new Date(dm[3] ? 2000 + +dm[3] : 2026, (MONTHS[dm[1]] || 1) - 1, +dm[2]).getTime();
        const n = parseFloat(raw.replace(/[$\s%+]/g, '').replace(',', '.'));
        return isNaN(n) ? raw.toLowerCase() : n;
    }

    function makeSorter(tableEl, bodyEl, progress, useInfinity) {
        if (!tableEl || !bodyEl) return;
        let col = -1, asc = true;
        tableEl.querySelectorAll('thead th').forEach((th, idx) => {
            th.addEventListener('click', () => {
                asc = col === idx ? !asc : true;
                col = idx;
                Array.from(bodyEl.rows)
                    .sort((a, b) => {
                        const av = parseCell(a, idx, progress, useInfinity);
                        const bv = parseCell(b, idx, progress, useInfinity);
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

    makeSorter(table, tbody, true, true);
    makeSorter(tradesTable, tradesBody, false, false);

    // ── Positions card view ─────────────────────────────────────────────────
    const tableViewBtn    = document.getElementById('tableViewBtn');
    const cardViewBtn     = document.getElementById('cardViewBtn');
    const tableContainer  = document.querySelector('.positions-section .table-container');
    const cardGrid        = document.getElementById('positionsCardGrid');
    let cardsBuilt        = false;

    function buildPositionCards() {
        if (!tbody || !cardGrid) return;
        cardGrid.innerHTML = '';

        const parseP = s => parseFloat((s || '').replace(/[$,\s]/g, ''));

        Array.from(tbody.rows).forEach(row => {
            const sym    = row.querySelector('.symbol')?.textContent.trim() ?? '';
            const isShort = !!row.querySelector('.badge.short-trade');
            const cat    = row.querySelector('.badge')?.textContent.trim() ?? '';

            // After column manipulation: indices 3–8 are ENTRY, STOP, CURRENT, TARGET, PL%, PL$
            const entryText  = row.cells[3]?.textContent.trim() ?? '—';
            const stopText   = row.cells[4]?.textContent.trim() ?? '—';
            const curSpan    = row.cells[5]?.querySelector('.current-price');
            const curRaw     = curSpan?.textContent.trim().replace(',', '.') ?? null;
            const curText    = curRaw ? '$' + curRaw : '—';
            const targetText = row.cells[6]?.textContent.trim() ?? '—';
            const plPct      = row.cells[7]?.textContent.trim() ?? '—';
            const plDol      = row.cells[8]?.textContent.trim() ?? '—';

            const curNum  = curRaw ? parseFloat(curRaw) : NaN;
            const tgtNum  = parseP(targetText);
            const stpNum  = parseP(stopText);

            let upside = null, rrStr = null;
            if (!isNaN(curNum) && !isNaN(tgtNum) && tgtNum !== 0) {
                const uVal = isShort
                    ? (curNum - tgtNum) / curNum * 100
                    : (tgtNum - curNum) / curNum * 100;
                if (uVal > 0) upside = uVal.toFixed(1) + '%';
            }
            if (!isNaN(curNum) && !isNaN(tgtNum) && !isNaN(stpNum) && stpNum !== 0) {
                const rrNum = isShort
                    ? (curNum - tgtNum) / (stpNum - curNum)
                    : (tgtNum - curNum) / (curNum - stpNum);
                if (rrNum > 0 && isFinite(rrNum)) rrStr = rrNum.toFixed(1) + '×';
            }

            const plNum    = parseFloat(plPct.replace(/[+%\s]/g, ''));
            const plClass  = plPct.startsWith('+') ? 'profit' : plPct.startsWith('-') ? 'loss' : 'neutral';
            let status;
            const plAbs = Math.abs(plNum).toFixed(1);
            if (isNaN(plNum) || plPct === '—') {
                status = 'No P/L data available.';
            } else if (Math.abs(plNum) < 1) {
                status = `Trading right at entry (${plPct} from entry).`;
            } else if (plNum > 0) {
                status = `Up ${plAbs}% from entry.`;
            } else {
                status = `Down ${plAbs}% from entry.`;
            }

            const stopVal   = (stopText === 'n/a' || stopText === '—') ? '—' : stopText;
            const targetVal = (targetText === 'n/a' || targetText === '—') ? '—' : targetText;

            const card = document.createElement('div');
            card.className = 'pos-card' + (row.classList.contains('row-selected') ? ' row-selected' : '');
            card.innerHTML = `
                <div class="pos-card-header">
                    <div class="pos-card-sym-wrap">
                        <span class="pos-card-symbol">${sym}</span>
                        <span class="badge ${isShort ? 'short-trade' : 'swing-trade'}">${cat}</span>
                    </div>
                    <span class="pos-card-pl ${plClass}">${plPct}</span>
                </div>
                <div class="pos-card-status">${status}</div>
                <div class="pos-card-prices">
                    <div class="pos-card-price-col">
                        <div class="pos-card-price-label">Entry</div>
                        <div class="pos-card-price-val">${entryText}</div>
                    </div>
                    <div class="pos-card-price-col">
                        <div class="pos-card-price-label">Current</div>
                        <div class="pos-card-price-val current">${curText}</div>
                    </div>
                    <div class="pos-card-price-col">
                        <div class="pos-card-price-label">Target</div>
                        <div class="pos-card-price-val">${targetVal}</div>
                    </div>
                </div>
                <div class="pos-card-footer">
                    <span>Stop: <strong>${stopVal}</strong></span>
                    ${upside ? `<span>Upside: <span class="upside">${upside}</span></span>` : ''}
                    ${rrStr  ? `<span>R/R: <span class="rr">${rrStr}</span></span>` : ''}
                    <span>P/L: <span class="${plClass}">${plDol}</span></span>
                </div>`;

            card.addEventListener('click', () => {
                const wasSelected = row.classList.contains('row-selected');
                tbody.querySelectorAll('.row-selected').forEach(r => r.classList.remove('row-selected'));
                cardGrid.querySelectorAll('.pos-card.row-selected').forEach(c => c.classList.remove('row-selected'));
                if (!wasSelected) {
                    row.classList.add('row-selected');
                    card.classList.add('row-selected');
                }
            });

            cardGrid.appendChild(card);
        });
    }

    if (tableViewBtn && cardViewBtn && tableContainer && cardGrid) {
        tableViewBtn.addEventListener('click', () => {
            tableViewBtn.classList.add('active');
            tableViewBtn.setAttribute('aria-pressed', 'true');
            cardViewBtn.classList.remove('active');
            cardViewBtn.setAttribute('aria-pressed', 'false');
            tableContainer.hidden = false;
            cardGrid.hidden = true;
        });

        cardViewBtn.addEventListener('click', () => {
            if (!cardsBuilt) { buildPositionCards(); cardsBuilt = true; }
            cardViewBtn.classList.add('active');
            cardViewBtn.setAttribute('aria-pressed', 'true');
            tableViewBtn.classList.remove('active');
            tableViewBtn.setAttribute('aria-pressed', 'false');
            tableContainer.hidden = true;
            cardGrid.hidden = false;
        });
    }

})();
