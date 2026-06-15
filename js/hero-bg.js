/* ================================================================
   HERO BACKGROUND — soft white cloud wisps drifting over the
   CSS gradient blobs, plus subtle glitter sparkles.
   No lines, no threads, no beads.
   ================================================================ */
(function () {
    'use strict';

    var canvas, ctx, W, H, tick = 0;
    var clouds   = [];
    var sparkles = [];

    var CLOUD_COUNT   = 7;
    var SPARKLE_COUNT = 38;
    var INTRO_TICKS   = 240;

    function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }

    /* ----------------------------------------------------------------
       Clouds — soft radial white blobs that drift slowly
    ---------------------------------------------------------------- */
    function buildClouds() {
        clouds = [];
        for (var i = 0; i < CLOUD_COUNT; i++) {
            clouds.push({
                x:     Math.random() * W,
                y:     Math.random() * H,
                r:     90 + Math.random() * 130,
                vx:    (Math.random() - 0.5) * 0.22,
                vy:    (Math.random() - 0.5) * 0.14,
                alpha: 0.06 + Math.random() * 0.09,  /* 6–15 % peak */
                phase: Math.random() * Math.PI * 2,
                breathSpeed: 0.003 + Math.random() * 0.004,
            });
        }
    }

    function drawClouds() {
        for (var i = 0; i < clouds.length; i++) {
            var c = clouds[i];

            /* Drift */
            c.x += c.vx;
            c.y += c.vy;

            /* Wrap */
            if (c.x < -c.r)    c.x = W + c.r;
            if (c.x > W + c.r) c.x = -c.r;
            if (c.y < -c.r)    c.y = H + c.r;
            if (c.y > H + c.r) c.y = -c.r;

            /* Gentle breathing */
            var pulse = 0.65 + 0.35 * Math.sin(tick * c.breathSpeed + c.phase);
            var a     = c.alpha * pulse;

            var g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
            g.addColorStop(0,    'rgba(255,255,255,' + (a).toFixed(3)        + ')');
            g.addColorStop(0.35, 'rgba(255,255,255,' + (a * 0.55).toFixed(3) + ')');
            g.addColorStop(0.70, 'rgba(255,255,255,' + (a * 0.18).toFixed(3) + ')');
            g.addColorStop(1,    'rgba(255,255,255,0)');

            ctx.save();
            ctx.globalAlpha = 1;
            ctx.fillStyle   = g;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    /* ----------------------------------------------------------------
       Glitter ✦ sparkles — subtle, on top of the clouds
    ---------------------------------------------------------------- */
    function buildSparkles() {
        sparkles = [];
        for (var i = 0; i < SPARKLE_COUNT; i++) {
            var roll = Math.random();
            var r = roll < 0.60 ? 0.8 + Math.random() * 1.4
                  : roll < 0.88 ? 2.0 + Math.random() * 1.8
                  :                3.8 + Math.random() * 2.2;
            sparkles.push({
                x:        Math.random() * W,
                y:        Math.random() * H,
                r:        r,
                phase:    Math.random() * Math.PI * 2,
                speed:    0.004 + Math.random() * 0.009,
                rot:      Math.random() * Math.PI * 0.5,
                rotSpeed: (Math.random() - 0.5) * 0.0018,
                alpha:    0.22 + Math.random() * 0.50,
            });
        }
    }

    function drawStar(cx, cy, outer, inner, rot) {
        ctx.beginPath();
        for (var i = 0; i < 8; i++) {
            var ang = i * Math.PI / 4 + rot;
            var rv  = (i % 2 === 0) ? outer : inner;
            if (i === 0) ctx.moveTo(cx + Math.cos(ang)*rv, cy + Math.sin(ang)*rv);
            else         ctx.lineTo(cx + Math.cos(ang)*rv, cy + Math.sin(ang)*rv);
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawSparkles(dark) {
        var rgb   = dark ? '255,255,255' : '200,80,140';
        var scale = dark ? 0.32 : 0.45;
        for (var i = 0; i < sparkles.length; i++) {
            var s = sparkles[i];
            var a = s.alpha * scale * (0.38 + 0.62 * Math.sin(tick * s.speed + s.phase));
            if (a < 0.012) continue;
            s.rot += s.rotSpeed;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle   = 'rgb(' + rgb + ')';
            if (s.r > 2.8) {
                ctx.shadowBlur  = s.r * 3;
                ctx.shadowColor = dark ? 'rgba(255,210,255,' + (a*0.8).toFixed(3) + ')'
                                       : 'rgba(210,70,130,'  + (a*0.6).toFixed(3) + ')';
            }
            drawStar(s.x, s.y, s.r, s.r * 0.11, s.rot);
            if (s.r > 1.8) {
                ctx.shadowBlur  = 0;
                ctx.globalAlpha = Math.min(1, a * 1.5);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 0.14, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
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
        buildClouds();
        buildSparkles();
        window.addEventListener('resize', function () {
            resize();
            buildClouds();
            buildSparkles();
        });
        requestAnimationFrame(frame);
    }

    function resize() {
        W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    /* ----------------------------------------------------------------
       Main loop
    ---------------------------------------------------------------- */
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function frame() {
        ctx.clearRect(0, 0, W, H);
        tick++;
        var intro = tick >= INTRO_TICKS ? 1 : easeOutCubic(tick / INTRO_TICKS);
        var dark  = getTheme() === 'dark';

        ctx.globalAlpha = intro;
        drawClouds();
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
