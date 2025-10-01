import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Performance Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('@performance Home page loads within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });

  test('@performance Articles page loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/articles');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('@performance Search results load within 1 second', async ({ page }) => {
    await page.goto('/articles');
    
    const startTime = Date.now();
    await helpers.searchContent('test');
    const searchTime = Date.now() - startTime;
    
    expect(searchTime).toBeLessThan(1000);
  });

  test('@performance API responses are fast', async ({ page }) => {
    const endpoints = [
      '/api/health',
      '/api/content',
      '/api/categories',
      '/api/tags'
    ];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      const response = await page.request.get(endpoint);
      const responseTime = Date.now() - startTime;
      
      expect(response.status()).toBe(200);
      expect(responseTime).toBeLessThan(1000);
    }
  });

  test('@performance Large content list pagination', async ({ page }) => {
    await page.goto('/articles');
    
    // Test pagination performance
    const startTime = Date.now();
    await page.click('[data-testid="next-page"]');
    await page.waitForLoadState('networkidle');
    const paginationTime = Date.now() - startTime;
    
    expect(paginationTime).toBeLessThan(2000);
  });

  test('@performance Image loading optimization', async ({ page }) => {
    await page.goto('/articles');
    
    // Check if images are lazy loaded
    const images = page.locator('img');
    const firstImage = images.first();
    
    // Scroll to trigger lazy loading
    await firstImage.scrollIntoViewIfNeeded();
    await firstImage.waitFor({ state: 'visible' });
    
    // Check if image has proper loading attributes
    const loading = await firstImage.getAttribute('loading');
    expect(loading).toBe('lazy');
  });

  test('@performance Memory usage stays reasonable', async ({ page }) => {
    await page.goto('/');
    
    // Navigate through multiple pages
    const pages = ['/articles', '/documents', '/notes', '/search'];
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
    }
    
    // Check memory usage
    const metrics = await page.evaluate(() => {
      return {
        usedJSHeapSize: (performance as any).memory?.usedJSHeapSize || 0,
        totalJSHeapSize: (performance as any).memory?.totalJSHeapSize || 0
      };
    });
    
    // Memory usage should be reasonable (less than 50MB)
    expect(metrics.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
  });

  test('@performance Concurrent user simulation', async ({ browser }) => {
    // Simulate multiple users accessing the site
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);
    
    const pages = await Promise.all(contexts.map(context => context.newPage()));
    
    const startTime = Date.now();
    
    // All users navigate to different pages simultaneously
    await Promise.all([
      pages[0].goto('/articles'),
      pages[1].goto('/documents'),
      pages[2].goto('/notes')
    ]);
    
    await Promise.all(pages.map(page => page.waitForLoadState('networkidle')));
    
    const concurrentTime = Date.now() - startTime;
    
    // Should handle concurrent users efficiently
    expect(concurrentTime).toBeLessThan(5000);
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });

  test('@performance Database query performance', async ({ page }) => {
    // Test database performance through API calls
    const queries = [
      '/api/content?limit=100',
      '/api/content?search=test',
      '/api/content?category=technology',
      '/api/users?limit=50'
    ];

    for (const query of queries) {
      const startTime = Date.now();
      const response = await page.request.get(query);
      const queryTime = Date.now() - startTime;
      
      expect(response.status()).toBe(200);
      expect(queryTime).toBeLessThan(2000);
    }
  });

  test('@performance File upload performance', async ({ page }) => {
    await helpers.loginAsUser();
    await page.goto('/documents/new');
    
    // Create a test file
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    const startTime = Date.now();
    await helpers.uploadFile('test-files/sample.pdf');
    const uploadTime = Date.now() - startTime;
    
    expect(uploadTime).toBeLessThan(5000);
  });

  test('@performance Form submission performance', async ({ page }) => {
    await helpers.loginAsUser();
    await page.goto('/articles/new');
    
    const startTime = Date.now();
    await helpers.createContent('article', 'Performance Test Article', 'Test content');
    const formTime = Date.now() - startTime;
    
    expect(formTime).toBeLessThan(3000);
  });

  test('@performance Lighthouse audit', async ({ page }) => {
    await page.goto('/');
    
    // Run basic performance checks
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
      };
    });
    
    expect(performanceMetrics.loadTime).toBeLessThan(3000);
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
    expect(performanceMetrics.firstPaint).toBeLessThan(1500);
  });
});

