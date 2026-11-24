import { expect, test } from '@playwright/test';
import { LoanDetailsPage, SmallLoanPage } from '../pages/SmallLoanPage';

test.describe('Small loan application', () => {
  let smallLoanPage: SmallLoanPage;

  test.beforeEach(async ({ page }) => {
    smallLoanPage = new SmallLoanPage(page);
    await smallLoanPage.open();
  });

  test('TL-20-1 - Verify default calculator values', async () => {
    await smallLoanPage.expectCalculatorDefaults();
  });

  test('TL-20-2 - Recalculate monthly payment after changing amount', async () => {
    const previousPayment = await smallLoanPage.monthlyPaymentValue();

    await smallLoanPage.setAmount('1000');

    await expect.poll(() => smallLoanPage.monthlyPaymentValue()).not.toBe(previousPayment);
  });

  test('TL-20-3 - Open the login form with Apply Now', async () => {
    await smallLoanPage.applyNow();
    await smallLoanPage.loginForm.expectVisible();
  });

  test('TL-20-4 - Sign in and open Loan Details', async ({ page }) => {
    const loanDetailsPage = new LoanDetailsPage(page);
    const username = process.env.LOAN_APP_USERNAME ?? 'test';
    const password = process.env.LOAN_APP_PASSWORD ?? 'test';

    await smallLoanPage.applyNow();
    await smallLoanPage.loginForm.expectVisible();
    await smallLoanPage.loginForm.signIn(username, password);
    await loanDetailsPage.expectVisible();
  });
});
