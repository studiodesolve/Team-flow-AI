const Task = require('../models/Task');
const Membership = require('../models/Membership');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, projectId, assignedToId } = req.body;
  try {
    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      project: projectId,
      assignedTo: assignedToId || null
    });
    await task.save();

    // Log Activity
    await new Activity({
      user: req.user.id,
      project: projectId,
      action: 'CREATED_TASK',
      details: `Created task: ${title}`
    }).save();

    // Create Notification if assigned
    if (assignedToId && assignedToId !== req.user.id) {
      await new Notification({
        recipient: assignedToId,
        sender: req.user.id,
        message: `You have been assigned a new task: ${title}`,
        link: `/projects/${projectId}`
      }).save();
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};

const getTasks = async (req, res) => {
  const { projectId } = req.query;
  try {
    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedToId } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const membership = await Membership.findOne({ user: req.user.id, project: task.project });
    
    if (membership.role !== 'ADMIN') {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied: You can only update tasks assigned to you' });
      }
      task.status = status || task.status;
    } else {
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedToId || task.assignedTo;
    }

    await task.save();

    // Log Activity for status update
    await new Activity({
      user: req.user.id,
      project: task.project,
      action: 'UPDATED_TASK',
      details: `Updated task: ${task.title} to ${task.status}`
    }).save();

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
