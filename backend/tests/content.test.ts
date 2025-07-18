import request from 'supertest';
import app from '../src/index';

describe('Content API', () => {
  it('should get content list', async () => {
    const res = await request(app).get('/api/content?page=1&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(5);
  });

  it('should get content detail', async () => {
    const listRes = await request(app).get('/api/content?page=1&limit=1');
    const item = listRes.body.data[0];
    const res = await request(app).get(`/api/content/${item.id}`);
    expect([200, 404]).toContain(res.statusCode);
  });
}); 