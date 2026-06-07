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
    {
      id: '2',
      roadId: 'A3',
      title: 'Sperrung A3',
      subtitle: 'Richtung Frankfurt',
      description: 'Vollsperrung',
      type: 'CLOSURE',
      latitude: 50.1,
      longitude: 8.7,
      riskLevel: 'HIGH',
    },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route('/api/traffic', async (route) => {
    await route.fulfill({ json: mockTrafficData });
  });
  await page.route('/api/traffic/**', async (route) => {
    await route.fulfill({ json: mockTrafficData });
  });
});

test('Karte wird angezeigt', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('incident-map')).toBeVisible();
});

test('Karte enthält Marker für Ereignisse', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.leaflet-marker-icon').first()).toBeVisible();
});
