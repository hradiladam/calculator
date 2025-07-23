// ts/modules/InputHandler.ts
// ——— Handles logic of user inputs ———
export default class InputHandler {
    state;
    evaluator;
    display;
    constructor(state, evaluator, display) {
        this.state = state;
        this.evaluator = evaluator;
        this.display = display;
    }
    // Function to append values
    _appendValue = (value) => {
        if (this.state.lastButtonWasEquals) {
            this._handleEqualsFollowUp(value);
            return;
        }
        if (/[0-9]/.test(value))
            return this._handleNumber(value);
        if (this.state.operators.includes(value))
            return this._handleOperator(value);
        if (value === '%')
            return this._handlePercentage();
        if (value === '.')
            return this._handleDecimal(value);
        if (value === '( )')
            return this._handleParentheses();
    };
    /* Helper functions for specific button presses */
    // Function to handle if the '=' flag is set to true
    _handleEqualsFollowUp = (value) => {
        if (value === '( )')
            this.state.currentInput += '('; // Append '(' directly after '='
        else if (/[0-9]/.test(value))
            this.state.currentInput = value; // If a number is pressed, reset the input to just the number
        else if (value === '%')
            this.state.currentInput += '%'; // Append '%' directly without spaces
        else
            this.state.currentInput += ` ${value} `; // For operators or other values, append them with spaces
        this.state.lastButtonWasEquals = false; // Reset the equals flag to allow normal behavior afterward
    };
    // Handle numbers if the '=' flag is false
    _handleNumber = (value) => {
        const current = this.state.currentInput;
        // If last char is %, just append number directly (do not insert × visually)
        if (current.slice(-1) === '%') {
            this.state.currentInput += value; // Let evaluateExpression() insert * for logic
        }
        else if (current === '0') {
            this.state.currentInput = value;
        }
        else {
            this.state.currentInput += value;
        }
    };
    // Handle operators
    _handleOperator = (value) => {
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
            this.state.currentInput = trimmedInput.slice(0, -1) + ` ${value} `; // Replace the last operator with the new one
        }
        else {
            this.state.currentInput = `${trimmedInput} ${value} `;
        }
    };
    // Function to handle percentages
    _handlePercentage = () => {
        // Trim trailing spaces to focus on the meaningful part of the input
        const trimmedInput = this.state.currentInput.trim();
        // Check if the current input ends with a percentage
        if (trimmedInput.slice(-1) === '%') {
            // Check if the previous part of the string is a valid number followed by another percentage (e.g., '50%50%')
            const lastNumber = this.state.currentInput.split(/[\+\-×÷\(\)]/).pop(); // Get the last number before operator or parentheses
            if (lastNumber && !lastNumber.includes('%')) {
                // If it's a valid number, we insert multiplication between percentages
                this.state.currentInput += '*';
            }
        }
        // Prevent invalid placement of '%' (e.g., directly after '(')
        if (trimmedInput.slice(-1) === '(') {
            return;
        }
        // Append '%' to the input
        this.state.currentInput += '%';
    };
    // Handle the decimal point
    _handleDecimal = (value) => {
        // Get the last number segment
        const lastNumber = this.state.currentInput
            .split(/[\+\-×÷]/)
            .pop() || ''; // ← default to '' so it's never undefined
        if (!lastNumber.includes('.')) {
            this.state.currentInput += value; // Append the decimal point only if not already present
        }
    };
    // Handle parentheses
    _handleParentheses = () => {
        const openParentheses = (this.state.currentInput.match(/\(/g) || []).length;
        const closedParentheses = (this.state.currentInput.match(/\)/g) || []).length;
        let current = this.state.currentInput;
        // If the input is '0', replace it with '('
        if (current === '0') {
            current = '(';
        }
        // Add opening parenthesis if it's appropriate
        else if (this.state.operators.includes(current.trim().slice(-1)) ||
            current.trim().slice(-1) === '(' ||
            current === '') {
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
    handleButtons = async (value) => {
        const resultElement = this.display.resultElement;
        const wasError = resultElement.classList.contains('error-text');
        // 1. If we're showing an error and "=" is pressed, do absolutely nothing
        if (wasError && value === '=')
            return;
        // 2. Always clear error styling on any button press
        resultElement.classList.remove('error-text');
        // 3. If there was an error and it's not "=", reset state before continuing
        if (wasError)
            this.display.clearAll();
        // Normal handling
        switch (value) {
            case 'AC':
                this.display.clearAll();
                break;
            case '⌫':
                this.display.backspace();
                break;
            case '=':
                await this.evaluator.evaluate();
                break;
            default:
                this._appendValue(value);
        }
        // Updates display
        this.display.update();
    };
}
