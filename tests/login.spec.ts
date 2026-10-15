import { test, expect } from './fixtures/test';
import { users, products, messages } from './fixtures/users';

test.describe('Login', () => {
  test('standard_user signs in and sees Sauce Labs Backpack on the products page', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await test.step('Login as standard_user', async () => {
      await loginPage.login(users.standard.username, users.standard.password);
    });

    await test.step('Products page is open', async () => {
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
    });

    await test.step('Sauce Labs Backpack is visible', async () => {
      await expect(inventoryPage.product(products.backpack).root).toBeVisible();
    });
  });

  test('locked_out_user is rejected and stays on the login page', async ({ page, loginPage }) => {
    await test.step('Login as locked_out_user', async () => {
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    });

    await test.step('Login page stays open with the lockout error', async () => {
      await expect(page).toHaveURL(/saucedemo\.com\/?$/);
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.error).toHaveText(messages.lockedOut);
    });
  });
});
