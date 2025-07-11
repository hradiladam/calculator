// js/modules/DisplayControl.js
// ——— Handles updating and clearing the UI ———

export default class DisplayControl {
    constructor(historyElement, resultElement, state) {
        this.historyElement = historyElement;
        this.resultElement = resultElement;
        this.state = state;
    }

    // Update the content of teh display elements frpm state
    update = () => {
        this.historyElement.textContent = this.state.recentHistory || 'No history to show';     // Update the history text
        this.resultElement.textContent = this.state.currentInput || '0';                        // Update the result text

        // Only auto-scroll if we are NOT showing the final result (equals was no tjust pressed)
        if (!this.state.lastButtonWasEquals) {
            this.resultElement.scrollLeft = this.resultElement.scrollWidth;
        } else {
            this.resultElement.scrollLeft = 0; // Shows the beginning of result natually  
        }     
    }

    // Method to reset the calculator’s internal state back to its default
    clearAll = () => {
        this.state.reset(); // Reset the current input, recent history and the equals flag
    }

    // Method to delete the last character (or the operator with surrounding spaces)
    backspace = () => {
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
};