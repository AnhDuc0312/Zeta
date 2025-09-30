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
  async getUserFavorites(userId: string, options: {
    page?: number;
    limit?: number;
    type?: string;
    sort?: string;
    search?: string;
  } = {}) {
    const { page = 1, limit = 20, type = 'all', sort = 'newest', search = '' } = options;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE c.id IN (SELECT content_id FROM user_likes WHERE user_id = $1)';
    let queryParams: any[] = [userId];
    let paramCount = 1;

    // Filter by type
    if (type !== 'all') {
      paramCount++;
      whereClause += ` AND c.type = $${paramCount}`;
      queryParams.push(type);
    }

    // Search filter
    if (search) {
      paramCount++;
      whereClause += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Sort order
    let orderClause = 'ORDER BY c.created_at DESC';
    if (sort === 'oldest') {
      orderClause = 'ORDER BY c.created_at ASC';
    } else if (sort === 'title') {
      orderClause = 'ORDER BY c.title ASC';
    }

    // Get favorites with content details
    const query = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.type,
        c.content,
        c.created_at,
        c.views,
        c.likes,
        c.comments,
        c.category_id,
        u.name as author_name,
        ul.created_at as favorited_at
      FROM content c
      JOIN users u ON c.author_id = u.id
      JOIN user_likes ul ON c.id = ul.content_id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM content c
      JOIN user_likes ul ON c.id = ul.content_id
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    return {
      data: result.rows.map(row => ({
        id: row.id,
        content_id: row.id,
        content: {
          id: row.id,
          title: row.title,
          description: row.description,
          type: row.type,
          author: row.author_name,
          created_at: row.created_at,
          views: row.views || 0,
          likes: row.likes || 0,
          comments: row.comments || 0,
          category: row.category_id
        },
        favorited_at: row.favorited_at
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },
  async delete(id: string) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },
  // Add create, update, delete as needed
};
