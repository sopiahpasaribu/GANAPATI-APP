
# Ganapatih App

Fullstack simple newsfeed app untuk **Ganapatih Take-Home Test**.
Backend: **Express + better-sqlite3**, Frontend: **React + Vite + Tailwind**.

---

## 🚀 Tech Stack

**Frontend**

* React + Vite
* TailwindCSS
* Axios

**Backend**

* Express.js
* better-sqlite3
* bcryptjs
* dotenv

---

## ⚙️ Setup Cepat

### 🖥️ Backend

```bash
cd backend
pnpm install
pnpm run migrate
pnpm run dev
```

Default: **[http://localhost:4000](http://localhost:4000)**

**Akun default:**

| No | Username | Password |
| -- | -------- | -------- |
| 1  | sopiah12 | 123456   |
| 2  | muttaqin | 123456   |
| 3  | siegar   | 123456   |
| 4  | pasaribu | 123456   |

---

### 💻 Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Default: **[http://localhost:5173](http://localhost:5173)**

Set `VITE_API_BASE` di `.env` jika backend bukan di port 4000.

---

## ✨ Fitur

* Register & Login
* Posting teks + gambar
* Follow/Unfollow
* Feed & Story
* Database otomatis dari migrasi


