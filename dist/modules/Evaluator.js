// ts/modules/Evaluator.ts
// ——— Wraps the fetch logic and error handling plus formatting for history display ———
import { formatForHistory, formatThousands } from './formatter.js';
import { getEvaluateUrl } from '../config-api.js';
export default class Evaluator {
    state;
    display;
    historyPanel;
    constructor(state, display, historyPanel // ← now injected directly
    ) {
        this.state = state;
        this.display = display;
        this.historyPanel = historyPanel;
    }
    evaluate = async () => {
        const resultElement = this.display.resultElement;
        resultElement.classList.remove('error-text');
        // … inside the success path, before your fetch …
        const expr = formatForHistory(this.state.currentInput); // Format input once for both history UIs - forms base for recent history and history log out of current input
        try {
            const response = await fetch(getEvaluateUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression: this.state.currentInput })
            });
            const data = await response.json();
            // Always record what the user attempted, update the one‑line “recent history” display
            this.state.recentHistory = `${expr} =`;
            if (!response.ok || data.error) {
                // Error path
                this.state.currentInput = data.error ?? 'Error';
                resultElement.classList.add('error-text');
                this.state.lastButtonWasEquals = false;
            }
            else {
                // Success path
                const formattedResult = formatThousands(data.result ?? '');
                this.historyPanel.append(expr, formattedResult);
                // Then update main display state
                this.state.currentInput = data.result ?? '';
                this.state.lastButtonWasEquals = true;
            }
        }
        catch {
            // Network or CORS failure
            this.state.currentInput = 'Network Error';
            resultElement.classList.add('error-text');
            this.state.lastButtonWasEquals = false;
        }
        // Finally, refresh the one‑line display
        this.display.update();
    };
}
