const express = require('express');
const { get, run } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Follow user
router.post('/follow/:userid', auth, (req, res) => {
  try {
    const follower = req.user.id;
    const followee = parseInt(req.params.userid);
    if (follower === followee) return res.status(400).json({ error: 'cannot follow yourself' });
    const u = get('SELECT id FROM users WHERE id = ?', [followee]);
    if (!u) return res.status(404).json({ error: 'user not found' });
    const exists = get('SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?', [follower, followee]);
    if (exists) return res.status(409).json({ error: 'already following' });
    run('INSERT INTO follows (follower_id, followee_id, created_at) VALUES (?,?,datetime(\'now\'))', [follower, followee]);
    res.json({ message: `you are now following user ${followee}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Unfollow
router.delete('/follow/:userid', auth, (req, res) => {
  try {
    const follower = req.user.id;
    const followee = parseInt(req.params.userid);
    const u = get('SELECT id FROM users WHERE id = ?', [followee]);
    if (!u) return res.status(404).json({ error: 'user not found' });
    run('DELETE FROM follows WHERE follower_id = ? AND followee_id = ?', [follower, followee]);
    res.json({ message: `you unfollowed user ${followee}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
