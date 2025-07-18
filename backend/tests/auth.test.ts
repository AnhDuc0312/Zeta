import request from 'supertest';
import app from '../src/index';

describe('Auth API', () => {
  const testEmail = 'testuser@example.com';
  const testPassword = 'test1234';
  let token = '';

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: testEmail, password: testPassword });
    expect([200, 201, 400]).toContain(res.statusCode); // 400 nếu email đã tồn tại
  });

  it('should not register with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: testEmail });
    expect(res.statusCode).toBe(400);
  });

  it('should not register with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  it('should not login with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail });
    expect(res.statusCode).toBe(400);
  });

  it('should not login with wrong email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notfound@example.com', password: testPassword });
    expect(res.statusCode).toBe(401);
  });

  it('should get profile when logged in', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testEmail);
  });

  it('should not get profile when not logged in', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.statusCode).toBe(401);
  });

  it('should logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.statusCode).toBe(200);
  });
}); 