const pool = require('../config/db');

async function createUser({ name, email, password, role }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function getAllUsers() {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role FROM users ORDER BY role DESC, name ASC'
  );
  return rows;
}

async function findUserById(id) {
  const [rows] = await pool.execute('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers,
  findUserById,
};