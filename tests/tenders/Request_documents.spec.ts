import { expect, test } from "../login-fixture";

test('Выполнить дозапрос документов', async ({ page }) => {
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'ООО «Харитонов-Прохоров» Распределение корпоративных инициатив лот НМЦК: 57 178' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Дозапрос' }).click();
  await page1.locator('div').filter({ hasText: /^Этап 1$/ }).getByLabel('Развернуть').click();
  await page1.getByRole('button', { name: 'Дозапрос документов' }).click();
  await page1.locator('#documentRequest825').fill('2025-01-15');
  await page1.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page1.locator('#successful-alert')).toBeVisible();
  await page1.reload()
  await expect(page1.getByLabel('Формы 1 этапа')).toMatchAriaSnapshot(`
        - heading "Формы 1 этапа" [level=3]
        - button "Прикрепить"
        `);
  await expect(page1.getByLabel('Дозапрос документов 1')).toMatchAriaSnapshot(`- heading "Дозапрос документов 1" [level=3]`);
  await expect(page1.getByLabel('Дозапрос документов 2')).toMatchAriaSnapshot(`- heading "Дозапрос документов 2" [level=3]`);
  await expect(page1.getByLabel('Дозапрос документов 3')).toMatchAriaSnapshot(`- heading "Дозапрос документов 3" [level=3]`);
  await expect(page1.getByLabel('Дозапрос документов 4')).toMatchAriaSnapshot(`- heading "Дозапрос документов 4" [level=3]`);
  await expect(page1.locator('#documentRequest812')).toHaveValue('2025-01-02');
  await expect(page1.locator('#documentRequest813')).toHaveValue('2025-01-05');
  await expect(page1.locator('#documentRequest814')).toHaveValue('2025-01-05');
  await expect(page1.locator('#documentRequest825')).toHaveValue('2025-01-15');
});