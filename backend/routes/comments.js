const express = require('express');
const { run, all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Add comment
router.post('/posts/:postid/comments', auth, (req, res) => {
  try {
    const postId = parseInt(req.params.postid);
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });

    run(
      'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?,?,?,datetime(\'now\'))',
      [postId, req.user.id, content]
    );

    res.status(201).json({ message: 'comment added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get comments for a post
router.get('/posts/:postid/comments', auth, (req, res) => {
  try {
    const postId = parseInt(req.params.postid);
    const comments = all(
      'SELECT c.id, c.content, c.created_at, u.username FROM comments c JOIN users u ON u.id = c.user_id WHERE c.post_id = ? ORDER BY c.created_at ASC',
      [postId]
    );
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
