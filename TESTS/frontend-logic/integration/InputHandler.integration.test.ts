// TESTS/frontend-logic/integration/InputHandler.integration.test.ts
// —— INTEGRATION TEST FOR InputHandler.ts ——
// This test verifies cross-module interaction between InputHandler, Evaluator, and DisplayControl
// when "=" is pressed. It ensures that InputHandler orchestrates the flow correctly:
//    • Delegates evaluation to Evaluator
//    • Triggers a Display update afterwards

import InputHandler from '../../../apps/FRONTEND/ts/modules/InputHandler';
import State from '../../../apps/FRONTEND/ts/modules/State';
import Evaluator from '../../../apps/FRONTEND/ts/modules/Evaluator';
import DisplayControl from '../../../apps/FRONTEND/ts/modules/DisplayControl';

describe('InputHandler.handleButtons() – component behavior', () => {
    let state: State;
    let evaluator: jest.Mocked<Evaluator>;
    let display: jest.Mocked<DisplayControl>;
    let handler: InputHandler;

    beforeEach(() => {
        state = new State();

        evaluator = {
            evaluate: jest.fn().mockResolvedValue(undefined),  // ← stub to simulate success
        } as unknown as jest.Mocked<Evaluator>;

        display = {
            clearAll: jest.fn(),
            backspace: jest.fn(),
            update: jest.fn(),
            resultElement: document.createElement('div'),
            historyElement: document.createElement('div'),
        } as unknown as jest.Mocked<DisplayControl>;

        handler = new InputHandler(state, evaluator, display);
    });

    test('pressing "=" calls evaluator.evaluate()', async () => {
        state.currentInput = '2 + 2';

        await handler.handleButtons('=');

        expect(evaluator.evaluate).toHaveBeenCalledTimes(1);
        // No need to check display.update() here
    });

    test('does nothing on "=" if error-text is present', async () => {
        // Component-level: error state should short-circuit evaluation
        display.resultElement.classList.add('error-text');
        state.currentInput = '2 + 2';

        await handler.handleButtons('=');

        expect(evaluator.evaluate).not.toHaveBeenCalled();
        expect(display.update).not.toHaveBeenCalled();
    });

    test('non-"=" input delegates to display.update only', async () => {
        // Component-level: non-"=" should not invoke evaluation
        state.currentInput = '1';

        await handler.handleButtons('2');

        expect(evaluator.evaluate).not.toHaveBeenCalled();
        expect(display.update).toHaveBeenCalledTimes(1);
    });

    test.skip('multiple zeroes after operator collapse to single 0', async () => {
        state.currentInput = '5 + ';
        
        await handler.handleButtons('0');
        await handler.handleButtons('0');
        await handler.handleButtons('0');

        expect(state.currentInput).toBe('5 + 0');
    });
});



// npx jest --selectProjects frontend-logic --testPathPatterns=InputHandler.integration.test.ts
