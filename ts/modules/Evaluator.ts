// ts/modules/Evaluator.ts
// ——— Wraps the fetch logic and error handling plus formatting for history display ———

import { formatForHistory } from './formatter.js';
import State from './State.js';
import DisplayControl from './DisplayControl.js';
import { getEvaluateUrl } from '../config-api.js';

interface ApiResponse {
    result?: string;
    error?: string;
}

export default class Evaluator {
    private state: State;
    private display: DisplayControl;

    constructor(state: State, display: DisplayControl) {
        this.state = state;
        this.display = display;
    }

    evaluate = async (): Promise<void> => {
        const resultElement = this.display.resultElement;
        resultElement.classList.remove('error-text');

        try {
            const API_URL = getEvaluateUrl();

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression: this.state.currentInput })
            });
            const data: ApiResponse = await response.json();

            // Always record what the user attempted
            this.state.recentHistory = formatForHistory(this.state.currentInput) + ' =';

            if (!response.ok) {
                // Server‑reported error
                this.state.currentInput = data.error ?? 'Error';
                resultElement.classList.add('error-text');
            } else {
                // Success
                this.state.currentInput = data.result ?? '';
                this.state.lastButtonWasEquals = true;
            }

        } catch {
            // Network or CORS failure
            this.state.currentInput = 'Network Error';
            resultElement.classList.add('error-text');
        }
    }
}
