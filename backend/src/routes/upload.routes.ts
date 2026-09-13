import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { uploadSingleImage } from '../middlewares/upload.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Upload image to Cloudinary (Protected)
router.post('/image', authenticate, uploadSingleImage, uploadImage);

export default router;
