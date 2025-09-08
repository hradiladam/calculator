// TESTS/e2e/live-typing.test.ts

import { test, expect } from '@playwright/test';
import { CalculatorPage } from './page/CalculatorPage';

let calculator: CalculatorPage;

test.describe('Display — live typing thousands separators', () => {
	test.beforeEach(async ({ page }) => {
		calculator = new CalculatorPage(page);
		await calculator.goto();
	});

	test('groups thousands live as user types', async () => {
		await calculator.pressSequence('1000'); // 1 → 10 → 100 → 1000
		await expect(calculator.result).toHaveText('1,000');

		await calculator.pressSequence('000'); // -> 1,000,000
		await expect(calculator.result).toHaveText('1,000,000');
	});

	test('only integer part is grouped; decimals preserved', async () => {
		await calculator.pressSequence('1234567'); // -> 1,234,567
		await expect(calculator.result).toHaveText('1,234,567');

		await calculator.press('.');               // -> 1,234,567.
		await calculator.pressSequence('89');      // -> 1,234,567.89
		await expect(calculator.result).toHaveText('1,234,567.89');
	});

	test('backspace behaves correctly across comma boundaries', async () => {
		await calculator.pressSequence('1000');
		await expect(calculator.result).toHaveText('1,000');

		await calculator.press('⌫'); // 100
		await expect(calculator.result).toHaveText('100');

		await calculator.press('⌫'); // 10
		await expect(calculator.result).toHaveText('10');

		await calculator.press('⌫'); // 1
		await expect(calculator.result).toHaveText('1');
	});

	test('unary minus stays tight and magnitude is grouped', async () => {
		await calculator.press('-');
		await calculator.pressSequence('1234567'); // -> -1,234,567
		await expect(calculator.result).toHaveText('0 - 1,234,567');

		// Continue typing a binary operator and another grouped value
		await calculator.press('+');
		await calculator.pressSequence('1000');
		await expect(calculator.result).toHaveText('0 - 1,234,567 + 1,000');
	});
});


// npx playwright test TESTS/e2e/live-typing.test.ts --config=playwright.config.ts --project=e2e-chromium