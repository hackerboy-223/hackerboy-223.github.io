/* Immersive editorial scroll — native APIs, accessible, no external dependencies.
 * 1) progressive reveals 2) reading progress 3) sticky story image crossfades
 * No scroll hijacking, auto-play media or expensive full-page repaints. */
(() => {
  'use strict';
  const body = document.body;
  if (!body) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canObserve = 'IntersectionObserver' in window;
  const hasFrame = 'requestAnimationFrame' in window;
  const home = body.dataset.page === 'home';

  const progress = document.createElement('div');
  progress.className = 'immersive-progress';
  progress.setAttribute('aria-hidden', 'true');
  body.appendChild(progress);

  const story = document.querySelector('[data-story]');
  const steps = story ? [...story.querySelectorAll('[data-story-chapter]')] : [];
  const media = story ? [...story.querySelectorAll('.db-story-media')] : [];
  const bars = story ? [...story.querySelectorAll('.db-story-track span')] : [];
  const caption = story?.querySelector('[data-story-caption]');
  const counter = story?.querySelector('[data-story-count]');
  const titles = ['Diamond Block', 'MaliBots Challenge', 'Recherche & IA'];
  let lastActive = -1;
  function activate(index) {
    if (index < 0 || index >= steps.length || index === lastActive) return;
    lastActive = index;
    steps.forEach((step, i) => step.classList.toggle('is-current', i === index));
    media.forEach((item, i) => item.classList.toggle('is-current', i === index));
    bars.forEach((bar, i) => {
      bar.classList.toggle('is-current', i === index);
      bar.classList.toggle('is-past', i < index);
    });
    if (caption) caption.textContent = titles[index] || '';
    if (counter) counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(steps.length).padStart(2, '0');
  }

  // Always preserve all text in reading order. Without JavaScript the chapters stay visible.
  if (story && steps.length) {
    story.closest('.db-story')?.classList.remove('db-story-nojs');
    activate(0);
  }

  if (canObserve && hasFrame && !reduced.matches) {
    const selectors = home
      ? '.section-heading, .project-card, .post-card, .expertise-item, .proof-grid > div, .exploit-feature, .social-card, .db-story-heading, .db-story-chapter, .about-grid > div'
      : '.page-intro, .case-hero, .article-hero, .profile-fact, .case-aside-card, .timeline-item, .course-card, .article-content > p, .social-card, .section-action';
    const candidates = [...document.querySelectorAll(selectors)].filter(el => {
      if (el.classList.contains('reveal')) return false; // other pages already reveal via site.js
      if (el.matches('[hidden], .is-hidden') || el.closest('[hidden], .is-hidden')) return false;
      return true;
    });
    const targets = [...new Set(candidates)];
    targets.forEach((el, index) => {
      el.setAttribute('data-immersive', '');
      el.style.setProperty('--immersive-delay', (index % 4) * 50 + 'ms');
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * .9 && r.bottom > 0) el.classList.add('is-visible');
    });
    if (targets.length) {
      document.documentElement.classList.add('immersive-ready');
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.05, rootMargin: '0px 0px -28px 0px' });
      targets.filter(el => !el.classList.contains('is-visible')).forEach(el => observer.observe(el));
    }
  }

  let scheduled = false;
  function update() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, window.scrollY / max)) + ')';

    if (steps.length && window.innerWidth > 980) {
      const viewMid = window.innerHeight * .53;
      let closest = 0;
      let distance = Infinity;
      for (let i = 0; i < steps.length; i++) {
        const rect = steps[i].getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const nextDistance = Math.abs(midpoint - viewMid);
        if (nextDistance < distance) {
          distance = nextDistance;
          closest = i;
        }
      }
      activate(closest);
      if (!reduced.matches) {
        const rect = steps[closest].getBoundingClientRect();
        const raw = (viewMid - rect.top) / Math.max(rect.height, 1);
        const fraction = Math.max(0, Math.min(1, raw));
        const currentBar = bars[closest];
        if (currentBar) currentBar.style.setProperty('--chapter-progress', fraction.toFixed(3));
        const visual = story.querySelector('.db-story-visual');
        if (visual) {
          visual.style.setProperty('--story-scale', (1.045 - fraction * .045).toFixed(4));
          visual.style.setProperty('--story-shift', ((.5 - fraction) * 7).toFixed(2) + 'px');
          visual.style.setProperty('--caption-shift', ((1 - fraction) * 8).toFixed(2) + 'px');
        }
      }
    }
    scheduled = false;
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    if (hasFrame) requestAnimationFrame(update);
    else update();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule, { passive: true });
  schedule();
})();