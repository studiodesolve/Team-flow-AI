// Load environment variables. .env is for local development only!
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Route imports - organized by feature area
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');
const extraRoutes = require('./routes/extras');
const profileRoutes = require('./routes/profile');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection logic
// Using Mongoose for schema-based data modeling
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI is missing. Database operations will fail.');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is missing. Authentication will fail.');
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
  .then(() => console.log('✅ Connected to MongoDB Atlas cluster'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
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
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
