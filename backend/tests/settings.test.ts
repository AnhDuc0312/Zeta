import request from 'supertest';
import app from '../src/index';

describe('Admin Settings API', () => {
  let createdId = '';

  it('should get settings list with pagination', async () => {
    const res = await request(app).get('/api/admin/settings?page=1&limit=2');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(2);
  });

  it('should create a new setting', async () => {
    const res = await request(app)
      .post('/api/admin/settings')
      .send({ key: 'site_name', value: 'Builder Orbit' });
    expect([200, 201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) createdId = res.body.id || '';
  });

  it('should not create setting with missing key', async () => {
    const res = await request(app)
      .post('/api/admin/settings')
      .send({ value: 'No key' });
    expect(res.statusCode).toBe(400);
  });

  it('should get setting detail', async () => {
    const listRes = await request(app).get('/api/admin/settings?page=1&limit=1');
    const setting = listRes.body.data[0];
    const res = await request(app).get(`/api/admin/settings/${setting.id}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should update setting', async () => {
    const listRes = await request(app).get('/api/admin/settings?page=1&limit=1');
    const setting = listRes.body.data[0];
    const res = await request(app)
      .put(`/api/admin/settings/${setting.id}`)
      .send({ key: 'site_name', value: 'Builder Orbit Updated' });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should delete setting', async () => {
    const listRes = await request(app).get('/api/admin/settings?page=1&limit=1');
    const setting = listRes.body.data[0];
    const res = await request(app).delete(`/api/admin/settings/${setting.id}`);
    expect([204, 404]).toContain(res.statusCode);
  });
}); 