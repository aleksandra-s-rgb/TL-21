import { Locator, Page } from '@playwright/test';

export class TestInput {
  constructor(private readonly locator: Locator) {}

  static byTestId(page: Page, testId: string): TestInput {
    return new TestInput(page.getByTestId(testId));
  }

  async fill(value: string): Promise<void> {
    await this.locator.fill(value);
  }

  async value(): Promise<string> {
    return this.locator.inputValue();
  }

  async expectVisible(): Promise<void> {
    await this.locator.waitFor({ state: 'visible' });
  }
}
