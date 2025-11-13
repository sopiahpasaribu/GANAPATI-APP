const Database = require("better-sqlite3");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const DB_FILE = process.env.DB_FILE || "./data.db";

if (fs.existsSync(DB_FILE)) {
  fs.unlinkSync(DB_FILE);
  console.log("⚠️ DB lama dihapus, membuat DB baru...");
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
    image_url TEXT,
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

  CREATE TABLE stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TEXT,
    expires_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

const now = new Date().toISOString();

// Password sama untuk semua user: "123456"
const passwordHash = bcrypt.hashSync("123456", 10);

// Users
db.exec(`
  INSERT INTO users (username, password_hash, created_at) VALUES
    ('sopiah12', '${passwordHash}', '${now}'),
    ('muttaqin', '${passwordHash}', '${now}'),
    ('siegar', '${passwordHash}', '${now}'),
    ('pasaribu', '${passwordHash}', '${now}');
`);

db.exec(`
  INSERT INTO posts (user_id, content, image_url, created_at) VALUES
    (1, 'Halo, ini post pertama Sopiah', 'https://images.pexels.com/photos/3355788/pexels-photo-3355788.jpeg', '${now}'),
    (2, 'Halo, ini post pertama Muttaqin', 'https://images.pexels.com/photos/931018/pexels-photo-931018.jpeg', '${now}'),
    (3, 'Halo, ini post pertama Siegar', 'https://images.pexels.com/photos/2303781/pexels-photo-2303781.jpeg', '${now}'),
    (4, 'Halo, ini post pertama Pasaribu', 'https://images.pexels.com/photos/177809/pexels-photo-177809.jpeg', '${now}');
`);

db.close();

console.log("🎉 Migration selesai. Database baru dibuat di:", DB_FILE);
console.log("✅ Username: sopiah12, muttaqin, siegar, pasaribu");
console.log("✅ Password: 123456 (semua akun sama)");
