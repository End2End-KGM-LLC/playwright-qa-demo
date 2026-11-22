import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
  readonly checkout: Locator = this.page.getByTestId('checkout');
}
