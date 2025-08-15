// ts/modules/formatter.ts
// ——— Centralizes display and history formatting ———
const MULT_RULES = [
    { from: /(\d+%)\s*(\d+%)/g, to: '$1 × $2' }, // percent followed by percent
    { from: /(\d+%)\s*(\d+)/g, to: '$1 × $2' }, // percent followed by number
    { from: /(\d+%)\s*\(/g, to: '$1 × (' }, // percent before '('
    { from: /([0-9%])\s*\(/g, to: '$1 × (' }, // number/percent before '('
    { from: /\)\s*\(/g, to: ') × (' }, // ')(' → ') × ('
    { from: /\)\s*([0-9%])/g, to: ') × $1' } // ')9' or ')%' → ') × 9/%'
];
/**
* Inserts commas into the integer part of all plain numbers in a string (e.g., 1000 -> 1,000).
* - Leaves scientific notation (e/E) untouched.
* - Works with negatives and decimals.
*/
const groupThousandsInNumbers = (s) => {
    return s.replace(/-?\d+(?:\.\d+)?/g, (matchedNumber) => {
        if (/[eE]/.test(matchedNumber))
            return matchedNumber; // If the number contains scientific notation (e or E), return it as-is
        const [intPartRaw, dec] = matchedNumber.split('.'); // Split into integer and decimal parts (if any)
        const sign = intPartRaw.startsWith('-') ? '-' : ''; // Keep track of negative sign separately, so we can reapply it after grouping
        const intPart = intPartRaw.replace('-', ''); // Strip '-' from the integer part so grouping regex isn't confused
        const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Insert commas every three digits from the right (standard thousands separator)
        return sign + grouped + (dec ? '.' + dec : ''); // Reattach sign and decimal part (if present) and return the formatted number
    });
};
/**
 * Prepares operators and symbols for display by:
 * - Adding spaces around + - * /
 * - Normalizing * to ×
 * - Normalizing / to ÷
 * - Collapsing multiple spaces into one
 * - Trimming leading/trailing spaces
 */
const prepareOperatorsForDisplay = (expr) => {
    return expr
        .replace(/([+\-*/])/g, ' $1 ') // space around + - * /
        .replace(/×|\*/g, ' × ') // normalize * to ×
        .replace(/÷|\//g, ' ÷ ') // normalize / to ÷
        .replace(/\s+/g, ' ') // collapse multiple spaces into one
        .trim();
};
/**
 * Formats expressions for the recent-history (one-line) display.
 * 1. Applies implicit multiplication formatting rules (MULT_RULES)
 * 2. Normalizes operators and spacing for consistent visual output
 * 3. Adds thousands separators to all plain numbers
 */
export const formatForHistory = (expr) => {
    const withImplicitMult = MULT_RULES.reduce((s, rule) => s.replace(rule.from, rule.to), expr);
    const prepared = prepareOperatorsForDisplay(withImplicitMult);
    return groupThousandsInNumbers(prepared);
};
/**
 * Formats expressions for the main calculator display.
 * 1. Normalizes operators and spacing for consistent visual output
 * 2. Adds thousands separators to all plain numbers
 */
export const formatForDisplay = (expr) => {
    const prepared = prepareOperatorsForDisplay(expr);
    return groupThousandsInNumbers(prepared);
};
/**
 * Formats a standalone numeric value (e.g., a final calculation result).
 * - Useful for history panel results or anywhere a plain number should show commas
 */
export const formatThousands = (s) => {
    return groupThousandsInNumbers(s);
};
