// ts/modules/InputHandler.ts
// ——— Handles logic of user inputs ———

import State from './State.js';
import Evaluator from './Evaluator.js';
import DisplayControl from './DisplayControl.js';


export default class InputHandler {
    private state: State;
    private evaluator: Evaluator;
    private display: DisplayControl;

    constructor(state: State, evaluator: Evaluator, display: DisplayControl) {
        this.state = state;
        this.evaluator = evaluator;
        this.display = display;
    }


    // Function to append values
    _appendValue = (value: string): void => {
        if (this.state.lastButtonWasEquals) {
            this._handleEqualsFollowUp(value);
            return;
        }

        if (/[0-9]/.test(value)) return this._handleNumber(value);
        if (this.state.operators.includes(value)) return this._handleOperator(value);
        if (value === '%') return this._handlePercentage();
        if (value === '.') return this._handleDecimal(value);
        if (value === '( )') return this._handleParentheses();
    };


    /* Helper functions for specific button presses */

    // Function to handle if the '=' flag is set to true
    _handleEqualsFollowUp = (value: string): void => {
        if (value === '( )') this.state.currentInput += '(';                // Append '(' directly after '='
        else if (/[0-9]/.test(value)) this.state.currentInput = value;      // If a number is pressed, reset the input to just the number
        else if (value === '%') this.state.currentInput += '%';             // Append '%' directly without spaces
        else this.state.currentInput += ` ${value} `;                       // For operators or other values, append them with spaces
        this.state.lastButtonWasEquals = false;                             // Reset the equals flag to allow normal behavior afterward
    };

    // Handle numbers if the '=' flag is false
    _handleNumber = (value: string): void => {
        const current = this.state.currentInput;
        // If last char is %, just append number directly (do not insert × visually)
        if (current.slice(-1) === '%') {
            this.state.currentInput += value;
        } else if (current === '0') {
            this.state.currentInput = value;
        } else {
            this.state.currentInput += value;
        }
    };

    // Handle operators
    _handleOperator = (value: string): void => {
        // Trim trailing spaces to focus on the meaningful part of the input
        const trimmedInput = this.state.currentInput.trim();

        // Prevent operator after '(' (allowing '-' after it)
        if (trimmedInput.slice(-1) === '(' && value !== '-') {
            return;
        }

        // Make '-' the only operator that replaces default zero
        if (trimmedInput === '0' && value === '-') {
            this.state.currentInput = '-';
        }

        // Prevent multiple consecutive operators
        if (this.state.operators.includes(trimmedInput.slice(-1))) {
            this.state.currentInput = trimmedInput.slice(0, -1) + ` ${value} `;    // Replace the last operator with the new one
        } else {
            this.state.currentInput = `${trimmedInput} ${value} `;
        }
    };

    // Function to handle percentages
    _handlePercentage = (): void => {
        const trimmed = this.state.currentInput.trim();

        // Disallow directly after '('
        if (trimmed.endsWith('(')) return;

        // Append '%'; let formatting/eval handle any implicit ×
        this.state.currentInput += '%';
    };


    // Handle the decimal point
    _handleDecimal = (value: string): void => {
        // Get the last number segment
        const lastNumber = this.state.currentInput
            .split(/[\+\-×÷]/)
            .pop() || '';  // ← default to '' so it's never undefined

        if (!lastNumber.includes('.')) {
            this.state.currentInput += value;   // Append the decimal point only if not already present
        }
    };

    // Handle parentheses
    _handleParentheses = (): void => {
        const openParentheses = (this.state.currentInput.match(/\(/g) || []).length;
        const closedParentheses = (this.state.currentInput.match(/\)/g) || []).length;
        let current = this.state.currentInput;

        // If the input is '0', replace it with '('
        if (current === '0') {
            current = '(';
        }

        // Add opening parenthesis if it's appropriate
        else if (
            this.state.operators.includes(current.trim().slice(-1)) ||
            current.trim().slice(-1) === '(' ||
            current === ''
        ) {
            current += '(';
        }
        
        // Add closing parenthesis only if there are unmatched opening parentheses
        else if (openParentheses > closedParentheses) {
            current += ')';
        }

        // Default to adding an opening parenthesis
        else { 
            current += '(';
        }

        // Write the mutated string back into state
        this.state.currentInput = current;
    };


    // Function to handle button clicks
    handleButtons = async (value: string): Promise<void> => {
        const resultEl = this.display.resultElement;
        const wasError = resultEl.classList.contains('error-text');

        // 1. If we're showing an error and "=" is pressed, do absolutely nothing
        if (wasError && value === '=') return;

        // 2. Always clear error styling on any button press
        resultEl.classList.remove('error-text');

        // 3. If there was an error and it's not "=", reset state before continuing
        if (wasError) this.display.clearAll();

        // Normal handling
        switch (value) {
            case 'AC':
                this.display.clearAll();
                break;

            case '⌫':
                this.display.backspace();
                break;

            case '=':
                // evaluate() now does its own this.display.update()
                await this.evaluator.evaluate();
                return;  // <-- skip the extra update down below

            default:
                this._appendValue(value);
        }

        // For everything except "=" so display updates once
        this.display.update();
    }
}