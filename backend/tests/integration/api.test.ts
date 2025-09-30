import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../../src/routes/auth';
import contentRoutes from '../../src/routes/content';
import commentRoutes from '../../src/routes/comments';
import searchRoutes from '../../src/routes/search';

// Mock authentication middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
  authenticateJWT: (req: any, res: any, next: any) => {
    req.user = { id: '1', email: 'test@example.com' };
    next();
  }
}));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Increase timeout for all tests in this suite
  jest.setTimeout(60000);

  describe('Authentication Flow', () => {
    it('should complete full authentication flow', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user'
      };

      // Mock database queries
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] }) // Check if user exists
        .mockResolvedValueOnce({ rows: [mockUser] }); // Create user

      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user.email).toBe('test@example.com');

      // Login user
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data.token).toBeDefined();
    });
  });

  describe('Content Management Flow', () => {
    it('should complete full content management flow', async () => {
      const mockContent = {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        type: 'article',
        author_id: '1',
        created_at: '2024-01-01T00:00:00Z'
      };

      // Create content
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockContent] });

      const createResponse = await request(app)
        .post('/api/content')
        .send({
          title: 'Test Article',
          description: 'Test description',
          content: 'Test content',
          type: 'article',
          author_id: '1'
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);

      // Get content
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockContent] });

      const getResponse = await request(app)
        .get('/api/content/1');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.data.title).toBe('Test Article');

      // Update content
      const updatedContent = { ...mockContent, title: 'Updated Article' };
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [updatedContent] });

      const updateResponse = await request(app)
        .put('/api/content/1')
        .send({
          title: 'Updated Article'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.title).toBe('Updated Article');

      // Delete content
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 1 });

      const deleteResponse = await request(app)
        .delete('/api/content/1');

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
    });
  });

  describe('Comment System Flow', () => {
    it('should complete full comment system flow', async () => {
      const mockComment = {
        id: '1',
        content_id: '1',
        user_id: '1',
        text: 'Great article!',
        author_name: 'Test User',
        created_at: '2024-01-01T00:00:00Z',
        status: 'visible'
      };

      // Create comment
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockComment] });

      const createResponse = await request(app)
        .post('/api/comments')
        .send({
          contentId: '1',
          body: 'Great article!'
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data.text).toBe('Great article!');

      // Get comments
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockComment] });

      const getResponse = await request(app)
        .get('/api/comments?contentId=1');

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.data).toHaveLength(1);

      // Create reply
      const mockReply = {
        id: '2',
        content_id: '1',
        user_id: '2',
        text: 'I agree!',
        parent_id: '1',
        author_name: 'Another User',
        created_at: '2024-01-02T00:00:00Z',
        status: 'visible'
      };

      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockReply] });

      const replyResponse = await request(app)
        .post('/api/comments')
        .send({
          contentId: '1',
          body: 'I agree!',
          parentId: '1'
        });

      expect(replyResponse.status).toBe(201);
      expect(replyResponse.body.success).toBe(true);
      expect(replyResponse.body.data.parent_id).toBe('1');

      // Get replies
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockReply] });

      const repliesResponse = await request(app)
        .get('/api/comments/1/replies');

      expect(repliesResponse.status).toBe(200);
      expect(repliesResponse.body.success).toBe(true);
      expect(repliesResponse.body.data).toHaveLength(1);
    });
  });

  describe('Search Flow', () => {
    it('should complete search flow', async () => {
      const mockSearchResults = [
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

      // Search content
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: mockSearchResults });

      const searchResponse = await request(app)
        .get('/api/search?q=test');

      expect(searchResponse.status).toBe(200);
      expect(searchResponse.body.success).toBe(true);
      expect(searchResponse.body.data).toHaveLength(1);
      expect(searchResponse.body.data[0].title).toBe('Test Article');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      (global.mockPool.query as jest.Mock)
        .mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Database connection failed');
    });

    it('should handle validation errors', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should handle 404 errors', async () => {
      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/content/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Content not found');
    });
  });

  describe('CORS and Middleware', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/content')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.status).toBe(204);
    });

    it('should parse JSON requests', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user'
      };

      (global.mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
