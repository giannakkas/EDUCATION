const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./src/middleware/errorHandler');

// Import Routes
const authRoutes = require('./src/routes/auth');
const lessonRoutes = require('./src/routes/lessons');
const creditRoutes = require('./src/routes/credits');
const dashboardRoutes = require('./src/routes/dashboard'); // ADD THIS LINE
// const userRoutes = require('./src/routes/users');
// const classRoutes = require('./src/routes/classes');

const app = express();

// Security Middleware with relaxed CSP for admin panel


app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/dashboard', dashboardRoutes); // ADD THIS LINE
// app.use('/api/users', userRoutes);
// app.use('/api/classes', classRoutes);

// Users endpoint - temporary implementation for admin panel
app.get('/api/users', (req, res) => {
  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized' 
    });
  }

  // Return mock user data
  res.json({
    success: true,
    data: [
      {
        _id: '683f5985f9ffe5b220dc3bcc',
        name: 'Admin',
        email: 'admin@eduplatform.com',
        role: 'admin',
        credits: 0,
        isEmailVerified: true,
        createdAt: new Date()
      }
    ]
  });
});




// Error Handler
app.use(errorHandler);

module.exports = app;