const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/tasks');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// Members can get tasks, Admins can create
router.get('/', getTasks);
router.post('/', roleMiddleware(['ADMIN']), createTask);

// Patch and Delete
router.patch('/:id', updateTask); // Controller handles internal RBAC
router.delete('/:id', roleMiddleware(['ADMIN']), deleteTask);

module.exports = router;
