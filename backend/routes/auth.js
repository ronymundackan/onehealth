// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const [userRows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);

    if (userRows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userRows[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  let connection;
  try {
    const { email, password, name, gender, date_of_birth, phone_number, address } = req.body;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Users table
    const [userResult] = await connection.query(
      'INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'patient']
    );
    const userId = userResult.insertId;

    // Insert into Patients table
    await connection.query(
      'INSERT INTO Patients (user_id, name, gender, date_of_birth, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, gender, date_of_birth, phone_number, address]
    );

    await connection.commit();
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;