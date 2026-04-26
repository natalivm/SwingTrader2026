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

    // ── Portfolio allocation percentages ────────────────────────────────────
    if (tbody) {
        const portfolioLabelEl = Array.from(document.querySelectorAll('.stat-label'))
            .find(el => el.textContent.trim() === 'Portfolio Value');
        const totalPortfolio = portfolioLabelEl
            ? parseFloat(portfolioLabelEl.nextElementSibling.textContent.replace(/[$,]/g, ''))
            : NaN;

        if (totalPortfolio && !isNaN(totalPortfolio)) {
            const na = s => !s || s === 'n/a' || s === '—';
            Array.from(tbody.rows).forEach(row => {
                const allocCell = row.querySelector('.alloc-pct');
                if (!allocCell) return;
                const plPctText = row.cells[7]?.textContent.trim();
                const plDolText = row.cells[8]?.textContent.trim();
                if (na(plPctText) || na(plDolText)) { allocCell.classList.add('neutral'); return; }
                const plPct = parseFloat(plPctText.replace(/[+%\s]/g, '')) / 100;
                const plDol = parseFloat(plDolText.replace(/[+$\s]/g, ''));
                if (!plPct || isNaN(plPct) || isNaN(plDol)) { allocCell.classList.add('neutral'); return; }
                allocCell.textContent =
                    ((Math.abs(plDol) / Math.abs(plPct) + plDol) / totalPortfolio * 100).toFixed(1) + '%';
            });
        }
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

})();
