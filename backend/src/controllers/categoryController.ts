import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { body, validationResult } from 'express-validator';
import { randomUUID } from 'crypto';

export const validateCategory = [
  body('name').notEmpty().withMessage('Name is required'),
];

export function handleValidation(req: Request, res: Response, next: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

export const CategoryController = {
  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 18;
    const { data, total } = await CategoryService.getCategoriesWithPagination(page, limit);
    res.json({ data, total, page, limit });
  },
  async get(req: Request, res: Response) {
    const category = await CategoryService.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  },
  async create(req: Request, res: Response) {
    const { name, description } = req.body;
    // Check duplicate name (case-insensitive)
    const existing = await CategoryService.findByName(name);
    if (existing) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    const id = randomUUID();
    await CategoryService.createCategory({ id, name, description });
    res.status(201).json({ id, name, description });
  },
  async update(req: Request, res: Response) {
    const { name, description } = req.body;
    await CategoryService.updateCategory(req.params.id, { name, description });
    res.json({ id: req.params.id, name, description });
  },
  async remove(req: Request, res: Response) {
    await CategoryService.deleteCategory(req.params.id);
    res.status(204).send();
  },
};
