const express = require('express');
const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
router.get('/stats', (req, res) => {
  console.log('Dashboard stats route hit!');

  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized' 
    });
  }

  // Return dashboard statistics
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
      creditUsage: [],
      lastUpdated: new Date()
    }
  });
});

// @desc    Get system health
// @route   GET /api/dashboard/health  
router.get('/health', (req, res) => {
  const os = require('os');

  // Check for authorization header
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
      server: {
        uptime: process.uptime(),
        memory: {
          total: os.totalmem(),
          free: os.freemem(),
          used: os.totalmem() - os.freemem(),
          usagePercent: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2)
        },
        cpu: {
          model: os.cpus()[0].model,
          cores: os.cpus().length,
          loadAverage: os.loadavg()
        },
        platform: os.platform(),
        nodeVersion: process.version
      },
      database: {
        status: 'connected'
      },
      timestamp: new Date()
    }
  });
});

module.exports = router;