import express from 'express';
import { ActivityLogController } from '../controllers/activityLogController';
const router = express.Router();

/**
 * @openapi
 * /activity-logs:
 *   get:
 *     summary: Get all activity logs
 *     tags:
 *       - ActivityLogs
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
 * /activity-logs/{id}:
 *   get:
 *     summary: Get an activity log by ID
 *     tags:
 *       - ActivityLogs
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
router.get('/', ActivityLogController.list);
router.get('/:id', ActivityLogController.get);
router.post('/', ActivityLogController.create);
router.put('/:id', ActivityLogController.update);
router.delete('/:id', ActivityLogController.remove);

export default router;
