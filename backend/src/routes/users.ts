import express from 'express';
import { UserController } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';
const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               website:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *
 * /users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: number
 *                 documents:
 *                   type: number
 *                 notes:
 *                   type: number
 *                 totalViews:
 *                   type: number
 *       401:
 *         description: Not authenticated
 *
 * /users/favorites:
 *   get:
 *     summary: Get user favorites
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User favorites grouped by type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       author_name:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                 documents:
 *                   type: array
 *                   items:
 *                     type: object
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authenticated
 */
router.get('/', UserController.list);
router.get('/stats', authenticateJWT, UserController.getUserStats);
router.get('/favorites', authenticateJWT, UserController.getUserFavorites);
router.put('/profile', authenticateJWT, UserController.updateProfile);
router.get('/:id', UserController.get);
// Add create, update, delete as needed

export default router;
