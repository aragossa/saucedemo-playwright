import { Locator, Page } from '@playwright/test';
import { ProductCard } from './components/ProductCard';

export class CartPage {
  readonly title: Locator;
  readonly list: Locator;
  readonly items: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId('title');
    this.list = page.getByTestId('cart-list');
    this.items = this.list.getByTestId('inventory-item');
  }

  item(name: string): ProductCard {
    return ProductCard.byName(this.page, this.list, name);
  }
}
