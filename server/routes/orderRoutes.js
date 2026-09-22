import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderReports
} from '../controllers/orderController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Place order (optional auth: supports registered users and guest checkouts)
router.post('/', (req, res, next) => {
  // If authorization header exists, authenticate; otherwise allow guest
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return requireAuth(req, res, next);
  }
  next();
}, createOrder);

// Order tracking (public by order ID so customers can track without being logged in)
router.get('/:id', getOrderById);

// Customer order history (authenticated)
router.get('/user/history', requireAuth, getUserOrders);

// Admin routes
router.get('/admin/all', requireAuth, requireAdmin, getAllOrders);
router.get('/admin/reports', requireAuth, requireAdmin, getOrderReports);
router.patch('/admin/:id/status', requireAuth, requireAdmin, updateOrderStatus);

export default router;
