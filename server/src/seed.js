require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Membership = require('./models/Membership');
const Task = require('./models/Task');
const Activity = require('./models/Activity');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Membership.deleteMany({});
    await Task.deleteMany({});
    await Activity.deleteMany({});

    // 1. Create Users
    const admin = new User({ name: 'Admin User', email: 'admin@teamflow.com', password: 'password123', role_global: 'ADMIN' });
    const member = new User({ name: 'Member User', email: 'member@teamflow.com', password: 'password123' });
    await admin.save();
    await member.save();

    // 2. Create Project
    const project = new Project({ 
      name: 'Website Redesign 2026', 
      description: 'Major overhaul of the corporate website using modern stack.', 
      createdBy: admin._id 
    });
    await project.save();

    // 3. Create Memberships
    await new Membership({ user: admin._id, project: project._id, role: 'ADMIN' }).save();
    await new Membership({ user: member._id, project: project._id, role: 'MEMBER' }).save();

    // 4. Create Tasks
    const tasks = [
      { title: 'Design System', description: 'Create a Figma design system with purple theme.', status: 'DONE', priority: 'HIGH', project: project._id, assignedTo: admin._id },
      { title: 'API Integration', description: 'Connect frontend to MongoDB Atlas.', status: 'IN_PROGRESS', priority: 'HIGH', project: project._id, assignedTo: member._id },
      { title: 'Testing', description: 'Run end-to-end tests on all modules.', status: 'TODO', priority: 'MEDIUM', project: project._id, assignedTo: member._id },
      { title: 'Deploy to Railway', description: 'Setup CI/CD pipeline for production.', status: 'TODO', priority: 'LOW', project: project._id, assignedTo: admin._id },
      { title: 'Overdue Task', description: 'This task was due yesterday.', status: 'TODO', priority: 'HIGH', project: project._id, assignedTo: member._id, dueDate: new Date(Date.now() - 86400000) }
    ];
    await Task.insertMany(tasks);

    // 5. Create Activity
    await new Activity({ 
      user: admin._id, 
      project: project._id, 
      action: 'CREATED_PROJECT', 
      details: 'Started the Website Redesign project.' 
    }).save();

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
