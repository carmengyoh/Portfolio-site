/* ================================================================
   HERO BACKGROUND — "Complexity → Clarity"
   Ribbons visibly undulate + glowing beads travel along each path.
   ================================================================ */
(function () {
    'use strict';

    var canvas, ctx, W, H, tick = 0;
    var sparkles = [];

    var SPARKLE_COUNT = 42;
    var INTRO_TICKS   = 180;

    function getTheme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }

    /* ----------------------------------------------------------------
       Ribbon definitions — normalized 0..1 coords.
       speed     = undulation speed (visible wave)
       amplitude = how far control points drift (0.10 = clearly visible)
       travelT   = current bead position along path (0..1)
       travelSpd = how fast the bead travels
    ---------------------------------------------------------------- */
    var RIBBONS = [
        { sx:0.00, sy:0.92, ex:1.00, ey:0.08,
          cp1x:0.20, cp1y:0.55, cp2x:0.58, cp2y:0.28,
          rgbD:[244,114,182], rgbL:[219,39,119],
          w:2.8, alphaD:0.55, alphaL:0.50,
          phase:0.0,  speed:0.018, amp:0.11,
          travelT:0.05, travelSpd:0.0042 },

        { sx:0.00, sy:0.55, ex:0.98, ey:0.72,
          cp1x:0.28, cp1y:0.06, cp2x:0.62, cp2y:0.80,
          rgbD:[196,132,252], rgbL:[147,51,234],
          w:2.0, alphaD:0.50, alphaL:0.40,
          phase:1.65, speed:0.014, amp:0.13,
          travelT:0.40, travelSpd:0.0055 },

        { sx:0.08, sy:1.00, ex:1.00, ey:0.28,
          cp1x:0.38, cp1y:0.85, cp2x:0.66, cp2y:0.18,
          rgbD:[167,139,250], rgbL:[124,58,237],
          w:4.0, alphaD:0.22, alphaL:0.18,
          phase:2.9,  speed:0.012, amp:0.09,
          travelT:0.70, travelSpd:0.0035 },

        { sx:0.00, sy:0.72, ex:0.82, ey:0.10,
          cp1x:0.22, cp1y:0.14, cp2x:0.54, cp2y:0.62,
          rgbD:[147,161,253], rgbL:[99,102,241],
          w:1.4, alphaD:0.45, alphaL:0.35,
          phase:0.82, speed:0.020, amp:0.12,
          travelT:0.20, travelSpd:0.0060 },

        { sx:0.05, sy:0.78, ex:0.92, ey:0.50,
          cp1x:0.42, cp1y:0.96, cp2x:0.70, cp2y:0.08,
          rgbD:[251,191,215], rgbL:[236,72,153],
          w:3.5, alphaD:0.20, alphaL:0.25,
          phase:3.5,  speed:0.011, amp:0.10,
          travelT:0.55, travelSpd:0.0048 },

        { sx:0.12, sy:0.35, ex:1.00, ey:0.90,
          cp1x:0.35, cp1y:0.02, cp2x:0.72, cp2y:0.70,
          rgbD:[216,180,254], rgbL:[168,85,247],
          w:1.6, alphaD:0.35, alphaL:0.28,
          phase:4.2,  speed:0.016, amp:0.11,
          travelT:0.85, travelSpd:0.0038 },
    ];

    /* ----------------------------------------------------------------
       Evaluate a point on a cubic bezier at parameter t (0..1)
    ---------------------------------------------------------------- */
    function bezierAt(sx, sy, c1x, c1y, c2x, c2y, ex, ey, t) {
        t = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
        var mt = 1 - t;
        return {
            x: mt*mt*mt*sx + 3*mt*mt*t*c1x + 3*mt*t*t*c2x + t*t*t*ex,
            y: mt*mt*mt*sy + 3*mt*mt*t*c1y + 3*mt*t*t*c2y + t*t*t*ey,
        };
    }

    /* ----------------------------------------------------------------
       Build current animated control points for a ribbon
    ---------------------------------------------------------------- */
    function ribbonPoints(r) {
        var t   = tick * r.speed;
        var amp = r.amp;
        return {
            sx:  r.sx  * W,  sy:  r.sy  * H,
            ex:  r.ex  * W,  ey:  r.ey  * H,
            c1x: (r.cp1x + Math.sin(t + r.phase)          * amp) * W,
            c1y: (r.cp1y + Math.cos(t + r.phase * 0.7)    * amp) * H,
            c2x: (r.cp2x + Math.cos(t * 1.3 + r.phase)    * amp) * W,
            c2y: (r.cp2y + Math.sin(t * 0.85 + r.phase)   * amp) * H,
        };
    }

    /* ----------------------------------------------------------------
       Draw ribbon base — 3 overlapping strokes (halo + body + gleam)
    ---------------------------------------------------------------- */
    function drawRibbonBase(r, p, dark) {
        var rgb = dark ? r.rgbD : r.rgbL;
        var a   = dark ? r.alphaD : r.alphaL;
        var col = rgb[0] + ',' + rgb[1] + ',' + rgb[2];

        var grad = ctx.createLinearGradient(p.sx, p.sy, p.ex, p.ey);
        grad.addColorStop(0.00, 'rgba(' + col + ',0)');
        grad.addColorStop(0.12, 'rgba(' + col + ',' + (a * 0.6).toFixed(3) + ')');
        grad.addColorStop(0.48, 'rgba(' + col + ',' + a.toFixed(3) + ')');
        grad.addColorStop(0.72, 'rgba(' + col + ',' + a.toFixed(3) + ')');
        grad.addColorStop(1.00, 'rgba(' + col + ',0)');

        ctx.lineCap  = 'round';
        ctx.lineJoin = 'round';

        /* Halo */
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.bezierCurveTo(p.c1x, p.c1y, p.c2x, p.c2y, p.ex, p.ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = r.w * 6;
        ctx.globalAlpha = 0.16;
        ctx.stroke();

        /* Body */
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.bezierCurveTo(p.c1x, p.c1y, p.c2x, p.c2y, p.ex, p.ey);
        ctx.lineWidth   = r.w;
        ctx.globalAlpha = 1.0;
        ctx.stroke();

        /* Gleam */
        var gleam = ctx.createLinearGradient(p.sx, p.sy, p.ex, p.ey);
        gleam.addColorStop(0.00, 'rgba(255,255,255,0)');
        gleam.addColorStop(0.38, 'rgba(255,255,255,' + (dark ? 0.55 : 0.38) + ')');
        gleam.addColorStop(0.68, 'rgba(255,255,255,' + (dark ? 0.40 : 0.28) + ')');
        gleam.addColorStop(1.00, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.bezierCurveTo(p.c1x, p.c1y, p.c2x, p.c2y, p.ex, p.ey);
        ctx.strokeStyle = gleam;
        ctx.lineWidth   = r.w * 0.28;
        ctx.globalAlpha = 1.0;
        ctx.stroke();
    }

    /* ----------------------------------------------------------------
       Draw the traveling bead + comet trail for one ribbon.
       The bead slides from 0→1 repeatedly, leaving a glowing tail.
    ---------------------------------------------------------------- */
    function drawBead(r, p, dark) {
        r.travelT = (r.travelT + r.travelSpd) % 1.0;

        var STEPS     = 18;
        var TRAIL_LEN = 0.16;   /* fraction of path behind the head */
        var rgb       = dark ? r.rgbD : r.rgbL;
        var headRgb   = dark ? '255,255,255' : '255,255,255';

        for (var i = 0; i <= STEPS; i++) {
            var frac = i / STEPS;
            var t    = r.travelT - (1 - frac) * TRAIL_LEN;
            if (t < 0) t += 1;
            var pt   = bezierAt(p.sx, p.sy, p.c1x, p.c1y, p.c2x, p.c2y, p.ex, p.ey, t);

            var trailAlpha = Math.pow(frac, 1.6) * 0.95;
            var dotR       = frac * 3.5 + 0.4;
            var isHead     = i === STEPS;

            ctx.save();
            ctx.globalAlpha = trailAlpha;

            if (frac > 0.65) {
                ctx.shadowBlur  = isHead ? 18 : 8 * frac;
                ctx.shadowColor = isHead
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.7)';
            }

            ctx.fillStyle = isHead
                ? 'rgb(' + headRgb + ')'
                : 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, dotR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    /* ----------------------------------------------------------------
       Focal glow — the "clarity" convergence point
    ---------------------------------------------------------------- */
    function drawFocalGlow(dark) {
        var cx    = 0.56 * W, cy = 0.44 * H;
        var pulse = 0.80 + 0.20 * Math.sin(tick * 0.012);
        var r1    = 50 * pulse,  r2 = 120 * pulse;

        var inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1);
        inner.addColorStop(0,   dark ? 'rgba(255,240,255,0.30)' : 'rgba(255,255,255,0.65)');
        inner.addColorStop(0.4, dark ? 'rgba(244,114,182,0.14)' : 'rgba(251,182,209,0.28)');
        inner.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = inner;
        ctx.fillRect(0, 0, W, H);

        var outer = ctx.createRadialGradient(cx, cy, r1 * 0.5, cx, cy, r2);
        outer.addColorStop(0,   dark ? 'rgba(196,132,252,0.10)' : 'rgba(216,180,254,0.22)');
        outer.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = outer;
        ctx.fillRect(0, 0, W, H);
    }

    /* ----------------------------------------------------------------
       Glitter ✦ sparkles
    ---------------------------------------------------------------- */
    function buildSparkles() {
        sparkles = [];
        for (var i = 0; i < SPARKLE_COUNT; i++) {
            var roll = Math.random();
            var r = roll < 0.55 ? 1.0 + Math.random() * 1.8
                  : roll < 0.85 ? 2.6 + Math.random() * 2.5
                  :                5.0 + Math.random() * 3.0;
            sparkles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: r,
                phase:    Math.random() * Math.PI * 2,
                speed:    0.004 + Math.random() * 0.010,
                rot:      Math.random() * Math.PI * 0.5,
                rotSpeed: (Math.random() - 0.5) * 0.0025,
                baseAlpha: 0.28 + Math.random() * 0.55,
            });
        }
    }

    function drawStar(cx, cy, outer, inner, rot) {
        ctx.beginPath();
        for (var i = 0; i < 8; i++) {
            var angle = i * Math.PI / 4 + rot;
            var r     = (i % 2 === 0) ? outer : inner;
            if (i === 0) ctx.moveTo(cx + Math.cos(angle)*r, cy + Math.sin(angle)*r);
            else         ctx.lineTo(cx + Math.cos(angle)*r, cy + Math.sin(angle)*r);
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawSparkles(dark) {
        var rgb   = dark ? '255,255,255' : '200,80,140';
        var scale = dark ? 0.38 : 0.52;
        for (var i = 0; i < sparkles.length; i++) {
            var s = sparkles[i];
            var a = s.baseAlpha * scale * (0.45 + 0.55 * Math.sin(tick * s.speed + s.phase));
            if (a < 0.016) continue;
            s.rot += s.rotSpeed;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle   = 'rgb(' + rgb + ')';
            if (s.r > 3.2) {
                ctx.shadowBlur  = s.r * 3.5;
                ctx.shadowColor = dark ? 'rgba(255,200,255,' + (a * 0.8).toFixed(3) + ')'
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

        /* 1. Focal glow (behind everything) */
        drawFocalGlow(dark);

        /* 2. Ribbon bases */
        for (var i = 0; i < RIBBONS.length; i++) {
            var p = ribbonPoints(RIBBONS[i]);
            drawRibbonBase(RIBBONS[i], p, dark);
        }

        /* 3. Traveling beads (on top of ribbon bases) */
        for (var j = 0; j < RIBBONS.length; j++) {
            var q = ribbonPoints(RIBBONS[j]);
            drawBead(RIBBONS[j], q, dark);
        }

        /* 4. Glitter sparkles */
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
