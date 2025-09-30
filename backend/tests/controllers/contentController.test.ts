import request from 'supertest';
import express from 'express';
import contentRoutes from '../../src/routes/content';

// Mock authentication middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
  authenticateJWT: (req: any, res: any, next: any) => {
    req.user = { id: '1', email: 'test@example.com' };
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/api/content', contentRoutes);

describe('ContentController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Increase timeout for all tests in this suite
  jest.setTimeout(60000);

  describe('GET /api/content', () => {
    it('should get all content successfully', async () => {
      const mockContent = [
        {
          id: '1',
          title: 'Test Article',
          description: 'Test description',
          type: 'article',
          author_name: 'Test Author',
          created_at: '2024-01-01T00:00:00Z',
          views: 100,
          likes: 10,
          comments: 5,
          category: 'Technology',
          featured: false
        }
      ];

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ 
          rows: mockContent,
          rowCount: 1
        });

      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        title: 'Test Article',
        type: 'article',
        author_name: 'Test Author'
      });
    });

    it('should filter content by type', async () => {
      const mockContent = [
        {
          id: '1',
          title: 'Test Article',
          type: 'article',
          author_name: 'Test Author'
        }
      ];

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ 
          rows: mockContent,
          rowCount: 1
        });

      const response = await request(app)
        .get('/api/content?type=article');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should handle pagination', async () => {
      const mockContent = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Test Article ${i + 1}`,
        type: 'article',
        author_name: 'Test Author'
      }));

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ 
          rows: mockContent,
          rowCount: 10
        });

      const response = await request(app)
        .get('/api/content?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination).toBeDefined();
    });

    it('should return empty array when no content', async () => {
      // Mock database query - no content
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ 
          rows: [],
          rowCount: 0
        });

      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/content/:id', () => {
    it('should get content by id successfully', async () => {
      const mockContent = {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        content: 'Test content',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5,
        category: 'Technology',
        featured: false
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockContent] });

      const response = await request(app)
        .get('/api/content/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: '1',
        title: 'Test Article',
        type: 'article'
      });
    });

    it('should return 404 for non-existent content', async () => {
      // Mock database query - no content found
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/content/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Content not found');
    });
  });

  describe('POST /api/content', () => {
    it('should create content successfully', async () => {
      const mockContent = {
        id: '1',
        title: 'New Article',
        description: 'New description',
        type: 'article',
        author_id: '1',
        created_at: '2024-01-01T00:00:00Z'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockContent] });

      const response = await request(app)
        .post('/api/content')
        .send({
          title: 'New Article',
          description: 'New description',
          content: 'New content',
          type: 'article',
          author_id: '1'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: 'New Article',
        type: 'article'
      });
    });

    it('should return error for invalid input', async () => {
      const response = await request(app)
        .post('/api/content')
        .send({
          title: '',
          type: 'invalid-type'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/content/:id', () => {
    it('should update content successfully', async () => {
      const mockContent = {
        id: '1',
        title: 'Updated Article',
        description: 'Updated description',
        type: 'article',
        updated_at: '2024-01-01T00:00:00Z'
      };

      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockContent] });

      const response = await request(app)
        .put('/api/content/1')
        .send({
          title: 'Updated Article',
          description: 'Updated description'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: 'Updated Article'
      });
    });

    it('should return 404 for non-existent content', async () => {
      // Mock database query - no content found
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/content/999')
        .send({
          title: 'Updated Article'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Content not found');
    });
  });

  describe('DELETE /api/content/:id', () => {
    it('should delete content successfully', async () => {
      // Mock database query
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 1 });

      const response = await request(app)
        .delete('/api/content/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Content deleted successfully');
    });

    it('should return 404 for non-existent content', async () => {
      // Mock database query - no content found
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 0 });

      const response = await request(app)
        .delete('/api/content/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Content not found');
    });
  });
});
