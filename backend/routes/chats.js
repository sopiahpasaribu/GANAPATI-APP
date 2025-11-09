const express = require('express');
const { run, all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/chats/:receiverid', auth, (req, res) => {
  try {
    const receiverId = parseInt(req.params.receiverid);
    const { message, image_url } = req.body;
    if (!message && !image_url)
      return res.status(400).json({ error: 'message or image required' });

    run(
      'INSERT INTO chats (sender_id, receiver_id, message, image_url, created_at) VALUES (?,?,?,?,datetime(\'now\'))',
      [req.user.id, receiverId, message || null, image_url || null]
    );

    res.status(201).json({ message: 'message sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get chat between two users
router.get('/chats/:userid', auth, (req, res) => {
  try {
    const otherId = parseInt(req.params.userid);
    const chats = all(
      `SELECT c.*, u.username as sender_name
       FROM chats c
       JOIN users u ON u.id = c.sender_id
       WHERE (c.sender_id = ? AND c.receiver_id = ?) OR (c.sender_id = ? AND c.receiver_id = ?)
       ORDER BY c.created_at ASC`,
      [req.user.id, otherId, otherId, req.user.id]
    );
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
