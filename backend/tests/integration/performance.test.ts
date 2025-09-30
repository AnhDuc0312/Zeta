import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../../src/routes/auth';
import contentRoutes from '../../src/routes/content';
import commentRoutes from '../../src/routes/comments';
import searchRoutes from '../../src/routes/search';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);

describe('Performance Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Response Time Tests', () => {
    it('should respond to content list within acceptable time', async () => {
      const mockContent = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Article ${i + 1}`,
        description: `Description ${i + 1}`,
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockContent });

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/content');
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle large content lists efficiently', async () => {
      const mockContent = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Article ${i + 1}`,
        description: `Description ${i + 1}`,
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockContent });

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/content?limit=100');
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(2000); // Should respond within 2 seconds
    });

    it('should handle search queries efficiently', async () => {
      const mockSearchResults = Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Search Result ${i + 1}`,
        description: `Description ${i + 1}`,
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5,
        category: 'Technology',
        featured: false,
        rank: 0.5
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockSearchResults });

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/search?q=test');
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(1500); // Should respond within 1.5 seconds
    });

    it('should handle comment loading efficiently', async () => {
      const mockComments = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        content_id: '1',
        user_id: `${i + 1}`,
        text: `Comment ${i + 1}`,
        author_name: `User ${i + 1}`,
        created_at: '2024-01-01T00:00:00Z',
        status: 'visible'
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockComments });

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/comments?contentId=1');
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(20);
      expect(endTime - startTime).toBeLessThan(1000); // Should respond within 1 second
    });
  });

  describe('Concurrent Request Tests', () => {
    it('should handle multiple concurrent content requests', async () => {
      const mockContent = {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5
      };

      (global.mockPool.query as jest.Mock).mockResolvedValue({ rows: [mockContent] });

      const requests = Array.from({ length: 10 }, () =>
        request(app).get('/api/content/1')
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      expect(endTime - startTime).toBeLessThan(3000); // All requests should complete within 3 seconds
    });

    it('should handle concurrent search requests', async () => {
      const mockSearchResults = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Search Result ${i + 1}`,
        description: `Description ${i + 1}`,
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5,
        category: 'Technology',
        featured: false,
        rank: 0.5
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValue({ rows: mockSearchResults });

      const requests = Array.from({ length: 5 }, (_, i) =>
        request(app).get(`/api/search?q=test${i}`)
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      expect(endTime - startTime).toBeLessThan(2000); // All requests should complete within 2 seconds
    });

    it('should handle concurrent comment requests', async () => {
      const mockComments = Array.from({ length: 5 }, (_, i) => ({
        id: `${i + 1}`,
        content_id: '1',
        user_id: `${i + 1}`,
        text: `Comment ${i + 1}`,
        author_name: `User ${i + 1}`,
        created_at: '2024-01-01T00:00:00Z',
        status: 'visible'
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValue({ rows: mockComments });

      const requests = Array.from({ length: 8 }, () =>
        request(app).get('/api/comments?contentId=1')
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      expect(endTime - startTime).toBeLessThan(1500); // All requests should complete within 1.5 seconds
    });
  });

  describe('Memory Usage Tests', () => {
    it('should handle large content creation without memory issues', async () => {
      const largeContent = {
        title: 'Large Article',
        description: 'Large description',
        content: 'x'.repeat(100000), // 100KB content
        type: 'article',
        author_id: '1'
      };

      const mockResponse = {
        id: '1',
        ...largeContent,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockResponse] });

      const startTime = Date.now();
      const response = await request(app)
        .post('/api/content')
        .send(largeContent);
      const endTime = Date.now();

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
    });

    it('should handle large comment creation without memory issues', async () => {
      const largeComment = {
        contentId: '1',
        body: 'x'.repeat(10000) // 10KB comment
      };

      const mockResponse = {
        id: '1',
        content_id: '1',
        user_id: '1',
        text: largeComment.body,
        author_name: 'Test User',
        created_at: '2024-01-01T00:00:00Z',
        status: 'visible'
      };

      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockResponse] });

      const startTime = Date.now();
      const response = await request(app)
        .post('/api/comments')
        .send(largeComment);
      const endTime = Date.now();

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Database Query Performance', () => {
    it('should handle complex queries efficiently', async () => {
      const mockContent = Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Article ${i + 1}`,
        description: `Description ${i + 1}`,
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5,
        category: 'Technology',
        featured: i % 10 === 0
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockContent });

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/content?category=Technology&featured=true&sort=views&order=desc');
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(1500); // Should complete within 1.5 seconds
    });

    it('should handle pagination efficiently', async () => {
      const mockContent = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Article ${i + 1}`,
        description: `Description ${i + 1}`,
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockContent });

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/content?page=5&limit=20');
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(20);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Rate Limiting Performance', () => {
    it('should handle rate limiting without performance degradation', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user'
      };

      (global.mockPool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

      const requests = Array.from({ length: 20 }, () =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      // Some requests might be rate limited, but they should all complete
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });

      expect(endTime - startTime).toBeLessThan(5000); // All requests should complete within 5 seconds
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle errors without performance degradation', async () => {
      (global.mockPool.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      const requests = Array.from({ length: 10 }, () =>
        request(app).get('/api/content')
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      responses.forEach(response => {
        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);
      });

      expect(endTime - startTime).toBeLessThan(2000); // All requests should complete within 2 seconds
    });
  });

  describe('Caching Performance', () => {
    it('should handle repeated requests efficiently', async () => {
      const mockContent = {
        id: '1',
        title: 'Test Article',
        description: 'Test description',
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5
      };

      (global.mockPool.query as jest.Mock).mockResolvedValue({ rows: [mockContent] });

      // First request
      const startTime1 = Date.now();
      const response1 = await request(app).get('/api/content/1');
      const endTime1 = Date.now();

      // Second request (should be faster if cached)
      const startTime2 = Date.now();
      const response2 = await request(app).get('/api/content/1');
      const endTime2 = Date.now();

      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(endTime1 - startTime1).toBeLessThan(1000);
      expect(endTime2 - startTime2).toBeLessThan(1000);
    });
  });

  describe('Load Testing Simulation', () => {
    it('should handle high load scenarios', async () => {
      const mockContent = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Article ${i + 1}`,
        description: `Description ${i + 1}`,
        type: 'article',
        author_name: 'Test Author',
        created_at: '2024-01-01T00:00:00Z',
        views: 100,
        likes: 10,
        comments: 5
      }));

      (global.mockPool.query as jest.Mock).mockResolvedValue({ rows: mockContent });

      // Simulate high load with 50 concurrent requests
      const requests = Array.from({ length: 50 }, () =>
        request(app).get('/api/content')
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const endTime = Date.now();

      const successCount = responses.filter(r => r.status === 200).length;
      const errorCount = responses.filter(r => r.status >= 400).length;

      expect(successCount).toBeGreaterThan(0);
      expect(successCount + errorCount).toBe(50);
      expect(endTime - startTime).toBeLessThan(10000); // All requests should complete within 10 seconds
    });
  });
});
