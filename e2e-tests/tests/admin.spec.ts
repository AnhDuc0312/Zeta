import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Admin Panel Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.loginAsAdmin();
  });

  test('@admin Admin can access dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await helpers.expectElementVisible('[data-testid="admin-dashboard"]');
    await helpers.expectElementVisible('[data-testid="stats-cards"]');
    await helpers.expectElementVisible('[data-testid="recent-activity"]');
  });

  test('@admin Admin can manage users', async ({ page }) => {
    await page.goto('/admin/users');
    await helpers.expectElementVisible('[data-testid="users-table"]');
    await helpers.expectElementVisible('[data-testid="add-user-button"]');
    
    // Test user creation
    await page.click('[data-testid="add-user-button"]');
    await helpers.fillForm({
      'name-input': 'Admin Created User',
      'email-input': 'admincreated@example.com',
      'password-input': 'password123',
      'role-select': 'user'
    });
    await helpers.submitForm();
    await helpers.expectSuccessMessage('User created successfully');
  });

  test('@admin Admin can edit user roles', async ({ page }) => {
    await page.goto('/admin/users');
    await page.click('[data-testid="user-row"]:first-child [data-testid="edit-button"]');
    
    await page.selectOption('[data-testid="role-select"]', 'moderator');
    await helpers.submitForm();
    await helpers.expectSuccessMessage('User updated successfully');
  });

  test('@admin Admin can delete users', async ({ page }) => {
    await page.goto('/admin/users');
    await page.click('[data-testid="user-row"]:first-child [data-testid="delete-button"]');
    await page.click('[data-testid="confirm-delete"]');
    await helpers.expectSuccessMessage('User deleted successfully');
  });

  test('@admin Admin can manage content', async ({ page }) => {
    await page.goto('/admin/content');
    await helpers.expectElementVisible('[data-testid="content-table"]');
    await helpers.expectElementVisible('[data-testid="content-filters"]');
    
    // Test content approval
    await page.click('[data-testid="content-row"]:first-child [data-testid="approve-button"]');
    await helpers.expectSuccessMessage('Content approved successfully');
  });

  test('@admin Admin can view analytics', async ({ page }) => {
    await page.goto('/admin/analytics');
    await helpers.expectElementVisible('[data-testid="analytics-dashboard"]');
    await helpers.expectElementVisible('[data-testid="charts-container"]');
    await helpers.expectElementVisible('[data-testid="metrics-grid"]');
  });

  test('@admin Admin can view activity logs', async ({ page }) => {
    await page.goto('/admin/activity-logs');
    await helpers.expectElementVisible('[data-testid="activity-logs-table"]');
    await helpers.expectElementVisible('[data-testid="log-filters"]');
    
    // Test filtering logs
    await page.selectOption('[data-testid="action-filter"]', 'login');
    await page.waitForSelector('[data-testid="filtered-logs"]');
  });

  test('@admin Admin can manage categories', async ({ page }) => {
    await page.goto('/admin/categories');
    await helpers.expectElementVisible('[data-testid="categories-table"]');
    
    // Test category creation
    await page.click('[data-testid="add-category-button"]');
    await helpers.fillForm({
      'name-input': 'Test Category',
      'description-input': 'Test category description'
    });
    await helpers.submitForm();
    await helpers.expectSuccessMessage('Category created successfully');
  });

  test('@admin Admin can manage tags', async ({ page }) => {
    await page.goto('/admin/tags');
    await helpers.expectElementVisible('[data-testid="tags-table"]');
    
    // Test tag creation
    await page.click('[data-testid="add-tag-button"]');
    await helpers.fillForm({
      'name-input': 'test-tag'
    });
    await helpers.submitForm();
    await helpers.expectSuccessMessage('Tag created successfully');
  });

  test('@admin Admin can manage system settings', async ({ page }) => {
    await page.goto('/admin/settings');
    await helpers.expectElementVisible('[data-testid="settings-form"]');
    
    // Test updating settings
    await page.fill('[data-testid="site-name-input"]', 'Updated Site Name');
    await page.fill('[data-testid="site-description-input"]', 'Updated site description');
    await helpers.submitForm();
    await helpers.expectSuccessMessage('Settings updated successfully');
  });

  test('@admin Admin can view system health', async ({ page }) => {
    await page.goto('/admin/health');
    await helpers.expectElementVisible('[data-testid="health-status"]');
    await helpers.expectElementVisible('[data-testid="database-status"]');
    await helpers.expectElementVisible('[data-testid="storage-status"]');
  });

  test('@admin Admin can export data', async ({ page }) => {
    await page.goto('/admin/export');
    await helpers.expectElementVisible('[data-testid="export-options"]');
    
    // Test content export
    await page.check('[data-testid="export-content"]');
    await page.click('[data-testid="export-button"]');
    await helpers.expectElementVisible('[data-testid="export-success"]');
  });

  test('@admin Admin can backup database', async ({ page }) => {
    await page.goto('/admin/backup');
    await helpers.expectElementVisible('[data-testid="backup-options"]');
    
    await page.click('[data-testid="create-backup-button"]');
    await helpers.expectSuccessMessage('Backup created successfully');
  });

  test('@admin Admin can view error logs', async ({ page }) => {
    await page.goto('/admin/errors');
    await helpers.expectElementVisible('[data-testid="error-logs-table"]');
    await helpers.expectElementVisible('[data-testid="error-filters"]');
  });

  test('@admin Admin can manage file uploads', async ({ page }) => {
    await page.goto('/admin/uploads');
    await helpers.expectElementVisible('[data-testid="uploads-table"]');
    await helpers.expectElementVisible('[data-testid="upload-stats"]');
    
    // Test file deletion
    await page.click('[data-testid="file-row"]:first-child [data-testid="delete-button"]');
    await page.click('[data-testid="confirm-delete"]');
    await helpers.expectSuccessMessage('File deleted successfully');
  });

  test('@admin Admin can view user statistics', async ({ page }) => {
    await page.goto('/admin/users/stats');
    await helpers.expectElementVisible('[data-testid="user-stats-chart"]');
    await helpers.expectElementVisible('[data-testid="user-metrics"]');
  });

  test('@admin Admin can moderate comments', async ({ page }) => {
    await page.goto('/admin/comments');
    await helpers.expectElementVisible('[data-testid="comments-table"]');
    
    // Test comment moderation
    await page.click('[data-testid="comment-row"]:first-child [data-testid="approve-button"]');
    await helpers.expectSuccessMessage('Comment approved successfully');
  });

  test('@admin Admin can view content statistics', async ({ page }) => {
    await page.goto('/admin/content/stats');
    await helpers.expectElementVisible('[data-testid="content-stats-chart"]');
    await helpers.expectElementVisible('[data-testid="content-metrics"]');
  });
});

