const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getDashboardStats);

module.exports = router;
