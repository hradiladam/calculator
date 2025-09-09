// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

// —— Base URLs ——
// Local by default; set PW_BASE_URL to hit your GitHub Pages prod.
const DEFAULT_LOCAL_BASE = 'http://127.0.0.1:5500/';
const PW_BASE_URL = process.env.PW_BASE_URL ?? DEFAULT_LOCAL_BASE;

// If baseURL points to localhost, we’ll spin up local servers.
// Otherwise (e.g., PW_BASE_URL=https://hradiladam.github.io/calculator/), we don’t.
const isLocalBase = /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/$/i.test(PW_BASE_URL);

// Let any Node-side helpers use a local API only when we’re on localhost.
if (isLocalBase && !process.env.API_EVALUATE_URL) {
	process.env.API_EVALUATE_URL = 'http://127.0.0.1:3000/evaluate';
}

export default defineConfig({
	testDir: './TESTS/e2e',
	timeout: 30_000,
	expect: { timeout: 5_000 },
	fullyParallel: true,

	// Standard reporters: console + HTML (kept for CI artifact review).
	reporter: [['list'], ['html', { open: 'never' }]],

	// Global defaults for all projects. Override per-project only if needed.
	use: {
		baseURL: PW_BASE_URL,
		headless: true,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 5_000,
		navigationTimeout: 10_000,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
	},

	// Optional warmup (skips when API_EVALUATE_URL is local).
	globalSetup: './TESTS/e2e/setup/globalSetup.ts',

	// Only start local servers when targeting localhost.
	// (Playwright will reuse servers if you already started them yourself.)
	webServer: isLocalBase
		? [
				{ command: 'npm run serve:frontend', port: 5500, reuseExistingServer: true },
				{ command: 'npm run start:backend:ts', port: 3000, reuseExistingServer: true },
		  ]
		: undefined,

	projects: [
		{ name: 'e2e-chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'e2e-firefox',  use: { ...devices['Desktop Firefox'] } },
		{ name: 'e2e-webkit',   use: { ...devices['Desktop Safari'] } },
	],
});
