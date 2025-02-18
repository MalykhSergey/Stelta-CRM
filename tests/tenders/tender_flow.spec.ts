import { expect, test } from "../login-fixture";
import {files_for_upload} from "./files_for_upload/files_path";

test.describe('Поток создания и заполнения 1-го этапа', () => {
  test('Создать новый тендер', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await page.getByRole('button', { name: 'Добавить тендер' }).click();
    page.waitForTimeout(200)
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
    await page.reload()
    await expect(page.getByText('Документы тендераКомментарииНовый тендерУчаствоватьСохранитьУдалить')).toMatchAriaSnapshot(`
          - heading "Документы тендера" [level=3]
          - button "Прикрепить"
          - heading "Комментарии" [level=3]
          - button "Развернуть"
          - text: Новый тендер
          - textbox "Новый тендер"
          - button "Участвовать"
          - button "Сохранить"
          - button "Удалить"
          `);
    await page.getByRole('link', { name: 'Торги' }).click();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`- 'link "Аксенова и партнеры Тестовое наименование тендера НМЦК: 0₽"'`);
  });
  test('Проверить работу форму загрузки файлов тендера', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await page.getByRole('link', { name: 'Аксенова и партнеры Тестовое наименование тендера НМЦК: 0₽' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    const documentsForm = page1.getByLabel('Документы тендера');
    await documentsForm.getByLabel('Прикрепить').click();
    await documentsForm.locator('input[type="file"]').setInputFiles([
      files_for_upload[0],files_for_upload[1],files_for_upload[2]
    ]);
    await expect(documentsForm).toMatchAriaSnapshot(`
         - heading "Документы тендера" [level=3]
         - button "Прикрепить"
         - button "Развернуть"
         - link "4.png"
         - button "Удалить"
         - link "5.png"
         - button "Удалить"
         - link "6.png"
         - button "Удалить"
         `);
    await documentsForm.getByLabel('Развернуть').click();
    await expect(documentsForm).toMatchAriaSnapshot(`
         - heading "Документы тендера" [level=3]
         - button "Прикрепить"
         - button "Развернуть"
         - link "4.png"
         - button "Удалить"
         - link "5.png"
         - button "Удалить"
         - link "6.png"
         - button "Удалить"
         `);
    await documentsForm.getByLabel('Развернуть').click();
    await documentsForm.locator('div').filter({ hasText: /^4\.png$/ }).getByLabel('Удалить').click();
    await page1.getByRole('button', { name: 'Да', exact: true }).click();
    await documentsForm.locator('div').filter({ hasText: /^5\.png$/ }).getByLabel('Удалить').click();
    await page1.getByRole('button', { name: 'Да', exact: true }).click();
    await expect(documentsForm.getByText('5.png')).toBeHidden();
    await expect(documentsForm).toMatchAriaSnapshot(`
         - heading "Документы тендера" [level=3]
         - button "Прикрепить"
         - button "Развернуть"
         - link "6.png"
         - button "Удалить"
         `);
    await documentsForm.getByLabel('Удалить').click();
    await page1.getByRole('button', { name: 'Нет' }).click();
    await expect(documentsForm).toMatchAriaSnapshot(`
         - heading "Документы тендера" [level=3]
         - button "Прикрепить"
         - button "Развернуть"
         - link "6.png"
         - button "Удалить"
         `);
    await page1.getByRole('link', { name: 'Торги' }).click();
    const page2Promise = page1.waitForEvent('popup');
    await page1.getByRole('link', { name: 'Аксенова и партнеры Тестовое наименование тендера НМЦК: 0₽' }).click();
    const page2 = await page2Promise;
    await expect(page2.getByLabel('Документы тендера')).toMatchAriaSnapshot(`
         - heading "Документы тендера" [level=3]
         - button "Прикрепить"
         - button "Развернуть"
         - link "6.png"
         - button "Удалить"
         `);
  });
  test('Проверить работу формы комментариев', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Аксенова и партнеры Тестовое наименование тендера НМЦК: 0₽' }).click();
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
    await page.getByRole('link', { name: 'Аксенова и партнеры Тестовое наименование тендера НМЦК: 0₽' }).click();
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
          - text: "Подыгрыш:"
          - checkbox "Подыгрыш:"
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
          - text: "Полное наименование:"
          - textbox "Полное наименование:"
          - text: "Поле не должно быть пустым! Реестровый номер :"
          - textbox "Реестровый номер :"
          - text: "Поле не должно быть пустым! Лот номер:"
          - textbox "Лот номер:"
          - text: "Поле не должно быть пустым! НМЦК:"
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
    await page.getByRole('link', { name: 'Аксенова и партнеры Тестовое наименование тендера НМЦК: 0₽' }).click();
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
  test('Проверка формы 1-го этапа', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    await page.getByRole('link', { name: 'Аксенова и партнеры Тестовое наименование тендера НМЦК: 0₽ Начало подачи: 1/9/' }).click();
    const page1Promise = page.waitForEvent('popup');
    const page1 = await page1Promise;
    page1.locator('input[type="file"]').setInputFiles([
      files_for_upload[0],files_for_upload[1],files_for_upload[2]
    ]);
    await page1.getByRole('button', { name: 'Дозапрос документов' }).click();
    await page1.getByLabel('Дозапрос документов 1').locator('input[type="file"]').setInputFiles([
      files_for_upload[0],files_for_upload[1],files_for_upload[2]
    ]);
    await page1.getByLabel('Дата предоставления ответа').fill('2025-01-01');
    await page1.getByRole('button', { name: 'Дозапрос документов' }).click();
    await page1.getByLabel('Дата предоставления ответа').nth(1).fill('2025-01-02');
    await page1.getByRole('button', { name: 'Дозапрос документов' }).click();
    await page1.getByLabel('Дозапрос документов 3').getByRole('button').nth(1).click();
    await page1.getByRole('button', { name: 'Да', exact: true }).click();
    await expect(page1.locator('#TenderPageClient_rightPanel__ZhqeK')).toMatchAriaSnapshot(`
          - heading "Этап 1" [level=3]
          - button "Развернуть"
          - heading "Формы 1 этапа" [level=3]
          - button "Прикрепить"
          - button "Развернуть"
          - link "4.png"
          - button "Удалить"
          - link "5.png"
          - button "Удалить"
          - link "6.png"
          - button "Удалить"
          - heading "Дозапрос документов 1" [level=3]
          - button "Развернуть"
          - link "4.png"
          - link "5.png"
          - link "6.png"
          - text: Дата предоставления ответа
          - textbox "Дата предоставления ответа" [disabled]
          - heading "Дозапрос документов 2" [level=3]
          - button "Прикрепить"
          - button
          - text: Дата предоставления ответа
          - textbox "Дата предоставления ответа"
          - button "Дозапрос документов"
          `);
    await page1.getByRole('button', { name: 'Сохранить' }).click();
    await page1.reload();
    await expect(await page1.getByLabel('Дата предоставления ответа').nth(0)).toHaveValue('2025-01-01');
    await expect(await page1.getByLabel('Дата предоставления ответа').nth(1)).toHaveValue('2025-01-02');
  });
  test('Перевести тендер на этап 1 Заявка подана', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/');
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Аксенова и партнеры Тестовое наименование тендера НМЦК: 0₽' }).click();
    const page1 = await page1Promise;
    await page1.getByRole('button', { name: 'Подать заявку' }).click();
    await expect(page1.getByLabel("successful")).toBeVisible();
    await expect(page1.locator('#TenderPageClient_rightPanel__ZhqeK')).toMatchAriaSnapshot(`
      - heading "Документы тендера" [level=3]
      - button "Развернуть"
      - link "6.png"
      - heading "Этап 1" [level=3]
      - button "Развернуть"
      - heading "Формы 1 этапа" [level=3]
      - button "Развернуть"
      - link "4.png"
      - link "5.png"
      - link "6.png"
      - heading "Дозапрос документов 1" [level=3]
      - button "Развернуть"
      - link "4.png"
      - link "5.png"
      - link "6.png"
      - text: Дата предоставления ответа
      - textbox "Дата предоставления ответа" [disabled]
      - heading "Дозапрос документов 2" [level=3]
      - text: Дата предоставления ответа
      - textbox "Дата предоставления ответа" [disabled]
      - heading "Комментарии" [level=3]
      - button "Развернуть"
      - text: Новый тендер
      - paragraph: "Новый тендер: тестовый комментарий"
      - text: Заявка подана 1 этап
      - textbox "Заявка подана 1 этап"
      - button "Дозапрос"
      - button "Сметный расчёт"
      - button "Сохранить"
      - button "Не участвуем"
      `);
  });
});

