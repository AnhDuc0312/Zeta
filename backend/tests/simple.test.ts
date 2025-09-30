import request from 'supertest';
import app from '../src/index';

describe('Simple API Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status');
    });
  });

  describe('Content API - Basic', () => {
    it('should get content list', async () => {
      const res = await request(app)
        .get('/api/content?page=1&limit=5');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get content stats', async () => {
      const res = await request(app)
        .get('/api/content/stats');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(typeof res.body.total).toBe('number');
    });

    it('should get home preview', async () => {
      const res = await request(app)
        .get('/api/content/home-preview');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('articles');
      expect(Array.isArray(res.body.articles)).toBe(true);
    });
  });

  describe('Category API - Basic', () => {
    it('should get categories list', async () => {
      const res = await request(app)
        .get('/api/categories');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Search API - Basic', () => {
    it('should search content', async () => {
      const res = await request(app)
        .get('/api/search?q=test&page=1&limit=5');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
