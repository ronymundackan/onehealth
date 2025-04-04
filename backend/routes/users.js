// routes/users.js
const express = require('express');
const router = express.Router();

const pool = require('../db'); // Import your database connection pool

// Authentication middleware (you may need to create this)
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // Extracted from the JWT token by authMiddleware

    // Fetch user details from the database
    const [rows] = await pool.query('SELECT user_id, email, role FROM Users WHERE user_id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    res.json({ userId: user.user_id, email: user.email, role: user.role });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

router.get('/user-details', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch name and email using JOIN
    const [userRows] = await pool.query(
      'SELECT p.name, u.email FROM Patients p JOIN Users u ON p.user_id = u.user_id WHERE p.user_id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User details not found' });
    }

    const userDetails = userRows[0];

    res.json({ name: userDetails.name, email: userDetails.email });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

module.exports = router;