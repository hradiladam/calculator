// TESTS/frontend-logic/unit/Evaluator.unit.test.ts
// —— UNIT TESTS FOR Evaluator.ts ——
// These tests isolate Evaluator.evaluate():
//  • Mock fetch to return success, error, and network failure
//  • Verify state and display mutations in each case

import Evaluator from '../../../apps/FRONTEND/ts/modules/Evaluator';
import State from '../../../apps/FRONTEND/ts/modules/State';
import DisplayControl from '../../../apps/FRONTEND/ts/modules/DisplayControl';
import HistoryPanel from '../../../apps/FRONTEND/ts/modules/HistoryPanel';


describe('Evaluator.evaluate() – unit tests', () => {
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
        } as unknown as jest.Mocked<DisplayControl>;

        historyPanel = {
            clear: jest.fn(),
            append: jest.fn()
        } as unknown as jest.Mocked<HistoryPanel>;
        
        evaluator = new Evaluator(state, display, historyPanel);
        originalFetch = global.fetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    test('successful evaluation updates state and lastButtonWasEquals', async () => {
        const mockResponse = { result: '42' };
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        });
        state.currentInput = '6 × 7';

        await evaluator.evaluate();

        expect(state.recentHistory).toBe('6 × 7 =');
        expect(state.currentInput).toBe('42');
        expect(state.lastButtonWasEquals).toBe(true);
        expect(display.resultElement.classList.contains('error-text')).toBe(false);
    });

    test('backend error sets error-text and displays error message', async () => {
        const mockResponse = { error: 'Bad expr' };
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            json: () => Promise.resolve(mockResponse),
        });
        state.currentInput = 'Something';

        await evaluator.evaluate();

        expect(state.recentHistory).toBe('Something =');
        expect(state.currentInput).toBe('Bad expr');
        expect(display.resultElement.classList.contains('error-text')).toBe(true);
    });

    test('network failure sets Network Error and error-text', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('fail'));
        state.currentInput = '1 + 1';

        await evaluator.evaluate();

        // On network errors, recentHistory remains untouched
        expect(state.recentHistory).toBe('');
        expect(state.currentInput).toBe('Network Error');
        expect(display.resultElement.classList.contains('error-text')).toBe(true);
    });
});




// npx jest --selectProjects frontend-logic --testPathPatterns=Evaluator.unit.test.ts