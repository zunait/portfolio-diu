/**
 * main.js — Vanilla JS for Zunait Hossain Ratul's Portfolio
 *
 * Features:
 *  1. Light / Dark theme toggle (saved to localStorage)
 *  2. Mobile navbar hamburger toggle
 *  3. Scroll progress bar
 *  4. Scroll-reveal animation (IntersectionObserver)
 *  5. Skill bar animation (IntersectionObserver on skills section)
 *  6. Active nav link highlighting based on scroll position
 *  7. Footer year auto-update
 */

/* ─────────────────────────────────────────────
   WAIT FOR THE DOM TO BE FULLY LOADED
───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════
     1. THEME TOGGLE (Default: LIGHT MODE)
     Reads saved preference from localStorage.
     Toggles the data-theme attribute on <html>.
     Updates the button label to match current theme.
  ═══════════════════════════════════════════ */

  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggleBtn');

  /**
   * Apply a theme ('light' | 'midnight' / 'dark') and save it.
   * @param {string} theme
   */
  function applyTheme(theme) {
    if (theme === 'dark' || theme === 'midnight') {
      html.setAttribute('data-theme', 'midnight');
      if (themeToggle) {
        themeToggle.innerHTML = '<span class="theme-icon">☽</span>';
        themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
      }
    } else {
      html.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<span class="theme-icon">☀</span>';
        themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    }
    localStorage.setItem('portfolio-theme', theme);
  }

  // On page load, restore saved theme (DEFAULT: LIGHT)
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  applyTheme(savedTheme);

  // Toggle between light and dark on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'midnight' || html.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'midnight');
    });
  }


  /* ═══════════════════════════════════════════
     2. MOBILE MENU / NAV TOGGLE (Astro Style)
     Shows / hides the .nav-links list on mobile.
     Toggles between 'MENU' and 'CLOSE'.
  ═══════════════════════════════════════════ */

  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu when any navigation anchor link is clicked
    navLinks.querySelectorAll('a.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = 'MENU';
      });
    });
  }




  /* ═══════════════════════════════════════════
     4. SCROLL-REVEAL ANIMATION
     All elements with class .reveal start hidden
     (opacity: 0, translated down) in CSS.
     An IntersectionObserver adds .revealed when
     they enter the viewport, triggering the CSS
     transition back to visible.
  ═══════════════════════════════════════════ */

  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed we don't need to observe it anymore
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      // Fire when 10% of the element is visible
      threshold: 0.1,
      // Start slightly before it reaches the viewport edge
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════════════════
     5. ACTIVE NAV LINK HIGHLIGHTING
     As the user scrolls, we determine which
     section is currently most visible and add
     the .active class to its matching nav link.
  ═══════════════════════════════════════════ */

  // All sections that have matching nav links
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('a.nav-link');

  /**
   * Find which section is currently in the viewport
   * and highlight the matching nav link.
   */
  function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Update nav links
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href'); // e.g. "#about"
      if (href === '#' + currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav(); // Run once on load


  /* ═══════════════════════════════════════════
     7. FOOTER — AUTO YEAR
     Keeps the copyright year always current
     without having to manually edit the HTML.
  ═══════════════════════════════════════════ */

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


}); // end DOMContentLoaded
