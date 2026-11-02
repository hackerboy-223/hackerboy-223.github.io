/* Cinematic interaction layer. No scroll hijacking, no autoplay media. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  if (!body || body.dataset.page !== 'home') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  body.classList.add('cinema-v2');
  if (reduce.matches || !window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

  const hero = document.querySelector('.portfolio-hero');
  if (!hero) return;
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
    pointerX = ((event.clientX - rect.left) / rect.width) * 100;
    pointerY = ((event.clientY - rect.top) / rect.height) * 100;
    schedule();
  }, {passive:true});
  window.addEventListener('scroll', () => { scrollY = window.scrollY; schedule(); }, {passive:true});
  hero.addEventListener('pointerleave', () => { pointerX = 50; pointerY = 35; schedule(); });
})();
