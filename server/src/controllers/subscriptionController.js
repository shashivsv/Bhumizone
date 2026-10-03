import { Plan } from '../models/Plan.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';

export const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.json(plans.map((p) => p.toJSON()));
  } catch (error) {
    next(error);
  }
};

export const purchaseSubscription = async (req, res, next) => {
  try {
    const { planId, paymentMethod = 'UPI / Razorpay' } = req.body;
    const user = req.user;

    const plan = await Plan.findOne({ planId });
    if (!plan) {
      return res.status(404).json({ message: 'Selected subscription plan not found.' });
    }

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);

    const subscriptionData = {
      planId: plan.planId,
      planName: plan.name,
      isActive: true,
      isExpired: false,
      startedAt: startDate,
      expiresAt: expiryDate,
      daysRemaining: plan.durationMonths * 30,
    };

    user.subscription = subscriptionData;
    await user.save();

    const transaction = await Transaction.create({
      customId: `txn_${Date.now()}`,
      dealerId: user.customId || user.id || user._id.toString(),
      dealerName: user.name,
      agencyName: user.agencyName || null,
      planId: plan.planId,
      planName: `${plan.name} (${plan.durationLabel})`,
      amount: plan.price,
      paymentMethod,
      status: 'SUCCESS',
      referenceId: `RZP_MOCK_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    });

    res.status(201).json({
      user: user.toJSON(),
      subscription: subscriptionData,
      transaction: transaction.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.customId || req.user.id || req.user._id.toString();

    let query = {};
    if (req.user.role !== 'ADMIN') {
      query = {
        $or: [{ dealerId: userId }, { dealerId: req.user._id.toString() }],
      };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.json(transactions.map((t) => t.toJSON()));
  } catch (error) {
    next(error);
  }
};
