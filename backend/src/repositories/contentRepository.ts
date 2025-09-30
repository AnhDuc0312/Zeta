import pool from '../db';
import { Content } from '../models/Content';

export const ContentRepository = {
  async findAll(): Promise<Content[]> {
    const { rows } = await pool.query('SELECT * FROM content ORDER BY created_at DESC');
    
    // Helper function to check if string is UUID
    const isUUID = (str: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };
    
    // Collect all unique tag IDs and names
    const allTagIds = new Set<string>();
    const allTagNames = new Set<string>();
    for (const content of rows) {
      if (content.tags && Array.isArray(content.tags)) {
        content.tags.forEach((tag: string) => {
          if (isUUID(tag)) {
            allTagIds.add(tag);
          } else {
            allTagNames.add(tag);
          }
        });
      }
    }
    
    // Fetch all tag names in one query
    let tagMap = new Map<string, string>();
    if (allTagIds.size > 0) {
      const tagNames = await pool.query(
        'SELECT id, name FROM tags WHERE id = ANY($1)',
        [Array.from(allTagIds)]
      );
      tagMap = new Map(tagNames.rows.map(row => [row.id, row.name]));
    }
    
    // Convert tag IDs to tag names
    for (const content of rows) {
      if (content.tags && Array.isArray(content.tags) && content.tags.length > 0) {
        content.tags = content.tags
          .map((tag: string) => {
            if (isUUID(tag)) {
              return tagMap.get(tag) || tag; // Fallback to original if not found
            } else {
              return tag; // Already a name
            }
          })
          .filter((name: string) => name !== undefined)
          .sort();
      } else {
        content.tags = [];
      }
    }
    
    return rows;
  },
  async findAllWithPagination(page: number, limit: number, type?: string, filters?: any) {
    const offset = (page - 1) * limit;
    
    // Build WHERE conditions
    const conditions = [];
    const params: any[] = [];
    let paramIndex = 1;
    
    // Only filter by published status if no specific status filter is provided
    if (!filters?.status || filters.status === 'all') {
      conditions.push('c.status = $1');
      params.push('published');
      paramIndex = 2;
    } else {
      conditions.push('c.status = $1');
      params.push(filters.status);
      paramIndex = 2;
    }
    
    if (type) {
      conditions.push(`c.type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }
    
    if (filters?.search) {
      conditions.push(`(c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex} OR c.content ILIKE $${paramIndex})`);
      params.push(`%${filters.search}%`);
      paramIndex++;
    }
    
    if (filters?.category && filters.category !== 'all') {
      conditions.push(`cat.name = $${paramIndex}`);
      params.push(filters.category);
      paramIndex++;
    }
    
    if (filters?.file_type && filters.file_type !== 'all') {
      conditions.push(`c.file_url ILIKE $${paramIndex}`);
      params.push(`%.${filters.file_type.toLowerCase()}`);
      paramIndex++;
    }
    
    if (filters?.color && filters.color !== 'all') {
      // Color filter is not supported in backend yet, skip for now
    }
    
    // Build ORDER BY clause
    let orderBy = 'c.created_at DESC';
    if (filters?.sort) {
      switch (filters.sort) {
        case 'oldest':
          orderBy = 'c.created_at ASC';
          break;
        case 'most-downloaded':
        case 'popular':
          orderBy = 'c.views DESC';
          break;
        case 'most-viewed':
        case 'mostViewed':
          orderBy = 'c.views DESC';
          break;
        case 'highest-rated':
        case 'rating':
          orderBy = 'c.likes DESC';
          break;
        case 'alphabetical':
        case 'name':
          orderBy = 'c.title ASC';
          break;
        case 'newest':
        default:
          orderBy = 'c.created_at DESC';
          break;
      }
    }
    
    const whereClause = conditions.join(' AND ');
    
    // Get data
    const dataQuery = `
      SELECT c.*, u.name as author_name, cat.name as category_name
      FROM content c
      LEFT JOIN users u ON c.author_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const dataResult = await pool.query(dataQuery, params);
    
    // Helper function to check if string is UUID
    const isUUID = (str: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };
    
    // Collect all unique tag IDs and names
    const allTagIds = new Set<string>();
    const allTagNames = new Set<string>();
    for (const content of dataResult.rows) {
      if (content.tags && Array.isArray(content.tags)) {
        content.tags.forEach((tag: string) => {
          if (isUUID(tag)) {
            allTagIds.add(tag);
          } else {
            allTagNames.add(tag);
          }
        });
      }
    }
    
    // Fetch all tag names in one query
    let tagMap = new Map<string, string>();
    if (allTagIds.size > 0) {
      const tagNames = await pool.query(
        'SELECT id, name FROM tags WHERE id = ANY($1)',
        [Array.from(allTagIds)]
      );
      tagMap = new Map(tagNames.rows.map(row => [row.id, row.name]));
    }
    
    // Convert tag IDs to tag names
    for (const content of dataResult.rows) {
      if (content.tags && Array.isArray(content.tags) && content.tags.length > 0) {
        content.tags = content.tags
          .map((tag: string) => {
            if (isUUID(tag)) {
              return tagMap.get(tag) || tag; // Fallback to original if not found
            } else {
              return tag; // Already a name
            }
          })
          .filter((name: string) => name !== undefined)
          .sort();
      } else {
        content.tags = [];
      }
    }
    
    // Get total count - also need JOIN for category filter
    const countQuery = `
      SELECT COUNT(*) 
      FROM content c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE ${whereClause}
    `;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const totalResult = await pool.query(countQuery, countParams);
    
    return {
      data: dataResult.rows,
      total: parseInt(totalResult.rows[0].count, 10),
    };
  },
  async findById(id: string): Promise<Content | undefined> {
    const { rows } = await pool.query(
      `SELECT c.*, u.name as author_name
       FROM content c 
       LEFT JOIN users u ON c.author_id = u.id 
       WHERE c.id = $1`,
      [id]
    );
    
    if (rows.length === 0) return undefined;
    
    const content = rows[0];
    
      // Helper function to check if string is UUID
      const isUUID = (str: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
      };
      
      // Convert tag IDs to tag names
      if (content.tags && Array.isArray(content.tags) && content.tags.length > 0) {
        const tagIds = content.tags.filter((tag: string) => isUUID(tag));
        const tagNames = content.tags.filter((tag: string) => !isUUID(tag));
        
        let convertedTags = [...tagNames];
        
        if (tagIds.length > 0) {
          const dbTagNames = await pool.query(
            'SELECT name FROM tags WHERE id = ANY($1) ORDER BY name',
            [tagIds]
          );
          convertedTags = [...convertedTags, ...dbTagNames.rows.map(row => row.name)];
        }
        
        content.tags = convertedTags.sort();
      } else {
        content.tags = [];
      }
    
    return content;
  },
  async deleteById(id: string) {
    await pool.query('DELETE FROM content WHERE id = $1', [id]);
  },
  async create(content: Partial<Content>) {
    const keys = Object.keys(content);
    const values = Object.values(content);
    const columns = keys.map((k) => `"${k}"`).join(', ');
    const params = values.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO content (${columns}) VALUES (${params}) RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async update(id: string, data: Partial<Content>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    values.push(id);
    const query = `UPDATE content SET ${setClause} WHERE id = $${values.length} RETURNING *`;
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async publish(id: string) {
    const { rows } = await pool.query(
      'UPDATE content SET status = $1, published_at = NOW() WHERE id = $2 RETURNING *',
      ['published', id]
    );
    return rows[0];
  },
  async archive(id: string) {
    const { rows } = await pool.query(
      'UPDATE content SET status = $1 WHERE id = $2 RETURNING *',
      ['archived', id]
    );
    return rows[0];
  },
  async duplicate(id: string) {
    // Lấy content gốc
    const { rows } = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
    if (!rows[0]) return null;
    const orig = rows[0];
    // Xóa id, cập nhật created_at, updated_at
    delete orig.id;
    orig.created_at = new Date();
    orig.updated_at = new Date();
    orig.title = orig.title + ' (Copy)';
    // Tạo content mới
    return await this.create(orig);
  },
  async findLatestByType(type: string, limit: number) {
    const { rows } = await pool.query(
      'SELECT * FROM content WHERE type = $1 ORDER BY created_at DESC LIMIT $2',
      [type, limit]
    );
    return rows;
  },
  async likeContent(userId: string, contentId: string) {
    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Insert into user_likes
      await client.query(
        'INSERT INTO user_likes (user_id, content_id) VALUES ($1, $2) ON CONFLICT (user_id, content_id) DO NOTHING',
        [userId, contentId]
      );
      
      // Update likes count in content table
      await client.query(
        'UPDATE content SET likes = likes + 1 WHERE id = $1',
        [contentId]
      );
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  async unlikeContent(userId: string, contentId: string) {
    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Delete from user_likes
      const deleteResult = await client.query(
        'DELETE FROM user_likes WHERE user_id = $1 AND content_id = $2',
        [userId, contentId]
      );
      
      // Only update likes count if a row was actually deleted
      if (deleteResult.rowCount && deleteResult.rowCount > 0) {
        await client.query(
          'UPDATE content SET likes = GREATEST(likes - 1, 0) WHERE id = $1',
          [contentId]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
  async getLikeStatus(userId: string, contentId: string) {
    const result = await pool.query(
      'SELECT 1 FROM user_likes WHERE user_id = $1 AND content_id = $2',
      [userId, contentId]
    );
    return result.rows.length > 0;
  },
  async getContentStats() {
    // Get total counts by type
    const typeStats = await pool.query(`
      SELECT 
        type,
        COUNT(*) as count
      FROM content 
      GROUP BY type
    `);
    
    // Get total counts by status
    const statusStats = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM content 
      GROUP BY status
    `);
    
    // Get total content count
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM content');
    const total = parseInt(totalResult.rows[0].total, 10);
    
    // Get total views
    const viewsResult = await pool.query('SELECT SUM(views) as total_views FROM content');
    const totalViews = parseInt(viewsResult.rows[0].total_views || 0, 10);
    
    // Transform results
    const typeCounts = typeStats.rows.reduce((acc: any, row: any) => {
      acc[row.type] = parseInt(row.count, 10);
      return acc;
    }, {});
    
    const statusCounts = statusStats.rows.reduce((acc: any, row: any) => {
      acc[row.status] = parseInt(row.count, 10);
      return acc;
    }, {});
    
    return {
      total,
      articles: typeCounts.article || 0,
      documents: typeCounts.document || 0,
      notes: typeCounts.note || 0,
      published: statusCounts.published || 0,
      draft: statusCounts.draft || 0,
      private: statusCounts.private || 0,
      archived: statusCounts.archived || 0,
      totalViews,
    };
  },
  async incrementView(contentId: string, userId?: string) {
    const client = await pool.connect();
    try {
      // Increment view count
      await client.query(
        'UPDATE content SET views = views + 1 WHERE id = $1',
        [contentId]
      );
      
      // If userId provided, track user view (optional)
      if (userId) {
        await client.query(
          'INSERT INTO user_views (user_id, content_id, viewed_at) VALUES ($1, $2, NOW()) ON CONFLICT (user_id, content_id) DO UPDATE SET viewed_at = NOW()',
          [userId, contentId]
        );
      }
    } finally {
      client.release();
    }
  },
};
