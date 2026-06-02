const taskService = require('../services/taskService');

async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

async function getTasks(req, res, next) {
  try {
    const tasks = await taskService.getAllTasks(req.user);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await taskService.getTaskById(Number(req.params.id), req.user);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.body, req.user);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
};