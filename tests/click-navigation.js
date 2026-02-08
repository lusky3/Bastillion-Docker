import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login
  await page.goto('http://localhost:9080/');
  await page.fill('input[name="auth.username"]', 'admin');
  await page.fill('input[name="auth.password"]', 'changeme');
  await page.click('#login_btn');
  await page.waitForLoadState('networkidle');
  
  // Handle password change
  if (page.url().includes('userSettings')) {
    await page.fill('input[name="auth.prevPassword"]', 'changeme');
    await page.fill('input[name="auth.password"]', 'Admin123!@#');
    await page.fill('input[name="auth.passwordConfirm"]', 'Admin123!@#');
    await page.click('.submit_btn');
    await page.waitForLoadState('networkidle');
    console.log('After password change:', page.url());
  }
  
  // Now click on Systems link instead of goto
  console.log('Looking for Systems link...');
  const links = await page.locator('a').all();
  for (const link of links) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    if (text && text.includes('System')) {
      console.log(`Found link: "${text}" -> ${href}`);
    }
  }
  
  // Try clicking Systems link
  await page.click('a:has-text("Systems")').catch(() => console.log('No Systems link found'));
  await page.waitForLoadState('networkidle');
  console.log('After clicking Systems:', page.url());
  
  await browser.close();
})();
