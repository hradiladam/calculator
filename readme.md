# Calculator Project
- This is a modern, web-based calculator built with **TypeScript**, **Node.js/Express**, and **vanilla HTML/CSS**.  
It features a clean UI, robust input validation, advanced percentage handling, parentheses, and scientific notation.

The project is structured as a **monorepo**:

- **Frontend (`apps/FRONTEND`)**  
  TypeScript + HTML/CSS, automatically compiled and deployed to **GitHub Pages** from `main` via GitHub Actions.  

- **Backend (`apps/BACKEND`)**  
  TypeScript + Express + Math.js (BigNumber mode), deployed automatically to **Render.com**. 


## Deployment

- **Frontend (UI):** [Calculator on GitHub Pages](https://hradiladam.github.io/calculator/)  
- **Backend (API):** [Render Service](https://calculator-yzjs.onrender.com/evaluate)  

**Note:** On Render free tier, the backend may take up to **40 seconds** to respond to the first request (cold start). 

---


This project includes three levels of automated testing (see `/TESTS`):

- **Jest (unit/integration)**  
  - Frontend logic (DOM interactions, modules)  
  - Backend logic (services, API via Supertest)  

- **Playwright (E2E UI)**  
  - Simulates real user interaction with calculator UI  
  - Covers expression evaluation, buttons, theme toggle, error styling  
  - Runs against **local dev servers** by default, can target live with `PW_BASE_URL`  

- **Postman**  
  - API request suite covering valid/invalid expressions  

---


## Project Structure

```
calculator/
├── apps
│     ├── FRONTEND/
│     │    ├── index.html
│     │    ├── css/
│     │    │   ├── reset.css
│     │    │   └── style.css
│     │    └── ts/
│     │        ├── main.ts
│     │        ├── config-api.ts
│     │        └── modules/
│     │            ├── DisplayControl.ts
│     │            ├── State.ts
│     │            ├── InputsHandler.ts
│     │            ├── Evaluator.ts
│     │            ├── KeyboardHandler.ts
│     │            └── ThemeSwitch.ts
│     └── BACKEND/
│         ├── app.ts
│         ├── index.ts
│         ├── services/
│         │   └── Calculator.ts
│         └── utils/
│             ├── Validator.ts
│             └── preprocessor.ts
├── postman-collection
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
npm run build   # Compiles TypeScript into dist/ using BACKEND/tsconfig.json (equivalent to: tsc -p .)
npm run start:backend:ts       # Start the server (runs dist/index.js) at http://localhost:3000
```

Check terminal → should log:
Calculator API listening on port 3000

3. Compile the Frontend (TypeScript)
- From the project root, compile frontend `.ts` files into `/dist`:

```bash
npm run serve:frontend
```

4. Start the frontend: 

- open this exact URL (so FE picks the local API):
- http://127.0.0.1:5500/index.html


## Licence
MIT — Free to use, modify, and build upon.

---


> This project is a work in progress and will be gradually updated and improved.