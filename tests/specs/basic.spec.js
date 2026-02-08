import { test, expect } from '@playwright/test';

test.describe('Bastillion Basic Functionality', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bastillion/);
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should login with default credentials', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'changeme');
    await page.click('button[type="submit"], input[type="submit"]');
    
    // Wait for redirect after login
    await page.waitForURL(/\/admin\//);
    
    // Verify we're logged in
    await expect(page.locator('text=admin')).toBeVisible({ timeout: 10000 });
  });

  test('should add SSH system', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'changeme');
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForURL(/\/admin\//);
    
    // Navigate to systems page
    await page.click('text=Systems');
    await page.waitForTimeout(1000);
    
    // Click add system button
    await page.click('text=Add System, button:has-text("Add")').catch(() => 
      page.click('a:has-text("Add")')
    );
    
    // Fill in system details
    await page.fill('input[name="displayNm"]', 'Test SSH Server');
    await page.fill('input[name="host"]', 'ssh-target');
    await page.fill('input[name="port"]', '2222');
    await page.fill('input[name="user"]', 'testuser');
    
    // Submit form
    await page.click('button:has-text("Submit"), input[value="Submit"]');
    
    // Verify system was added
    await expect(page.locator('text=Test SSH Server')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to terminal page', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'changeme');
    await page.click('button[type="submit"], input[type="submit"]');
    await page.waitForURL(/\/admin\//);
    
    // Navigate to terminals/sessions
    await page.click('text=Terminals, text=Sessions').catch(() => 
      page.click('a[href*="terminal"], a[href*="session"]')
    );
    
    // Verify terminal page loaded
    await expect(page.locator('body')).toContainText(/Terminal|Session|Connect/);
  });
});
