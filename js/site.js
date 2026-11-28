(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const imageContainers = '.project-visual, .card-image, .case-cover, .article-cover, .db-story-visual, .db-story-mobile, .about-image, .vision-image, .certificate-stack, .certificate-gallery, .brand-mark';

  function recoverImage(image) {
    const fallback = image.dataset.fallback;
    if (fallback && image.dataset.fallbackUsed !== 'true') {
      image.dataset.fallbackUsed = 'true';
      image.removeAttribute('srcset');
      image.src = fallback;
      return;
    }

    image.classList.add('is-image-unavailable');
    const container = image.closest(imageContainers);
    if (container) container.classList.add('has-image-error');
  }

  document.querySelectorAll('img').forEach(image => {
    image.addEventListener('error', () => recoverImage(image));
    if (image.loading !== 'lazy' && image.complete && image.naturalWidth === 0) recoverImage(image);
  });


  const SVG_NS = 'http://www.w3.org/2000/svg';
  function buildSvgIcon(paths, filled = false) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', filled ? 'currentColor' : 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.85');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('hb-icon');
    paths.forEach(([tag, attrs]) => {
      const node = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
      svg.appendChild(node);
    });
    return svg;
  }

  function setTheme(theme, persist = true) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (persist) { try { localStorage.setItem('hb-theme', theme); } catch (_) { /* Storage may be disabled. */ } }
    const button = document.querySelector('#theme-toggle');
    if (button) {
      const isDark = theme === 'dark';
      const icon = isDark
        ? buildSvgIcon([
            ['circle', { cx: 12, cy: 12, r: 4 }],
            ['path', { d: 'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' }]
          ])
        : buildSvgIcon([['path', { d: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' }]]);
      button.replaceChildren(icon);
      button.setAttribute('aria-label', isDark ? 'Activer le thème clair' : 'Activer le thème sombre');
      button.title = isDark ? 'Passer au thème clair' : 'Passer au thème sombre';
      if (persist && !reducedMotion) {
        button.classList.remove('is-switching');
        void button.offsetWidth;
        button.classList.add('is-switching');
      }
    }
  }

  const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('hb-theme'); } catch (_) { /* Private browsing. */ }
  setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (colorPreference.matches ? 'dark' : 'light'), false);
  colorPreference.addEventListener?.('change', event => {
    let override = null;
    try { override = localStorage.getItem('hb-theme'); } catch (_) {}
    if (override !== 'dark' && override !== 'light') setTheme(event.matches ? 'dark' : 'light', false);
  });
  document.querySelector('#theme-toggle')?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  const menu = document.querySelector('#site-nav');
  const menuButton = document.querySelector('#menu-toggle');
  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove('is-open');
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }
  menuButton?.addEventListener('click', () => {
    if (!menu) return;
    const open = menu.classList.toggle('is-open');
    menuButton.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 981px)').addEventListener?.('change', event => {
    if (event.matches) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) {
      closeMenu();
      menuButton?.focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu?.classList.contains('is-open') && !menu.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
  });

  const cards = [...document.querySelectorAll('.post-card')];
  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const search = document.querySelector('#article-search');
  const emptyState = document.querySelector('#empty-state');
  let activeFilter = new URLSearchParams(window.location.search).get('filter') || 'all';
  if (!['all', 'programmation', 'informatique', 'cybersécurité', 'apropos'].includes(activeFilter)) activeFilter = 'all';

  const searchIconHost = document.querySelector('.search-field > span[aria-hidden="true"]');
  if (searchIconHost) {
    searchIconHost.replaceChildren(buildSvgIcon([
      ['circle', { cx: 11, cy: 11, r: 7 }],
      ['path', { d: 'm21 21-4.3-4.3' }]
    ]));
  }

  function updateCards() {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesSearch = !query || (card.dataset.search || card.textContent.toLowerCase()).includes(query);
      const show = matchesFilter && matchesSearch;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    updateCards();
  }));
  if (filterButtons.length && activeFilter !== 'all') {
    const requestedButton = filterButtons.find(button => button.dataset.filter === activeFilter);
    if (requestedButton) {
      filterButtons.forEach(item => item.classList.toggle('is-active', item === requestedButton));
    }
  }
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item.classList.contains('is-active'))));
  updateCards();
  search?.addEventListener('input', updateCards);

  const replies = {
    python: 'Python est parfait pour apprendre : commence par les variables, les conditions, les boucles, puis construis un petit script utile.',
    javascript: 'JavaScript donne du comportement à une page. Travaille d’abord le DOM, les événements et les fonctions asynchrones.',
    html: 'HTML décrit la structure et le sens d’une page. Utilise les balises sémantiques avant de penser au style.',
    css: 'CSS organise la présentation. Pars d’un système de tokens, d’une grille simple et de quelques états interactifs bien définis.',
    cyber: 'En cybersécurité, commence par les fondamentaux : mots de passe uniques, mises à jour, sauvegardes et moindre privilège.',
    hacker: 'Un hacker est surtout une personne qui comprend les systèmes et cherche à les explorer. Le cadre légal et l’éthique restent non négociables.',
    default: 'Je peux t’orienter sur Python, JavaScript, HTML, CSS ou les bases de la cybersécurité. Essaie un mot-clé.'
  };
  function answer(question) {
    const text = question.toLowerCase();
    const key = Object.keys(replies).find(item => item !== 'default' && text.includes(item));
    return replies[key || 'default'];
  }
  const botReply = document.querySelector('#bot-reply');
  const botInput = document.querySelector('#bot-input');
  document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => {
    if (botReply) botReply.textContent = answer(button.dataset.question);
  }));
  document.querySelector('#bot-form')?.addEventListener('submit', event => {
    event.preventDefault();
    if (!botInput?.value.trim()) return;
    if (botReply) botReply.textContent = answer(botInput.value);
    botInput.value = '';
  });

  const toc = document.querySelector('#toc');
  const articleContent = document.querySelector('.article-content');
  if (toc && articleContent) {
    articleContent.querySelectorAll('h2').forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      toc.appendChild(link);
    });
  }

  const revealSelector = body.dataset.page === 'home'
    ? '.section-heading, .proof-grid > div, .social-card, .contact-panel'
    : '.section-heading, .project-card, .post-card, .expertise-item, .signal-grid > div, .bot-card, .article-content > section, .exploit-feature, .story-section, .certificate-gallery figure, .contact-panel, .social-card';
  const revealTargets = [...document.querySelectorAll(revealSelector)];
  revealTargets.forEach((target, index) => {
    target.classList.add('reveal');
    target.style.setProperty('--reveal-delay', `${Math.min(index * 42, 280)}ms`);
  });
  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    const revealVisibleInViewport = () => {
      revealTargets.forEach(target => {
        if (target.classList.contains('is-visible')) return;
        const r = target.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.12 && r.bottom > -40) target.classList.add('is-visible');
      });
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .01, rootMargin: '120px 0px 140px 0px' });
    revealTargets.forEach(target => observer.observe(target));
    revealVisibleInViewport();
    window.addEventListener('scroll', revealVisibleInViewport, { passive: true });
    window.addEventListener('resize', revealVisibleInViewport, { passive: true });
  } else {
    revealTargets.forEach(target => target.classList.add('is-visible'));
  }
})();

