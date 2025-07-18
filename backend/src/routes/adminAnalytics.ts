import express from 'express';
import { AdminAnalyticsController } from '../controllers/adminAnalyticsController';
const router = express.Router();

/**
 * @openapi
 * /admin/analytics/overview:
 *   get:
 *     summary: Get site-wide analytics overview
 *     tags: [AdminAnalytics]
 *     responses:
 *       200:
 *         description: Analytics overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 * /admin/analytics/content:
 *   get:
 *     summary: Get content analytics
 *     tags: [AdminAnalytics]
 *     responses:
 *       200:
 *         description: Content analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 * /admin/analytics/users:
 *   get:
 *     summary: Get user analytics
 *     tags: [AdminAnalytics]
 *     responses:
 *       200:
 *         description: User analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/overview', AdminAnalyticsController.overview);
router.get('/content', AdminAnalyticsController.content);
router.get('/users', AdminAnalyticsController.users);

export default router;
