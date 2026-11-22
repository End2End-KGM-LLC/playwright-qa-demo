import { test, expect } from '../../fixtures';
import { customer, messages, products } from '../../fixtures/test-data';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack, products.bikeLight);
    await cartPage.goto();
    await cartPage.checkout.click();
  });

  test('customer can place an order end to end @smoke', async ({ checkoutPage, inventoryPage }) => {
    await checkoutPage.fillInformation(customer);
    await checkoutPage.finish.click();

    await expect(checkoutPage.completeHeader).toHaveText(messages.orderComplete);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('order totals add up: items + tax = total', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(customer);

    const { items, subtotal, tax, total } = await checkoutPage.totalsInCents();
    expect(items).toHaveLength(2);
    expect(subtotal).toBe(items.reduce((sum, price) => sum + price, 0));
    expect(tax).toBeGreaterThan(0);
    expect(total).toBe(subtotal + tax);
  });

  test('missing customer details block the order', async ({ checkoutPage, page }) => {
    await checkoutPage.fillInformation({ ...customer, firstName: '' });

    await expect(checkoutPage.error).toContainText(messages.firstNameRequired);
    await expect(page).toHaveURL(/checkout-step-one/);
  });
});
