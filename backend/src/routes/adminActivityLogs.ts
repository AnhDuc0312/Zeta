import express from 'express';
import { AdminActivityLogController } from '../controllers/adminActivityLogController';
const router = express.Router();

/**
 * @openapi
 * /admin/activity-logs:
 *   get:
 *     summary: List activity logs (admin)
 *     tags: [AdminActivityLogs]
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
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
 *         description: List of activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivityLog'
 *
 * /admin/activity-logs/{id}:
 *   get:
 *     summary: Get activity log detail (admin)
 *     tags: [AdminActivityLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity log found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityLog'
 *       404:
 *         description: Activity log not found
 */
router.get('/', AdminActivityLogController.list);
router.get('/:id', AdminActivityLogController.get);

export default router;
