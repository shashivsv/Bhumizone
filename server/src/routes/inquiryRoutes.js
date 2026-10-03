import express from 'express';
import {
  sendInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', optionalAuth, sendInquiry);
router.get('/', protect, getInquiries);
router.patch('/:id/status', protect, updateInquiryStatus);

export default router;
