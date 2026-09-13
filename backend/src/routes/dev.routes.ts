import { Router } from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProjectInquiry,
  getAdminProjectInquiries,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/dev.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);
router.post('/inquiries', createProjectInquiry);

// Admin routes
router.get('/admin/inquiries', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), getAdminProjectInquiries);

router.post('/admin/projects', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), createProject);
router.put('/admin/projects/:id', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), updateProject);
router.delete('/admin/projects/:id', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER]), deleteProject);

export default router;
