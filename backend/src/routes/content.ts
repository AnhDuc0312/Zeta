import express from 'express';
import { ContentController } from '../controllers/contentController';
import { validateContent, handleValidation } from '../controllers/contentController';
import { authenticateJWT } from '../middleware/authMiddleware';
const router = express.Router();

/**
 * @openapi
 * /content:
 *   get:
 *     summary: Get all content
 *     tags:
 *       - Content
 *     responses:
 *       200:
 *         description: List of content
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 *   post:
 *     summary: Create new content
 *     tags:
 *       - Content
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Content'
 *     responses:
 *       201:
 *         description: Content created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *
 * /content/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags:
 *       - Content
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 *   put:
 *     summary: Update content by ID
 *     tags:
 *       - Content
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
 *             $ref: '#/components/schemas/Content'
 *     responses:
 *       200:
 *         description: Content updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 *   delete:
 *     summary: Delete content by ID
 *     tags:
 *       - Content
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Content deleted
 *       404:
 *         description: Content not found
 */
router.get('/', ContentController.list);
router.get('/home-preview', ContentController.homePreview);
router.get('/stats', ContentController.getStats);
router.get('/:id', ContentController.get);
router.post('/:id/view', ContentController.incrementView);
router.post('/', authenticateJWT, validateContent, handleValidation, ContentController.create);
router.put('/:id', validateContent, handleValidation, ContentController.update);
router.delete('/:id', ContentController.remove);
router.post('/:id/publish', ContentController.publish);
router.post('/:id/archive', ContentController.archive);
router.post('/import', ContentController.importContent);
/**
 * @openapi
 * /content/export:
 *   get:
 *     summary: Export content (download)
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: Content exported
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/export', ContentController.exportContent);
router.post('/:id/duplicate', ContentController.duplicate);

/**
 * @openapi
 * /content/{id}/comments:
 *   get:
 *     summary: List comments for content
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *   post:
 *     summary: Add comment to content
 *     tags: [Comments]
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
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Comment deleted
 *
 * /content/{id}/like:
 *   post:
 *     summary: Like content
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content liked
 *
 * /content/{id}/bookmark:
 *   post:
 *     summary: Bookmark content
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Content bookmarked
 */
router.get('/:id/comments', ContentController.listComments);
router.post('/:id/comments', ContentController.addComment);
router.delete('/comments/:commentId', ContentController.deleteComment);
router.post('/:id/like', authenticateJWT, ContentController.like);
router.delete('/:id/like', authenticateJWT, ContentController.unlike);
router.get('/:id/like-status', authenticateJWT, ContentController.getLikeStatus);
router.post('/:id/bookmark', ContentController.bookmark);

export default router;
