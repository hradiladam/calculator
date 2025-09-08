// TESTS/api/endpoint/evaluate.endpoint.test.ts
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
    type Case = { expression: string; status: number; errorMsg: string; description: string };

        // Each case: [expression, expected HTTP status, expected error message substring, description]
        const cases: Case[] = [
            { expression: '    ', status: 400, errorMsg: 'Expression must be a non-empty string', description: 'rejects empty or whitespace-only expressions' },
			{ expression: '(2+3', status: 400, errorMsg: 'Unmatched parentheses',                 description: 'rejects unmatched parentheses' },
			{ expression: '5/0',  status: 400, errorMsg: "Can't divide by 0",                     description: 'rejects division by zero' },
			{ expression: '5+',   status: 400, errorMsg: 'Incomplete expression',                 description: 'rejects expressions ending with operator' },
			{ expression: '5+%',  status: 400, errorMsg: 'Misplaced percent sign',                description: 'rejects misplaced percent sign' },
        ];

        test.each(cases)('returns $status for "$expression" — $description', async ({ expression, status, errorMsg }) => {
            const res = await request(app)
				.post('/evaluate')
				.send({ expression })
				.expect(status);

            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toMatch(errorMsg); // Error string should contain the message
        });
    });
});



// npx jest TESTS/api/endpoint/evaluate.endpoint.test.ts


