/* ================================================================
   HERO SCROLL BREAKUP
   Each word/element scatters at a different scroll offset so the
   hero feels like it's exploding apart as you scroll down.
   ================================================================ */
(function () {
    'use strict';

    var hero;
    var spans, emEl, label, divider, subtext, cta, scrollCue;
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
        var h = document.querySelector('.hero .hero-heading');
        if (!h) return;
        spans     = h.querySelectorAll('span');
        emEl      = h.querySelector('em');
        label     = document.querySelector('.hero-left .label');
        divider   = document.querySelector('.hero-divider');
        subtext   = document.querySelector('.hero .hero-subtext');
        cta       = document.querySelector('.hero .hero-cta');
        scrollCue = document.querySelector('.hero .scroll-cue');
        ready = true;
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
       Staggered ease — each element has its own start offset so they
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
       Breakup — large, varied, staggered
    ---------------------------------------------------------------- */
    function breakup(t) {

        /* Each element gets its own eased progress window */
        var eLabel = seg(t, 0.00, 0.55);   /* label goes first  */
        var eS0    = seg(t, 0.04, 0.62);   /* "I turn complexity" */
        var eS1    = seg(t, 0.08, 0.68);   /* "into clear, validated" */
        var eS2    = seg(t, 0.05, 0.64);   /* "product experiences…" */
        var eEm    = seg(t, 0.14, 0.80);   /* "trust" — last to let go */
        var eDot   = seg(t, 0.10, 0.65);
        var eDiv   = seg(t, 0.02, 0.50);
        var eSub   = seg(t, 0.06, 0.60);
        var eCta   = seg(t, 0.08, 0.55);
        var eCue   = seg(t, 0.00, 0.40);

        /* ── Heading lines ── */
        /* "I turn complexity" — up-left, slight counter-clockwise tilt */
        move(spans && spans[0],
            -eS0 * 90,  -eS0 * 140,
            1 - eS0 * 1.3,
            -eS0 * 8,
            1 - eS0 * 0.06,
            eS0 * 3);

        /* "into clear, validated" — up-right, clockwise */
        move(spans && spans[1],
             eS1 * 70,  -eS1 * 175,
            1 - eS1 * 1.5,
             eS1 * 6,
            1 - eS1 * 0.08,
             eS1 * 4);

        /* "product experiences people can " — left & slightly down */
        move(spans && spans[2],
            -eS2 * 120, -eS2 * 70,
            1 - eS2 * 1.2,
            -eS2 * 11,
            1 - eS2 * 0.05,
             eS2 * 3);

        /* "trust" — the hero word; holds on longest then spins away */
        move(emEl,
             eEm * 100, -eEm * 200,
            1 - eEm * 0.75,
             eEm * 22,
            1 + eEm * 0.12,   /* grows slightly before flying */
             eEm * 6);

        /* "." */
        move(spans && spans[3],
             eDot * 20, -eDot * 90,
            1 - eDot * 1.6,
             0, 1, 0);

        /* ── Supporting elements ── */
        move(label,    -eLabel * 55, -eLabel * 70,  1 - eLabel * 2.2, -eLabel * 5, 1, 0);
        move(divider,   0,           -eDiv   * 30,  1 - eDiv   * 2.5,  0,          1, 0);
        move(subtext,   eSub  * 110, -eSub   * 55,  1 - eSub   * 1.6,  eSub * 4,  1, eSub * 3);
        move(cta,       eCta  * 130, -eCta   * 25,  1 - eCta   * 2.0,  eCta * 7,  1, eCta * 4);
        move(scrollCue, eCue  * 24,   eCue   * 28,  1 - eCue   * 3.0,  0,         1, 0);
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
