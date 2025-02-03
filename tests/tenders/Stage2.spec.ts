import { expect, test } from "../login-fixture";
import {files_for_upload} from "./files_for_upload/files_path";

test('Выполнить дозапрос документов', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/15")
    await page.getByRole('button', { name: 'Сметный расчёт' }).click();
    await expect(page.getByLabel("successful")).toBeVisible();
    await expect(page.getByLabel('Статус:')).toHaveValue('3');
    await expect(page.getByRole('button', { name: 'Переторжка' })).toBeVisible();
});
test('Проверить форму этапа 2', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await expect(page.locator('#Stage2FormPrice19')).toHaveValue('11,703.98₽');
    await expect(page.locator('#RebPrice707')).toHaveValue('9,625.71₽');
    await expect(page.locator('#RebPrice708')).toHaveValue('5,266.92₽');
    await expect(page.locator('#Price')).toHaveValue('5,266.92₽');
    await page.getByLabel('Переторжка 2').getByRole('button').nth(1).click();
    await page.getByRole('button', { name: 'Да', exact: true }).click();
    await expect(page.locator('#Price')).toHaveValue('9,625.71₽');
    await page.getByLabel('Документы 2 этапа').getByLabel('Прикрепить').click();
    await page.getByLabel('Документы 2 этапа').locator('input[type="file"]').setInputFiles([
        files_for_upload[0],files_for_upload[1],files_for_upload[2]
    ]);
    await page.getByLabel('Переторжка').getByLabel('Прикрепить').click();
    await page.getByLabel('Переторжка').locator('input[type="file"]').setInputFiles([
        files_for_upload[1]
    ]);
    await page.getByLabel('Формы 2 этапа').getByLabel('Прикрепить').click();
    await page.getByLabel('Формы 2 этапа').locator('input[type="file"]').setInputFiles([
        files_for_upload[2]
    ]);
    await page.locator('#RebPrice707').click();
    await page.locator('#RebPrice707').fill('100.12₽');
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await page.getByLabel('Переторжка').getByLabel('Развернуть').click();
    await page.getByLabel('Формы 2 этапа').getByLabel('Развернуть').click();
    await page.getByLabel('Документы 2 этапа').getByLabel('Развернуть').click();
    await expect(page.getByLabel('Документы 2 этапа')).toMatchAriaSnapshot(`
      - heading "Документы 2 этапа" [level=3]
      - button "Прикрепить"
      - button "Развернуть"
      - link "4.png"
      - button "Удалить"
      - link "5.png"
      - button "Удалить"
      - link "6.png"
      - button "Удалить"
      `);
    await expect(page.getByLabel('Формы 2 этапа')).toMatchAriaSnapshot(`
      - heading "Формы 2 этапа" [level=3]
      - button "Прикрепить"
      - button "Развернуть"
      - link "6.png"
      - button "Удалить"
      `);
    await expect(page.getByLabel('Переторжка')).toMatchAriaSnapshot(`
      - heading "Переторжка 1" [level=3]
      - button "Прикрепить"
      - button "Развернуть"
      - button
      - link "5.png"
      - button "Удалить"
      `);
    await expect(page.locator('#Stage2FormPrice19')).toHaveValue('11,703.98₽');
    await expect(page.locator('#RebPrice707')).toHaveValue('100.12₽');


});
test('Перевести на этап 2 Заявка подана', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await page.getByRole('button', { name: 'Подать заявку' }).click();
    await expect(page.getByLabel("successful")).toBeVisible();
    await page.reload()
    await expect(page.getByLabel('Статус:')).toHaveValue('4');
});
test('Вернуться на предыдущий этап', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await page.getByRole('button', { name: 'Переторжка' }).click();
    await expect(page.getByLabel("successful")).toBeVisible();
    await page.reload()
    await expect(page.getByLabel('Статус:')).toHaveValue('3');
})