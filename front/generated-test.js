import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://project-9of9a.vercel.app/');
  await page.getByRole('button', { name: 'Cuenta' }).click();
  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill('daniel@gmail.com');
  await page.locator('input[type="email"]').press('Tab');
  await page.locator('input[type="password"]').fill('1234');
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.getByRole('img', { name: 'Moneda de 10 pesos' }).click();
  await page.getByRole('button', { name: '🔄 Proponer trueque' }).click();
  await page.locator('div').filter({ hasText: 'Moneda de 10 pesos' }).nth(4).click();
  await page.getByText('BARTIFY').click();
});