// TESTS/e2e/error-handling.test.ts
// ——— ERROR HANDLING TESTS ———

import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../page/CalculatorPage';

let calculator: CalculatorPage;

test.describe('Error Handling (UI states)', () => {
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);
        await calculator.goto();
    });


    // divide by zero → should show "can't divide by 0" error
    test('divide by zero shows error state', async () => {
        await calculator.pressSequence('5÷0=');
        await expect(calculator.result).toHaveText(/can't divide by 0/i);
    });


    // open paren never closed → generic error should appear
    test('unmatched parentheses shows error', async () => {
        await calculator.pressSequence('(1+2=');
        await expect(calculator.result).toHaveText(/unmatched parentheses/i);
    });


    // expression ends with operator → should trigger error state
    test('ends with operator shows error', async () => {
        await calculator.pressSequence('5+=');
        await expect(calculator.result).toHaveText(/incomplete expression/i);
    });

    
    // misplaced percent sign (e.g. "1+%") → should show error
    test('misplaced percent sign shows error', async () => {
        await calculator.pressSequence('1+%=');
        await expect(calculator.result).toHaveText(/misplaced percent sign/i);
    });
});


// npx playwright test TESTS/e2e/cold/error-handling.test.ts --config=playwright.config.ts --project=e2e-cold-chromium