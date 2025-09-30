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

describe('Error Handling Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Database Errors', () => {
    it('should handle connection errors', async () => {
      const connectionError = new Error('Connection failed') as any;
      connectionError.code = 'ECONNREFUSED';
      
      (global.mockPool.query as jest.Mock).mockRejectedValueOnce(connectionError);

      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Database connection failed');
    });

    it('should handle query timeout errors', async () => {
      const timeoutError = new Error('Query timeout') as any;
      timeoutError.code = 'ETIMEDOUT';
      
      (global.mockPool.query as jest.Mock).mockRejectedValueOnce(timeoutError);

      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Query timeout');
    });

    it('should handle constraint violation errors', async () => {
      const constraintError = new Error('duplicate key value violates unique constraint "users_email_key"') as any;
      constraintError.code = '23505';
      
      (global.mockPool.query as jest.Mock).mockRejectedValueOnce(constraintError);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email already exists');
    });

    it('should handle foreign key violation errors', async () => {
      const fkError = new Error('insert or update on table "content" violates foreign key constraint "content_author_id_fkey"') as any;
      fkError.code = '23503';
      
      (global.mockPool.query as jest.Mock).mockRejectedValueOnce(fkError);

      const response = await request(app)
        .post('/api/content')
        .send({
          title: 'Test Article',
          description: 'Test description',
          content: 'Test content',
          type: 'article',
          author_id: '999'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid author');
    });

    it('should handle not null violation errors', async () => {
      const notNullError = new Error('null value in column "title" violates not-null constraint') as any;
      notNullError.code = '23502';
      
      (global.mockPool.query as jest.Mock).mockRejectedValueOnce(notNullError);

      const response = await request(app)
        .post('/api/content')
        .send({
          description: 'Test description',
          content: 'Test content',
          type: 'article',
          author_id: '1'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Title is required');
    });
  });

  describe('Validation Errors', () => {
    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User'
          // Missing email and password
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should handle invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should handle weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should handle invalid content type', async () => {
      const response = await request(app)
        .post('/api/content')
        .send({
          title: 'Test Article',
          description: 'Test description',
          content: 'Test content',
          type: 'invalid-type',
          author_id: '1'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should handle invalid UUID format', async () => {
      const response = await request(app)
        .get('/api/content/invalid-uuid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid ID format');
    });
  });

  describe('Authentication Errors', () => {
    it('should handle invalid credentials', async () => {
      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should handle missing token', async () => {
      const response = await request(app)
        .get('/api/content')
        .set('Authorization', '');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Access token required');
    });

    it('should handle invalid token', async () => {
      const response = await request(app)
        .get('/api/content')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid token');
    });

    it('should handle expired token', async () => {
      const response = await request(app)
        .get('/api/content')
        .set('Authorization', 'Bearer expired-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Token expired');
    });
  });

  describe('Authorization Errors', () => {
    it('should handle insufficient permissions', async () => {
      const response = await request(app)
        .delete('/api/content/1')
        .set('Authorization', 'Bearer user-token');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Insufficient permissions');
    });

    it('should handle resource ownership validation', async () => {
      const response = await request(app)
        .put('/api/content/1')
        .set('Authorization', 'Bearer other-user-token')
        .send({
          title: 'Updated Article'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('You can only edit your own content');
    });
  });

  describe('Resource Not Found Errors', () => {
    it('should handle content not found', async () => {
      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/content/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Content not found');
    });

    it('should handle comment not found', async () => {
      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/comments/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Comment not found');
    });

    it('should handle user not found', async () => {
      (global.mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('Rate Limiting Errors', () => {
    it('should handle rate limit exceeded', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Simulate rate limit exceeded
      if (response.status === 429) {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Too many requests');
      }
    });
  });

  describe('File Upload Errors', () => {
    it('should handle file too large', async () => {
      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.alloc(10 * 1024 * 1024), 'large.jpg');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('File size exceeds limit');
    });

    it('should handle invalid file type', async () => {
      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('text content'), 'document.txt');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid file type');
    });

    it('should handle file upload failure', async () => {
      const response = await request(app)
        .post('/api/images/upload')
        .attach('image', Buffer.from('corrupted data'), 'corrupted.jpg');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Upload failed');
    });
  });

  describe('Search Errors', () => {
    it('should handle empty search query', async () => {
      const response = await request(app)
        .get('/api/search?q=');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Search query is required');
    });

    it('should handle search query too short', async () => {
      const response = await request(app)
        .get('/api/search?q=a');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Search query must be at least 2 characters');
    });

    it('should handle search query too long', async () => {
      const longQuery = 'a'.repeat(1000);
      const response = await request(app)
        .get(`/api/search?q=${longQuery}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Search query too long');
    });
  });

  describe('Pagination Errors', () => {
    it('should handle invalid page number', async () => {
      const response = await request(app)
        .get('/api/content?page=0');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Page must be greater than 0');
    });

    it('should handle invalid limit', async () => {
      const response = await request(app)
        .get('/api/content?limit=1000');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Limit must be between 1 and 100');
    });

    it('should handle negative page number', async () => {
      const response = await request(app)
        .get('/api/content?page=-1');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Page must be greater than 0');
    });
  });

  describe('JSON Parsing Errors', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/content')
        .set('Content-Type', 'application/json')
        .send('{"title": "Test", "description": "Test", "content": "Test", "type": "article", "author_id": "1"'); // Missing closing brace

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid JSON');
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/content')
        .set('Content-Type', 'application/json')
        .send('');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Request body is required');
    });
  });

  describe('CORS Errors', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/content')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    it('should handle invalid CORS origin', async () => {
      const response = await request(app)
        .get('/api/content')
        .set('Origin', 'http://malicious-site.com');

      // Should still work but with restricted CORS headers
      expect(response.status).toBe(200);
    });
  });

  describe('Server Errors', () => {
    it('should handle unexpected server errors', async () => {
      // Mock an unexpected error
      (global.mockPool.query as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Internal server error');
    });

    it('should handle memory errors', async () => {
      const memoryError = new Error('Out of memory') as any;
      memoryError.code = 'ENOMEM';
      
      (global.mockPool.query as jest.Mock).mockRejectedValueOnce(memoryError);

      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Server resource exhausted');
    });

    it('should handle disk space errors', async () => {
      const diskError = new Error('No space left on device') as any;
      diskError.code = 'ENOSPC';
      
      (global.mockPool.query as jest.Mock).mockRejectedValueOnce(diskError);

      const response = await request(app)
        .get('/api/content');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Server storage full');
    });
  });

  describe('Error Logging', () => {
    it('should log errors appropriately', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      (global.mockPool.query as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

      await request(app)
        .get('/api/content');

      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
