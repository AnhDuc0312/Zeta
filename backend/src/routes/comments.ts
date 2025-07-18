import express from 'express';
import { CommentController, validateComment, handleValidation } from '../controllers/commentController';
const router = express.Router();

/**
 * @openapi
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */
router.get('/', CommentController.list);
router.get('/:id', CommentController.get);
router.post('/', validateComment, handleValidation, CommentController.create);
router.put('/:id', CommentController.update);
router.delete('/:id', CommentController.remove);

export default router;
