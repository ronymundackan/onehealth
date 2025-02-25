// routes/doctors.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all doctors for the logged-in hospital
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get hospital_id from Hospitals table
    const [hospitalRows] = await pool.query(
      'SELECT hospital_id FROM Hospitals WHERE user_id = ?',
      [userId]
    );

    if (hospitalRows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const hospitalId = hospitalRows[0].hospital_id;

    // Fetch doctors for the hospital
    const [doctorsRows] = await pool.query(
      'SELECT doctor_id, name, specialization, forenoon_availability, afternoon_availability FROM Doctors WHERE hospital_id = ?',
      [hospitalId]
    );

    res.json(doctorsRows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});

// Add a new doctor
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, specialization, forenoon_availability, afternoon_availability } = req.body;

    // Get hospital_id from Hospitals table
    const [hospitalRows] = await pool.query(
      'SELECT hospital_id FROM Hospitals WHERE user_id = ?',
      [userId]
    );

    if (hospitalRows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const hospitalId = hospitalRows[0].hospital_id;

    // Insert new doctor
    await pool.query(
      'INSERT INTO Doctors (hospital_id, name, specialization, forenoon_availability, afternoon_availability) VALUES (?, ?, ?, ?, ?)',
      [hospitalId, name, specialization, forenoon_availability, afternoon_availability]
    );

    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Failed to add doctor' });
  }
});

// Update doctor availability
router.put('/:doctorId/availability', authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { forenoon_availability, afternoon_availability } = req.body;

    await pool.query(
      'UPDATE Doctors SET forenoon_availability = ?, afternoon_availability = ? WHERE doctor_id = ?',
      [forenoon_availability, afternoon_availability, doctorId]
    );

    res.json({ message: 'Doctor availability updated successfully' });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Failed to update availability' });
  }
});

module.exports = router;