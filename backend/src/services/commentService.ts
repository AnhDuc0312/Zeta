import { Comment } from '../models/Comment';
import { CommentRepository } from '../repositories/commentRepository';

export const CommentService = {
  async getAllComments(): Promise<Comment[]> {
    return await CommentRepository.findAll();
  },
  async getCommentsWithPagination(page: number, limit: number) {
    return await CommentRepository.findAllWithPagination(page, limit);
  },
  async getCommentsByContentId(contentId: string, page: number = 1, limit: number = 20) {
    const result = await CommentRepository.findByContentId(contentId, page, limit);
    
    // Load replies for each comment
    const commentsWithReplies = await Promise.all(
      result.data.map(async (comment) => {
        const replies = await CommentRepository.findReplies(comment.id);
        return {
          ...comment,
          replies
        };
      })
    );
    
    return {
      data: commentsWithReplies,
      total: result.total
    };
  },
  async getCommentById(id: string): Promise<Comment | undefined> {
    const comment = await CommentRepository.findById(id);
    if (comment) {
      const replies = await CommentRepository.findReplies(comment.id);
      return {
        ...comment,
        replies
      };
    }
    return comment;
  },
  async createComment(commentData: {
    contentId: string;
    userId: string;
    text: string;
    parentId?: string | null;
  }): Promise<Comment> {
    return await CommentRepository.create(commentData);
  },
  async updateComment(id: string, userId: string, text: string): Promise<Comment | null> {
    return await CommentRepository.update(id, userId, text);
  },
  async deleteComment(id: string, userId: string): Promise<boolean> {
    return await CommentRepository.delete(id, userId);
  },
};
