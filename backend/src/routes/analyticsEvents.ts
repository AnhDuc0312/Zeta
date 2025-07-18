import express from 'express';
import { AnalyticsEventController } from '../controllers/analyticsEventController';
const router = express.Router();

/**
 * @openapi
 * /analytics-events:
 *   get:
 *     summary: Get all analytics events
 *     tags:
 *       - AnalyticsEvents
 *     responses:
 *       200:
 *         description: List of analytics events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AnalyticsEvent'
 *
 * /analytics-events/{id}:
 *   get:
 *     summary: Get an analytics event by ID
 *     tags:
 *       - AnalyticsEvents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics event found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsEvent'
 *       404:
 *         description: Analytics event not found
 */
router.get('/', AnalyticsEventController.list);
router.get('/:id', AnalyticsEventController.get);
router.post('/', AnalyticsEventController.create);
router.put('/:id', AnalyticsEventController.update);
router.delete('/:id', AnalyticsEventController.remove);

export default router;
