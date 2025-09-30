import { Request, Response } from 'express';
import { ContentService } from '../services/contentService';
import { body, validationResult, oneOf } from 'express-validator';

export const validateContent = [
  oneOf([
    body('body').notEmpty(),
    body('content').notEmpty()
  ], { message: 'Body or content is required' }),
  body('title').notEmpty().withMessage('Title is required'),
  body('tags').custom((value) => {
    if (value === undefined) return true;
    if (Array.isArray(value)) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
  }).withMessage('Tags must be an array or empty'),
];

export function handleValidation(req: Request, res: Response, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

export const ContentController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const type = req.query.type as string | undefined;
    
    // Extract filters from query parameters
    const filters: any = {};
    if (req.query.search) filters.search = req.query.search;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.file_type) filters.file_type = req.query.file_type;
    if (req.query.color) filters.color = req.query.color;
    if (req.query.sort) filters.sort = req.query.sort;
    if (req.query.status) filters.status = req.query.status;
    
    const { data, total } = await ContentService.getContentWithPagination(page, limit, type, filters);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const item = await ContentService.getContentById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Content not found' });
    res.json(item);
  },
  async create(req: Request, res: Response) {
    const content = await ContentService.createContent(req.body, req);
    res.status(201).json(content);
  },
  async update(req: Request, res: Response) {
    const content = await ContentService.updateContent(req.params.id, req.body, req);
    res.json(content);
  },
  async remove(req: Request, res: Response) {
    await ContentService.deleteContent(req.params.id);
    res.status(204).send();
  },
  async publish(req: Request, res: Response) {
    const content = await ContentService.publishContent(req.params.id);
    res.json(content);
  },
  async archive(req: Request, res: Response) {
    const content = await ContentService.archiveContent(req.params.id);
    res.json(content);
  },
  async importContent(req: Request, res: Response) {
    res.json({ message: 'Content imported (stub)' });
  },
  async exportContent(req: Request, res: Response) {
    // For now, return a dummy CSV file as a stub
    const csv = 'id,title,author\n1,Sample Article,admin';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="content_export.csv"');
    res.send(csv);
  },
  async duplicate(req: Request, res: Response) {
    const content = await ContentService.duplicateContent(req.params.id);
    res.status(201).json(content);
  },
  async listComments(req: Request, res: Response) {
    res.json([]);
  },
  async addComment(req: Request, res: Response) {
    res.status(201).json({ message: 'Comment added (stub)' });
  },
  async deleteComment(req: Request, res: Response) {
    res.status(204).send();
  },
  async like(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const contentId = req.params.id;
      await ContentService.likeContent(userId, contentId);
      res.json({ message: 'Content liked successfully' });
    } catch (error) {
      console.error('Like content error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async unlike(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const contentId = req.params.id;
      await ContentService.unlikeContent(userId, contentId);
      res.json({ message: 'Content unliked successfully' });
    } catch (error) {
      console.error('Unlike content error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async getLikeStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const contentId = req.params.id;
      const isLiked = await ContentService.getLikeStatus(userId, contentId);
      res.json({ isLiked });
    } catch (error) {
      console.error('Get like status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async homePreview(req: Request, res: Response) {
    const articles = await ContentService.getLatestByType('article', 3);
    const documents = await ContentService.getLatestByType('document', 3);
    const notes = await ContentService.getLatestByType('note', 3);
    res.json({ articles, documents, notes });
  },
  async getStats(req: Request, res: Response) {
    const stats = await ContentService.getContentStats();
    res.json(stats);
  },
  async incrementView(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body; // Optional: track which user viewed
      
      await ContentService.incrementView(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Increment view error:', error);
      res.status(500).json({ error: 'Failed to increment view' });
    }
  },
};
