// TESTS/e2e/operator-inputs.test.ts
// ——— OPERATOR HANDLING TESTS ———

import { test, expect } from '@playwright/test';
import { CalculatorPage } from './page/CalculatorPage';

let calculator: CalculatorPage;

test.describe('Operator Handling', () => {
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);
        await calculator.goto();
    });


    // Numbers and operators should show spaces around operators
    test('numbers and operators should display with spaces', async () => {
        await calculator.pressSequence('1+1');
        await expect(calculator.result).toHaveText('1 + 1');
    });


    // Test each operator can be input after a number
    test('can input + - × ÷ after a number', async () => {
        for (const operator of ['+', '-', '×', '÷'] as const) {
            await calculator.press('2');
            await calculator.press(operator);
            await expect(calculator.result).toHaveText(`2 ${operator} `);
            await calculator.press('AC'); // reset for next operator
        }
    });


    // Chained operators: 5 + 2 - 1 displays correctly
    test('chained operators display correctly', async () => {
        await calculator.pressSequence('5+2-1');
        await expect(calculator.result).toHaveText('5 + 2 - 1');
    });


    // Prevent double operator: second operator should overwrite the first if its a different operator
    test('prevent double operator by overwriting', async () => {
        await test.step('enter 5 +', async () => {
            await calculator.pressSequence('5+');
            await expect(calculator.result).toHaveText('5 + ');
            
        });
        await test.step('press × and verify overwrite', async () => {
            await calculator.press('×');
            await expect(calculator.result).toHaveText('5 × ');
        });
    });


    // test that the same operator pressed twice is ignored
    test('should ignore repeated operator inputs', async () => {
        await test.step('enter 5 × and check display', async () => {
            await calculator.pressSequence('5×');
            await expect(calculator.result).toHaveText('5 × ');
        });
        
        await test.step('press × again and verify it is ignored', async () => {
            await calculator.press('×');
            await expect(calculator.result).toHaveText('5 × ');
        });
    });


    // Operator after "(" only minus is allowed
    test('operator after "(" only minus allowed', async () => {
        await test.step('open parenthesis then press +', async () => {
            await calculator.press('(');
            await expect(calculator.result).toHaveText('(');
            await calculator.press('+');
            await expect(calculator.result).toHaveText('('); // '+' ignored
        });

        await test.step('press minus after "("', async () => {
            await calculator.press('-');
            await expect(calculator.result).toHaveText('( - ');
        });
    });
});


// npx playwright test TESTS/e2e/operator-inputs.test.ts --config=playwright.config.ts --project=e2e-chromium
