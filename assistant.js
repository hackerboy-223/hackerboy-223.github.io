// Minimal vanilla JS assistant widget — no React dependency
(function () {
  function createEl(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    children.forEach(c => {
      if (typeof c === 'string') el.appendChild(document.createTextNode(c));
      else if (c) el.appendChild(c);
    });
    return el;
  }

  function renderMessage(msg) {
    const wrapper = document.createElement('div');
    wrapper.className = 'msg ' + (msg.role === 'bot' ? 'bot' : 'user');
    const strong = document.createElement('strong');
    strong.textContent = msg.role === 'bot' ? '🤖 H@CKERBOT' : '🧠 Toi';
    wrapper.appendChild(strong);
    wrapper.appendChild(document.createTextNode(': ' + msg.content));
    return wrapper;
  }

  function Assistant(root) {
    this.root = root;
    this.messages = [{ role: 'bot', content: 'Bienvenue sur H@CKERBOY-BLOG. Pose ta question.' }];

    this.container = createEl('div', { class: 'assistant-container' });
    this.chat = createEl('div', { class: 'assistant-chat' });
    this.inputs = createEl('div', { class: 'assistant-inputs' });
    this.input = createEl('input', { class: 'assistant-input', placeholder: 'Pose ta question futuriste...' });
    this.btn = createEl('button', { class: 'assistant-btn', type: 'button' }, 'Envoyer');

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
    this.messages.forEach(m => this.chat.appendChild(renderMessage(m)));
    this.chat.scrollTop = this.chat.scrollHeight;
  };

  Assistant.prototype.attachEvents = function () {
    const self = this;
    this.btn.addEventListener('click', function () { self.send(); });
    this.input.addEventListener('keydown', function (e) { if (e.key === 'Enter') self.send(); });
  };

  Assistant.prototype.send = function () {
    const text = this.input.value.trim();
    if (!text) return;
    this.messages.push({ role: 'user', content: text });
    this.input.value = '';
    this.render();

    // Simulate a bot response
    const reply = 'Réponse IA : "' + text + '" est une très bonne question.';
    const self = this;
    setTimeout(function () {
      self.messages.push({ role: 'bot', content: reply });
      self.render();
    }, 600);
  };

  document.addEventListener('DOMContentLoaded', function () {
    const root = document.getElementById('assistant-root');
    if (!root) return;
    new Assistant(root);
  });
})();
