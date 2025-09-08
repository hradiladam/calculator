// TESTS/playwright/globalSetup.ts
// — Global setup to wake up the backend before running E2E Playwright tests —

// TESTS/e2e/_setup/warmup.setup.ts
import { test } from '@playwright/test';
import { getEvaluateUrl } from '../../../ts/config-api';

test('wake backend', async () => {
	console.log('Running backend warmup…');
	console.time('Backend warmup time');

	try {
		const response = await fetch(getEvaluateUrl(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ expression: '1+1' }), // safe cold-start
		});

		console.timeEnd('Backend warmup time');

		if (response.ok) {
			console.log('Backend is awake and responsive.');
		} else {
			console.warn(`Backend responded with status: ${response.status}`);
		}
	} catch (error) {
		console.error('Failed to warm up backend:', error);
	}
});
