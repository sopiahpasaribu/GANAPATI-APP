const express = require("express");
const { all, get } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/users", auth, (req, res) => {
  try {
    const users = all(
      "SELECT id, username, created_at FROM users WHERE id != ? ORDER BY username",
      [req.user.id]
    );

    const followRows = all(
      "SELECT followee_id FROM follows WHERE follower_id = ?",
      [req.user.id]
    );
    const following = new Set(followRows.map((r) => r.followee_id));

    const result = users.map((u) => ({
      ...u,
      isFollowing: following.has(u.id),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
});

router.get("/users/search", auth, (req, res) => {
  try {
    let { username } = req.query;
    if (!username) return res.status(400).json({ error: "username query required" });

    username = username.trim().toLowerCase();

    const users = all(
      `
      SELECT 
        u.id,
        u.username,
        u.created_at,
        (SELECT COUNT(*) FROM follows f WHERE f.followee_id = u.id) AS followers_count,
        (SELECT COUNT(*) FROM follows f WHERE f.follower_id = u.id) AS following_count
      FROM users u
      WHERE u.username LIKE ? COLLATE NOCASE
      ORDER BY u.username
      `,
      [`%${username}%`]
    );

    const followRows = all(
      "SELECT followee_id FROM follows WHERE follower_id = ?",
      [req.user.id]
    );
    const following = new Set(followRows.map((r) => r.followee_id));

    const result = users.map((u) => {
      const posts = all(
        "SELECT id, content, image_url, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC",
        [u.id]
      );
      return {
        ...u,
        isFollowing: following.has(u.id),
        posts,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ /users/search error:", err);
    res.status(500).json({ error: "internal" });
  }
});

// ✅ ambil profil user berdasarkan ID
router.get("/users/:id", auth, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = get("SELECT id, username, created_at FROM users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = all(
      "SELECT id, content, image_url, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC",
      [id]
    );

    const followRows = all(
      "SELECT followee_id FROM follows WHERE follower_id = ?",
      [req.user.id]
    );
    const isFollowing = followRows.some((f) => f.followee_id === id);

    res.json({ ...user, isFollowing, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal" });
  }
});

module.exports = router;
