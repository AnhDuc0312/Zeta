import { Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const AuthController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const users = await UserRepository.findAll();
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '30m', // 30 phút
    });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  },
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ error: 'Name, email, password required' });
    const users = await UserRepository.findAll();
    if (users.find((u) => u.email === email))
      return res.status(400).json({ error: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    // Tạo user mới (giản lược, bạn có thể thêm các trường khác nếu muốn)
    const id = randomUUID();
    await UserRepository.create({
      id,
      name,
      email,
      password_hash: hash,
      role: 'user',
      status: 'active',
    });
    res.status(201).json({ message: 'User registered' });
  },
  async logout(req: Request, res: Response) {
    // Với JWT, logout phía client chỉ cần xoá token
    res.json({ message: 'Logged out' });
  },
  async profile(req: Request, res: Response) {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    
    // Get full user data from database
    const users = await UserRepository.findAll();
    const dbUser = users.find((u) => u.id === user.id);
    
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data without password_hash
    const { password_hash, ...userData } = dbUser;
    res.json(userData);
  },
  async changePassword(req: Request, res: Response) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { currentPassword, newPassword } = req.body;
      const user = (req as any).user;
      
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      // Lấy thông tin user từ database
      const users = await UserRepository.findAll();
      const dbUser = users.find((u) => u.id === user.id);
      
      if (!dbUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, dbUser.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password in database
      await UserRepository.updatePassword(user.id, newPasswordHash);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

export const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

function handleValidation(req: Request, res: Response, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}
