import { expect, Page } from "@playwright/test";

export default async function save(page: Page) {
    await page.getByRole('button', { name: 'Сохранить' }).click();
    await page.getByText('Данные успешно сохранены!').click()
    await page.reload();
}