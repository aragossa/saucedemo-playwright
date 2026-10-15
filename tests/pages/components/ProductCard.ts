import { Locator, Page } from '@playwright/test';

/** One `inventory-item` block, as rendered on the Products page and in the cart. */
export class ProductCard {
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;

  constructor(readonly root: Locator) {
    this.name = root.getByTestId('inventory-item-name');
    this.price = root.getByTestId('inventory-item-price');
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
    this.removeButton = root.getByRole('button', { name: 'Remove' });
  }

  /** Finds the card whose name matches `name` inside `container`. */
  static byName(page: Page, container: Locator, name: string): ProductCard {
    const root = container
      .getByTestId('inventory-item')
      .filter({ has: page.getByTestId('inventory-item-name').filter({ hasText: name }) });
    return new ProductCard(root);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}
