import { expect, Page } from '@playwright/test';
import { TestButton } from '../components/atoms/TestButton';
import { TestInput } from '../components/atoms/TestInput';
import { LoginForm } from '../components/molecules/LoginForm';

export class SmallLoanPage {
  private readonly amount: TestInput;
  private readonly monthlyPayment;
  private readonly applyButton: TestButton;
  readonly loginForm: LoginForm;

  constructor(private readonly page: Page) {
    this.amount = TestInput.byTestId(page, 'id-small-loan-calculator-field-amount');
    this.monthlyPayment = page.getByTestId('ib-small-loan-calculator-field-monthlyPayment');
    this.applyButton = TestButton.byTestId(page, 'id-small-loan-calculator-field-apply');
    this.loginForm = new LoginForm(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/small-loan');
  }

  async amountValue(): Promise<string> {
    return this.amount.value();
  }

  async periodValue(): Promise<string> {
    return this.page.getByTestId('ib-small-loan-calculator-field-period').inputValue();
  }

  async monthlyPaymentValue(): Promise<string> {
    return (await this.monthlyPayment.innerText()).trim();
  }

  async setAmount(value: string): Promise<void> {
    await this.amount.fill(value);
  }

  async applyNow(): Promise<void> {
    await this.applyButton.click();
  }

  async expectCalculatorDefaults(): Promise<void> {
    await expect(this.amountValue()).resolves.toBe('500');
    await expect(this.periodValue()).resolves.toBe('12');
    await expect(this.monthlyPayment).toHaveText('42.8 €');
  }

  async expectCalculatorAfterLoanCalcResponse(hasBody: boolean): Promise<void> {
    const errorMessage = this.page.getByTestId('id-small-loan-calculator-field-error');
    await expect(errorMessage).not.toBeVisible();

    await expect(this.monthlyPayment).toHaveText(hasBody ? '85.61 €' : 'undefined €');
  }

  async expectCalculatorError(): Promise<void> {
    await expect(this.page.getByTestId('id-small-loan-calculator-field-error'))
      .toHaveText('Oops, something went wrong');
  }
}

export class LoanDetailsPage {
  constructor(private readonly page: Page) {}

  async expectVisible(): Promise<void> {
    await expect(this.page).toHaveURL(/\/loan-decision$/);
    await expect(this.page.getByText('Loan Details', { exact: true })).toBeVisible();
  }

}
