const express = require('express');
const router = express.Router();
const { getActivitiesByProject, getNotifications, markRead } = require('../controllers/extras');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markRead);
router.get('/activities/:projectId', getActivitiesByProject);

module.exports = router;
