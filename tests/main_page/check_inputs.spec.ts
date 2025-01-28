import { expect, test } from "../login-fixture";
test('Присутствует кнопка добавления и форма фильтра', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000")
    await expect(page.getByRole('button', { name: 'Добавить тендер' })).toBeVisible();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - heading "Фильтр" [level=3]
      - text: "Статус:"
      - combobox:
        - option "Любой" [selected]
        - option "Новый тендер"
        - option "Подготовка заявки 1 Этап"
        - option "Заявка подана 1 этап"
        - option "Подготовка заявки 2 Этап"
        - option "Заявка подана 2 этап"
        - option "Заключение договора"
      - text: "Полное наименование:"
      - textbox "Полное наименование"
      - text: "Организация:"
      - textbox "Название организации"
      - text: "Реестровый номер:"
      - textbox "№ ..."
      - text: "От:"
      - textbox
      - text: "До:"
      - textbox
      `);
});
