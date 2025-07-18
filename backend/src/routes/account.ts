import express from 'express';
import { AccountController } from '../controllers/accountController';
const router = express.Router();

/**
 * @openapi
 * /account:
 *   get:
 *     summary: Get current user profile
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   put:
 *     summary: Update user profile
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /account/password:
 *   post:
 *     summary: Change user password
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 */
router.get('/', AccountController.profile);
router.put('/', AccountController.updateProfile);
router.post('/password', AccountController.changePassword);

export default router;
