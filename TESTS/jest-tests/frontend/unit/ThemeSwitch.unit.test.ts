// TESTS/jest-tests/frontend/unit/ThemeSwitch.unit.test.ts
// —— UNIT TEST FOR ThemeSwitch.ts ——

import ThemeSwitch from '../../../../ts/modules/ThemeSwitch';

describe('ThemeSwitch class', () => {
    let themeSwitch: ThemeSwitch;
    let button: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `<button id="theme-switch"></button>`;
        button = document.getElementById('theme-switch')!;
        themeSwitch = new ThemeSwitch(button);
        themeSwitch.init();
    });

    test('toggles dark-theme class when clicked', () => {
        expect(document.body.classList.contains('dark-theme')).toBe(false);

        button.click();
        expect(document.body.classList.contains('dark-theme')).toBe(true);

        button.click();
        expect(document.body.classList.contains('dark-theme')).toBe(false);
    });

    test('updates icon correctly when toggled', () => {
        button.click();
        expect(button.innerHTML).toContain('fa-sun');

        button.click();
        expect(button.innerHTML).toContain('fa-moon');
    });
})

// npx jest TESTS/jest-tests/frontend/unit/ThemeSwitch.unit.test.ts