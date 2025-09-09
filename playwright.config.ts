// playwright.config.ts

import { defineConfig, devices, type PlaywrightTestOptions, type PlaywrightWorkerOptions } from '@playwright/test';

// —— Default targets ——
// Local by default; override with env when you want to smoke PROD.
const DEFAULT_LOCAL_BASE = 'http://127.0.0.1:5500/';
const DEFAULT_LOCAL_API  = 'http://127.0.0.1:3000/evaluate';

// Base URL for page.goto(). Set PW_BASE_URL to hit PROD (Pages) when you need to.
const PW_BASE_URL = process.env.PW_BASE_URL ?? DEFAULT_LOCAL_BASE;

// Are we pointing at localhost?
const isLocalBase =
	/^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/$/i.test(PW_BASE_URL);

// Ensure Node-side helpers (warmup) hit local only when baseURL is local.
if (isLocalBase && !process.env.API_EVALUATE_URL) {
	process.env.API_EVALUATE_URL = DEFAULT_LOCAL_API;
}

const sharedUse: Partial<PlaywrightTestOptions & PlaywrightWorkerOptions> = {
	headless: true,
	viewport: { width: 1280, height: 720 },
	baseURL: PW_BASE_URL,
	screenshot: 'only-on-failure' as const,
	video: 'on-first-retry' as const,
	trace: 'on-first-retry' as const,
	actionTimeout: 5_000,
	navigationTimeout: 10_000,
};

export default defineConfig({
	testDir: './TESTS/e2e',
	timeout: 60_000,
	expect: { timeout: 5_000 },
	fullyParallel: true,

	// One-time warmup (it will auto-skip when API_EVALUATE_URL is local)
	globalSetup: './TESTS/e2e/setup/globalSetup.ts',

	// —— Auto-start local servers only when baseURL is local ——
	webServer: isLocalBase ? [
		{ command: 'npm run serve:frontend', port: 5500, reuseExistingServer: true },
		{ command: 'npm run start:backend:ts', port: 3000, reuseExistingServer: true }
	] : undefined,

	projects: [
		// ----------------
		// Normal tests
		// ----------------
		{
			name: 'e2e-chromium',
			testIgnore: ['**/cold/**', '**/setup/**'],
			use: { ...sharedUse, ...devices['Desktop Chrome'] },
		},
		{
			name: 'e2e-firefox',
			testIgnore: ['**/cold/**', '**/setup/**'],
			use: { ...sharedUse, ...devices['Desktop Firefox'] },
		},
		{
			name: 'e2e-webkit',
			testIgnore: ['**/cold/**', '**/setup/**'],
			use: { ...sharedUse, ...devices['Desktop Safari'] },
		},

		// ---------------------------------
		// Cold E2E tests (globalSetup handles warmup)
		// ---------------------------------
		{
			name: 'e2e-cold-chromium',
			testDir: './TESTS/e2e/cold',
			testMatch: ['**/*.test.ts'],
			use: { ...sharedUse, ...devices['Desktop Chrome'] }
		},
		{
			name: 'e2e-cold-firefox',
			testDir: './TESTS/e2e/cold',
			testMatch: ['**/*.test.ts'],
			use: { ...sharedUse, ...devices['Desktop Firefox'] }
		},
		{
			name: 'e2e-cold-webkit',
			testDir: './TESTS/e2e/cold',
			testMatch: ['**/*.test.ts'],
			use: { ...sharedUse, ...devices['Desktop Safari'] }
		},
	],
});
