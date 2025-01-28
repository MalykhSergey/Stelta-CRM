import { expect, test } from "../../login-fixture";

test('Фильтрация по организации', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  await page.getByPlaceholder('Название организации').fill('МИ');
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Подготовка 1 Этап" [level=3]
    - 'link /Фомина Инк Приспособление критически важных интернет-продавцов тендер НМЦК: \\d+ \\d+,\\d+₽ Начало подачи: 1\\/1\\/\\d+ \\d+:\\d+:\\d+/'
    `);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`- heading "Подана 1 Этап" [level=3]`);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Подготовка 2 Этап" [level=3]
    - 'link /ООО «Михайлова Мишина» Перепрофилирование целостных порталов лот НМЦК: \\d+ \\d+,\\d+₽ Окончание подачи: 1\\/8\\/\\d+ \\d+:\\d+:\\d+/'
    - 'link /ООО «Герасимов-Зимин» Трансформация интегрированных интернет-компаний лот НМЦК: \\d+ \\d+,\\d+₽ Окончание подачи: 2\\/1\\/\\d+ 9:\\d+:\\d+/'
    `);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`- heading "Подана 2 Этап" [level=3]`);
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`- heading "Заключение договора" [level=3]`);
});