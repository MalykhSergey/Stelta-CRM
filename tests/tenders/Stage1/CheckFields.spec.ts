import { expect, test } from "../../login-fixture";

test('Проверить изменение дат для 1 этапа', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/15")
    await expect(page.getByLabel('Дата окончания 1-го этапа:')).toHaveValue('2025-01-28T20:04');
    await page.getByLabel('Дата окончания 1-го этапа:').fill('2025-01-12T22:28');
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await expect(page.getByLabel("successful")).toBeVisible();
    await page.reload();
    await expect(page.getByLabel('Дата окончания 1-го этапа:')).toHaveValue('2025-01-12T22:28');
})
test('Проверить что остальные поля заблокированы', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/15")
    await expect(page.getByLabel('Тип:')).toBeDisabled();
    await expect(page.getByLabel('Организация:')).toBeDisabled();
    await expect(page.getByLabel('Полное наименование:')).toBeDisabled();
    await expect(page.getByLabel('Реестровый номер :')).toBeDisabled();
    await expect(page.getByLabel('Лот номер:')).toBeDisabled();
    await expect(page.getByLabel('НМЦК:')).toBeDisabled();
    await expect(page.getByLabel('Наша цена:').first()).toBeDisabled();
    await expect(page.getByLabel('Дата начала 1-го этапа:')).toBeDisabled();
    await expect(page.getByLabel('Контактное лицо:')).toBeDisabled();
    await expect(page.getByLabel('Номер телефона:')).toBeDisabled();
    await expect(page.getByLabel('Электронная почта:')).toBeDisabled();
})
test('Проверить наличие остальных элементов', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await expect(page.getByLabel('Документы тендера')).toBeVisible();
    await expect(page.getByText('КомментарииПодготовка заявки')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Не участвуем' })).toBeVisible();
})