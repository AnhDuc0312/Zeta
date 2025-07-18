import express from 'express';
import { SearchController } from '../controllers/searchController';
const router = express.Router();

/**
 * @openapi
 * /search:
 *   get:
 *     summary: Search content
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 */
router.get('/', SearchController.search);

export default router;