/* Motion system: subtle depth, live terminal and scroll-aware navigation. */
(() => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.createElement('div');
  progress.className = 'page-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let ticking = false;
  const updateScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    document.body.classList.toggle('is-scrolling', window.scrollY > 18);
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScrollState); ticking = true; }
  }, { passive: true });
  updateScrollState();

  const navSections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  if (navSections.length && navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const href = new URL(link.href, window.location.href);
          const active = href.hash === `#${entry.target.id}`;
          link.classList.toggle('is-current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-34% 0px -58% 0px', threshold: 0 });
    navSections.forEach(section => sectionObserver.observe(section));
  }

  // Hero parallax is owned by cinematic-v2.js to avoid competing transform writes.

  if (canHover && !reducedMotion) {
    window.addEventListener('pointermove', event => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });

  }

  const initialStatus = document.querySelector('[data-terminal-status]');
  if (initialStatus && !reducedMotion) {
    const statuses = ['status: building', 'status: testing', 'status: improving', 'status: learning'];
    let index = 0;
    window.setInterval(() => {
      const live = document.querySelector('[data-terminal-status]');
      if (!live) return;
      index = (index + 1) % statuses.length;
      if (typeof live.animate === 'function') {
        live.animate(
          [{ opacity: .35, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 240, easing: 'cubic-bezier(.23,1,.32,1)' }
        );
      }
      live.textContent = statuses[index];
    }, 3200);
  }

  const heroConsole = document.querySelector('.hero-console');
  const consoleBody = heroConsole?.querySelector('.console-body');
  if (heroConsole && consoleBody) {
    const defaultNodes = [...consoleBody.childNodes].map(n => n.cloneNode(true));
    const views = {
      profil: null,
      stack: {
        rows: [
          ['cat stack.front', 'HTML · CSS · JavaScript · TypeScript · React · Next.js'],
          ['cat stack.back', 'Python · PHP · Laravel · API REST · PostgreSQL · Supabase'],
          ['cat stack.ops', 'Git · GitHub · Linux · Vercel · Render']
        ],
        tags: ['full-stack', 'responsive & accessible'],
        link: { label: 'Explorer l’expertise →', href: '#expertise' }
      },
      palmares: {
        rows: [
          ['cat malibots-2025.log', '1re place · Médaille d’or Développement Web'],
          ['cat formation.txt', 'Lycée Technique de Bamako · STI Génie électronique'],
          ['cat methode.txt', 'Comprendre → Construire → Tester → Améliorer']
        ],
        tags: ['MaliBots 2025', 'certificats vérifiés'],
        link: { label: 'Voir les certificats →', href: '#exploits' }
      },
      projets: {
        rows: [
          ['ls -1 featured/', 'ZeroCode · Agent de codage Python CLI/TUI'],
          ['cat prod/diamond-block', 'Boutique e-commerce Next.js · Supabase · Vercel'],
          ['cat labs/ai', 'H@CKERBOY GPT · HOPE! · Fable 5']
        ],
        tags: ['open source', 'en production'],
        link: { label: 'Parcourir les projets →', href: '#projets' }
      }
    };

    const tabs = document.createElement('div');
    tabs.className = 'console-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Vues du terminal H@CKERBOY');
    const labels = { profil: 'profil', stack: 'stack', palmares: 'palmarès', projets: 'projets' };
    const tabButtons = Object.keys(views).map(key => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'console-tab' + (key === 'profil' ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(key === 'profil'));
      btn.textContent = labels[key];
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', String(active));
        });
        consoleBody.replaceChildren();
        if (key === 'profil') {
          defaultNodes.forEach(n => consoleBody.appendChild(n.cloneNode(true)));
          const liveStatus = consoleBody.querySelector('[data-terminal-status]');
          if (liveStatus && initialStatus) liveStatus.textContent = initialStatus.textContent;
          return;
        }
        const data = views[key];
        data.rows.forEach(([cmd, out], i) => {
          const pCmd = document.createElement('p');
          pCmd.className = 'console-line-enter';
          pCmd.style.animationDelay = `${i * 55}ms`;
          const prompt = document.createElement('span');
          prompt.className = 'prompt';
          prompt.textContent = '➜ ';
          const cmdSpan = document.createElement('span');
          cmdSpan.className = 'cyan';
          cmdSpan.textContent = cmd;
          pCmd.append(prompt, cmdSpan);

          const pOut = document.createElement('p');
          pOut.className = 'console-output console-line-enter';
          pOut.style.animationDelay = `${i * 55 + 25}ms`;
          pOut.textContent = out;
          consoleBody.append(pCmd, pOut);
        });
        const tagWrap = document.createElement('div');
        tagWrap.className = 'console-tags console-line-enter';
        data.tags.forEach(t => {
          const s = document.createElement('span');
          s.textContent = t;
          tagWrap.appendChild(s);
        });
        const actionLink = document.createElement('a');
        actionLink.className = 'console-action-link console-line-enter';
        actionLink.href = data.link.href;
        actionLink.textContent = data.link.label;
        consoleBody.append(tagWrap, actionLink);
      });
      tabs.appendChild(btn);
      return btn;
    });
    heroConsole.appendChild(tabs);
  }

  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    if (reducedMotion) return;
    document.querySelectorAll('.post-card:not(.is-hidden)').forEach((card, index) => {
      card.style.setProperty('--reveal-delay', `${index * 35}ms`);
      card.animate([{ opacity: .35, transform: 'translateY(7px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 260, delay: index * 35, easing: 'cubic-bezier(.23,1,.32,1)' });
    });
  }));

  const tocLinks = [...document.querySelectorAll('.toc a')];
  const headings = tocLinks.map(link => { try { return link.hash ? document.getElementById(decodeURIComponent(link.hash.slice(1))) : null; } catch (_) { return null; } }).filter(Boolean);
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const tocObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) tocLinks.forEach(link => link.classList.toggle('is-current', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });
    headings.forEach(heading => tocObserver.observe(heading));
  }

  document.querySelectorAll('.bot-chips button, #bot-form button').forEach(button => button.addEventListener('click', () => {
    const reply = document.querySelector('#bot-reply');
    if (!reply || reducedMotion) return;
    reply.animate([{ opacity: .35, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' });
  }));

  if (document.body.dataset.page === 'home' && !reducedMotion) {
    const heroWord = document.querySelector('.portfolio-hero h1 em');
    if (heroWord) heroWord.animate([{ backgroundPosition: '0% 50%' }, { backgroundPosition: '100% 50%' }, { backgroundPosition: '0% 50%' }], { duration: 7000, iterations: Infinity, easing: 'linear' });
  }
})();


/* Enrichment: article interactions */
(() => {
  const root = document.documentElement;
  const progress = document.querySelector('.reading-progress span');
  const article = document.querySelector('.article-content');
  if (progress && article) {
    const updateProgress = () => {
      const start = article.getBoundingClientRect().top + window.scrollY - 180;
      const total = Math.max(1, article.offsetHeight - window.innerHeight * .55);
      const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / total));
      progress.style.width = `${ratio * 100}%`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  const saveButton = document.querySelector('#save-article');
  const slug = document.body.dataset.postSlug;
  if (saveButton && slug) {
    const key = `hackerboy-saved-${slug}`;
    const setSavedState = saved => {
      saveButton.classList.toggle('is-saved', saved);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', saved ? 'currentColor' : 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.85');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('hb-icon');
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z');
      svg.appendChild(p);
      const txt = document.createElement('span');
      txt.textContent = saved ? 'Enregistré' : 'Enregistrer';
      saveButton.replaceChildren(svg, txt);
      saveButton.setAttribute('aria-pressed', String(saved));
    };
    let saved = false;
    try { saved = localStorage.getItem(key) === 'true'; } catch (_) { /* storage blocked */ }
    setSavedState(saved);
    saveButton.addEventListener('click', () => {
      saved = !saved;
      try { localStorage.setItem(key, String(saved)); } catch (_) { /* keep button usable in private mode */ }
      setSavedState(saved);
    });
  }

  document.querySelectorAll('[data-quiz]').forEach(quiz => {
    const feedback = quiz.querySelector('.quiz-feedback');
    quiz.querySelectorAll('[data-quiz-answer]').forEach(option => option.addEventListener('click', () => {
      const correct = option.dataset.quizAnswer === option.dataset.quizCorrect;
      quiz.querySelectorAll('[data-quiz-answer]').forEach(item => item.classList.remove('is-correct', 'is-wrong'));
      option.classList.add(correct ? 'is-correct' : 'is-wrong');
      if (feedback) feedback.textContent = correct ? 'Bonne réponse. Tu peux continuer.' : 'Pas tout à fait. Relis le passage puis réessaie.';
    }));
  });

  const htmlInput = document.querySelector('#html-lab-input');
  const htmlPreview = document.querySelector('#html-lab-preview h3');
  htmlInput?.addEventListener('input', () => { if (htmlPreview) htmlPreview.textContent = htmlInput.value || 'Ton titre apparaîtra ici'; });

  const hue = document.querySelector('#css-hue');
  const radius = document.querySelector('#css-radius');
  const cssCard = document.querySelector('#css-lab-card');
  const hueValue = document.querySelector('#css-hue-value');
  const radiusValue = document.querySelector('#css-radius-value');
  const updateCssLab = () => {
    if (!cssCard) return;
    const hueNumber = hue?.value || 160;
    const radiusNumber = radius?.value || 18;
    cssCard.style.background = `hsl(${hueNumber} 65% 48% / .18)`;
    cssCard.style.borderColor = `hsl(${hueNumber} 65% 48% / .5)`;
    cssCard.style.borderRadius = `${radiusNumber}px`;
    if (hueValue) hueValue.textContent = `${hueNumber}°`;
    if (radiusValue) radiusValue.textContent = `${radiusNumber}px`;
  };
  hue?.addEventListener('input', updateCssLab);
  radius?.addEventListener('input', updateCssLab);
  updateCssLab();

  let counter = 0;
  const counterValue = document.querySelector('#counter-value');
  document.querySelector('#counter-add')?.addEventListener('click', () => { counter += 1; if (counterValue) counterValue.textContent = counter; });
  document.querySelector('#counter-reset')?.addEventListener('click', () => { counter = 0; if (counterValue) counterValue.textContent = counter; });

  const pythonInput = document.querySelector('#python-lab-input');
  const pythonOutput = document.querySelector('#python-lab-output');
  document.querySelector('#python-lab-run')?.addEventListener('click', () => {
    const names = (pythonInput?.value || '').split(',').map(name => name.trim()).filter(Boolean).slice(0, 6);
    if (pythonOutput) pythonOutput.textContent = names.length ? names.map(name => `Bonjour ${name} !`).join('\n') : 'Ajoute au moins un prénom.';
  });

  const passwordInput = document.querySelector('#password-lab-input');
  const strengthBar = document.querySelector('#strength-bar');
  const strengthLabel = document.querySelector('#strength-label');
  passwordInput?.addEventListener('input', () => {
    const value = passwordInput.value;
    const score = Math.min(5, (value.length >= 12 ? 2 : value.length >= 8 ? 1 : 0) + (/[A-Z]/.test(value) ? 1 : 0) + (/[0-9]/.test(value) ? 1 : 0) + (/[^A-Za-z0-9]/.test(value) ? 1 : 0));
    const labels = ['Aucune donnée saisie.', 'Très faible.', 'À renforcer.', 'Correcte, mais améliorable.', 'Bonne base.', 'Solide pour un exercice local.'];
    if (strengthBar) { strengthBar.style.width = `${score * 20}%`; strengthBar.style.background = score < 2 ? 'var(--danger)' : score < 4 ? 'var(--warning)' : 'var(--accent)'; }
    if (strengthLabel) strengthLabel.textContent = labels[score];
  });

  document.querySelectorAll('.certificate-gallery img').forEach(image => image.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'image-lightbox';
    const close = document.createElement('button');
    close.type = 'button';
    close.setAttribute('aria-label', 'Fermer l’image');
    close.textContent = '×';
    const enlarged = document.createElement('img');
    enlarged.src = image.currentSrc || image.src;
    enlarged.alt = image.alt;
    overlay.append(close, enlarged);
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Aperçu du certificat');
    document.body.appendChild(overlay);
    const dismiss = () => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      image.focus?.();
    };
    const onKey = event => {
      if (event.key === 'Escape') dismiss();
      if (event.key === 'Tab') { event.preventDefault(); close.focus(); }
    };
    overlay.addEventListener('click', event => { if (event.target === overlay || event.target === close) dismiss(); });
    document.addEventListener('keydown', onKey);
    close.focus();
  }));
})();


(() => { const button=document.querySelector('#cv-print'); if(button) button.addEventListener('click',()=>window.print()); })();
