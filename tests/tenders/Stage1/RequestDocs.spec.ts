import { expect, test } from "../../login-fixture";
import check_file_form from "../check_file_form";
import save from "../save";

// Проверяем создание, работу формы файлов, сохранение даты, удаление.
test('Проверить дозапросы документов', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/21")
    await page.getByRole('button', { name: 'Дозапрос документов' }).click();
    page.locator('#documentRequest825').fill('2025-05-01');
    await check_file_form(page, 'Дозапрос документов 3');
    await save(page);
    await expect(page.locator('#documentRequest825')).toHaveValue('2025-05-01');
    await page.getByLabel('Дозапрос документов 3').getByRole('button').nth(2).click();
    await page.getByRole('button', { name: 'Да', exact: true }).click();
    await expect(page.getByLabel('successful')).toBeVisible();
    await save(page);
    await expect(page.getByLabel('Дозапрос документов 3')).not.toBeVisible();
})