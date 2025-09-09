// TESTS/e2e/expression-evaluation.test.ts
// ——— EXPRESSION EVALUATION END-TO-END TESTS ———

import { test, expect } from '@playwright/test';
import { CalculatorPage } from './page/CalculatorPage';

let calculator: CalculatorPage;

test.describe('Expression Evaluation (End-to-End)', () => {
    test.beforeEach(async ({ page }) => {
        calculator = new CalculatorPage(page);
        await calculator.goto();
    });


    // 100 + 25% = → should yield 125 in 'discount style' % logic for + and -
    test('100 + 25% = 125', async () => {
        await test.step('enter expression', async () => {
        await calculator.pressSequence('100+25%=');
        });

        await test.step('check result is 125', async () => {
        await expect(calculator.result).toHaveText('125');
        });
    }); 
        

    // 100 × 25% = → should yield 25 in 'traditional' % logic for * and /
    test('100 × 25% = 25', async () => {
        await test.step('enter expression', async () => {
        await calculator.pressSequence('100×25%=');
        });

        await test.step('check result is 25', async () => {
        await expect(calculator.result).toHaveText('25');
        });
    });


    // (100 + (50 + 10%))% → evaluates correctly
    test('evaluates complex nested percent expression', async () => {
        await calculator.pressSequence('(100+(50+10%))%=');
        await expect(calculator.result).toHaveText('1.55');
    });


    // (2 + 3)(4 + 5) → 5 × 9 = 45
    test('evaluates implicit multiplication between parens', async () => {
        await calculator.pressSequence('(2+3)(4+5)=');
        await expect(calculator.result).toHaveText('45');
    });


    // (50 + 10)% → 60%
    test('evaluates percent after closing parenthesis', async () => {
        await calculator.pressSequence('(50+10)%=');
        await expect(calculator.result).toHaveText('0.6');
    });


    // 4×(2+1) → 12
    test('evaluates operator before parenthesis', async () => {
        await calculator.pressSequence('4×(2+1)=');
        await expect(calculator.result).toHaveText('12');
    });


    // (100+20%)(1+5%) → 120 × 1.05 = 126
    test('evaluates complex nested + implicit multiply + percent', async () => {
        await calculator.pressSequence('(100+20%)(1+5%)=');
        await expect(calculator.result).toHaveText('126');
    });


    // (10+50%×10×50%  → 12.5
    test('evaluates mixed + and × with percent', async () => {
        await calculator.pressSequence('10+50%×10×50%=');
        await expect(calculator.result).toHaveText('12.5');
    });


    // (1000 + 50%  → 1,500
    test('evaluates grouping by thousands in result', async () => {
        await calculator.pressSequence('1000+50%=');
        await expect(calculator.result).toHaveText('1,500');
    });
});


// npx playwright test TESTS/e2e/expression-evaluation.test.ts --config=playwright.config.ts --project=e2e-chromium

