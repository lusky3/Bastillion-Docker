import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:9080/');
  await page.fill('input[name="auth.username"]', 'admin');
  await page.fill('input[name="auth.password"]', 'changeme');
  await page.click('#login_btn');
  await page.waitForTimeout(3000);
  
  const cookies = await context.cookies();
  console.log('Cookies after login:');
  cookies.forEach(c => {
    console.log(`  ${c.name}:`);
    console.log(`    value: ${c.value.substring(0, 20)}...`);
    console.log(`    domain: ${c.domain}`);
    console.log(`    path: ${c.path}`);
    console.log(`    httpOnly: ${c.httpOnly}`);
    console.log(`    secure: ${c.secure}`);
    console.log(`    sameSite: ${c.sameSite}`);
  });
  
  await browser.close();
})();
