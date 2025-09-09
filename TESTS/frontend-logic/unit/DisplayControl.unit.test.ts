// TESTS/frontend-logic/unit/DisplayControl.unit.test.ts
// —— UNIT TESTS FOR DisplayControl.ts ——
// Covers UI display updates, clearing input and backspace

import DisplayControl from '../../../apps/FRONTEND/ts/modules/DisplayControl';
import State from '../../../apps/FRONTEND/ts/modules/State';
import * as formatter from '../../../apps/FRONTEND/ts/modules/formatter';

describe('DisplayControl', () => {
    let state: State;
    let historyElement: HTMLElement;
    let resultElement: HTMLElement;
    let display: DisplayControl;

    beforeEach(() => {
        state = new State();
        historyElement = document.createElement('div');
        resultElement = document.createElement('div');
        Object.defineProperty(resultElement, 'scrollWidth', { value: 123, configurable: true }); // stub scrollWidth so we can test auto‑scroll
        resultElement.scrollLeft = 0;


        display = new DisplayControl(historyElement, resultElement, state);
    });

    // —— Tests for the update() method ——
    describe('update()', () => {
        // Should copy state.recentHistory (with trailing " =") into historyElement
        // and use formatForDisplay(state.currentInput) for resultElement
        test('renders given history (including trailing " =") and formatted result', () => {
            // Arrange: set up the state as if Evaluator already ran
            state.recentHistory = '5 + 2 =';   // Set up post‑evaluation history -> history string already includes " ="
            state.currentInput  = '7';         // raw input to be formatted

            // Spy on the formatter so we can:
            //  1. Confirm update() actually calls formatForDisplay('7')
            //  2. Control its output to a unique value ("formatted") for our assertion
            const spy = jest
                .spyOn(formatter, 'formatForDisplay')
                .mockReturnValue('formatted');
            
            // Act: perform the UI update
            display.update();

            // Assert:
            //  - historyElement should show exactly state.recentHistory
            expect(historyElement.textContent).toBe('5 + 2 =');
            //  - formatForDisplay must have been called with the raw input
            expect(spy).toHaveBeenCalledWith('7');
            //  - resultElement should use whatever formatForDisplay returned
            expect(resultElement.textContent).toBe('formatted');

            // Cleanup: restore the real formatter implementation
            spy.mockRestore();
        });

        // Should show default placeholders when both history and input are empty
        test('shows default placeholders when state is empty', () => {
            state.recentHistory = '';
            state.currentInput  = '';

            display.update();

            expect(historyElement.textContent).toBe('No recent history');
            expect(resultElement.textContent).toBe('0');
        });

        // Should scroll the result element to its scrollWidth when lastButtonWasEquals is false
        test('auto‑scrolls when lastButtonWasEquals is false', () => {
            state.currentInput        = '123';
            state.lastButtonWasEquals = false;

            display.update();
            expect(resultElement.scrollLeft).toBe(123);
        });

        // Should reset scrollLeft to 0 when lastButtonWasEquals is true
        test('resets scroll when lastButtonWasEquals is true', () => {
            state.currentInput        = '123';
            state.lastButtonWasEquals = true;

            display.update();
            expect(resultElement.scrollLeft).toBe(0);
        });
    });

    describe('clearAll()', () => {
        // Should call state.reset(), restoring default values
        test('resets state to defaults', () => {
            state.currentInput        = '1 + 1';
            state.recentHistory       = '20 + 5 =';
            state.lastButtonWasEquals = true;

            display.clearAll();

            expect(state.currentInput).toBe('0');
            expect(state.recentHistory).toBe('');
            expect(state.lastButtonWasEquals).toBe(false);
        });
    });

    describe('backspace()', () => {
        // Should remove the last character when there is no operator pattern at the end
        test('removes last character when no operator present', () => {
            state.currentInput = '123';
            display.backspace();
            expect(state.currentInput).toBe('12');
        });

        // Should delete an operator and its surrounding spaces when the input ends with " op "
        test('removes an operator plus its spaces', () => {
            state.currentInput = '5 + ';
            display.backspace();
            expect(state.currentInput).toBe('5');
        });

        // Should reset to "0" if backspacing leaves the input empty
        test('resets to "0" when input becomes empty', () => {
            state.currentInput = '7';
            display.backspace();
            expect(state.currentInput).toBe('0');
        });
    });
});


// npx jest TESTS/frontend-logic/unit/DisplayControl.unit.test.ts