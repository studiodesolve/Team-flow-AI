const Project = require('../models/Project');
const Membership = require('../models/Membership');
const User = require('../models/User');
const Task = require('../models/Task');
const { sendProjectInviteEmail } = require('../services/emailService');

const createProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const project = new Project({ name, description, createdBy: req.user.id });
    await project.save();

    // The creator automatically becomes the ADMIN
    const membership = new Membership({
      user: req.user.id,
      project: project._id,
      role: 'ADMIN'
    });
    await membership.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Error creating project', error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const memberships = await Membership.find({ user: req.user.id }).populate('project');
    const projects = await Promise.all(memberships.map(async (m) => {
      if (!m.project) return null;
      const membersCount = await Membership.countDocuments({ project: m.project._id });
      const tasksCount = await Task.countDocuments({ project: m.project._id });
      return {
        ...m.project._doc,
        role: m.role,
        membersCount,
        tasksCount
      };
    }));
    res.json(projects.filter(p => p !== null));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const memberships = await Membership.find({ project: project._id }).populate('user', 'name email');
    const membership = await Membership.findOne({ user: req.user.id, project: project._id });

    res.json({ ...project._doc, members: memberships, myRole: membership?.role });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
};

const addMember = async (req, res) => {
  const { email, role } = req.body;
  const projectId = req.params.id;
  try {
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const membership = new Membership({
      user: userToAdd._id,
      project: projectId,
      role: role || 'MEMBER'
    });
    await membership.save();

    // Send async invite email
    sendProjectInviteEmail(userToAdd.email, project.name, membership.role);

    res.status(201).json(membership);
  } catch (error) {
    res.status(400).json({ message: 'User is already a member or error occurred' });
  }
};

const removeMember = async (req, res) => {
  const { userId } = req.params;
  const projectId = req.params.id;
  try {
    await Membership.findOneAndDelete({ user: userId, project: projectId });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(400).json({ message: 'Error removing member' });
  }
};

module.exports = { createProject, getProjects, getProjectById, addMember, removeMember };
