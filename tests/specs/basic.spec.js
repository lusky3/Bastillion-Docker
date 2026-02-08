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
    // Login first
    await page.goto('/');
    await page.fill('input[name="auth.username"]', 'admin');
    await page.fill('input[name="auth.password"]', 'changeme');
    await page.click('#login_btn');
    await page.waitForLoadState('networkidle');
    
    // Verify we're in admin area
    await expect(page).toHaveURL(/\/admin\//);
    await expect(page.locator('body')).toContainText(/Bastillion|Systems|Users|Profile/);
  });

  // Note: SSH system management and terminal connection tests require
  // completing the first-time admin password change flow, which varies
  // based on Bastillion configuration. Manual testing recommended for
  // full end-to-end SSH functionality validation.
});
