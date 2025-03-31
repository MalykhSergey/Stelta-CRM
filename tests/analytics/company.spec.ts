import { expect, test } from "../login-fixture";

test('По организациям', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/analytics/company');
    await page.getByLabel('Организация:').selectOption('51|||АО «Блохина Нестеров»');
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Показывать подыгрыш:').check();
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Цена:').check();
    await expect(page).toHaveScreenshot();
    await page.getByLabel('Показывать подыгрыш:').uncheck();
    await expect(page).toHaveScreenshot();
});