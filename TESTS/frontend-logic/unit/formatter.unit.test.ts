// TESTS/frontend-logic/unit/formatter.unit.test.ts
// —— Unit tests for formatter.ts ——

import { formatForHistory, formatForDisplay } from '../../../ts/modules/formatter';

describe('formatter', () => {

    // ——— Tests for formatting expressions shown in the "recent history" display
    describe('formatForHistory()', () => {
        // Inserts × between two adjacent percentages like 50%50%
        test('inserts " × " between two percentages', () => {
            expect(formatForHistory('50%50%')).toBe('50% × 50%');
        });

        // Inserts × between a percent and a number, e.g. 25%5 → 25% × 5
        test('inserts " × " between percent and number', () => {
            expect(formatForHistory('25%5')).toBe('25% × 5');
        });

        // Inserts × when a percent is followed by a parenthesis group
        test('inserts " × " when percent before "("', () => {
            expect(formatForHistory('10%(1+1)')).toBe('10% × (1 + 1)');
        });

        // Inserts × when a number is directly followed by a parenthesis group
        test('inserts " × " when number before "("', () => {
            expect(formatForHistory('2(1+1)')).toBe('2 × (1 + 1)');
        });

        // Inserts × between two closing+opening parentheses
        test('inserts " × " between ")(" sequences', () => {
            expect(formatForHistory('(1+1)(1+1)')).toBe('(1 + 1) × (1 + 1)');
        });

        // Inserts × between a closing parenthesis and a number
        test('inserts " × " between ")" and digit', () => {
            expect(formatForHistory('(1+1)9')).toBe('(1 + 1) × 9');
        });

        // Formats negative numbers as unary, without extra space
        test('formats negative numbers with unary minus (no space)', () => {
            expect(formatForHistory('-5')).toBe('-5');
            expect(formatForHistory('-123.45')).toBe('-123.45');
        });
    });

    // ——— Tests for formatting expressions in the current result display (user-facing UI formatting)
    describe('formatForDisplay()', () => {
        // Adds space padding around addition and subtraction operators
        test('adds spaces around "+,-" operators', () => {
            expect(formatForDisplay('1+2-3')).toBe('1 + 2 - 3');
        });

        // Converts raw "*" and "/" to the display-friendly "×" and "÷"
        test('converts "*" to "×" and "/" to "÷"', () => {
            expect(formatForDisplay('4*5/2')).toBe('4 × 5 ÷ 2');
        });

        // Normalizes existing × and ÷ to ensure proper spacing
        test('normalizes mixed operator styles', () => {
            expect(formatForDisplay('6×7÷3')).toBe('6 × 7 ÷ 3');
        });

        // Collapses any multiple spaces into a single space
        test('collapses multiple spaces into one', () => {
            expect(formatForDisplay('  1   +    2  ')).toBe('1 + 2');
        });

        // Removes unnecessary spaces at the start and end of input
        test('trims leading and trailing spaces', () => {
            expect(formatForDisplay('   9×9   ')).toBe('9 × 9');
        });

        // Prevents extra spaces in exponential notation like "1.2e+5"
        test('preserves compact scientific notation (e+5) without extra spaces', () => {
            expect(formatForDisplay('1.23e+5')).toBe('1.23e+5');
            expect(formatForDisplay('-9.8e-7')).toBe('-9.8e-7');
        });

        // Formats negative numbers as unary, without extra space
        test('formats negative numbers with unary minus (no space)', () => {
            expect(formatForDisplay('-5')).toBe('-5');
            expect(formatForDisplay('-123.45')).toBe('-123.45');
        });
    });

    //  —— Thousands separators and related edge cases in history formatting ——
    describe('formatForHistory() — thousands separators', () => {
        // Adds commas in plain integers inside expressions
        test('groups thousands in integers within expressions', () => {
            expect(formatForHistory('1000+2000')).toBe('1,000 + 2,000');
        });

        // Adds × and groups when percent is followed by a big number
        test('adds × and groups when percent before number', () => {
            expect(formatForHistory('50%1000')).toBe('50% × 1,000');
        });

        // Groups inside parentheses and inserts × between groups
        test('groups inside parentheses and between groups', () => {
            expect(formatForHistory('(1000)(2000)')).toBe('(1,000) × (2,000)');
        });

        // Leaves scientific notation unchanged (no spaces, no commas)
        test('preserves scientific notation with large magnitudes', () => {
            expect(formatForHistory('1e+6')).toBe('1e+6');
            expect(formatForHistory('-2.5e-4')).toBe('-2.5e-4');
        });
    });

    //  —— Thousands separators and related edge cases in display formatting  ——
    describe('formatForDisplay() — thousands separators', () => {
        // Groups a plain integer
        test('groups a plain integer', () => {
            expect(formatForDisplay('1000')).toBe('1,000');
        });

        // Groups large integers with decimals; only integer part is grouped
        test('groups integer part and preserves decimals', () => {
            expect(formatForDisplay('1234567.89')).toBe('1,234,567.89');
        });

        // Keeps unary minus tight and groups the magnitude
        test('keeps unary minus tight and groups', () => {
            expect(formatForDisplay('-1234567.89')).toBe('-1,234,567.89');
        });

        // Normalizes * and / with large numbers and groups properly
        test('normalizes operators and groups large numbers', () => {
            expect(formatForDisplay('1000*2000/10')).toBe('1,000 × 2,000 ÷ 10');
        });

        // Leaves scientific notation compact (no spaces around e+/-; no grouping)
        test('preserves scientific notation with large magnitudes', () => {
            expect(formatForDisplay('1e+6')).toBe('1e+6');
            expect(formatForDisplay('-2.5e-4')).toBe('-2.5e-4');
        });

        // Idempotence: formatting an already formatted string should not change it
        test('is idempotent on already formatted output', () => {
            const onceFormatted = formatForDisplay('1234567');
            expect(onceFormatted).toBe('1,234,567');
            const twiceFormatted = formatForDisplay(onceFormatted);
            expect(twiceFormatted).toBe(twiceFormatted);
        });
    });
});


// npx jest --selectProjects frontend-logic --testPathPatterns=formatter.unit.test.ts