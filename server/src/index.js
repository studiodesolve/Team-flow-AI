require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');
const extraRoutes = require('./routes/extras');
const profileRoutes = require('./routes/profile');

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is not defined in environment variables!');
}

if (!process.env.JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET is not defined in environment variables!');
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? 'Defined' : 'Missing',
      JWT_SECRET: process.env.JWT_SECRET ? 'Defined' : 'Missing',
      PORT: process.env.PORT || 'Default (5001)',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  });
});

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB. Please check your MONGODB_URI.');
    console.error(err.message);
  });

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/extras', extraRoutes);
app.use('/api/profile', profileRoutes);

// Serve static assets in production
const clientDistPath = path.resolve(__dirname, '..', '..', 'client', 'dist');
console.log(`Serving static files from: ${clientDistPath}`);

app.use(express.static(clientDistPath));

// Catch-all route to serve index.html for SPA
app.use((req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Error sending index.html: ${err.message}`);
      res.status(500).send('Frontend build not found. Please run build script.');
    }
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
