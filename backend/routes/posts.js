const express = require('express');
const { run, get, all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Post
router.post('/posts', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    if (typeof content !== 'string') return res.status(400).json({ error: 'content required' });
    if (content.length === 0) return res.status(400).json({ error: 'content cannot be empty' });
    if (content.length > 200) return res.status(422).json({ error: 'content too long' });

    const info = run(
      'INSERT INTO posts (user_id,content,created_at) VALUES (?,?,datetime(\'now\'))',
      [userId, content]
    );
    const id = info.lastInsertRowid || info.lastID || null;
    const post = get('SELECT id, user_id as userid, content, created_at as createdat FROM posts WHERE id = ?', [id]);
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get Feed
router.get('/feed', auth, (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const offset = (page - 1) * limit;
    const posts = all(
      `SELECT p.id, p.user_id as userid, p.content, p.created_at as createdat
       FROM posts p
       JOIN follows f ON f.followee_id = p.user_id
       WHERE f.follower_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, limit, offset]
    );
    res.json({ page, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
