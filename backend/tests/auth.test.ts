import request from 'supertest';
import app from '../src/index';

describe('Auth API', () => {
  const testEmail = 'testuser@example.com';
  let testPassword = 'test1234';
  const testName = 'Test User';
  let token = '';
  let userId = '';

  beforeAll(async () => {
    // Clean up any existing test user
    try {
      await request(app)
        .delete('/api/users/test-cleanup')
        .send({ email: testEmail });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  afterAll(async () => {
    // Clean up test data
    try {
      if (token) {
        await request(app)
          .delete('/api/users/test-cleanup')
          .set('Authorization', `Bearer ${token}`)
          .send({ email: testEmail });
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          name: testName, 
          email: testEmail, 
          password: testPassword 
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('name', testName);
      expect(res.body.user).toHaveProperty('email', testEmail);
      expect(res.body.user).not.toHaveProperty('password');
      userId = res.body.user.id;
    });

    it('should not register with missing name', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: testEmail, password: testPassword });
      expect(res.statusCode).toBe(400);
    });

    it('should not register with missing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: testName, password: testPassword });
      expect(res.statusCode).toBe(400);
    });

    it('should not register with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: testName, email: testEmail });
      expect(res.statusCode).toBe(400);
    });

    it('should not register with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          name: testName, 
          email: 'invalid-email', 
          password: testPassword 
        });
      expect(res.statusCode).toBe(400);
    });

    it('should not register with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          name: testName, 
          email: 'test2@example.com', 
          password: '123' 
        });
      expect(res.statusCode).toBe(400);
    });

    it('should not register with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ 
          name: 'Another User', 
          email: testEmail, 
          password: testPassword 
        });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id', userId);
      expect(res.body.user).toHaveProperty('name', testName);
      expect(res.body.user).toHaveProperty('email', testEmail);
      token = res.body.token;
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'wrongpass' });
      expect(res.statusCode).toBe(401);
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: testPassword });
      expect(res.statusCode).toBe(401);
    });

    it('should not login with missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: testPassword });
      expect(res.statusCode).toBe(400);
    });

    it('should not login with missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail });
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', userId);
      expect(res.body).toHaveProperty('name', testName);
      expect(res.body).toHaveProperty('email', testEmail);
    });

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');
      expect(res.statusCode).toBe(401);
    });

    it('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/auth/change-password', () => {
    it('should change password with valid current password', async () => {
      const newPassword = 'newpassword123';
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: testPassword,
          newPassword: newPassword
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      
      // Update test password for subsequent tests
      testPassword = newPassword;
    });

    it('should not change password with wrong current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongcurrent',
          newPassword: 'newpassword123'
        });
      expect(res.statusCode).toBe(400);
    });

    it('should not change password without current password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          newPassword: 'newpassword123'
        });
      expect(res.statusCode).toBe(400);
    });

    it('should not change password without new password', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: testPassword
        });
      expect(res.statusCode).toBe(400);
    });

    it('should not change password without token', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .send({
          currentPassword: testPassword,
          newPassword: 'newpassword123'
        });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should handle logout without token', async () => {
      const res = await request(app)
        .post('/api/auth/logout');
      expect(res.statusCode).toBe(401);
    });
  });
});