import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';
import { body, validationResult } from 'express-validator';

export const validateComment = [
  body('contentId').notEmpty().withMessage('Content ID is required'),
  body('body').notEmpty().withMessage('Comment body is required'),
];

export function handleValidation(req: Request, res: Response, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

export const CommentController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const { data, total } = await CommentService.getCommentsWithPagination(page, limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const comment = await CommentService.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  },
  async create(req: Request, res: Response) {
    res.status(201).json({ message: 'Comment created (stub)' });
  },
  async update(req: Request, res: Response) {
    res.json({ message: 'Comment updated (stub)' });
  },
  async remove(req: Request, res: Response) {
    res.status(204).send();
  },
};
