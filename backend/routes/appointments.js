// routes/appointments.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { doctorId, appointmentDate } = req.body;

    // Check if the doctor exists and get hospital_id
    const [doctorRows] = await pool.query(
      'SELECT doctor_id, hospital_id FROM Doctors WHERE doctor_id = ?',
      [doctorId]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const hospitalId = doctorRows[0].hospital_id; // Extract hospital_id

    // Check if the user exists
    const [userRows] = await pool.query(
      'SELECT * FROM Users WHERE user_id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Insert appointment request (without slot) with hospital_id and status
    await pool.query(
      'INSERT INTO Appointments (user_id, doctor_id, hospital_id, appointment_date, status) VALUES (?, ?, ?, ?, ?)',
      [userId, doctorId, hospitalId, appointmentDate, 'pending']
    );

    res.status(201).json({ message: 'Appointment request sent successfully' });
  } catch (error) {
    console.error('Error sending appointment request:', error);
    res.status(500).json({ message: 'Failed to send appointment request' });
  }
});

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

    // Fetch appointments with user details and total appointments for each doctor and date
    const [appointmentRows] = await pool.query(
      `SELECT a.appointment_id, p.name AS user_name, p.phone_number, a.appointment_date, d.name AS doctor_name,
       (SELECT COUNT(*) FROM Appointments WHERE doctor_id = a.doctor_id AND appointment_date = a.appointment_date AND slot IS NOT NULL) AS total_appointments
       FROM Appointments a 
       JOIN Patients p ON a.user_id = p.user_id 
       JOIN Doctors d ON a.doctor_id = d.doctor_id
       WHERE d.hospital_id = ? AND a.status = 'pending'`,
      [hospitalId]
    );

    res.json(appointmentRows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});
  
  // Approve appointment
  router.put('/:appointmentId/approve', authMiddleware, async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { slot } = req.body;
  
      // Update appointment status and set slot
      await pool.query(
        'UPDATE Appointments SET status = "approved", slot = ? WHERE appointment_id = ?',
        [slot, appointmentId]
      );
  
      res.json({ message: 'Appointment approved successfully' });
    } catch (error) {
      console.error('Error approving appointment:', error);
      res.status(500).json({ message: 'Failed to approve appointment' });
    }
  });

  router.get('/user', authMiddleware, async (req, res) => {
    try {
      const userId = req.userId;
  
      const [appointments] = await pool.query(
        `SELECT a.appointment_id, h.name AS hospital_name, d.name AS doctor_name, a.appointment_date, a.status, a.slot
         FROM Appointments a
         JOIN Hospitals h ON a.hospital_id = h.hospital_id
         JOIN Doctors d ON a.doctor_id = d.doctor_id
         WHERE a.user_id = ?`,
        [userId]
      );
  
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      res.status(500).json({ message: 'Failed to fetch user appointments' });
    }
  });

  router.put('/:appointmentId/access', authMiddleware, async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { accessStatus } = req.body;
  
      await pool.query(
        'UPDATE Appointments SET access_status = ? WHERE appointment_id = ?',
        [accessStatus, appointmentId]
      );
  
      res.json({ message: 'Access status updated successfully' });
    } catch (error) {
      console.error('Error updating access status:', error);
      res.status(500).json({ message: 'Failed to update access status' });
    }
  });

  router.get('/:appointmentId/access', authMiddleware, async (req, res) => {
    try {
      const { appointmentId } = req.params;
  
      const [rows] = await pool.query(
        'SELECT access_status FROM Appointments WHERE appointment_id = ?',
        [appointmentId]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      res.json({ accessStatus: rows[0].access_status });
    } catch (error) {
      console.error('Error fetching access status:', error);
      res.status(500).json({ message: 'Failed to fetch access status' });
    }
  });


  router.get('/:appointmentId/details', authMiddleware, async (req, res) => {
    const { appointmentId } = req.params;
  
    try {
      const [rows] = await pool.query(
        'SELECT doctor_id, appointment_date FROM Appointments WHERE appointment_id = ?',
        [appointmentId]
      );
  
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: 'Appointment not found' });
      }
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      res.status(500).json({ message: 'Failed to fetch appointment details' });
    }
  });

  router.get('/slots/:appointmentDate/:slot/:doctorId', authMiddleware, async (req, res) => {
    try {
      const { appointmentDate, slot, doctorId } = req.params;
  
      // Extract the date portion (YYYY-MM-DD) from the ISO 8601 string
      const datePart = appointmentDate.split('T')[0];

      
      const [rows] = await pool.query(
        'SELECT COUNT(*) AS count FROM Appointments WHERE appointment_date= ? AND slot = ? AND doctor_id = ?',
        [datePart, slot, doctorId]
      );
  

      res.json({ count: rows[0].count });
    } catch (error) {
      console.error('Error fetching slot count', error);
      res.status(500).json({ message: 'Failed to fetch slot count' });
    }
  });


  router.get('doctor/counts', authMiddleware, async (req, res) => {
    try {
      const { appointmentDate, slot, doctorId } = req.params;
  
      // Extract the date portion (YYYY-MM-DD) from the ISO 8601 string
      const datePart = appointmentDate.split('T')[0];

      
      const [rows] = await pool.query(
        'SELECT COUNT(*) AS count FROM Appointments WHERE appointment_date= ? AND slot = ? AND doctor_id = ?',
        [datePart, slot, doctorId]
      );
  

      res.json({ count: rows[0].count });
    } catch (error) {
      console.error('Error fetching slot count', error);
      res.status(500).json({ message: 'Failed to fetch slot count' });
    }
  });

