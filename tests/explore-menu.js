import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:9080/');
  await page.fill('input[name="auth.username"]', 'admin');
  await page.fill('input[name="auth.password"]', 'changeme');
  await page.click('#login_btn');
  await page.waitForLoadState('networkidle');
  
  console.log('Clicking Manage dropdown...');
  await page.click('a:has-text("Manage")');
  await page.waitForTimeout(500);
  
  console.log('\n=== Links after clicking Manage ===');
  const links = await page.locator('a:visible').all();
  for (const link of links) {
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    if (text?.trim()) {
      console.log(`"${text.trim()}" -> ${href}`);
    }
  }
  
  await browser.close();
})();
