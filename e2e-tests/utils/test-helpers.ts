import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  // Authentication helpers
  async loginAsUser(email: string = 'user@example.com', password: string = 'password123') {
    await this.page.goto('/login');
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
    await this.page.waitForURL('/dashboard');
  }

  async loginAsAdmin() {
    await this.loginAsUser('admin@example.com', 'admin123');
  }

  async logout() {
    await this.page.click('[data-testid="user-menu"]');
    await this.page.click('[data-testid="logout-button"]');
    await this.page.waitForURL('/login');
  }

  // Content management helpers
  async createContent(type: 'article' | 'document' | 'note', title: string, content: string) {
    await this.page.goto(`/admin/content/new?type=${type}`);
    await this.page.fill('[data-testid="title-input"]', title);
    await this.page.fill('[data-testid="content-textarea"]', content);
    await this.page.click('[data-testid="save-button"]');
    await this.page.waitForSelector('[data-testid="success-message"]');
  }

  async searchContent(query: string) {
    await this.page.fill('[data-testid="search-input"]', query);
    await this.page.press('[data-testid="search-input"]', 'Enter');
    await this.page.waitForSelector('[data-testid="search-results"]');
  }

  async uploadFile(filePath: string) {
    const fileInput = this.page.locator('[data-testid="file-input"]');
    await fileInput.setInputFiles(filePath);
    await this.page.waitForSelector('[data-testid="upload-success"]');
  }

  // Navigation helpers
  async navigateToPage(page: string) {
    await this.page.goto(page);
    await this.page.waitForLoadState('networkidle');
  }

  async clickAndWaitForNavigation(selector: string, expectedUrl?: string) {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(selector)
    ]);
    if (expectedUrl) {
      await this.page.waitForURL(expectedUrl);
    }
  }

  // Form helpers
  async fillForm(formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      await this.page.fill(`[data-testid="${field}"]`, value);
    }
  }

  async submitForm(formSelector: string = 'form') {
    await this.page.click(`${formSelector} [data-testid="submit-button"]`);
  }

  // Assertion helpers
  async expectSuccessMessage(message?: string) {
    const successElement = this.page.locator('[data-testid="success-message"]');
    await expect(successElement).toBeVisible();
    if (message) {
      await expect(successElement).toContainText(message);
    }
  }

  async expectErrorMessage(message?: string) {
    const errorElement = this.page.locator('[data-testid="error-message"]');
    await expect(errorElement).toBeVisible();
    if (message) {
      await expect(errorElement).toContainText(message);
    }
  }

  async expectPageTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  async expectElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectElementHidden(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  // API helpers
  async mockApiResponse(endpoint: string, response: any, status: number = 200) {
    await this.page.route(`**/api${endpoint}`, async route => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  async waitForApiCall(endpoint: string) {
    await this.page.waitForResponse(`**/api${endpoint}`);
  }

  // Database helpers (for test data setup)
  async createTestUser(userData: any) {
    const response = await this.page.request.post('/api/auth/register', {
      data: userData
    });
    return response.json();
  }

  async createTestContent(contentData: any) {
    const response = await this.page.request.post('/api/content', {
      data: contentData
    });
    return response.json();
  }

  // Cleanup helpers
  async cleanupTestData() {
    // Clean up test data after each test
    await this.page.request.delete('/api/test/cleanup');
  }

  // Performance helpers
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.page.waitForLoadState('networkidle');
    return Date.now() - startTime;
  }

  async checkLighthouseScore() {
    // This would integrate with Lighthouse for performance testing
    const performanceMetrics = await this.page.evaluate(() => {
      return {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
      };
    });
    return performanceMetrics;
  }
}