// In your appointments router file (e.g., routes/appointments.js)

router.get('/sorted', authMiddleware, async (req, res) => {
  try {
      const userId = req.userId;
      const { sortBy = 'appointment_date', status } = req.query;

      // Get hospital_id for this user
      const [hospitalRows] = await pool.query(
          'SELECT hospital_id FROM Hospitals WHERE user_id = ?',
          [userId]
      );

      if (hospitalRows.length === 0) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      const hospitalId = hospitalRows[0].hospital_id;

      // Query for hospital users
      let query = `
          SELECT a.appointment_id, a.user_id, p.name AS user_name, p.phone_number,
                 d.name AS doctor_name, a.hospital_id, a.appointment_date, 
                 a.status, a.slot, a.created_at, a.access_status
          FROM Appointments a
          JOIN Users u ON a.user_id = u.user_id
          JOIN Patients p ON a.user_id = p.user_id
          JOIN Doctors d ON a.doctor_id = d.doctor_id
          WHERE a.hospital_id = ?
      `;

      let params = [hospitalId];

      // Add status filter if provided
      if (status) {
          query += ' AND a.status = ?';
          params.push(status);
      }

      // Add sorting
      const validSortColumns = ['appointment_date', 'created_at', 'status'];
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'appointment_date';

      query += ` ORDER BY a.${sortColumn}`;

      // Execute query
      const [appointments] = await pool.query(query, params);

      res.status(200).json(appointments);
  } catch (error) {
      console.error('Error fetching sorted appointments:', error);
      res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});



// routes/appointments.js - Add this new route to your existing file

// Endpoint to mark an appointment as complete
router.put('/:appointmentId/complete', authMiddleware, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.userId;
    
    // Check if the appointment exists
    const [appointmentRows] = await pool.query(
      'SELECT * FROM Appointments WHERE appointment_id = ?',
      [appointmentId]
    );
    
    if (appointmentRows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Optional: Check if the user has permission to mark this appointment as complete
    // This could be based on user role (doctor, admin) or relationship to the appointment
    
    // Update the appointment status to completed
    await pool.query(
      'UPDATE Appointments SET status = "completed" WHERE appointment_id = ?',
      [appointmentId]
    );
    
    return res.status(200).json({ 
      message: 'Appointment marked as complete successfully',
      appointmentId
    });
    
  } catch (error) {
    console.error('Error marking appointment as complete:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;