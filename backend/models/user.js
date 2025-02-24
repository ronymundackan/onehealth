// models/user.js
const pool = require('../db');
const bcrypt = require('bcrypt');

async function findUserByEmail(email) { // Changed from findUserByUsername to findUserByEmail
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
}

async function createUser(email, password, role, name, gender, date_of_birth, phone_number,address) { // Added new columns
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await pool.query(
    'INSERT INTO Users (email, password_hash, role, name, gender, date_of_birth, phone_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', // Added new columns
    [email, hashedPassword, role, name, gender, date_of_birth, phone_number,address] // Added new columns
    
  );
  console.log(result);
  return result.insertId;
}

module.exports = {
  findUserByEmail, // Changed from findUserByUsername to findUserByEmail
  createUser,
};