import { test, expect } from './fixtures/test';
import { products } from './fixtures/users';

test.describe('Cart', () => {
  test('standard_user adds Sauce Labs Backpack to the cart and sees it in the cart', async ({
    page,
    loggedInPage,
    cartPage,
  }) => {
    await test.step('Add Sauce Labs Backpack to cart', async () => {
      const backpack = loggedInPage.product(products.backpack);
      await expect(backpack.root).toBeVisible();
      await backpack.addToCart();
      await expect(loggedInPage.cartBadge).toHaveText('1');
    });

    await test.step('Open cart', async () => {
      await loggedInPage.openCart();
      await expect(page).toHaveURL(/\/cart\.html$/);
      await expect(cartPage.title).toHaveText('Your Cart');
    });

    await test.step('Cart contains the backpack', async () => {
      await expect(cartPage.items).toHaveCount(1);
      await expect(cartPage.item(products.backpack).root).toBeVisible();
      await expect(cartPage.item(products.backpack).name).toHaveText(products.backpack);
    });
  });
});
