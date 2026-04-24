import { expect, Page, test } from '@playwright/test';

const randon = Date.now();
const username = `testuser${randon}`;
const password = '123456';

test.describe('Create User Tests', () => {
  test('Create User', async ({ page }: { page: Page }) => {

    await page.goto('http://localhost:5173/user');
    await page.getByLabel('Username').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.getByRole('button', { name: 'Registrar' }).click();

    // Verificar que se redirige a la página de perfil después del login
    await expect(page).toHaveURL('http://localhost:5173/login');
  });
});