const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Membership = require('./models/Membership');
const Task = require('./models/Task');
const Activity = require('./models/Activity');

/**
 * Seed script for TeamFlow AI
 * Run this to reset the database with a clean, realistic dataset for demonstration.
 */
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas. Starting data purge...');

    // Wipe everything
    await User.deleteMany({});
    await Project.deleteMany({});
    await Membership.deleteMany({});
    await Task.deleteMany({});
    await Activity.deleteMany({});

    // 1. Create Core Users (using realistic professional names)
    const admin = new User({ 
      name: 'Prince Yadav', 
      email: 'prince@studiodesolve.com', 
      password: 'password123', 
      role_global: 'ADMIN' 
    });
    const member = new User({ 
      name: 'Alex Rivera', 
      email: 'alex@teamflow.io', 
      password: 'password123' 
    });
    
    await admin.save();
    await member.save();

    // 2. Main Demo Project: Ethara AI Platform
    const project = new Project({ 
      name: 'Ethara AI Infrastructure', 
      description: 'Building the core engine for our next-generation AI diagnostic tool. Focusing on low-latency data processing and glassmorphic visualization.', 
      createdBy: admin._id 
    });
    await project.save();

    // 3. Establish Project Ownership
    await new Membership({ user: admin._id, project: project._id, role: 'ADMIN' }).save();
    await new Membership({ user: member._id, project: project._id, role: 'MEMBER' }).save();

    // 4. Realistic Engineering Tasks
    const tasks = [
      { 
        title: 'Design System - Token Migration', 
        description: 'Migrate legacy CSS variables to the new Apple-style design tokens for better consistency.', 
        status: 'DONE', 
        priority: 'HIGH', 
        project: project._id, 
        assignedTo: admin._id 
      },
      { 
        title: 'Auth Layer - JWT Rotation', 
        description: 'Implement secure JWT rotation and refresh token logic in the auth middleware.', 
        status: 'IN_PROGRESS', 
        priority: 'HIGH', 
        project: project._id, 
        assignedTo: member._id 
      },
      { 
        title: 'API Performance Benchmarking', 
        description: 'Run load tests on the dashboard aggregation endpoints to identify N+1 query issues.', 
        status: 'TODO', 
        priority: 'MEDIUM', 
        project: project._id, 
        assignedTo: member._id 
      },
      { 
        title: 'Railway CI/CD Workflow', 
        description: 'Optimize the nixpacks build configuration for faster deployment cycles.', 
        status: 'TODO', 
        priority: 'LOW', 
        project: project._id, 
        assignedTo: admin._id 
      },
      { 
        title: 'Bug: Dashboard Chart Flickering', 
        description: 'Investigate Recharts re-rendering issue causing visual glitches on window resize.', 
        status: 'TODO', 
        priority: 'HIGH', 
        project: project._id, 
        assignedTo: member._id, 
        dueDate: new Date(Date.now() - 86400000) // Intentional overdue task for demo
      }
    ];
    await Task.insertMany(tasks);

    // 5. Initial Project Activity
    await new Activity({ 
      user: admin._id, 
      project: project._id, 
      action: 'CREATED_PROJECT', 
      details: 'Initialized the Ethara AI Infrastructure project with the core engineering team.' 
    }).save();

    console.log('--- SEEDING COMPLETE ---');
    console.log('Admin: prince@studiodesolve.com / password123');
    console.log('Member: alex@teamflow.io / password123');
    process.exit();
  } catch (error) {
    console.error('Seeding error encountered:', error);
    process.exit(1);
  }
};

seed();
