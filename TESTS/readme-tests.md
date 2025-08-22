# Automated Testing Overview

This project includes robust automated test suites using:

- ✅ **Jest** – for frontend and backend **unit** and **integration** testing
- 🌐 **Playwright** – for **end-to-end** (E2E) and **UI interaction** tests in real browsers
- 📮 **Postman** – for testing the **calculator API** via HTTP requests

All tests are written in **TypeScript** and are located in `TESTS/` folder.

---

### 📁 Overall Structure

```
calculator/
├── TESTS/
│   ├── api/
│   │   ├── POSTMAN/
│   │   └── endpoint/   # Supertest
│   ├── e2e/
│   ├── ui/
│   ├── backend-logic/
│   │   ├── unit/
│   │   └── integration/
│   ├── frontend-logic/
│   │   ├── unit/
│   │   └── integration/
│   └── playwright-setup/   # Shared infrastructure for UI and E2E tests
│       ├── page/
│       └── globalSetup.ts
├── playwright-ui.config.ts
├── playwright-e2e.config.ts
├── jest.config.cjs
├── known-issues.md
└── readme-test.md
```

## 1. Unit, Component & Integration Tests (Jest)

Jest is used to test both frontend and backend logic in isolation and in in API backend integration.

### How to run

1.  Install Jest in app ROOT 
``` bash
npm install --save-dev jest ts-jest @types/jest
```

2. Install SuperTest and in the root as well so that the test files, wherever they live, can import it
``` bash
npm install --save-dev supertest @types/supertest   # Required for backend HTTP testing
npm install --save-dev jest-environment-jsdom       # Required for frontend DOM testing (ThemeSwitch, etc.)
```

3. Run tests:

**Run all tests**
``` bash
npx jest --config jest.config.cjs
```

**Run only backend logic tests**
``` bash
npx jest --selectProjects backend-logic --config jest.config.cjs
```

**Run only frontend logic tests**
``` bash
npx jest --selectProjects frontend-logic --config jest.config.cjs
```

---

## 🎭 2. UI & E2E Tests (Playwright)

Playwright is used to simulate **real user interaction** and test **UI rendering**, **theme toggling**, **history panel** and **expression evaluation** via the **live API**.

### 🧠 Config Split

Config File and Purpose
- `playwright-ui.config.ts` | UI-only tests (frontend only)
- `playwright-e2e.config.ts` | Full E2E tests (frontend + backend)

### How to Run

1. Go to teh root of the project:

2. Install dependencies
```bash
npm install
npx playwright install
```

3. Run UI tests
``` bash
npx playwright test --config=playwright-ui.config.ts
```

Optional: Run only in chromium
```bash
npx playwright test --config=playwright-ui.config.ts --project=chromium
```

4. Run E2E tests
``` bash
npx playwright test --config=playwright-e2e.config.ts
```

Optional: Run only in chromium
```bash
npx playwright test --config=playwright-e2e.config.ts --project=chromium
```

---


## 📬 3. API Tests (Postman)

Postman tests verify calculator backend behavior using CSV-based test cases.

### 🧪 Summary
- **Total tests**: 34
- **Test method**: POST `/evaluate` with `expression` values
- **Validation**: Matches `result` or `error` field
- **Location**: `TESTS/backend/api/postman/`


### ▶️ Run in Postman

1. Open Postman
2. Import the `.postman_collection.json`
3. Open **Collection Runner** (Ctrl+R or in sidebar)
4. Select the collection
4. Upload a `.csv` from `test-data-csv/`
5. Click **Run**