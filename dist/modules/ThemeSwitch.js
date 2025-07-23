// ts/modules/ThemeSwitch.ts
// ——— Switches themes ———
export default class ThemeSwitch {
    button;
    constructor(buttonEl) {
        this.button = buttonEl;
        this._onClick = this._onClick.bind(this);
    }
    init() {
        this.button.addEventListener('click', this._onClick);
    }
    _onClick() {
        document.body.classList.toggle('dark-theme');
        this.button.innerHTML =
            document.body.classList.contains('dark-theme')
                ? '<i class="fa-regular fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';
    }
}
