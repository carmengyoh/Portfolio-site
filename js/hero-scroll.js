/* Keep the hero copy readable while adding a gentle, delayed scroll drift. */
(function () {
    'use strict';

    function init() {
        var hero = document.getElementById('home');
        var text = document.querySelector('.hero-text-card');
        if (!hero || !text) return;

        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        var scheduled = false;

        function update() {
            scheduled = false;
            if (reducedMotion.matches) {
                text.style.removeProperty('transform');
                return;
            }

            var rect = hero.getBoundingClientRect();
            // Let the first fifth of the card scroll away before adding movement.
            var progress = Math.max(0, Math.min(1,
                (-rect.top - rect.height * 0.2) / Math.max(1, rect.height * 0.8)));
            var eased = progress * progress * (3 - 2 * progress);
            // Move the copy as one group, without fading, blurring or scattering it.
            if (progress === 0) text.style.removeProperty('transform');
            else text.style.transform = 'translateY(' + (-10 * eased).toFixed(2) + 'px)';
        }

        function scheduleUpdate() {
            if (scheduled) return;
            scheduled = true;
            window.requestAnimationFrame(update);
        }

        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);
        reducedMotion.addEventListener('change', scheduleUpdate);
        update();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
