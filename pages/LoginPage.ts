import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  protected readonly path = '/';

  readonly username: Locator = this.page.getByTestId('username');
  readonly password: Locator = this.page.getByTestId('password');
  readonly submit: Locator = this.page.getByTestId('login-button');
  readonly error: Locator = this.page.getByTestId('error');

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
