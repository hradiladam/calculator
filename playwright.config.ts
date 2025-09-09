// playwright.config.ts
import { defineConfig, devices, type PlaywrightTestOptions, type PlaywrightWorkerOptions } from '@playwright/test';

const sharedUse: Partial<PlaywrightTestOptions & PlaywrightWorkerOptions> = {
	headless: true,
	viewport: { width: 1280, height: 720 },
	baseURL: 'https://hradiladam.github.io/calculator/',
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

	projects: [
		// --------------------------------------
		// Setup project – runs before cold tests
		// --------------------------------------
		{
			name: 'warmup',
			testDir: './TESTS/e2e/setup',
			testMatch: /warmup\.setup\.ts/,
			use: { ...sharedUse, ...devices['Desktop Chrome'] },
		},

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
		// Cold E2E tests (depend on warmup)
		// ---------------------------------
		{
			name: 'e2e-cold-chromium',
			testDir: './TESTS/e2e/cold',
			testMatch: ['**/*.test.ts'],
			use: { ...sharedUse, ...devices['Desktop Chrome'] },
			dependencies: ['warmup'],
		},
		{
			name: 'e2e-cold-firefox',
			testDir: './TESTS/e2e/cold',
			testMatch: ['**/*.test.ts'],
			use: { ...sharedUse, ...devices['Desktop Firefox'] },
			dependencies: ['warmup'],
		},
		{
			name: 'e2e-cold-webkit',
			testDir: './TESTS/e2e/cold',
			testMatch: ['**/*.test.ts'],
			use: { ...sharedUse, ...devices['Desktop Safari'] },
			dependencies: ['warmup'],
		},
	],
});
