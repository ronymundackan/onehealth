// routes/hospitals.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have authMiddleware

// Add a hospital
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, location, contact, user_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Hospitals (name, location, contact) VALUES (?, ?, ?)',
      [name, location, contact, user_id]
    );
    res.status(201).json({ message: 'Hospital added successfully', hospitalId: result.insertId });
  } catch (error) {
    console.error('Error adding hospital:', error);
    res.status(500).json({ message: 'Failed to add hospital' });
  }
});

// Get all hospitals
router.get('/', authMiddleware, async (req, res) => {
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
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Hospitals WHERE hospital_id = ?', [id]);
    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    res.status(500).json({ message: 'Failed to delete hospital' });
  }
});

module.exports = router;