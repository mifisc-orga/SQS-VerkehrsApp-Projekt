import {expect, test} from './coverage';

const MOCK_TRAFFIC_DATA = {
  live: true,
  cachedAt: null,
  events: [
    {
      id: '1',
      roadId: 'A3',
      title: 'Baustelle A3',
      subtitle: 'Richtung München',
      description: 'Fahrbahnverengung',
      type: 'ROADWORK',
      latitude: 48.1,
      longitude: 11.5,
      riskLevel: 'HIGH',
    },
    {
      id: '2',
      roadId: 'A92',
      title: 'Stau A92',
      subtitle: 'Richtung Landshut',
      description: 'Stockender Verkehr',
      type: 'TRAFFIC_JAM',
      latitude: 48.5,
      longitude: 12.1,
      riskLevel: 'MEDIUM',
    },
  ],
};

const MOCK_LOGIN_RESPONSE = {
  token: 'mock-jwt-token',
  username: 'testuser',
};

const MOCK_SAVED_ROADS = [
  { id: '1', userId: '1', roadId: 'A3' },
  { id: '2', userId: '1', roadId: 'A92' },
];
const createSavedRoadTraffic = (roadId: string, riskScore: number) => ({
  roadId,
  trafficEvents: {
    events: MOCK_TRAFFIC_DATA.events.filter(
      (event: { roadId: string }) => event.roadId === roadId
    ),
    live: true,
    cachedAt: null,
    riskScore,
  },
});
test.beforeEach(async ({ page }) => {
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_DATA });
  );
  await page.route('/api/traffic/**', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_DATA });
  );
  await page.route('/api/auth/login', async route => 
    await route.fulfill({ json: MOCK_LOGIN_RESPONSE });
  );
  await page.route('/api/saved-roads', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: MOCK_SAVED_ROADS });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, json: {} });
    }
  });
  await page.route('/api/saved-roads/**', async route => 
    await route.fulfill({ status: 200, json: {} });
  );
  await page.route('/api/dashboard/saved-road-traffic', async route => {
    await route.fulfill({
      json: [
       createSavedRoadTraffic('A3', 2),
       createSavedRoadTraffic('A92', 1),
      ],
    });
  });
});

test('Dashboard ist nicht sichtbar wenn nicht eingeloggt', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('dashboard')).not.toBeVisible();
});

test('Dashboard wird nach Login angezeigt', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('dashboard')).toBeVisible();
});

test('Gespeicherte Autobahnen werden im Dashboard angezeigt', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('dashboard-road-A3')).toBeVisible();
  await expect(page.getByTestId('dashboard-road-A92')).toBeVisible();
});

test('Nutzer kann Favorit aus Dashboard löschen', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('testuser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('dashboard-road-A3')).toBeVisible();
  await page.getByTestId('delete-favourite-A3').click();
  await expect(page.getByTestId('confirm-modal')).toBeVisible();
  await page.getByTestId('confirm-ok').click();
  await expect(page.getByTestId('dashboard-road-A3')).not.toBeVisible();
});
