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
  console.log('After login:', page.url());
  
  // Handle password change
  if (page.url().includes('userSettings')) {
    console.log('On password change page, filling form...');
    await page.fill('input[name="auth.prevPassword"]', 'changeme');
    await page.fill('input[name="auth.password"]', 'Admin123!@#');
    await page.fill('input[name="auth.passwordConfirm"]', 'Admin123!@#');
    await page.click('.submit_btn');
    await page.waitForLoadState('networkidle');
    console.log('After password change:', page.url());
  }
  
  // Now try to access systems page
  await page.goto('http://localhost:9080/admin/viewSystems.ktrl');
  await page.waitForLoadState('networkidle');
  console.log('Systems page:', page.url());
  
  if (page.url().includes('viewSystems')) {
    console.log('SUCCESS! Can access systems page');
  } else {
    console.log('FAILED - redirected to:', page.url());
  }
  
  await browser.close();
})();
