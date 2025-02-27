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

    const { disease, description, treatment_date,  prescription } = req.body;
    await pool.query(
      'INSERT INTO Medical_Records (user_id, hospital_id, disease, description, treatment_date, prescription) VALUES (?, ?, ?, ?, ?, ?)',
      [patientId, hospitalId, disease, description, treatment_date, prescription]
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

    const { disease, description, treatment_date, prescription } = req.body;
    await pool.query(
      'UPDATE Medical_Records SET disease = ?, description = ?, treatment_date = ?,  prescription = ? WHERE record_id = ? AND hospital_id = ?',
      [disease, description, treatment_date, prescription, recordId, hospitalId]
    );
    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ message: 'Failed to update record' });
  }
});


// Get Medical Records for a specific patient
router.get('/records/:userId', authMiddleware, async (req, res) => { // Changed to userId
  try {
      const { userId } = req.params; // Changed to userId
      const hospitalUserId = req.userId; // Hospital's user ID from token

      // Find the hospital ID associated with the logged-in user
      const [hospitalRows] = await pool.query(
          'SELECT hospital_id FROM Hospitals WHERE user_id = ?',
          [hospitalUserId]
      );

      if (hospitalRows.length === 0) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      const hospitalId = hospitalRows[0].hospital_id;

      // Check if the hospital has access to the patient's records in the Appointments table
      const [appointmentRows] = await pool.query(
          'SELECT access_status FROM Appointments WHERE user_id = ? AND hospital_id = ?',
          [userId, hospitalId]
      );
      console.log(appointmentRows[0].access_status)

      if (appointmentRows.length === 0 || appointmentRows[0].access_status !== 1) {
          return res.status(403).json({ message: 'Access denied: No authorized appointment' });
      }

      // Fetch medical records for the specified patient and hospital
      const [rows] = await pool.query(
          'SELECT * FROM Medical_Records WHERE user_id = ?',
          [userId]
      );

      res.json(rows);
  } catch (error) {
      console.error('Error fetching medical records:', error);
      res.status(500).json({ message: 'Failed to fetch medical records' });
  }
});
router.get('/', authMiddleware, async (req, res) => {
  try {
    const patientId = req.userId; // Assuming userId from token is the patient's ID

    // Fetch medical records for the logged-in patient
    const [rows] = await pool.query(
      'SELECT record_id, disease, description, treatment_date, prescription FROM Medical_Records WHERE user_id = ?',
      [patientId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Failed to fetch medical records' });
  }
});
module.exports = router;