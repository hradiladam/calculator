// TESTS/e2e/ui-behavior.test.ts
// ——— UI BEHAVIOR & LAYOUT TESTS ———

import { test, expect } from '@playwright/test';
import { CalculatorPage } from './page/CalculatorPage';

let calculator: CalculatorPage;

test.describe('UI Behavior & Layout', () => {
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);
        await calculator.goto();
    });

    // Typing a long number should cause the result section of display to scroll right automatically, so the newest digits stay visible on screen.
    test('long input scrolls result section of display display horizontally', async () => {
        const longInput = '1234567890'.repeat(5);
        await calculator.pressSequence(longInput);

        const scrolledPixels = await calculator.result.evaluate(el => el.scrollLeft);
        expect(scrolledPixels).toBeGreaterThan(0);

        const visibleText = await calculator.result.textContent();
        expect(visibleText?.trim().endsWith(longInput.at(-1)!)).toBe(true);
    });

    // Result display text should be right-aligned like standard calculators
    test('display text is right-aligned', async () => {
        await expect(calculator.result).toHaveCSS('text-align', 'right');
    });

    // Error messages → result text should change color to #eb4d45
    test('error messages apply error styling to result display', async () => {
        await calculator.pressSequence('1÷0=');
        await expect(calculator.result).toHaveCSS('color', 'rgb(235, 77, 69)');
    });

    // DARK THEME: Error message turns result red
    test('dark theme — error messages apply dark mode error styling', async () => {
        await calculator.switchTheme();
        await calculator.pressSequence('1÷0=');
        await expect(calculator.result).toHaveCSS('color', 'rgb(236, 111, 111)');
    });
});

// npx playwright test TESTS/e2e/ui-behavior.test.ts --config=playwright.config.ts --project=e2e-chromium
