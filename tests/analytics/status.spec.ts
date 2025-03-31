import { expect, test } from "../login-fixture";

test('По статусу', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/analytics/status');
    await page.getByLabel('Статус:').selectOption('4');
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Цена:').check();
    await expect(page).toHaveScreenshot();
});