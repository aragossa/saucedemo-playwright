import { Locator, Page } from '@playwright/test';
import { ProductCard } from './components/ProductCard';

export class CartPage {
  readonly title: Locator;
  readonly list: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByTestId('title');
    this.list = page.getByTestId('cart-list');
  }

  item(name: string): ProductCard {
    return ProductCard.byName(this.list, name);
  }
}
