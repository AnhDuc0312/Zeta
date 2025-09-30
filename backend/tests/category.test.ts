import request from 'supertest';
import app from '../src/index';

describe('Category API', () => {
  let authToken = '';
  let adminToken = '';
  let categoryId = '';

  beforeAll(async () => {
    // Create regular user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Category Test User',
        email: 'categorytest@example.com',
        password: 'test1234'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'categorytest@example.com',
        password: 'test1234'
      });

    if (loginRes.statusCode === 200) {
      authToken = loginRes.body.token;
    }

    // Create admin user
    const adminRegisterRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'test1234',
        role: 'admin'
      });

    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'test1234'
      });

    if (adminLoginRes.statusCode === 200) {
      adminToken = adminLoginRes.body.token;
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (categoryId) {
      await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }

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

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      const res = await request(app)
        .get('/api/categories');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/categories', () => {
    it('should create new category as admin', async () => {
      const categoryData = {
        name: 'Test Category',
        description: 'Test category description'
      };

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(categoryData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', categoryData.name);
      expect(res.body).toHaveProperty('description', categoryData.description);
      categoryId = res.body.id;
    });

    it('should not create category without name', async () => {
      const categoryData = {
        description: 'Test description'
      };

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(categoryData);

      expect(res.statusCode).toBe(400);
    });

    it('should not create category without authentication', async () => {
      const categoryData = {
        name: 'Unauthorized Category',
        description: 'Test description'
      };

      const res = await request(app)
        .post('/api/categories')
        .send(categoryData);

      expect(res.statusCode).toBe(401);
    });

    it('should not create category without admin role', async () => {
      const categoryData = {
        name: 'Regular User Category',
        description: 'Test description'
      };

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(categoryData);

      expect(res.statusCode).toBe(403);
    });

    it('should not create category with duplicate name', async () => {
      const categoryData = {
        name: 'Test Category', // Same name as before
        description: 'Another description'
      };

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(categoryData);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should get category by id', async () => {
      if (!categoryId) return;

      const res = await request(app)
        .get(`/api/categories/${categoryId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', categoryId);
      expect(res.body).toHaveProperty('name', 'Test Category');
    });

    it('should return 404 for non-existent category', async () => {
      const res = await request(app)
        .get('/api/categories/00000000-0000-0000-0000-000000000000');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update category as admin', async () => {
      if (!categoryId) return;

      const updateData = {
        name: 'Updated Test Category',
        description: 'Updated description'
      };

      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should not update category without admin role', async () => {
      if (!categoryId) return;

      const updateData = {
        name: 'Unauthorized Update'
      };

      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(403);
    });

    it('should not update category without authentication', async () => {
      if (!categoryId) return;

      const updateData = {
        name: 'Unauthorized Update'
      };

      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send(updateData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category as admin', async () => {
      if (!categoryId) return;

      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      categoryId = ''; // Clear for cleanup
    });

    it('should not delete category without admin role', async () => {
      // Create a category to try to delete
      const categoryData = {
        name: 'Category To Delete',
        description: 'Test description'
      };

      const createRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(categoryData);

      if (createRes.statusCode === 201) {
        const tempCategoryId = createRes.body.id;

        const res = await request(app)
          .delete(`/api/categories/${tempCategoryId}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toBe(403);

        // Clean up
        await request(app)
          .delete(`/api/categories/${tempCategoryId}`)
          .set('Authorization', `Bearer ${adminToken}`);
      }
    });

    it('should not delete category without authentication', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});