import { expect, test } from "../../login-fixture";

test('Проверить изменение дат для 2 этапа', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await expect(page.getByLabel('Дата окончания 2-го этапа:')).toHaveValue('2025-01-08T22:28');
    await expect(page.getByLabel('Подведение итогов:')).toHaveValue('2025-01-01T22:28');
    await page.getByLabel('Подведение итогов:').fill('2025-01-12T22:28');
    await page.getByLabel('Дата окончания 2-го этапа:').fill('2025-12-10T22:28');
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await expect(page.getByLabel("successful")).toBeVisible();
    await page.reload();
    await expect(page.getByLabel('Дата окончания 2-го этапа:')).toHaveValue('2025-12-10T22:28');
    await expect(page.getByLabel('Подведение итогов:')).toHaveValue('2025-01-12T22:28');
})
test('Проверить что остальные поля заблокированы', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await expect(page.locator('input[type="checkbox"]')).toBeDisabled();
    await expect(page.getByLabel('Организация:')).toBeDisabled();
    await expect(page.getByLabel('Полное наименование:')).toBeDisabled();
    await expect(page.getByLabel('Реестровый номер :')).toBeDisabled();
    await expect(page.getByLabel('Лот номер:')).toBeDisabled();
    await expect(page.getByLabel('НМЦК:')).toBeDisabled();
    await expect(page.getByLabel('Наша цена:').first()).toBeDisabled();
    await expect(page.getByLabel('Дата начала 1-го этапа:')).toBeDisabled();
    await expect(page.getByLabel('Дата окончания 1-го этапа:')).toBeDisabled();
    await expect(page.getByLabel('Контактное лицо:')).toBeDisabled();
    await expect(page.getByLabel('Номер телефона:')).toBeDisabled();
    await expect(page.getByLabel('Электронная почта:')).toBeDisabled();
})
test('Проверить наличие остальных элементов', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await expect(page.getByLabel('Документы тендера')).toBeVisible();
    await expect(page.getByText('Этап 1Формы 1')).toBeVisible();
    await expect(page.getByText('КомментарииПодготовка заявки')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Не участвуем' })).toBeVisible();
})