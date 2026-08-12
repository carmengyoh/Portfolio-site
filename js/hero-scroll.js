/* ================================================================
   HERO SCROLL BREAKUP
   Each word/element scatters at a different scroll offset so the
   hero feels like it's exploding apart as you scroll down.
   ================================================================ */
(function () {
    'use strict';

    var hero;
    var spans, emEl, label, subtext, cta;
    var ready = false;

    /* ----------------------------------------------------------------
       Boot
    ---------------------------------------------------------------- */
    function init() {
        hero = document.getElementById('home');
        if (!hero) return;
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function gather() {
        if (ready) return;
        var h = document.querySelector('.hero-heading');
        if (!h) return;
        spans   = h.querySelectorAll('span');
        emEl    = h.querySelector('em');
        label   = document.querySelector('.hero-text-card .label');
        subtext = document.querySelector('.hero-sub');
        cta     = document.querySelector('.hero-actions');
        ready   = true;
    }

    /* ----------------------------------------------------------------
       Scroll handler
    ---------------------------------------------------------------- */
    function onScroll() {
        gather();
        if (!hero) return;
        var t = Math.max(0, Math.min(1, window.scrollY / (hero.offsetHeight * 0.50)));
        document.body.classList.toggle('hero-breaking', t > 0);
        breakup(t);
    }

    /* ----------------------------------------------------------------
       Staggered ease - each element has its own start offset so they
       cascade apart instead of all moving at once
    ---------------------------------------------------------------- */
    function seg(t, start, end) {
        if (t <= start) return 0;
        if (t >= end)   return 1;
        var p = (t - start) / (end - start);
        /* easeInOutQuad */
        return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    }

    /* ----------------------------------------------------------------
       Breakup - large, varied, staggered
    ---------------------------------------------------------------- */
    function breakup(t) {

        var eLabel = seg(t, 0.00, 0.55);   /* label goes first */
        var eS0    = seg(t, 0.04, 0.62);   /* "I turn complexity" */
        var eS1    = seg(t, 0.08, 0.68);   /* "into " */
        var eEm    = seg(t, 0.14, 0.80);   /* "clear" - holds on longest */
        var eS2    = seg(t, 0.06, 0.65);   /* ", validated" */
        var eS3    = seg(t, 0.05, 0.64);   /* "product experiences." */
        var eSub   = seg(t, 0.06, 0.60);
        var eCta   = seg(t, 0.08, 0.55);

        /* ── Heading spans ── */
        move(spans && spans[0],
            -eS0 * 90,  -eS0 * 140,
             1 - eS0 * 1.3, -eS0 * 8, 1 - eS0 * 0.06, eS0 * 3);

        move(spans && spans[1],
             eS1 * 50,  -eS1 * 110,
             1 - eS1 * 1.5,  eS1 * 5, 1, eS1 * 2);

        /* "clear" - spins away last */
        move(emEl,
             eEm * 100, -eEm * 200,
             1 - eEm * 0.75,  eEm * 22,
             1 + eEm * 0.12,  eEm * 6);

        move(spans && spans[2],
            -eS2 * 80,  -eS2 * 130,
             1 - eS2 * 1.4, -eS2 * 6, 1, eS2 * 3);

        move(spans && spans[3],
            -eS3 * 120, -eS3 * 70,
             1 - eS3 * 1.2, -eS3 * 11, 1 - eS3 * 0.05, eS3 * 3);

        /* ── Supporting elements ── */
        move(label,   -eLabel * 55, -eLabel * 70,  1 - eLabel * 2.2, -eLabel * 5, 1, 0);
        move(subtext,  eSub  * 110, -eSub   * 55,  1 - eSub   * 1.6,  eSub * 4,   1, eSub * 3);
        move(cta,      eCta  * 130, -eCta   * 25,  1 - eCta   * 2.0,  eCta * 7,   1, eCta * 4);
    }

    /* ----------------------------------------------------------------
       Apply transform + opacity + optional blur
       move(el, x, y, opacity, rotateDeg, scale, blurPx)
    ---------------------------------------------------------------- */
    function move(el, x, y, opacity, deg, scale, blur) {
        if (!el) return;
        var t = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
        if (deg)   t += ' rotate('  + deg.toFixed(2)   + 'deg)';
        if (scale && scale !== 1) t += ' scale(' + scale.toFixed(3) + ')';
        el.style.transform = t;
        el.style.opacity   = Math.max(0, Math.min(1, opacity)).toFixed(3);
        el.style.filter    = blur ? 'blur(' + blur.toFixed(1) + 'px)' : '';
    }

    /* ----------------------------------------------------------------
       Boot
    ---------------------------------------------------------------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
