import request from 'supertest';
import app from '../src/index';

describe('Simple Mock Test', () => {
  it('should test basic app functionality', async () => {
    // Test health endpoint
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
  });

  it('should test content endpoint with mock data', async () => {
    const res = await request(app).get('/api/content?page=1&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should test categories endpoint with mock data', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
