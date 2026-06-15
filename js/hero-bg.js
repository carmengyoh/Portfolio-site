/* ================================================================
   HERO BACKGROUND — converging light threads + glitter sparkles
   Straight lines radiate from scattered edges toward a focal
   "clarity" point. Hair-thin, near-invisible, glassmorphic.
   ================================================================ */
(function () {
    'use strict';

    var canvas, ctx, W, H, tick = 0;
    var sparkles = [];

    var SPARKLE_COUNT = 48;
    var INTRO_TICKS   = 200;

    function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }

    /* ----------------------------------------------------------------
       Thread definitions — all straight lines converging toward
       a soft focal point at roughly (0.60, 0.42).
       Each line starts at a scattered edge position.
    ---------------------------------------------------------------- */
    var THREADS = [
        { x1:0.00, y1:0.95, rgbD:[244,114,182], rgbL:[219,39,119],  phase:0.0  },
        { x1:0.00, y1:0.70, rgbD:[196,132,252], rgbL:[147,51,234],  phase:0.8  },
        { x1:0.00, y1:0.48, rgbD:[216,180,254], rgbL:[168,85,247],  phase:1.6  },
        { x1:0.00, y1:0.25, rgbD:[167,139,250], rgbL:[124,58,237],  phase:2.4  },
        { x1:0.10, y1:0.00, rgbD:[244,114,182], rgbL:[219,39,119],  phase:3.2  },
        { x1:0.30, y1:0.00, rgbD:[196,132,252], rgbL:[147,51,234],  phase:0.4  },
        { x1:0.55, y1:0.00, rgbD:[167,139,250], rgbL:[168,85,247],  phase:1.2  },
        { x1:0.10, y1:1.00, rgbD:[251,191,215], rgbL:[236,72,153],  phase:2.0  },
        { x1:0.35, y1:1.00, rgbD:[216,180,254], rgbL:[124,58,237],  phase:2.8  },
    ];

    /* Focal convergence point — threads aim here */
    var FX = 0.60, FY = 0.42;

    /* ----------------------------------------------------------------
       Build sparkles
    ---------------------------------------------------------------- */
    function buildSparkles() {
        sparkles = [];
        for (var i = 0; i < SPARKLE_COUNT; i++) {
            var roll = Math.random();
            var r = roll < 0.55 ? 0.9 + Math.random() * 1.5
                  : roll < 0.85 ? 2.2 + Math.random() * 2.0
                  :                4.0 + Math.random() * 2.5;
            sparkles.push({
                x:        Math.random() * W,
                y:        Math.random() * H,
                r:        r,
                phase:    Math.random() * Math.PI * 2,
                speed:    0.005 + Math.random() * 0.010,
                rot:      Math.random() * Math.PI * 0.5,
                rotSpeed: (Math.random() - 0.5) * 0.002,
                alpha:    0.25 + Math.random() * 0.55,
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
       Draw all threads — hair-thin, fading gradient, breathing alpha
    ---------------------------------------------------------------- */
    function drawThreads(dark) {
        for (var i = 0; i < THREADS.length; i++) {
            var th  = THREADS[i];
            var rgb = dark ? th.rgbD : th.rgbL;
            var col = rgb[0] + ',' + rgb[1] + ',' + rgb[2];

            var x1 = th.x1 * W,  y1 = th.y1 * H;
            var x2 = FX    * W,  y2 = FY    * H;

            /* Each thread breathes gently at its own rate */
            var breath = 0.55 + 0.45 * Math.sin(tick * 0.008 + th.phase);
            var peak   = dark ? 0.13 : 0.18;
            var a      = peak * breath;

            var grad = ctx.createLinearGradient(x1, y1, x2, y2);
            grad.addColorStop(0.00, 'rgba(' + col + ',0)');
            grad.addColorStop(0.20, 'rgba(' + col + ',' + (a * 0.5).toFixed(3) + ')');
            grad.addColorStop(0.65, 'rgba(' + col + ',' + a.toFixed(3) + ')');
            grad.addColorStop(1.00, 'rgba(' + col + ',0)');

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = grad;
            ctx.lineWidth   = 0.6;
            ctx.lineCap     = 'round';
            ctx.globalAlpha = 1.0;
            ctx.stroke();
        }
    }

    /* ----------------------------------------------------------------
       Draw traveling bead on each thread — tiny mote of light
    ---------------------------------------------------------------- */
    /* Store travel state on thread objects */
    (function seedTravel() {
        var speeds = [0.0030, 0.0042, 0.0026, 0.0038, 0.0050,
                      0.0033, 0.0045, 0.0028, 0.0040];
        for (var i = 0; i < THREADS.length; i++) {
            THREADS[i].travelT   = Math.random();
            THREADS[i].travelSpd = speeds[i] || 0.0035;
        }
    })();

    function drawBeads(dark) {
        for (var i = 0; i < THREADS.length; i++) {
            var th  = THREADS[i];
            var rgb = dark ? th.rgbD : th.rgbL;

            th.travelT = (th.travelT + th.travelSpd) % 1.0;

            var x1 = th.x1 * W,  y1 = th.y1 * H;
            var x2 = FX    * W,  y2 = FY    * H;

            var STEPS     = 12;
            var TRAIL_LEN = 0.09;

            for (var s = 0; s <= STEPS; s++) {
                var frac = s / STEPS;
                var t    = th.travelT - (1 - frac) * TRAIL_LEN;
                t = ((t % 1) + 1) % 1;

                /* Lerp along the straight line */
                var px = x1 + (x2 - x1) * t;
                var py = y1 + (y2 - y1) * t;

                var a    = Math.pow(frac, 2.0) * 0.90;
                var dotR = frac * 1.8 + 0.15;

                ctx.save();
                ctx.globalAlpha = a;

                if (s === STEPS) {
                    /* Head — white hot */
                    ctx.shadowBlur  = 8;
                    ctx.shadowColor = 'rgba(255,255,255,0.9)';
                    ctx.fillStyle   = '#ffffff';
                } else {
                    ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                }

                ctx.beginPath();
                ctx.arc(px, py, dotR, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }

    /* ----------------------------------------------------------------
       Focal glow — soft bloom at the convergence point
    ---------------------------------------------------------------- */
    function drawFocalGlow(dark) {
        var cx    = FX * W,  cy = FY * H;
        var pulse = 0.80 + 0.20 * Math.sin(tick * 0.009);
        var g     = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90 * pulse);
        if (dark) {
            g.addColorStop(0,   'rgba(255,235,255,0.20)');
            g.addColorStop(0.4, 'rgba(244,114,182,0.07)');
            g.addColorStop(1,   'rgba(0,0,0,0)');
        } else {
            g.addColorStop(0,   'rgba(255,255,255,0.55)');
            g.addColorStop(0.4, 'rgba(251,182,209,0.15)');
            g.addColorStop(1,   'rgba(0,0,0,0)');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
    }

    /* ----------------------------------------------------------------
       Glitter ✦ sparkles
    ---------------------------------------------------------------- */
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
        var rgb   = dark ? '255,255,255' : '190,70,130';
        var scale = dark ? 0.35 : 0.48;
        for (var i = 0; i < sparkles.length; i++) {
            var s = sparkles[i];
            var a = s.alpha * scale * (0.40 + 0.60 * Math.sin(tick * s.speed + s.phase));
            if (a < 0.014) continue;
            s.rot += s.rotSpeed;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle   = 'rgb(' + rgb + ')';
            if (s.r > 3) {
                ctx.shadowBlur  = s.r * 3;
                ctx.shadowColor = dark ? 'rgba(255,200,255,' + (a*0.8).toFixed(3) + ')'
                                       : 'rgba(210,70,130,'  + (a*0.6).toFixed(3) + ')';
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
        drawThreads(dark);
        drawBeads(dark);
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
