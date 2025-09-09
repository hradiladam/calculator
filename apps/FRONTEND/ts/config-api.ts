// ts/config-api.ts

// Single source of truth for production endpoint:
const PROD_EVALUATE_URL = 'https://calculator-yzjs.onrender.com/evaluate';

// Local development endpoint:
const LOCAL_EVALUATE_URL = 'http://localhost:3000/evaluate';

/**
 * Returns the full URL of the `/evaluate` endpoint,
 * choosing localhost in dev and the production host otherwise.
 */
export function getEvaluateUrl(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return LOCAL_EVALUATE_URL;
    }
    return PROD_EVALUATE_URL;
  }

  // In Node.js (Playwright, tests): allow override via ENV, else prod
  return process.env.API_EVALUATE_URL ?? PROD_EVALUATE_URL;
}
