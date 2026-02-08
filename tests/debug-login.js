import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to login page...');
  await page.goto('http://localhost:9080/');
  await page.waitForLoadState('networkidle');
  console.log('Current URL:', page.url());
  
  console.log('Filling username...');
  await page.fill('input[name="auth.username"]', 'admin');
  
  console.log('Filling password...');
  await page.fill('input[name="auth.password"]', 'changeme');
  
  console.log('Clicking login button...');
  await page.click('#login_btn');
  
  console.log('Waiting for navigation...');
  await page.waitForTimeout(5000);
  console.log('After login URL:', page.url());
  
  // Check cookies
  const cookies = await context.cookies();
  console.log('Cookies:', cookies.map(c => c.name));
  
  // Try navigating to admin
  console.log('Trying to navigate to admin menu...');
  await page.goto('http://localhost:9080/admin/menu.html');
  await page.waitForTimeout(2000);
  console.log('Final URL:', page.url());
  
  await page.waitForTimeout(10000);
  await browser.close();
})();
