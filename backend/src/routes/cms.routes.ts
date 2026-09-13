import { Router } from 'express';
import {
  getTeam,
  getNews,
  getNewsBySlug,
  getJobs,
  applyJob,
  submitGeneralInquiry,
  getSettings,
  getAdminStats,
  createNews,
  updateNews,
  deleteNews,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
  updateJobApplicationStatus,
  getAdminGeneralInquiries,
  updateGeneralInquiryStatus,
  getCompanyInfo,
  updateCompanyInfo,
} from '../controllers/cms.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/team', getTeam);
router.get('/news', getNews);
router.get('/news/:slug', getNewsBySlug);
router.get('/jobs', getJobs);
router.post('/jobs/apply', applyJob);
router.post('/inquiries', submitGeneralInquiry);
router.get('/settings', getSettings);
router.get('/company-info', getCompanyInfo);

// Admin routes (Protected by JWT & RBAC)
router.get('/admin/stats', authenticate, getAdminStats);
router.put('/admin/company-info', authenticate, requireRole([Role.SUPER_ADMIN, Role.ADMIN]), updateCompanyInfo);

// News Admin CRUD
router.post('/admin/news', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), createNews);
router.put('/admin/news/:id', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), updateNews);
router.delete('/admin/news/:id', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), deleteNews);

// Team Admin CRUD
router.post('/admin/team', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), createTeamMember);
router.put('/admin/team/:id', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), updateTeamMember);
router.delete('/admin/team/:id', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), deleteTeamMember);

// Careers Admin CRUD
router.post('/admin/jobs', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), createJob);
router.put('/admin/jobs/:id', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), updateJob);
router.delete('/admin/jobs/:id', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), deleteJob);
router.get('/admin/applications', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), getJobApplications);
router.patch('/admin/applications/:id', authenticate, requireRole([Role.ADMIN, Role.CONTENT_MANAGER]), updateJobApplicationStatus);

// General & IT Inquiries Admin
router.get('/admin/inquiries', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER, Role.CONTENT_MANAGER]), getAdminGeneralInquiries);
router.patch('/admin/inquiries/:id', authenticate, requireRole([Role.ADMIN, Role.BUSINESS_MANAGER, Role.CONTENT_MANAGER]), updateGeneralInquiryStatus);

export default router;
