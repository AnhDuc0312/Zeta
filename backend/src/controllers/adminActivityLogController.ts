import { Request, Response } from 'express';
import { ActivityLogRepository } from '../repositories/activityLogRepository';

export const AdminActivityLogController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const { data, total } = await ActivityLogRepository.findAllWithPagination(page, limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const log = await ActivityLogRepository.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Activity log not found' });
    res.json(log);
  },
};
