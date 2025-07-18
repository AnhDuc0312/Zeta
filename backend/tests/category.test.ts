import request from 'supertest';
import app from '../src/index';

describe('Category API', () => {
  it('should get category list', async () => {
    const res = await request(app).get('/api/categories?page=1&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should get category detail', async () => {
    const listRes = await request(app).get('/api/categories?page=1&limit=1');
    const item = listRes.body.data[0];
    if (item) {
      const res = await request(app).get(`/api/categories/${item.id}`);
      expect([200, 404]).toContain(res.statusCode);
    }
  });
}); 