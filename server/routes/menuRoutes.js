import express from 'express';
import {
  getMenuItems,
  getCategories,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Admin-protected routes
router.post('/', requireAuth, requireAdmin, createMenuItem);
router.put('/:id', requireAuth, requireAdmin, updateMenuItem);
router.delete('/:id', requireAuth, requireAdmin, deleteMenuItem);

export default router;
