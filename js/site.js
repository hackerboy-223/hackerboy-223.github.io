(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setTheme(theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    localStorage.setItem('hb-theme', theme);
    const button = document.querySelector('#theme-toggle');
    if (button) {
      const isDark = theme === 'dark';
      button.textContent = isDark ? '☼' : '◐';
      button.setAttribute('aria-label', isDark ? 'Activer le thème clair' : 'Activer le thème sombre');
      button.title = isDark ? 'Passer au thème clair' : 'Passer au thème sombre';
    }
  }

  setTheme(localStorage.getItem('hb-theme') || 'dark');
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
    const open = menu.classList.toggle('is-open');
    menuButton.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const cards = [...document.querySelectorAll('.post-card')];
  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const search = document.querySelector('#article-search');
  const emptyState = document.querySelector('#empty-state');
  let activeFilter = new URLSearchParams(window.location.search).get('filter') || 'all';
  if (!['all', 'programmation', 'informatique', 'cybersécurité', 'apropos'].includes(activeFilter)) activeFilter = 'all';

  function updateCards() {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesSearch = !query || card.dataset.search.includes(query);
      const show = matchesFilter && matchesSearch;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
    updateCards();
  }));
  if (filterButtons.length && activeFilter !== 'all') {
    const requestedButton = filterButtons.find(button => button.dataset.filter === activeFilter);
    if (requestedButton) {
      filterButtons.forEach(item => item.classList.toggle('is-active', item === requestedButton));
    }
  }
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

  const revealTargets = [...document.querySelectorAll('.post-card, .signal-grid > div, .bot-card, .article-content > section, .exploit-feature, .story-section, .certificate-gallery figure')];
  revealTargets.forEach((target, index) => {
    target.classList.add('reveal');
    target.style.setProperty('--reveal-delay', `${Math.min(index * 42, 280)}ms`);
  });
  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach(target => observer.observe(target));
  } else {
    revealTargets.forEach(target => target.classList.add('is-visible'));
  }
})();

/* Motion system: subtle depth, live terminal and scroll-aware navigation. */
(() => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  let ticking = false;
  const updateScrollState = () => {
    document.body.classList.toggle('is-scrolling', window.scrollY > 18);
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScrollState); ticking = true; }
  }, { passive: true });
  updateScrollState();

  if (canHover && !reducedMotion) {
    window.addEventListener('pointermove', event => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    }, { passive: true });

    document.querySelectorAll('.post-card, .exploit-feature, .bot-card').forEach(card => {
      card.dataset.tilt = 'true';
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--tilt-x', `${(x * 2.4).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(-y * 2.4).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  const terminalMode = document.querySelector('.terminal-status span:last-child');
  if (terminalMode && !reducedMotion) {
    const modes = ['learning_mode: on', 'build_mode: active', 'curiosity_mode: on', 'shipping_mode: ready'];
    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % modes.length;
      terminalMode.animate([{ opacity: .25, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' });
      terminalMode.textContent = modes[index];
    }, 2600);
  }

  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    if (reducedMotion) return;
    document.querySelectorAll('.post-card:not(.is-hidden)').forEach((card, index) => {
      card.style.setProperty('--reveal-delay', `${index * 35}ms`);
      card.animate([{ opacity: .35, transform: 'translateY(7px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 260, delay: index * 35, easing: 'cubic-bezier(.23,1,.32,1)' });
    });
  }));

  const tocLinks = [...document.querySelectorAll('.toc a')];
  const headings = tocLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
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
    const heroWord = document.querySelector('.hero h1 em');
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
      saveButton.textContent = saved ? '★ Enregistré' : '☆ Enregistrer';
      saveButton.setAttribute('aria-pressed', String(saved));
    };
    setSavedState(localStorage.getItem(key) === 'true');
    saveButton.addEventListener('click', () => {
      const saved = localStorage.getItem(key) !== 'true';
      localStorage.setItem(key, String(saved));
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
    overlay.innerHTML = `<button type="button" aria-label="Fermer l’image">×</button><img src="${image.src}" alt="${image.alt}">`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', event => { if (event.target === overlay || event.target.tagName === 'BUTTON') overlay.remove(); });
  }));
})();
