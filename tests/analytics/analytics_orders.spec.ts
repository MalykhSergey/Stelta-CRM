import { expect, test } from "../login-fixture";


test('По заказам', async ({ page }) => {
    await page.goto('http://127.0.0.1:3000/analytics/orders');
    await page.getByRole('searchbox', { name: 'Номер договора:' }).click();
    await page.getByText('917').click();
    await page.getByRole('button', { name: 'Рассчитать' }).click();
    await expect(page).toHaveScreenshot();
});