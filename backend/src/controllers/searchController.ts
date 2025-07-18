import { Request, Response } from 'express';
import { ContentRepository } from '../repositories/contentRepository';

export const SearchController = {
  async search(req: Request, res: Response) {
    const q = ((req.query.q as string) || '').toLowerCase();
    if (!q) return res.json({ data: [], total: 0 });
    const all = await ContentRepository.findAll();
    const data = all.filter(
      (c) =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.content && c.content.toLowerCase().includes(q)),
    );
    res.json({ data, total: data.length });
  },
};
