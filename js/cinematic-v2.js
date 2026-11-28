/* Cinematic interaction layer: pointer spotlights, hero parallax, and motion-safe card sheen. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  if (!body) return;

  const isHome = body.dataset.page === 'home';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (isHome) body.classList.add('cinema-v2');
  if (reduce.matches || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  const hero = isHome ? document.querySelector('.portfolio-hero') : null;
  if (hero) {
    let frame = 0;
    let pointerX = 50;
    let pointerY = 35;
    let scrollY = window.scrollY;
    const paint = () => {
      root.style.setProperty('--hb-cinema-x', pointerX.toFixed(2) + '%');
      root.style.setProperty('--hb-cinema-y', pointerY.toFixed(2) + '%');
      const image = hero.querySelector('.portfolio-hero-image');
      if (image && scrollY < window.innerHeight) {
        image.style.transform = 'translate3d(0,' + Math.min(scrollY * .055, 28).toFixed(1) + 'px,0) scale(1.035)';
      }
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
      pointerY = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
      schedule();
    }, { passive: true });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; schedule(); }, { passive: true });
    hero.addEventListener('pointerleave', () => { pointerX = 50; pointerY = 35; schedule(); });
  }

  /* Local radial sheen for interactive cards on desktop fine pointers. */
  const sheenTargets = document.querySelectorAll('.project-card, .post-card, .expertise-item, .stack-group, .social-card, .hero-console, .cv-side-card');
  sheenTargets.forEach(card => {
    let cardRaf = 0;
    let mx = 50;
    let my = 50;
    const apply = () => {
      card.style.setProperty('--card-mx', mx.toFixed(1) + '%');
      card.style.setProperty('--card-my', my.toFixed(1) + '%');
      cardRaf = 0;
    };
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      mx = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 100;
      my = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100;
      if (!cardRaf) cardRaf = requestAnimationFrame(apply);
    }, { passive: true });
  });
})();
