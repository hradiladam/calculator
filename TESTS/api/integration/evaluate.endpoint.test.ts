// TESTS/api/integration/evaluate.endpoint.test.ts
import request from 'supertest';
import app from '../../../BACKEND/app'; // Import the Express application (without starting the server)

// All tests for the evaluate endpoint
describe('POST /evaluate', () => {
    // Successful evaluation cases
    describe('successful expression evaluations', () => {
        test.each([
            ['2+2', '4', 'simple addition'],
            ['100+20%', '120', 'percentage addition'], // 100 + (100 * 20 / 100) = 120
            ['1/8', '0.125', 'trims trailing zeros but keeps precision'], // 1/8 = 0.125 exactly
            ['1/3', '0.333333333333', 'rounds to 12 significant digits by default'], // 1/3 → 0.333333333333
            ['2×3÷2', '3', 'normalizes × and ÷ operators'], // 2×3=6, 6÷2=3
            ['2(3+4)', '14', 'handles implicit multiplication'], // 2*(3+4)=14
        ])('returns "%s" → "%s" — %s', async (expression, expected, description) => {
            const res = await request(app)
                .post('/evaluate')
                .send({ expression })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toEqual({ result: expected }); // Result should match expected string
        });
  });

  // Error validation responses
  describe('validation and error handling', () => {
        test.each([
            // The validator in app.ts returns this exact error message
            ['    ', 400, 'Expression must be a non-empty string', 'rejects empty or whitespace-only expressions'],

            // Error message should mention "Unmatched parentheses"
            ['(2+3', 400, 'Unmatched parentheses', 'rejects unmatched parentheses'],

            // Semantic validation: can't divide by zero
            ['5/0', 400, "Can't divide by 0", 'rejects division by zero'],

            // Incomplete expression ends in '+'
            ['5+', 400, 'Incomplete expression', 'rejects expressions ending with operator'],

            // A percent sign immediately after operator is invalid
            ['5+%', 400, 'Misplaced percent sign', 'rejects misplaced percent sign'],
        ])('returns %d for "%s" — %s', async (expression, status, errorMsg, description) => {
            const res = await request(app)
                .post('/evaluate')
                .send({ expression })
                .expect(status);

            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch(errorMsg); // Error string should contain the message
        });
    });
});



// npx jest TESTS/api/integration/evaluate.endpoint.test.ts


