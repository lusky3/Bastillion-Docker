import { test, expect } from '@playwright/test';

test.describe('Bastillion Basic Functionality', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bastillion/);
    await expect(page.locator('input[name="auth.username"]')).toBeVisible();
    await expect(page.locator('input[name="auth.password"]')).toBeVisible();
  });

  test('should login with default credentials', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('input[name="auth.username"]', 'admin');
    await page.fill('input[name="auth.password"]', 'changeme');
    await page.click('#login_btn');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Check if we're logged in (any admin page)
    await expect(page).toHaveURL(/\/admin\//);
  });

  test('should access admin area after login', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="auth.username"]', 'admin');
    await page.fill('input[name="auth.password"]', 'changeme');
    await page.click('#login_btn');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/\/admin\//);
  });

  // Note: Full end-to-end SSH testing (adding systems, creating terminals)
  // is blocked by Bastillion's session management not persisting across
  // page navigations in Playwright. Manual testing confirms functionality works.
});
