import { expect, Page } from "@playwright/test";

export async function to_next_stage(page: Page) {
    const prev_stage = Number.parseInt((await page.getByLabel('Статус:').inputValue()))
    await page.locator('.GreenButton').click()
    await page.getByText('Данные успешно сохранены!').click()
    const next_stage = Number.parseInt((await page.getByLabel('Статус:').inputValue()))
    expect(next_stage).toBe(prev_stage + 1)
}

export async function to_prev_stage(page: Page) {
    const prev_stage = Number.parseInt((await page.getByLabel('Статус:').inputValue()))
    await page.locator('.OrangeButton').click()
    await page.getByText('Данные успешно сохранены!').click()
    const next_stage = Number.parseInt((await page.getByLabel('Статус:').inputValue()))
    expect(next_stage).toBe(prev_stage - 1)
}

export async function to_fail_stage(page: Page) {
    const prev_stage = Number.parseInt((await page.getByLabel('Статус:').inputValue()))
    await page.locator('.RedButton').click()
    await page.getByText('Данные успешно сохранены!').click()
    const next_stage = Number.parseInt((await page.getByLabel('Статус:').inputValue()))
    expect(next_stage).toBe(-4)
}