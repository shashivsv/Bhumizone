import express from 'express';
import {
  getProperties,
  getPropertyByIdOrSlug,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getProperties);
router.get('/my-listings', protect, getMyProperties);
router.get('/:idOrSlug', optionalAuth, getPropertyByIdOrSlug);
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

export default router;
