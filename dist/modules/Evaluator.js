// ts/modules/Evaluator.ts
// ——— Wraps the fetch logic and error handling plus formatting for history display ———
import { formatForHistory } from './formatter.js';
export default class Evaluator {
    state;
    display;
    constructor(state, display) {
        this.state = state;
        this.display = display;
    }
    evaluate = async () => {
        const resultElement = this.display.resultElement;
        resultElement.classList.remove('error-text');
        try {
            const API_URL = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
                ? 'http://localhost:3000/evaluate'
                : 'https://calculator-yzjs.onrender.com/evaluate';
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression: this.state.currentInput })
            });
            const data = await response.json();
            // Always record what the user attempted
            this.state.recentHistory = formatForHistory(this.state.currentInput) + ' =';
            if (!response.ok) {
                this.state.currentInput = data.error;
                resultElement.classList.add('error-text');
            }
            else {
                this.state.currentInput = data.result;
                this.state.lastButtonWasEquals = true;
            }
        }
        catch {
            this.state.currentInput = 'Network Error';
            resultElement.classList.add('error-text');
        }
    };
}
