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

app.get('/', (req, res) => {
  res.send({ ok: true });
});

app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});
