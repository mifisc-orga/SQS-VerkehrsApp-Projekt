import {expect, test} from './coverage';

const MOCK_TRAFFIC_DATA = {
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

const MOCK_LOGIN_RESPONSE = {
  token: 'mock-jwt-token',
  username: 'testuser',
};

const MOCK_SAVED_ROADS = [
  { id: '1', userId: '1', roadId: 'A1' },
  { id: '2', userId: '1', roadId: 'A3' },
];

async function performLogin(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('submit-login').click();
}

test.beforeEach(async ({ page }) => {
  await page.route('/api/traffic', async (route) => 
    await route.fulfill({ json: MOCK_TRAFFIC_DATA });
  );
  await page.route('/api/traffic/**', async (route) => 
    await route.fulfill({ json: MOCK_TRAFFIC_DATA });
  );
  await page.route('/api/auth/login', async (route) => 
    await route.fulfill({ json: MOCK_LOGIN_RESPONSE });
  );
  await page.route('/api/saved-roads', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: MOCK_SAVED_ROADS });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, json: {} });
    }
  });
  await page.route('/api/saved-roads/**', async (route) => 
    await route.fulfill({ status: 200, json: {} });
  );
});

test('Login-Formular wird angezeigt', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('login-button')).toBeVisible();
});

test('Benutzer kann sich einloggen', async ({ page }) => {
  await performLogin(page);
  await expect(page.getByTestId('user-info')).toBeVisible();
});

test('Autobahn kann als Favourit gespeichert werden', async ({ page }) => {
  await performLogin(page);
  // A1 ist standardmäßig vorausgewählt
  await page.getByTestId('save-favourite-button').click();
  await expect(page.getByTestId('favourite-saved-message')).toBeVisible();
});

test('Gespeicherter Favourit wird im Dashboard angezeigt', async ({ page }) => {
  let saved = false;

  await page.route('/api/saved-roads', async route => {
    if (route.request().method() === 'POST') {
      saved = true;
      await route.fulfill({ status: 200, json: {} });
    } else {
      await route.fulfill({ json: [] });
    }
  });

  await page.route('/api/dashboard/saved-road-traffic', async route => {
    await route.fulfill({
      json: saved ? [{
        roadId: 'A1',
        trafficEvents: { events: [], live: true, cachedAt: null, riskScore: 0 },
      }] : [],
    });
  });

  await performLogin(page);
  await expect(page.getByTestId('dashboard-road-A1')).not.toBeVisible();
  await page.getByTestId('save-favourite-button').click();
  await expect(page.getByTestId('favourite-saved-message')).toBeVisible();
  await expect(page.getByTestId('dashboard-road-A1')).toBeVisible();
});

test('Hinweis wenn alle Autobahnen bereits gespeichert sind', async ({ page }) => {
  await page.route('/api/saved-roads', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 403, json: {} });
    } else {
      await route.fulfill({ json: [] });
    }
  });

  await performLogin(page);
  await page.getByTestId('save-favourite-button').click();
  await expect(page.getByTestId('favourite-saved-message')).toBeVisible();
  await expect(page.getByTestId('favourite-saved-message')).toContainText('bereits');
});