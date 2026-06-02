const userService = require('../services/userService');

async function getUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserTasks(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const tasks = await userService.getTasksForUser(userId, req.user);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserTasks,
};