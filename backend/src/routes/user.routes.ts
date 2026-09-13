import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from '../controllers/user.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Staff Management Routes (Protected by JWT & RBAC)
router.get('/', authenticate, requireRole([Role.SUPER_ADMIN, Role.ADMIN]), getUsers);
router.post('/', authenticate, requireRole([Role.SUPER_ADMIN, Role.ADMIN]), createUser);
router.put('/:id', authenticate, requireRole([Role.SUPER_ADMIN, Role.ADMIN]), updateUser);
router.patch('/:id/status', authenticate, requireRole([Role.SUPER_ADMIN, Role.ADMIN]), toggleUserStatus);
router.delete('/:id', authenticate, requireRole([Role.SUPER_ADMIN]), deleteUser);

export default router;
