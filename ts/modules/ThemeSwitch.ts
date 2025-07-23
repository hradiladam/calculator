// ts/modules/ThemeSwitch.ts
// ——— Switches themes ———

export default class ThemeSwitch {
    private button: HTMLElement;
            
    constructor(buttonEl: HTMLElement) {
        this.button = buttonEl;
        this._onClick = this._onClick.bind(this);
    }

    init(): void {
        this.button.addEventListener('click', this._onClick);
    }

    _onClick(): void {
        document.body.classList.toggle('dark-theme');
        this.button.innerHTML =
        document.body.classList.contains('dark-theme')
            ? '<i class="fa-regular fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    }
}