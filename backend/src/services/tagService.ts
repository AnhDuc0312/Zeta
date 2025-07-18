import { Tag } from '../models/Tag';
import { TagRepository } from '../repositories/tagRepository';

export const TagService = {
  async getAllTags(): Promise<Tag[]> {
    return await TagRepository.findAll();
  },
  async getTagsWithPagination(page: number, limit: number) {
    return await TagRepository.findAllWithPagination(page, limit);
  },
  async getTagById(id: string): Promise<Tag | undefined> {
    return await TagRepository.findById(id);
  },
  async createTag(data: Partial<Tag>) {
    return await TagRepository.create(data);
  },
  async updateTag(id: string, data: Partial<Tag>) {
    return await TagRepository.update(id, data);
  },
  async deleteTag(id: string) {
    return await TagRepository.delete(id);
  },
};
