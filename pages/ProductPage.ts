import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  protected readonly path = '/inventory-item.html';

  readonly name: Locator = this.page.getByTestId('inventory-item-name');
  readonly price: Locator = this.page.getByTestId('inventory-item-price');
  readonly backToProducts: Locator = this.page.getByTestId('back-to-products');
}
