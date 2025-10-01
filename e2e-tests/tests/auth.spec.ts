import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Authentication Flow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('@auth User can register new account', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await helpers.fillForm({
      'name-input': 'Test User',
      'email-input': 'testuser@example.com',
      'password-input': 'password123',
      'confirm-password-input': 'password123'
    });
    
    await helpers.submitForm();
    await helpers.expectSuccessMessage('Account created successfully');
    await page.waitForURL('/login');
  });

  test('@auth User can login with valid credentials', async ({ page }) => {
    await helpers.loginAsUser('testuser@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');
    await helpers.expectElementVisible('[data-testid="user-menu"]');
  });

  test('@auth User cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await helpers.fillForm({
      'email-input': 'testuser@example.com',
      'password-input': 'wrongpassword'
    });
    await helpers.submitForm();
    await helpers.expectErrorMessage('Invalid credentials');
  });

  test('@auth User can logout successfully', async ({ page }) => {
    await helpers.loginAsUser();
    await helpers.logout();
    await expect(page).toHaveURL('/login');
  });

  test('@auth Protected routes redirect to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('@auth Admin can access admin routes', async ({ page }) => {
    await helpers.loginAsAdmin();
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL('/admin/dashboard');
    await helpers.expectElementVisible('[data-testid="admin-panel"]');
  });

  test('@auth Regular user cannot access admin routes', async ({ page }) => {
    await helpers.loginAsUser();
    await page.goto('/admin/dashboard');
    await helpers.expectErrorMessage('Access denied');
  });

  test('@auth Password change functionality', async ({ page }) => {
    await helpers.loginAsUser();
    await page.goto('/account/settings');
    
    await helpers.fillForm({
      'current-password-input': 'password123',
      'new-password-input': 'newpassword123',
      'confirm-new-password-input': 'newpassword123'
    });
    
    await helpers.submitForm();
    await helpers.expectSuccessMessage('Password changed successfully');
  });

  test('@auth Session persistence across page reloads', async ({ page }) => {
    await helpers.loginAsUser();
    await page.reload();
    await expect(page).toHaveURL('/dashboard');
    await helpers.expectElementVisible('[data-testid="user-menu"]');
  });

  test('@auth Token expiration handling', async ({ page }) => {
    // Mock token expiration
    await helpers.mockApiResponse('/auth/profile', { error: 'Token expired' }, 401);
    
    await helpers.loginAsUser();
    await page.goto('/dashboard');
    
    // Should redirect to login on token expiration
    await expect(page).toHaveURL('/login');
    await helpers.expectErrorMessage('Session expired');
  });
});

