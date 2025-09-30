import { Pool } from 'pg';
import './types.d';

// Mock database connection for tests
const mockPool = {
  query: jest.fn(),
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
