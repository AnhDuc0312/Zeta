import request from 'supertest';
import app from '../src/index';

describe('Content API', () => {
  let authToken = '';
  let userId = '';
  let contentId = '';
  let categoryId = '';

  beforeAll(async () => {
    // Register and login test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Content Test User',
        email: 'contenttest@example.com',
        password: 'test1234'
      });

    if (registerRes.statusCode === 201) {
      userId = registerRes.body.user.id;
    }

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'contenttest@example.com',
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

    if (authToken) {
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);
    }
  });

  describe('POST /api/content', () => {
    it('should create new article content', async () => {
      const contentData = {
        title: 'Test Article',
        description: 'Test article description',
        content: '# Test Article\n\nThis is a test article content.',
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
      expect(res.body).toHaveProperty('type', contentData.type);
      expect(res.body).toHaveProperty('status', contentData.status);
      contentId = res.body.id;
    });

    it('should create new document content', async () => {
      const contentData = {
        title: 'Test Document',
        description: 'Test document description',
        content: 'This is a test document content.',
        type: 'document',
        status: 'published',
        category_id: categoryId,
        file_url: 'http://example.com/test.pdf',
        file_size: 1024,
        word_count: 100
      };

      const res = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contentData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', contentData.title);
      expect(res.body).toHaveProperty('type', contentData.type);
    });

    it('should create new note content', async () => {
      const contentData = {
        title: 'Test Note',
        description: 'Test note description',
        content: 'This is a test note content.',
        type: 'note',
        status: 'published',
        category_id: categoryId
      };

      const res = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contentData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', contentData.title);
      expect(res.body).toHaveProperty('type', contentData.type);
    });

    it('should not create content without title', async () => {
      const contentData = {
        description: 'Test description',
        content: 'Test content',
        type: 'article',
        status: 'published',
        category_id: categoryId
      };

      const res = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contentData);

      expect(res.statusCode).toBe(400);
    });

    it('should not create content without type', async () => {
      const contentData = {
        title: 'Test Title',
        description: 'Test description',
        content: 'Test content',
        status: 'published',
        category_id: categoryId
      };

      const res = await request(app)
        .post('/api/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contentData);

      expect(res.statusCode).toBe(400);
    });

    it('should not create content without authentication', async () => {
      const contentData = {
        title: 'Test Title',
        description: 'Test description',
        content: 'Test content',
        type: 'article',
        status: 'published',
        category_id: categoryId
      };

      const res = await request(app)
        .post('/api/content')
        .send(contentData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/content', () => {
    it('should get all content with pagination', async () => {
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

    it('should get content by category', async () => {
      const res = await request(app)
        .get(`/api/content?category=${categoryId}&page=1&limit=10`);

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

    it('should sort content by newest', async () => {
      const res = await request(app)
        .get('/api/content?sort=newest&page=1&limit=10');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/content/:id', () => {
    it('should get content by id', async () => {
      if (!contentId) {
        // Create content first if not exists
        const contentData = {
          title: 'Test Article for Get',
          description: 'Test description',
          content: 'Test content',
          type: 'article',
          status: 'published',
          category_id: categoryId
        };

        const createRes = await request(app)
          .post('/api/content')
          .set('Authorization', `Bearer ${authToken}`)
          .send(contentData);

        contentId = createRes.body.id;
      }

      const res = await request(app)
        .get(`/api/content/${contentId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', contentId);
      expect(res.body).toHaveProperty('title');
    });

    it('should return 404 for non-existent content', async () => {
      const res = await request(app)
        .get('/api/content/00000000-0000-0000-0000-000000000000');

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/content/:id', () => {
    it('should update content', async () => {
      if (!contentId) return;

      const updateData = {
        title: 'Updated Test Article',
        description: 'Updated description',
        content: 'Updated content',
        status: 'draft'
      };

      const res = await request(app)
        .put(`/api/content/${contentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('title', updateData.title);
      expect(res.body).toHaveProperty('status', updateData.status);
    });

    it('should not update content without authentication', async () => {
      if (!contentId) return;

      const updateData = {
        title: 'Unauthorized Update'
      };

      const res = await request(app)
        .put(`/api/content/${contentId}`)
        .send(updateData);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/content/:id/like', () => {
    it('should like content', async () => {
      if (!contentId) return;

      const res = await request(app)
        .post(`/api/content/${contentId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should not like content without authentication', async () => {
      if (!contentId) return;

      const res = await request(app)
        .post(`/api/content/${contentId}/like`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/content/:id/like', () => {
    it('should unlike content', async () => {
      if (!contentId) return;

      const res = await request(app)
        .delete(`/api/content/${contentId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/content/:id/like-status', () => {
    it('should get like status', async () => {
      if (!contentId) return;

      const res = await request(app)
        .get(`/api/content/${contentId}/like-status`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('isLiked');
      expect(typeof res.body.isLiked).toBe('boolean');
    });
  });

  describe('POST /api/content/:id/view', () => {
    it('should increment view count', async () => {
      if (!contentId) return;

      const res = await request(app)
        .post(`/api/content/${contentId}/view`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: userId });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should increment view count without user', async () => {
      if (!contentId) return;

      const res = await request(app)
        .post(`/api/content/${contentId}/view`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/content/stats', () => {
    it('should get content statistics', async () => {
      const res = await request(app)
        .get('/api/content/stats');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('documents');
      expect(res.body).toHaveProperty('notes');
      expect(res.body).toHaveProperty('published');
      expect(res.body).toHaveProperty('draft');
      expect(res.body).toHaveProperty('totalViews');
    });
  });

  describe('GET /api/content/home-preview', () => {
    it('should get home preview content', async () => {
      const res = await request(app)
        .get('/api/content/home-preview');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('articles');
      expect(res.body).toHaveProperty('documents');
      expect(res.body).toHaveProperty('notes');
      expect(Array.isArray(res.body.articles)).toBe(true);
      expect(Array.isArray(res.body.documents)).toBe(true);
      expect(Array.isArray(res.body.notes)).toBe(true);
    });
  });

  describe('DELETE /api/content/:id', () => {
    it('should delete content', async () => {
      if (!contentId) return;

      const res = await request(app)
        .delete(`/api/content/${contentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should not delete content without authentication', async () => {
      const res = await request(app)
        .delete(`/api/content/${contentId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});