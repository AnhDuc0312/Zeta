import pool from '../db';
import { Comment } from '../models/Comment';

export const CommentRepository = {
  async findAll(): Promise<Comment[]> {
    const { rows } = await pool.query(`
      SELECT c.*, u.email 
      FROM comments c 
      LEFT JOIN users u ON c.user_id = u.id 
      ORDER BY c.created_at DESC
    `);
    return rows;
  },
  async findAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const dataResult = await pool.query(`
      SELECT c.*, u.email 
      FROM comments c 
      LEFT JOIN users u ON c.user_id = u.id 
      ORDER BY c.created_at DESC 
      LIMIT $1 OFFSET $2
    `, [limit, offset]);
    const totalResult = await pool.query('SELECT COUNT(*) FROM comments');
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findByContentId(contentId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    const dataResult = await pool.query(`
      SELECT c.*, u.email, u.name as author_name
      FROM comments c 
      LEFT JOIN users u ON c.user_id = u.id 
      WHERE c.content_id = $1 AND c.status = 'visible'
      ORDER BY c.created_at DESC 
      LIMIT $2 OFFSET $3
    `, [contentId, limit, offset]);
    
    const totalResult = await pool.query(
      'SELECT COUNT(*) FROM comments WHERE content_id = $1 AND status = \'visible\'',
      [contentId]
    );
    
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<Comment | undefined> {
    const { rows } = await pool.query(`
      SELECT c.*, u.email 
      FROM comments c 
      LEFT JOIN users u ON c.user_id = u.id 
      WHERE c.id = $1
    `, [id]);
    return rows[0];
  },
  async create(commentData: {
    contentId: string;
    userId: string;
    text: string;
    parentId?: string | null;
  }): Promise<Comment> {
    const { contentId, userId, text } = commentData;
    const { rows } = await pool.query(`
      INSERT INTO comments (content_id, user_id, text, status, created_at)
      VALUES ($1, $2, $3, 'visible', NOW())
      RETURNING *
    `, [contentId, userId, text]);
    return rows[0];
  },
  async update(id: string, userId: string, text: string): Promise<Comment | null> {
    const { rows } = await pool.query(`
      UPDATE comments 
      SET text = $1, updated_at = NOW()
      WHERE id = $2 AND user_id = $3 AND status = 'visible'
      RETURNING *
    `, [text, id, userId]);
    return rows[0] || null;
  },
  async delete(id: string, userId: string): Promise<boolean> {
    const { rowCount } = await pool.query(`
      UPDATE comments 
      SET status = 'deleted'
      WHERE id = $1 AND user_id = $2
    `, [id, userId]);
    return (rowCount ?? 0) > 0;
  },
  async findReplies(parentId: string): Promise<Comment[]> {
    const { rows } = await pool.query(`
      SELECT c.*, u.email, u.name as author_name
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.parent_id = $1 AND c.status = 'visible'
      ORDER BY c.created_at ASC
    `, [parentId]);
    return rows;
  },
};
