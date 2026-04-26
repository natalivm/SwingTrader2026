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
        if (ths[11]) ths[11].hidden = true;
        Array.from(tbody.rows).forEach(row => {
            if (row.cells[11]) row.cells[11].hidden = true;
        });

        // Remove TO STOP % (index 10) — not needed
        if (ths[10]) ths[10].remove();
        Array.from(tbody.rows).forEach(row => {
            if (row.cells[10]) row.cells[10].remove();
        });
    }

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
    if (tbody) {
        tbody.addEventListener('click', e => {
            const row = e.target.closest('tr');
            if (!row || row.classList.contains('expand-row')) return;

            const tier = row.dataset.tier;
            const wasSelected = row.classList.contains('row-selected');

            tbody.querySelectorAll('.expand-row').forEach(r => r.remove());
            tbody.querySelectorAll('.row-selected').forEach(r => r.classList.remove('row-selected'));

            if (!wasSelected) {
                row.classList.add('row-selected');
                if (tier) row.after(buildExplainRow(tier, row.cells.length));
            }
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
    const tableViewBtn   = document.getElementById('tableViewBtn');
    const cardViewBtn    = document.getElementById('cardViewBtn');
    const tableContainer = document.querySelector('.positions-section .table-container');
    const cardGrid       = document.getElementById('positionsCardGrid');

    // ── Animation helpers ────────────────────────────────────────────────────
    function countUp(el, target, prefix, decimals, duration) {
        const t0 = performance.now();
        (function step(now) {
            const p = Math.min((now - t0) / duration, 1);
            el.textContent = prefix + (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
            if (p < 1) requestAnimationFrame(step);
        })(t0);
    }

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
        const entryText = row.cells[3]?.textContent.trim() ?? '—';
        const stopRaw   = row.cells[4]?.textContent.trim() ?? '—';
        const curRaw    = row.cells[5]?.querySelector('.current-price')?.textContent.trim().replace(',', '.') ?? null;
        const curText   = curRaw ? '$' + curRaw : '—';
        const targetRaw = row.cells[6]?.textContent.trim() ?? '—';
        const plPct     = row.cells[7]?.textContent.trim() ?? '—';
        const plDol     = row.cells[8]?.textContent.trim() ?? '—';
        const allocText = row.cells[9]?.textContent.trim() ?? '—';

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
    function openPositionModal(d) {
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

        const overlay = document.createElement('div');
        overlay.className = 'pos-modal-overlay';
        overlay.innerHTML = `
            <div class="pos-modal" role="dialog" aria-modal="true">
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
            </div>`;

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
        if (!tbody || !cardGrid) return;
        cardGrid.innerHTML = '';
        Array.from(tbody.rows).forEach((row, idx) => {
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
                tbody.querySelectorAll('.row-selected').forEach(r => r.classList.remove('row-selected'));
                cardGrid.querySelectorAll('.pos-card.row-selected').forEach(c => c.classList.remove('row-selected'));
                if (!wasSelected) { row.classList.add('row-selected'); card.classList.add('row-selected'); }
                openPositionModal(d);
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
        cardGrid.hidden = false;
        localStorage.setItem('posView', 'card');
    }

    function activateTableView() {
        tableViewBtn.classList.add('active');
        tableViewBtn.setAttribute('aria-pressed', 'true');
        cardViewBtn.classList.remove('active');
        cardViewBtn.setAttribute('aria-pressed', 'false');
        tableContainer.hidden = false;
        cardGrid.hidden = true;
        localStorage.setItem('posView', 'table');
    }

    if (tableViewBtn && cardViewBtn && tableContainer && cardGrid) {
        tableViewBtn.addEventListener('click', activateTableView);
        cardViewBtn.addEventListener('click', activateCardView);

        if (localStorage.getItem('posView') === 'card') {
            activateCardView();
        }
    }

})();

// ── Ticker smooth scroll ─────────────────────────────────────────────────────
(function initTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    const SPEED = 40; // px per second
    let pos = 0;
    let halfWidth = 0;
    let lastTs = null;
    let paused = false;

    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });

    function tick(ts) {
        if (!lastTs) lastTs = ts;
        const dt = ts - lastTs;
        lastTs = ts;

        if (!halfWidth) {
            const items = track.querySelectorAll('.ticker-item');
            const half = Math.floor(items.length / 2);
            if (items[half]) halfWidth = items[half].offsetLeft;
        }

        if (!paused && halfWidth) {
            pos += SPEED * dt / 1000;
            if (pos >= halfWidth) pos -= halfWidth;
            track.style.transform = `translateX(-${pos}px)`;
        }

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}());

