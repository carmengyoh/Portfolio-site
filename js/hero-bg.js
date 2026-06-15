/* ================================================================
   HERO BACKGROUND — flowing sparkle lines + twinkling particles
   Sits as a canvas layer above the CSS gradient blobs.
   ================================================================ */
(function () {
    'use strict';

    var canvas, ctx, W, H, tick = 0;
    var lines    = [];
    var sparkles = [];

    var LINE_COUNT    = 4;
    var SPARKLE_COUNT = 110;
    var INTRO_TICKS   = 220;  /* ~3.7 s at 60 fps — slow fade-in from nothing */

    function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }

    /* ----------------------------------------------------------------
       Init / resize
    ---------------------------------------------------------------- */
    function init() {
        canvas = document.getElementById('hero-bg-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        build();
        window.addEventListener('resize', function () { resize(); build(); });
        requestAnimationFrame(frame);
    }

    function resize() {
        W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    function build() {
        buildLines();
        buildSparkles();
    }

    /* ----------------------------------------------------------------
       Lines — 4 bezier curves flowing bottom-left → upper-right,
       control points drift slowly for a breathing/undulation effect.
    ---------------------------------------------------------------- */
    function buildLines() {
        /* All lines stay in the RIGHT half (sx >= 0.52) so they
           never cross into the heading column on the left.        */
        lines = [
            /* sx    sy    ex    ey    cp1x  cp1y  cp2x  cp2y */
            { sx:0.52, sy:0.82, ex:0.98, ey:0.18, cp1x:0.62, cp1y:0.30, cp2x:0.78, cp2y:0.52, phase1:0.00, phase2:1.20, speed:0.0022, alpha:0.22 },
            { sx:0.55, sy:0.68, ex:0.96, ey:0.30, cp1x:0.65, cp1y:0.16, cp2x:0.80, cp2y:0.54, phase1:1.40, phase2:2.60, speed:0.0018, alpha:0.16 },
            { sx:0.58, sy:0.90, ex:1.00, ey:0.44, cp1x:0.70, cp1y:0.42, cp2x:0.84, cp2y:0.28, phase1:2.80, phase2:0.40, speed:0.0025, alpha:0.13 },
            { sx:0.50, sy:0.55, ex:0.94, ey:0.12, cp1x:0.60, cp1y:0.06, cp2x:0.76, cp2y:0.36, phase1:0.70, phase2:3.50, speed:0.0020, alpha:0.17 },
        ];
    }

    /* ----------------------------------------------------------------
       Sparkles — mix of tiny dots and cross-star shapes.
       Concentrated in the right ~60 % where the gradient lives.
    ---------------------------------------------------------------- */
    function buildSparkles() {
        sparkles = [];
        for (var i = 0; i < SPARKLE_COUNT; i++) {
            var isStar = Math.random() < 0.28;
            sparkles.push({
                x:         (0.50 + Math.random() * 0.50) * W,  /* right half only */
                y:         (0.02 + Math.random() * 0.96) * H,
                r:         isStar ? (1.2 + Math.random() * 2.0) : (0.3 + Math.random() * 1.4),
                phase:     Math.random() * Math.PI * 2,
                speed:     0.006 + Math.random() * 0.016,
                baseAlpha: isStar ? (0.30 + Math.random() * 0.45) : (0.10 + Math.random() * 0.30),
                isStar:    isStar,
            });
        }
    }

    /* ----------------------------------------------------------------
       Drawing — lines
       Dark:  white strokes, low opacity
       Light: muted pink strokes so they show against the pale bg
    ---------------------------------------------------------------- */
    function drawLines() {
        var dark  = getTheme() === 'dark';
        var rgb   = dark ? '255,255,255' : '180,70,130';
        /* dark mode: dial back; light mode: a little stronger */
        var scale = dark ? 0.40 : 0.90;

        for (var i = 0; i < lines.length; i++) {
            var l   = lines[i];
            var t   = tick * l.speed;
            var sx  = l.sx  * W,  sy  = l.sy  * H;
            var ex  = l.ex  * W,  ey  = l.ey  * H;
            var c1x = l.cp1x * W;
            var c1y = (l.cp1y + Math.sin(t + l.phase1) * 0.07) * H;
            var c2x = l.cp2x * W;
            var c2y = (l.cp2y + Math.cos(t + l.phase2) * 0.05) * H;
            var a   = l.alpha * scale;

            var grad = ctx.createLinearGradient(sx, sy, ex, ey);
            grad.addColorStop(0,    'rgba(' + rgb + ',0)');
            grad.addColorStop(0.15, 'rgba(' + rgb + ',' + (a * 0.6).toFixed(3) + ')');
            grad.addColorStop(0.55, 'rgba(' + rgb + ',' + a.toFixed(3) + ')');
            grad.addColorStop(0.85, 'rgba(' + rgb + ',' + (a * 0.7).toFixed(3) + ')');
            grad.addColorStop(1,    'rgba(' + rgb + ',0)');

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
            ctx.strokeStyle = grad;
            ctx.lineWidth   = 0.75;
            ctx.stroke();
        }
    }

    /* ----------------------------------------------------------------
       Drawing — sparkles
       Dark:  white, half-strength so they don't overwhelm
       Light: muted pink so they're visible against pale background
    ---------------------------------------------------------------- */
    function drawSparkles() {
        var dark   = getTheme() === 'dark';
        var color  = dark ? '255,255,255' : '185,65,125';
        /* dark → pull intensity right back; light → also subtle */
        var scale  = dark ? 0.38 : 0.55;

        for (var i = 0; i < sparkles.length; i++) {
            var s = sparkles[i];
            var a = s.baseAlpha * scale * (0.45 + 0.55 * Math.sin(tick * s.speed + s.phase));
            if (a < 0.015) continue;

            ctx.save();
            ctx.globalAlpha = a;

            if (s.isStar) {
                var arm  = s.r * 2.8;
                var arm2 = arm * 0.52;

                ctx.strokeStyle = 'rgb(' + color + ')';
                ctx.lineWidth   = 0.65;
                ctx.lineCap     = 'round';

                ctx.beginPath();
                ctx.moveTo(s.x - arm, s.y); ctx.lineTo(s.x + arm, s.y);
                ctx.moveTo(s.x, s.y - arm); ctx.lineTo(s.x, s.y + arm);
                ctx.stroke();

                ctx.globalAlpha = a * 0.5;
                ctx.lineWidth   = 0.45;
                ctx.beginPath();
                ctx.moveTo(s.x - arm2, s.y - arm2); ctx.lineTo(s.x + arm2, s.y + arm2);
                ctx.moveTo(s.x + arm2, s.y - arm2); ctx.lineTo(s.x - arm2, s.y + arm2);
                ctx.stroke();

                ctx.globalAlpha = a * 0.9;
                ctx.fillStyle   = 'rgb(' + color + ')';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 0.38, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = 'rgb(' + color + ')';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
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

        /* Global intro fade: 0 → 1 over INTRO_TICKS frames */
        var introAlpha = tick >= INTRO_TICKS ? 1 : easeOutCubic(tick / INTRO_TICKS);
        ctx.globalAlpha = introAlpha;

        drawLines();
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
