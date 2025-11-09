// migrate.js - kept for compatibility (creates DB if not exists with tables)
const Database = require('better-sqlite3');
const fs = require('fs');
const DB_FILE = process.env.DB_FILE || './data.db';
if (fs.existsSync(DB_FILE)) {
  console.log('DB exists at', DB_FILE);
  process.exit(0);
}
const db = new Database(DB_FILE);
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT,
    created_at TEXT
  );
  CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE follows (
    follower_id INTEGER,
    followee_id INTEGER,
    created_at TEXT,
    PRIMARY KEY(follower_id, followee_id),
    FOREIGN KEY(follower_id) REFERENCES users(id),
    FOREIGN KEY(followee_id) REFERENCES users(id)
  );
`);
db.close();
console.log('Migration done. DB created at', DB_FILE);
