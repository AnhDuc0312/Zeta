import pool from '../db';
import { Comment } from '../models/Comment';

export const CommentRepository = {
  async findAll(): Promise<Comment[]> {
    const { rows } = await pool.query('SELECT * FROM comments');
    return rows;
  },
  async findAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const dataResult = await pool.query(
      'SELECT * FROM comments ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    );
    const totalResult = await pool.query('SELECT COUNT(*) FROM comments');
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<Comment | undefined> {
    const { rows } = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    return rows[0];
  },
  // Add create, update, delete as needed
};
