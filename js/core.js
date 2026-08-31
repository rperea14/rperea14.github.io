/**
 * Core JavaScript: Theme switcher, mobile nav, counter animations, typed header, and interactive utilities
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initAnimatedCounters();
    initTypedRole();
    highlightActiveNav();
});

/* ==========================================================================
   Theme Switcher (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.innerHTML = '🌙';
        themeBtn.setAttribute('title', 'Switch to Dark Mode');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '☀️';
        themeBtn.setAttribute('title', 'Switch to Light Mode');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
        themeBtn.setAttribute('title', newTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });
}

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!mobileBtn || !drawer) return;

    mobileBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', isOpen);
        mobileBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close drawer when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (!drawer.contains(e.target) && !mobileBtn.contains(e.target) && drawer.classList.contains('open')) {
            drawer.classList.remove('open');
            mobileBtn.innerHTML = '☰';
        }
    });
}

/* ==========================================================================
   Animated Number Counters
   ========================================================================== */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const isDecimal = target % 1 !== 0;
                
                let current = 0;
                const duration = 1600; // ms
                const startTime = performance.now();

                function update(now) {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    current = easeProgress * target;
                    
                    el.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current)}${suffix}`;
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target}${suffix}`;
                    }
                }

                requestAnimationFrame(update);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   Typed Role Switcher in Hero
   ========================================================================== */
function initTypedRole() {
    const typedEl = document.getElementById('hero-typed-text');
    if (!typedEl) return;

    const roles = [
        'Bioengineer & Data Scientist',
        'Software Builder & Tech Tinkerer',
        'CIO @ Exponentia Peru',
        'Creator of MedicAI (Side Project)',
        'Ex-Harvard & MGH Research Fellow',
        'Lifelong Problem Solver'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let speed = 70;

    function type() {
        const currentRole = roles[roleIdx];
        if (isDeleting) {
            typedEl.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            speed = 35;
        } else {
            typedEl.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            speed = 65;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            speed = 2200; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 400; // pause before typing next
        }

        setTimeout(type, speed);
    }

    type();
}

/* ==========================================================================
   Active Navigation Link
   ========================================================================== */
function highlightActiveNav() {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (path.endsWith(href) || (href === 'index.html' && (path.endsWith('/') || path.endsWith('/new_frontend/') || path.endsWith('/new_frontend/index.html'))))) {
            link.classList.add('active');
        }
    });
}

/* ==========================================================================
   Copy to Clipboard Helper
   ========================================================================== */
function copyToClipboard(text, btnElement, successText = 'Copied!') {
    navigator.clipboard.writeText(text).then(() => {
        const original = btnElement.innerHTML;
        btnElement.innerHTML = `✓ ${successText}`;
        btnElement.classList.add('btn-copied');
        setTimeout(() => {
            btnElement.innerHTML = original;
            btnElement.classList.remove('btn-copied');
        }, 2200);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
window.copyToClipboard = copyToClipboard;
