const express = require('express');
const { all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/users', auth, (req, res) => {
  try {
    const users = all('SELECT id, username, created_at FROM users ORDER BY username');
    const followRows = all('SELECT followee_id FROM follows WHERE follower_id = ?', [req.user.id]);
    const following = new Set(followRows.map(r => r.followee_id));
    const result = users.map(u => ({ ...u, isFollowing: following.has(u.id) }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
