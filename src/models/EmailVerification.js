const mongoose = require('mongoose');
const crypto = require('crypto');

const emailVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // 1 hour
  }
});

// Generate verification token
emailVerificationSchema.methods.generateToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.token = crypto.createHash('sha256').update(token).digest('hex');
  return token;
};

module.exports = mongoose.model('EmailVerification', emailVerificationSchema);
