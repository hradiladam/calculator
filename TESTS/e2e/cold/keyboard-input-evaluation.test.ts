// TESTS/e2e/cold/keyboard-input-evaluation.test.ts
// ——— KEYBOARD INPUT END-TO-END TESTS ———

import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../page/CalculatorPage';

let calculator: CalculatorPage;

test.describe('Keyboard Input', () => {
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);
        await calculator.goto();

        // 👉 Ensure key events go to the display region
        await calculator.display.click();
    });

    test('should allow typing 7×2 and return 14', async () => {
        await calculator.typeExpression('7×2');
        await calculator.page.keyboard.press('Enter');

        // Use locator assertion (with built-in waiting) instead of getResult()
        await expect(calculator.result).toHaveText('14');
    });

    test('should evaluate a complex expression with keyboard input', async () => {
        // Simulate typing: ((1.2+3.8)*2 - 4%) = 9.6 - 0.384 = 9.6
        await calculator.typeExpression('((1.2+3.8)×2-4%)');
        await calculator.page.keyboard.press('Enter');

        await expect(calculator.result).toHaveText('9.6');
    });
});

// npx playwright test TESTS/e2e/cold/keyboard-input-evaluation.test.ts --config=playwright.config.ts --project=e2e-cold-chromium


/* On live server:

PW_BASE_URL=https://hradiladam.github.io/calculator/ \
npx playwright test TESTS/e2e/cold/keyboard-input-evaluation.test.ts \
  --project=e2e-cold-chromium --config=playwright.config.ts

*/