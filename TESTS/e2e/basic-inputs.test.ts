// TESTS/e2e/basic-inputs.test.ts
// ——— BASIC INPUTS TESTS ———

import { test, expect } from '@playwright/test';
import { CalculatorPage } from './page/CalculatorPage';

let calculator: CalculatorPage;

// —— DESCRIBE BLOCK ——
test.describe('Input Handling', () => {
    // —— Setup: Create a new CalculatorPage before every test ——
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);
        await calculator.goto();
    });

    // test.beforeEach(async (context) => {
    //     const page = context.page;
    //     calculator = new CalculatorPage(page);
    //     await calculator.goto();
    // })

    // Test 1: Confirm that clicking a single digit will display pressed digit in the display
    test('should display a single digit when pressed', async () => {
        await calculator.press('7');
        await expect(calculator.result).toHaveText('7');
    });


    // Test 2: Checks that numbers concacenate correctly
    test('should concatenate multiple numbers correctly', async () => {
        await calculator.pressSequence('123');
        await expect(calculator.result).toHaveText('123');
    });


    // Test 3: Test that only one decimal point is allowed in a number
    test('should allow only one decimal point per number', async () => {
        await calculator.pressSequence('1.2.3');
        await expect(calculator.result).toHaveText('1.23');
    });


    // Test 4: Test that after evaluating an expression, pressing a number starts a new expression
    test('should start a new expression when number pressed after equals', async () => {
        await test.step('evaluate 1+2', async () => {
            await calculator.pressSequence('1+2=');

            // Wait for result display to actually update to final number
            await expect(calculator.result).toHaveText('3');
        });

        await test.step('press 4 to start new expression', async () => {
            await calculator.press('4');   // New input should reset expression
            await expect(calculator.result).toHaveText('4');
        });
    });


    // Test 5: Test that multiple leading zeros are prevented and parsed correctly
    test('should prevent multiple leading zeros', async () => {
        await calculator.pressSequence('0001');
        await expect(calculator.result).toHaveText('1');
    });


    // Test 6: Test that typing a new number after an error clears the error state
    test('should clear error when typing after an error', async () => {
        await test.step('divide by 0 on purpose', async () => {
            await calculator.pressSequence('1÷0=');   // Must use ÷ instead of / since the UI displays ÷ symbol

            // Await the calculation to be done
            await expect(calculator.result).toHaveText(/can't divide by 0/i);
        });

        await test.step('press 1 to reset', async () => {
            await calculator.press('1');

            // Wait until error disappears
            await expect(calculator.result).not.toHaveText(/can't divide by 0/i);
            await expect(calculator.result).toHaveText('1');
        });
    });

    
});


// npx playwright test TESTS/e2e/basic-inputs.test.ts --config=playwright.config.ts --project=e2e-chromium


