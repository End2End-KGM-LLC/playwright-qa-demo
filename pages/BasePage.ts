import type { Page } from '@playwright/test';

/**
 * Every page object extends this. Subclasses set `path` (relative to BASE_URL)
 * and expose locators + actions. Assertions stay in the tests.
 */
export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
