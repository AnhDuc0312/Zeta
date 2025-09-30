import { Router } from 'express';
import { 
  uploadImage, 
  deleteImage, 
  resizeImage, 
  generateThumbnail,
  upload 
} from '../controllers/imageController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Upload image (requires authentication)
router.post('/upload', authenticateJWT, upload.single('image'), uploadImage);

// Delete image (requires authentication)
router.delete('/:filename', authenticateJWT, deleteImage);

// Resize image (public endpoint)
router.post('/resize', upload.single('image'), resizeImage);

// Generate thumbnail (public endpoint)
router.post('/thumbnail', upload.single('image'), generateThumbnail);

export default router;
