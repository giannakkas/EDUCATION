const mongoose = require('mongoose');
const app = require('./app');

// Load env vars
require('dotenv').config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB Connected...');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// EMERGENCY DASHBOARD ROUTES - ADD DIRECTLY HERE
app.get('/api/dashboard/stats', (req, res) => {
  console.log('Dashboard stats route hit!');

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized' 
    });
  }

  res.json({
    success: true,
    data: {
      users: {
        total: 1,
        byRole: {
          admin: 1,
          teacher: 0,
          student: 0
        }
      },
      classes: {
        total: 0,
        active: 0
      },
      lessons: {
        total: 0,
        aiGenerated: 0
      },
      financial: {
        totalRevenue: 0,
        totalTransactions: 0,
        recentTransactions: []
      },
      lastUpdated: new Date()
    }
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});