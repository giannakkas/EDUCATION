const express = require('express');
const {
  getBalance,
  getTransactions,
  purchaseCredits,
  getPackages,
  getStats
} = require('../controllers/creditController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck'); // Corrected import for authorize

const router = express.Router();

// Public routes
router.get('/packages', getPackages);

// Protected routes
router.use(protect);
router.get('/balance', getBalance);
router.get('/transactions', getTransactions);
router.get('/stats', getStats);

// Teacher only routes
router.post('/purchase', authorize('teacher'), purchaseCredits);

module.exports = router;

