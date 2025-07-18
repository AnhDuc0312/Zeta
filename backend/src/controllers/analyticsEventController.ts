import { Request, Response } from 'express';
import { AnalyticsEventService } from '../services/analyticsEventService';

export const AnalyticsEventController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const { data, total } = await AnalyticsEventService.getEventsWithPagination(page, limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const event = await AnalyticsEventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Analytics event not found' });
    res.json(event);
  },
  async create(req: Request, res: Response) {
    res.status(201).json({ message: 'Analytics event created (stub)' });
  },
  async update(req: Request, res: Response) {
    res.json({ message: 'Analytics event updated (stub)' });
  },
  async remove(req: Request, res: Response) {
    res.status(204).send();
  },
};
