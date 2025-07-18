import express from 'express';
import { TagController, validateTag, handleValidation } from '../controllers/tagController';
const router = express.Router();

/**
 * @openapi
 * /tags:
 *   get:
 *     summary: Get all tags
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *
 * /tags/{id}:
 *   get:
 *     summary: Get a tag by ID
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
router.get('/', TagController.list);
router.get('/:id', TagController.get);
router.post('/', validateTag, handleValidation, TagController.create);
router.put('/:id', validateTag, handleValidation, TagController.update);
router.delete('/:id', TagController.remove);

export default router;
