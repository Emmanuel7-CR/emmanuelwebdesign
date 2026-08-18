/* ══════════════════════════════════════════════
   EMMANUEL — SCRIPT.JS
   ══════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── THEME TOGGLE ─── */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = document.getElementById('themeIcon');

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('em-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark'
        ? 'bi bi-moon-stars-fill'
        : 'bi bi-sun-fill';
    }
  };

  const saved    = localStorage.getItem('em-theme');
  const prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefDark ? 'dark' : 'light'));

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });


  /* ─── NAVBAR: SCROLL STATE + ACTIVE LINKS ─── */
  const navbar   = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    const sections  = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateActiveNav();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ─── SMOOTH SCROLL (with mobile menu close) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const navCollapse = document.getElementById('navMenu');
      if (navCollapse?.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        bsCollapse?.hide();
      }

      const offset = navbar?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });


  /* ─── INTERSECTION OBSERVER: REVEAL ANIMATIONS ─── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));

    document.querySelectorAll('.hero-section .reveal-up').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 100);
    });
  }


  /* ─── NAVBAR MOBILE HAMBURGER ANIMATION ─── */
  const bars        = document.querySelectorAll('.toggler-bar');
  const navCollapse = document.getElementById('navMenu');

  if (navCollapse && bars.length) {
    navCollapse.addEventListener('show.bs.collapse', () => {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity   = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    });
    navCollapse.addEventListener('hide.bs.collapse', () => {
      bars[0].style.transform = '';
      bars[1].style.opacity   = '';
      bars[2].style.transform = '';
    });
  }


  /* ─── FOOTER YEAR ─── */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─── PROCESS STEP HIGHLIGHT ON SCROLL ─── */
  const processSteps = document.querySelectorAll('.process-step');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('step-active');
      }
    });
  }, { threshold: 0.5 });

  processSteps.forEach(step => stepObserver.observe(step));

});
