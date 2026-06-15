/* ================================================================
   HERO BACKGROUND — ultra-delicate glassmorphic threads
   Barely-visible silk threads + tiny traveling light beads
   + glitter sparkles. Threads are hair-thin, near-transparent.
   ================================================================ */
(function () {
    'use strict';

    var canvas, ctx, W, H, tick = 0;
    var sparkles = [];

    var SPARKLE_COUNT = 44;
    var INTRO_TICKS   = 200;

    function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }

    /* ----------------------------------------------------------------
       Thread definitions — thin, ghostly, barely-there
       amp & speed kept low so movement is graceful not snaky
    ---------------------------------------------------------------- */
    var THREADS = [
        { sx:0.00, sy:0.90, ex:1.00, ey:0.08,
          cp1x:0.22, cp1y:0.52, cp2x:0.58, cp2y:0.30,
          rgbD:[244,114,182], rgbL:[219,39,119],
          phase:0.0,  speed:0.007, amp:0.035,
          travelT:0.05, travelSpd:0.0028 },

        { sx:0.00, sy:0.55, ex:0.98, ey:0.70,
          cp1x:0.26, cp1y:0.08, cp2x:0.60, cp2y:0.78,
          rgbD:[196,132,252], rgbL:[147,51,234],
          phase:1.65, speed:0.006, amp:0.040,
          travelT:0.38, travelSpd:0.0035 },

        { sx:0.08, sy:1.00, ex:1.00, ey:0.25,
          cp1x:0.36, cp1y:0.82, cp2x:0.64, cp2y:0.20,
          rgbD:[167,139,250], rgbL:[124,58,237],
          phase:2.9,  speed:0.005, amp:0.030,
          travelT:0.70, travelSpd:0.0022 },

        { sx:0.00, sy:0.70, ex:0.85, ey:0.12,
          cp1x:0.20, cp1y:0.12, cp2x:0.52, cp2y:0.60,
          rgbD:[147,161,253], rgbL:[99,102,241],
          phase:0.82, speed:0.008, amp:0.038,
          travelT:0.20, travelSpd:0.0040 },

        { sx:0.05, sy:0.80, ex:0.94, ey:0.48,
          cp1x:0.40, cp1y:0.95, cp2x:0.68, cp2y:0.10,
          rgbD:[251,191,215], rgbL:[236,72,153],
          phase:3.5,  speed:0.005, amp:0.032,
          travelT:0.55, travelSpd:0.0030 },

        { sx:0.10, sy:0.38, ex:1.00, ey:0.88,
          cp1x:0.32, cp1y:0.02, cp2x:0.70, cp2y:0.68,
          rgbD:[216,180,254], rgbL:[168,85,247],
          phase:4.2,  speed:0.006, amp:0.036,
          travelT:0.82, travelSpd:0.0025 },
    ];

    /* ----------------------------------------------------------------
       Sample a cubic bezier at parameter t
    ---------------------------------------------------------------- */
    function bezierAt(sx, sy, c1x, c1y, c2x, c2y, ex, ey, t) {
        t = ((t % 1) + 1) % 1;
        var mt = 1 - t;
        return {
            x: mt*mt*mt*sx + 3*mt*mt*t*c1x + 3*mt*t*t*c2x + t*t*t*ex,
            y: mt*mt*mt*sy + 3*mt*mt*t*c1y + 3*mt*t*t*c2y + t*t*t*ey,
        };
    }

    /* ----------------------------------------------------------------
       Compute live control points (gentle drift)
    ---------------------------------------------------------------- */
    function threadPoints(r) {
        var t = tick * r.speed;
        return {
            sx:  r.sx  * W,  sy:  r.sy  * H,
            ex:  r.ex  * W,  ey:  r.ey  * H,
            c1x: (r.cp1x + Math.sin(t + r.phase)        * r.amp) * W,
            c1y: (r.cp1y + Math.cos(t + r.phase * 0.7)  * r.amp) * H,
            c2x: (r.cp2x + Math.cos(t * 1.2 + r.phase)  * r.amp) * W,
            c2y: (r.cp2y + Math.sin(t * 0.9 + r.phase)  * r.amp) * H,
        };
    }

    /* ----------------------------------------------------------------
       Draw one hair-thin thread — single stroke, fade at ends
    ---------------------------------------------------------------- */
    function drawThread(r, p, dark) {
        var rgb  = (dark ? r.rgbD : r.rgbL);
        var col  = rgb[0] + ',' + rgb[1] + ',' + rgb[2];
        /* dark: very faint; light: slightly more visible against white */
        var peak = dark ? 0.10 : 0.14;

        var grad = ctx.createLinearGradient(p.sx, p.sy, p.ex, p.ey);
        grad.addColorStop(0.00, 'rgba(' + col + ',0)');
        grad.addColorStop(0.15, 'rgba(' + col + ',' + (peak * 0.6).toFixed(3) + ')');
        grad.addColorStop(0.50, 'rgba(' + col + ',' + peak.toFixed(3) + ')');
        grad.addColorStop(0.82, 'rgba(' + col + ',' + (peak * 0.5).toFixed(3) + ')');
        grad.addColorStop(1.00, 'rgba(' + col + ',0)');

        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.bezierCurveTo(p.c1x, p.c1y, p.c2x, p.c2y, p.ex, p.ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 0.75;
        ctx.lineCap     = 'round';
        ctx.globalAlpha = 1.0;
        ctx.stroke();
    }

    /* ----------------------------------------------------------------
       Traveling bead — tiny glowing mote that slides along the thread
    ---------------------------------------------------------------- */
    function drawBead(r, p, dark) {
        r.travelT = (r.travelT + r.travelSpd) % 1.0;

        var STEPS     = 14;
        var TRAIL_LEN = 0.10;
        var rgb       = dark ? r.rgbD : r.rgbL;

        for (var i = 0; i <= STEPS; i++) {
            var frac = i / STEPS;
            var t    = r.travelT - (1 - frac) * TRAIL_LEN;
            var pt   = bezierAt(p.sx, p.sy, p.c1x, p.c1y, p.c2x, p.c2y, p.ex, p.ey, t);
            var a    = Math.pow(frac, 1.8) * 0.85;
            var dotR = frac * 2.0 + 0.2;
            var isHead = i === STEPS;

            ctx.save();
            ctx.globalAlpha = a;

            if (isHead) {
                ctx.shadowBlur  = 10;
                ctx.shadowColor = 'rgba(255,255,255,0.85)';
                ctx.fillStyle   = '#ffffff';
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, dotR, 0, Math.PI * 2);
                ctx.fill();
            } else if (frac > 0.5) {
                ctx.shadowBlur  = 4;
                ctx.shadowColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.6)';
                ctx.fillStyle   = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, dotR * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    /* ----------------------------------------------------------------
       Soft focal glow — pulsing convergence point
    ---------------------------------------------------------------- */
    function drawFocalGlow(dark) {
        var cx    = 0.55 * W, cy = 0.45 * H;
        var pulse = 0.85 + 0.15 * Math.sin(tick * 0.010);

        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110 * pulse);
        if (dark) {
            g.addColorStop(0,   'rgba(255,235,255,0.18)');
            g.addColorStop(0.3, 'rgba(244,114,182,0.08)');
            g.addColorStop(1,   'rgba(0,0,0,0)');
        } else {
            g.addColorStop(0,   'rgba(255,255,255,0.50)');
            g.addColorStop(0.3, 'rgba(251,182,209,0.16)');
            g.addColorStop(1,   'rgba(0,0,0,0)');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
    }

    /* ----------------------------------------------------------------
       Glitter ✦ sparkles
    ---------------------------------------------------------------- */
    function buildSparkles() {
        sparkles = [];
        for (var i = 0; i < SPARKLE_COUNT; i++) {
            var roll = Math.random();
            var r = roll < 0.55 ? 1.0 + Math.random() * 1.6
                  : roll < 0.85 ? 2.4 + Math.random() * 2.2
                  :                4.5 + Math.random() * 2.8;
            sparkles.push({
                x: Math.random() * W, y: Math.random() * H,
                r: r,
                phase:    Math.random() * Math.PI * 2,
                speed:    0.005 + Math.random() * 0.010,
                rot:      Math.random() * Math.PI * 0.5,
                rotSpeed: (Math.random() - 0.5) * 0.002,
                baseAlpha: 0.28 + Math.random() * 0.55,
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
        var scale = dark ? 0.36 : 0.50;
        for (var i = 0; i < sparkles.length; i++) {
            var s = sparkles[i];
            var a = s.baseAlpha * scale * (0.4 + 0.6 * Math.sin(tick * s.speed + s.phase));
            if (a < 0.015) continue;
            s.rot += s.rotSpeed;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle   = 'rgb(' + rgb + ')';
            if (s.r > 3) {
                ctx.shadowBlur  = s.r * 3;
                ctx.shadowColor = dark ? 'rgba(255,200,255,' + (a*0.8).toFixed(3) + ')'
                                       : 'rgba(220,80,140,'  + (a*0.6).toFixed(3) + ')';
            }
            drawStar(s.x, s.y, s.r, s.r * 0.11, s.rot);
            if (s.r > 2) {
                ctx.shadowBlur  = 0;
                ctx.globalAlpha = Math.min(1, a * 1.5);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 0.15, 0, Math.PI * 2);
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
        buildSparkles();
        window.addEventListener('resize', function () { resize(); buildSparkles(); });
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

        drawFocalGlow(dark);

        for (var i = 0; i < THREADS.length; i++) {
            var p = threadPoints(THREADS[i]);
            drawThread(THREADS[i], p, dark);
        }

        for (var j = 0; j < THREADS.length; j++) {
            var q = threadPoints(THREADS[j]);
            drawBead(THREADS[j], q, dark);
        }

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
