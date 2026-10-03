import express from 'express';
import {
  getPlans,
  purchaseSubscription,
  getTransactions,
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/checkout', protect, purchaseSubscription);
router.get('/transactions', protect, getTransactions);

export default router;
