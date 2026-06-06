import {expect, test} from './coverage';

const mockTrafficData = {
  live: true,
  cachedAt: null,
  events: [
    {
      id: '1',
      roadId: 'A1',
      title: 'Baustelle A1',
      subtitle: 'Richtung Köln',
      description: 'Fahrbahnverengung',
      type: 'ROADWORK',
      latitude: 51.5,
      longitude: 7.1,
      riskLevel: 'LOW',
    },
  ],
};

const mockLoginResponse = {
  token: 'mock-jwt-token',
  username: 'testuser',
};

const mockSavedRoads = ['A1', 'A3'];

test.beforeEach(async ({ page }) => {
  await page.route('/api/traffic', async (route) => {
    await route.fulfill({ json: mockTrafficData });
  });
  await page.route('/api/traffic/**', async (route) => {
    await route.fulfill({ json: mockTrafficData });
  });
  await page.route('/api/auth/login', async (route) => {
    await route.fulfill({ json: mockLoginResponse });
  });
  await page.route('/api/saved-roads', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: mockSavedRoads });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, json: {} });
    }
  });
  await page.route('/api/saved-roads/**', async (route) => {
    await route.fulfill({ status: 200, json: {} });
  });
});

test('Login-Formular wird angezeigt', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('login-button')).toBeVisible();
});

test('Benutzer kann sich einloggen', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('user-info')).toBeVisible();
});

test('Autobahn kann als Favourit gespeichert werden', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('submit-login').click();
  // A1 ist standardmäßig vorausgewählt
  await page.getByTestId('save-favourite-button').click();
  await expect(page.getByTestId('favourite-saved-message')).toBeVisible();
});
