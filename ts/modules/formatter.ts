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

export function formatForHistory(expr: string): string {
    return MULT_RULES.reduce((s, rule) => s.replace(rule.from, rule.to), expr);
}

export function formatForDisplay(expr: string): string {
    return expr
        .replace(/([+\-*/])/g, ' $1 ')
        .replace(/×|\*/g, ' × ')
        .replace(/÷|\//g, ' ÷ ')
        .replace(/\s+/g, ' ')
        .trim();
}