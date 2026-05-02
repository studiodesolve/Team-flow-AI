const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, addMember, removeMember } = require('../controllers/projects');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin only routes
router.post('/:id/members', roleMiddleware(['ADMIN']), addMember);
router.delete('/:id/members/:userId', roleMiddleware(['ADMIN']), removeMember);

module.exports = router;
