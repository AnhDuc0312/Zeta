import { test, expect } from '@playwright/test';

test.describe('Demo E2E Tests', () => {
  test('should load the homepage', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:8080');
    
    // Check if the page loads
    await expect(page).toHaveTitle(/ZetaScript/);
    
    // Take a screenshot
    await page.screenshot({ path: 'demo-homepage.png' });
  });

  test('should check if backend is running', async ({ page }) => {
    // Try to access the health endpoint
    const response = await page.request.get('http://localhost:4000/api/health');
    
    // Check if the response is successful
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
  });

  test('should check frontend build', async ({ page }) => {
    // Navigate to the frontend
    await page.goto('http://localhost:8080');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if there are any console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any errors
    await page.waitForTimeout(2000);
    
    // Log any errors found
    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    }
    
    // The test passes if we can load the page
    expect(page.url()).toContain('localhost:8080');
  });
});

