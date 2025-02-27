import { expect, test } from "../login-fixture";
test('Присутствует кнопка добавления и форма фильтра', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000")
    await expect(page.getByRole('button', { name: 'Добавить тендер' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Полное наименование:' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Организация:' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Реестровый номер:' })).toBeVisible();
});
