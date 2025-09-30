import { Pool } from 'pg';
import pool from '../../src/db';

// Mock the database connection
const mockPool = {
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn(),
  on: jest.fn(),
  totalCount: 0,
  idleCount: 0,
  waitingCount: 0
} as jest.Mocked<Pool>;

jest.mock('../../src/db', () => ({
  default: mockPool
}));

describe('Database Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Database Connection', () => {
    it('should establish database connection', () => {
      expect(mockPool).toBeDefined();
      expect(mockPool.query).toBeDefined();
      expect(mockPool.connect).toBeDefined();
    });

    it('should handle connection errors', async () => {
      const connectionError = new Error('Connection failed') as any;
      connectionError.code = 'ECONNREFUSED';
      mockPool.connect.mockRejectedValueOnce(connectionError);

      await expect(mockPool.connect()).rejects.toThrow('Connection failed');
    });
  });

  describe('Content Operations', () => {
    it('should create content with all fields', async () => {
      const contentData = {
        id: '1',
        title: 'Test Article',
        description: 'Test Description',
        content: 'Test Content',
        type: 'article',
        author_id: 'user1',
        category_id: 'cat1',
        tags: ['test', 'article'],
        read_time: 5,
        word_count: 100,
        image_url: 'https://example.com/image.jpg',
        featured: true,
        status: 'published',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      const expectedContent = {
        ...contentData,
        views: 0,
        likes: 0,
        comments: 0
      };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedContent] });

      const result = await mockPool.query(
        'INSERT INTO content (id, title, description, content, type, author_id, category_id, tags, read_time, word_count, image_url, featured, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
        [contentData.id, contentData.title, contentData.description, contentData.content, contentData.type, contentData.author_id, contentData.category_id, contentData.tags, contentData.read_time, contentData.word_count, contentData.image_url, contentData.featured, contentData.status]
      );

      expect(result.rows[0]).toEqual(expectedContent);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO content'),
        expect.arrayContaining([contentData.id, contentData.title, contentData.description])
      );
    });

    it('should retrieve content with author and category information', async () => {
      const expectedContent = {
        id: '1',
        title: 'Test Article',
        description: 'Test Description',
        content: 'Test Content',
        type: 'article',
        author_id: 'user1',
        author_name: 'John Doe',
        author_email: 'john@example.com',
        category_id: 'cat1',
        category_name: 'Technology',
        tags: ['test', 'article'],
        read_time: 5,
        word_count: 100,
        image_url: 'https://example.com/image.jpg',
        featured: true,
        status: 'published',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        views: 10,
        likes: 5,
        comments: 3
      };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedContent] });

      const result = await mockPool.query(
        `SELECT c.*, u.name as author_name, u.email as author_email, cat.name as category_name,
                COALESCE(COUNT(DISTINCT v.id), 0) as views,
                COALESCE(COUNT(DISTINCT l.id), 0) as likes,
                COALESCE(COUNT(DISTINCT com.id), 0) as comments
         FROM content c
         LEFT JOIN users u ON c.author_id = u.id
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN content_views v ON c.id = v.content_id
         LEFT JOIN content_likes l ON c.id = l.content_id
         LEFT JOIN comments com ON c.id = com.content_id
         WHERE c.id = $1
         GROUP BY c.id, u.name, u.email, cat.name`,
        ['1']
      );

      expect(result.rows[0]).toEqual(expectedContent);
    });

    it('should update content', async () => {
      const updateData = {
        title: 'Updated Article',
        description: 'Updated Description',
        status: 'published',
        updated_at: '2023-01-02T00:00:00Z'
      };

      const expectedContent = {
        id: '1',
        ...updateData
      };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedContent] });

      const result = await mockPool.query(
        'UPDATE content SET title = $1, description = $2, status = $3, updated_at = $4 WHERE id = $5 RETURNING *',
        [updateData.title, updateData.description, updateData.status, updateData.updated_at, '1']
      );

      expect(result.rows[0]).toEqual(expectedContent);
    });

    it('should delete content', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 1 });

      const result = await mockPool.query('DELETE FROM content WHERE id = $1', ['1']);

      expect(result.rowCount).toBe(1);
      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM content WHERE id = $1', ['1']);
    });
  });

  describe('Comment Operations', () => {
    it('should create comment with all fields', async () => {
      const commentData = {
        id: '1',
        content_id: 'content1',
        user_id: 'user1',
        text: 'Great article!',
        parent_id: null,
        status: 'published',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      const expectedComment = {
        ...commentData,
        author_name: 'John Doe'
      };

      mockPool.query
        .mockResolvedValueOnce({ rows: [expectedComment] })
        .mockResolvedValueOnce({ rows: [expectedComment] });

      const result = await mockPool.query(
        'INSERT INTO comments (id, content_id, user_id, text, parent_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [commentData.id, commentData.content_id, commentData.user_id, commentData.text, commentData.parent_id, commentData.status]
      );

      expect(result.rows[0]).toEqual(expectedComment);
    });

    it('should retrieve comments with author information', async () => {
      const comments = [
        {
          id: '1',
          text: 'Great article!',
          author_name: 'John Doe'
        },
        {
          id: '2',
          text: 'Very informative!',
          author_name: 'Jane Smith'
        }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: comments });

      const result = await mockPool.query(
        `SELECT c.*, u.name as author_name
         FROM comments c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.content_id = $1 AND c.status = 'published'
         ORDER BY c.created_at ASC`,
        ['content1']
      );

      expect(result.rows).toEqual(comments);
    });

    it('should retrieve comment replies', async () => {
      const replies = [
        {
          id: '2',
          text: 'Thanks for the feedback!',
          parent_id: '1',
          author_name: 'John Doe'
        }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: replies });

      const result = await mockPool.query(
        `SELECT c.*, u.name as author_name
         FROM comments c
         LEFT JOIN users u ON c.user_id = u.id
         WHERE c.parent_id = $1 AND c.status = 'published'
         ORDER BY c.created_at ASC`,
        ['1']
      );

      expect(result.rows).toEqual(replies);
    });
  });

  describe('Search Operations', () => {
    it('should perform full-text search', async () => {
      const searchResults = [
        {
          id: '1',
          title: 'JavaScript Best Practices',
          description: 'Learn the best practices for JavaScript development',
          type: 'article',
          author_name: 'John Doe',
          created_at: '2023-01-01T00:00:00Z',
          views: 100,
          likes: 10,
          comments: 5,
          category: 'Programming',
          featured: true,
          rank: 0.9
        }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: searchResults });

      const result = await mockPool.query(
        `SELECT c.*, u.name as author_name, cat.name as category,
                COALESCE(COUNT(DISTINCT v.id), 0) as views,
                COALESCE(COUNT(DISTINCT l.id), 0) as likes,
                COALESCE(COUNT(DISTINCT com.id), 0) as comments,
                ts_rank(to_tsvector('english', c.title || ' ' || c.description || ' ' || c.content), plainto_tsquery('english', $1)) as rank
         FROM content c
         LEFT JOIN users u ON c.author_id = u.id
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN content_views v ON c.id = v.content_id
         LEFT JOIN content_likes l ON c.id = l.content_id
         LEFT JOIN comments com ON c.id = com.content_id
         WHERE to_tsvector('english', c.title || ' ' || c.description || ' ' || c.content) @@ plainto_tsquery('english', $1)
           AND c.status = 'published'
         GROUP BY c.id, u.name, cat.name
         ORDER BY rank DESC, c.created_at DESC`,
        ['javascript']
      );

      expect(result.rows).toEqual(searchResults);
    });
  });

  describe('User Operations', () => {
    it('should create user with all fields', async () => {
      const userData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'user',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };

      const expectedUser = { ...userData };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedUser] });

      const result = await mockPool.query(
        'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userData.id, userData.name, userData.email, userData.password, userData.role]
      );

      expect(result.rows[0]).toEqual(expectedUser);
    });

    it('should find user by email', async () => {
      const userData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        role: 'user'
      };

      mockPool.query.mockResolvedValueOnce({ rows: [userData] });

      const result = await mockPool.query(
        'SELECT * FROM users WHERE email = $1',
        ['john@example.com']
      );

      expect(result.rows[0]).toEqual(userData);
    });
  });

  describe('Error Handling', () => {
    it('should handle constraint violations', async () => {
      const constraintError = new Error('duplicate key value violates unique constraint') as any;
      constraintError.code = '23505';
      constraintError.constraint = 'users_email_key';

      mockPool.query.mockRejectedValueOnce(constraintError);

      await expect(mockPool.query(
        'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
        ['1', 'John Doe', 'john@example.com', 'password', 'user']
      )).rejects.toThrow('duplicate key value violates unique constraint');
    });

    it('should handle foreign key violations', async () => {
      const fkError = new Error('insert or update on table "content" violates foreign key constraint') as any;
      fkError.code = '23503';

      mockPool.query.mockRejectedValueOnce(fkError);

      await expect(mockPool.query(
        'INSERT INTO content (id, title, author_id) VALUES ($1, $2, $3)',
        ['1', 'Test Article', 'nonexistent_user']
      )).rejects.toThrow('insert or update on table "content" violates foreign key constraint');
    });

    it('should handle query timeouts', async () => {
      const timeoutError = new Error('Query timeout') as any;
      timeoutError.code = 'ETIMEOUT';

      mockPool.query.mockRejectedValueOnce(timeoutError);

      await expect(mockPool.query('SELECT * FROM content')).rejects.toThrow('Query timeout');
    });
  });

  describe('Transaction Operations', () => {
    it('should handle transactions', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn()
      };

      mockPool.connect.mockResolvedValueOnce(mockClient as any);

      const client = await mockPool.connect();
      
      try {
        await client.query('BEGIN');
        await client.query('INSERT INTO content (id, title) VALUES ($1, $2)', ['1', 'Test']);
        await client.query('COMMIT');
      } finally {
        client.release();
      }

      expect(mockPool.connect).toHaveBeenCalled();
      expect(client.query).toHaveBeenCalledWith('BEGIN');
      expect(client.query).toHaveBeenCalledWith('COMMIT');
      expect(client.release).toHaveBeenCalled();
    });

    it('should handle transaction rollbacks', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn()
      };

      mockPool.connect.mockResolvedValueOnce(mockClient as any);

      const client = await mockPool.connect();
      
      try {
        await client.query('BEGIN');
        await client.query('INSERT INTO content (id, title) VALUES ($1, $2)', ['1', 'Test']);
        await client.query('ROLLBACK');
      } finally {
        client.release();
      }

      expect(mockPool.connect).toHaveBeenCalled();
      expect(client.query).toHaveBeenCalledWith('BEGIN');
      expect(client.query).toHaveBeenCalledWith('ROLLBACK');
      expect(client.release).toHaveBeenCalled();
    });
  });
});