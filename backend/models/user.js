// models/user.js
const pool = require('../db');
const bcrypt = require('bcrypt');

async function findUserByEmail(email) { // Changed from findUserByUsername to findUserByEmail
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
}

async function createUser(
  email, password, name, gender, date_of_birth, phone_number,address
) {
  const connection = await pool.getConnection(); //get a connection from the pool.
  try {
    await connection.beginTransaction(); // Start transaction.

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      'INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'patient'] // Default role is 'User'
    );
    const userId = userResult.insertId;

    await connection.query(
      'INSERT INTO Patients (user_id, name, gender, date_of_birth, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, gender, date_of_birth, phone_number, address]
    );

    await connection.commit(); // Commit transaction.
    connection.release(); // release the connection.
    return userId;
  } catch (error) {
    await connection.rollback(); // Rollback transaction on error.
    connection.release(); // release the connection.
    console.error('Database insert error:', error);
    throw error;
  }
}
module.exports = {
  findUserByEmail, // Changed from findUserByUsername to findUserByEmail
  createUser,
};