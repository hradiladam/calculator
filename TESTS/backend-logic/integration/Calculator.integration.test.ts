// TESTS/backend-logic/integration/Calculator.component.test.ts
// — INTEGRATION TEST FOR Calculator.ts —
// Verifies the end‑to‑end evaluation pipeline of the Calculator service:
// 1) Raw syntax checks via Validator
// 2) Expression normalization via preprocessor
// 3) High‑precision calculation via math.js
// We spy on the internal math.evaluate method to ensure Calculator delegates
// to math.js correctly without modifying its behavior.

import Calculator from '../../../BACKEND/services/Calculator';
import Validator from '../../../BACKEND/utils/Validator';
import * as preprocessor from '../../../BACKEND/utils/preprocessor';

describe('Calculator component behavior', () => {
	let calculator: Calculator;
	let evalSpy: jest.SpyInstance;
	let mathInstance: any;  // Reference to the private math.js engine inside Calculator

	beforeEach(() => {
		// 1) Instantiate Calculator, which internally constructs and configures math.js
		calculator = new Calculator();

		// 2) Bypass TypeScript private restriction to grab the math.js object
		mathInstance = (calculator as any).math;

		// 3) Save a bound reference to the original evaluate() method
		const originalEvaluate = mathInstance.evaluate.bind(mathInstance);

		// 4) Track calls to mathInstance.evaluate without changing its behavior
		evalSpy = jest  
			.spyOn(mathInstance, 'evaluate')    // Wrap the existing evaluate() method in a Jest spy so Jest can see when it's called
            // The spy now tracks call count, arguments, etc., but by default still invokes the original implementation.
			.mockImplementation((...args: any[]) => {   // Replace evaluate() with this function:
                // originalEvaluate is the real evaluate() method we saved earlier
                // By calling it here, we keep the exact same math.js behavior
                return originalEvaluate(...args);  
            });
	    });

	afterEach(() => {
		// restore all spies/mocks
		jest.restoreAllMocks();
	});

	// Basic sanity: Validator should catch bad syntax, preprocessor should normalize operators
	test('sanity: Validator + preprocess', () => {
		const raw = '100+20%';
		expect(new Validator().hasUnmatchedParentheses(raw)).toBe(false);
		expect(new Validator().endsWithOperator(raw)).toBe(false);
		expect(new Validator().hasInvalidPercentUsage(raw)).toBe(false);
		expect(preprocessor.preprocess('3×4÷2')).toBe('3*4/2');
	});

	// Happy‑path evaluations
	test.each([
		['3×4+5%',     '12.6'],
		['((1+2)*3)+4','13'],
		['2(3+1)',     '8'],
		['0.1/3',      '0.0333333333333'],
	])('"%s" → "%s"', (input, expected) => {
		const result = calculator.evaluate(input);
		expect(evalSpy).toHaveBeenCalled();
		expect(result).toBe(expected);
	});

	// Error cases
	test.each([
		['5/0',   "Can't divide by 0"],
		['2+',    'Incomplete expression'],
		['(1+2',  'Unmatched parentheses'],
		['+%5',   'Misplaced percent sign'],
		['5%.',   "Cannot end with '%.'"],
	])('"%s" throws "%s"', (input, errorMessage) => {
		expect(() => calculator.evaluate(input)).toThrow(errorMessage);
		if (input === '5/0') {
			expect(evalSpy).not.toHaveBeenCalled();
		}
	});

	// Full pipeline: raw validation → preprocess → math.evaluate
	test.each([
        // [ raw input, expected preprocessed, expected final result ]
        ['100+20%', '(100*(1+20/100))', '120'],
        ['50-10%',  '(50*(1-10/100))',  '45'],
        ['200*10%', '200*(10/100)',     '20'],
        ['0.1/3',   '0.1/3',            '0.0333333333333'],
        ['2(3+1)',  '2*(3+1)',          '8'],
    ])(
        'full pipeline "%s" → preprocess "%s" → result "%s"',
        (raw, processed, expectedREsult) => {

            // Spy on every step
            const unmatchedSpy  = jest.spyOn(Validator.prototype, 'hasUnmatchedParentheses');
            const endsOpSpy     = jest.spyOn(Validator.prototype, 'endsWithOperator');
            const invalidPctSpy = jest.spyOn(Validator.prototype, 'hasInvalidPercentUsage');
            const divZeroSpy    = jest.spyOn(Validator.prototype, 'hasDivisionByZero');
            const preprocessSpy = jest.spyOn(preprocessor, 'preprocess');

            // Execute the full evaluate pipeline
            const result = calculator.evaluate(raw);

            // 1) Raw‐input syntax checks
            expect(unmatchedSpy).toHaveBeenCalledWith(raw);
            expect(endsOpSpy).toHaveBeenCalledWith(raw);
            expect(invalidPctSpy).toHaveBeenCalledWith(raw);

            // 2) Preprocessing
            expect(preprocessSpy).toHaveBeenCalledWith(raw);

            // 3) Division‐by‐zero guard on the preprocessed string
            expect(divZeroSpy).toHaveBeenCalledWith(processed);

            // 4) math.js evaluation with the exact preprocessed expression
            expect(evalSpy).toHaveBeenCalledWith(processed);

            // 5) Final formatted result
            expect(result).toBe(expectedREsult);
        }
    );
});

// Run with:
// npx jest --selectProjects backend-logic --testPathPatterns=Calculator.integration.test.ts