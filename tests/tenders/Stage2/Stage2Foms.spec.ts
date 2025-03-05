import { test } from "../../login-fixture";
import check_file_form from "../check_file_form";

test('Проверить форму "Формы 2 этапа"', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await check_file_form(page, 'Формы 2 этапа');
});

test('Проверить форму "Документы этапа 2"', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await check_file_form(page, 'Документы 2 этапа');
});