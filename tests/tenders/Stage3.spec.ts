import { expect, test } from "../login-fixture";
import check_file_form from "./check_file_form";

test('Проверить форму этапа 3', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/24")
    await check_file_form(page, 'Документы договора');
});

test('Закончить работу', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/24")
    await page.getByRole('button', { name: 'Договор подписан' }).click();
    await expect(page.getByLabel("successful")).toBeVisible();
    await expect(page.getByLabel('Статус:')).toHaveValue('6');
    await page.getByRole('link', { name: 'Поиск' }).click();
    await expect(page.getByRole('link', { name: 'ОАО «Поляков-Лазарева» Распределение масштабируемых инициатив лот НМЦК: 78 249,' })).toBeVisible();
});