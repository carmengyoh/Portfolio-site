/* ================================================================
   HERO ANIMATION — silky particle flow

   ONE clean curved stream per skill (not a web of crossing lines):
   - Each skill has a single bezier "spine" running from the bright
     convergence point out to its node.
   - A dense stream of tiny particles flows along that spine, tight at
     the convergence and gently widening toward the node.
   - Particles are hot-pink at the convergence and fade into the node's
     colour along the way.
   - Additive blending makes the dense convergence glow on its own,
     giving the soft, flowing, fibre-optic look from the reference.
   ================================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------------
       CONFIG
    ---------------------------------------------------------------- */
    var CONFIG = {
        /* Bright convergence point — sits just right of the heading */
        hub: { x: 0.46, y: 0.52 },

        /* Skills fan up-and-out to the right (top → bottom order) */
        nodes: [
            { label: 'Research',                 x: 0.60, y: 0.15, color: '#f472b6', glowR: 30, coreR: 4   },
            { label: 'User Validation',          x: 0.79, y: 0.21, color: '#ec5fb0', glowR: 20, coreR: 3   },
            { label: 'Information Architecture', x: 0.85, y: 0.35, color: '#c084fc', glowR: 20, coreR: 3   },
            { label: 'Product Strategy',         x: 0.85, y: 0.49, color: '#a78bfa', glowR: 20, coreR: 3   },
            { label: 'Prototyping',              x: 0.81, y: 0.62, color: '#818cf8', glowR: 20, coreR: 3   },
            { label: 'Ambiguity → Clarity',      x: 0.73, y: 0.72, color: '#a78bfa', glowR: 36, coreR: 4.5 },
        ],

        hubColor:         [255, 95, 195],  /* soft pink near the convergence */
        particlesPerNode: 150,             /* dense stream = silky look */
        flowSpeed:        0.0006,          /* base travel speed — slow, calm drift */

        starCount:    110,
        starMaxAlpha: 0.38,
    };

    /* Top-to-bottom staggered reveal on load */
    var INTRO_DELAYS   = [16, 30, 44, 58, 72, 86];
    var INTRO_DURATION = 52;

    /* ----------------------------------------------------------------
       State
    ---------------------------------------------------------------- */
    var canvas, ctx, W, H, tick = 0;
    var stars = [], particles = [], spines = [];
    var introProgress = [0, 0, 0, 0, 0, 0];
    var introComplete = false;

    /* ----------------------------------------------------------------
       Init / resize
    ---------------------------------------------------------------- */
    function init() {
        canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        CONFIG.nodes.forEach(function (n) { n.rgb = hexToRgb(n.color); });
        resize();
        buildStars();
        buildSpines();
        buildParticles();
        window.addEventListener('resize', onResize);
        requestAnimationFrame(frame);
    }

    function onResize() { resize(); buildStars(); buildSpines(); }

    function resize() {
        W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    /* ----------------------------------------------------------------
       Helpers
    ---------------------------------------------------------------- */
    function px(f) { return f * W; }
    function py(f) { return f * H; }
    function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }
    function hexToRgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
    function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')'; }
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    /* roughly-gaussian value in [-1, 1], denser in the middle */
    function gaussian() { return ((Math.random() + Math.random() + Math.random()) / 3) * 2 - 1; }

    /* ----------------------------------------------------------------
       Intro stagger
    ---------------------------------------------------------------- */
    function updateIntro() {
        if (introComplete) return;
        var all = true;
        for (var i = 0; i < CONFIG.nodes.length; i++) {
            if (tick < INTRO_DELAYS[i]) { all = false; continue; }
            introProgress[i] = Math.min(1, (tick - INTRO_DELAYS[i]) / INTRO_DURATION);
            if (introProgress[i] < 1) all = false;
        }
        if (all) introComplete = true;
    }

    /* ----------------------------------------------------------------
       Stars
    ---------------------------------------------------------------- */
    function buildStars() {
        stars = [];
        for (var i = 0; i < CONFIG.starCount; i++) {
            stars.push({
                x: Math.random() * W, y: Math.random() * H,
                r: 0.2 + Math.random() * 1.2,
                base: Math.random() * CONFIG.starMaxAlpha,
                phase: Math.random() * Math.PI * 2,
                spd: 0.005 + Math.random() * 0.010,
            });
        }
    }

    function drawStars() {
        if (getTheme() === 'light') return;
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var a = s.base + Math.sin(tick * s.spd + s.phase) * 0.11;
            if (a <= 0) continue;
            ctx.fillStyle = 'rgba(255,255,255,' + a + ')';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /* ----------------------------------------------------------------
       Spines — ONE bezier per node, from hub → node.
       Control points give each stream its own graceful sweep and make
       them separate cleanly right out of the convergence (so the
       streams never tangle into a web).
    ---------------------------------------------------------------- */
    function buildSpines() {
        var hx = px(CONFIG.hub.x), hy = py(CONFIG.hub.y);
        spines = CONFIG.nodes.map(function (n) {
            var nx = px(n.x), ny = py(n.y);
            var dx = nx - hx, dy = ny - hy;
            return {
                x0: hx,            y0: hy,
                x1: hx + dx * 0.45, y1: hy + dy * 0.22,
                x2: nx - dx * 0.22, y2: ny - dy * 0.32,
                x3: nx,            y3: ny,
            };
        });
    }

    function spineAt(s, t) {
        var m = 1 - t;
        return {
            x: m*m*m*s.x0 + 3*m*m*t*s.x1 + 3*m*t*t*s.x2 + t*t*t*s.x3,
            y: m*m*m*s.y0 + 3*m*m*t*s.y1 + 3*m*t*t*s.y2 + t*t*t*s.y3,
        };
    }

    function spineTangent(s, t) {
        var m = 1 - t;
        var dx = 3*m*m*(s.x1-s.x0) + 6*m*t*(s.x2-s.x1) + 3*t*t*(s.x3-s.x2);
        var dy = 3*m*m*(s.y1-s.y0) + 6*m*t*(s.y2-s.y1) + 3*t*t*(s.y3-s.y2);
        var l = Math.sqrt(dx*dx + dy*dy) || 1;
        return { x: dx / l, y: dy / l };
    }

    /* ----------------------------------------------------------------
       Particles — the flowing streams
    ---------------------------------------------------------------- */
    function buildParticles() {
        particles = [];
        CONFIG.nodes.forEach(function (_, ni) {
            for (var i = 0; i < CONFIG.particlesPerNode; i++) {
                particles.push({
                    ni:    ni,
                    t:     Math.random(),
                    off:   gaussian(),
                    size:  0.4 + Math.random() * 1.2,
                    alpha: 0.35 + Math.random() * 0.60,
                    speed: CONFIG.flowSpeed * (0.6 + Math.random() * 0.9),
                });
            }
        });
    }

    function drawParticles() {
        ctx.globalCompositeOperation = 'lighter';   /* additive glow */
        var hub = CONFIG.hubColor;

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var prog = introComplete ? 1 : introProgress[p.ni];
            if (prog <= 0) continue;

            p.t += p.speed;
            if (p.t >= 1) { p.t -= 1; p.off = gaussian(); }   /* recycle at hub */

            var s = spines[p.ni];
            if (!s) continue;

            var t  = p.t;
            var sp = spineAt(s, t);
            var tg = spineTangent(s, t);

            /* Stream width: tight at the hub, gently wider toward the node */
            var w = 2 + 8 * t;
            var o = p.off * w;
            var x = sp.x - tg.y * o;
            var y = sp.y + tg.x * o;

            /* Materialise from nothing at the hub (long, soft fade-in so the
               start stays semi-transparent), fade out just before the node */
            var a;
            if (t < 0.30)      a = t / 0.30;
            else if (t > 0.86) a = (1 - t) / 0.14;
            else               a = 1;
            a *= p.alpha * (prog < 1 ? easeOutCubic(prog) : 1);
            if (a < 0.02) continue;

            /* Colour: soft pink near the hub → node colour toward the node */
            var n  = CONFIG.nodes[p.ni].rgb;
            var ct = Math.pow(t, 0.85);
            var r  = (hub[0] + (n[0] - hub[0]) * ct) | 0;
            var g  = (hub[1] + (n[1] - hub[1]) * ct) | 0;
            var b  = (hub[2] + (n[2] - hub[2]) * ct) | 0;

            /* Glassmorphic particle: frosted translucent halo + frosted body
               + a brighter, whitened glass core. Layered soft fills (additive)
               read as a frosted glass bead rather than a flat dot. */
            var sz = p.size;
            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a * 0.18).toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(x, y, sz * 3.6, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a * 0.38).toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(x, y, sz * 1.8, 0, Math.PI * 2); ctx.fill();

            var cr = (r + (255 - r) * 0.62) | 0;
            var cg = (g + (255 - g) * 0.62) | 0;
            var cb = (b + (255 - b) * 0.62) | 0;
            ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (a * 0.85).toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(x, y, sz * 0.72, 0, Math.PI * 2); ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    /* ----------------------------------------------------------------
       Nodes + convergence glow
    ---------------------------------------------------------------- */
    function drawGlowDot(x, y, rgb, coreR, glowR) {
        var g1 = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        g1.addColorStop(0, rgba(rgb, 0.30)); g1.addColorStop(0.4, rgba(rgb, 0.10)); g1.addColorStop(1, rgba(rgb, 0));
        ctx.fillStyle = g1; ctx.beginPath(); ctx.arc(x, y, glowR, 0, Math.PI * 2); ctx.fill();

        var g2 = ctx.createRadialGradient(x, y, 0, x, y, coreR * 3.5);
        g2.addColorStop(0, rgba(rgb, 0.70)); g2.addColorStop(1, rgba(rgb, 0));
        ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x, y, coreR * 3.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = rgba(rgb, 0.95); ctx.beginPath(); ctx.arc(x, y, coreR, 0, Math.PI * 2); ctx.fill();
    }

    function drawNodes() {
        var labelColor = getTheme() === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(10,10,10,0.62)';

        /* No bright dot at the convergence — the streams fade to nothing
           there, so the start stays semi-transparent. Just a faint whisper
           of warmth so it doesn't read as a hard cut-off. */
        var hx = px(CONFIG.hub.x), hy = py(CONFIG.hub.y);
        var hp = 0.85 + Math.sin(tick * 0.04) * 0.15;
        var hubA = introComplete ? 1 : introProgress[0];
        var og = ctx.createRadialGradient(hx, hy, 0, hx, hy, 90 * hp);
        og.addColorStop(0, 'rgba(235,120,205,' + (0.04 * hubA).toFixed(3) + ')');
        og.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = og; ctx.beginPath(); ctx.arc(hx, hy, 90 * hp, 0, Math.PI * 2); ctx.fill();

        CONFIG.nodes.forEach(function (n, i) {
            var prog = introComplete ? 1 : introProgress[i];
            var na   = prog < 0.70 ? 0 : (prog - 0.70) / 0.30;   /* node appears late in its intro */
            if (na <= 0) return;

            var nx = px(n.x), ny = py(n.y);
            var pulse = 0.88 + Math.sin(tick * 0.022 + i * 1.25) * 0.12;

            ctx.save();
            ctx.globalAlpha = na;
            drawGlowDot(nx, ny, n.rgb, n.coreR * pulse, n.glowR * pulse);

            var ll = n.label.length;
            var fs = ll > 20 ? '8px' : ll > 14 ? '9px' : '10px';
            ctx.fillStyle     = labelColor;
            ctx.font          = '500 ' + fs + ' Inter, system-ui, sans-serif';
            ctx.letterSpacing = ll > 14 ? '1.5px' : '2.5px';
            ctx.fillText(n.label.toUpperCase(), nx + n.coreR + 12, ny + 4);
            ctx.restore();
        });
    }

    /* ----------------------------------------------------------------
       Main loop
    ---------------------------------------------------------------- */
    function frame() {
        ctx.clearRect(0, 0, W, H);
        tick++;
        updateIntro();
        drawStars();
        drawParticles();
        drawNodes();
        requestAnimationFrame(frame);
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
