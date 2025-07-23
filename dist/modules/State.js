// ts/modules/State.ts
// ——— Encapsulates the calculator shared state ———
export default class State {
    currentInput;
    recentHistory;
    lastButtonWasEquals;
    operators = ['+', '-', '×', '÷'];
    constructor() {
        this.currentInput = '0';
        this.recentHistory = '';
        this.lastButtonWasEquals = false;
        this.operators = ['+', '-', '×', '÷'];
    }
    reset() {
        this.currentInput = '0';
        this.recentHistory = '';
        this.lastButtonWasEquals = false;
    }
}
