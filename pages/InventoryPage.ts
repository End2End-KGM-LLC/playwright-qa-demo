import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly title: Locator = this.page.getByTestId('title');
  readonly items: Locator = this.page.getByTestId('inventory-item');
  readonly itemNames: Locator = this.page.getByTestId('inventory-item-name');
  readonly itemPrices: Locator = this.page.getByTestId('inventory-item-price');
  readonly sort: Locator = this.page.getByTestId('product-sort-container');
  readonly cartBadge: Locator = this.page.getByTestId('shopping-cart-badge');
  readonly cartLink: Locator = this.page.getByTestId('shopping-cart-link');

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async addToCart(...names: string[]): Promise<void> {
    for (const name of names) {
      await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
    }
  }

  async removeFromCart(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sort.selectOption(option);
  }

  async prices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map(parsePrice);
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByTestId('logout-sidebar-link').click();
  }
}

export function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}
