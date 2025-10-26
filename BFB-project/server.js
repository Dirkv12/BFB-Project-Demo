const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'bfb.db');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(DB_FILE);

// (No SMS provider configured) - alerts are handled client-side in this iteration

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, username, password, name FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

app.post('/api/signup', async (req, res) => {
  const { username, password, name } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  try {
    const hash = bcrypt.hashSync(password, 10);
    const id = 'u' + Date.now();
    db.run('INSERT INTO users (id, username, password, name) VALUES (?,?,?,?)', [id, username, hash, name || username], function(err){
      if (err) return res.status(500).json({ error: 'Unable to create user' });
      const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ ok: true, token, user: { id, username, name: name || username } });
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });
  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ ok: true, token, user: { id: user.id, username: user.username, name: user.name } });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid auth header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
}

app.get('/api/me', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({ ok: true, user: { id: u.id, username: u.username } });
});

// No server-side alerts route in this iteration. Alerts are stored in browser localStorage.

app.listen(PORT, () => console.log(`Auth server listening on http://localhost:${PORT}`));
