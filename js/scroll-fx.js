/* ================================================================
   SCROLL FX - starburst light-beam explosion on hero scroll-out.
   A canvas overlay (fixed, pointer-events: none) that activates
   as the user scrolls away from the hero section.
   ================================================================ */
(function () {
    'use strict';

    var canvas, ctx, W, H;
    var tick = 0, scrollP = 0, rendering = false;
    var particles = [];

    /* Pink / lavender / white palette */
    var COLS = [
        [244, 114, 182],
        [196, 132, 252],
        [255, 210, 235],
        [167, 139, 250],
        [255, 255, 255],
    ];

    /* ----------------------------------------------------------------
       Boot
    ---------------------------------------------------------------- */
    function init() {
        canvas = document.createElement('canvas');
        canvas.id = 'scroll-fx';
        Object.assign(canvas.style, {
            position: 'fixed', top: '0', left: '0',
            width: '100%', height: '100%',
            pointerEvents: 'none',
            zIndex: '90',
        });
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resize();
        resetParticles();
        window.addEventListener('resize', function () { resize(); resetParticles(); });
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    /* ----------------------------------------------------------------
       Particles - speed-streak sparks that shoot outward
    ---------------------------------------------------------------- */
    function resetParticles() {
        particles = [];
        for (var i = 0; i < 55; i++) particles.push(makeParticle(true));
    }

    function makeParticle(scatter) {
        var col = COLS[Math.floor(Math.random() * COLS.length)];
        return {
            angle:   Math.random() * Math.PI * 2,
            dist:    scatter ? Math.random() * 360 : 0,
            speed:   3 + Math.random() * 9,
            maxDist: 320 + Math.random() * 480,
            r:       0.7 + Math.random() * 2.0,
            alpha:   0.45 + Math.random() * 0.55,
            col:     col,
        };
    }

    /* ----------------------------------------------------------------
       Scroll listener - maps scrollY to 0–1 progress
    ---------------------------------------------------------------- */
    function onScroll() {
        var hero = document.getElementById('home');
        if (!hero) return;
        scrollP = Math.max(0, Math.min(1, window.scrollY / (hero.offsetHeight * 0.60)));

        if (scrollP > 0.004 && !rendering) {
            rendering = true;
            loop();
        }
        if (scrollP <= 0.004) {
            ctx.clearRect(0, 0, W, H);
            rendering = false;
        }
    }

    /* ----------------------------------------------------------------
       Render loop
    ---------------------------------------------------------------- */
    function loop() {
        tick++;
        ctx.clearRect(0, 0, W, H);
        if (scrollP > 0.004) draw();
        if (scrollP > 0.004) {
            requestAnimationFrame(loop);
        } else {
            rendering = false;
        }
    }

    /* ----------------------------------------------------------------
       Draw - beams + particles + central glow
    ---------------------------------------------------------------- */
    function draw() {
        var t  = scrollP;
        var cx = W * 0.5;
        var cy = H * 0.5;

        /* Alpha envelope: ease in → hold → ease out */
        var env;
        if      (t < 0.18) env = easeOut(t / 0.18);
        else if (t > 0.72) env = easeOut((1 - t) / 0.28);
        else               env = 1;
        if (env < 0.01) return;

        var maxL    = Math.sqrt(W * W + H * H) * 0.88;
        var beamLen = maxL * easeOutCubic(Math.min(t * 2.0, 1));
        var BEAMS   = 16;
        var rot     = tick * 0.004;   /* slow continuous rotation */

        /* ── Light beams ── */
        for (var i = 0; i < BEAMS; i++) {
            var angle  = (i / BEAMS) * Math.PI * 2 + rot;
            var col    = COLS[i % COLS.length];
            var ex     = cx + Math.cos(angle) * beamLen;
            var ey     = cy + Math.sin(angle) * beamLen;
            var bright = (i % 2 === 0 ? 0.42 : 0.24) * env;
            var hw     = (4 + (i % 4) * 3.5) * (1 - t * 0.30);
            var perp   = angle + Math.PI * 0.5;

            var grad = ctx.createLinearGradient(cx, cy, ex, ey);
            grad.addColorStop(0.00, rgba(col, bright));
            grad.addColorStop(0.18, rgba(col, bright * 0.65));
            grad.addColorStop(0.50, rgba(col, bright * 0.22));
            grad.addColorStop(1.00, rgba(col, 0));

            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(perp) * hw, cy + Math.sin(perp) * hw);
            ctx.lineTo(ex, ey);
            ctx.lineTo(cx - Math.cos(perp) * hw, cy - Math.sin(perp) * hw);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
        }

        /* ── Speed-streak particles ── */
        for (var j = 0; j < particles.length; j++) {
            var p = particles[j];
            p.dist += p.speed * (0.5 + t * 3.0);
            if (p.dist > p.maxDist) { particles[j] = makeParticle(false); continue; }

            var prog    = p.dist / p.maxDist;
            var fade    = p.alpha * env * (1 - prog) * Math.min(prog / 0.06, 1);
            if (fade < 0.015) continue;

            var streakL = p.speed * (1.2 + t * 3.5);
            var px  = cx + Math.cos(p.angle) * p.dist;
            var py  = cy + Math.sin(p.angle) * p.dist;
            var px0 = cx + Math.cos(p.angle) * Math.max(0, p.dist - streakL);
            var py0 = cy + Math.sin(p.angle) * Math.max(0, p.dist - streakL);

            var sg = ctx.createLinearGradient(px0, py0, px, py);
            sg.addColorStop(0, rgba(p.col, 0));
            sg.addColorStop(1, rgba(p.col, fade));

            ctx.beginPath();
            ctx.moveTo(px0, py0);
            ctx.lineTo(px, py);
            ctx.strokeStyle = sg;
            ctx.lineWidth   = p.r;
            ctx.lineCap     = 'round';
            ctx.stroke();

            /* Bright head */
            ctx.fillStyle = rgba(p.col, fade * 0.85);
            ctx.beginPath();
            ctx.arc(px, py, p.r * 0.85, 0, Math.PI * 2);
            ctx.fill();
        }

        /* ── Central radial glow ── */
        var r1 = 55 + 180 * easeOutCubic(t);
        var cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1);
        cg.addColorStop(0.00, 'rgba(255,255,255,' + (0.80 * env).toFixed(3) + ')');
        cg.addColorStop(0.12, 'rgba(244,114,182,' + (0.55 * env).toFixed(3) + ')');
        cg.addColorStop(0.40, 'rgba(196,132,252,' + (0.20 * env).toFixed(3) + ')');
        cg.addColorStop(1.00, 'rgba(167,139,250,0)');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(cx, cy, r1, 0, Math.PI * 2);
        ctx.fill();
    }

    /* ----------------------------------------------------------------
       Helpers
    ---------------------------------------------------------------- */
    function rgba(col, a) {
        return 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (+a).toFixed(3) + ')';
    }
    function easeOut(t)      { return 1 - (1 - t) * (1 - t); }
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
