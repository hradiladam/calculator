// TESTS/e2e/functional-buttons-behaviour.test.ts
// ——— BUTTON FUNCTIONALITY & UI BEHAVIOR TESTS ———

import { test, expect } from '@playwright/test';
import { CalculatorPage } from './page/CalculatorPage';


let calculator: CalculatorPage;


// —— DESCRIBE BLOCK ——
test.describe('Button Input Behavior', () => {
    // —— Setup: Create a new CalculatorPage before every test ——
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);
        await calculator.goto();
    });


    // AC button clears result and history
    test('AC button should clear everything', async () => {
        await calculator.pressSequence('123');
        await calculator.press('AC')
        await expect(calculator.result).toHaveText('0') // Clearing calculator resets the result display to default 0
    });


    // ⌫ Button deletes the last character
    test('⌫ should delete the last input character', async () => {
        await calculator.pressSequence('123');
        await calculator.press('⌫');
        await expect(calculator.result).toHaveText('12');
    });


    // % can be typed after number
    test('% can be entered after a number', async () => {
        await calculator.pressSequence('50%');
        await expect(calculator.result).toHaveText('50%');
    });


    // % as first input appends to default 0 as default 0 doesnt dispappear unless necessary
    test('% as first input results in 0%', async () => {
        await calculator.press('%');
        await expect(calculator.result).toHaveText('0%');
    });


    // % can be typed consecutively
    test('% can be types multiple times in a row', async () => {
        await calculator.pressSequence('%%%');
        await expect(calculator.result).toHaveText('0%%%');
    });


    // ( ) button should auto-balance parentheses in a stepwise flow
    test('Pressing ( ) in a flow balances parentheses', async () => {
        await test.step('open parenthesis and enter 1+1', async () => {
            await calculator.press('( )');            // inserts '('
            await calculator.pressSequence('1+1');
            await expect(calculator.result).toHaveText('(1 + 1');  // no closing paren yet AND input must have spaces between number sand operators
        });

        await test.step('close parenthesis', async () => {
            await calculator.press('( )');                          // now inserts ')'
            await expect(calculator.result).toHaveText('(1 + 1)');  // balanced
        });
    });


     // = button triggers evaluation
    test('', async () => {
        await calculator.pressSequence("1+1=");
        await expect(calculator.result).toHaveText("2")
    });


    // = should not do anything if no valid input
    test('= should not change display if nothing to evaluate', async () => {
        await calculator.press('=');
        await expect(calculator.result).toHaveText('0');    // Default "empty" display is programmed to show 0
    });


    // = should not crash or change display if pressed twice
    test('= can be pressed repeatedly without breaking display', async () => {
        await test.step('evaluate expression 1+2', async () => {
        await calculator.pressSequence('1+2=');
        await expect(calculator.result).toHaveText('3');
        });

        await test.step('press = again and result remains', async () => {
        await calculator.press('=');
        await expect(calculator.result).toHaveText('3');
        });
    });
})


// npx playwright test TESTS/e2e/functional-buttons-behaviour.test.ts --config=playwright.config.ts --project=e2e-chromium
