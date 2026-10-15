import { Locator } from '@playwright/test';

/** One `inventory-item` block, as rendered on the Products page and in the cart. */
export class ProductCard {
  readonly addToCartButton: Locator;

  constructor(readonly root: Locator) {
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
  }

  /** Finds the card whose name is exactly `name` inside `container` (not a substring). */
  static byName(container: Locator, name: string): ProductCard {
    const root = container
      .getByTestId('inventory-item')
      .filter({ has: container.page().getByTestId('inventory-item-name').filter({ hasText: exact(name) }) });
    return new ProductCard(root);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = (name: string) => new RegExp(`^${escapeRegExp(name)}$`);
