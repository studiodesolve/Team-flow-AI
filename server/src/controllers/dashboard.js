const Task = require('../models/Task');
const Project = require('../models/Project');
const Membership = require('../models/Membership');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all projects the user is a member of
    const memberships = await Membership.find({ user: userId });
    const projectIds = memberships.map(m => m.project);

    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'DONE' });
    const pendingTasks = await Task.countDocuments({ project: { $in: projectIds }, status: { $ne: 'DONE' } });
    
    const today = new Date();
    const overdueTasks = await Task.countDocuments({ 
      project: { $in: projectIds }, 
      status: { $ne: 'DONE' },
      dueDate: { $lt: today }
    });

    const recentTasks = await Task.find({ project: { $in: projectIds } })
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      recentTasks,
      projectCount: projectIds.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

module.exports = { getDashboardStats };
