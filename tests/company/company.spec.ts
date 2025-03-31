import { expect, test } from '../login-fixture';

// test.describe('Поток создания и заполнения тендера', () => {});
test('Создать организацию', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/companies');
    await page.locator('textarea[name="company"]').fill('New company');
    await page.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByText('Организация успешно добавлена!')).toBeVisible();
});
test('Изменить организацию', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/companies');
    await page.getByText('New company').fill('New company123');
    await page.locator('div').filter({ hasText: /^New company123$/ }).getByLabel('Сохранить').click();
    await expect(page.getByText('Организация успешно обновлена!')).toBeVisible();
});
test('Удалить организацию', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/companies');
    await page.locator('div:nth-child(3) > .page_companyInputs__rj407 > .StageForms_cardHeader__o8Cc2 > .StageForms_rightPanel__9OTuu > .DeleteButton_DeleteButton__7ceyI').click();
    await expect(page.getByText('Невозможно удалить организацию: существуют связанные тендера или контактные лица')).toBeVisible();
    await page.locator('div').filter({ hasText: /^New company123$/ }).getByLabel('Удалить').click();
    await expect(page.getByText('Организация успешно удалена!')).toBeVisible();
});
test('Изменить контактное лицо', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/companies');
    await page.locator('div:nth-child(3) > .page_companyInputs__rj407 > .StageForms_cardHeader__o8Cc2 > .StageForms_rightPanel__9OTuu > .ExpandButton_ExpandButton__KXIuD').click();
    await page.locator('#ContactPersonForm_ContactPersonName__fsL2Y52').click();
    await page.getByText('Варфоломей Ефремович Белозеров').click();
    await page.locator('#ContactPersonForm_ContactPersonName__fsL2Y52').fill('Варфоломей Ефремович Белозв');
    await page.getByText('Сохранить').click();
    await expect(page.getByText('Контактное лицо успешно сохранено!')).toBeVisible();
});
test('Удалить контактное лицо', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/companies');
    await page.locator('div:nth-child(3) > .page_companyInputs__rj407 > .StageForms_cardHeader__o8Cc2 > .StageForms_rightPanel__9OTuu > .ExpandButton_ExpandButton__KXIuD').click();
    await page.locator('#ContactPersonForm_ContactPersonName__fsL2Y52').click();
    await page.getByText('Варфоломей Ефремович Белозв').click();
    await page.getByText('Удалить').click();
    await expect(page.getByText('Контактное лицо успешно удалено!')).toBeVisible();
});