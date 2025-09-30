import { Request, Response } from 'express';
import { CommentService } from '../services/commentService';
import { body, validationResult } from 'express-validator';

export const validateComment = [
  body('contentId').notEmpty().withMessage('Content ID is required'),
  body('body').notEmpty().withMessage('Comment body is required'),
  body('parentId').optional().isUUID().withMessage('Parent ID must be a valid UUID'),
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
    const contentId = req.query.contentId as string;
    
    if (contentId) {
      const { data, total } = await CommentService.getCommentsByContentId(contentId, page, limit);
      res.json({ data, total, page, limit });
    } else {
      const { data, total } = await CommentService.getCommentsWithPagination(page, limit);
      res.json({ data, total, page, limit });
    }
  },
  async get(req: Request, res: Response) {
    const comment = await CommentService.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  },
  async create(req: Request, res: Response) {
    try {
      const { contentId, body, parentId } = req.body;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const comment = await CommentService.createComment({
        contentId,
        userId,
        text: body,
        parentId: parentId || null
      });
      
      res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { body } = req.body;
      const userId = (req as any).user?.id;
      const commentId = req.params.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const comment = await CommentService.updateComment(commentId, userId, body);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }

      res.json(comment);
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'Failed to update comment' });
    }
  },
  async remove(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const commentId = req.params.id;

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const success = await CommentService.deleteComment(commentId, userId);
      if (!success) {
        return res.status(404).json({ error: 'Comment not found or unauthorized' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  },
};
