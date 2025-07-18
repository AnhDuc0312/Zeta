import { Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export const AdminUserController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const { role, status, search } = req.query;
    // Lọc dữ liệu (giản lược, có thể tối ưu bằng query DB nếu cần)
    let users = await UserRepository.findAll();
    if (role) users = users.filter((u) => u.role === role);
    if (status) users = users.filter((u) => u.status === status);
    if (search)
      users = users.filter(
        (u) =>
          u.name?.toLowerCase().includes((search as string).toLowerCase()) ||
          u.email?.toLowerCase().includes((search as string).toLowerCase()),
      );
    const total = users.length;
    const data = users.slice((page - 1) * limit, page * limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const user = await UserRepository.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  },
  async create(req: Request, res: Response) {
    const { name, email, password, role, status } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, password required' });
    const users = await UserRepository.findAll();
    if (users.find((u) => u.email === email))
      return res.status(400).json({ error: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const id = randomUUID();
    await UserRepository.create({
      id,
      name,
      email,
      password_hash: hash,
      role: role || 'user',
      status: status || 'active',
    });
    res.status(201).json({ message: 'User created' });
  },
  async update(req: Request, res: Response) {
    const { name, email, role, status } = req.body;
    await UserRepository.updateProfile(req.params.id, { name, email, role, status });
    res.json({ message: 'User updated' });
  },
  async remove(req: Request, res: Response) {
    await UserRepository.delete(req.params.id);
    res.status(204).send();
  },
  async importForm(req: Request, res: Response) {
    res.send('<form>Upload form (stub)</form>');
  },
  async import(req: Request, res: Response) {
    res.json({ message: 'Users imported (stub)' });
  },
  async export(req: Request, res: Response) {
    res.json({ message: 'Users exported (stub)' });
  },
};
