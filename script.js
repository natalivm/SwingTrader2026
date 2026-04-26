(function () {
    'use strict';

    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');
    const navLinks  = document.querySelectorAll('.nav-link');
    const pages     = document.querySelectorAll('.page');

    // ── Tab activation (single source of truth — no click() re-dispatch) ───
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

    // ── Mobile menu toggle ──────────────────────────────────────────────────
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!expanded));
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // ── Nav link clicks — use pushState, not hash assignment ────────────────
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const tabName = link.getAttribute('data-tab');
            if (tabName && activateTab(tabName)) {
                history.pushState({ tab: tabName }, '', `#${tabName}`);
            }
        });
    });

    // ── Browser back/forward — popstate, not hashchange ─────────────────────
    window.addEventListener('popstate', e => {
        const tab = (e.state && e.state.tab) || location.hash.slice(1) || 'portfolio';
        activateTab(tab);
    });

    // ── Init from URL hash on load ──────────────────────────────────────────
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
            const { outcome } = await deferredInstallPrompt.userChoice;
            deferredInstallPrompt = null;
            installBtn.hidden = true;
        });
    }

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        if (installBtn) installBtn.hidden = true;
    });

    // ── Position count — computed from actual rows ──────────────────────────
    const tbody   = document.querySelector('.positions-table tbody');
    const countEl = document.querySelector('.position-count');
    if (tbody && countEl) {
        countEl.textContent = `(${tbody.rows.length})`;
    }

    // ── Row selection for open positions ────────────────────────────────────
    if (tbody) {
        tbody.addEventListener('click', e => {
            const row = e.target.closest('tr');
            if (!row) return;
            const isSelected = row.classList.contains('row-selected');
            tbody.querySelectorAll('.row-selected').forEach(r => r.classList.remove('row-selected'));
            if (!isSelected) row.classList.add('row-selected');
        });
    }

    // ── Trade History filter & search ───────────────────────────────────────
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const symbolSearch = document.querySelector('.symbol-search');
    const tradesBody   = document.querySelector('.trades-table tbody');

    function applyTradesFilter() {
        if (!tradesBody) return;
        const active    = document.querySelector('.filter-btn.active');
        const filter    = active ? active.dataset.filter : 'all';
        const searchVal = (symbolSearch ? symbolSearch.value : '').trim().toUpperCase();

        Array.from(tradesBody.rows).forEach(row => {
            const matchesFilter = filter === 'all' || row.dataset.result === filter;
            const symbol = (row.querySelector('.symbol') || {}).textContent || '';
            const matchesSearch = !searchVal || symbol.toUpperCase().includes(searchVal);
            row.style.display = matchesFilter && matchesSearch ? '' : 'none';
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyTradesFilter();
        });
    });

    if (symbolSearch) {
        symbolSearch.addEventListener('input', applyTradesFilter);
    }

    // ── Trades table sorting ─────────────────────────────────────────────────
    const tradesTable = document.querySelector('.trades-table');
    if (tradesTable && tradesBody) {
        let tSortCol = -1;
        let tSortAsc = true;

        const MONTHS = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6,
                         Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 };

        function tradesCellValue(row, idx) {
            const cell = row.cells[idx];
            if (!cell) return '';
            const raw = cell.textContent.trim();
            const dm = raw.match(/^(\w{3})\s+(\d{1,2})(?:\s+'(\d{2}))?$/);
            if (dm) {
                const yr = dm[3] ? 2000 + +dm[3] : 2026;
                return new Date(yr, (MONTHS[dm[1]] || 1) - 1, +dm[2]).getTime();
            }
            const n = parseFloat(raw.replace(/[$\s%+]/g, '').replace(',', '.'));
            if (!isNaN(n)) return n;
            return raw.toLowerCase();
        }

        function sortTradesBy(colIdx) {
            tSortAsc = (tSortCol === colIdx) ? !tSortAsc : true;
            tSortCol = colIdx;

            Array.from(tradesBody.rows)
                .sort((a, b) => {
                    const av = tradesCellValue(a, colIdx);
                    const bv = tradesCellValue(b, colIdx);
                    if (av < bv) return tSortAsc ? -1 : 1;
                    if (av > bv) return tSortAsc ? 1 : -1;
                    return 0;
                })
                .forEach(row => tradesBody.appendChild(row));

            tradesTable.querySelectorAll('thead th').forEach((th, i) => {
                const icon = th.querySelector('.sort-icon');
                if (icon) icon.textContent = i === colIdx ? (tSortAsc ? '↑' : '↓') : '↕';
            });
        }

        tradesTable.querySelectorAll('thead th').forEach((th, idx) => {
            th.addEventListener('click', () => sortTradesBy(idx));
        });
    }

    // ── Column sorting ──────────────────────────────────────────────────────
    const table = document.querySelector('.positions-table');
    if (table && tbody) {
        let sortCol = -1;
        let sortAsc = true;

        const MONTHS = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6,
                         Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 };

        function cellValue(row, idx) {
            const cell = row.cells[idx];
            if (!cell) return '';

            // Progress column: read only the numeric span, not the bar markup
            const progSpan = cell.querySelector('.progress-value');
            const raw = (progSpan ? progSpan.textContent : cell.textContent).trim();

            if (raw === '—' || raw === 'n/a') return Infinity;

            // Date: "Feb 12 '26"
            const dm = raw.match(/^(\w{3})\s+(\d{1,2})\s+'(\d{2})$/);
            if (dm) {
                return new Date(2000 + +dm[3], (MONTHS[dm[1]] || 1) - 1, +dm[2]).getTime();
            }

            // Number: strip $, %, spaces; treat comma as decimal separator
            const n = parseFloat(raw.replace(/[$\s]/g, '').replace('%', '').replace(',', '.'));
            if (!isNaN(n)) return n;

            return raw.toLowerCase();
        }

        function sortBy(colIdx) {
            sortAsc = (sortCol === colIdx) ? !sortAsc : true;
            sortCol = colIdx;

            Array.from(tbody.rows)
                .sort((a, b) => {
                    const av = cellValue(a, colIdx);
                    const bv = cellValue(b, colIdx);
                    if (av === Infinity && bv === Infinity) return 0;
                    if (av === Infinity) return 1;
                    if (bv === Infinity) return -1;
                    if (av < bv) return sortAsc ? -1 : 1;
                    if (av > bv) return sortAsc ? 1 : -1;
                    return 0;
                })
                .forEach(row => tbody.appendChild(row));

            // Update sort icons
            table.querySelectorAll('thead th').forEach((th, i) => {
                const icon = th.querySelector('.sort-icon');
                if (icon) icon.textContent = i === colIdx ? (sortAsc ? '↑' : '↓') : '↕';
            });
        }

        table.querySelectorAll('thead th').forEach((th, idx) => {
            th.addEventListener('click', () => sortBy(idx));
        });
    }

})();
