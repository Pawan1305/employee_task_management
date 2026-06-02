const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');

const ALLOWED_STATUS = ['pending', 'in_progress', 'completed'];

function validateStatus(status) {
  if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
    const error = new Error('Status must be pending, in_progress, or completed.');
    error.statusCode = 400;
    throw error;
  }
}

async function createTask(data) {
  if (!data || typeof data !== 'object') {
    const error = new Error('Request body is required.');
    error.statusCode = 400;
    throw error;
  }

  const { title, description, assigned_to, status = 'pending', due_date } = data;

  if (!title || !description || !assigned_to || !due_date) {
    const error = new Error('Title, description, assigned_to, and due_date are required.');
    error.statusCode = 400;
    throw error;
  }

  validateStatus(status);

  const assignedUser = await userModel.findUserById(Number(assigned_to));
  if (!assignedUser) {
    const error = new Error('Assigned user not found.');
    error.statusCode = 404;
    throw error;
  }

  if (assignedUser.role !== 'employee') {
    const error = new Error('Tasks can only be assigned to users with employee role.');
    error.statusCode = 400;
    throw error;
  }

  const id = await taskModel.createTask({
    title,
    description,
    assigned_to: Number(assigned_to),
    status,
    due_date,
  });

  return taskModel.getTaskById(id);
}

async function getAllTasks(requester) {
  if (requester.role === 'admin') {
    return taskModel.getAllTasks();
  }
  return taskModel.getTasksByUserId(requester.id);
}

async function getTaskById(id, requester) {
  const task = await taskModel.getTaskById(id);

  if (!task) {
    const error = new Error('Task not found.');
    error.statusCode = 404;
    throw error;
  }

  if (requester.role !== 'admin' && requester.id !== task.assigned_to) {
    const error = new Error('Forbidden: cannot access this task.');
    error.statusCode = 403;
    throw error;
  }

  return task;
}

async function updateTask(id, payload, requester) {
  const existingTask = await getTaskById(id, requester);

  if (!payload || typeof payload !== 'object') {
    const error = new Error('Request body is required.');
    error.statusCode = 400;
    throw error;
  }

  const updates = {};
  if (requester.role === 'admin') {
    if (payload.title !== undefined) {
      updates.title = payload.title;
    }
    if (payload.description !== undefined) {
      updates.description = payload.description;
    }
    if (payload.status !== undefined) {
      updates.status = payload.status;
    }
    if (payload.due_date !== undefined) {
      updates.due_date = payload.due_date;
    }
  } else {
    // Employees can only change task status.
    if (payload.status !== undefined) {
      updates.status = payload.status;
    }
  }

  if (Object.keys(updates).length === 0) {
    const error = new Error('No valid fields provided for update.');
    error.statusCode = 400;
    throw error;
  }

  validateStatus(updates.status);

  await taskModel.updateTask(existingTask.id, updates);
  return taskModel.getTaskById(existingTask.id);
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
};