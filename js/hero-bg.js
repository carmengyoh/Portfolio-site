/* ================================================================
   HERO BACKGROUND — "Complexity → Clarity"
   Flowing silk ribbon curves that weave from scattered origins
   and converge toward a soft focal glow, with glitter sparkles.
   ================================================================ */
(function () {
    'use strict';

    var canvas, ctx, W, H, tick = 0;
    var sparkles = [];

    var SPARKLE_COUNT = 48;
    var INTRO_TICKS   = 210;

    function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }

    /* ----------------------------------------------------------------
       Ribbon definitions — normalized 0..1 coords.
       Ribbons start scattered on the left/edges and weave toward a
       soft focal point around (0.58, 0.44), then flow past it —
       visualising many inputs becoming one clear direction.
    ---------------------------------------------------------------- */
    var RIBBONS = [
        /* Main pink sweep — boldest, sets the tone */
        { sx:0.00, sy:0.92, ex:1.00, ey:0.08,
          cp1x:0.20, cp1y:0.55, cp2x:0.58, cp2y:0.28,
          rgbD:[244,114,182], rgbL:[236,72,153],
          w:3.2, alphaD:0.72, alphaL:0.55, phase:0.0, speed:0.00075 },

        /* Lavender — crosses above */
        { sx:0.00, sy:0.55, ex:0.98, ey:0.68,
          cp1x:0.28, cp1y:0.06, cp2x:0.62, cp2y:0.80,
          rgbD:[196,132,252], rgbL:[167,80,242],
          w:2.4, alphaD:0.60, alphaL:0.45, phase:1.65, speed:0.00090 },

        /* Soft purple — wide dreamy ribbon */
        { sx:0.08, sy:1.00, ex:1.00, ey:0.28,
          cp1x:0.38, cp1y:0.85, cp2x:0.66, cp2y:0.18,
          rgbD:[167,139,250], rgbL:[139,92,246],
          w:4.5, alphaD:0.28, alphaL:0.22, phase:2.9, speed:0.00065 },

        /* Blue-indigo thin accent */
        { sx:0.00, sy:0.72, ex:0.82, ey:0.10,
          cp1x:0.22, cp1y:0.14, cp2x:0.54, cp2y:0.62,
          rgbD:[147,161,253], rgbL:[99,102,241],
          w:1.5, alphaD:0.48, alphaL:0.38, phase:0.82, speed:0.00108 },

        /* Pale rose — broad and low-key */
        { sx:0.05, sy:0.78, ex:0.92, ey:0.50,
          cp1x:0.42, cp1y:0.96, cp2x:0.70, cp2y:0.08,
          rgbD:[251,191,215], rgbL:[251,182,209],
          w:3.8, alphaD:0.22, alphaL:0.32, phase:3.5, speed:0.00058 },

        /* Warm violet — extra weave */
        { sx:0.12, sy:0.35, ex:1.00, ey:0.90,
          cp1x:0.35, cp1y:0.02, cp2x:0.72, cp2y:0.70,
          rgbD:[216,180,254], rgbL:[192,132,252],
          w:1.8, alphaD:0.38, alphaL:0.28, phase:4.2, speed:0.00082 },
    ];

    /* ----------------------------------------------------------------
       Sparkles — 4-point glitter stars
    ---------------------------------------------------------------- */
    function buildSparkles() {
        sparkles = [];
        for (var i = 0; i < SPARKLE_COUNT; i++) {
            var roll = Math.random();
            var r = roll < 0.55
                ? 1.0 + Math.random() * 1.8
                : roll < 0.85
                    ? 2.6 + Math.random() * 2.5
                    : 5.0 + Math.random() * 3.5;

            sparkles.push({
                x:         Math.random() * W,
                y:         Math.random() * H,
                r:         r,
                phase:     Math.random() * Math.PI * 2,
                speed:     0.004 + Math.random() * 0.010,
                rot:       Math.random() * Math.PI * 0.5,
                rotSpeed:  (Math.random() - 0.5) * 0.0025,
                baseAlpha: 0.30 + Math.random() * 0.60,
            });
        }
    }

    /* ----------------------------------------------------------------
       Init / resize
    ---------------------------------------------------------------- */
    function init() {
        canvas = document.getElementById('hero-bg-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        buildSparkles();
        window.addEventListener('resize', function () { resize(); buildSparkles(); });
        requestAnimationFrame(frame);
    }

    function resize() {
        W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    /* ----------------------------------------------------------------
       Draw a single ribbon as 3 overlapping strokes:
         1. Wide, very soft outer halo
         2. Medium main body
         3. Thin bright gleam on top
    ---------------------------------------------------------------- */
    function drawRibbon(r, dark) {
        var t   = tick * r.speed;
        var rgb = dark ? r.rgbD : r.rgbL;
        var a   = dark ? r.alphaD : r.alphaL;

        /* Animated control points — gentle breathing drift */
        var sx  = r.sx  * W,  sy  = r.sy  * H;
        var ex  = r.ex  * W,  ey  = r.ey  * H;
        var c1x = (r.cp1x + Math.sin(t + r.phase)         * 0.06) * W;
        var c1y = (r.cp1y + Math.cos(t + r.phase * 0.7)   * 0.08) * H;
        var c2x = (r.cp2x + Math.cos(t * 1.3 + r.phase)   * 0.05) * W;
        var c2y = (r.cp2y + Math.sin(t * 0.85 + r.phase)  * 0.07) * H;

        /* Gradient: transparent → opaque → transparent along the path */
        var grad = ctx.createLinearGradient(sx, sy, ex, ey);
        var col  = rgb[0] + ',' + rgb[1] + ',' + rgb[2];
        grad.addColorStop(0.00, 'rgba(' + col + ',0)');
        grad.addColorStop(0.12, 'rgba(' + col + ',' + (a * 0.55).toFixed(3) + ')');
        grad.addColorStop(0.45, 'rgba(' + col + ',' + a.toFixed(3) + ')');
        grad.addColorStop(0.70, 'rgba(' + col + ',' + a.toFixed(3) + ')');
        grad.addColorStop(1.00, 'rgba(' + col + ',0)');

        ctx.lineCap  = 'round';
        ctx.lineJoin = 'round';

        /* 1 — Outer halo (wide, transparent) */
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = r.w * 5.5;
        ctx.globalAlpha = 0.18;
        ctx.stroke();

        /* 2 — Main body */
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
        ctx.lineWidth   = r.w;
        ctx.globalAlpha = 1.0;
        ctx.stroke();

        /* 3 — Thin gleam on top (brightens the edge) */
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
        ctx.lineWidth   = r.w * 0.30;
        var gleam = ctx.createLinearGradient(sx, sy, ex, ey);
        gleam.addColorStop(0.00, 'rgba(255,255,255,0)');
        gleam.addColorStop(0.40, 'rgba(255,255,255,' + (dark ? 0.55 : 0.40) + ')');
        gleam.addColorStop(0.65, 'rgba(255,255,255,' + (dark ? 0.40 : 0.28) + ')');
        gleam.addColorStop(1.00, 'rgba(255,255,255,0)');
        ctx.strokeStyle = gleam;
        ctx.globalAlpha = 1.0;
        ctx.stroke();
    }

    /* ----------------------------------------------------------------
       Soft focal glow — where the paths converge (the "clarity" moment)
    ---------------------------------------------------------------- */
    function drawFocalGlow(dark) {
        var cx = 0.56 * W, cy = 0.44 * H;
        var pulse = 0.80 + 0.20 * Math.sin(tick * 0.012);
        var r1    = 55 * pulse,   r2 = 130 * pulse;

        /* Inner hot spot */
        var inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1);
        if (dark) {
            inner.addColorStop(0,   'rgba(255,240,255,0.28)');
            inner.addColorStop(0.4, 'rgba(244,114,182,0.14)');
            inner.addColorStop(1,   'rgba(0,0,0,0)');
        } else {
            inner.addColorStop(0,   'rgba(255,255,255,0.65)');
            inner.addColorStop(0.4, 'rgba(251,182,209,0.28)');
            inner.addColorStop(1,   'rgba(0,0,0,0)');
        }
        ctx.fillStyle = inner;
        ctx.fillRect(0, 0, W, H);

        /* Outer ambient bloom */
        var outer = ctx.createRadialGradient(cx, cy, r1 * 0.5, cx, cy, r2);
        if (dark) {
            outer.addColorStop(0,   'rgba(196,132,252,0.10)');
            outer.addColorStop(1,   'rgba(0,0,0,0)');
        } else {
            outer.addColorStop(0,   'rgba(216,180,254,0.22)');
            outer.addColorStop(1,   'rgba(0,0,0,0)');
        }
        ctx.fillStyle = outer;
        ctx.fillRect(0, 0, W, H);
    }

    /* ----------------------------------------------------------------
       Draw 4-point glitter sparkles
    ---------------------------------------------------------------- */
    function drawStar(cx, cy, outer, inner, rot) {
        ctx.beginPath();
        for (var i = 0; i < 8; i++) {
            var angle = i * Math.PI / 4 + rot;
            var r     = (i % 2 === 0) ? outer : inner;
            var x     = cx + Math.cos(angle) * r;
            var y     = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawSparkles(dark) {
        var rgb   = dark ? '255,255,255' : '200,80,140';
        var scale = dark ? 0.40 : 0.55;

        for (var i = 0; i < sparkles.length; i++) {
            var s     = sparkles[i];
            var pulse = 0.45 + 0.55 * Math.sin(tick * s.speed + s.phase);
            var a     = s.baseAlpha * scale * pulse;
            if (a < 0.018) continue;

            s.rot += s.rotSpeed;

            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle   = 'rgb(' + rgb + ')';

            if (s.r > 3.2) {
                ctx.shadowBlur  = s.r * 3.5;
                ctx.shadowColor = dark
                    ? 'rgba(255,200,255,' + (a * 0.8).toFixed(3) + ')'
                    : 'rgba(220,80,140,'  + (a * 0.6).toFixed(3) + ')';
            }

            drawStar(s.x, s.y, s.r, s.r * 0.11, s.rot);

            if (s.r > 2.2) {
                ctx.shadowBlur  = 0;
                ctx.globalAlpha = Math.min(1, a * 1.6);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 0.16, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    /* ----------------------------------------------------------------
       Main loop
    ---------------------------------------------------------------- */
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function frame() {
        ctx.clearRect(0, 0, W, H);
        tick++;

        var introAlpha = tick >= INTRO_TICKS ? 1 : easeOutCubic(tick / INTRO_TICKS);
        var dark       = getTheme() === 'dark';

        /* Focal glow first (behind ribbons) */
        ctx.globalAlpha = introAlpha;
        drawFocalGlow(dark);

        /* Ribbons */
        ctx.globalAlpha = introAlpha;
        for (var i = 0; i < RIBBONS.length; i++) {
            drawRibbon(RIBBONS[i], dark);
        }

        /* Sparkles on top */
        ctx.globalAlpha = introAlpha;
        drawSparkles(dark);

        ctx.globalAlpha = 1;
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
