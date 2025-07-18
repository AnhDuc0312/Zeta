import { Request, Response } from 'express';
import { TagService } from '../services/tagService';
import { body, validationResult } from 'express-validator';
import { randomUUID } from 'crypto';

export const validateTag = [
  body('name').notEmpty().withMessage('Name is required'),
];

export function handleValidation(req: Request, res: Response, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

export const TagController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const { data, total } = await TagService.getTagsWithPagination(page, limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const tag = await TagService.getTagById(req.params.id);
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.json(tag);
  },
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const id = randomUUID();
    await TagService.createTag({ id, name });
    res.status(201).json({ id, name });
  },
  async update(req: Request, res: Response) {
    const { name } = req.body;
    await TagService.updateTag(req.params.id, { name });
    res.json({ id: req.params.id, name });
  },
  async remove(req: Request, res: Response) {
    await TagService.deleteTag(req.params.id);
    res.status(204).send();
  },
};
