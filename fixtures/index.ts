import { test as base } from '@playwright/test';
import { CartPage, CheckoutPage, InventoryPage, LoginPage, ProductPage } from '../pages';

interface Pages {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
}

/**
 * Import `test` and `expect` from here, not from @playwright/test, so every
 * test can ask for page objects by name: `test('...', async ({ loginPage }) => ...)`.
 */
export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect } from '@playwright/test';

/** Use in a describe block to run its tests logged out. */
export const loggedOut = { storageState: { cookies: [], origins: [] } };
