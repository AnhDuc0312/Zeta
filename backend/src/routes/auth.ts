import express from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegister, validateLogin, validateChangePassword } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Invalid input
 *
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout successful
 *
 * /auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or current password incorrect
 *       401:
 *         description: Not authenticated
 */
router.post('/login', validateLogin, AuthController.login);
router.post('/register', validateRegister, AuthController.register);
router.post('/logout', AuthController.logout);
router.get('/profile', authenticateJWT, AuthController.profile);
router.post('/change-password', authenticateJWT, validateChangePassword, AuthController.changePassword);

export default router;
