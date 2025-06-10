const User = require('../models/User');
const Transaction = require('../models/Transaction');
const creditService = require('../services/creditService');

// @desc    Get credit balance
// @route   GET /api/credits/balance
// @access  Private
exports.getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        credits: user.credits
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get transaction history
// @route   GET /api/credits/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Purchase credits
// @route   POST /api/credits/purchase
// @access  Private
exports.purchaseCredits = async (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid amount of credits to purchase'
      });
    }

    // Calculate price (1 credit = $1)
    const price = amount;

    // TODO: Integrate with payment gateway
    // For now, we'll simulate a successful payment

    // Add credits to user
    await creditService.addCredits(
      req.user.id,
      amount,
      'purchase',
      price,
      paymentMethod
    );

    res.status(200).json({
      success: true,
      data: {
        credits: amount,
        price
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get credit packages
// @route   GET /api/credits/packages
// @access  Public
exports.getPackages = async (req, res, next) => {
  try {
    const packages = [
      {
        id: 'basic',
        name: 'Basic Package',
        credits: 10,
        price: 10,
        features: ['10 AI-generated lessons', 'Basic support']
      },
      {
        id: 'standard',
        name: 'Standard Package',
        credits: 50,
        price: 45,
        features: ['50 AI-generated lessons', 'Priority support', '10% discount']
      },
      {
        id: 'premium',
        name: 'Premium Package',
        credits: 100,
        price: 80,
        features: ['100 AI-generated lessons', '24/7 support', '20% discount', 'Custom lesson templates']
      }
    ];

    res.status(200).json({
      success: true,
      data: packages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get credit usage statistics
// @route   GET /api/credits/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id
        }
      },
      {
        $group: {
          _id: '$type',
          totalCredits: { $sum: '$credits' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
}; 