// db.js
const Database = require("better-sqlite3");
const path = require("path");

const DB_FILE = process.env.DB_FILE || "./data.db";
const db = new Database(DB_FILE);

function ensureMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT,
      image_url TEXT, 
      created_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS follows (
      follower_id INTEGER,
      followee_id INTEGER,
      created_at TEXT,
      PRIMARY KEY(follower_id, followee_id),
      FOREIGN KEY(follower_id) REFERENCES users(id),
      FOREIGN KEY(followee_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      image_url TEXT NOT NULL,
      caption TEXT,
      created_at TEXT,
      expires_at TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
}

function run(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...(Array.isArray(params) ? params : [params]));
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...(Array.isArray(params) ? params : [params]));
}

function get(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(...(Array.isArray(params) ? params : [params]));
}

module.exports = { db, run, all, get, ensureMigrations };
