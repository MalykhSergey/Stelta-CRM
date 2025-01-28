import { expect, test } from "../../login-fixture";

test('Фильтрация по дате', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await page.getByRole('combobox').selectOption('1');
    await page.locator('div').filter({ hasText: /^От:$/ }).getByRole('textbox').fill('2025-01-01');
    await page.locator('div').filter({ hasText: /^До:$/ }).getByRole('textbox').fill('2025-02-13');
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - heading "Подготовка 1 Этап" [level=3]
      - 'link /Фомина Инк Приспособление критически важных интернет-продавцов тендер НМЦК: \\d+ \\d+,\\d+₽ Начало подачи: 1\\/1\\/\\d+ \\d+:\\d+:\\d+/'
      - 'link /Аксенова и партнеры Управление концептуальных областей интереса лот НМЦК: \\d+ \\d+,\\d+₽ Начало подачи: 1\\/6\\/\\d+ \\d+:\\d+:\\d+/'
      - 'link /АО «Котов-Калашников» Максимизация интерактивных интернет-магазинов лот НМЦК: \\d+ \\d+,\\d+₽ Начало подачи: 1\\/6\\/\\d+ 3:\\d+:\\d+/'
      - 'link /ООО «Игнатова, Кондратьев и Давыдов» Управление инновационных инфраструктур тендер НМЦК: \\d+ \\d+,\\d+₽ Начало подачи: 1\\/2\\/\\d+ \\d+:\\d+:\\d+/'
      `);
  });