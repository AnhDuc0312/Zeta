import request from 'supertest';
import app from '../src/index';

describe('Comprehensive Backend Tests', () => {
  let authToken = '';
  let userId = '';
  let contentId = '';
  let categoryId = '';

  beforeAll(async () => {
    // Register test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test1234'
      });

    if (registerRes.statusCode === 201) {
      userId = registerRes.body.user.id;
    }

    // Login test user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test1234'
      });

    if (loginRes.statusCode === 200) {
      authToken = loginRes.body.token;
      userId = loginRes.body.user.id;
    }

    // Create test category
    const categoryRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Category',
        description: 'Test category for content'
      });

    if (categoryRes.statusCode === 201) {
      categoryId = categoryRes.body.id;
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (contentId) {
      await request(app)
        .delete(`/api/content/${contentId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
    
    if (categoryId) {
      await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`);
    }
  });

  describe('Authentication', () => {
    it('should register new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect([200, 201, 400]).toContain(res.statusCode);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'test1234'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Content Management', () => {
    it('should create new article', async () => {
      const contentData = {
        title: 'Test Article',
        description: 'Test article description',
        content: '# Test Article\n\nThis is a test article.',
        type: 'article',
        status: 'published',
        category_id: categoryId,
        tags: ['test', 'article']
      };

      const res = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contentData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', contentData.title);
      contentId = res.body.id;
    });

    it('should get content list with pagination', async () => {
      const res = await request(app)
        .get('/api/content?page=1&limit=10');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get content by type', async () => {
      const res = await request(app)
        .get('/api/content?type=article&page=1&limit=10');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should search content', async () => {
      const res = await request(app)
        .get('/api/content?search=test&page=1&limit=10');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get content by id', async () => {
      if (!contentId) return;

      const res = await request(app)
        .get(`/api/content/${contentId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', contentId);
    });

    it('should like content', async () => {
      if (!contentId) return;

      const res = await request(app)
        .post(`/api/content/${contentId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should get like status', async () => {
      if (!contentId) return;

      const res = await request(app)
        .get(`/api/content/${contentId}/like-status`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('isLiked');
      expect(typeof res.body.isLiked).toBe('boolean');
    });

    it('should increment view count', async () => {
      if (!contentId) return;

      const res = await request(app)
        .post(`/api/content/${contentId}/view`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: userId });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should get content statistics', async () => {
      const res = await request(app)
        .get('/api/content/stats');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('documents');
      expect(res.body).toHaveProperty('notes');
    });

    it('should get home preview', async () => {
      const res = await request(app)
        .get('/api/content/home-preview');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('documents');
      expect(res.body).toHaveProperty('notes');
      expect(Array.isArray(res.body.articles)).toBe(true);
    });
  });

  describe('Category Management', () => {
    it('should get categories list', async () => {
      const res = await request(app)
        .get('/api/categories');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should create new category', async () => {
      const categoryData = {
        name: 'New Test Category',
        description: 'New test category description'
      };

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(categoryData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', categoryData.name);
    });

    it('should get category by id', async () => {
      if (!categoryId) return;

      const res = await request(app)
        .get(`/api/categories/${categoryId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', categoryId);
    });
  });

  describe('User Management', () => {
    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', userId);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('email');
    });

    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Test User',
        bio: 'Updated bio',
        location: 'Updated location'
      };

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should get user statistics', async () => {
      const res = await request(app)
        .get('/api/users/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('documents');
      expect(res.body).toHaveProperty('notes');
      expect(res.body).toHaveProperty('totalViews');
    });

    it('should get user favorites', async () => {
      const res = await request(app)
        .get('/api/users/favorites')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('documents');
      expect(res.body).toHaveProperty('notes');
      expect(Array.isArray(res.body.articles)).toBe(true);
    });
  });

  describe('Search Functionality', () => {
    it('should search content', async () => {
      const res = await request(app)
        .get('/api/search?q=test&page=1&limit=10');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should search with filters', async () => {
      const res = await request(app)
        .get('/api/search?q=test&type=article&page=1&limit=10');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent content', async () => {
      const res = await request(app)
        .get('/api/content/00000000-0000-0000-0000-000000000000');

      expect(res.statusCode).toBe(404);
    });

    it('should return 401 for protected routes without token', async () => {
      const res = await request(app)
        .get('/api/users/profile');

      expect(res.statusCode).toBe(401);
    });

    it('should return 400 for invalid data', async () => {
      const res = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          // Missing required fields
          description: 'Test description'
        });

      expect(res.statusCode).toBe(400);
    });
  });
});

