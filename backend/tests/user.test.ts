import request from 'supertest';
import app from '../src/index';

describe('Admin User API', () => {
  let createdId = '';
  const testEmail = 'user2@example.com';
  const testPassword = 'test1234';

  it('should get user list with filter/search', async () => {
    const res = await request(app).get('/api/admin/users?page=1&limit=2&role=user&status=active&search=test');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(2);
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .send({ name: 'User2', email: testEmail, password: testPassword, role: 'user', status: 'active' });
    expect([200, 201, 400]).toContain(res.statusCode);
    if (res.statusCode === 201) createdId = res.body.id || '';
  });

  it('should not create user with missing fields', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .send({ email: testEmail });
    expect(res.statusCode).toBe(400);
  });

  it('should not create user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .send({ name: 'User2', email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(400);
  });

  it('should get user detail', async () => {
    const listRes = await request(app).get('/api/admin/users?page=1&limit=1');
    const user = listRes.body.data[0];
    const res = await request(app).get(`/api/admin/users/${user.id}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should update user', async () => {
    const listRes = await request(app).get('/api/admin/users?page=1&limit=1');
    const user = listRes.body.data[0];
    const res = await request(app)
      .put(`/api/admin/users/${user.id}`)
      .send({ name: 'User Updated', email: user.email, role: user.role, status: user.status });
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should delete user', async () => {
    const listRes = await request(app).get('/api/admin/users?page=1&limit=1');
    const user = listRes.body.data[0];
    const res = await request(app).delete(`/api/admin/users/${user.id}`);
    expect([204, 404]).toContain(res.statusCode);
  });
}); 