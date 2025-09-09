// ts/modules/State.ts
// ——— Encapsulates the calculator shared state ———

export default class State {
    public currentInput: string;
    public recentHistory: string;
    public lastButtonWasEquals: boolean;
    public readonly operators = ['+', '-', '×', '÷'];

    constructor() {
        this.currentInput = '0';
        this.recentHistory = '';
        this.lastButtonWasEquals = false;
    }

    reset(): void  {
        this.currentInput = '0';
        this.recentHistory = '';
        this.lastButtonWasEquals = false;
    }
}