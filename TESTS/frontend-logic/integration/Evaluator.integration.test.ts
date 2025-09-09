// TESTS/frontend-logic/integration/Evaluator.integration.test.ts
// —— INTEGRATION TEST FOR Evaluator.ts ——
// Verifies the full evaluate() flow (error then success) with mocked fetch.

import Evaluator from '../../../apps/FRONTEND/ts/modules/Evaluator';
import State from '../../../apps/FRONTEND/ts/modules/State';
import DisplayControl from '../../../apps/FRONTEND/ts/modules/DisplayControl';
import { formatForHistory } from '../../../apps/FRONTEND/ts/modules/formatter';
import HistoryPanel from '../../../apps/FRONTEND/ts/modules/HistoryPanel';

describe('Evaluator component behavior', () => {
    let state: State;
    let display: jest.Mocked<DisplayControl>;
    let evaluator: Evaluator;
    let originalFetch: typeof fetch;
    let historyPanel: jest.Mocked<HistoryPanel>;

    beforeEach(() => {
        state = new State();

        display = {
            resultElement: document.createElement('div'),
            historyElement: document.createElement('div'),
            clearAll: jest.fn(),
            backspace: jest.fn(),
            update: jest.fn(),
            appendToHistoryLog: jest.fn(), 
        } as unknown as jest.Mocked<DisplayControl>;

        historyPanel = {
            append: jest.fn(),
            clear: jest.fn(),
        } as unknown as jest.Mocked<HistoryPanel>;

        evaluator = new Evaluator(state, display, historyPanel);
        originalFetch = global.fetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    test('subsequent success response clears error-text', async () => {
        // First simulate an error to set the class
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({ error: 'Err' }),
        });
        state.currentInput = 'bad';
        await evaluator.evaluate();

        // Now simulate success
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ result: '2' }),
        });
        state.currentInput = '1 + 1';
        await evaluator.evaluate();

        expect(state.currentInput).toBe('2');
        expect(display.resultElement.classList.contains('error-text')).toBe(false);
    });

    test('after success, history and result elements update correctly', async () => {
        // Mock a successful server response
        const mockResult = '7';
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ result: mockResult }),
        });

        // Reflect state in the DOM using a real DisplayControl instance
        // Set up real DOM elements
        const historyEl = document.createElement('div');
        const resultEl = document.createElement('div');
        state.currentInput = '3 + 4';

        display = new DisplayControl(historyEl, resultEl, state) as any;
        historyPanel = {
            append: jest.fn(),
            clear: jest.fn(),
        } as unknown as jest.Mocked<HistoryPanel>;

        evaluator = new Evaluator(state, display, historyPanel);

        // Run evaluation and update
        await evaluator.evaluate();
        display.update();

        // Assert DOM text content
        expect(historyEl.textContent).toBe(formatForHistory('3 + 4') + ' =');
        expect(resultEl.textContent).toBe(mockResult);
        expect(resultEl.classList.contains('error-text')).toBe(false);
    });
});


// npx jest --selectProjects frontend-logic --testPathPatterns=Evaluator.integration.test.ts
