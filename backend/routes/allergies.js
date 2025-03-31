// routes/allergies.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Get all allergies for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    const [rows] = await pool.query(
      'SELECT allergy_id, allergy_name, severity FROM Allergies WHERE user_id = ?',
      [userId]
    );
    
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching allergies:', error);
    res.status(500).json({ message: 'Server error while fetching allergies' });
  }
});

// Add a new allergy
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { allergyName, severity } = req.body;
    
    // Validate required fields
    if (!allergyName) {
      return res.status(400).json({ message: 'Allergy name is required' });
    }
    
    // Insert the new allergy
    const [result] = await pool.query(
      'INSERT INTO Allergies (user_id, allergy_name, severity) VALUES (?, ?, ?)',
      [userId, allergyName, severity || 'Mild']
    );
    
    // Fetch the newly created allergy to return
    const [newAllergy] = await pool.query(
      'SELECT * FROM Allergies WHERE allergy_id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      message: 'Allergy added successfully',
      allergy: newAllergy[0]
    });
  } catch (error) {
    console.error('Error adding allergy:', error);
    res.status(500).json({ message: 'Server error while adding allergy' });
  }
});

// Delete an allergy
router.delete('/:allergyId', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { allergyId } = req.params;
    
    // First check if the allergy belongs to this user
    const [rows] = await pool.query(
      'SELECT * FROM Allergies WHERE allergy_id = ? AND user_id = ?',
      [allergyId, userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Allergy not found or not authorized' });
    }
    
    // If found, delete it
    await pool.query(
      'DELETE FROM Allergies WHERE allergy_id = ?',
      [allergyId]
    );
    
    res.status(200).json({ 
      message: 'Allergy deleted successfully',
      allergy: rows[0]
    });
  } catch (error) {
    console.error('Error deleting allergy:', error);
    res.status(500).json({ message: 'Server error while deleting allergy' });
  }
});

// Update an allergy
router.put('/:allergyId', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { allergyId } = req.params;
    const { allergyName, severity } = req.body;
    
    // Validate required fields
    if (!allergyName) {
      return res.status(400).json({ message: 'Allergy name is required' });
    }
    
    // Check if the allergy belongs to this user
    const [rows] = await pool.query(
      'SELECT * FROM Allergies WHERE allergy_id = ? AND user_id = ?',
      [allergyId, userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Allergy not found or not authorized' });
    }
    
    // Update the allergy
    await pool.query(
      'UPDATE Allergies SET allergy_name = ?, severity = ? WHERE allergy_id = ?',
      [allergyName, severity || 'Mild', allergyId]
    );
    
    // Fetch the updated allergy to return
    const [updatedAllergy] = await pool.query(
      'SELECT * FROM Allergies WHERE allergy_id = ?',
      [allergyId]
    );
    
    res.status(200).json({
      message: 'Allergy updated successfully',
      allergy: updatedAllergy[0]
    });
  } catch (error) {
    console.error('Error updating allergy:', error);
    res.status(500).json({ message: 'Server error while updating allergy' });
  }
});

module.exports = router;