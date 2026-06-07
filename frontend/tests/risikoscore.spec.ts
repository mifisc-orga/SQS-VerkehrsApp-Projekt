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
    {
      id: '3',
      roadId: 'A9',
      title: 'Warnung A9',
      subtitle: 'Richtung München',
      description: 'Glatteis',
      type: 'WARNING',
      latitude: 48.5,
      longitude: 11.5,
      riskLevel: 'MEDIUM',
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

test('Risikoscore-Badge wird bei Ereignissen angezeigt', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('risk-badge').first()).toBeVisible();
});

test('HIGH Risiko wird rot dargestellt', async ({ page }) => {
  await page.goto('/');
  const highBadge = page.getByTestId('risk-badge-HIGH').first();
  await expect(highBadge).toBeVisible();
  await expect(highBadge).toHaveClass(/risk-high/);
});

test('MEDIUM Risiko wird gelb dargestellt', async ({ page }) => {
  await page.goto('/');
  const mediumBadge = page.getByTestId('risk-badge-MEDIUM').first();
  await expect(mediumBadge).toBeVisible();
  await expect(mediumBadge).toHaveClass(/risk-medium/);
});

test('LOW Risiko wird grün dargestellt', async ({ page }) => {
  await page.goto('/');
  const lowBadge = page.getByTestId('risk-badge-LOW').first();
  await expect(lowBadge).toBeVisible();
  await expect(lowBadge).toHaveClass(/risk-low/);
});
