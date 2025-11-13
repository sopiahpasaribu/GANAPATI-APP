const express = require('express');
const { run, all } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Story
router.post('/stories', auth, (req, res) => {
  try {
    const { image_url, caption } = req.body;
    if (!image_url) return res.status(400).json({ error: 'image_url required' });

    run(
      'INSERT INTO stories (user_id, image_url, caption, created_at, expires_at) VALUES (?,?,?,datetime(\'now\'), datetime(\'now\', \'+24 hours\'))',
      [req.user.id, image_url, caption || null]
    );

    res.status(201).json({ message: 'Story created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get all stories
router.get('/stories', auth, (req, res) => {
  try {
    const stories = all(
      'SELECT s.id, s.image_url, s.caption, s.created_at, u.username FROM stories s JOIN users u ON s.user_id = u.id WHERE datetime(s.expires_at) > datetime(\'now\') ORDER BY s.created_at DESC'
    );
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Edit Story
router.put('/stories/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;

    const story = all('SELECT user_id FROM stories WHERE id = ?', [id]);
    if (!story || story.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    run('UPDATE stories SET caption = ? WHERE id = ?', [caption || null, id]);

    res.json({ message: 'Story updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

// Delete Story
router.delete('/stories/:id', auth, (req, res) => {
  try {
    const { id } = req.params;

    const story = all('SELECT user_id FROM stories WHERE id = ?', [id]);
    if (!story || story.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }

    if (story[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    run('DELETE FROM stories WHERE id = ?', [id]);

    res.json({ message: 'Story deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;