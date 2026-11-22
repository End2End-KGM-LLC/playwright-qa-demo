import { test as setup, expect } from '@playwright/test';
import { AUTH_FILE, testUser } from '../config/environments';
import { InventoryPage, LoginPage } from '../pages';

// Logs in once and saves the session to AUTH_FILE. E2E projects reuse it,
// so tests start already logged in and don't repeat the login flow.
setup('authenticate', async ({ page }) => {
  const { username, password } = testUser();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(username, password);
  await expect(new InventoryPage(page).title).toHaveText('Products');

  await page.context().storageState({ path: AUTH_FILE });
});
