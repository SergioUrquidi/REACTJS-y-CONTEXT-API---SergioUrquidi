import { expect, Page, test } from '@playwright/test';

test.describe('Login Tests', () => {
  test('Login', async ({ page }: { page: Page }) => {
    const username = 'ctrigo';
    const password = '123456';

    await page.goto('http://localhost:5173/login');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    // Verificar que se redirige a la página de perfil después del login
    await expect(page).toHaveURL('http://localhost:5173/perfil');
    await expect(page.getByText('Bienvenido a tu perfil')).toBeVisible();
  });
});
