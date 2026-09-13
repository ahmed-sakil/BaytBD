import { Router } from 'express';
import authRoutes from './auth.routes';
import agroRoutes from './agro.routes';
import devRoutes from './dev.routes';
import itRoutes from './it.routes';
import cmsRoutes from './cms.routes';
import uploadRoutes from './upload.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/agro', agroRoutes);
router.use('/dev', devRoutes);
router.use('/it', itRoutes);
router.use('/cms', cmsRoutes);
router.use('/upload', uploadRoutes);
router.use('/users', userRoutes);

export default router;
