// routes/records.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Medical Records Route
router.get('/patients', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId; // Get userId from token
  
      // Find hospitalId from Hospitals table
      const [hospitalRows] = await pool.query(
        'SELECT hospital_id FROM Hospitals WHERE user_id = ?',
        [userId]
      );
  
      if (hospitalRows.length === 0) {
        return res.status(404).json({ message: 'Hospital not found' });
      }
  
      const hospitalId = hospitalRows[0].hospital_id;
  
      const [rows] = await pool.query(`
        SELECT DISTINCT p.user_id, p.name, p.phone_number
        FROM Patients p
        JOIN Appointments a ON p.user_id = a.user_id
        WHERE a.hospital_id = ? AND a.access_status = 1
      `, [hospitalId]);
  
      res.json(rows);
    } catch (error) {
      console.error('Error fetching patients:', error);
      res.status(500).json({ message: 'Failed to fetch patients' });
    }
  });

// Add Record Route
router.post('/records/:patientId', authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.userId; // Get userId from token

    // Find hospitalId from Hospitals table
    const [hospitalRows] = await pool.query(
      'SELECT hospital_id FROM Hospitals WHERE user_id = ?',
      [userId]
    );

    if (hospitalRows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const hospitalId = hospitalRows[0].hospital_id;

    const { disease, description, treatment_date, ongoing_medication, prescription } = req.body;
    await pool.query(
      'INSERT INTO MedicalRecords (user_id, hospital_id, disease, description, treatment_date, ongoing_medication, prescription) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patientId, hospitalId, disease, description, treatment_date, ongoing_medication, prescription]
    );
    res.json({ message: 'Record added successfully' });
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ message: 'Failed to add record' });
  }
});

// Update Record Route
router.put('/records/:recordId', authMiddleware, async (req, res) => {
  try {
    const { recordId } = req.params;
    const userId = req.userId; // Get userId from token

    // Find hospitalId from Hospitals table
    const [hospitalRows] = await pool.query(
      'SELECT hospital_id FROM Hospitals WHERE user_id = ?',
      [userId]
    );

    if (hospitalRows.length === 0) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const hospitalId = hospitalRows[0].hospital_id;

    const { disease, description, treatment_date, ongoing_medication, prescription } = req.body;
    await pool.query(
      'UPDATE MedicalRecords SET disease = ?, description = ?, treatment_date = ?, ongoing_medication = ?, prescription = ? WHERE record_id = ? AND hospital_id = ?',
      [disease, description, treatment_date, ongoing_medication, prescription, recordId, hospitalId]
    );
    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ message: 'Failed to update record' });
  }
});

module.exports = router;