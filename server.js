const path = require('path');
const express = require('express');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = [
  { username: 'alice', password: '1234' },
  { username: 'bob', password: '5678' }
];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: 'lodu secret',
    resave: false,
    saveUninitialized: false
  })
);

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

app.get('/login', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    req.session.user = { username: user.username };
    return res.redirect('/');
  }
  return res.redirect('/login?error=1');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/user', requireLogin, (req, res) => {
  res.json({ username: req.session.user.username });
});

app.get('/', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.username = username;
    onlineUsers.set(socket.id, username);
    io.emit('users', Array.from(onlineUsers.values()));
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { user: socket.username, text: msg });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    io.emit('users', Array.from(onlineUsers.values()));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
