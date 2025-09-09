// ts/modules/DisplayControl.ts
// ——— Handles updating and clearing the UI ———


import { formatForDisplay } from './formatter.js';
import State from './State.js';

export default class DisplayControl {
    private historyElement: HTMLElement;
    public resultElement: HTMLElement;
    private state: State;

    constructor(historyElement: HTMLElement, resultElement: HTMLElement, state: State) {
        this.historyElement = historyElement;
        this.resultElement = resultElement;
        this.state = state;
    }

    // Update the content of the display elements from state
    update = (): void => {
        this.historyElement.textContent = this.state.recentHistory || 'No recent history';      // Update the history text
        this.resultElement.textContent = formatForDisplay(this.state.currentInput || '0');      // Update the result text

        // Only auto-scroll if we are NOT showing the final result (equals was not just pressed)
        if (!this.state.lastButtonWasEquals) {
            this.resultElement.scrollLeft = this.resultElement.scrollWidth;
        } else {
            this.resultElement.scrollLeft = 0; // Shows the beginning of result naturally  
        }     
    }

    // Method to reset the calculator’s internal state back to its default
    clearAll = (): void => {
        this.state.reset(); // Reset the current input, recent history and the equals flag
    }

    // Method to delete the last character (or the operator with surrounding spaces)
    backspace = (): void => {
        const current = this.state.currentInput;

        // If the input ends with an operator surrounded by spaces (e.g., " + ")
        if (/\s[+\-×÷]\s$/.test(current)) {                                    
            this.state.currentInput = this.state.currentInput.slice(0, -3);     // Remove the operator and its surrounding spaces
        } else {
            this.state.currentInput = this.state.currentInput.slice(0, -1);     // Otherwise, remove just the last character
        }

        // Prevent empty input—reset to "0" if nothing remains
        if (this.state.currentInput === '') {
            this.state.currentInput = '0';
        }
    }
}