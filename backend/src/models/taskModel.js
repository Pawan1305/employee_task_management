const pool = require('../config/db');

async function createTask({ title, description, assigned_to, status, due_date }) {
  const [result] = await pool.execute(
    'INSERT INTO tasks (title, description, assigned_to, status, due_date) VALUES (?, ?, ?, ?, ?)',
    [title, description, assigned_to, status, due_date]
  );
  return result.insertId;
}

async function getTaskById(id) {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.assigned_to, t.status, t.due_date,
            u.name AS assigned_to_name, u.email AS assigned_to_email
     FROM tasks t
     JOIN users u ON u.id = t.assigned_to
     WHERE t.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getAllTasks() {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.assigned_to, t.status, t.due_date,
            u.name AS assigned_to_name, u.email AS assigned_to_email
     FROM tasks t
     JOIN users u ON u.id = t.assigned_to
     ORDER BY t.due_date ASC, t.id DESC`
  );
  return rows;
}

async function getTasksByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.assigned_to, t.status, t.due_date,
            u.name AS assigned_to_name, u.email AS assigned_to_email
     FROM tasks t
     JOIN users u ON u.id = t.assigned_to
     WHERE t.assigned_to = ?
     ORDER BY t.due_date ASC, t.id DESC`,
    [userId]
  );
  return rows;
}

async function updateTask(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return 0;
  }

  values.push(id);

  const [result] = await pool.execute(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return result.affectedRows;
}

module.exports = {
  createTask,
  getTaskById,
  getAllTasks,
  getTasksByUserId,
  updateTask,
};