const jwt = require('jsonwebtoken');
const Membership = require('../models/Membership');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const roleMiddleware = (roles) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.id || req.body.projectId || req.query.projectId;
      if (!projectId) return res.status(400).json({ message: 'Project ID required' });

      const membership = await Membership.findOne({ 
        user: req.user.id, 
        project: projectId 
      });

      if (!membership || !roles.includes(membership.role)) {
        return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
      }

      req.membership = membership;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error checking role', error: error.message });
    }
  };
};

module.exports = { authMiddleware, roleMiddleware };
