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
    const { data, total } = await ContentService.getContentWithPagination(page, limit, type);
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
    res.json({ message: 'Content liked (stub)' });
  },
  async bookmark(req: Request, res: Response) {
    res.json({ message: 'Content bookmarked (stub)' });
  },
  async homePreview(req: Request, res: Response) {
    const articles = await ContentService.getLatestByType('article', 2);
    const documents = await ContentService.getLatestByType('document', 2);
    const notes = await ContentService.getLatestByType('note', 2);
    res.json({ articles, documents, notes });
  },
};
