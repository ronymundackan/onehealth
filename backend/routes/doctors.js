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

    // Fetch doctors for the hospital (updated to get phone_number instead of availability fields)
    const [doctorsRows] = await pool.query(
      'SELECT doctor_id, name, specialization, phone_number FROM Doctors WHERE hospital_id = ?',
      [hospitalId]
    );

    res.json(doctorsRows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
});

// Add a new doctor (updated to include phone_number instead of availability fields)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { name, specialization, phone_number } = req.body;

    // Get hospital_id from Hospitals table
    const [hospitalRows] = await pool.query(
      'SELECT hospital_id FROM Hospitals WHERE user_id = ?',
      [userId]
    );

    if (hospitalRows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const hospitalId = hospitalRows[0].hospital_id;

    // Insert new doctor with phone_number
    await pool.query(
      'INSERT INTO Doctors (hospital_id, name, specialization, phone_number) VALUES (?, ?, ?, ?)',
      [hospitalId, name, specialization, phone_number]
    );

    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error adding doctor:', error);
    res.status(500).json({ message: 'Failed to add doctor' });
  }
});

// Update doctor phone number (replaces the availability update endpoint)
router.put('/:doctorId/phone', authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { phone_number } = req.body;

    await pool.query(
      'UPDATE Doctors SET phone_number = ? WHERE doctor_id = ?',
      [phone_number, doctorId]
    );

    res.json({ message: 'Doctor phone number updated successfully' });
  } catch (error) {
    console.error('Error updating phone number:', error);
    res.status(500).json({ message: 'Failed to update phone number' });
  }
});

// Optional: Add an endpoint to update all doctor information
router.put('/:doctorId', authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { name, specialization, phone_number } = req.body;

    await pool.query(
      'UPDATE Doctors SET name = ?, specialization = ?, phone_number = ? WHERE doctor_id = ?',
      [name, specialization, phone_number, doctorId]
    );

    res.json({ message: 'Doctor information updated successfully' });
  } catch (error) {
    console.error('Error updating doctor information:', error);
    res.status(500).json({ message: 'Failed to update doctor information' });
  }
});

module.exports = router;