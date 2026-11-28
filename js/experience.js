/* Lightweight sitewide experience: pro SVG iconography, command palette, scroll progress ring, and interactive learning path. */
(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ICON_SHAPES = {
    'arrow-right': ['path', 'M5 12h14 m-7-7 7 7-7 7'],
    'arrow-up-right': ['path', 'M7 17 17 7 M7 7h10v10'],
    'arrow-down': ['path', 'M12 5v14 m-7-7 7 7 7-7'],
    'arrow-up': ['path', 'M12 19V5 m-7 7 7-7 7 7'],
    'search': ['circle', '11 11 7', 'path', 'm21 21-4.3-4.3'],
    'check': ['path', 'M20 6 9 17l-5-5'],
    'check-circle': ['circle', '12 12 9', 'path', 'm8 12 2.5 2.5L16 9'],
    'code': ['path', 'm8 8-4 4 4 4 M16 8l4 4-4 4 M14 4l-4 16'],
    'layers': ['path', 'm12 2 9 5-9 5-9-5 9-5Z M3 12l9 5 9-5 M3 17l9 5 9-5'],
    'shield': ['path', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z m-3-10 2 2 4-4'],
    'brain': ['path', 'M12 18V5a3 3 0 0 0-5.8-1 M12 18V5a3 3 0 0 1 5.8-1 M8 18c-4 1-7-3-5-6-2-3 0-6 3-6 M16 18c4 1 7-3 5-6 2-3 0-6-3-6 M8 12h4m4-4v4m-4 6v4'],
    'terminal': ['rect', '3 4 18 16 2', 'path', 'm7 9 3 3-3 3 M13 16h4'],
    'book': ['path', 'M4 5.5C7 4 10 4 12 6v15c-2-2-5-2-8-1.2V5.5Z M20 5.5c-3-1.5-6-1.5-8 .5v15c2-2 5-2 8-1.2V5.5Z'],
    'target': ['circle', '12 12 9', 'circle', '12 12 5', 'circle', '12 12 1'],
    'graduation': ['path', 'm2 10 10-6 10 6-10 6-10-6Z M6 12v6c3.5 3 8.5 3 12 0v-6 M22 10v7'],
    'lightbulb': ['path', 'M9 18h6 M10 22h4 M9 14a6 6 0 1 1 6 0l-1 3h-4l-1-3Z'],
    'flask': ['path', 'M9 3h6 M10 3v7L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3 M8 16h8'],
    'external': ['path', 'M12 5h7v7 M19 5l-9 9 M19 14v5H5V5h5'],
    'lock': ['rect', '5 10 14 11 2', 'path', 'M8 10V7a4 4 0 0 1 8 0v3 M12 15v2'],
    'server': ['rect', '3 3 18 8 2', 'rect', '3 13 18 8 2', 'path', 'M7 7h.01 M7 17h.01 M11 7h6 M11 17h6'],
    'database': ['path', 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Z M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6'],
    'git-branch': ['circle', '6 6 2.5', 'circle', '18 8 2.5', 'circle', '6 18 2.5', 'path', 'M6 8.5v7 M18 10.5c0 4-6 3-12 5'],
    'clock': ['circle', '12 12 9', 'path', 'M12 7v5l4 2'],
    'globe': ['circle', '12 12 9', 'path', 'M3 12h18 M12 3a15 15 0 0 1 0 18 M12 3a15 15 0 0 0 0 18'],
    'award': ['circle', '12 9 6', 'path', 'M8.5 14.5 7 22l5-2.6L17 22l-1.5-7.5'],
    'cpu': ['rect', '6 6 12 12 2', 'rect', '9 9 6 6 1', 'path', 'M9 2v4 M15 2v4 M9 18v4 M15 18v4 M2 9h4 M2 15h4 M18 9h4 M18 15h4'],
    'wrench': ['path', 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z'],
    'sparkles': ['path', 'm12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z'],
    'shopping-bag': ['path', 'M6 8h12l1 12H5L6 8Z M9 8V6a3 3 0 0 1 6 0v2'],
    'copy': ['rect', '9 9 11 11 2', 'path', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
    'printer': ['path', 'M6 9V3h12v6 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v7H6z'],
    'link': ['path', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
    'user': ['circle', '12 8 4', 'path', 'M4 20a8 8 0 0 1 16 0'],
    'folder': ['path', 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z'],
    'compass': ['circle', '12 12 9', 'path', 'm15.5 8.5-2.1 5.6-5.6 2.1 2.1-5.6 5.6-2.1Z']
  };

  function makeIcon(name, strokeWidth = '1.85') {
    const parts = ICON_SHAPES[name] || ICON_SHAPES['arrow-up-right'];
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', strokeWidth);
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('hb-icon');
    for (let i = 0; i < parts.length;) {
      const type = parts[i++], value = parts[i++];
      const node = document.createElementNS(SVG_NS, type);
      if (type === 'path') node.setAttribute('d', value);
      if (type === 'circle') {
        const [cx, cy, r] = value.split(' ');
        node.setAttribute('cx', cx);
        node.setAttribute('cy', cy);
        node.setAttribute('r', r);
      }
      if (type === 'rect') {
        const [x, y, w, h, r] = value.split(' ');
        Object.entries({ x, y, width: w, height: h, rx: r }).forEach(([k, v]) => node.setAttribute(k, v));
      }
      svg.appendChild(node);
    }
    return svg;
  }

  function addIcon(parent, name, where = 'start') {
    if (!parent || parent.querySelector(':scope > .hb-icon')) return;
    if (where === 'end') parent.appendChild(makeIcon(name));
    else parent.prepend(makeIcon(name));
  }

  /* 1) Global navigation, command palette, and circular-ring back-to-top button. */
  (() => {
    const body = document.body;
    const main = document.querySelector('main');
    if (!body || !main) return;
    if (!main.id) main.id = 'main-content';

    const skip = document.createElement('a');
    skip.className = 'skip-to-content';
    skip.href = '#' + main.id;
    skip.textContent = 'Aller au contenu';
    body.insertBefore(skip, body.firstChild);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && typeof MutationObserver !== 'undefined') {
      const sync = () => meta.setAttribute('content', document.documentElement.dataset.theme === 'light' ? '#f8f9fc' : '#131a24');
      sync();
      new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    const header = document.querySelector('.header-actions');
    if (header && 'HTMLDialogElement' in window) {
      const openerButton = document.createElement('button');
      openerButton.type = 'button';
      openerButton.className = 'command-launch';
      openerButton.title = 'Explorer le portfolio (Ctrl + K)';
      openerButton.setAttribute('aria-label', 'Explorer les pages du portfolio');
      openerButton.setAttribute('aria-keyshortcuts', 'Control+K Meta+K');
      const glyph = document.createElement('span');
      glyph.className = 'command-glyph';
      glyph.setAttribute('aria-hidden', 'true');
      glyph.appendChild(makeIcon('search'));
      const label = document.createElement('span');
      label.className = 'command-text';
      label.textContent = 'Explorer';
      const key = document.createElement('kbd');
      key.textContent = /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘ K' : 'Ctrl K';
      openerButton.append(glyph, label, key);
      header.insertBefore(openerButton, header.querySelector('#theme-toggle'));

      const pages = [
        { name: 'Accueil', detail: 'Retour au début', url: '/', keywords: 'home' },
        { name: 'ZeroCode', detail: 'Agent de codage terminal · Étude de cas', url: '/projects/zerocode.html', keywords: 'python cli tui agent ia open source' },
        { name: 'Diamond Block', detail: 'Boutique e-commerce · Étude de cas', url: '/projects/diamond-block.html', keywords: 'nextjs supabase vente ecommerce' },
        { name: 'Projets', detail: 'Applications, produits et expérimentations', url: '/projects.html', keywords: 'portfolio code developpement' },
        { name: 'MaliBots Challenge', detail: 'Médaille d’or 2025 · Développement Web', url: '/exploits.html', keywords: 'exploits concours victoire' },
        { name: 'Expertise', detail: 'Web, IA, cybersécurité et cloud', url: '/#expertise', keywords: 'competences skills' },
        { name: 'Parcours débutant', detail: 'Huit cours progressifs, ateliers et quiz', url: '/#apprendre', keywords: 'apprendre debutant apprendre bases formations cours html css javascript python' },
        { name: 'Cours : Bases informatiques', detail: 'Comprendre matériel, système et réseau', url: '/posts/post1.html', keywords: 'informatique bits octets dns systeme' },
        { name: 'Cours : HTML', detail: 'Créer un contenu sémantique et accessible', url: '/posts/post3.html', keywords: 'balises html site formulaire' },
        { name: 'Cours : CSS', detail: 'Concevoir un responsive élégant', url: '/posts/post4.html', keywords: 'grille flexbox cascade' },
        { name: 'Cours : JavaScript', detail: 'Comprendre la logique DOM et les événements', url: '/posts/post5.html', keywords: 'js variables fonctions événements' },
        { name: 'Cours : Python', detail: 'Apprendre fonctions, listes et contrôle', url: '/posts/post6.html', keywords: 'python programmation debutant' },
        { name: 'Cours : Git et publication', detail: 'Versionner et déployer un site', url: '/posts/post7.html', keywords: 'git github pages commits' },
        { name: 'Cours : Éthique numérique', detail: 'Responsabilité et analyse défensive', url: '/posts/post2.html', keywords: 'hacking autorisation ethique' },
        { name: 'Cours : Sécurité Web', detail: 'Défendre une application dès la conception', url: '/posts/post8.html', keywords: 'securite owasp defense' },
        { name: 'Journal', detail: 'Articles et découvertes techniques', url: '/#articles', keywords: 'blog tutoriels cours' },
        { name: 'À propos', detail: 'Parcours, formation et vision', url: '/about.html', keywords: 'profil biographie' },
        { name: 'CV', detail: 'Compétences, formation et projets sélectionnés', url: '/cv.html', keywords: 'curriculum vitae experience compétences recrutement' },
        { name: 'Contact', detail: 'Liens et réseaux professionnels', url: '/#contact', keywords: 'linkedin whatsapp' },
        { name: 'GitHub', detail: 'Code et projets publics', url: 'https://github.com/hackerboy-223', keywords: 'repository depot source' }
      ];
      const dialog = document.createElement('dialog');
      dialog.className = 'palette-dialog';
      dialog.setAttribute('aria-label', 'Navigation rapide du portfolio');

      const top = document.createElement('div');
      top.className = 'palette-header';
      const icon = document.createElement('span');
      icon.className = 'palette-search-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.appendChild(makeIcon('search'));
      const input = document.createElement('input');
      input.type = 'search';
      input.className = 'palette-input';
      input.placeholder = 'Un projet, une page, une compétence…';
      input.autocomplete = 'off';
      input.maxLength = 100;
      input.setAttribute('aria-label', 'Rechercher une page ou un projet');
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'palette-close';
      close.textContent = 'Échap';
      close.setAttribute('aria-label', 'Fermer la navigation rapide');
      top.append(icon, input, close);
      const results = document.createElement('nav');
      results.className = 'palette-results';
      results.setAttribute('aria-label', 'Résultats de recherche');
      const bottom = document.createElement('div');
      bottom.className = 'palette-footer';
      const tip = document.createElement('span');
      tip.textContent = '↑ ↓ Naviguer · Entrée Ouvrir';
      const stamp = document.createElement('span');
      stamp.textContent = 'H@CKERBOY / COMMAND';
      bottom.append(tip, stamp);
      dialog.append(top, results, bottom);
      body.appendChild(dialog);

      const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      let visible = pages;
      let selected = 0;
      let trigger = null;
      function select(index) {
        selected = index;
        results.querySelectorAll('.palette-result').forEach((node, i) => node.classList.toggle('is-active', i === selected));
      }
      function render() {
        const words = normalize(input.value).split(/\s+/).filter(Boolean);
        visible = pages.filter(p => words.every(word => normalize(p.name + ' ' + p.detail + ' ' + p.keywords).includes(word)));
        results.replaceChildren();
        selected = 0;
        if (!visible.length) {
          const none = document.createElement('p');
          none.className = 'palette-empty';
          none.textContent = 'Aucun résultat. Essaie « projets », « IA » ou « contact ».';
          results.appendChild(none);
          return;
        }
        visible.forEach((page, index) => {
          const a = document.createElement('a');
          a.className = 'palette-result';
          a.href = page.url;
          if (page.url.startsWith('https://')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
          const info = document.createElement('span');
          const title = document.createElement('strong');
          title.textContent = page.name;
          const detail = document.createElement('small');
          detail.textContent = page.detail;
          info.append(title, detail);
          const arrow = document.createElement('span');
          arrow.className = 'palette-arrow';
          arrow.setAttribute('aria-hidden', 'true');
          arrow.appendChild(makeIcon('arrow-up-right'));
          a.append(info, arrow);
          a.addEventListener('mouseenter', () => select(index));
          a.addEventListener('click', () => dialog.close());
          results.appendChild(a);
        });
        select(0);
      }
      function open() {
        if (dialog.open) return;
        trigger = document.activeElement;
        input.value = '';
        render();
        dialog.showModal();
        input.focus();
      }
      openerButton.addEventListener('click', open);
      close.addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => {
        if (trigger && trigger.isConnected && typeof trigger.focus === 'function') trigger.focus();
      });
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const r = dialog.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
      });
      input.addEventListener('input', render);
      input.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown' && visible.length) { event.preventDefault(); select((selected + 1) % visible.length); }
        if (event.key === 'ArrowUp' && visible.length) { event.preventDefault(); select((selected - 1 + visible.length) % visible.length); }
        if (event.key === 'Enter' && visible.length) {
          event.preventDefault();
          const link = results.querySelectorAll('.palette-result')[selected];
          if (link) link.click();
        }
      });
      document.addEventListener('keydown', event => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          if (dialog.open) dialog.close(); else open();
        }
      });
    }

    const up = document.createElement('button');
    up.type = 'button';
    up.className = 'back-to-top';
    up.setAttribute('aria-label', 'Retour en haut de la page');
    up.title = 'Retour en haut';

    const ring = document.createElementNS(SVG_NS, 'svg');
    ring.classList.add('back-to-top-ring');
    ring.setAttribute('viewBox', '0 0 44 44');
    ring.setAttribute('aria-hidden', 'true');
    const track = document.createElementNS(SVG_NS, 'circle');
    track.setAttribute('cx', '22'); track.setAttribute('cy', '22'); track.setAttribute('r', '20');
    track.classList.add('back-to-top-track');
    const arc = document.createElementNS(SVG_NS, 'circle');
    arc.setAttribute('cx', '22'); arc.setAttribute('cy', '22'); arc.setAttribute('r', '20');
    arc.classList.add('back-to-top-arc');
    const circumference = 2 * Math.PI * 20;
    arc.style.strokeDasharray = circumference.toFixed(2);
    arc.style.strokeDashoffset = circumference.toFixed(2);
    ring.append(track, arc);
    up.append(ring, makeIcon('arrow-up'));
    body.appendChild(up);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    up.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced.matches ? 'instant' : 'smooth' }));
    let raf = false;
    const update = () => {
      up.classList.toggle('is-visible', window.scrollY > 650);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      arc.style.strokeDashoffset = (circumference * (1 - ratio)).toFixed(2);
      raf = false;
    };
    window.addEventListener('scroll', () => { if (raf) return; raf = true; requestAnimationFrame(update); }, { passive: true });
    update();
  })();

  /* 2) Pro vector iconography across cards, badges, stack groups, CV, and course widgets. */
  (() => {
    // Replace decorative arrows cleanly without duplicating existing arrow glyphs.
    document.querySelectorAll('a.project-link, a.text-link, a.button, button.button, a.header-cta, a.db-chapter-link, a.manifesto-link, .hero-discovery a').forEach(el => {
      if (el.id === 'cv-print') {
        const arrowSpan = [...el.children].find(c => c.tagName === 'SPAN');
        if (arrowSpan) arrowSpan.remove();
        addIcon(el, 'printer', 'start');
        return;
      }
      const existing = [...el.children].find(child => child.tagName === 'SPAN' && /^[→↗↘↓]+$/.test(child.textContent.trim()));
      if (existing) {
        const glyph = existing.textContent.trim();
        existing.replaceWith(makeIcon(glyph === '↓' ? 'arrow-down' : glyph === '→' ? 'arrow-right' : 'arrow-up-right'));
        return;
      }
      const lastText = [...el.childNodes].reverse().find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      const trailing = lastText?.textContent.match(/\s*([→↗↘↓]+)\s*$/);
      if (trailing) {
        const glyph = trailing[1];
        lastText.textContent = lastText.textContent.replace(/\s*[→↗↘↓]+\s*$/, '');
        addIcon(el, glyph === '↓' ? 'arrow-down' : glyph === '→' ? 'arrow-right' : 'arrow-up-right', 'end');
        return;
      }
      addIcon(el, el.classList.contains('button-primary') ? 'arrow-right' : 'arrow-up-right', 'end');
    });

    document.querySelectorAll('.social-arrow').forEach(el => {
      el.replaceChildren(makeIcon('arrow-up-right'));
    });

    document.querySelectorAll('.hb3d-project').forEach((card, index) => {
      const top = card.querySelector('.hb3d-project-top');
      const label = top?.querySelector('span:first-child');
      if (label) addIcon(label, ['shopping-bag', 'terminal', 'brain', 'layers'][index % 4]);
      const arrow = card.querySelector('.hb3d-project-arrow');
      if (arrow) arrow.replaceChildren(makeIcon('arrow-up-right'));
    });

    document.querySelectorAll('.proof-grid > div').forEach((item, index) => {
      const label = item.querySelector('.proof-label');
      if (label) addIcon(label, ['award', 'cpu', 'wrench'][index % 3]);
    });

    document.querySelectorAll('.stack-group h3').forEach((title, index) => {
      addIcon(title, ['code', 'server', 'database', 'git-branch'][index % 4]);
    });

    document.querySelectorAll('.exploit-badge').forEach(badge => addIcon(badge, 'award'));
    document.querySelectorAll('.featured-work-tag').forEach(tag => addIcon(tag, 'sparkles'));

    document.querySelectorAll('.expertise-item').forEach((item, index) => {
      const title = item.querySelector('h3');
      if (title) addIcon(title, ['code', 'brain', 'shield', 'server'][index % 4]);
    });

    document.querySelectorAll('.cv-section h2').forEach((h2, index) => {
      addIcon(h2, ['user', 'folder', 'graduation', 'award'][index % 4]);
    });
    document.querySelectorAll('.cv-side-card h2').forEach((h2, index) => {
      addIcon(h2, ['layers', 'compass', 'sparkles'][index % 3]);
    });

    document.querySelectorAll('.course-objectives h2').forEach(el => addIcon(el, 'target'));
    document.querySelectorAll('.course-summary h2').forEach(el => addIcon(el, 'check-circle'));
    document.querySelectorAll('.exercise-card h2').forEach(el => addIcon(el, 'flask'));
    document.querySelectorAll('.reference-box h2').forEach(el => addIcon(el, 'book'));
    document.querySelectorAll('.quiz-section h2').forEach(el => addIcon(el, 'lightbulb'));
    document.querySelectorAll('.guided-lab h2').forEach(el => addIcon(el, 'graduation'));
    document.querySelectorAll('.course-overview > div').forEach((el, i) => addIcon(el, ['book', 'clock', 'target'][i % 3]));
    document.querySelectorAll('.project-proof').forEach(el => {
      const first = el.querySelector('span');
      if (first) addIcon(first, 'check-circle');
    });
    document.querySelectorAll('.project-status').forEach(el => addIcon(el, 'check-circle'));
    document.querySelectorAll('a[href^="https://www.w3schools.com/"],a[href^="https://developer.mozilla.org/"]').forEach(el => {
      if (el.closest('.reference-list')) return;
      if (el.classList.contains('learning-resource')) addIcon(el, 'external', 'end');
    });

    const order = ['post1', 'post3', 'post4', 'post5', 'post6', 'post7', 'post2', 'post8'];
    const siteNav = document.querySelector('.site-nav');
    if (siteNav && !siteNav.querySelector('a[href$="#apprendre"]')) {
      const training = document.createElement('a');
      training.href = '/#apprendre';
      training.textContent = 'Apprendre';
      const articles = [...siteNav.querySelectorAll('a')].find(a => a.getAttribute('href')?.includes('#articles'));
      siteNav.insertBefore(training, articles || null);
    }

    const key = 'hb-learning-progress-v1';
    const getProgress = () => {
      try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(value) ? value.filter(x => order.includes(x)) : [];
      } catch (_) { return []; }
    };
    const updateProgress = () => {
      const learned = getProgress();
      document.querySelectorAll('[data-learning-count]').forEach(node => node.textContent = String(learned.length) + ' / ' + order.length);
      document.querySelectorAll('[data-learning-item]').forEach(node => {
        const done = learned.includes(node.getAttribute('data-learning-item'));
        node.classList.toggle('is-complete', done);
        const status = node.querySelector('.learning-status');
        if (status) status.textContent = done ? 'Terminé' : 'À explorer';
      });
      const courseContent = document.querySelector('article.article-content');
      const postSlug = document.body?.dataset.postSlug || '';
      if (courseContent && courseContent.querySelector('[data-course-complete]') && !order.includes(postSlug) && !document.querySelector('.learning-return')) {
        const returnLink = document.createElement('a');
        returnLink.className = 'learning-return';
        returnLink.href = '/#apprendre';
        returnLink.textContent = '← Retour au parcours débutant';
        courseContent.parentElement.insertBefore(returnLink, courseContent);
      }

      document.querySelectorAll('[data-course-complete]').forEach(button => {
        const done = learned.includes(button.dataset.courseComplete);
        button.setAttribute('aria-pressed', String(done));
        const txt = document.createElement('span');
        txt.textContent = done ? 'Leçon terminée' : 'Marquer cette leçon terminée';
        if (done) button.replaceChildren(makeIcon('check-circle'), txt);
        else button.replaceChildren(txt);
      });
    };
    document.querySelectorAll('[data-course-complete]').forEach(button => {
      button.addEventListener('click', () => {
        const slug = button.dataset.courseComplete;
        if (!order.includes(slug)) return;
        const list = getProgress();
        const next = list.includes(slug) ? list.filter(x => x !== slug) : [...list, slug];
        try { localStorage.setItem(key, JSON.stringify(next)); } catch (_) { button.title = 'Stockage local indisponible sur cet appareil'; }
        updateProgress();
      });
    });
    window.addEventListener('storage', event => { if (event.key === key) updateProgress(); });
    updateProgress();
  })();

  /* 3) Article UX v2: one reading system for all 9 posts. */
  (() => {
    if (document.body?.dataset.page !== 'article') return;
    const content = document.querySelector('.article-content');
    const aside = document.querySelector('.article-aside');
    const toc = document.querySelector('#toc');
    if (!content) return;

    function setButtonIconLabel(btn, iconName, text) {
      const label = document.createElement('span');
      label.textContent = text;
      btn.replaceChildren(makeIcon(iconName), label);
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'article-tools';
    toolbar.setAttribute('aria-label', 'Outils de lecture');
    const count = document.createElement('span');
    count.className = 'article-tools-count';
    const sections = [...content.children].filter(el => el.tagName === 'SECTION');
    count.textContent = sections.length + ' sections · Lecture guidée';
    const actions = document.createElement('div');
    actions.className = 'article-tools-actions';
    const linkButton = document.createElement('button');
    linkButton.type = 'button';
    setButtonIconLabel(linkButton, 'link', 'Copier le lien');
    linkButton.setAttribute('aria-label', 'Copier le lien de cet article');
    const printButton = document.createElement('button');
    printButton.type = 'button';
    setButtonIconLabel(printButton, 'printer', 'Imprimer');
    printButton.setAttribute('aria-label', 'Imprimer ou enregistrer cet article en PDF');
    actions.append(linkButton, printButton);
    toolbar.append(count, actions);
    content.prepend(toolbar);

    async function copyText(text) {
      if (!navigator.clipboard?.writeText) return false;
      try { await navigator.clipboard.writeText(text); return true; }
      catch (_) { return false; }
    }
    linkButton.addEventListener('click', async () => {
      const success = await copyText(window.location.href);
      setButtonIconLabel(linkButton, success ? 'check' : 'link', success ? 'Lien copié' : 'Copie non disponible');
      window.setTimeout(() => setButtonIconLabel(linkButton, 'link', 'Copier le lien'), 2100);
    });
    printButton.addEventListener('click', () => window.print());

    const labels = {
      post1: 'Informatique', post2: 'Logique défensive', post3: 'HTML',
      post4: 'CSS', post5: 'JavaScript', post6: 'Python',
      post7: 'Terminal Git', post8: 'Sécurité Web'
    };
    const post = document.body.dataset.postSlug;
    content.querySelectorAll('pre').forEach(pre => {
      if (pre.closest('.code-window')) return;
      const code = pre.querySelector('code');
      if (!code) return;
      const language = [...code.classList].find(value => value.startsWith('language-'));
      const name = language
        ? language.slice('language-'.length).toUpperCase()
        : (labels[post] || 'Exemple de code');
      const windowElement = document.createElement('div');
      windowElement.className = 'code-window';
      const top = document.createElement('div');
      top.className = 'code-window-top';
      const title = document.createElement('span');
      title.className = 'code-window-title';
      title.textContent = name;
      const copy = document.createElement('button');
      copy.className = 'code-copy';
      copy.type = 'button';
      setButtonIconLabel(copy, 'copy', 'Copier');
      copy.setAttribute('aria-label', 'Copier cet exemple de code');
      copy.addEventListener('click', async () => {
        const ok = await copyText(code.textContent || '');
        setButtonIconLabel(copy, ok ? 'check' : 'copy', ok ? 'Copié' : 'Copie non disponible');
        window.setTimeout(() => setButtonIconLabel(copy, 'copy', 'Copier'), 2100);
      });
      top.append(title, copy);
      pre.parentNode.insertBefore(windowElement, pre);
      windowElement.append(top, pre);
    });

    if (toc && aside) {
      const tocCard = toc.closest('.aside-card');
      if (tocCard) {
        const toggle = document.createElement('button');
        const tocLabel = tocCard.querySelector(':scope > .footer-label');
        toggle.type = 'button';
        toggle.className = 'toc-toggle';
        toggle.setAttribute('aria-controls', toc.id);
        toggle.setAttribute('aria-expanded', 'false');
        const caption = document.createElement('span');
        caption.textContent = tocLabel?.textContent || 'Sommaire du cours';
        const arrow = document.createElement('span');
        arrow.className = 'toc-chevron';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '⌄';
        toggle.append(caption, arrow);
        tocCard.insertBefore(toggle, toc);
        aside.classList.add('is-collapsible');
        toggle.addEventListener('click', () => {
          const open = aside.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', String(open));
        });
        toc.addEventListener('click', event => {
          if (event.target.closest('a') && window.matchMedia('(max-width: 780px)').matches) {
            aside.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      }

      const links = [...toc.querySelectorAll('a[href^="#"]')];
      const entries = links.map(a => ({
        link: a,
        heading: document.getElementById(a.getAttribute('href').slice(1))
      })).filter(item => item.heading);
      let ticking = false;
      function markChapter() {
        let current = 0;
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].heading.getBoundingClientRect().top <= Math.max(150, innerHeight * .26)) current = i;
        }
        entries.forEach((item, i) => {
          const active = i === current;
          item.link.classList.toggle('is-current', active);
          if (active) item.link.setAttribute('aria-current', 'location');
          else item.link.removeAttribute('aria-current');
        });
        ticking = false;
      }
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(markChapter);
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      window.addEventListener('pageshow', onScroll, { passive: true });
      markChapter();
    }
  })();

  /* 4) H@CKERBOY Quest — guided technical learning path. */
  (() => {
    const order = ['post1', 'post3', 'post4', 'post5', 'post6', 'post7', 'post2', 'post8'];
    const progressKey = 'hb-learning-progress-v1';
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const getDone = () => {
      try { const arr = JSON.parse(localStorage.getItem(progressKey) || '[]'); return Array.isArray(arr) ? arr : []; } catch (_) { return []; }
    };
    const icons = {
      post1: 'M4 5h16v14H4z M8 9h8 M8 13h5',
      post3: 'm8 7-5 5 5 5 M16 7l5 5-5 5',
      post4: 'M12 3 4 12l8 9 8-9-8-9z M8 13h8',
      post5: 'M12 3v5 M12 16v5 M3 12h5 M16 12h5 M6 6l3 3 M15 15l3 3 M18 6l-3 3 M9 15l-3 3',
      post6: 'M6 8a3 3 0 0 1 3-3h6v6H9v4 M18 16a3 3 0 0 1-3 3H9v-6h6V9',
      post7: 'M6 4v11 M18 4v5a5 5 0 0 1-5 5H6 M3 15h6 M15 4h6 M9 19H3',
      post2: 'M12 2 4 6v6c0 5 4 8 8 10 4-2 8-5 8-10V6l-8-4z M9 12l2 2 4-4',
      post8: 'M6 11V8a6 6 0 0 1 12 0v3 M5 11h14v11H5z M12 15v3'
    };
    function questIcon(path) {
      const node = document.createElementNS(SVG_NS, 'svg');
      node.setAttribute('viewBox', '0 0 24 24');
      node.setAttribute('fill', 'none'); node.setAttribute('stroke', 'currentColor');
      node.setAttribute('stroke-width', '2.4'); node.setAttribute('stroke-linecap', 'round');
      node.setAttribute('stroke-linejoin', 'round'); node.setAttribute('aria-hidden', 'true');
      const shape = document.createElementNS(SVG_NS, 'path');
      shape.setAttribute('d', path);
      node.append(shape);
      return node;
    }
    const learning = document.querySelector('.learning-section');
    if (learning) {
      const cards = [...learning.querySelectorAll('.learning-item[data-learning-item]')];
      const grid = learning.querySelector('.learning-grid');
      if (grid) grid.classList.add('quest-path');
      const intro = learning.querySelector('.learning-header');
      if (intro) {
        const mascot = document.createElement('div');
        mascot.className = 'quest-companion';
        mascot.setAttribute('aria-hidden', 'true');
        const face = document.createElement('div'); face.className = 'quest-companion-face';
        for (let i = 0; i < 2; i++) { const eye = document.createElement('span'); eye.className = 'quest-eye'; face.append(eye); }
        const smile = document.createElement('span'); smile.className = 'quest-smile'; face.append(smile);
        const sparkle = document.createElement('span'); sparkle.className = 'quest-sparkle';
        sparkle.appendChild(makeIcon('sparkles', '2'));
        mascot.append(face, sparkle);
        const bubble = document.createElement('div'); bubble.className = 'quest-companion-bubble';
        bubble.textContent = 'Ton prochain niveau t’attend !';
        mascot.append(bubble);
        intro.append(mascot);
      }
      cards.forEach((card, index) => {
        const node = document.createElement('span');
        node.className = 'quest-node';
        node.setAttribute('aria-hidden', 'true');
        node.append(questIcon(icons[card.dataset.learningItem] || icons.post1));
        card.prepend(node);
        card.style.setProperty('--quest-index', String(index));
      });
      function refresh() {
        const done = getDone();
        const active = cards.find(card => !done.includes(card.dataset.learningItem));
        cards.forEach(card => {
          const completed = done.includes(card.dataset.learningItem);
          card.classList.toggle('quest-completed', completed);
          card.classList.toggle('quest-current', card === active);
          const status = card.querySelector('.learning-status');
          if (status) {
            const label = document.createElement('span');
            label.textContent = completed ? 'Terminé' : card === active ? 'Commencer' : 'À explorer';
            if (completed) status.replaceChildren(makeIcon('check-circle'), label);
            else if (card === active) status.replaceChildren(label, makeIcon('arrow-right'));
            else status.replaceChildren(label);
          }
          if (card === active) card.setAttribute('aria-label', 'Prochaine étape : ' + (card.querySelector('h3')?.textContent || 'cours'));
          else card.removeAttribute('aria-label');
        });
        const bubble = learning.querySelector('.quest-companion-bubble');
        if (bubble) bubble.textContent = active ? 'Ta prochaine étape : ' + (active.querySelector('h3')?.textContent || 'apprendre') : 'Parcours terminé ! Bravo';
        const counter = learning.querySelector('[data-learning-count]');
        if (counter) counter.textContent = String(cards.filter(card => done.includes(card.dataset.learningItem)).length) + ' / ' + String(cards.length);
      }
      window.addEventListener('storage', event => { if (event.key === progressKey) refresh(); });
      refresh();
    }

    const slug = document.body?.dataset.postSlug;
    if (!order.includes(slug)) return;
    const article = document.querySelector('.article-content');
    const layout = document.querySelector('.article-layout');
    if (!article || !layout) return;
    const sections = [...article.children].filter(el => el.tagName === 'SECTION' && el.querySelector('h2'));
    if (sections.length < 3) return;
    const stages = [];
    let pair = [];
    const flush = () => { if (pair.length) { stages.push(pair); pair = []; } };
    for (const section of sections) {
      const heading = section.querySelector('h2')?.textContent?.trim() || '';
      if (/^\d+[.)]\s/.test(heading)) {
        pair.push(section);
        if (pair.length === 2) flush();
      } else {
        flush(); stages.push([section]);
      }
    }
    flush();
    if (!stages.length) return;

    const shell = document.createElement('div'); shell.className = 'quest-lesson-shell';
    const meta = document.createElement('div'); meta.className = 'quest-lesson-meta';
    const homeLink = document.createElement('a'); homeLink.className = 'quest-lesson-home';
    homeLink.href = '../index.html#apprendre'; homeLink.textContent = '← Parcours';
    const label = document.createElement('span'); label.className = 'quest-lesson-step-label';
    meta.append(homeLink, label);
    const rail = document.createElement('div'); rail.className = 'quest-lesson-rail';
    rail.setAttribute('role', 'progressbar'); rail.setAttribute('aria-label', 'Progression dans la leçon');
    rail.setAttribute('aria-valuemin', '0'); rail.setAttribute('aria-valuemax', String(stages.length));
    const railFill = document.createElement('div'); railFill.className = 'quest-lesson-rail-fill'; rail.append(railFill);
    const heading = document.createElement('div'); heading.className = 'quest-lesson-prompt';
    const ch = document.createElement('span'); ch.className = 'quest-lesson-kicker';
    const chText = document.createElement('span'); chText.textContent = 'MISSION D’APPRENTISSAGE';
    ch.append(makeIcon('sparkles'), chText);
    const title = document.createElement('h2'); title.className = 'quest-lesson-title';
    const subtitle = document.createElement('p'); subtitle.className = 'quest-lesson-subtitle';
    heading.append(ch, title, subtitle);
    const modeToggle = document.createElement('button'); modeToggle.type = 'button'; modeToggle.className = 'quest-mode-toggle';
    modeToggle.textContent = 'Afficher tout le cours';
    shell.append(meta, rail, heading, modeToggle);
    const tools = article.querySelector(':scope > .article-tools');
    if (tools) tools.after(shell); else article.prepend(shell);

    const controls = document.createElement('div'); controls.className = 'quest-lesson-controls';
    const prev = document.createElement('button'); prev.className = 'quest-action-back'; prev.type = 'button'; prev.textContent = '← Retour';
    const next = document.createElement('button'); next.className = 'quest-action-next'; next.type = 'button';
    const feedback = document.createElement('p'); feedback.className = 'quest-lesson-feedback';
    feedback.setAttribute('role', 'status'); feedback.setAttribute('aria-live', 'polite');
    controls.append(prev, feedback, next);
    article.append(controls);
    let current = 0;
    let full = false;
    const storage = 'hb-learning-step-v1-' + slug;
    const getSaved = () => { try { const value = Number(sessionStorage.getItem(storage)); return Number.isInteger(value) ? value : 0; } catch (_) { return 0; } };
    const saveStep = value => { try { sessionStorage.setItem(storage, String(value)); } catch (_) {} };
    const indexForHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return -1;
      return stages.findIndex(group => group.some(el => el.id === id || !!el.querySelector('#' + CSS.escape(id))));
    };
    function jumpToStage() {
      const top = shell.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'instant' : 'smooth' });
    }
    const stageTitle = index => {
      const titles = stages[index].map(el => el.querySelector('h2')?.textContent?.trim() || '').filter(Boolean);
      return titles.length === 1 ? titles[0] : titles.map(t => t.replace(/^\d+[.)]\s*/, '')).join(' + ');
    };
    function setActionButton(btn, text, iconName, where = 'end') {
      const span = document.createElement('span');
      span.textContent = text;
      if (where === 'start') btn.replaceChildren(makeIcon(iconName), span);
      else btn.replaceChildren(span, makeIcon(iconName));
    }
    function render(jump = false) {
      document.body.classList.toggle('quest-reading-full', full);
      const toolsCount = article.querySelector('.article-tools-count');
      if (full) {
        sections.forEach(el => el.hidden = false);
        label.textContent = 'Mode lecture complète';
        title.textContent = 'Tous les chapitres';
        subtitle.textContent = 'Fais défiler librement, ou reviens au parcours guidé.';
        if (toolsCount) toolsCount.textContent = sections.length + ' sections · Lecture complète';
        rail.setAttribute('aria-valuenow', String(stages.length));
        railFill.style.width = '100%';
        modeToggle.textContent = 'Revenir aux étapes';
        controls.hidden = true;
        if (jump) jumpToStage();
        return;
      }
      current = Math.max(0, Math.min(stages.length - 1, current));
      sections.forEach(el => el.hidden = true);
      stages[current].forEach(el => el.hidden = false);
      label.textContent = 'ÉTAPE ' + String(current + 1) + ' / ' + String(stages.length);
      title.textContent = stageTitle(current);
      subtitle.textContent = current === 0 ? 'Commence avec les bases : un sujet à la fois.' : current === stages.length - 1 ? 'Dernière étape ! Vérifie ce que tu as appris.' : 'Lis, teste les exemples et avance à ton rythme.';
      if (toolsCount) toolsCount.textContent = sections.length + ' sections · Lecture guidée';
      railFill.style.width = String((current + 1) / stages.length * 100) + '%';
      rail.setAttribute('aria-valuenow', String(current + 1));
      modeToggle.textContent = 'Afficher tout le cours';
      controls.hidden = false;
      prev.disabled = current === 0;
      if (current === stages.length - 1) setActionButton(next, 'Terminer la leçon', 'check-circle', 'start');
      else setActionButton(next, 'Continuer', 'arrow-right', 'end');
      feedback.textContent = '';
      saveStep(current);
      if (jump) jumpToStage();
    }
    const hashIndex = indexForHash();
    current = hashIndex >= 0 ? hashIndex : Math.max(0, Math.min(stages.length - 1, getSaved()));
    render();
    document.body.classList.add('quest-lesson-mode');
    prev.addEventListener('click', () => { if (current > 0) { current--; render(true); } });
    next.addEventListener('click', () => {
      if (current < stages.length - 1) { current++; render(true); return; }
      const mark = article.querySelector('[data-course-complete="' + slug + '"]');
      if (mark && mark.getAttribute('aria-pressed') !== 'true') mark.click();
      feedback.textContent = 'Bravo ! Leçon terminée. Tu peux passer au niveau suivant.';
      setActionButton(next, 'Leçon terminée', 'check-circle', 'start');
      next.disabled = true;
      const following = order[order.indexOf(slug) + 1];
      if (following) {
        const link = document.createElement('a'); link.className = 'quest-next-lesson';
        link.href = following + '.html';
        setActionButton(link, 'Prochain niveau', 'arrow-right', 'end');
        if (!controls.querySelector('.quest-next-lesson')) controls.append(link);
      } else {
        const link = document.createElement('a'); link.className = 'quest-next-lesson';
        link.href = '../index.html#apprendre';
        setActionButton(link, 'Voir ton parcours', 'arrow-right', 'end');
        if (!controls.querySelector('.quest-next-lesson')) controls.append(link);
      }
    });
    modeToggle.addEventListener('click', () => { full = !full; render(true); });
    window.addEventListener('hashchange', () => {
      const index = indexForHash();
      if (index >= 0 && !full) { current = index; render(false); }
    });
    const toc = document.querySelector('#toc');
    toc?.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const id = decodeURIComponent(link.hash.slice(1));
      const index = stages.findIndex(group => group.some(el => el.id === id || !!el.querySelector('#' + CSS.escape(id))));
      if (index >= 0) { full = false; current = index; render(false); }
    }, true);
  })();
})();
