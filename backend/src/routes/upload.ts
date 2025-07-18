import express from 'express';
// @ts-ignore
import multer from 'multer';
import { UploadController } from '../controllers/uploadController';

const router = express.Router();
const upload = multer({ dest: 'public/uploads/' });

/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded
 *       400:
 *         description: Invalid upload
 */
router.post('/', upload.single('file'), UploadController.upload);

export default router;
