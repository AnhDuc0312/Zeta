import express from 'express';
import { AdminUserController } from '../controllers/adminUserController';
const router = express.Router();

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: List users (admin)
 *     tags: [AdminUsers]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create user (admin)
 *     tags: [AdminUsers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /admin/users/import:
 *   post:
 *     summary: Bulk import users
 *     tags: [AdminUsers]
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
 *         description: Users imported
 *
 * /admin/users/export:
 *   get:
 *     summary: Export users
 *     tags: [AdminUsers]
 *     responses:
 *       200:
 *         description: Users exported
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *
 * /admin/users/{id}:
 *   get:
 *     summary: Get user detail (admin)
 *     tags: [AdminUsers]
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
 *   put:
 *     summary: Update user (admin)
 *     tags: [AdminUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user (admin)
 *     tags: [AdminUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.get('/', AdminUserController.list);
router.post('/', AdminUserController.create);
router.get('/import', AdminUserController.importForm); // Optional: for UI
router.post('/import', AdminUserController.import);
router.get('/export', AdminUserController.export);
router.get('/:id', AdminUserController.get);
router.put('/:id', AdminUserController.update);
router.delete('/:id', AdminUserController.remove);

export default router;
