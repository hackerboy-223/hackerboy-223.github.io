/* =========================================================
   dynamic.js — H@CKERBOY BLOG
   1. Peuple la page d'accueil depuis data/posts.json
   2. Anime le fond (.background-mesh) en canvas léger
   Les pages d'articles restent statiques (contenu riche) :
   le JSON ne sert que de source pour les cartes de l'index.
   ========================================================= */
(function () {
  'use strict';

  var IS_INDEX = /\/$|\/index\.html$/.test(location.pathname);

  /* ── Data ──────────────────────────────────────────── */
  async function fetchPosts() {
    try {
      var res = await fetch('data/posts.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      console.error('Impossible de charger posts.json :', e);
      return null; // on garde le HTML statique en secours
    }
  }

  function formatDateFr(iso) {
    try {
      return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch (e) {
      return iso;
    }
  }

  /* ── Cartes d'articles (index) ─────────────────────── */
  function renderCard(post) {
    var article = document.createElement('article');
    article.id = post.id;

    if (post.image) {
      var img = document.createElement('img');
      img.className = 'card-thumb';
      img.src = post.image;
      img.alt = post.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      article.appendChild(img);
    }

    var meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = 'Publié le ' + formatDateFr(post.date) + ' | Par ' + post.author;
    article.appendChild(meta);

    var h3 = document.createElement('h3');
    h3.textContent = post.title;
    article.appendChild(h3);

    var p = document.createElement('p');
    p.className = 'content';
    p.textContent = post.excerpt;
    article.appendChild(p);

    var a = document.createElement('a');
    a.className = 'read-more';
    a.href = './posts/' + post.slug + '.html';
    a.textContent = 'Lire la suite';
    a.setAttribute('aria-label', 'Lire la suite : ' + post.title);
    article.appendChild(a);

    return article;
  }

  function populateIndex(posts) {
    document.querySelectorAll('.posts-grid').forEach(function (grid) {
      var section = grid.closest('.category-section');
      var category = section ? section.id : null;
      var matching = posts.filter(function (p) {
        return !category || p.category === category;
      });
      if (matching.length === 0) return; // ne pas vider une grille sans données
      grid.innerHTML = '';
      matching.forEach(function (p) { grid.appendChild(renderCard(p)); });
    });
  }

  /* ── Fond animé (particules réseau) ────────────────── */
  function initMesh() {
    var host = document.querySelector('.background-mesh');
    if (!host) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dots = [];
    var N = 42;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function seed() {
      dots = [];
      for (var i = 0; i < N; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var dark = document.documentElement.classList.contains('dark');
      var dotColor = dark ? 'rgba(0,229,204,0.5)' : 'rgba(0,113,227,0.35)';
      var lineColor = dark ? 'rgba(0,229,204,' : 'rgba(0,113,227,';

      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        for (var j = i + 1; j < dots.length; j++) {
          var e = dots[j];
          var dx = d.x - e.x, dy = d.y - e.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(e.x, e.y);
            ctx.strokeStyle = lineColor + (0.12 * (1 - dist / 140)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', function () { resize(); seed(); });
    resize();
    seed();
    requestAnimationFrame(tick);
  }

  /* ── Init ──────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async function () {
    initMesh();
    if (!IS_INDEX) return;
    var posts = await fetchPosts();
    if (posts && posts.length) populateIndex(posts);
  });
})();
