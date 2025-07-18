import { Comment } from '../models/Comment';
import { CommentRepository } from '../repositories/commentRepository';

export const CommentService = {
  async getAllComments(): Promise<Comment[]> {
    return await CommentRepository.findAll();
  },
  async getCommentsWithPagination(page: number, limit: number) {
    return await CommentRepository.findAllWithPagination(page, limit);
  },
  async getCommentById(id: string): Promise<Comment | undefined> {
    return await CommentRepository.findById(id);
  },
  // Add create, update, delete as needed
};
