import { expect, test } from "../../login-fixture";

test('Фильтрация по названию', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  await page.getByPlaceholder('Полное наименование').fill('пРИС');
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`- 'link /Фомина Инк Приспособление критически важных интернет-продавцов тендер НМЦК: \\d+ \\d+,\\d+₽ Начало подачи: 1\\/1\\/\\d+ \\d+:\\d+:\\d+/'`);
});