//BACKEND/utils/Validator.ts

// —— HELPER VALIDATION FUNCTIONS ——
// Helper methods to validate expressions before evaluation


export default class Validator {
    // all operator symbols, dash escaped for regex
    static operatorChars: string = '+\\-*/×÷';

    // Return true if '(' and ')' count dont match
    hasUnmatchedParentheses(expr: string): boolean {
        const open = (expr.match(/\(/g) || []).length;
        const close = (expr.match(/\)/g) || []).length;
        return open !== close;
    }

    // return true if expression ends with an operator
    endsWithOperator(expr: string): boolean {
        const regex = new RegExp(`[${Validator.operatorChars}]\\s*$`);
        return regex.test(expr);
    }

    // return true if '%' appears right after operator or '('
    hasInvalidPercentUsage(expr: string): boolean {
        const regex = new RegExp(`[${Validator.operatorChars}(]\\s*%`);
        return regex.test(expr);
    }

    // return true if there's a direct "/0" division
    hasDivisionByZero(expr: string): boolean {
        return /\/\s*0+(?![.\d])/.test(expr);
    }

    // Return true if expression ends with '%' followed (possibly after spaces) by a '.' at end of string
    hasPercentDotAtEnd(expr: string): boolean {
        return /%\s*\.$/.test(expr);
    }   

    // Multiple operators in a row (any combination)
    hasConsecutiveOperators(expr: string): boolean {
        return new RegExp(`[${Validator.operatorChars}]{2,}`).test(expr);
    }

    // Multiple decimal points directly in a row
    hasMultipleDotsInARow(expr: string): boolean {
        return /\.\s*\./.test(expr);
    }

    // A number containing more than one decimal point
    hasNumberWithMultipleDecimals(expr: string): boolean {
        const tokens = expr.split(/[^0-9.]+/).filter(Boolean);
        return tokens.some(t => (t.match(/\./g) || []).length > 1);
    }

    // Illegal characters (anything outside digits, ops, (), ., %, whitespace)
    hasIllegalCharacters(expr: string): boolean {
        return /[^0-9\s.+\-*/×÷()%]/.test(expr);
    }

    /// Operator directly followed by a *bare* dot (e.g. "9+.")
    // Valid cases: "9+.5", "9+5.", "9+ .5", "9+ 5."
    hasOperatorFollowedByDot(expr: string): boolean {
        // Match: operator → optional spaces → dot → NOT followed by digit or end of number
        return new RegExp(`[${Validator.operatorChars}]\\s*\\.(?!\\d)`).test(expr);
    }
}