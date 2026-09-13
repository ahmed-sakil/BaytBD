import { Router } from 'express';
import {
  getCategories,
  getProducts,
  getProductBySlug,
  createOrder,
  getAdminOrders,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/agro.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.post('/orders', createOrder);

// Admin routes
router.get('/admin/orders', authenticate, requireRole([Role.ADMIN, Role.ORDER_MANAGER]), getAdminOrders);
router.patch('/admin/orders/:id', authenticate, requireRole([Role.ADMIN, Role.ORDER_MANAGER]), updateOrderStatus);

router.post('/admin/products', authenticate, requireRole([Role.ADMIN, Role.ORDER_MANAGER]), createProduct);
router.put('/admin/products/:id', authenticate, requireRole([Role.ADMIN, Role.ORDER_MANAGER]), updateProduct);
router.delete('/admin/products/:id', authenticate, requireRole([Role.ADMIN, Role.ORDER_MANAGER]), deleteProduct);

export default router;
