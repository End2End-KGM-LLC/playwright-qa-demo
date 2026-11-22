import { test, expect } from '../../fixtures';
import { products } from '../../fixtures/test-data';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('added items show in the badge and the cart @smoke', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack, products.bikeLight);

    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.cartLink.click();
    await expect(cartPage.itemNames).toHaveText([products.backpack, products.bikeLight]);
  });

  test('removing an item updates the badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack, products.bikeLight);
    await inventoryPage.removeFromCart(products.backpack);

    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(products.bikeLight);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('cart survives a page reload', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addToCart(products.fleeceJacket);

    await page.reload();

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await cartPage.goto();
    await expect(cartPage.itemNames).toHaveText([products.fleeceJacket]);
  });
});
