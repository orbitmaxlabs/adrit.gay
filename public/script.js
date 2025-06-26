const socket = io();
const { useState, useEffect, createElement: h } = React;
const { createRoot } = ReactDOM;

async function fetchUsername() {
  const res = await fetch('/user');
  if (!res.ok) return null;
  const data = await res.json();
  return data.username;
}

function ChatApp() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsername().then((name) => {
      if (name) {
        setUsername(name);
        socket.emit('join', name);
      }
    });

    socket.on('users', setUsers);
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('users');
      socket.off('chat message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = message.trim();
    if (text) {
      socket.emit('chat message', text);
      setMessage('');
    }
  };

  return h('div', { id: 'chat-container' },
    h('div', { id: 'users' },
      h('h2', null, 'Online Users'),
      h('ul', { id: 'user-list' }, users.map((u, i) => h('li', { key: i }, u)))
    ),
    h('div', { id: 'messages' },
      h('ul', { id: 'messages-list' },
        messages.map((m, i) => h('li', { key: i }, h('strong', null, `${m.user}: `), m.text))
      ),
      h('form', { id: 'message-form', onSubmit: handleSubmit },
        h('input', {
          id: 'message-input',
          value: message,
          onChange: (e) => setMessage(e.target.value),
          autoComplete: 'off',
          placeholder: 'Type a message'
        }),
        h('button', { type: 'submit' }, 'Send')
      )
    )
  );
}

createRoot(document.getElementById('root')).render(h(ChatApp));

