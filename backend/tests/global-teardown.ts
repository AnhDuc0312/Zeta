import fs from 'fs';
import path from 'path';

// Global teardown for all tests
export default async function globalTeardown() {
  console.log('🧹 Cleaning up global test environment...');
  
  try {
    // Clean up test uploads directory
    const uploadDir = process.env.UPLOAD_DIR || '/tmp/test-uploads';
    if (fs.existsSync(uploadDir)) {
      console.log('🗑️  Cleaning up test uploads directory...');
      fs.rmSync(uploadDir, { recursive: true, force: true });
    }
    
    // Clean up any other test artifacts
    const testDirs = [
      '/tmp/test-coverage',
      '/tmp/test-logs',
      '/tmp/test-temp'
    ];
    
    testDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
    
    console.log('✅ Global test cleanup complete');
  } catch (error) {
    console.warn('⚠️  Error during cleanup:', error instanceof Error ? error.message : String(error));
  }
}
