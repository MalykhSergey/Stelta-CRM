import { expect, test } from "../login-fixture";

test('Проверить форму этапа 3', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/24")
    await expect(page.getByLabel('Дата заключения договора:')).toHaveValue('2025-01-05');
    await expect(page.getByLabel('Номер заключения договора:')).toHaveValue('Контракт 329');
    await page.getByLabel('Прикрепить').click();
    await page.locator('input[type="file"]').setInputFiles([
        './tests/tenders/files_for_upload/4.png',
        './tests/tenders/files_for_upload/5.png',
        './tests/tenders/files_for_upload/6.png'
    ]);
    await page.getByLabel('Дата заключения договора:').fill('2025-01-01');
    await page.getByLabel('Номер заключения договора:').click();
    await page.getByLabel('Номер заключения договора:').fill('Контракт 3298791');
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await expect(page.locator('#successful-alert')).toBeVisible();
    await page.reload()
    await page.getByLabel('Документы договора').getByLabel('Развернуть').click();
    await expect(page.getByLabel('Дата заключения договора:')).toHaveValue('2025-01-01');
    await expect(page.getByLabel('Номер заключения договора:')).toHaveValue('Контракт 3298791');
    await expect(page.locator('#TenderPageClient_rightPanel__ZhqeK')).toMatchAriaSnapshot(`
      - heading "Договор" [level=3]
      - button "Развернуть"
      - heading "Документы договора" [level=3]
      - button "Прикрепить"
      - button "Развернуть"
      - link "4.png"
      - button "Удалить"
      - link "5.png"
      - button "Удалить"
      - link "6.png"
      - button "Удалить"
      - text: "Дата заключения договора:"
      - textbox "Дата заключения договора:"
      - text: "Номер заключения договора:"
      - textbox "Номер заключения договора:"
      `);
});

test('Закончить работу', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/24")
    await page.getByRole('button', { name: 'Договор подписан' }).click();
    await expect(page.locator('#successful-alert')).toBeVisible();
    await expect(page.getByLabel('Статус:')).toHaveValue('6');
    await page.getByRole('link', { name: 'Поиск' }).click();
    await expect(page.getByRole('link', { name: 'ОАО «Поляков-Лазарева» Распределение масштабируемых инициатив лот НМЦК: 78 249,' })).toBeVisible();
});