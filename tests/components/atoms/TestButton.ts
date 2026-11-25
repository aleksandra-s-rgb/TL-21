import { Locator, Page } from '@playwright/test';

export class TestButton {
  constructor(private readonly locator: Locator) {}

  static byTestId(page: Page, testId: string): TestButton {
    return new TestButton(page.getByTestId(testId));
  }

  async click(): Promise<void> {
    await this.locator.click();
  }

  /*get element(): Locator {
    return this.locator;
  }*/
}
