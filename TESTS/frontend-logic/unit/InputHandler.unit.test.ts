// TESTS/frontend-logic/unit/InputHandler.unit.test.ts
// —— UNIT TESTS FOR InputHandler.ts ——
//
// This suite tests the handleButtons() method, the main entry point for handling calculator input.
//
// It checks whether InputHandler responds correctly to different button presses by:
//   • Handling clear ("AC") and delete ("⌫") commands
//   • Appending new input using _appendValue(), which routes to helpers like:
//       – _handleNumber()
//       – _handleOperator()
//       – _handleDecimal()
//       – _handlePercentage()
//       – _handleParentheses()
//   • Handling error states and preventing invalid input after an error
//   • Updating the display through DisplayControl.update() after every interaction
//
// These tests confirm that InputHandler correctly delegates to helper methods and external modules,
// modifies the internal State properly, and ensures the display stays in sync with user input.

import InputHandler from '../../../apps/FRONTEND/ts/modules/InputHandler';
import State from '../../../apps/FRONTEND/ts/modules/State';
import DisplayControl from '../../../apps/FRONTEND/ts/modules/DisplayControl';

describe('InputHandler.handleButtons() – unit tests', () => {
    let state: State;
    let display: jest.Mocked<DisplayControl>;
    let handler: InputHandler;

    beforeEach(() => {
        state = new State();

        display = {
            clearAll: jest.fn(),
            backspace: jest.fn(),
            update: jest.fn(),
            resultElement: document.createElement('div'),
            historyElement: document.createElement('div'),
        } as unknown as jest.Mocked<DisplayControl>;

        // Pass a dummy evaluator since we never invoke '=' here
        handler = new InputHandler(state, {} as any, display);
    });

    // —— Tests for the "AC" and "⌫" buttons ——
    describe('clear & delete commands', () => {
        test('AC calls clearAll() then update()', () => {
            handler.handleButtons('AC');
            expect(display.clearAll).toHaveBeenCalledTimes(1);
            expect(display.update).toHaveBeenCalledTimes(1);
        });

        test('⌫ calls backspace() then update()', () => {
            handler.handleButtons('⌫');
            expect(display.backspace).toHaveBeenCalledTimes(1);
            expect(display.update).toHaveBeenCalledTimes(1);
        });
    });

    // —— Tests for numeric and operator input logic ——
    describe('appending values', () => {
        test('digit replaces initial "0" and calls update()', () => {
            handler.handleButtons('7');
            expect(state.currentInput).toBe('7');
            expect(display.update).toHaveBeenCalled();
        });

        test('insputing multiple operators in a row is not allowed', () => {
            handler.handleButtons('1');
            handler.handleButtons('+');
            handler.handleButtons('×');
            handler.handleButtons('-');
            handler.handleButtons('1');
            expect(state.currentInput).toBe('1 - 1');
        });

        test('multiple digits accumulate', () => {
            handler.handleButtons('1');
            handler.handleButtons('2');
            handler.handleButtons('3');
            expect(state.currentInput).toBe('123');
        });

        test('operator after number appends " op "', () => {
            state.currentInput = '5';
            handler.handleButtons('+');
            expect(state.currentInput).toBe('5 + ');
        });

        test('operator after "(" is ignored except "-"', () => {
            state.currentInput = '(';
            handler.handleButtons('+');
            expect(state.currentInput).toBe('(');

            handler.handleButtons('-');
            expect(state.currentInput).toBe('( - ');
        });

        test('consecutive operators replace the previous one', () => {
        state.currentInput = '5 + ';
            handler.handleButtons('×');
            // Still expecting the single-space version; this will fail demonstratively:
            expect(state.currentInput).toBe('5 × ');
        });
    });

    // —— Tests for decimal and percent input ——
    describe('decimal & percentage logic', () => {
        test('decimal point appends only once per number', () => {
            state.currentInput = '3';
            handler.handleButtons('.');
            expect(state.currentInput).toBe('3.');
            handler.handleButtons('.');
            expect(state.currentInput).toBe('3.');
        });

        test('% appends to a number', () => {
            state.currentInput = '50';
            handler.handleButtons('%');
            expect(state.currentInput).toBe('50%');
        });

        test('pressing % twice simply appends a second %', () => {
            state.currentInput = '50';
            handler.handleButtons('%');
            handler.handleButtons('%');
            expect(state.currentInput).toBe('50%%');
        });

        test('% immediately after "(" does nothing', () => {
            state.currentInput = '(';
            handler.handleButtons('%');
            expect(state.currentInput).toBe('(');
        });
    });

    // —— Tests for parentheses logic ——
    describe('parentheses handling', () => {
        test('initial "0" replaced with "("', () => {
            state.currentInput = '0';
            handler.handleButtons('( )');
            expect(state.currentInput).toBe('(');
        });

        test('opens "(" after an operator or "("', () => {
            state.currentInput = '3 + ';
            handler.handleButtons('( )');
            expect(state.currentInput).toBe('3 + (');
        });

        test('closes ")" when there is an unmatched "("', () => {
            state.currentInput = '(1+2';
            handler.handleButtons('( )');
            expect(state.currentInput).toBe('(1+2)');
        });
    });

    // —— Tests for the "=" evaluation logic ——
    describe('evaluation ("=")', () => {
        test('does nothing on "=" if error-text is present', async () => {
            display.resultElement.classList.add('error-text');
            await handler.handleButtons('=');
            expect(display.update).not.toHaveBeenCalled();
        });

        test('clears error and continues on non-"=" input', () => {
            display.resultElement.classList.add('error-text');
            handler.handleButtons('5');
            expect(display.clearAll).toHaveBeenCalledTimes(1);
            expect(display.update).toHaveBeenCalledTimes(1);
        });
    });

    // —— Tests for behavior *after* pressing "=" once ——
    describe('equals-follow-up behavior', () => {
        beforeEach(() => {
            // Instead of calling handleButtons('='), we simply set the flag:
            state.currentInput = '8';
            state.lastButtonWasEquals = true;
        });

        test('digit following "=" replaces the input', () => {
            handler.handleButtons('9');
            expect(state.currentInput).toBe('9');
            expect(state.lastButtonWasEquals).toBe(false);
        });

        test('operator following "=" appends with spaces', () => {
            handler.handleButtons('+');
            expect(state.currentInput).toBe('8 + ');
        });

        test('% following "=" appends without spaces', () => {
            handler.handleButtons('%');
            expect(state.currentInput).toBe('8%');
        });

        test('parenthesis following "=" appends "("', () => {
            handler.handleButtons('( )');
            expect(state.currentInput).toBe('8(');
        });
    });
});


// npx jest --selectProjects frontend-logic --testPathPatterns=InputHandler.unit.test.ts