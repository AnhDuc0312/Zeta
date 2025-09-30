import { Request, Response } from 'express';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Add content to bookmarks
export const addBookmark = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if content exists
    const contentCheck = await pool.query(
      'SELECT id, title, type FROM content WHERE id = $1',
      [id]
    );

    if (contentCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await pool.query(
      'SELECT id FROM user_bookmarks WHERE user_id = $1 AND content_id = $2',
      [userId, id]
    );

    if (existingBookmark.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Content already bookmarked' });
    }

    // Add bookmark
    const bookmarkId = uuidv4();
    await pool.query(
      'INSERT INTO user_bookmarks (id, user_id, content_id) VALUES ($1, $2, $3)',
      [bookmarkId, userId, id]
    );

    res.json({ success: true, message: 'Content bookmarked successfully' });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Remove content from bookmarks
export const removeBookmark = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await pool.query(
      'DELETE FROM user_bookmarks WHERE user_id = $1 AND content_id = $2',
      [userId, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    res.json({ success: true, message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Check bookmark status
export const getBookmarkStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await pool.query(
      'SELECT id FROM user_bookmarks WHERE user_id = $1 AND content_id = $2',
      [userId, id]
    );

    res.json({ isBookmarked: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get user bookmarks
export const getUserBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { page = 1, limit = 20, type = 'all', sort = 'newest', search = '' } = req.query;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = 'WHERE ub.user_id = $1';
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
    let orderClause = 'ORDER BY ub.bookmarked_at DESC';
    if (sort === 'oldest') {
      orderClause = 'ORDER BY ub.bookmarked_at ASC';
    } else if (sort === 'title') {
      orderClause = 'ORDER BY c.title ASC';
    }

    // Get bookmarks with content details
    const query = `
      SELECT 
        ub.id,
        ub.content_id,
        ub.bookmarked_at,
        c.id as content_id,
        c.title,
        c.description,
        c.type,
        c.content,
        c.created_at,
        c.views,
        c.likes,
        c.comments,
        c.category_id,
        u.name as author
      FROM user_bookmarks ub
      JOIN content c ON ub.content_id = c.id
      LEFT JOIN users u ON c.author_id = u.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(Number(limit), offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_bookmarks ub
      JOIN content c ON ub.content_id = c.id
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        content_id: row.content_id,
        content: {
          id: row.content_id,
          title: row.title,
          description: row.description,
          type: row.type,
          author: row.author,
          created_at: row.created_at,
          views: row.views || 0,
          likes: row.likes || 0,
          comments: row.comments || 0,
          category: row.category_id
        },
        bookmarked_at: row.bookmarked_at
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error getting user bookmarks:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get bookmark statistics
export const getBookmarkStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Get total bookmarks
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM user_bookmarks WHERE user_id = $1',
      [userId]
    );

    // Get bookmarks by type
    const typeResult = await pool.query(`
      SELECT c.type, COUNT(*) as count
      FROM user_bookmarks ub
      JOIN content c ON ub.content_id = c.id
      WHERE ub.user_id = $1
      GROUP BY c.type
    `, [userId]);

    // Get recent bookmarks (last 7 days)
    const recentResult = await pool.query(
      'SELECT COUNT(*) as recent FROM user_bookmarks WHERE user_id = $1 AND bookmarked_at >= NOW() - INTERVAL \'7 days\'',
      [userId]
    );

    const stats = {
      total: parseInt(totalResult.rows[0].total),
      articles: 0,
      documents: 0,
      notes: 0,
      recent: parseInt(recentResult.rows[0].recent)
    };

    // Map type counts
    typeResult.rows.forEach(row => {
      if (row.type === 'article') stats.articles = parseInt(row.count);
      else if (row.type === 'document') stats.documents = parseInt(row.count);
      else if (row.type === 'note') stats.notes = parseInt(row.count);
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting bookmark stats:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
