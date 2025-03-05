import { expect, test } from "../../login-fixture";
import check_file_form from "../check_file_form";

test('Проверить переторжки', async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/tender/19")
    await expect(page.locator('#RebPrice708')).toHaveValue('5,266.92₽');
    await expect(page.locator('#Price')).toHaveValue('5,266.92₽');
    await page.getByRole('button', { name: 'Переторжка' }).click();
    // await expect(page.getByLabel('successful')).toBeVisible();
    await expect(page.locator('#Price')).toHaveValue('0₽');
    await page.locator('#RebPrice718').fill('120.91₽');
    await expect(page.locator('#Price')).toHaveValue('120.91₽');
    await check_file_form(page, 'Переторжка 3');
    await page.getByLabel('Переторжка 3').getByRole('button').nth(2).click();
    await page.getByRole('button', { name: 'Да', exact: true }).click();
    await expect(page.getByLabel('successful')).toBeVisible();
    await expect(page.locator('#Price')).toHaveValue('5,266.92₽');
})