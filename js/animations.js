/* =========================================================
   animations.js — H@CKERBOY BLOG
   Scroll-reveal, effet "typing" du sous-titre, glitch du titre.
   Respecte prefers-reduced-motion.
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll reveal (cartes, sections, footer) ────── */
  function initReveal() {
    var targets = document.querySelectorAll(
      '.posts-grid article, .category-section h2, .post-hero, .post-body > *, footer .container > *'
    );
    if (!targets.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      /* Petit décalage en cascade pour les cartes d'une même grille */
      el.style.setProperty('--reveal-delay', (i % 4) * 70 + 'ms');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ── 2. Effet "typing" sur le sous-titre du hero ────── */
  function initTyping() {
    var el = document.querySelector('.post-hero .meta');
    if (!el || reduced) return;
    var full = el.textContent;
    el.textContent = '';
    el.classList.add('typing');
    el.setAttribute('aria-label', full);
    var i = 0;
    (function tick() {
      if (i <= full.length) {
        el.textContent = full.slice(0, i++);
        setTimeout(tick, 26);
      } else {
        el.classList.add('typing-done');
      }
    })();
  }

  /* ── 3. Glitch sur les titres H1 ────────────────────── */
  function initGlitch() {
    var h1 = document.querySelector('.post-hero h1');
    if (!h1 || reduced) return;
    h1.classList.add('glitch');
    h1.setAttribute('data-text', h1.textContent);
  }

  /* ── 4. Barre de progression de lecture (articles) ──── */
  function initProgress() {
    if (!document.querySelector('.post-body') || reduced) return;
    var bar = document.createElement('div');
    bar.className = 'read-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function init() {
    initReveal();
    initTyping();
    initGlitch();
    initProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
