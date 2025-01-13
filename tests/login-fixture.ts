import { test as base } from '@playwright/test';
export { expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('http://127.0.0.1:3000/login');
    await page.fill('input[name="name"]', '123');
    await page.fill('input[name="password"]', '123');
    await page.click('button:has-text("Войти")');
    await page.waitForURL('http://127.0.0.1:3000/');
    await use(page);
  },
});