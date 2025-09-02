// —— CALCULATOR ENDPOINT ——
// Encapsulates evaluation logic and formatting

import { create, all, MathJsInstance } from 'mathjs';
import Validator from '../utils/Validator';
import { preprocess } from '../utils/preprocessor'

export default class Calculator {
    private math: MathJsInstance;     // Declare the math.js instance type
    private validator: Validator;

    constructor() {
        // Initialize a math.js instance configured for high-precision BigNumber calculations
        this.math = create(all);
        this.math.config({ number: 'BigNumber', precision: 64 });

        // Create a Validator instance to check for bad inputs before we calculate
        this.validator = new Validator();
    }

    /**
        * Evaluate the given expression string:
        * 1. Run raw-input syntax checks
        * 2. Preprocess (normalize operators, expand % etc.)
        * 3. Run semantic/math-level checks
        * 4. Ask math.js to compute a BigNumber result
        * 5. Final check for infinities or NaN
        * 6. Format the final result for display
        */ 
    evaluate(raw: string): string {
        // ——— Phase 1 ———
        // Raw‑input syntax validation ———
        if (this.validator.hasPercentDotAtEnd(raw)) {
            throw new Error("Cannot end with '%.'");
        }

        if (this.validator.hasInvalidPercentUsage(raw)) {
            throw new Error('Misplaced percent sign');
        }

        if (this.validator.hasUnmatchedParentheses(raw)) {
            throw new Error('Unmatched parentheses');
        }

        if (this.validator.endsWithOperator(raw)) {
            throw new Error('Incomplete expression');
        }

        if (this.validator.hasIllegalCharacters(raw)) {
            throw new Error('Illegal character');
        }

        if (this.validator.hasConsecutiveOperators(raw)) {
            throw new Error('Consecutive operators');
        }

        if (this.validator.hasOperatorFollowedByDot(raw)) {
            throw new Error('Operator followed by dot');
        }

        if (this.validator.hasMultipleDotsInARow(raw)) {
            throw new Error('Multiple dots in a row');
        }
        
        if (this.validator.hasNumberWithMultipleDecimals(raw)) {
            throw new Error('Number with multiple decimals');
        }

        // ——— Phase 2 ———
        // Preprocess the expression - normalize & semantic validation - normalize operators, expand percentages, restore implicit multiplication
        const expr = preprocess(raw);

        // Semantic validation: catch direct division by zero
        if (this.validator.hasDivisionByZero(expr)) {
            throw new Error("Can't divide by 0");
        }
        
        // ——— Phase 3 ———
        // Actual evaluation
        const rawResult = this.math.evaluate(expr);

        // ——— Phase 4 ———
        // Final check for invalid result 
        const nativeResult = Number(rawResult);
        if (!isFinite(nativeResult)) {
            throw new Error('Infinity');
        }
        if (isNaN(nativeResult)) {
            throw new Error('Undefined result');
        }

        // ——— Phase 5 ———
        // Format the result with auto notation for display
        return this.math.format(rawResult, {
            notation: 'auto',
            precision: 12,     // Typical real-world display
            lowerExp: -6,      // Switch for tiny values
            upperExp: 9        // switch for billions and above
        });
    }
}
