// TESTS/frontend-logic/unit/State.unit.test.ts
// —— UNIT TEST FOR State.ts ——

import State from '../../../apps/FRONTEND/ts/modules/State';

describe('State', () => {
    let state: State;

    beforeEach(() => {
        state = new State();
    });

    test('initial state is empty and error-free', () => {
        expect(state.currentInput).toBe('0');
        expect(state.recentHistory).toBe('');
        expect(state.lastButtonWasEquals).toBe(false);
        expect(state.operators).toEqual(['+', '-', '×', '÷']);
    });

     test('reset() sets properties to default values', () => {
        // Change state
        state.currentInput = '123';
        state.recentHistory = '2+2';
        state.lastButtonWasEquals = true;

        // Reset
        state.reset();

        // Expectations
        expect(state.currentInput).toBe('0');
        expect(state.recentHistory).toBe('');
        expect(state.lastButtonWasEquals).toBe(false);
     });
})


// npx jest --selectProjects frontend-logic --testPathPatterns=State.unit.test.ts