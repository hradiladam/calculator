// main.ts
// ——— Main script that wires everything together ———

import State from './modules/State.js';                                 // Encapsulates calculator state
import DisplayControl from './modules/DisplayControl.js';               // Controls UI updates
import Evaluator from './modules/Evaluator.js';                         // Handles backend calls and formatting
import InputHandler from './modules/InputHandler.js';                   // Processes button inputs
import ThemeSwitch from './modules/ThemeSwitch.js';                     // Toggles dark/light themes
import KeyboardHandler from './modules/KeyboardHandler.js';             // Maps physical keys to calculator
import HistoryPanel from './modules/HistoryPanel.js';                   // Manages the slide-out history panel

// Wait until the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // —— Grab core display elements ——
    const historyElement = document.getElementById('recent-history') as HTMLElement; // one-line history
    const resultElement  = document.getElementById('result')         as HTMLElement; // result output

    // —— Grab history panel toggle and container ——
    const toggleBtn = document.getElementById('history-toggle') as HTMLElement;     // history button
    const panelEl   = document.getElementById('history-panel')  as HTMLElement;     // slide-out panel

    // —— Grab theme switch button ——
    const themeButton = document.getElementById('theme-switch') as HTMLElement;

    // —— Instantiate main modules ——
    const state          = new State();                                                       // Holds inputs & recentHistory
    const displayControl = new DisplayControl(historyElement, resultElement, state);          // Updates the UI
    const historyPanel   = new HistoryPanel(toggleBtn, panelEl);                              // Manages history panel UI
    const evaluator      = new Evaluator(state, displayControl, historyPanel);                // Runs & formats calculations
    const inputHandler   = new InputHandler(state, evaluator, displayControl);                // Handles button inputs 

    displayControl.update();   // Sets initial display to “0” / “No recent history” 

    // —— Wire up calculator buttons ——
    document.querySelectorAll<HTMLButtonElement>('button[data-value]').forEach((button) => {
        button.addEventListener('click', () => {
            inputHandler.handleButtons(button.dataset.value!);  // Delegate into InputHandler
            button.blur();                                      // Remove focus styling
        });
    });

    // —— Initialize dark/light theme switch behavior ——
    new ThemeSwitch(themeButton).init();

    // —— Initialize keyboard support ——
    new KeyboardHandler(inputHandler).init();
});