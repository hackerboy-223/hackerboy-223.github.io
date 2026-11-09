/* Spatial project passage. Native scroll + CSS 3D transforms; no scroll hijacking. */
(() => {
  'use strict';
  const section = document.querySelector('[data-hb3d-scroll]');
  if (!section) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const world = section.querySelector('.hb3d-world');
  const progress = section.querySelector('.hb3d-progress');
  if (!world || reduced.matches || saveData) {
    section.classList.add('hb3d-static');
    return;
  }

  let frame = 0;
  let current = 0;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function render() {
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const amount = clamp(-rect.top / travel, 0, 1);
    const camera = amount * 1180;
    const tilt = Math.sin(amount * Math.PI) * -2.4;
    world.style.setProperty('--hb3d-camera', camera.toFixed(1) + 'px');
    world.style.setProperty('--hb3d-tilt', tilt.toFixed(2) + 'deg');
    section.style.setProperty('--hb3d-progress', amount.toFixed(3));
    if (progress) progress.setAttribute('aria-valuenow', String(Math.round(amount * 100)));
    const next = Math.min(3, Math.floor(amount * 4));
    if (next !== current) {
      current = next;
      section.dataset.chapter = String(next + 1);
    }
    frame = 0;
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(render);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule, { passive: true });
  render();
})();
