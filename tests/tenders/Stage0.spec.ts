import { expect, test } from "../login-fixture";
import check_file_form from "./check_file_form";

test.describe('Поток создания и заполнения тендера', () => {
  test('Создать новый тендер', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await page.getByRole('button', { name: 'Добавить тендер' }).click();
    await page.waitForLoadState();
    await expect(page.getByLabel('Статус:')).toHaveValue('0');
    await expect(page.getByLabel('Организация:')).toHaveValue('0');
    await expect(page.getByLabel('Полное наименование:')).toHaveValue('Полное наименование тендера');
    await expect(page.getByLabel('Реестровый номер :')).toHaveValue('Реестровый №');
    await expect(page.getByLabel('Лот номер:')).toHaveValue('Лот №');
    await expect(page.getByLabel('НМЦК:')).toHaveValue('0.00₽');
    await expect(page.getByLabel('Наша цена:')).toHaveValue('0.00₽');
    await page.getByLabel('Организация:').selectOption('54');
    await page.getByLabel('Контактное лицо:').click();
    await page.getByText('Жуков Якуб Ефимьевич').click();
    await page.getByLabel('Полное наименование:').fill('Тестовое наименование тендера');
    await page.getByLabel('Сокращённое наименование:').fill('Сокращённое наименование тендера');
    await page.getByLabel('Реестровый номер :').fill('Тестовый Реестровый №');
    await page.getByLabel('Лот номер:').fill('Тестовый Лот №');
    await page.getByLabel('Дата начала 1-го этапа:').fill('2025-01-09T00:00');
    await expect(page.getByLabel('Контактное лицо:')).toHaveValue('Жуков Якуб Ефимьевич');
    await expect(page.getByLabel('Номер телефона:')).toHaveValue('+72172830985');
    await expect(page.getByLabel('Электронная почта:')).toHaveValue('vlasvinogradov@example.org');
    await expect(page.getByLabel('Организация:')).toHaveValue('54');
    await expect(page.getByLabel('Дата начала 1-го этапа:')).toHaveValue('2025-01-09T00:00');
    await expect(page.getByLabel('Полное наименование:')).toHaveValue('Тестовое наименование тендера');
    await expect(page.getByLabel('Реестровый номер :')).toHaveValue('Тестовый Реестровый №');
    await expect(page.getByLabel('Лот номер:')).toHaveValue('Тестовый Лот №');
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await expect(page.getByLabel("successful")).toBeVisible();
  });

  test('Проверить тендер на странице "Торги"', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`- 'link "Аксенова и партнеры Сокращённое наименование тендера НМЦК: 0₽"'`);
  });
  test('Проверить работу форму загрузки файлов тендера', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/tender/27');
    await check_file_form(page, 'Документы тендера');
  });
  test('Проверить работу формы комментариев', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Аксенова и партнеры Сокращённое наименование тендера НМЦК: 0₽' }).click();
    const page1 = await page1Promise;
    await expect(page1.locator('#TenderPageClient_rightPanel__ZhqeK')).toMatchAriaSnapshot(`
         - heading "Комментарии" [level=3]
         - button "Развернуть"
         - text: Новый тендер
         - textbox "Новый тендер"
         `);
    await page1.locator('div').filter({ hasText: /^Комментарии$/ }).getByLabel('Развернуть').click();
    await page1.getByLabel('Новый тендер').click();
    await page1.getByLabel('Новый тендер').fill('Новый тендер: тестовый комментарий');
    await page1.getByRole('button', { name: 'Сохранить' }).click();
    await page1.getByRole('button', { name: 'Сохранить' }).press('F5');
    await expect(page1.locator('#TenderPageClient_rightPanel__ZhqeK')).toMatchAriaSnapshot(`
         - heading "Комментарии" [level=3]
         - button "Развернуть"
         - text: Новый тендер
         - textbox "Новый тендер": "Новый тендер: тестовый комментарий Новый тендер: тестовый комментарий"
         `);
  });
  test('Проверить валидацию полей тендера', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Аксенова и партнеры Сокращённое наименование тендера НМЦК: 0₽' }).click();
    const page1 = await page1Promise;
    await page1.getByLabel('Полное наименование:').click();
    await page1.getByLabel('Полное наименование:').fill('');
    await page1.getByLabel('Реестровый номер :').click();
    await page1.getByLabel('Реестровый номер :').fill('');
    await page1.getByLabel('Лот номер:').click();
    await page1.getByLabel('Лот номер:').fill('');

    await expect(page1.locator('#TenderPageClient_leftPanel__oF6dg')).toMatchAriaSnapshot(`
          - text: "Статус:"
          - combobox "Статус:":
            - option "Новый тендер" [selected]
            - option "Подготовка заявки 1 Этап"
            - option "Заявка подана 1 этап"
            - option "Подготовка заявки 2 Этап"
            - option "Заявка подана 2 этап"
            - option "Заключение договора"
            - option "Договор заключен"
          - combobox "Тип:":
            - option "Обычный" [selected]
            - option "Подыгрыш"
            - option "Заказ"
            - option "Коммерческое предложение"
          - combobox "Принадлежность:":
            - option "Тендер с низкой вероятностью" [selected]
            - option "Тендер с высокой вероятностью"
            - option "Бюджет"
          - text: "Организация:"
          - combobox "Организация:":
            - option "Выберите организацию" [disabled]
            - option "Аксенова и партнеры" [selected]
            - option "АО «Блохина Нестеров»"
            - option "АО «Котов-Калашников»"
            - option "Елисеева Лимитед"
            - option "НПО «Калашников»"
            - option "ОАО «Герасимов, Сергеев и Исаков»"
            - option "ОАО «Поляков-Лазарева»"
            - option "ООО «Герасимов-Зимин»"
            - option "ООО «Игнатова, Кондратьев и Давыдов»"
            - option "ООО «Козлов»"
            - option "ООО «Маслов, Воронцова и Матвеев»"
            - option "ООО «Михайлова Мишина»"
            - option "ООО «Харитонов-Прохоров»"
            - option "Попов Лтд"
            - option "РАО «Зыков-Зыкова»"
            - option "РАО «Мартынова-Некрасов»"
            - option "Соболева Лтд"
            - option "Уральский банк реконструкции и развития"
            - option "Фомина Инк"
          - text: "Сокращённое наименование:"
          - textbox "Сокращённое наименование:"
          - text: "Полное наименование:"
          - textbox "Полное наименование:"
          - text: "Поле не должно быть пустым! Реестровый номер :"
          - textbox "Реестровый номер :"
          - text: "Поле не должно быть пустым! Лот номер:"
          - textbox "Лот номер:"
          - textbox "НМЦК:": /\\d+\\.\\d+₽/
          - text: "Наша цена:"
          - textbox "Наша цена:"
          - text: "Дата начала 1-го этапа:"
          - textbox "Дата начала 1-го этапа:"
          - text: "Дата окончания 1-го этапа:"
          - textbox "Дата окончания 1-го этапа:"
          - text: "Дата окончания 2-го этапа:"
          - textbox "Дата окончания 2-го этапа:"
          - text: "Подведение итогов:"
          - textbox "Подведение итогов:"
          - text: "Контактное лицо:"
          - searchbox "Контактное лицо:"
          - text: "Номер телефона:"
          - textbox "Номер телефона:"
          - text: "Электронная почта:"
          - textbox "Электронная почта:"
          `);
  });
  test('Перевести тендер на этап 1 Подача заявки', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Аксенова и партнеры Сокращённое наименование тендера НМЦК: 0₽' }).click();
    const page1 = await page1Promise;
    await page1.getByRole('button', { name: 'Участвовать' }).click();
    await expect(page1.getByLabel("successful")).toBeVisible();
    await expect(page1.locator('#TenderPageClient_rightPanel__ZhqeK')).toMatchAriaSnapshot(`
          - heading "Этап 1" [level=3]
          - button "Развернуть"
          - heading "Формы 1 этапа" [level=3]
          - button "Прикрепить"
          - button "Дозапрос документов"
          `);
  });
});

