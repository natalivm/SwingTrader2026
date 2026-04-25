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

    // ── Position count — computed from actual rows ──────────────────────────
    const tbody   = document.querySelector('.positions-table tbody');
    const countEl = document.querySelector('.position-count');
    if (tbody && countEl) {
        countEl.textContent = `(${tbody.rows.length})`;
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
