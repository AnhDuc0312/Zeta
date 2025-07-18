import { Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository';
import bcrypt from 'bcryptjs';

export const AccountController = {
  async profile(req: Request, res: Response) {
    const userPayload = (req as any).user;
    if (!userPayload) return res.status(401).json({ error: 'Unauthorized' });
    const user = await UserRepository.findById(userPayload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  },
  async updateProfile(req: Request, res: Response) {
    const userPayload = (req as any).user;
    if (!userPayload) return res.status(401).json({ error: 'Unauthorized' });
    const { name, avatar, bio, location, website } = req.body;
    await UserRepository.updateProfile(userPayload.id, { name, avatar, bio, location, website });
    res.json({ message: 'Profile updated' });
  },
  async changePassword(req: Request, res: Response) {
    const userPayload = (req as any).user;
    if (!userPayload) return res.status(401).json({ error: 'Unauthorized' });
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ error: 'Old and new password required' });
    const user = await UserRepository.findById(userPayload.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Old password incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    await UserRepository.updatePassword(userPayload.id, hash);
    res.json({ message: 'Password changed' });
  },
};
