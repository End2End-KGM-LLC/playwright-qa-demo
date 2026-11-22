import { test, expect, loggedOut } from '../../fixtures';
import { testUser } from '../../config/environments';
import { messages, users } from '../../fixtures/test-data';

test.describe('Login', () => {
  test.use(loggedOut);

  test('valid user lands on the product list @smoke', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    const { username, password } = testUser();

    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked-out user is blocked with a clear message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.lockedOut, testUser().password);

    await expect(loginPage.error).toContainText(messages.lockedOut);
  });

  test('wrong password is rejected', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(testUser().username, 'wrong-password');

    await expect(loginPage.error).toContainText(messages.badCredentials);
    await expect(page).not.toHaveURL(/\/inventory\.html/);
  });

  test('protected pages redirect to login when logged out', async ({
    inventoryPage,
    loginPage,
  }) => {
    await inventoryPage.goto();

    await expect(loginPage.error).toContainText(messages.loginRequired);
    await expect(loginPage.submit).toBeVisible();
  });
});
