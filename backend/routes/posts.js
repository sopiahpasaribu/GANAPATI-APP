const express = require('express');
const { run, get, all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// ✅ Create Post (now supports optional image_url)
router.post('/posts', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { content, image_url } = req.body;

    if (!content && !image_url)
      return res.status(400).json({ error: 'content or image required' });

    // ✅ Validasi panjang content (maksimum 200 karakter)
    if (content && content.length > 200)
      return res.status(422).json({ error: 'content too long (max 200 characters)' });

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

// ✅ Get Feed (with username)
router.get('/feed', auth, (req, res) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const offset = (page - 1) * limit;

    const posts = all(
      `SELECT 
         p.id, 
         p.user_id AS userid, 
         u.username AS username,
         p.content, 
         p.image_url, 
         p.created_at AS createdat
       FROM posts p
       JOIN users u ON u.id = p.user_id
       WHERE p.user_id = ? 
          OR p.user_id IN (SELECT followee_id FROM follows WHERE follower_id = ?)
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.id, req.user.id, limit, offset]
    );

    res.json({ page, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});


// ✅ Edit Post (hanya milik sendiri)
router.put('/posts/:id', auth, (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { content, image_url } = req.body;

    const post = get('SELECT * FROM posts WHERE id = ?', [postId]);
    if (!post) return res.status(404).json({ error: 'post not found' });
    if (post.user_id !== req.user.id)
      return res.status(403).json({ error: 'forbidden' });

    // ✅ Validasi panjang content (maksimum 200 karakter)
    if (content && content.length > 200)
      return res.status(422).json({ error: 'content too long (max 200 characters)' });

    run(
      'UPDATE posts SET content = ?, image_url = ? WHERE id = ?',
      [content || '', image_url || null, postId]
    );

    const updated = get(
      'SELECT id, user_id as userid, content, image_url, created_at as createdat FROM posts WHERE id = ?',
      [postId]
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});


// ✅ Delete Post (hanya milik sendiri)
router.delete('/posts/:id', auth, (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const post = get('SELECT * FROM posts WHERE id = ?', [postId]);
    if (!post) return res.status(404).json({ error: 'post not found' });
    if (post.user_id !== req.user.id)
      return res.status(403).json({ error: 'forbidden' });

    run('DELETE FROM posts WHERE id = ?', [postId]);

    res.json({ success: true, message: 'post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
