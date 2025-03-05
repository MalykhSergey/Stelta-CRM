import { expect, Locator, Page } from "@playwright/test";
import { files_for_upload } from "./files_for_upload/files_path";

export default async function check_file_form(page:Page, title:string) {
    const form = await page.getByLabel(title);
    await form.getByLabel('Прикрепить').click();
    await form.locator('input[type="file"]').setInputFiles([files_for_upload[0]]);
    await page.waitForTimeout(300);
    await form.getByLabel('Прикрепить').click();
    await form.locator('input[type="file"]').setInputFiles([files_for_upload[1]]);
    await page.waitForTimeout(300);
    await form.getByLabel('Прикрепить').click();
    await form.locator('input[type="file"]').setInputFiles([files_for_upload[2]]);
    await page.waitForTimeout(300);
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