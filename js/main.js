/* ================================================================
   MAIN.JS - Navigation, smooth scroll, and project card rendering
   ================================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------------
       Project card rendering
       Reads the curated FEATURED_PROJECTS / SELECTED_PROJECTS in content.js
    ---------------------------------------------------------------- */
    const personality = document.querySelector('.hero-personality-card');
    const compactPersonality = window.matchMedia('(max-width: 1100px)');
    if (personality) {
        const syncPersonality = () => { personality.open = !compactPersonality.matches; };
        syncPersonality();
        compactPersonality.addEventListener('change', syncPersonality);
    }

    function renderProjects() {
        var grid = document.getElementById('work-grid');
        if (!grid) return;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        grid.innerHTML = FEATURED_PROJECTS.concat(SELECTED_PROJECTS).map(function (project, index) {
            var media = project.video
                ? '<video id="work-preview-' + index + '" ' + (reducedMotion.matches ? '' : 'autoplay ') + 'muted loop playsinline preload="metadata" poster="' + (project.poster || project.cardImage || project.image) + '" aria-label="' + project.title + ' demo"><source src="' + project.video + '" type="video/mp4"></video>'
                : project.cardImages
                ? '<div class="work-card-phones">' + project.cardImages.map(function (src) { return '<img src="' + src + '" alt="HerFreedom101 adaptive daily journey" loading="lazy">'; }).join('') + '</div>'
                : '<img src="' + (project.cardImage || project.poster || project.image) + '" alt="' + project.title + ' interface" loading="lazy">';
            var featured = index < FEATURED_PROJECTS.length;
            var cardClass = 'work-card' + (featured ? ' work-card--featured' : '');
            return '<div class="work-card-shell"><a class="' + cardClass + '" href="' + project.link + '">' +
                '<div class="work-card-media">' + media + (index < FEATURED_PROJECTS.length ? '<span class="work-card-featured-tag">Featured work</span>' : '') + '</div>' +
                '<div class="work-card-copy"><p class="work-card-client">' + project.client + '</p><div class="work-card-topline"><span class="work-card-status">' + project.status + '</span>' + (project.cardScope ? '<span class="work-card-scope">' + project.cardScope + '</span>' : '') + '</div>' +
                '<h3>' + project.title + '</h3>' +
                '<p class="work-card-description">' + project.description + '</p>' +
                '<div class="work-card-bottom"><span>' + project.tags.join(' · ') + '</span><span aria-hidden="true">↗</span></div></div></a>' +
                (project.video ? '<button class="work-preview-toggle" type="button" aria-controls="work-preview-' + index + '">Play preview</button>' : '') + '</div>';
        }).join('');
        grid.querySelectorAll('.work-preview-toggle').forEach(function (button) {
            var video = document.getElementById(button.getAttribute('aria-controls'));
            function sync() {
                var label = video.paused ? 'Play preview' : 'Pause preview';
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
                    (video.paused ? '<path d="M8 5v14l11-7z"/>' : '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>') + '</svg>';
                button.setAttribute('aria-label', label + ': ' + video.getAttribute('aria-label'));
                button.title = label;
            }
            video.addEventListener('play', sync);
            video.addEventListener('pause', sync);
            button.addEventListener('click', function () {
                if (video.paused) video.play().catch(sync);
                else video.pause();
            });
            reducedMotion.addEventListener('change', function (event) {
                if (event.matches) video.pause();
            });
            sync();
        });
    }

    /* ----------------------------------------------------------------
       Navigation - scrolled state (border + backdrop blur)
    ---------------------------------------------------------------- */
    function initNavScrollState() {
        var nav = document.getElementById('nav');
        if (!nav) return;

        function update() {
            nav.classList.toggle('is-scrolled', window.scrollY > 20);
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ----------------------------------------------------------------
       Navigation - active link highlight based on scroll position
    ---------------------------------------------------------------- */
    function initActiveNavLink() {
        var links    = document.querySelectorAll('.nav-link');
        var sections = document.querySelectorAll('section[id]:not(#selected-work), footer[id]');

        function update() {
            var scrollY  = window.scrollY + 120;
            var current  = '';
            sections.forEach(function (s) {
                if (s.offsetTop <= scrollY) current = s.id;
            });
            links.forEach(function (a) {
                a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
            });
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ----------------------------------------------------------------
       Navigation - mobile menu toggle
    ---------------------------------------------------------------- */
    function initMobileMenu() {
        var toggle = document.querySelector('.nav-toggle');
        var links  = document.querySelector('.nav-links');
        if (!toggle || !links) return;

        toggle.addEventListener('click', function () {
            var open = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!open));
            links.classList.toggle('is-open', !open);
        });

        /* Close on any link click */
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                toggle.setAttribute('aria-expanded', 'false');
                links.classList.remove('is-open');
            });
        });
    }

    /* ----------------------------------------------------------------
       Smooth scroll for hash links (supplements CSS scroll-behavior
       with offset correction for the fixed nav)
    ---------------------------------------------------------------- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = this.getAttribute('href');
                if (id === '#') return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                var navH  = (document.getElementById('nav') || {}).offsetHeight || 72;
                var top   = target.getBoundingClientRect().top + window.scrollY - navH;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    /* ----------------------------------------------------------------
       Theme toggle - sun / moon button
    ---------------------------------------------------------------- */
    function initThemeToggle() {
        var btn  = document.getElementById('theme-toggle');
        var root = document.documentElement;
        if (!btn) return;

        /* Preference is already applied in the inline <head> script.
           Here we just wire up the click. */
        btn.addEventListener('click', function () {
            var current = root.getAttribute('data-theme') || 'dark';
            var next    = current === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    /* ----------------------------------------------------------------
       Hero entrance - adds .hero-entered to body after first paint
       so CSS transitions play from the hidden state
    ---------------------------------------------------------------- */
    function initHeroEntrance() {
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.body.classList.add('hero-entered');
            });
        });
    }

    /* ----------------------------------------------------------------
       Typewriter - types the hero heading character by character.
       Structure: plain text → <br> → plain text → <em>word</em>
    ---------------------------------------------------------------- */
    /* ----------------------------------------------------------------
       Scroll reveal - IntersectionObserver fires .is-visible on .reveal
    ---------------------------------------------------------------- */
    function initScrollReveal() {
        document.body.classList.add('js-reveal');

        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.reveal').forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.10 });

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ----------------------------------------------------------------
       Card mouse-glow - tracks cursor position via CSS custom props
    ---------------------------------------------------------------- */
    function initCardMouseGlow() {
        document.addEventListener('mousemove', function (e) {
            var card = e.target.closest('.project-card');
            if (!card) return;
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
            card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
        });
    }

    /* ----------------------------------------------------------------
       Boot
    ---------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        renderProjects();
        initNavScrollState();
        initActiveNavLink();
        initMobileMenu();
        initSmoothScroll();
        initThemeToggle();
        initHeroEntrance();
        initScrollReveal();
        initCardMouseGlow();
    });

})();
