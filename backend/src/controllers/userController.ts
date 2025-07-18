import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export const UserController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const { data, total } = await UserService.getUsersWithPagination(page, limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const user = await UserService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  },
  async create(req: Request, res: Response) {
    res.status(201).json({ message: 'User created (stub)' });
  },
  async update(req: Request, res: Response) {
    res.json({ message: 'User updated (stub)' });
  },
  async remove(req: Request, res: Response) {
    res.status(204).send();
  },
};
