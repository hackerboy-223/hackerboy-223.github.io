const { useState } = React;

function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Bienvenue sur H@CKERBOY-BLOG. Pose ta question.' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const response = `Réponse IA : "${input}" est une très bonne question.`;
    setMessages([...newMessages, { role: 'bot', content: response }]);
  };

  return (
    React.createElement('div', { className: 'assistant-container' },
      React.createElement('div', { className: 'assistant-chat' },
        messages.map((msg, i) =>
          React.createElement('div', {
            key: i,
            className: msg.role === 'bot' ? 'msg bot' : 'msg user'
          },
            React.createElement('strong', null, msg.role === 'bot' ? '🤖 H@CKERBOT' : '🧠 Toi'),
            ': ' + msg.content
          )
        )
      ),
      React.createElement('div', { className: 'assistant-inputs' },
        React.createElement('input', {
          className: 'assistant-input',
          value: input,
          onChange: (e) => setInput(e.target.value),
          placeholder: 'Pose ta question futuriste...'
        }),
        React.createElement('button', {
          className: 'assistant-btn',
          onClick: handleSend
        }, 'Envoyer')
      )
    )
  );
}

ReactDOM.render(
  React.createElement(Assistant),
  document.getElementById('assistant-root')
);
