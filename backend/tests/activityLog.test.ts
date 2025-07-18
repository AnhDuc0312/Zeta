import request from 'supertest';
import app from '../src/index';

describe('ActivityLog API', () => {
  it('should get activity log list', async () => {
    const res = await request(app).get('/api/activity-logs?page=1&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should get activity log detail', async () => {
    const listRes = await request(app).get('/api/activity-logs?page=1&limit=1');
    const item = listRes.body.data[0];
    if (item) {
      const res = await request(app).get(`/api/activity-logs/${item.id}`);
      expect([200, 404]).toContain(res.statusCode);
    }
  });
}); 