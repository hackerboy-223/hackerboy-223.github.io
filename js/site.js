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

  if (!reducedMotion) {
    const revealTargets = document.querySelectorAll('.post-card, .signal-grid > div, .bot-card, .article-content > section');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 520, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'both' });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    revealTargets.forEach(target => observer.observe(target));
  }
})();
