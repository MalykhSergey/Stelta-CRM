import { expect, Page } from "@playwright/test";
import { files_for_upload } from "./files_for_upload/files_path";

export default async function check_file_form(page: Page, title: string) {
    const form = await page.getByLabel(title);
    async function uploadWithNetworkWait(filePath: string) {
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            form.getByLabel('Прикрепить').click(),
        ]);
        await Promise.all([
            fileChooser.setFiles(filePath),
            page.waitForResponse(response =>
                response.url().includes('/api/file') &&
                response.status() === 200
            ),
        ]);
    }
    await uploadWithNetworkWait(files_for_upload[0]);
    await uploadWithNetworkWait(files_for_upload[1]);
    await uploadWithNetworkWait(files_for_upload[2]);
    await expect(form.locator('div').filter({ hasText: /^4\.png$/ }).first()).toBeVisible();
    await expect(form.locator('div').filter({ hasText: /^5\.png$/ }).first()).toBeVisible();
    await expect(form.locator('div').filter({ hasText: /^6\.png$/ }).first()).toBeVisible();
    await form.getByLabel('Развернуть').click();
    await expect(form.locator('div').filter({ hasText: /^4\.png$/ }).first()).not.toBeInViewport();
    await form.getByLabel('Развернуть').click();
    await form.getByLabel('Удалить').nth(1).click();
    await page.getByRole('button', { name: 'Да', exact: true }).click();
    await expect(form).toMatchAriaSnapshot(`
          - heading "${title}" [level=3]
          - button "Прикрепить"
          - button "Развернуть"
          - link "4.png"
          - link
          - button "Удалить"
          - link "6.png"
          - link
          - button "Удалить"
          `);
}