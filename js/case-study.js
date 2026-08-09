/* ================================================================
   CASE STUDY — nav scroll, theme toggle, progress dots
   ================================================================ */

(function () {

    /* ── Nav scroll state ── */
    const nav = document.getElementById('nav');
    if (nav) {
        const onScroll = () => {
            nav.classList.toggle('is-scrolled', window.scrollY > 10);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── Mobile nav toggle ── */
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!open));
            links.classList.toggle('is-open', !open);
        });
    }

    /* ── Theme toggle ── */
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next    = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    /* ── Sticky progress dots ── */
    const dots     = document.querySelectorAll('.cs-prog-dot');
    const sections = Array.from(dots).map(d => document.querySelector(d.getAttribute('href')));

    const setActive = () => {
        const mid = window.innerHeight / 2;
        let active = 0;
        sections.forEach((sec, i) => {
            if (!sec) return;
            const { top } = sec.getBoundingClientRect();
            if (top <= mid) active = i;
        });
        dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
    };

    if (dots.length) {
        window.addEventListener('scroll', setActive, { passive: true });
        setActive();
    }

    /* ── Smooth scroll for progress dot links ── */
    dots.forEach(dot => {
        dot.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(dot.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ── TL;DR / Detailed view toggle ── */
    const viewBtns   = document.querySelectorAll('.cs-view-btn');
    const viewPanels = document.querySelectorAll('.cs-view-panel');
    viewBtns.forEach(vbtn => {
        vbtn.addEventListener('click', () => {
            const target = vbtn.getAttribute('data-view');
            viewBtns.forEach(b => {
                const active = b === vbtn;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-selected', String(active));
            });
            viewPanels.forEach(p => p.classList.toggle('is-active', p.id === target));
            requestAnimationFrame(resizePrototypes);
        });
    });

    /* Scale interactive prototypes from a true desktop viewport so the
       complete composition fits inside the responsive browser mockup. */
    const prototypeViewports = document.querySelectorAll('.cs-prototype-viewport');
    const resizePrototypes = () => {
        prototypeViewports.forEach(viewport => {
            const frame = viewport.querySelector('iframe');
            if (!frame) return;
            const scale = viewport.clientWidth / 1440;
            frame.style.transform = `scale(${scale})`;
            viewport.style.height = `${Math.round(900 * scale)}px`;
        });
    };
    resizePrototypes();
    window.addEventListener('resize', resizePrototypes);

    /* Keep heavy prototype bundles off the critical path. They are loaded
       only after someone explicitly chooses to explore a concept. */
    prototypeViewports.forEach(viewport => {
        const launch = viewport.querySelector('.cs-prototype-launch');
        const frame = viewport.querySelector('iframe[data-src]');
        if (!launch || !frame) return;
        launch.addEventListener('click', () => {
            launch.hidden = true;
            viewport.classList.add('is-loading');
            frame.addEventListener('load', () => {
                viewport.classList.remove('is-loading');
                viewport.classList.add('is-loaded');
            }, { once: true });
            frame.src = frame.dataset.src;
        }, { once: true });
    });

    /* ── Journey diagram iframe: size to its own content, same-origin ── */
    document.querySelectorAll('.cs-journey-embed iframe').forEach(frame => {
        const resize = () => {
            try {
                const doc = frame.contentDocument;
                if (doc && doc.documentElement) {
                    frame.style.height = doc.documentElement.scrollHeight + 'px';
                }
            } catch (e) { /* cross-origin fallback: leave default height */ }
        };
        frame.addEventListener('load', resize);
    });

})();
