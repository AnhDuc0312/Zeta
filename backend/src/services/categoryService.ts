import { Category } from '../models/Category';
import { CategoryRepository } from '../repositories/categoryRepository';

export const CategoryService = {
  async getAllCategories(): Promise<Category[]> {
    return await CategoryRepository.findAll();
  },
  async getCategoriesWithPagination(page: number, limit: number) {
    return await CategoryRepository.findAllWithPagination(page, limit);
  },
  async getCategoryById(id: string): Promise<Category | undefined> {
    return await CategoryRepository.findById(id);
  },
  async createCategory(data: Partial<Category>) {
    return await CategoryRepository.create(data);
  },
  async updateCategory(id: string, data: Partial<Category>) {
    return await CategoryRepository.update(id, data);
  },
  async deleteCategory(id: string) {
    return await CategoryRepository.delete(id);
  },
  async findByName(name: string): Promise<Category | undefined> {
    return await CategoryRepository.findByName(name);
  },
};
