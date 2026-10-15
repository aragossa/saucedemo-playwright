import { Locator, Page } from '@playwright/test';
import { ProductCard } from './components/ProductCard';

export class InventoryPage {
  readonly title: Locator;
  readonly list: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId('title');
    this.list = page.getByTestId('inventory-list');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  product(name: string): ProductCard {
    return ProductCard.byName(this.page, this.list, name);
  }

  async openCart() {
    await this.cartLink.click();
  }
}
