// backend/auth_routes.js
const bcrypt = require('bcryptjs');
const { pool } = require('./db');

// POST /api/auth/register
async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please enter both username and password.' });
  }

  const cleanUsername = String(username).trim();
  if (cleanUsername.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters.' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    // Ensure uniqueness
    const [existing] = await pool.query('SELECT username FROM users WHERE username = ?', [cleanUsername]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const hashed = bcrypt.hashSync(password, 10);

    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [cleanUsername, hashed]);

    return res.status(201).json({ success: true, username: cleanUsername });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to register user.' });
  }
}

module.exports = { register };
