import { Pool } from 'pg';
import './types.d';

// Mock database connection for tests
const mockPool = {
  query: jest.fn().mockImplementation((query, params) => {
    // Return mock data based on query
    if (query.includes('SELECT * FROM users')) {
      return Promise.resolve({
        rows: [
          {
            id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashed-password',
            role: 'user',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });
    }
    if (query.includes('SELECT COUNT(*) FROM users')) {
      return Promise.resolve({
        rows: [{ count: '1' }]
      });
    }
    if (query.includes('SELECT * FROM content')) {
      return Promise.resolve({
        rows: [
          {
            id: 'test-content-id',
            title: 'Test Content',
            content: 'Test content body',
            type: 'article',
            status: 'published',
            author_id: 'test-user-id',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });
    }
    if (query.includes('SELECT * FROM categories')) {
      return Promise.resolve({
        rows: [
          {
            id: 'test-category-id',
            name: 'Test Category',
            description: 'Test category description',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });
    }
    if (query.includes('SELECT * FROM tags')) {
      return Promise.resolve({
        rows: [
          {
            id: 'test-tag-id',
            name: 'test-tag',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]
      });
    }
    if (query.includes('SELECT * FROM activity_logs')) {
      return Promise.resolve({
        rows: [
          {
            id: 'test-log-id',
            user_id: 'test-user-id',
            action: 'login',
            details: 'User logged in',
            created_at: new Date()
          }
        ]
      });
    }
    if (query.includes('SELECT * FROM analytics_events')) {
      return Promise.resolve({
        rows: [
          {
            id: 'test-event-id',
            event_type: 'page_view',
            content_id: 'test-content-id',
            user_id: 'test-user-id',
            meta: {},
            created_at: new Date()
          }
        ]
      });
    }
    // Default mock response
    return Promise.resolve({ rows: [] });
  }),
  connect: jest.fn(),
  end: jest.fn(),
  on: jest.fn(),
};

// Mock the database module
jest.mock('../src/db', () => ({
  default: mockPool,
}));

// Mock image service to avoid import.meta.url issues
jest.mock('../src/services/imageService', () => ({
  ImageService: {
    uploadImage: jest.fn().mockResolvedValue({
      success: true,
      filename: 'test-image.jpg',
      url: '/uploads/test-image.jpg',
      metadata: {
        width: 800,
        height: 600,
        size: 1000,
        format: 'jpeg'
      }
    }),
    deleteImage: jest.fn().mockResolvedValue(true),
    resizeImage: jest.fn().mockResolvedValue(Buffer.from('resized image')),
    generateThumbnail: jest.fn().mockResolvedValue(Buffer.from('thumbnail'))
  }
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Global test utilities
global.mockPool = mockPool;

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(async () => {
  if (mockPool.end) {
    await mockPool.end();
  }
});
