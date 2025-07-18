import request from 'supertest';
import app from '../src/index';

describe('AnalyticsEvent API', () => {
  it('should get analytics event list', async () => {
    const res = await request(app).get('/api/analytics-events?page=1&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should get analytics event detail', async () => {
    const listRes = await request(app).get('/api/analytics-events?page=1&limit=1');
    const item = listRes.body.data[0];
    if (item) {
      const res = await request(app).get(`/api/analytics-events/${item.id}`);
      expect([200, 404]).toContain(res.statusCode);
    }
  });
}); 