import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from './InventoryPage';

/** Covers the three checkout steps: your information, overview, complete. */
export class CheckoutPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  readonly firstName: Locator = this.page.getByTestId('firstName');
  readonly lastName: Locator = this.page.getByTestId('lastName');
  readonly postalCode: Locator = this.page.getByTestId('postalCode');
  readonly continue: Locator = this.page.getByTestId('continue');
  readonly error: Locator = this.page.getByTestId('error');

  readonly itemPrices: Locator = this.page.getByTestId('inventory-item-price');
  readonly subtotal: Locator = this.page.getByTestId('subtotal-label');
  readonly tax: Locator = this.page.getByTestId('tax-label');
  readonly total: Locator = this.page.getByTestId('total-label');
  readonly finish: Locator = this.page.getByTestId('finish');

  readonly completeHeader: Locator = this.page.getByTestId('complete-header');

  async fillInformation(info: {
    firstName: string;
    lastName: string;
    postalCode: string;
  }): Promise<void> {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continue.click();
  }

  /** Overview totals in cents, so comparisons don't hit floating-point rounding. */
  async totalsInCents(): Promise<{
    items: number[];
    subtotal: number;
    tax: number;
    total: number;
  }> {
    const cents = (text: string | null) => Math.round(parsePrice(text ?? '') * 100);
    // allTextContents() doesn't wait, so make sure the overview step has rendered first.
    await this.subtotal.waitFor();
    return {
      items: (await this.itemPrices.allTextContents()).map(cents),
      subtotal: cents(await this.subtotal.textContent()),
      tax: cents(await this.tax.textContent()),
      total: cents(await this.total.textContent()),
    };
  }
}
