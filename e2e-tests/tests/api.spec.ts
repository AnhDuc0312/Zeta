import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('API Integration Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('@api Health check endpoint', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('timestamp');
  });

  test('@api Authentication endpoints', async ({ page }) => {
    // Test login endpoint
    const loginResponse = await page.request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    if (loginResponse.status() === 200) {
      const loginData = await loginResponse.json();
      expect(loginData).toHaveProperty('user');
      expect(loginData).toHaveProperty('token');
    }

    // Test register endpoint
    const registerResponse = await page.request.post('/api/auth/register', {
      data: {
        name: 'API Test User',
        email: 'apitest@example.com',
        password: 'password123'
      }
    });
    
    expect(registerResponse.status()).toBe(201);
    const registerData = await registerResponse.json();
    expect(registerData).toHaveProperty('user');
  });

  test('@api Content CRUD operations', async ({ page }) => {
    // Create content
    const createResponse = await page.request.post('/api/content', {
      data: {
        title: 'API Test Article',
        content: 'This is test content',
        type: 'article',
        status: 'draft'
      }
    });
    
    expect(createResponse.status()).toBe(201);
    const createdContent = await createResponse.json();
    expect(createdContent).toHaveProperty('id');
    expect(createdContent.title).toBe('API Test Article');

    // Read content
    const readResponse = await page.request.get(`/api/content/${createdContent.id}`);
    expect(readResponse.status()).toBe(200);
    const readContent = await readResponse.json();
    expect(readContent.title).toBe('API Test Article');

    // Update content
    const updateResponse = await page.request.put(`/api/content/${createdContent.id}`, {
      data: {
        title: 'Updated API Test Article',
        content: 'Updated content'
      }
    });
    
    expect(updateResponse.status()).toBe(200);
    const updatedContent = await updateResponse.json();
    expect(updatedContent.title).toBe('Updated API Test Article');

    // Delete content
    const deleteResponse = await page.request.delete(`/api/content/${createdContent.id}`);
    expect(deleteResponse.status()).toBe(204);
  });

  test('@api Search functionality', async ({ page }) => {
    const searchResponse = await page.request.get('/api/search?q=test');
    expect(searchResponse.status()).toBe(200);
    
    const searchData = await searchResponse.json();
    expect(Array.isArray(searchData)).toBe(true);
  });

  test('@api Categories and Tags', async ({ page }) => {
    // Test categories endpoint
    const categoriesResponse = await page.request.get('/api/categories');
    expect(categoriesResponse.status()).toBe(200);
    
    const categories = await categoriesResponse.json();
    expect(Array.isArray(categories)).toBe(true);

    // Test tags endpoint
    const tagsResponse = await page.request.get('/api/tags');
    expect(tagsResponse.status()).toBe(200);
    
    const tags = await tagsResponse.json();
    expect(Array.isArray(tags)).toBe(true);
  });

  test('@api Comments system', async ({ page }) => {
    // First create content
    const contentResponse = await page.request.post('/api/content', {
      data: {
        title: 'Comment Test Article',
        content: 'This article can be commented on',
        type: 'article'
      }
    });
    
    const content = await contentResponse.json();

    // Add comment
    const commentResponse = await page.request.post('/api/comments', {
      data: {
        content_id: content.id,
        text: 'This is a test comment'
      }
    });
    
    expect(commentResponse.status()).toBe(201);
    const comment = await commentResponse.json();
    expect(comment.text).toBe('This is a test comment');

    // Get comments for content
    const commentsResponse = await page.request.get(`/api/comments?content_id=${content.id}`);
    expect(commentsResponse.status()).toBe(200);
    
    const comments = await commentsResponse.json();
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.length).toBeGreaterThan(0);
  });

  test('@api File upload', async ({ page }) => {
    // Create a test file
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', testFile);

    const uploadResponse = await page.request.post('/api/upload', {
      multipart: formData
    });
    
    expect(uploadResponse.status()).toBe(200);
    const uploadData = await uploadResponse.json();
    expect(uploadData).toHaveProperty('filename');
    expect(uploadData).toHaveProperty('url');
  });

  test('@api User management', async ({ page }) => {
    // Get users list
    const usersResponse = await page.request.get('/api/users');
    expect(usersResponse.status()).toBe(200);
    
    const users = await usersResponse.json();
    expect(Array.isArray(users)).toBe(true);

    // Get user profile
    const profileResponse = await page.request.get('/api/users/profile');
    expect(profileResponse.status()).toBe(200);
    
    const profile = await profileResponse.json();
    expect(profile).toHaveProperty('id');
    expect(profile).toHaveProperty('email');
  });

  test('@api Analytics endpoints', async ({ page }) => {
    // Create analytics event
    const analyticsResponse = await page.request.post('/api/analytics-events', {
      data: {
        event_type: 'page_view',
        content_id: 'test-content-id',
        meta: { page: '/test' }
      }
    });
    
    expect(analyticsResponse.status()).toBe(201);

    // Get analytics events
    const eventsResponse = await page.request.get('/api/analytics-events');
    expect(eventsResponse.status()).toBe(200);
    
    const events = await eventsResponse.json();
    expect(Array.isArray(events)).toBe(true);
  });

  test('@api Error handling', async ({ page }) => {
    // Test 404 error
    const notFoundResponse = await page.request.get('/api/content/non-existent-id');
    expect(notFoundResponse.status()).toBe(404);

    // Test 400 error (validation)
    const badRequestResponse = await page.request.post('/api/content', {
      data: {
        // Missing required fields
        type: 'article'
      }
    });
    
    expect(badRequestResponse.status()).toBe(400);

    // Test 401 error (unauthorized)
    const unauthorizedResponse = await page.request.get('/api/users/profile');
    expect(unauthorizedResponse.status()).toBe(401);
  });

  test('@api Rate limiting', async ({ page }) => {
    // Make multiple requests to test rate limiting
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(page.request.get('/api/health'));
    }
    
    const responses = await Promise.all(requests);
    
    // All requests should succeed (rate limit is high for health endpoint)
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });

  test('@api Response time performance', async ({ page }) => {
    const startTime = Date.now();
    const response = await page.request.get('/api/content');
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    expect(endTime - startTime).toBeLessThan(2000); // Should respond within 2 seconds
  });
});

