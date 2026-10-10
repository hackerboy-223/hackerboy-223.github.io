/* Immersive scroll: native IntersectionObserver + one passive scroll listener. */
(() => {
  'use strict';
  if (document.body.dataset.page !== 'home' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window) || !('requestAnimationFrame' in window)) return;
  const sections = document.querySelectorAll('main > section:not(.portfolio-hero)');
  const items = [];
  sections.forEach(section => {
    const heading = section.querySelector('.section-heading, .exploit-copy, .about-grid, .contact-copy, .proof-grid, .portfolio-about .shell');
    if (heading) items.push(heading);
    const tiles = section.querySelectorAll('.project-card, .expertise-item, .post-card, .proof-grid > div, .social-card');
    tiles.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', Math.min(i % 4, 3) * 75 + 'ms');
      items.push(el);
    });
  });
  const targets = [...new Set(items)].filter(el => !el.closest('[hidden], .is-hidden'));
  if (!targets.length) return;
  targets.forEach(el => el.dataset.reveal = '');
  // Don't conceal content if a previous-page scroll restoration lands below it.
  const alreadyVisible = el => el.getBoundingClientRect().bottom > 0 && el.getBoundingClientRect().top < window.innerHeight;
  targets.filter(alreadyVisible).forEach(el => el.classList.add('is-visible'));
  const progress = document.createElement('div');
  progress.className = 'immersive-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.documentElement.classList.add('immersive-ready');
  targets.filter(el => !el.classList.contains('is-visible')).forEach(el => observer.observe(el));
  let scheduled = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1) + ')';
    scheduled = false;
  };
  const onScroll = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
