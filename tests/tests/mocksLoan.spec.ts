import {expect, test} from "@playwright/test";
import {SmallLoanPage} from "../pages/SmallLoanPage";


test.describe('Mocked loan-calc tests', async () => {
    let smallLoanPage: SmallLoanPage;
    test.beforeEach(async ({page}) => {
        smallLoanPage = new SmallLoanPage(page);
    });
    test('TL-21-1 - check 400 error', async ({page}) => {

        await page.route('**/api/loan-calc**', async route => {
            console.log('CATCHED');
            //await route.continue();
            await route.fulfill({
                status: 400
            })
        })
        await smallLoanPage.open()
        await smallLoanPage.setAmount(String(1000));
        const errorMessage = page.getByTestId('id-small-loan-calculator-field-error')
        await expect(errorMessage).toHaveText('Oops, something went wrong');

    });

    test('TL-21-2 - wait loancalc req', async ({page}) => {

        const loanCalcReqWaiter = page.waitForResponse('**/api/loan-calc**');
        await smallLoanPage.open()
        await smallLoanPage.setAmount(String(1000));
        await loanCalcReqWaiter;
        const errorMessage = page.getByTestId('id-small-loan-calculator-field-error')
        await expect(errorMessage).not.toBeVisible();

    });

    test('TL-21-3 - check calculator error on 500 response without body', async ({page}) => {
        await page.route('**/api/loan-calc**', async route => {
            await route.fulfill({
                status: 500
            });
        });

        const loanCalcResponseWaiter = page.waitForResponse(
            response => response.url().includes('/api/loan-calc') && response.status() === 500,
        );
        await smallLoanPage.open()

        await smallLoanPage.setAmount('1000');
        await loanCalcResponseWaiter;

        await smallLoanPage.expectCalculatorError();
    });

    test('TL-21-4 - check calculator on 200 response without body', async ({page}) => {
        await page.route('**/api/loan-calc**', async route => {
            await route.fulfill({
                status: 200
            });
        });

        const loanCalcResponseWaiter = page.waitForResponse(
            response => response.url().includes('/api/loan-calc') && response.status() === 200,
        );
        await smallLoanPage.open();

        await smallLoanPage.setAmount('1000');
        await loanCalcResponseWaiter;

        await smallLoanPage.expectCalculatorAfterLoanCalcResponse(false);
    });

    test('TL-21-5 - check calculator on 200 response with body', async ({page}) => {
        await page.route('**/api/loan-calc**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({paymentAmountMonthly: 85.61}),
            });
        });

        const loanCalcResponseWaiter = page.waitForResponse(
            response => response.url().includes('/api/loan-calc') && response.status() === 200,
        );
        await smallLoanPage.open()
        await smallLoanPage.setAmount('1000');
        const response = await loanCalcResponseWaiter;
        expect((await response.json()).paymentAmountMonthly).toBe(85.61);

        await smallLoanPage.expectCalculatorAfterLoanCalcResponse(true);
    });

    test('TL-21-6 - check calculator on 200 response with invalid name in json', async ({page}) => {
        await page.route('**/api/loan-calc**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    invalid_name: "zero"
                })
            });
        });

        const loanCalcResponseWaiter = page.waitForResponse(
            response => response.url().includes('/api/loan-calc') && response.status() === 200,
        );
        await smallLoanPage.open();

        await smallLoanPage.setAmount('1000');
        const response = await loanCalcResponseWaiter;
        expect(await response.json()).toEqual({ invalid_name: 'zero' });
        await expect(smallLoanPage.amountValue()).resolves.toBe('1000')

    });


})
