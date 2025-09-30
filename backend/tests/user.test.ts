import request from 'supertest';
import app from '../src/index';

describe('User API', () => {
  let authToken = '';
  let userId = '';
  let adminToken = '';
  let adminUserId = '';

  beforeAll(async () => {
    // Create regular user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User Test',
        email: 'usertest@example.com',
        password: 'test1234'
      });

    if (registerRes.statusCode === 201) {
      userId = registerRes.body.user.id;
    }

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usertest@example.com',
        password: 'test1234'
      });

    if (loginRes.statusCode === 200) {
      authToken = loginRes.body.token;
      userId = loginRes.body.user.id;
    }

    // Create admin user
    const adminRegisterRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin Test',
        email: 'admintest@example.com',
        password: 'test1234',
        role: 'admin'
      });

    if (adminRegisterRes.statusCode === 201) {
      adminUserId = adminRegisterRes.body.user.id;
    }

    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admintest@example.com',
        password: 'test1234'
      });

    if (adminLoginRes.statusCode === 200) {
      adminToken = adminLoginRes.body.token;
      adminUserId = adminLoginRes.body.user.id;
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (authToken) {
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);
    }

    if (adminToken) {
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', userId);
      expect(res.body).toHaveProperty('name', 'User Test');
      expect(res.body).toHaveProperty('email', 'usertest@example.com');
    });

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/users/profile');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated User Name',
        bio: 'Updated bio',
        location: 'Updated location',
        website: 'https://updated-website.com'
      };

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('name', updateData.name);
      expect(res.body.user).toHaveProperty('bio', updateData.bio);
    });

    it('should not update profile without token', async () => {
      const updateData = {
        name: 'Unauthorized Update'
      };

      const res = await request(app)
        .put('/api/users/profile')
        .send(updateData);

      expect(res.statusCode).toBe(401);
    });

    it('should not update with invalid email format', async () => {
      const updateData = {
        email: 'invalid-email'
      };

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/users/stats', () => {
    it('should get user statistics', async () => {
      const res = await request(app)
        .get('/api/users/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('documents');
      expect(res.body).toHaveProperty('notes');
      expect(res.body).toHaveProperty('totalViews');
      expect(typeof res.body.articles).toBe('number');
      expect(typeof res.body.documents).toBe('number');
      expect(typeof res.body.notes).toBe('number');
      expect(typeof res.body.totalViews).toBe('number');
    });

    it('should not get stats without token', async () => {
      const res = await request(app)
        .get('/api/users/stats');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/users/favorites', () => {
    it('should get user favorites', async () => {
      const res = await request(app)
        .get('/api/users/favorites')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('documents');
      expect(res.body).toHaveProperty('notes');
      expect(Array.isArray(res.body.articles)).toBe(true);
      expect(Array.isArray(res.body.documents)).toBe(true);
      expect(Array.isArray(res.body.notes)).toBe(true);
    });

    it('should not get favorites without token', async () => {
      const res = await request(app)
        .get('/api/users/favorites');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Admin User Management', () => {
    describe('GET /api/admin/users', () => {
      it('should get all users as admin', async () => {
        const res = await request(app)
          .get('/api/admin/users')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it('should not get users without admin token', async () => {
        const res = await request(app)
          .get('/api/admin/users')
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(403);
      });

      it('should not get users without token', async () => {
        const res = await request(app)
          .get('/api/admin/users');

        expect(res.statusCode).toBe(401);
      });
    });

    describe('GET /api/admin/users/:id', () => {
      it('should get user by id as admin', async () => {
        const res = await request(app)
          .get(`/api/admin/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', userId);
      });

      it('should return 404 for non-existent user', async () => {
        const res = await request(app)
          .get('/api/admin/users/00000000-0000-0000-0000-000000000000')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toBe(404);
      });
    });

    describe('PUT /api/admin/users/:id', () => {
      it('should update user as admin', async () => {
        const updateData = {
          name: 'Admin Updated Name',
          role: 'user'
        };

        const res = await request(app)
          .put(`/api/admin/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(updateData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
      });

      it('should not update user without admin token', async () => {
        const updateData = {
          name: 'Unauthorized Update'
        };

        const res = await request(app)
          .put(`/api/admin/users/${userId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData);

        expect(res.statusCode).toBe(403);
      });
    });

    describe('DELETE /api/admin/users/:id', () => {
      it('should delete user as admin', async () => {
        // Create a user to delete
        const registerRes = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'User To Delete',
            email: 'deleteme@example.com',
            password: 'test1234'
          });

        if (registerRes.statusCode === 201) {
          const userToDeleteId = registerRes.body.user.id;

          const res = await request(app)
            .delete(`/api/admin/users/${userToDeleteId}`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(res.statusCode).toBe(200);
          expect(res.body).toHaveProperty('message');
        }
      });

      it('should not delete user without admin token', async () => {
        const res = await request(app)
          .delete(`/api/admin/users/${userId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(403);
      });
    });
  });
});