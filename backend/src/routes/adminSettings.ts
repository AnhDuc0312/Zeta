import express from 'express';
import { AdminSettingsController } from '../controllers/adminSettingsController';
const router = express.Router();

/**
 * @openapi
 * /admin/settings:
 *   get:
 *     summary: Get all system settings (admin)
 *     tags: [AdminSettings]
 *     responses:
 *       200:
 *         description: List of settings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Setting'
 *   put:
 *     summary: Update system settings (admin)
 *     tags: [AdminSettings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings updated
 */
router.get('/', AdminSettingsController.list);
router.put('/', AdminSettingsController.update);

export default router;
