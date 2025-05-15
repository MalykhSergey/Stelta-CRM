import { expect } from "@playwright/test";

export async function default_analytics_test(page) {
    await page.goto('http://127.0.0.1:3000/analytics/company');
    await page.getByRole('button', { name: 'Любой' }).click();
    await page.getByRole('checkbox', { name: 'Подготовка заявки 1 Этап' }).check();
    await page.getByRole('checkbox', { name: 'Подготовка заявки 2 Этап' }).check();
    await page.getByRole('checkbox', { name: 'Заключение договора' }).check();
    await page.getByRole('button', { name: 'Рассчитать' }).click();
    await expect(page).toHaveScreenshot();
    await page.getByRole('button', { name: 'Выбрано:' }).click();
    await page.getByText('Заключение договора').click();
    await page.getByText('Подготовка заявки 1 Этап').click();
    await page.getByText('Подготовка заявки 2 Этап').click();
    await page.getByRole('button', { name: 'Любой' }).click();
    await page.getByRole('textbox', { name: 'До:' }).fill('2025-01-09');
    await page.getByRole('button', { name: 'Рассчитать' }).click();
    await expect(page).toHaveScreenshot();
}
