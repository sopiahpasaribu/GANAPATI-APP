require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ensureMigrations } = require('./db');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const followRoutes = require('./routes/follows');
const userRoutes = require('./routes/users');
const meRoutes = require('./routes/me');

// ✅ Tambahan routes baru
const storyRoutes = require('./routes/stories');
const commentRoutes = require('./routes/comments');
const chatRoutes = require('./routes/chats');

const PORT = process.env.PORT || 4000;

ensureMigrations();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', followRoutes);
app.use('/api', userRoutes);
app.use('/api', meRoutes);

// ✅ Tambahkan route baru agar sesuai DB
app.use('/api', storyRoutes);
app.use('/api', commentRoutes);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.send({ ok: true });
});

app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});
