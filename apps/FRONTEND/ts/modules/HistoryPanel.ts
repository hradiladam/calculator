// ts/modules/HistoryPanel.ts
// ——— Manages the slide-out history panel UI ———

export default class HistoryPanel {
    private panelEl:   HTMLElement;
    private toggleBtn: HTMLElement;

    constructor(toggleBtn: HTMLElement, panelEl: HTMLElement) {
        this.toggleBtn = toggleBtn;
        this.panelEl   = panelEl;

        // Makes sure the panel is never empty, there is default message in case of no results from evaluator
        const emptyMsg = document.createElement('div');
        emptyMsg.classList.add('history-empty');
        emptyMsg.textContent = 'No history to show.';
        this.panelEl.appendChild(emptyMsg);     

        // Wire up the toggle button
        this.toggleBtn.addEventListener('click', this.toggle);
    }

    // —— Toggle the panel’s visible class ——
    private toggle = (): void => {
        this.panelEl.classList.toggle('visible');
    };

    // —— Append one “expression = result” line ——
    append = (expression: string, result: string): void => {
        // Hide the "no history" message if it exists
        const placeholder = this.panelEl.querySelector('.history-empty');
        if (placeholder) {
            placeholder.remove();
        };

        // Create container for this entry
        const wrapper = document.createElement('div');
        wrapper.classList.add('history-entry');

        // Create and populate the expression part (“expr =”)
        const ex = document.createElement('div');
        ex.classList.add('history-expression');
        ex.textContent = `${expression} =`;

        // Create and populate the result part
        const re = document.createElement('div');
        re.classList.add('history-result');
        re.textContent = result;

        // Nest the expression and result inside the wrapper
        wrapper.appendChild(ex);
        wrapper.appendChild(re);

        // Add this new entry to the panel’s DOM
        this.panelEl.appendChild(wrapper);

        // Scroll the panel to the bottom so the newest entry is in view
        this.panelEl.scrollTop = this.panelEl.scrollHeight;
    };


    /* 
        Clears all entries from the history panel.
        - This method is currently unused. 
        - Not sure if I want "AC" to overall clear history panel, not just the current input and recent history
    */
    clear = (): void => {
        this.panelEl.innerHTML = '';
        const emptyMsg = document.createElement('div');
        emptyMsg.classList.add('history-empty');
        emptyMsg.textContent = 'No history to show.';
        this.panelEl.appendChild(emptyMsg);
    };
}