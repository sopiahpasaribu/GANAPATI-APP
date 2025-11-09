const express = require('express');
const { get, all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// ✅ Get current user profile
router.get('/me', auth, (req, res) => {
  try {
    const user = get('SELECT id, username, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'user not found' });

    // Hitung followers & following
    const followersCount = get('SELECT COUNT(*) AS c FROM follows WHERE followee_id = ?', [req.user.id]).c;
    const followingCount = get('SELECT COUNT(*) AS c FROM follows WHERE follower_id = ?', [req.user.id]).c;

    res.json({ ...user, followersCount, followingCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});


// ✅ Get current user's posts
router.get('/me/posts', auth, (req, res) => {
  try {
    const posts = all(
      'SELECT id, user_id AS userid, content, image_url, created_at AS createdat FROM posts WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});


// ✅ Get current user's stories
router.get('/me/stories', auth, (req, res) => {
  try {
    const stories = all(
      `SELECT 
         id, 
         user_id AS userid, 
         image_url, 
         caption, 
         created_at AS createdat, 
         expires_at 
       FROM stories 
       WHERE user_id = ? 
         AND datetime(expires_at) > datetime('now') 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// ✅ Get current user's followers
router.get('/me/followers', auth, (req, res) => {
  try {
    const followers = all(
      `SELECT u.id, u.username
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.followee_id = ?`,
      [req.user.id]
    );
    res.json(followers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// ✅ Get current user's following
router.get('/me/following', auth, (req, res) => {
  try {
    const following = all(
      `SELECT u.id, u.username
       FROM follows f
       JOIN users u ON f.followee_id = u.id
       WHERE f.follower_id = ?`,
      [req.user.id]
    );
    res.json(following);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});


module.exports = router;
