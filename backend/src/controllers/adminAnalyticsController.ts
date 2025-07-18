import { Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository';
import { ContentRepository } from '../repositories/contentRepository';
import { CommentRepository } from '../repositories/commentRepository';

export const AdminAnalyticsController = {
  async overview(req: Request, res: Response) {
    const users = await UserRepository.findAll();
    const content = await ContentRepository.findAll();
    const comments = await CommentRepository.findAll();
    res.json({
      totalUsers: users.length,
      totalContent: content.length,
      totalComments: comments.length,
    });
  },
  async content(req: Request, res: Response) {
    const content = await ContentRepository.findAll();
    // Top 10 content theo views
    const topContent = content.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
    res.json({ topContent });
  },
  async users(req: Request, res: Response) {
    const users = await UserRepository.findAll();
    // Top 10 user theo số lượng content đã tạo (giản lược, cần join nếu muốn chính xác)
    res.json({ topUsers: users.slice(0, 10) });
  },
};
