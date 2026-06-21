import type { Page } from '@playwright/test';

/** Standard mock data shared across Playwright test files. */
export const MOCK_TRAFFIC_DATA = { live: true, cachedAt: null, events: [] };
/** Mock response returned by the /api/auth/login route. */
export const MOCK_LOGIN_RESPONSE = { token: 'mock-jwt-token' };
/** Mock response returned by the /api/auth/register route. */
export const MOCK_REGISTER_RESPONSE = { token: 'mock-register-token' };

/**
 * Registers all standard API route mocks for a Playwright page.
 * Call this inside `test.beforeEach` to avoid duplicating route setup in every spec file.
 */
export async function setupApiRoutes(page: Page): Promise<void> {
  await page.route('/api/traffic', async route => route.fulfill({ json: MOCK_TRAFFIC_DATA }));
  await page.route('/api/traffic/**', async route => route.fulfill({ json: MOCK_TRAFFIC_DATA }));
  await page.route('/api/auth/login', async route => route.fulfill({ json: MOCK_LOGIN_RESPONSE }));
  await page.route('/api/auth/register', async route => route.fulfill({ json: MOCK_REGISTER_RESPONSE }));
  await page.route('/api/auth/logout', async route => route.fulfill({ status: 200 }));
  await page.route('/api/saved-roads', async route => route.fulfill({ json: [] }));
  await page.route('/api/dashboard/saved-road-traffic', async route => route.fulfill({ json: [] }));
}
