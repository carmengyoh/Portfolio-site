/* ================================================================
   HERO BACKGROUND — glittery ✦ sparkles only, no lines.
   Sparkles are 4-point stars with tapered arms + soft glow.
   ================================================================ */
(function () {
    'use strict';

    var canvas, ctx, W, H, tick = 0;
    var sparkles = [];

    var SPARKLE_COUNT = 72;
    var INTRO_TICKS   = 200;

    function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }

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
       Sparkles — varied 4-point glitter stars scattered across the card
    ---------------------------------------------------------------- */
    function buildSparkles() {
        sparkles = [];
        for (var i = 0; i < SPARKLE_COUNT; i++) {
            /* Outer arm length — mix of tiny, small, and a few larger */
            var roll = Math.random();
            var r = roll < 0.55
                ? 1.0 + Math.random() * 2.2   /* tiny  */
                : roll < 0.85
                    ? 2.8 + Math.random() * 3.0   /* small */
                    : 5.0 + Math.random() * 4.0;  /* accent */

            sparkles.push({
                x:         (0.02 + Math.random() * 0.96) * W,
                y:         (0.02 + Math.random() * 0.96) * H,
                r:         r,
                phase:     Math.random() * Math.PI * 2,
                speed:     0.004 + Math.random() * 0.012,
                rot:       Math.random() * Math.PI * 0.5,  /* 0–90° so some are ✦ some ✧ */
                rotSpeed:  (Math.random() - 0.5) * 0.003,  /* very slow spin */
                baseAlpha: 0.25 + Math.random() * 0.65,
            });
        }
    }

    /* ----------------------------------------------------------------
       Draw one 4-point star (✦)
       outerR = arm length, innerR = waist (kept very thin for ✦ look)
    ---------------------------------------------------------------- */
    function drawStar(cx, cy, outerR, innerR, rotation) {
        ctx.beginPath();
        for (var i = 0; i < 8; i++) {
            var angle = i * Math.PI / 4 + rotation;
            var r     = (i % 2 === 0) ? outerR : innerR;
            var x     = cx + Math.cos(angle) * r;
            var y     = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else         ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    /* ----------------------------------------------------------------
       Draw sparkles
    ---------------------------------------------------------------- */
    function drawSparkles() {
        var dark  = getTheme() === 'dark';
        var rgb   = dark ? '255,255,255' : '200,80,140';
        var scale = dark ? 0.42 : 0.60;

        for (var i = 0; i < sparkles.length; i++) {
            var s = sparkles[i];
            /* Breathing pulse */
            var pulse = 0.45 + 0.55 * Math.sin(tick * s.speed + s.phase);
            var a     = s.baseAlpha * scale * pulse;
            if (a < 0.018) continue;

            /* Slowly rotate */
            s.rot += s.rotSpeed;

            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle   = 'rgb(' + rgb + ')';

            /* Soft glow for larger sparkles */
            if (s.r > 3.5) {
                ctx.shadowBlur  = s.r * 3.5;
                ctx.shadowColor = dark
                    ? 'rgba(255,220,255,' + (a * 0.7).toFixed(3) + ')'
                    : 'rgba(220,80,140,'  + (a * 0.6).toFixed(3) + ')';
            }

            var innerR = s.r * 0.12;   /* very thin waist = pointy arms */
            drawStar(s.x, s.y, s.r, innerR, s.rot);

            /* Tiny bright centre dot for sparkle "flash" effect */
            if (s.r > 2.5) {
                ctx.shadowBlur  = 0;
                ctx.globalAlpha = Math.min(1, a * 1.5);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 0.18, 0, Math.PI * 2);
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

        var introAlpha  = tick >= INTRO_TICKS ? 1 : easeOutCubic(tick / INTRO_TICKS);
        ctx.globalAlpha = introAlpha;

        drawSparkles();

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
