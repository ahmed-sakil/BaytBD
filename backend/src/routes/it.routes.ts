import { Router } from 'express';
import {
  getITServices,
  getITServiceBySlug,
  getITProjects,
  getITProjectBySlug,
  createITService,
  updateITService,
  deleteITService,
  createITProject,
  updateITProject,
  deleteITProject,
} from '../controllers/it.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/services', getITServices);
router.get('/services/:slug', getITServiceBySlug);
router.get('/projects', getITProjects);
router.get('/projects/:slug', getITProjectBySlug);

// Admin routes (Protected by JWT & RBAC)
router.post('/admin/services', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), createITService);
router.put('/admin/services/:id', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), updateITService);
router.delete('/admin/services/:id', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), deleteITService);

router.post('/admin/projects', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), createITProject);
router.put('/admin/projects/:id', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), updateITProject);
router.delete('/admin/projects/:id', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), deleteITProject);

export default router;
