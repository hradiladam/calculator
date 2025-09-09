// TESTS/e2e/setup/globalSetup.ts
// Runs once before all Playwright tests.
// If we're hitting PROD, send one tiny request to wake the server.
// If we're on LOCALHOST, do nothing.

import { request } from '@playwright/test';
import { getEvaluateUrl } from '../../../apps/FRONTEND/ts/config-api';

export default async function globalSetup() {
	// 1) Pick API URL: env var wins, otherwise use the app's prod URL
	const apiUrl = process.env.API_EVALUATE_URL ?? getEvaluateUrl();

	// 2) If it's local, skip warmup
	if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
		console.log('[globalSetup] Local API → skip warmup:', apiUrl);
		return;
	}

	// 3) PROD: send a simple request to wake it up
	console.log('[globalSetup] Warming PROD API at', apiUrl);

	const http = await request.newContext();
	
	try {
		const res = await http.post(apiUrl, {
			data: { expression: '1+1' },
			headers: { 'Content-Type': 'application/json' }
		});
		console.log('[globalSetup] Warmup', res.ok() ? 'OK' : `FAILED ${res.status()}`);

	} catch (err) {
		console.log('[globalSetup] Warmup error:', err);

	} finally {
		await http.dispose();
	}
}
