// BACKEND/utils/preprocessor.ts
// —— PREPROCESSING HELPER ——


// Preprocesses an expression string by normalizing operators,expanding percentage arithmetic and implicit multiplication.
/**
 * Preprocess a raw input expression by:
 * - Normalizing operators (×, ÷ → *, /)
 * - Expanding percentage additions/subtractions
 * - Converting isolated percentages to fractions
 * - Restoring implicit multiplication
 * 
 * @param expr - The raw input expression (e.g., "100+20%")
 * @returns string - A cleaned and transformed expression ready for math.js
 */

export const preprocess = (expr: string): string => {
    // Step 1: Normalize × and ÷
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/');

    // Step 2: Apply "E ± Y%" → E*(1±Y/100), recursively,
    // but only if the Y% isn't immediately followed by * or /
    let prev: string;
    const pctExpand = /(\([^%]*\)%|\d+(?:\.\d+)?%|\d+(?:\.\d+)?|\([^%]*\))\s*([+\-])\s*(\d+(?:\.\d+)?)%(?!\s*[*\/])/g;
    do {
        prev = expr;
        expr = expr.replace(pctExpand, (_: string, base: string, op: string, pct: string) => {
        if (base.endsWith('%')) {
            const val = base.slice(0, -1);
            return `(${val}/100*(1${op}${pct}/100))`;
        }
        return `(${base}*(1${op}${pct}/100))`;
        });
    } while (expr !== prev);

    // Step 3: Convert any remaining "N%" or "(... )%" into division by 100
    do {
        prev = expr;
        expr = expr
        .replace(/(\([^()]*\))%/g, '($1/100)')
        .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    } while (expr !== prev);

    // Step 4: Restore implicit multiplication: 2(3) → 2*(3), etc.
    expr = expr
        .replace(/(\d|\))\s*\(/g, '$1*(')
        .replace(/\)\s*(\d)/g, ')*$1')
        .replace(/\)\s*\(/g, ')*(');

    return expr;
}