// ts/modules/KeyboardHandler.ts
// ——— Wires physical keys to our input handler ———

import InputHandler from './InputHandler.js';


export default class KeyboardHandler {
    private inputHandler: InputHandler;
    private keyMap: Record<string, string>;

    constructor(inputHandler: InputHandler) {
        this.inputHandler = inputHandler;

        // Map physical keys to our button values
        this.keyMap = {
            '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
            '.':'.','%':'%','+':'+','-':'-','*':'×','/':'÷',
            '(': '( )', ')':'( )','Enter':'=','=':'=',
            'Backspace':'⌫','Escape':'AC'
        };
    }   

    // Public method you call once after creating the handler
    init(): void {
        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup',   this._onKeyUp);
    }

    // Listen for keydown and send it to handleButtons
    _onKeyDown = async (e: KeyboardEvent): Promise<void> => {
        const mapped = this.keyMap[e.key];
        if (!mapped) return;   // Ignore any key we’re not interested in
        e.preventDefault();    // Stop the browser’s default

        // Give the matching button style with class "press-active" when pressed
        const btn = document.querySelector(`button[data-value="${mapped}"]`);
        if (btn) btn.classList.add('press-active');

        // Delegate the key event into our calculator logic
        await this.inputHandler.handleButtons(mapped);
    }
        
    _onKeyUp = (e: KeyboardEvent): void => {
        const mapped = this.keyMap[e.key];
        const btn = document.querySelector(`button[data-value=\"${mapped}\"]`);
        if (btn) btn.classList.remove('press-active');
    }   
}