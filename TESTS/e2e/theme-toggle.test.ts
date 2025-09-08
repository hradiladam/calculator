// TESTS/e2e/theme-toggle.test.ts
// ——— THEME TOGGLE TESTS (Dark/Light) ———


import { test, expect } from '@playwright/test';
import { CalculatorPage } from './page/CalculatorPage';

// —— DESCRIBE BLOCK ——
// A group of related tests. In this case, everything related to the theme switch feature.
test.describe('Theme Toggle', () => {
    let calculator: CalculatorPage;    // Declare variable for the page object

    // —— Setup: Create a new CalculatorPage before every test ——
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);  // Use the Page Object pattern for clean selectors and actions
        await calculator.goto()                 // Navigate to the calculator app
    });

    // TEST 1: Confirm that clicking the theme switch button applies the `.dark-theme` class to <body>
    test('adds dark-theme', async ({page }) => {
        // A. Check that we are initially in light mode
        const initiallyDark = await page.evaluate(() => {
            return document.body.classList.contains('dark-theme');   // Returns true/false depending on whether <body> has the 'dark-theme' class
        });
        expect(initiallyDark).toBeFalsy();

        // B. Click the theme switch
        await calculator.switchTheme();

        // C. Check if the there switched to dark
        const isDark = await page.evaluate(() => {
            return document.body.classList.contains('dark-theme')
        });
        expect(isDark).toBeTruthy();   // Should be true (which is truthy) 
    });

    
    // TEST 2: Toggle removes dark theme on second click
    test('removes dark-theme', async ({page }) => {
        // A. Ensure we start in light mode
        const initiallyDark = await page.evaluate(() => {
            return document.body.classList.contains('dark-theme')
        })
        expect(initiallyDark).toBeFalsy();

        // B. First click — enables dark mode
        await calculator.switchTheme();

        const afterFirstToggle = await page.evaluate(() => {
            return document.body.classList.contains('dark-theme')
        });
        expect(afterFirstToggle).toBeTruthy(); // Dark theme should now be active

        // C. Second click — disables dark mode again
        await calculator.switchTheme();

        const afterSecondClick = await page.evaluate(() => {
            return document.body.classList.contains('dark-theme') 
        });
        expect(afterSecondClick).toBeFalsy();
    });


    // TEST 3 - Icon switches from moon to sun and back
    test('switches from moon to sun and back', async ({page }) => {
        // A. Ensure we start in light mode
        const initiallyDark = await page.evaluate(() => {
            return document.body.classList.contains('dark-theme')
        })
        expect(initiallyDark).toBeFalsy();

        // B. Swict hto dark mode and
        await calculator.switchTheme();

        // C. Check the icon: it should now be the SUN icon (means "click to return to light")
        const iconHtmlAfterSwitchingDark = await calculator.themeToggleBtn.innerHTML();
        expect(iconHtmlAfterSwitchingDark).toContain('fa-sun'); // because we are now in dark mode

        // D. Second click — disables dark mode again
        await calculator.switchTheme();

        // Check the icon again: should be the MOON icon (means "click to go to dark mode")
        const iconHtmlAfterSwitchingLight = await calculator.themeToggleBtn.innerHTML();
        expect(iconHtmlAfterSwitchingLight).toContain('fa-moon'); // because we are now in light mode
    });


    // TEST 4 - Theme switch doesn’t reset input
    test('switch doesnt reset input', async ({page }) => {
        // A. Enter minimal inmput (just '1') using a test step
        await test.step('Setup: enter digit 1 into calculator', async () => {
            await calculator.press('1');
        } )

        // B. Read current input from result display (should be "1" as pressed input is technically already in the result display)
        const beforeThemeSwitch = await calculator.getResult();
        expect(beforeThemeSwitch).toBe('1'); 

        // C. Toggle the theme (light → dark or vice versa)
        await test.step('Action: toggle theme', async () => {
            await calculator.switchTheme();
        })

        // D. Verify that the input is still the same ("1")
        const afterThemeSwitch = await calculator.getResult();
        expect(afterThemeSwitch).toBe('1'); // Theme switch should NOT reset the input
    });
});


// PLAYWRIGHT CODEGEN: "npx playwright codegen https://hradiladam.github.io/calculator/"
// npx playwright test TESTS/e2e/theme-toggle.test.ts --config=playwright.config.ts --project=e2e-Chromium





