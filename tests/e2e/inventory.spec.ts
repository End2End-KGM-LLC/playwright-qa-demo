import { test, expect } from '../../fixtures';
import { products } from '../../fixtures/test-data';

test.describe('Product list', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows the full catalog with names and prices @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
    for (const price of await inventoryPage.prices()) {
      expect(price).toBeGreaterThan(0);
    }
  });

  test('sorts by price, low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by name, Z to A', async ({ inventoryPage }) => {
    const expected = (await inventoryPage.itemNames.allTextContents()).sort().reverse();

    await inventoryPage.sortBy('za');

    await expect(inventoryPage.itemNames).toHaveText(expected);
  });

  test('product detail page matches the list and links back', async ({
    inventoryPage,
    productPage,
    page,
  }) => {
    const listPrice = await inventoryPage
      .item(products.backpack)
      .getByTestId('inventory-item-price')
      .textContent();

    await inventoryPage.item(products.backpack).getByTestId('inventory-item-name').click();

    // Wait for an element only the detail page has: during the transition the list's
    // item names are briefly still in the DOM, which would trip strict mode.
    await expect(productPage.backToProducts).toBeVisible();
    await expect(productPage.name).toHaveText(products.backpack);
    await expect(productPage.price).toHaveText(listPrice ?? '');

    await productPage.backToProducts.click();
    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('user can log out from the menu @smoke', async ({ inventoryPage, loginPage, page }) => {
    await inventoryPage.logout();

    await expect(loginPage.submit).toBeVisible();
    await inventoryPage.goto();
    await expect(page).not.toHaveURL(/\/inventory\.html/);
  });
});
