import { test as base } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

// Extend base test with custom fixtures
export const test = base.extend<{
  helpers: TestHelpers;
}>({
  helpers: async ({ page }, use) => {
    const helpers = new TestHelpers(page);
    await use(helpers);
  },
});

export { expect } from '@playwright/test';

// Global setup
test.beforeAll(async () => {
  console.log('🚀 Starting E2E test suite...');
});

// Global teardown
test.afterAll(async () => {
  console.log('✅ E2E test suite completed');
});

// Setup for each test
test.beforeEach(async ({ page }) => {
  // Set default timeout
  test.setTimeout(30000);
  
  // Set viewport
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // Enable request/response logging in debug mode
  if (process.env.DEBUG) {
    page.on('request', request => {
      console.log(`→ ${request.method()} ${request.url()}`);
    });
    
    page.on('response', response => {
      console.log(`← ${response.status()} ${response.url()}`);
    });
  }
});

// Cleanup after each test
test.afterEach(async ({ page }) => {
  // Clear all cookies and local storage
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

