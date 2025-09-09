// TESTS/backend-logic/unit/preprocessor.unit.test.ts
// —— UNIT TESTS FOR preprocessor.ts ——
// These tests verify correct transformation of expressions for math.js

import { preprocess } from '../../../apps/BACKEND/utils/preprocessor';

describe('preprocess()', () => {
    // Test normalization of display operators to standard math symbols
    test.each([
        ['3×4÷2', '3*4/2', 'normalizes × and ÷ to * and /'],
    ])('returns "%s" → "%s" — %s', (input, expected, description) => {
        expect(preprocess(input)).toBe(expected);
  });

  // Test expansion of "E + Y%" → E*(1+Y/100)
  // This models percentage addition as a discount-style operation
  // Test expansion of "E - Y%" → E * (1 - Y/100)
  // This models percentage subtraction as a discount-style operation
  test.skip.each([
        ['100 + 20%', '100*(1+20/100)', 'expands percentage addition'],
        ['100 - 20%', '100*(1-20/100)', 'expands percentage subtraction'],
    ])('returns "%s" → "%s" — %s', (input, expected, description) => {
        expect(preprocess(input)).toBe(expected);
  });

  // Test: Nested percentage additions are expanded in multiple passes.
  // For example: ((100 + 20%) + 10%) 
  // First expands to: (100 * (1 + 20/100)) 
  // Then that result is treated as a new base and expanded again with 10%: 
  // Final result: ((100 * (1 + 20/100)) * (1 + 10/100))
  test.skip.each([
        ['((100 + 20%) + 10%)', '(((100*(1+20/100)))*(1+10/100))', 'expands nested percentage additions'],
    ])('returns "%s" → "%s" — %s', (input, expected, description) => {
        expect(preprocess(input)).toBe(expected);
  });

  // Test conversion of isolated percentages (e.g., "25%" → "25/100")
  test.skip.each([
        ['25%', '25/100', 'converts standalone percent to /100'],
        ['(40)%', '(40)/100', 'converts parenthesized percent to /100'],
    ])('returns "%s" → "%s" — %s', (input, expected, description) => {
        expect(preprocess(input)).toBe(expected);
  });

  // TO DO:
    // fix the way preprocessor put outside parentheses around each epxpression that has any parentheses. 
    // - Cosmetic issue, since mathjs removes them later anyway

    
  // Test implicit multiplication: 2(3+1) → 2*(3+1), (a)(b) → (a)*(b), etc.
  test.skip.each([
        ['2(3+1)', '2*(3+1)', 'restores implicit multiplication between number and parens'],
        ['(2+1)(4+5)', '(2+1)*(4+5)', 'restores implicit multiplication between parenthetical groups'],
        ['(2+1)4', '(2+1)*4', 'restores implicit multiplication between parens and trailing number'],
    ])('returns "%s" → "%s" — %s', (input, expected, description) => {
        expect(preprocess(input)).toBe(expected);
  });

  // Test combined behavior: nested percent, implicit multiplication, operator normalization
  test.skip.each([
        ['((100+20%)(5+5%)+30%)', '(((100*(1+20/100)))*((5*(1+5/100)))*(1+30/100))', 'handles mixed complex case'],
    ])('returns "%s" → "%s" — %s', (input, expected, description) => {
        expect(preprocess(input)).toBe(expected);
    });
});


// npx jest --selectProjects backend-logic --testPathPatterns=preprocessor.unit.test.ts
