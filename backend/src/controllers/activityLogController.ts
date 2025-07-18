import { Request, Response } from 'express';
import { ActivityLogService } from '../services/activityLogService';
import { ActivityLogRepository } from '../repositories/activityLogRepository';

export const ActivityLogController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const { data, total } = await ActivityLogService.getLogsWithPagination(page, limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const log = await ActivityLogService.getLogById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Activity log not found' });
    res.json(log);
  },
  async create(req: Request, res: Response) {
    const { user_id, action, resource, status, details } = req.body;
    const ip = req.ip;
    const user_agent = req.headers['user-agent'] || '';
    await ActivityLogRepository.create({
      user_id,
      action,
      resource,
      status: status || 'info',
      details,
      ip,
      user_agent,
      timestamp: new Date(),
    });
    res.status(201).json({ message: 'Activity log created' });
  },
  async update(req: Request, res: Response) {
    res.json({ message: 'Activity log updated (stub)' });
  },
  async remove(req: Request, res: Response) {
    res.status(204).send();
  },
};
