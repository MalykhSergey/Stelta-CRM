import { expect, test } from "../login-fixture";


test('Обшая аналитика', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/analytics/common');
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Показывать подыгрыш:').uncheck();
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Цена:').check();
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Показывать подыгрыш:').check();
    await expect(page).toHaveScreenshot();
});