/* ══════════════════════════════════════════════
   EMMANUEL WEBSITE DESIGN — SCRIPT.JS
   ══════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

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

  // Load saved preference or system preference
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

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateActiveNav();
  };

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

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ─── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile menu if open
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse?.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        bsCollapse?.hide();
      }

      const offset = navbar?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─── INTERSECTION OBSERVER: REVEAL ANIMATIONS ─── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Hero elements visible on load
  document.querySelectorAll('.hero-section .reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });


  /* ─── ANIMATED COUNTERS ─── */
  const counterEls   = document.querySelectorAll('[data-count]');
  let countersStarted = false;

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counterEls.forEach(el => animateCounter(el));
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroTrust = document.querySelector('.hero-trust');
  if (heroTrust) counterObserver.observe(heroTrust);


  /* ─── NAVBAR MOBILE HAMBURGER ANIMATION ─── */
  const navToggler  = document.querySelector('.navbar-toggler');
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


  /* ─── WHATSAPP FAB: HIDE ON SMALL SCREENS WHEN KEYBOARD OPEN ─── */
  // (handles iOS keyboard pushing content)
  const fab = document.querySelector('.whatsapp-fab');
  let lastHeight = window.innerHeight;
  window.addEventListener('resize', () => {
    if (!fab) return;
    const diff = lastHeight - window.innerHeight;
    fab.style.display = diff > 150 ? 'none' : '';
  });


  /* ─── SUBTLE CARD TILT (desktop only) ─── */
  const isMobile = () => window.innerWidth < 768;

  const tiltCards = document.querySelectorAll('.service-card, .portfolio-card:not(.cta-card)');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (isMobile()) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });


  /* ─── PROCESS STEP HIGHLIGHT ON SCROLL ─── */
  const processSteps = document.querySelectorAll('.process-step');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.process-icon')?.classList.add('step-active');
      }
    });
  }, { threshold: 0.6 });

  processSteps.forEach(step => stepObserver.observe(step));

});