// TESTS/frontend-logic/integration/KeyboardHandler.integration.test.ts
// —— UNIT TEST FOR KeyboardHandler.ts ——

import KeyboardHandler from '../../../apps/FRONTEND/ts/modules/KeyboardHandler';
import InputHandler from '../../../apps/FRONTEND/ts/modules/InputHandler';

describe('KeyboardHandler', () => {
    let keyboardHandler: KeyboardHandler;
    let mockInputHandler: jest.Mocked<InputHandler>;

    beforeEach(() => {
        // Create a mocked input handler with a spy on handleButtons
        mockInputHandler = {
            handleButtons: jest.fn()
        } as unknown as jest.Mocked<InputHandler>;

        // Create an instance of KeyboardHandler using the mocked input handler
        keyboardHandler = new KeyboardHandler(mockInputHandler);

        // Add a fake button element to the DOM so querySelector can find it
        document.body.innerHTML = `
            <button data-value="1" id="btn1">1</button>
        `;

        // Initialize event listeners
        keyboardHandler.init();
    });

    test('adds visual change class and calls handleButtons on keydown', async () => {
        const keydown = new KeyboardEvent('keydown', {key: '1' } );
        
        await document.dispatchEvent(keydown);
       
        const button = document.querySelector('[data-value="1"]')!;

        // The button should now have class "press-active
        expect(button.classList.contains('press-active')).toBe(true);

        // The mocked inputHandler should have received the mapped value
        expect(mockInputHandler.handleButtons).toHaveBeenCalledWith('1');
    });

    test('remove visual class on key up', () => {
        const keydown = new KeyboardEvent('keydown', { key: '1' });
        const keyup = new KeyboardEvent('keyup', { key: '1' });

        document.dispatchEvent(keydown);
        document.dispatchEvent(keyup);

        const button = document.querySelector('[data-value="1"]')!;
        expect(button.classList.contains('press-active')).toBe(false);
    });
})


// npx jest --selectProjects frontend-logic --testPathPatterns=KeyboardHandler.integration.test.ts