const express = require('express');
const { get, all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/me', auth, (req, res) => {
  try {
    const user = get('SELECT id, username, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get current user's posts
router.get('/me/posts', auth, (req, res) => {
  try {
    const posts = all(
      'SELECT id, user_id as userid, content, created_at as createdat FROM posts WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
