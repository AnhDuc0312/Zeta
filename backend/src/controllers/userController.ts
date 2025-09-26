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
  async updateProfile(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { name, bio, location, website } = req.body;
      
      // Validate required fields
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
      }

      // Update user profile
        await UserService.updateUserProfile(user.id, {
          name: name.trim(),
          bio: bio?.trim() || undefined,
          location: location?.trim() || undefined,
          website: website?.trim() || undefined,
        });

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async getUserStats(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const stats = await UserService.getUserStats(user.id);
      res.json(stats);
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async getUserFavorites(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const favorites = await UserService.getUserFavorites(user.id);
      res.json(favorites);
    } catch (error) {
      console.error('Get user favorites error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
