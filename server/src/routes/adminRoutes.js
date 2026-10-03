import express from 'express';
import {
  getAdminProperties,
  moderateProperty,
  getAdminUsers,
  updatePlan,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/properties', getAdminProperties);
router.patch('/properties/:id/moderate', moderateProperty);
router.get('/users', getAdminUsers);
router.put('/plans/:id', updatePlan);

export default router;
