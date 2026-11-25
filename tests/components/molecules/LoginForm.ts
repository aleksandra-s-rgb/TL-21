import { Page } from '@playwright/test';
import { TestButton } from '../atoms/TestButton';
import { TestInput } from '../atoms/TestInput';

export class LoginForm {
  private readonly username: TestInput;
  private readonly password: TestInput;
  private readonly continueButton: TestButton;

  constructor(private readonly page: Page) {
    this.username = TestInput.byTestId(page, 'login-popup-username-input');
    this.password = TestInput.byTestId(page, 'login-popup-password-input');
    this.continueButton = TestButton.byTestId(page, 'login-popup-continue-button');
  }

  async expectVisible(): Promise<void> {
    await this.username.expectVisible();
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.continueButton.click();
  }
}
