import { test, expect } from '@playwright/test';

const mockTrafficData = {
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

const mockLoginResponse = {
  token: 'mock-jwt-token',
  username: 'testuser',
};

const mockSavedRoads = ['A3', 'A92'];

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
  await page.route('/api/dashboard/saved-road-traffic', async (route) => {
    await route.fulfill({ json: mockTrafficData });
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
  await expect(page.getByTestId('dashboard-road-A3')).not.toBeVisible();
});
