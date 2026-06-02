const userModel = require('../models/userModel');
const taskModel = require('../models/taskModel');

async function listUsers() {
  return userModel.getAllUsers();
}

async function getTasksForUser(targetUserId, requester) {
  if (requester.role !== 'admin' && requester.id !== targetUserId) {
    const error = new Error('Forbidden: cannot access another employee tasks.');
    error.statusCode = 403;
    throw error;
  }

  const user = await userModel.findUserById(targetUserId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return taskModel.getTasksByUserId(targetUserId);
}

module.exports = {
  listUsers,
  getTasksForUser,
};