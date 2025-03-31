import { expect, test } from "../login-fixture";

test('По дате', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/analytics/date');
    await page.getByLabel('От:').fill('2025-01-10');
    await page.getByLabel('До:').fill('2025-07-08');
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Показывать подыгрыш:').check();
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Цена:').check();
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Показывать подыгрыш:').uncheck();
    await expect(page).toHaveScreenshot();
});