const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

const getActivitiesByProject = async (req, res) => {
  try {
    const activities = await Activity.find({ project: req.params.projectId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

const markRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
};

module.exports = { getActivitiesByProject, getNotifications, markRead };
