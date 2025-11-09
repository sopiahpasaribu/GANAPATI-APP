// migrate.js - membuat database baru bila belum ada (versi lengkap seperti Instagram)
const Database = require("better-sqlite3");
const fs = require("fs");

const DB_FILE = process.env.DB_FILE || "./data.db";

if (fs.existsSync(DB_FILE)) {
  console.log("✅ DB sudah ada di:", DB_FILE);
  process.exit(0);
}

const db = new Database(DB_FILE);

db.exec(`
  -- Tabel pengguna
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT,
    created_at TEXT
  );

  -- Tabel postingan (dengan gambar)
  CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    image_url TEXT, -- ✅ Tambahan gambar untuk post
    created_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  -- Tabel follow (hubungan antar pengguna)
  CREATE TABLE follows (
    follower_id INTEGER,
    followee_id INTEGER,
    created_at TEXT,
    PRIMARY KEY(follower_id, followee_id),
    FOREIGN KEY(follower_id) REFERENCES users(id),
    FOREIGN KEY(followee_id) REFERENCES users(id)
  );

  -- ✅ Tabel untuk Story
  CREATE TABLE stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TEXT,
    expires_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  -- ✅ Tabel untuk Komentar pada Postingan
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    content TEXT,
    created_at TEXT,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  -- ✅ Tabel untuk Chat antar Pengguna
  CREATE TABLE chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    message TEXT,
    image_url TEXT, -- opsional: bisa kirim gambar juga
    created_at TEXT,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
  );
`);

db.close();
console.log("🎉 Migration selesai. Database baru dibuat di:", DB_FILE);
