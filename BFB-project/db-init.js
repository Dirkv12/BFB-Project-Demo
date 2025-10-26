const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const dbFile = path.join(__dirname, 'data', 'bfb.db');
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT
  )`);

  const pwd = '1';
  const hash = bcrypt.hashSync(pwd, 10);
  const stmt = db.prepare('INSERT OR IGNORE INTO users (id, username, password, name) VALUES (?,?,?,?)');
  stmt.run('u1', '1', hash, 'Shortcut User');
  stmt.finalize();

  console.log('DB initialized and shortcut user ensured');
  db.close();
});
