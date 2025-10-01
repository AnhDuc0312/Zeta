import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Content Management Flow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.loginAsUser();
  });

  test('@content User can view content list', async ({ page }) => {
    await page.goto('/articles');
    await helpers.expectElementVisible('[data-testid="content-list"]');
    await helpers.expectElementVisible('[data-testid="search-input"]');
    await helpers.expectElementVisible('[data-testid="filter-dropdown"]');
  });

  test('@content User can search content', async ({ page }) => {
    await page.goto('/articles');
    await helpers.searchContent('test article');
    await helpers.expectElementVisible('[data-testid="search-results"]');
  });

  test('@content User can filter content by category', async ({ page }) => {
    await page.goto('/articles');
    await page.selectOption('[data-testid="category-filter"]', 'technology');
    await page.waitForSelector('[data-testid="filtered-results"]');
  });

  test('@content User can view content detail', async ({ page }) => {
    await page.goto('/articles');
    await page.click('[data-testid="content-item"]:first-child');
    await helpers.expectElementVisible('[data-testid="content-detail"]');
    await helpers.expectElementVisible('[data-testid="content-title"]');
    await helpers.expectElementVisible('[data-testid="content-body"]');
  });

  test('@content User can create new article', async ({ page }) => {
    await helpers.createContent('article', 'Test Article', 'This is test content');
    await page.goto('/articles');
    await helpers.expectElementVisible('text=Test Article');
  });

  test('@content User can create new document', async ({ page }) => {
    await helpers.createContent('document', 'Test Document', 'This is test document content');
    await page.goto('/documents');
    await helpers.expectElementVisible('text=Test Document');
  });

  test('@content User can create new note', async ({ page }) => {
    await helpers.createContent('note', 'Test Note', 'This is test note content');
    await page.goto('/notes');
    await helpers.expectElementVisible('text=Test Note');
  });

  test('@content User can edit existing content', async ({ page }) => {
    // First create content
    const content = await helpers.createTestContent({
      title: 'Editable Article',
      content: 'Original content',
      type: 'article'
    });

    await page.goto(`/articles/${content.id}/edit`);
    await page.fill('[data-testid="title-input"]', 'Updated Article Title');
    await page.fill('[data-testid="content-textarea"]', 'Updated content');
    await helpers.submitForm();
    await helpers.expectSuccessMessage('Content updated successfully');
  });

  test('@content User can delete content', async ({ page }) => {
    const content = await helpers.createTestContent({
      title: 'Deletable Article',
      content: 'This will be deleted',
      type: 'article'
    });

    await page.goto(`/articles/${content.id}`);
    await page.click('[data-testid="delete-button"]');
    await page.click('[data-testid="confirm-delete"]');
    await helpers.expectSuccessMessage('Content deleted successfully');
  });

  test('@content User can like content', async ({ page }) => {
    const content = await helpers.createTestContent({
      title: 'Likeable Article',
      content: 'This can be liked',
      type: 'article'
    });

    await page.goto(`/articles/${content.id}`);
    await page.click('[data-testid="like-button"]');
    await helpers.expectElementVisible('[data-testid="liked-state"]');
  });

  test('@content User can bookmark content', async ({ page }) => {
    const content = await helpers.createTestContent({
      title: 'Bookmarkable Article',
      content: 'This can be bookmarked',
      type: 'article'
    });

    await page.goto(`/articles/${content.id}`);
    await page.click('[data-testid="bookmark-button"]');
    await helpers.expectElementVisible('[data-testid="bookmarked-state"]');
  });

  test('@content User can add comment', async ({ page }) => {
    const content = await helpers.createTestContent({
      title: 'Commentable Article',
      content: 'This can be commented on',
      type: 'article'
    });

    await page.goto(`/articles/${content.id}`);
    await page.fill('[data-testid="comment-input"]', 'This is a test comment');
    await page.click('[data-testid="submit-comment"]');
    await helpers.expectElementVisible('[data-testid="comment-item"]');
  });

  test('@content Content pagination works', async ({ page }) => {
    await page.goto('/articles');
    await page.click('[data-testid="next-page"]');
    await page.waitForSelector('[data-testid="content-list"]');
    await helpers.expectElementVisible('[data-testid="current-page-2"]');
  });

  test('@content Content sorting works', async ({ page }) => {
    await page.goto('/articles');
    await page.selectOption('[data-testid="sort-select"]', 'oldest');
    await page.waitForSelector('[data-testid="sorted-results"]');
  });

  test('@content File upload for documents', async ({ page }) => {
    await page.goto('/documents/new');
    await helpers.uploadFile('test-files/sample.pdf');
    await helpers.expectElementVisible('[data-testid="upload-success"]');
  });

  test('@content Content validation works', async ({ page }) => {
    await page.goto('/articles/new');
    await helpers.submitForm(); // Submit empty form
    await helpers.expectErrorMessage('Title is required');
    await helpers.expectErrorMessage('Content is required');
  });

  test('@content Content status changes work', async ({ page }) => {
    const content = await helpers.createTestContent({
      title: 'Status Test Article',
      content: 'Testing status changes',
      type: 'article',
      status: 'draft'
    });

    await page.goto(`/articles/${content.id}/edit`);
    await page.selectOption('[data-testid="status-select"]', 'published');
    await helpers.submitForm();
    await helpers.expectSuccessMessage('Content published successfully');
  });
});

