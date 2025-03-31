// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');


router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    res.status(200).json({ message: 'Token is valid' });
  });
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const queryResult = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    const userRows = queryResult[0];

    if (userRows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userRows[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });    }

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

    // Check if email already exists
    const [existingUsers] = await connection.query('SELECT email FROM Users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Email already exists' });
    }

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