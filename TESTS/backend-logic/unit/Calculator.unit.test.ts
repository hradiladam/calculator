// TESTS/backend-logic/unit/Calculator.unit.test.ts
// —— UNIT TESTS FOR Calculator.ts ——
// Verifies both correct results and error handling, plus integration with helper modules

import Calculator from '../../../apps/BACKEND/services/Calculator';
import * as prep from '../../../apps/BACKEND/utils/preprocessor';
import Validator from '../../../apps/BACKEND/utils/Validator';

describe('Calculator.evaluate()', () => {
    let calculator: Calculator;

    // Instantiate a fresh Calculator before each test
    beforeEach(() => {
        calculator = new Calculator();
    });

    // BASIC ARITHMETIC OPERATIONS - Class/module-level unit tests
    describe('basic operations', () => {
        test.each([
            ['5+3', '8', 'addition: 5 + 3 = 8'],
            ['5-3', '2', 'subtraction: 5 - 3 = 2'],
            ['5*3', '15', 'multiplication: 5 * 3 = 15'],
            ['10/2', '5', 'division: 10 / 2 = 5'],
            ['1+2-3*4/2', '-3', 'mixed operations: 1+2-3*4/2 = -3'],
            ])('returns "%s" → "%s" — %s', (input, expected, description) => {
            expect(calculator.evaluate(input)).toBe(expected);
        });
    });

    // PERCENTAGE BEHAVIOR- Class/module-level unit tests
    describe('percentage calculations', () => {
        test.each([
            ['100+20%', '120', 'addition: 100 + 20% = 120'],
            ['100-20%', '80', 'subtraction: 100 - 20% = 80'],
            ['200*10%', '20', 'multiplication: 200 * 10% = 20'],
            ['200/10%', '2000', 'division: 200 / 10% = 2000'],
            ['50%5', '2.5', 'implicit multiplication with percent: 50%5 = 2.5'], // 50% of 5 = 0.5 * 5 = 2.5
            ])('returns "%s" → "%s" — %s', (input, expected, description) => {
            expect(calculator.evaluate(input)).toBe(expected);
        });
    });

    // PARENTHESES GROUPING - Class/module-level unit tests
    describe('valid parentheses', () => {
        test.each([
            ['(2+3)*4', '20', 'simple grouping'],
            ['((1+2)*3)+4', '13', 'nested grouping'],
            ['(1+(2*(3+4)))', '15', 'multiple nested levels'],
            ])('returns "%s" → "%s" — %s', (input, expected, description) => {
            expect(calculator.evaluate(input)).toBe(expected);
        });
    });

    // PARENTHESES AND IMPLICIT MULTIPLICATION - Class/module-level unit tests
    describe('implicit multiplication', () => {
        test.each([
            ['5(2+3)', '25', 'number before parentheses: 5(2+3) = 25'],
            ['(2+3)4', '20', 'closing parentheses before number: (2+3)4 = 20'],
            ['(1+1)(2+2)', '8', 'parentheses back-to-back: (1+1)(2+2) = 8'],
            ])('returns "%s" → "%s" — %s', (input, expected, description) => {
            expect(calculator.evaluate(input)).toBe(expected);
        });
    });

    // SCIENTIFIC NOTATION FORMATTING - Class/module-level unit tests
    // Verify that very small and very large results are auto‑formatted in exponential notation
    describe('auto‑scientific formatting for extreme values', () => {
        test.each([
            // 0.00001 * 0.00001 = 0.0000000001 = 1e-10
            ['0.00001*0.00001', '1e-10', 'formats very small results in scientific notation'],

            // 100000 * 100000 = 10000000000 = 1e+10
            ['100000*100000', '1e+10', 'formats very large results in scientific notation'],

            // lowerExp = -6, so 1e-6 (0.000001) should NOT switch to exponential
            ['0.000001', '0.000001', 'preserves decimal notation at the lowerExp threshold'],

            // upperExp = 9, so 1e9 should switch to exponential
            ['1000000000', '1e+9', 'preserves decimal notation at the upperExp threshold'],
        ])('returns "%s" → "%s" — %s', (input, expected, description) => {
            expect(calculator.evaluate(input)).toBe(expected);
        });
    });

    // DECIMAL POINT PRECISION AND FORMATTING - Class/module-level unit tests
    describe('decimal point precision and formatting', () => {
        test('accurate precision', () => {
            // 0.1 + 0.2 results in 0.3 and not 0.03000000000001
            expect(calculator.evaluate('0.1+0.2')).toBe('0.3');
            });

            test('0.1 / 3 produces exactly 12 significant digits', () => {
            // 0.1 / 3 ≈ 0.0333333333333333… → "0.033333333333"
            expect(calculator.evaluate('0.1/3')).toBe('0.0333333333333');
            });

            test('rounds numbers with more than 12 significant digits', () => {
            // 2.3456789012345678 should be rounded to 12 digits: "2.34567890123"
            expect(calculator.evaluate('2.3456789012345678')).toBe('2.34567890123');
            });

            test('trims unnecessary trailing zeros', () => {
            // "1.2300" → "1.23"; "1.0000" → "1"
            expect(calculator.evaluate('1.2300')).toBe('1.23');
            expect(calculator.evaluate('1.0000')).toBe('1');
        });
    });

    // ERROR CONDITIONS - Class/module-level unit tests
    // Each of these inputs should trigger a specific error thrown by Calculator.evaluate()
    describe('error conditions', () => {
        test.each([
            ['10/0', "Can't divide by 0", 'division by zero'],
            ['5+', 'Incomplete expression', 'incomplete expression ending with operator'],
            ['(5+5', 'Unmatched parentheses', 'unmatched parentheses'],
            ['5+%', 'Misplaced percent sign', 'misplaced percent after operator'],
        ])('throws "%s" -> %s - %s', (input, expectedError, description) => {
            expect(() => calculator.evaluate(input)).toThrow(expectedError);
        });

        test('overflow leading to Infinity is caught', () => {
            // Very large multiplication to force Infinity
            const hugeNumber = '1' + '0'.repeat(1000);
            expect(() =>
            calculator.evaluate(`${hugeNumber}*${hugeNumber}`)
            ).toThrow('Infinity');
        });
    });


    // COLLABORATION WITH HELPER MODULES - Helper collaboration unit test
    // Unit tests verifying that Calculator uses its helpers correctly
    describe('collaboration with helper modules', () => {
        // Tests that evaluate() calls preprocess() with the raw input expression
        test('calls preprocess exactly once with the raw input', () => {
            // Spy on the preprocess function
            const spy = jest.spyOn(prep, 'preprocess');

            // Run evaluate; it should invoke preprocess('2+2')
            calculator.evaluate('2+2');

            // Assert it was called once with the exact original string
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('2+2');

            spy.mockRestore();
        });

        // Tests that evaluate() will throw an error if hasDivisionByZero() returns true
        test('short-circuits on division-by-zero via Validator', () => {
            // Force Validator.hasDivisionByZero() to return true, regardless of input
            const divZeroSpy = jest
                .spyOn(Validator.prototype, 'hasDivisionByZero')
                .mockReturnValue(true);

            // Pick a safe expression that would normally return 2,
            // but should throw due to the spy
            expect(() => calculator.evaluate('1+1')).toThrow("Can't divide by 0");

            divZeroSpy.mockRestore();
        });

        // Tests that evaluate() will throw an error if endsWithOperator() returns true
        test('short-circuits on incomplete expression via Validator', () => {
            const incompleteSpy = jest
                .spyOn(Validator.prototype, 'endsWithOperator')
                .mockReturnValue(true);

            expect(() => calculator.evaluate('1+1')).toThrow('Incomplete expression');

            incompleteSpy.mockRestore();
        });

        // Tests that evaluate() will throw an error if hasUnmatchedParentheses() returns true
        test('short-circuits on unmatched parentheses via Validator', () => {
            const parenSpy = jest
                .spyOn(Validator.prototype, 'hasUnmatchedParentheses')
                .mockReturnValue(true);

            expect(() => calculator.evaluate('2*3')).toThrow('Unmatched parentheses');

            parenSpy.mockRestore();
        });

        // Tests that evaluate() will throw an error if hasInvalidPercentUsage() returns true
        test('short-circuits on invalid percent usage via Validator', () => {
            const pctSpy = jest
                .spyOn(Validator.prototype, 'hasInvalidPercentUsage')
                .mockReturnValue(true);

            expect(() => calculator.evaluate('10+5')).toThrow('Misplaced percent sign');

            pctSpy.mockRestore();
        });
    });
});


// npx jest --selectProjects backend-logic --testPathPatterns=Calculator.unit.test.ts