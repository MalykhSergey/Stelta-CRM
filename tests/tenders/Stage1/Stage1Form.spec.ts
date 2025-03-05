import { test } from "../../login-fixture";
import check_file_form from "../check_file_form";

test('Проверить форму "Формы 1 этапа"', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/9")
    await check_file_form(page, 'Формы 1 этапа');
});