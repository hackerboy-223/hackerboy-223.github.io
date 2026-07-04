/* =========================================================
   assistant.js — widget H@CKERBOT (vanilla JS, sans React)
   Monté sur #assistant-root (page d'accueil).
   Réponses locales par mots-clés — aucun appel serveur.
   ========================================================= */
(function () {
  'use strict';

  var KNOWLEDGE = [
    { keys: ['python'], reply: 'Python est parfait pour débuter ! Va voir la Masterclass Python : posts/post6.html 🐍' },
    { keys: ['javascript', 'js'], reply: 'JavaScript rend le web vivant ⚡ Lis l\'intro ici : posts/post5.html' },
    { keys: ['css', 'style'], reply: 'Pour styliser tes pages, check l\'intro CSS : posts/post4.html 🎨' },
    { keys: ['html', 'balise'], reply: 'Tout commence par le HTML ! Guide ici : posts/post3.html 📄' },
    { keys: ['hacker', 'hacking', 'pirat'], reply: 'White hat, grey hat, black hat… découvre qui sont vraiment les hackers : posts/post2.html 🕵️' },
    { keys: ['securite', 'sécurité', 'protege', 'protège', 'mot de passe'], reply: 'Règles d\'or : mots de passe forts, 2FA, mises à jour. Plus de conseils : posts/post2.html 🔒' },
    { keys: ['informatique', 'ordinateur'], reply: 'L\'informatique de A à Z, c\'est par ici : posts/post1.html 💻' },
    { keys: ['hackerboy', 'qui es', 'auteur', 'propos'], reply: 'H@CKERBOY est un étudiant en électronique et développeur passionné. Son histoire : posts/hackerboy.html 🚀' },
    { keys: ['contact', 'whatsapp', 'joindre'], reply: 'Tu peux contacter H@CKERBOY via WhatsApp ou les réseaux en bas de page 📱' },
    { keys: ['bonjour', 'salut', 'hello', 'yo'], reply: 'Salut ! 👋 Pose-moi une question sur Python, JavaScript, CSS, HTML ou la cybersécurité.' },
    { keys: ['merci'], reply: 'Avec plaisir ! Le savoir se partage. 🤝' }
  ];

  function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function answer(text) {
    var t = normalize(text);
    for (var i = 0; i < KNOWLEDGE.length; i++) {
      var k = KNOWLEDGE[i];
      for (var j = 0; j < k.keys.length; j++) {
        if (t.indexOf(normalize(k.keys[j])) !== -1) return k.reply;
      }
    }
    return 'Bonne question ! Explore les articles du blog pour approfondir — ou demande-moi "Python", "JavaScript", "CSS", "HTML" ou "hacker". 🤖';
  }

  function createEl(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (typeof c === 'string') el.appendChild(document.createTextNode(c));
      else if (c) el.appendChild(c);
    }
    return el;
  }

  function renderMessage(msg) {
    var wrapper = document.createElement('div');
    wrapper.className = 'msg ' + (msg.role === 'bot' ? 'bot' : 'user');
    var strong = document.createElement('strong');
    strong.textContent = msg.role === 'bot' ? '🤖 H@CKERBOT' : '🧠 Toi';
    wrapper.appendChild(strong);
    wrapper.appendChild(document.createTextNode(': ' + msg.content));
    return wrapper;
  }

  function Assistant(root) {
    this.root = root;
    this.messages = [{ role: 'bot', content: 'Bienvenue sur H@CKERBOY-BLOG. Pose ta question !' }];

    this.container = createEl('div', { 'class': 'assistant-container' });
    this.chat = createEl('div', { 'class': 'assistant-chat', 'aria-live': 'polite' });
    this.inputs = createEl('div', { 'class': 'assistant-inputs' });
    this.input = createEl('input', { 'class': 'assistant-input', placeholder: 'Pose ta question futuriste...', 'aria-label': 'Ta question' });
    this.btn = createEl('button', { 'class': 'assistant-btn', type: 'button' }, 'Envoyer');

    this.inputs.appendChild(this.input);
    this.inputs.appendChild(this.btn);
    this.container.appendChild(this.chat);
    this.container.appendChild(this.inputs);
    this.root.appendChild(this.container);

    this.render();
    this.attachEvents();
  }

  Assistant.prototype.render = function () {
    this.chat.innerHTML = '';
    var chat = this.chat;
    this.messages.forEach(function (m) { chat.appendChild(renderMessage(m)); });
    chat.scrollTop = chat.scrollHeight;
  };

  Assistant.prototype.attachEvents = function () {
    var self = this;
    this.btn.addEventListener('click', function () { self.send(); });
    this.input.addEventListener('keydown', function (e) { if (e.key === 'Enter') self.send(); });
  };

  Assistant.prototype.send = function () {
    var text = this.input.value.trim();
    if (!text) return;
    this.messages.push({ role: 'user', content: text });
    this.input.value = '';
    this.render();

    var self = this;
    var reply = answer(text);
    setTimeout(function () {
      self.messages.push({ role: 'bot', content: reply });
      self.render();
    }, 500);
  };

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('assistant-root');
    if (!root) return;
    new Assistant(root);
  });
})();
