/* ================================================================
   MAIN.JS - Navigation, smooth scroll, and project card rendering
   ================================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------------
       Project card rendering
       Reads from PROJECTS / FLAGSHIP_COUNT in content.js
    ---------------------------------------------------------------- */
    function renderProjects() {
        var grid = document.getElementById('work-grid');
        if (!grid) return;

        var items = PROJECTS.slice(0, FLAGSHIP_COUNT);

        grid.innerHTML = items.map(function (p) {
            var mediaHTML = p.video
                ? '<video autoplay muted loop playsinline preload="metadata"' + (p.poster ? ' poster="' + p.poster + '"' : '') + ' aria-label="' + p.title + ' preview"><source src="' + p.video + '" type="video/mp4"></video>'
                : p.image
                ? '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy">'
                : '';

            var hasMedia = p.video || p.image;
            var placeholderStyle = (!hasMedia && p.placeholderBg)
                ? 'style="background:' + p.placeholderBg + '"'
                : '';

            var clientHTML = p.client
                ? '<p class="card-client">' + p.client + '</p>'
                : '';

            var chipsHTML = p.tags.map(function (t) {
                return '<span class="card-chip">' + t + '</span>';
            }).join('');

            var isLinked = p.link && p.link !== '#';
            var cardTag = isLinked ? 'a' : 'article';
            var cardHref = isLinked ? ' href="' + p.link + '"' : '';
            return [
                '<' + cardTag + ' class="project-card reveal' + (isLinked ? ' is-linked' : '') + '"' + cardHref,
                '  aria-label="' + p.title + ' case study">',
                '  <div class="card-image' + (!hasMedia ? ' is-placeholder' : '') + '" ' + placeholderStyle + '>',
                '    ' + mediaHTML,
                '  </div>',
                '  <div class="card-overlay">',
                '    ' + clientHTML,
                '    <h3 class="card-title">' + p.title + '</h3>',
                '    <div class="card-chips">' + chipsHTML + '</div>',
                '    <p class="card-desc">' + p.description + '</p>',
                '    <span class="card-arrow">→</span>',
                '  </div>',
                '</' + cardTag + '>',
            ].join('\n');
        }).join('\n');
    }

    /* ----------------------------------------------------------------
       Selected work card rendering
    ---------------------------------------------------------------- */
    function renderSelectedProjects() {
        var grid = document.getElementById('selected-work-grid');
        if (!grid || typeof SELECTED_PROJECTS === 'undefined') return;

        grid.innerHTML = SELECTED_PROJECTS.map(function (p, index) {
            var tagsHTML = p.tags.map(function (tag) {
                return '<span>' + tag + '</span>';
            }).join('');

            return [
                '<a class="selected-project-card is-linked reveal" href="' + p.link + '">',
                '  <div class="selected-project-topline">',
                '    <span class="selected-project-number">0' + (index + 1) + '</span>',
                '    <span class="selected-project-status">' + p.status + '</span>',
                '  </div>',
                '  <div class="selected-project-copy">',
                '    <p class="selected-project-client">' + p.client + '</p>',
                '    <h3>' + p.title + '</h3>',
                '    <p class="selected-project-description">' + p.description + '</p>',
                '  </div>',
                '  <div class="selected-project-tags">' + tagsHTML + '</div>',
                '</a>'
            ].join('\n');
        }).join('\n');
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
    function initHeroTypewriter() {
        var el = document.querySelector('.hero-heading');
        if (!el) return;

        /* Define the segments in order */
        var segments = [
            { text: 'I turn complexity',   tag: 'span' },
            { text: 'BR' },
            { text: 'into ',               tag: 'span' },
            { text: 'clear',               tag: 'em'   },
            { text: ', validated',         tag: 'span' },
            { text: 'BR' },
            { text: 'product experiences.', tag: 'span' },
        ];

        /* Build DOM skeleton upfront so <em> styles apply immediately */
        el.innerHTML = '';
        var nodes = [];
        segments.forEach(function (seg) {
            if (seg.text === 'BR') {
                el.appendChild(document.createElement('br'));
                return;
            }
            var node = document.createElement(seg.tag);
            el.appendChild(node);
            nodes.push({ node: node, text: seg.text });
        });

        /* Blinking cursor */
        var cursor = document.createElement('span');
        cursor.className = 'tw-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        el.appendChild(cursor);

        /* Flatten to character queue */
        var queue = [];
        nodes.forEach(function (item) {
            item.text.split('').forEach(function (c) {
                queue.push({ node: item.node, char: c });
            });
        });

        var i = 0;
        var BASE_DELAY = 38; /* ms per character */

        function tick() {
            if (i >= queue.length) {
                /* Finished - blink for a moment then remove cursor */
                setTimeout(function () {
                    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
                }, 1100);
                return;
            }
            var item = queue[i];
            item.node.textContent += item.char;
            i++;
            /* Slight random jitter makes it feel natural */
            setTimeout(tick, BASE_DELAY + (Math.random() * 22 - 11));
        }

        /* Start after label fades in (matches 0.20s entrance + duration) */
        setTimeout(tick, 480);
    }

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
        renderSelectedProjects();
        initNavScrollState();
        initActiveNavLink();
        initMobileMenu();
        initSmoothScroll();
        initThemeToggle();
        initHeroEntrance();
        initHeroTypewriter();
        initScrollReveal();
        initCardMouseGlow();
    });

})();
