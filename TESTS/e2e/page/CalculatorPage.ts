// TESTS/playwright-tests/page/CalculatorPage.ts

// —— IMPORTS ——
import { Page, Locator } from '@playwright/test'; // @playwright/test is the official Playwright test runner package.

// —— CONSTANTS AND TYPES —-
// All valid button labels inferred as string types
const buttonNames = [
    '0','1','2','3','4','5','6','7','8','9','.','+','-','×','÷','=','AC','( )','%','⌫'
] as const;

// Union type from buttonNames: '0' | '1' | '+' | etc.
export type ButtonLabel = (typeof buttonNames)[number];

// —— PAGE OBJECT MODEL —-
// Page Object Model (POM) for the Calculator app. This class encapsulates all page interactions.
export class CalculatorPage {
    // The main Playwright page object (represents the browser tab)
    readonly page: Page;

    // Locators for display and history elements
    readonly display: Locator;
    readonly recentHistory: Locator;
    readonly result: Locator;
    readonly buttons: Record<ButtonLabel, Locator>; // Button label → element
    readonly themeToggleBtn: Locator;
    readonly historyToggleBtn: Locator;
    readonly historyPanel: Locator;

    // Constructor is called when the class is instantiated (The `page` argument is provided by Playwright when the test starts.)
    constructor(page: Page) {
        this.page = page;

        // Set up locators for the display and toggle buttons
        this.display = page.getByRole('region', { name: 'Calculator display' });
        this.recentHistory = page.getByRole('status', { name: 'Recent history' });
        this.result = page.getByRole('status', { name: 'Result' });
        this.themeToggleBtn = page.getByRole('button', { name: 'Toggle dark mode' });
        this.historyToggleBtn = page.getByRole('button', { name: 'Toggle history' });
        this.historyPanel = page.getByRole('region', { name: 'Full history log' });

        // Set up buttons
        this.buttons = {} as Record<ButtonLabel, Locator>;
        for (const label of buttonNames) {
            // All buttons use: <button data-value="X" aria-label="X">
            this.buttons[label] = page.locator(`[data-value='${label}']`);
        }
    }

    // Navigate to the calculator app
    async goto(): Promise<void> {
		// navigate relative to baseURL from playwright.config.ts
		await this.page.goto('/');

	}

    // Normalize parentheses symbols from actual input display to the button label
    private normalizeParentheses(parentheses: string): ButtonLabel {
        if (parentheses === '(' || parentheses === ')') {
            return '( )';
        }
        return parentheses as ButtonLabel;
    }

    // Press a button by label
    async press(label: ButtonLabel | string): Promise<void> {
        const normalized = this.normalizeParentheses(label);
        const button = this.buttons[normalized as ButtonLabel];
        if (!button) {
            throw new Error(`No button found for label: '${label}'`);
        }
        await button.click();
    }

    // Simulate a full sequence of button presses like "100+30="
    async pressSequence(sequence: string): Promise<void> {
        for (const char of sequence) {
            const normalized = this.normalizeParentheses(char);
            const button = this.buttons[normalized as ButtonLabel];
            if (!button) {
                console.error(`DEBUG: No button mapped for '${char}'`);
                throw new Error(`No button found for character: '${char}'`);
            }
            await button.click();
        }
    }

    // Simulate typing directly (keyboard input)
    async typeExpression(expr: string): Promise<void> {
        const normalized = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-');
        await this.page.keyboard.type(normalized);
    }

    // Get result text from result display
    async getResult(): Promise<string> {
        const result = await this.result.textContent();
        if (result) {
            return result.trim();
        }
        return '';
    }

    // Get recent history text from display
    async getRecentHistory(): Promise<string> {
        const history = await this.recentHistory.textContent();
        if (history) {
            return history.trim();
        }
        return '';
    }

    // Theme toggling
    // Toggles the theme by clicking the theme button and waits until the `dark-theme` class on <body> flips.
    async switchTheme(): Promise<void> {
        const previousDarkMode = await this.isDarkMode(); // Record whether dark mode is currently enabled
        await this.themeToggleBtn.click();

        // Wait until the body class changes from the previous value
        await this.page.waitForFunction(
            (expectedPrevious: boolean) => {
                return document.body.classList.contains('dark-theme') !== expectedPrevious;
            },
            previousDarkMode
        );
    }

    // Determine if dark mode is active
    async isDarkMode(): Promise<boolean> {
        return this.page.evaluate(() => {
            return document.body.classList.contains('dark-theme');
        });
    }

    // Toggles the visibility of the history panel by clicking its toggle button
    async toggleHistory(): Promise<void> {
        await this.historyToggleBtn.click();
    }

    // Returns whether the history panel currently has the `.visible` class
    async isHistoryVisible(): Promise<boolean> {
        return this.historyPanel.evaluate((element) => {
            return element.classList.contains('visible');
        });
    }

    // Ensures the history panel is open. If it's not visible, clicks the toggle and waits for the `.visible` class to appear.
    async openHistory(): Promise<void> {
        const currentlyVisible = await this.isHistoryVisible();
        if (!currentlyVisible) {
            await this.historyToggleBtn.click();
            await this.page.waitForFunction(() => {
                const panel = document.querySelector('#history-panel');
                return panel?.classList.contains('visible') === true;
            });
        }
    }

    // Ensures the history panel is closed. If it's visible, clicks the toggle and waits for the `.visible` class to be removed.
    async closeHistory(): Promise<void> {
        const currentlyVisible = await this.isHistoryVisible();
        if (currentlyVisible) {
            await this.historyToggleBtn.click();
            await this.page.waitForFunction(() => {
                const panel = document.querySelector('#history-panel');
                if (!panel) {
                    return true;
                }
                return panel?.classList.contains('visible') === false;
            });
        }
    }
}