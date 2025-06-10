const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.checkCredits = async (userId, requiredCredits) => {
  const user = await User.findById(userId);
  return user.credits >= requiredCredits;
};

exports.deductCredits = async (userId, credits, description) => {
  const user = await User.findById(userId);
  
  if (user.credits < credits) {
    throw new Error('Insufficient credits');
  }

  user.credits -= credits;
  await user.save();

  // Create transaction record
  await Transaction.create({
    user: userId,
    type: 'deduction',
    amount: 0,
    credits: -credits,
    description,
    paymentMethod: 'system'
  });

  return user.credits;
};

exports.addCredits = async (userId, credits, description, transactionType = 'bonus') => {
  const user = await User.findById(userId);
  
  user.credits += credits;
  await user.save();

  // Create transaction record
  await Transaction.create({
    user: userId,
    type: transactionType,
    amount: 0,
    credits,
    description,
    paymentMethod: 'system'
  });

  return user.credits;
}; 