# Calculator Project
- This is a modern, web-based calculator built with vanilla JavaScript, HTML, and CSS, featuring a clean UI, robust input validation, advanced percentage handling, parentheses, and scientific notation. 

- The frontend is automatically compiled and deployed from the main branch via GitHub Actions to GitHub Pages.

- The backend is written in TypeScript (Node.js + Express) and hosted on Render.com, where it evaluates expressions using Math.js with BigNumber support. hosted on Render.com, which evaluates expressions using Math.js with BigNumber support for high-precision calculations.

- IMPORTANT NOTE: Since the backend is hosted on Render.com, it may take up to 40 seconds to respond on the first request. This delay happens because Render loads the backend from cold storage (a feature of their free tier) when it's not actively in use. 


## Tests

This project includes:
### Postman test suite (/TESTS/postman-tests)
- Covers valid and invalid calculator expressions using CSV-based data-driven testing.
- See /TESTS/postman-tests/README.md for details.

### Playwright test suite (/TESTS/playwright-tests)
- Provides automated UI and end-to-end tests using the Playwright Test Runner in TypeScript.
- Tests cover expression evaluation, button interaction, visual behavior (hover/active), theme switching, and error styling.
- See /TESTS/playwright-tests/README.md for details.

### Jest test suite(/TESTS/jest-tests)
- **Jest** for test running, assertions, and mocking  
- **Supertest** for end‑to‑end HTTP tests against our Express
- See /TESTS/jest-tests/README.md for details.


## Project Structure

```
calculator/
├── index.html
├── css/
│   ├── reset.css
│   └── style.css
├── ts/
│   ├── main.ts
│   ├── config-api.ts
│   └── modules/
│       ├── DisplayControl.ts
│       ├── State.ts
│       ├── InputsHandler.ts
│       ├── Evaluator.ts
│       ├── KeyboardHandler.ts
│       └── ThemeSwitch.ts
├── jest.config.cjs
├── tsconfig.json
├── package.json
├── package-lock.json
├── playwright-ui.config.ts
├── playwright-ui.config.ts
├── BACKEND/
│   ├── app.ts
│   ├── index.ts
│   ├── services/
│   │   └── Calculator.ts
│   ├── utils/
│   │   ├── Validator.ts
│   │   └── preprocessor.ts
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
└── TESTS/
```

## Technologies Used

**Frontend:** 
- HTML, CSS, and TypeScript
- Font Awesome for button icons
- Google Fonts
- Hosted on GitHub Pages

**Backend:**
- Node.js + Express (TypeScript)
- Math.js using BigNumber mode
- Hosted on Render

## Features
- **Basic operations:** Basic operations are evaluated using Math.js to ensure accurate calculations.
- **Clear & Delete:** Use "AC" to clear the entire input or "⌫" to delete the last character or operator 
- **Theme Toggle:** Switch between light and dark themes.
- **Percentage Calculations:** Handles percentages in a way that mirrors how most calculators work. Simple values like 50% are interpreted as 50 / 100. Multiplication and division involving a percentage follow standard math: A × B% becomes A × (B/100).  Addition and subtraction use a "discount-style" approach for intuitiveness: A = B% becomes A + (A × B / 100)
- **Precision & Formatting:** Uses Math.js BigNumber with 64-digit precision. Results are rounded to 12 significant digits and automatically switch to scientific notation for values above 10⁹ or below 10⁻⁶.
- **Parentheses Support:** Lets you group operations for more complex expressions. Expressions like 50%5 or 10%(10) are parsed as 50% × 5 and 10% × (10), respectively.
- **Keyboard Shortcuts:** Type directly using your keyboard: Enter, numbers, operators, backspace, Esc.
- **Error Handling:** The backend detects and returns specific errors: divide by zero, incomplete expressions, unmatched parentheses, invalid % usage, infinity, and undefined results. The frontend displays these as clear red error messages.


## How to Access

1. **Online:** Open the application directly in your browser by visiting the following link: [Calculator](https://hradiladam.github.io/calculator/)

2. **Locally:** 

### Requirements

- [Node.js](https://nodejs.org/) (v14 or later)
- (Option A) VS Code with Live Server extension
- (Option B) Python 3 installed

1. Clone or Download the Project

If you downloaded the ZIP, unzip it and open the folder.

```bash
git clone https://github.com/hradiladam/calculator.git
cd calculator
npm install      # installs dev tools (TypeScript, Jest, Playwright…)
```

2. Compile and start the Backend: 
- This project uses a backend powered by Node.js and Express, with mathjs for calculations.
- The backend is now written in **TypeScript**. You must compile it before running:

```bash
cd BACKEND
npm install     # First-time setup
npm run build   # Compiles TypeScript into dist/ using BACKEND/tsconfig.json (equivalent to: tsc -p .)
npm start       # Start the server (runs dist/index.js) at http://localhost:3000
```

3. Compile the Frontend (TypeScript)
- From the project root, compile frontend `.ts` files into `/dist`:

```bash
npm run watch:frontend
```

4. Start the frontend: Choose one of the two options below

### Option A: VS Code + Live Server
- Open the project folder in VS Code with Live Extention installed
- Right-click index.html
- Select "Open with Live Server"
- It opens in your browser at: http://127.0.0.1:5500/ (Backend is automatically detected at http://localhost:3000)

### Option B: Python 3
- open new terminal

```bash
- cd path/to/project/root
- python -m http.server 8000
```

- open browser and go to: http://localhost:8000/index.html (Backend is automatically detected at http://localhost:3000)


## Licence
MIT — Free to use, modify, and build upon.


---


> This project is a work in progress and will be gradually updated and improved.