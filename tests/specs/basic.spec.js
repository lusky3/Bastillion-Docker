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
    await page.waitForLoadState('networkidle');
    
    // Should be on userSettings or menu page
    await expect(page).toHaveURL(/\/admin\//);
  });

  test('should navigate to systems page', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="auth.username"]', 'admin');
    await page.fill('input[name="auth.password"]', 'changeme');
    await page.click('#login_btn');
    await page.waitForLoadState('networkidle');
    
    // Open Manage dropdown and click Systems
    await page.click('a:has-text("Manage")');
    await page.click('a:has-text("Systems")');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on systems page
    await expect(page).toHaveURL(/viewSystems/);
    await expect(page.locator('body')).toContainText(/Systems|Add/);
  });

  test('should navigate to terminals page', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="auth.username"]', 'admin');
    await page.fill('input[name="auth.password"]', 'changeme');
    await page.click('#login_btn');
    await page.waitForLoadState('networkidle');
    
    // Open Secure Shell dropdown and click Terminals
    await page.click('a:has-text("Secure")');
    await page.click('a:has-text("Terminals")');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on terminals/sessions page
    await expect(page).toHaveURL(/createTerms|viewSystems/);
  });
});
