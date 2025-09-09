// ts/modules/formatter.ts
// ——— Centralizes display and history formatting ———

type MultRule = {
    from: RegExp;
    to: string;
};

const MULT_RULES: MultRule[] = [
    { from: /(\d+%)\s*(\d+%)/g, to: '$1 × $2' },    // percent followed by percent
    { from: /(\d+%)\s*(\d+)/g, to: '$1 × $2' },     // percent followed by number
    { from: /(\d+%)\s*\(/g, to: '$1 × ('  },        // percent before '('
    { from: /([0-9%])\s*\(/g, to: '$1 × ('  },      // number/percent before '('
    { from: /\)\s*\(/g, to: ') × ('  },             // ')(' → ') × ('
    { from: /\)\s*([0-9%])/g, to: ') × $1' }        // ')9' or ')%' → ') × 9/%'
];


/**
* Inserts commas into the integer part of all plain numbers in a string (e.g., 1000 -> 1,000).
* - Leaves scientific notation (e/E) untouched.
* - Works with negatives and decimals.
*/
const groupThousandsInNumbers = (s: string): string => {
    return s.replace(/-?\d+(?:\.\d+)?/g, (matchedNumber) => {
        if (/[eE]/.test(matchedNumber)) return matchedNumber;            // If the number contains scientific notation (e or E), return it as-is
        const [intPartRaw, dec] = matchedNumber.split('.');              // Split into integer and decimal parts (if any)
        const sign = intPartRaw.startsWith('-') ? '-' : '';              // Keep track of negative sign separately, so we can reapply it after grouping
        const intPart = intPartRaw.replace('-', '');                     // Strip '-' from the integer part so grouping regex isn't confused
        const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');   // Insert commas every three digits from the right (standard thousands separator)
        return sign + grouped + (dec ? '.' + dec : '');                  // Reattach sign and decimal part (if present) and return the formatted number
    });
}

/**
 * Prepares operators and symbols for display by:
 * - Adding spaces around binary + - × ÷
 * - Keeping unary minus tight (e.g., -5, (-3))
 * - Normalizing * to × and / to ÷
 * - Preserving compact scientific notation (e.g., 1.23e+5)
 * - Collapsing multiple spaces and trimming ends
 */
const prepareOperatorsForDisplay = (expr: string): string => {

    // ——— Guard ———
    if (!expr) return expr;   // If the string is empty or falsy, skip formatting

    // ——— Step 1: Normalize ASCII multiply/divide to symbols ———
    // We replace these first so all later logic only deals with × and ÷
    let s = expr
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');

    // ——— Step 2: Handle + and - operators carefully ———
    // We use a callback so we can decide if each + or - is binary, unary, or part of exponent notation
    s = s.replace(/[+\-]/g, (op, idx) => {
        const prev = s[idx - 1]; // char before operator

        // — Case A: Scientific notation, e.g., "1.23e+5" —
        // If preceded by 'e' or 'E', keep compact (no added spaces)
        const isExponent = (op === '+' || op === '-') && (prev === 'e' || prev === 'E');
        if (isExponent) {
            return op;
        }

        // — Case B: Unary minus, e.g., "-5" or "(-3)" —
        if (op === '-') {
            // Find previous non-space character
            const left = s.slice(0, idx).trimEnd().slice(-1);

            // It's unary if at start OR follows another operator or '('
            const isUnary = !left || ['(', '+', '-', '×', '÷'].includes(left);
            if (isUnary) {
                return '-'; // keep tight
            }
        }

        // — Case C: Binary operator —
        // Default: add spaces for readability
        return ` ${op} `;
    });

    // ——— Step 3: Ensure spacing around × and ÷ ———
    // At this point, they should only be binary, so safe to space them
    s = s
        .replace(/×/g, ' × ')
        .replace(/÷/g, ' ÷ ');

    // ——— Step 4: Cleanup ———
    // Collapse multiple spaces into one and trim ends
    s = s
        .replace(/\s+/g, ' ')
        .trim();

    return s;
};


/**
 * Formats expressions for the recent-history (one-line) display.
 * 1. Applies implicit multiplication formatting rules (MULT_RULES)
 * 2. Normalizes operators and spacing for consistent visual output
 * 3. Adds thousands separators to all plain numbers
 */
export const formatForHistory = (expr: string): string => {
    const withImplicitMult = MULT_RULES.reduce((s, rule) => s.replace(rule.from, rule.to), expr);
    const prepared = prepareOperatorsForDisplay(withImplicitMult);
    return groupThousandsInNumbers(prepared);
}


/**
 * Formats expressions for the main calculator display.
 * 1. Normalizes operators and spacing for consistent visual output
 * 2. Adds thousands separators to all plain numbers
 */
export const formatForDisplay = (expr: string): string => {
    const prepared = prepareOperatorsForDisplay(expr);
    return groupThousandsInNumbers(prepared);
}


/**
 * Formats a standalone numeric value (e.g., a final calculation result).
 * - Useful for history panel results or anywhere a plain number should show commas
 */
export const formatThousands = (s: string): string => {
    return groupThousandsInNumbers(s);
}