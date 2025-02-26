// routes/hospitals.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have authMiddleware
const bcrypt = require('bcrypt');

// Add a hospital
router.post('/', authMiddleware, async (req, res) => {
  let connection; // Declare connection variable
  try {
    const { name, location, contact, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Get a connection from the pool
    connection = await pool.getConnection();

    // Start the transaction
    await connection.beginTransaction();

    // Insert into Users table
    const [userResult] = await connection.query(
      'INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'Hospital']
    );
    const userId = userResult.insertId;

    // Insert into Hospitals table
    await connection.query(
      'INSERT INTO Hospitals (name, location, contact, user_id) VALUES (?, ?, ?, ?)',
      [name, location, contact, userId]
    );

    // Commit the transaction
    await connection.commit();

    res.status(201).json({ message: 'Hospital added successfully' });
  } catch (error) {
    // Rollback the transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Error adding hospital:', error);
    res.status(500).json({ message: 'Failed to add hospital' });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Hospitals');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Failed to fetch hospitals' });
  }
});

// Update a hospital
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, location, contact, user_id } = req.body;
    const { id } = req.params;
    await pool.query(
      'UPDATE Hospitals SET name = ?, location = ?, contact = ? WHERE hospital_id = ?',
      [name, location, contact, user_id, id]
    );
    res.json({ message: 'Hospital updated successfully' });
  } catch (error) {
    console.error('Error updating hospital:', error);
    res.status(500).json({ message: 'Failed to update hospital' });
  }
});

// Delete a hospital
router.delete('/:id', authMiddleware, async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Get the user_id associated with the hospital
    const [hospitalRows] = await connection.query(
      'SELECT user_id FROM Hospitals WHERE hospital_id = ?',
      [id]
    );

    if (hospitalRows.length === 0 || hospitalRows[0].user_id === null) {
      // Hospital not found or no associated user, just delete the hospital
      await connection.query('DELETE FROM Hospitals WHERE hospital_id = ?', [id]);
    } else {
      const userId = hospitalRows[0].user_id;

      // Delete the hospital
      await connection.query('DELETE FROM Hospitals WHERE hospital_id = ?', [id]);

      // Delete the user from the Users table
      await connection.query('DELETE FROM Users WHERE user_id = ?', [userId]);
    }

    await connection.commit();
    res.json({ message: 'Hospital and associated user deleted successfully' });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error deleting hospital:', error);
    res.status(500).json({ message: 'Failed to delete hospital' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.get('/hospital-details', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch hospital name and user email
    const [hospitalRows] = await pool.query(
      'SELECT h.name, u.email FROM Hospitals h JOIN Users u ON h.user_id = u.user_id WHERE h.user_id = ?',
      [userId]
    );

    if (hospitalRows.length === 0) {
      return res.status(404).json({ message: 'Hospital details not found' });
    }

    const hospitalDetails = hospitalRows[0];

    res.json({
      name: hospitalDetails.name,
      email: hospitalDetails.email,
    });
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    res.status(500).json({ message: 'Failed to fetch hospital details' });
  }
});

router.get('/:hospitalId/doctors', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const [doctorRows] = await pool.query(
      'SELECT doctor_id, name, specialization FROM Doctors WHERE hospital_id = ?',
      [hospitalId]
    );
    res.json(doctorRows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});




module.exports = router;