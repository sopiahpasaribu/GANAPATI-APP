const express = require('express');
const { run, get, all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Post (now supports optional image_url)
router.post('/posts', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { content, image_url } = req.body;

    if (!content && !image_url)
      return res.status(400).json({ error: 'content or image required' });

    const info = run(
      'INSERT INTO posts (user_id, content, image_url, created_at) VALUES (?,?,?,datetime(\'now\'))',
      [userId, content || '', image_url || null]
    );

    const id = info.lastInsertRowid || info.lastID || null;
    const post = get(
      'SELECT id, user_id as userid, content, image_url, created_at as createdat FROM posts WHERE id = ?',
      [id]
    );
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
      `SELECT p.id, p.user_id as userid, p.content, p.image_url, p.created_at as createdat
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
