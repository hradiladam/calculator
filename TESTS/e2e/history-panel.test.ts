// TESTS/e2e/history-panel.test.ts

import { test, expect } from '@playwright/test';
import { CalculatorPage } from '../playwright-setup/page/CalculatorPage';

let calculator: CalculatorPage;

test.describe('History Panel', () => {
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);
        await calculator.goto();
    });

    test('history butons opens and closes the panel', async () => {
        // Initially should be closed
        expect(await calculator.isHistoryVisible()).toBe(false);

        // Toggle to open
        await calculator.openHistory();
        expect(await calculator.isHistoryVisible()).toBe(true);

        // Toggle to close
        await calculator.closeHistory();
        expect(await calculator.isHistoryVisible()).toBe(false);
    });

    test('has the expected default empty state', async () => {
        // History panel should show the placeholder ('No history to show.')
        await calculator.openHistory();

        // The empty-state message inside the panel should be visible and exact
        const emptyEntry = calculator.page.locator('#history-panel .history-empty');
        await expect(emptyEntry).toBeVisible();
        await expect(emptyEntry).toHaveText('No history to show.');
    });

    test('logs a new entry after a successful evaluation via buttons', async () => {
        // Perform calculation 12 + 8 = 20 via button presses
        await calculator.pressSequence('12+8=');

        // Wait for the display to settle
        await expect.poll(() => calculator.getResult(), { timeout: 2000 }).toBe('20');

        // Result should be correct
        expect(await calculator.getResult()).toBe('20');

        // Recent history summary should update (not the placeholder "None")
        const recent = await calculator.getRecentHistory();
        expect(recent).not.toBe('None');
        expect(recent).toMatch('12 + 8 =');

        // Open full history panel and verify entry exists
        await calculator.openHistory();
        const entryExpression = calculator.page.locator('#history-panel .history-entry .history-expression').first();
        const entryResult = calculator.page.locator('#history-panel .history-entry .history-result').first();

        await expect(entryExpression).toBeVisible();
        await expect(entryResult).toBeVisible();

        // Check that the logged expression and result are correct
        await expect(entryExpression).toHaveText('12 + 8 =');
        await expect(entryResult).toHaveText('20');
    });

    test('logs a new entry after keyboard input evaluation', async () => {
        // Type expression via keyboard (7×3=) and let the app evaluate it
        await calculator.typeExpression('7×3=');

        // Wait for the result to become "21"
        await expect.poll(() => calculator.getResult(), { timeout: 2000 }).toBe('21');

        // Verify the result explicitly
        expect(await calculator.getResult()).toBe('21');

        // Full history panel should contain the entry
        await calculator.openHistory();
        const entryExpression = calculator.page.locator('#history-panel .history-entry .history-expression').first();
        const entryResult = calculator.page.locator('#history-panel .history-entry .history-result').first();

        await expect(entryExpression).toHaveText('7 × 3 =');
        await expect(entryResult).toHaveText('21');
    });

    test('does not lose history when toggling the history panel open/closed', async () => {
        await calculator.pressSequence('3+4=');
        await expect.poll(() => calculator.getResult(), { timeout: 2000 }).toBe('7');

        await calculator.openHistory();
        expect(await calculator.isHistoryVisible()).toBe(true);

        await calculator.closeHistory();
        expect(await calculator.isHistoryVisible()).toBe(false);

        await calculator.openHistory();
        expect(await calculator.isHistoryVisible()).toBe(true);

        // Should still have the one entry
        const entries = calculator.page.locator('#history-panel .history-entry');
        await expect(entries).toHaveCount(1);
        await expect(entries.first().locator('.history-result')).toHaveText('7');
    });

    test('preserves history when switching themes', async () => {
        await calculator.pressSequence('3+4=');
        await expect.poll(() => calculator.getResult(), { timeout: 2000 }).toBe('7');

        await calculator.openHistory();
        const beforeEntries = calculator.page.locator('#history-panel .history-entry');
        await expect(beforeEntries).toHaveCount(1);

        // Toggle theme
        await calculator.switchTheme();

        // History should still be present
        await expect(beforeEntries).toHaveCount(1);
        await expect(beforeEntries.first().locator('.history-expression')).toHaveText(' 3 + 4 =');
        await expect(beforeEntries.first().locator('.history-result')).toHaveText('7');
    });

    test('multiple entries appear in correct (recent-placed-lowest) order', async () => {
        // First entry
        await calculator.pressSequence('1+1=');
        await expect.poll(() => calculator.getResult(), { timeout: 2000 }).toBe('2');

        // Second entry
        await calculator.pressSequence('2+2=');
        await expect.poll(() => calculator.getResult(), { timeout: 2000 }).toBe('4');

        await calculator.openHistory();
        const entries = calculator.page.locator('#history-panel .history-entry');
        await expect(entries).toHaveCount(2);

        // Newest should be first
        await expect(entries.nth(0).locator('.history-result')).toHaveText('2');
        await expect(entries.nth(1).locator('.history-result')).toHaveText('4');
    });

    test('history panel result entry has correct color in light mode', async () => {
        // Light mode by default
        expect(await calculator.isDarkMode()).toBe(false);

        // Do a calculation so an entry appears
        await calculator.pressSequence('4+6=');
        await expect.poll(() => calculator.getResult(), { timeout: 2000 }).toBe('10');

        // Open history and grab the result element of the latest entry
        await calculator.openHistory();
        const entryResult = calculator.page.locator(
            '#history-panel .history-entry .history-result'
        ).first();

        // Light-mode history result color should be #3289c4 => rgb(50, 137, 196)
        await expect(entryResult).toHaveCSS('color', 'rgb(50, 137, 196)');
    });

    test('history panel result entry has correct color in dark mode', async () => {
        // Switch to dark mode
        await calculator.switchTheme();
        expect(await calculator.isDarkMode()).toBe(true);

        // Do a calculation so an entry appears
        await calculator.pressSequence('4+6=');
        await expect.poll(() => calculator.getResult(), { timeout: 2000 }).toBe('10');

        // Open history and grab the result element of the latest entry
        await calculator.openHistory();
        const entryResult = calculator.page.locator(
            '#history-panel .history-entry .history-result'
        ).first();

        // Dark-mode history result color should be #ec6f6f => rgb(236, 111, 111)
        await expect(entryResult).toHaveCSS('color', 'rgb(236, 111, 111)');
    });

	test('history shows grouped expression and grouped result after "="', async () => {
		// Perform a large-number addition via button presses
		await calculator.pressSequence('1000+2000=');

		// Verify that the displayed result is correctly grouped with commas
		await expect.poll(() => calculator.getResult()).toBe('3,000');

		// Check that the recent history summary matches the grouped expression
		const recent = await calculator.getRecentHistory();
		expect(recent).toBe('1,000 + 2,000 =');

		// Open the history panel and grab the first logged expression/result
		await calculator.openHistory();
		const expr = calculator.page.locator('#history-panel .history-entry .history-expression').first();
		const res  = calculator.page.locator('#history-panel .history-entry .history-result').first();

		// Verify grouping and correctness in the full history panel
		await expect(expr).toHaveText('1,000 + 2,000 =');
		await expect(res).toHaveText('3,000');
	});

	test('percentage + large integer formats correctly in history', async () => {
		// Perform an addition with a percentage operand
		await calculator.pressSequence('1000+20%=');

		// Verify the result is calculated and grouped correctly
		await expect.poll(() => calculator.getResult()).toBe('1,200');

		// Check that the recent history summary is grouped and shows the % symbol
		const recent = await calculator.getRecentHistory();
		expect(recent).toBe('1,000 + 20% =');

		// Open history and verify expression/result formatting
		await calculator.openHistory();
		const expr = calculator.page.locator('#history-panel .history-entry .history-expression').first();
		const res  = calculator.page.locator('#history-panel .history-entry .history-result').first();

		await expect(expr).toHaveText('1,000 + 20% =');
		await expect(res).toHaveText('1,200');
	});

	test('implicit multiplication with parentheses is grouped in history', async () => {
		// Perform an implicit multiplication (number immediately followed by parentheses)
		await calculator.pressSequence('1000(2)=');

		// Verify the grouped result
		await expect.poll(() => calculator.getResult()).toBe('2,000');

		// Check the grouped expression in the recent history summary
		const recent = await calculator.getRecentHistory();
		expect(recent).toBe('1,000 × (2) =');

		// Open history and verify grouped expression/result formatting
		await calculator.openHistory();
		const expr = calculator.page.locator('#history-panel .history-entry .history-expression').first();
		const res  = calculator.page.locator('#history-panel .history-entry .history-result').first();

		await expect(expr).toHaveText('1,000 × (2) =');
		await expect(res).toHaveText('2,000');
	});

	test('keyboard path produces grouped expression/result in history', async () => {
		// Enter a large-number addition via keyboard input
		await calculator.typeExpression('1000+3000=');

		// Verify the grouped result on the display
		await expect.poll(() => calculator.getResult()).toBe('4,000');

		// Verify recent history summary matches grouped expression
		const recent = await calculator.getRecentHistory();
		expect(recent).toBe('1,000 + 3,000 =');

		// Open history and confirm the grouped expression/result
		await calculator.openHistory();
		const expr = calculator.page.locator('#history-panel .history-entry .history-expression').first();
		const res  = calculator.page.locator('#history-panel .history-entry .history-result').first();

		await expect(expr).toHaveText('1,000 + 3,000 =');
		await expect(res).toHaveText('4,000');
	});

	test('history survives theme switch and remains grouped', async () => {
		// Perform a calculation with large numbers so grouping applies
		await calculator.pressSequence('4000+6000=');
		await expect.poll(() => calculator.getResult()).toBe('10,000');

		// Open history and verify exactly one entry exists
		await calculator.openHistory();
		const entries = calculator.page.locator('#history-panel .history-entry');
		await expect(entries).toHaveCount(1);

		// Switch theme and verify entry count remains the same
		await calculator.switchTheme();
		await expect(entries).toHaveCount(1);

		// Confirm the grouped expression/result remain unchanged after theme switch
		await expect(entries.first().locator('.history-expression')).toHaveText('4,000 + 6,000 =');
		await expect(entries.first().locator('.history-result')).toHaveText('10,000');
	});

})


// npx playwright test TESTS/e2e/history-panel.test.ts --config=playwright-e2e.config.ts --project=Chromium