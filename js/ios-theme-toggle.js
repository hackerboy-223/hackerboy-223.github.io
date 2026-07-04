/* =========================================================
   ios-theme-toggle.js — bascule thème clair / sombre
   - Persiste le choix dans localStorage ('hb-theme')
   - Respecte prefers-color-scheme par défaut
   - Cible le bouton #theme-toggle présent dans le header
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEY = 'hb-theme';

  function currentPref() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* mode privé */ }
    if (saved === 'dark' || saved === 'light') return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }

  function apply(theme) {
    root.classList.toggle('dark', theme === 'dark');
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    }
  }

  // Appliquer au plus tôt pour éviter le flash
  apply(currentPref());

  document.addEventListener('DOMContentLoaded', function () {
    apply(currentPref());
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.classList.contains('dark') ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
      apply(next);
    });
  });
})();
