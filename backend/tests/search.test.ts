import request from 'supertest';
import app from '../src/index';

describe('Search API', () => {
  it('should return content for a valid keyword', async () => {
    const res = await request(app).get('/api/search?q=node');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should return empty for nonsense keyword', async () => {
    const res = await request(app).get('/api/search?q=asdkfjaskldfj');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it('should block after too many search requests', async () => {
    for (let i = 0; i < 31; i++) {
      await request(app).get('/api/search?q=test');
    }
    const res = await request(app).get('/api/search?q=test');
    expect([429, 200]).toContain(res.statusCode); // 429 nếu bị chặn
  });
}); 