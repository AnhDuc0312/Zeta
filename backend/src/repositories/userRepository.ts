import pool from '../db';
import { User } from '../models/User';

export const UserRepository = {
  async findAll(): Promise<User[]> {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
  },
  async findAllWithPagination(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const dataResult = await pool.query(
      'SELECT * FROM users ORDER BY join_date DESC LIMIT $1 OFFSET $2',
      [limit, offset],
    );
    const totalResult = await pool.query('SELECT COUNT(*) FROM users');
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<User | undefined> {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  },
  async create(user: Partial<User>) {
    const keys = Object.keys(user);
    const values = Object.values(user);
    const columns = keys.map((k) => `"${k}"`).join(', ');
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO users (${columns}) VALUES (${params})`;
    await pool.query(query, values);
  },
  async updateProfile(id: string, data: Partial<User>) {
    const keys = Object.keys(data).filter((k) => (data as any)[k] !== undefined);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const values = keys.map((k) => (data as any)[k]);
    values.push(id);
    const query = `UPDATE users SET ${setClause} WHERE id = $${values.length}`;
    await pool.query(query, values);
  },
  async updatePassword(id: string, password_hash: string) {
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, id]);
  },
  async getUserStats(userId: string) {
    // Get count of articles, documents, notes, and total views
    const articlesResult = await pool.query(
      'SELECT COUNT(*) FROM content WHERE author_id = $1 AND type = $2',
      [userId, 'article']
    );
    
    const documentsResult = await pool.query(
      'SELECT COUNT(*) FROM content WHERE author_id = $1 AND type = $2',
      [userId, 'document']
    );
    
    const notesResult = await pool.query(
      'SELECT COUNT(*) FROM content WHERE author_id = $1 AND type = $2',
      [userId, 'note']
    );
    
    const viewsResult = await pool.query(
      'SELECT COALESCE(SUM(views), 0) as total_views FROM content WHERE author_id = $1',
      [userId]
    );

    return {
      articles: parseInt(articlesResult.rows[0].count, 10),
      documents: parseInt(documentsResult.rows[0].count, 10),
      notes: parseInt(notesResult.rows[0].count, 10),
      totalViews: parseInt(viewsResult.rows[0].total_views, 10),
    };
  },
  async getUserFavorites(userId: string) {
    // Get liked content grouped by type
    const articlesResult = await pool.query(
      `SELECT c.*, u.name as author_name 
       FROM content c 
       JOIN users u ON c.author_id = u.id 
       WHERE c.id IN (
         SELECT content_id FROM user_likes WHERE user_id = $1
       ) AND c.type = $2
       ORDER BY c.created_at DESC`,
      [userId, 'article']
    );
    
    const documentsResult = await pool.query(
      `SELECT c.*, u.name as author_name 
       FROM content c 
       JOIN users u ON c.author_id = u.id 
       WHERE c.id IN (
         SELECT content_id FROM user_likes WHERE user_id = $1
       ) AND c.type = $2
       ORDER BY c.created_at DESC`,
      [userId, 'document']
    );
    
    const notesResult = await pool.query(
      `SELECT c.*, u.name as author_name 
       FROM content c 
       JOIN users u ON c.author_id = u.id 
       WHERE c.id IN (
         SELECT content_id FROM user_likes WHERE user_id = $1
       ) AND c.type = $2
       ORDER BY c.created_at DESC`,
      [userId, 'note']
    );

    return {
      articles: articlesResult.rows,
      documents: documentsResult.rows,
      notes: notesResult.rows,
    };
  },
  async delete(id: string) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },
  // Add create, update, delete as needed
};
