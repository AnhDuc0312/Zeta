import express from 'express';
import { SettingController } from '../controllers/settingController';
const router = express.Router();

/**
 * @openapi
 * /settings:
 *   get:
 *     summary: Get all settings
 *     tags:
 *       - Settings
 *     responses:
 *       200:
 *         description: List of settings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Setting'
 *
 * /settings/{id}:
 *   get:
 *     summary: Get a setting by ID
 *     tags:
 *       - Settings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       404:
 *         description: Setting not found
 */
router.get('/', SettingController.list);
router.get('/:id', SettingController.get);
router.post('/', SettingController.create);
router.put('/:id', SettingController.update);
router.delete('/:id', SettingController.remove);

export default router;
