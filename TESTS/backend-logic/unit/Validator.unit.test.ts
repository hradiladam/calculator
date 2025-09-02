// TESTS/backend-logic/Validator.unit.test.ts
//  —— UNIT TESTS FOR Validator.ts ——
// These tests verify all validation methods used before evaluating math expressions.

import Validator from '../../../BACKEND/utils/Validator';


describe('Validator', () => {
    let validator: Validator;

    // Create a fresh validator instance before each test
    beforeEach(() => {
        validator = new Validator;
    });

    // Test of unmatched parentheses
    describe('hasUnmatchedParentheses', () => {
        test.each([
            ['(1+2', true, 'unmatched opening parenthesis'],
            ['(1+2)', false, 'properly matched parentheses'],
            ['((1+2)', true, 'nested unmatched open paretheses'],
            ['1+2)', true, 'unmatched closing parenthesis'],
        ])('returns %s for "%s" - %s', (input, expected, description) => {
            expect(validator.hasUnmatchedParentheses(input)).toBe(expected);
        });
    });

    // Test of invalid operator usage
    describe('endsWithOperator', () => {
        test.each([
            ['1+', true, 'trailing "+" operator'],
            ['3*', true, 'trailing "*" operator with space'],
            ['4+5', false, 'complete binary expression'],
        ])('returns %s for "%s" - %s', (input, expected, description) => {
            expect(validator.endsWithOperator(input)).toBe(expected);
        });
    });

    // Test of invalidf percentage placements
    describe('hasInvalidePercentUsage', () => {
        test.each([
            ['1+%', true, 'percent sign directly after operator'],
            ['(%20+5)', true, 'percent sign directly after open parenthesis'],
            ['5+20%', false, 'valid percent usage after number'],
            ['(100+50)%', false, 'valid percent after closing parenthesis'],
        ])('returns %s for "%s" - %s', (input, expected, description) => {
            expect(validator.hasInvalidPercentUsage(input)).toBe(expected);
        });
    });
    

    // Test of dividing by zero
    describe('hasDivisionByZero', () => {
        test.each([
            ['10/0', true, 'simple division by zero'],
            ['10/000', true, 'division by zero with multiple zeros'],
            ['100/2', false, 'valid integer division'],
            ['5/0.5', false, 'valid division by a non-zero decimal'],
        ])('returns %s for "%s" - %s', (input, expected, description) => {
            expect(validator.hasDivisionByZero(input)).toBe(expected);
        });
    });


    // Multiple operators in a row (no spaces allowed)
    describe('hasConsecutiveOperators', () => {
        test.each([
            ['1++2', true, 'double plus'],
            ['3+-4', true, 'plus then minus'],
            ['5/**2', true, 'slash then star then star'],
            ['7×÷2', true, 'unicode multiply/divide pair'],
            ['9 + - 3', false, 'operators separated by spaces are not counted'],
            ['1+2', false, 'single operator between numbers'],
        ])('returns %s for "%s" - %s', (input, expected) => {
            expect(validator.hasConsecutiveOperators(input)).toBe(expected);
        });
    });

    // Multiple decimal points directly in a row
    describe('hasMultipleDotsInARow', () => {
        test.each([
            ['1..2', true, 'two dots contiguous'],
            ['.', false, 'single dot alone'],
            ['0.5 + 1.25', false, 'valid single decimals'],
        ])('returns %s for "%s"', (input, expected) => {
            expect(validator.hasMultipleDotsInARow(input)).toBe(expected);
        });
    });

    // A number containing more than one decimal point
    describe('hasNumberWithMultipleDecimals', () => {
        test.each([
            ['12.3.4 + 1', true, 'token with two dots'],
            ['0.1.2', true, 'multiple decimals in a single token'],
            ['10.5+2', false, 'single decimal is fine'],
            ['.5+1.0', false, 'leading dot style decimals'],
        ])('returns %s for "%s"', (input, expected) => {
            expect(validator.hasNumberWithMultipleDecimals(input)).toBe(expected);
        });
    });

    // Illegal characters
    describe('hasIllegalCharacters', () => {
        test.each([
            ['2,5+1', true, 'comma is illegal'],
            ['abc+1', true, 'letters are illegal'],
            ['5$3', true, 'currency symbol'],
            ['(2+3)*4%-1.5', false, 'only allowed chars'],
        ])('returns %s for "%s"', (input, expected) => {
            expect(validator.hasIllegalCharacters(input)).toBe(expected);
        });
    });

    // Operator followed by a dot (e.g. "9+.", "*.")
    describe('hasOperatorFollowedByDot', () => {
        test.each([
            ['9+.', true, 'bare dot after operator'],
            ['÷.+2', true, 'dot not followed by digit'],
            ['1+.5', false, 'decimal starting with dot is valid'],
            ['1+.5', false, 'dot with spaces before digit is valid'],
            ['9+5.', false, 'number ending with dot is valid'],
            ['9+5.', false, 'number ending with dot after space is valid'],
            ['2*0.5', false, 'normal decimal'],
        ])('returns %s for "%s" - %s', (input, expected) => {
            expect(validator.hasOperatorFollowedByDot(input)).toBe(expected);
        });
    });
});


// npx jest --selectProjects backend-logic --testPathPatterns=Validator.unit.test.ts







