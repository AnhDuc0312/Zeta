import { Pool } from 'pg';

// Global setup for all tests
export default async function globalSetup() {
  console.log('🚀 Setting up global test environment...');
  
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.UPLOAD_DIR = '/tmp/test-uploads';
  process.env.MAX_FILE_SIZE = '5242880'; // 5MB
  process.env.ALLOWED_FILE_TYPES = 'image/jpeg,image/png,image/webp';
  
  // Skip database setup for now since we're using mocks
  console.log('⚠️  Skipping database setup - using mocks for testing');
  
  console.log('✅ Global test setup complete');
}
