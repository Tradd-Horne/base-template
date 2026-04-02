/* ========================================================================
   Base Template — Main JavaScript
   Vanilla JS, no dependencies
   ======================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------------------
       DOM References
       -------------------------------------------------------------------- */

    const html = document.documentElement;
    const body = document.body;
    const header = document.getElementById('header');
    const themeToggle = document.getElementById('theme-toggle');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const footerYear = document.getElementById('footer-year');
    const navLinks = document.querySelectorAll('.nav-list a, .mobile-menu a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const animateElements = document.querySelectorAll('.animate-on-scroll');


    /* --------------------------------------------------------------------
       Dark Mode
       Reads localStorage first, falls back to system preference.
       Toggles data-theme attribute on <html> and saves to localStorage.
       -------------------------------------------------------------------- */

    const THEME_KEY = 'theme-preference';

    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function getSavedTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null;
        }
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            // localStorage unavailable — theme still works, just won't persist
        }
    }

    function initTheme() {
        var saved = getSavedTheme();
        if (saved === 'dark' || saved === 'light') {
            setTheme(saved);
        } else {
            setTheme(getSystemTheme());
        }
    }

    function toggleTheme() {
        var current = html.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    }

    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            // Only auto-switch if user hasn't set a manual preference
            if (!getSavedTheme()) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Initialise theme immediately (before DOM ready to avoid flash)
    initTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }


    /* --------------------------------------------------------------------
       Header Show/Hide on Scroll
       Uses requestAnimationFrame for performance.
       Shows header when scrolling up, hides when scrolling down.
       -------------------------------------------------------------------- */

    var lastScrollY = 0;
    var scrollDirection = 'up';
    var ticking = false;
    var SCROLL_THRESHOLD = 10;

    function updateHeader() {
        var currentScrollY = window.scrollY;

        // Always show at top
        if (currentScrollY <= 0) {
            header.classList.remove('header-hidden');
            lastScrollY = currentScrollY;
            ticking = false;
            return;
        }

        var diff = currentScrollY - lastScrollY;

        if (Math.abs(diff) < SCROLL_THRESHOLD) {
            ticking = false;
            return;
        }

        if (diff > 0 && scrollDirection !== 'down') {
            scrollDirection = 'down';
            header.classList.add('header-hidden');
        } else if (diff < 0 && scrollDirection !== 'up') {
            scrollDirection = 'up';
            header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    if (header) {
        window.addEventListener('scroll', onScroll, { passive: true });
    }


    /* --------------------------------------------------------------------
       Hamburger / Mobile Menu
       Supports ARIA, Escape key, body scroll lock.
       -------------------------------------------------------------------- */

    var menuOpen = false;

    function openMenu() {
        menuOpen = true;
        hamburger.classList.add('is-active');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        body.classList.add('menu-open');
    }

    function closeMenu() {
        menuOpen = false;
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        body.classList.remove('menu-open');
    }

    function toggleMenu() {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', toggleMenu);

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menuOpen) {
                closeMenu();
                hamburger.focus();
            }
        });

        // Close when clicking outside the menu panel
        mobileMenu.addEventListener('click', function (e) {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });

        // Close when a mobile menu link is clicked
        var mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });
    }


    /* --------------------------------------------------------------------
       Intersection Observer — Scroll Animations
       Fades in elements with .animate-on-scroll when they enter viewport.
       -------------------------------------------------------------------- */

    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show everything immediately
            animateElements.forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px',
            }
        );

        animateElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    initScrollAnimations();


    /* --------------------------------------------------------------------
       Smooth Scroll for Anchor Links
       Accounts for fixed header height offset.
       -------------------------------------------------------------------- */

    function getHeaderHeight() {
        if (header) {
            return header.offsetHeight;
        }
        return 72;
    }

    function smoothScrollTo(targetId) {
        var target = document.querySelector(targetId);
        if (!target) return;

        var headerOffset = getHeaderHeight() + 16;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                smoothScrollTo(href);

                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });


    /* --------------------------------------------------------------------
       Dynamic Footer Year
       -------------------------------------------------------------------- */

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }


    /* --------------------------------------------------------------------
       Active Nav Highlighting
       Uses IntersectionObserver on sections to highlight the nav link
       corresponding to the currently visible section.
       -------------------------------------------------------------------- */

    function initActiveNav() {
        if (!('IntersectionObserver' in window) || sections.length === 0) {
            return;
        }

        var desktopLinks = document.querySelectorAll('.nav-list a');
        var linkMap = {};

        desktopLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                var id = href.substring(1);
                if (!linkMap[id]) {
                    linkMap[id] = [];
                }
                linkMap[id].push(link);
            }
        });

        function clearActive() {
            desktopLinks.forEach(function (link) {
                link.classList.remove('active');
            });
        }

        var currentActive = null;
        var sectionVisibility = {};

        var navObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    sectionVisibility[entry.target.id] = entry.isIntersecting;
                });

                // Find the first visible section in DOM order
                var activeId = null;
                for (var i = 0; i < sections.length; i++) {
                    if (sectionVisibility[sections[i].id]) {
                        activeId = sections[i].id;
                        break;
                    }
                }

                if (activeId !== currentActive) {
                    currentActive = activeId;
                    clearActive();
                    if (activeId && linkMap[activeId]) {
                        linkMap[activeId].forEach(function (link) {
                            link.classList.add('active');
                        });
                    }
                }
            },
            {
                threshold: 0,
                rootMargin: '-20% 0px -60% 0px',
            }
        );

        sections.forEach(function (section) {
            navObserver.observe(section);
        });
    }

    initActiveNav();


    /* --------------------------------------------------------------------
       Close mobile menu on resize (if resized to desktop width)
       -------------------------------------------------------------------- */

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth >= 1024 && menuOpen) {
                closeMenu();
            }
        }, 150);
    });

})();
