const express = require('express');
const {
  register,
  login,
  verifyEmail,
  getMe,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router; 