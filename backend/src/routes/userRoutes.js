const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), userController.getUsers);
router.get('/:id/tasks', authMiddleware, userController.getUserTasks);

module.exports = router;