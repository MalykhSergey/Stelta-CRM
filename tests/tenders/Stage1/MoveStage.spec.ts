import { test } from "../../login-fixture";
import { to_fail_stage, to_next_stage, to_prev_stage } from "../move_stages";

test('Проверить подачу заявки', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/26")
    await to_next_stage(page);
})
test('Вернуться на дозапрос документов', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/26")
    await to_prev_stage(page);
    await to_next_stage(page);
});
test('Не участвовать в тендере', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/26")
    await to_fail_stage(page);
});