import {expect, test} from './coverage';

const mockRoads = {
  live: true,
  cachedAt: null,
  events: [
    { id: '1', roadId: 'A1', title: 'Test', subtitle: '', description: '', type: 'WARNING', latitude: 48.0, longitude: 11.0, riskLevel: 'MEDIUM' },
    { id: '2', roadId: 'A3', title: 'Test', subtitle: '', description: '', type: 'ROADWORK', latitude: 49.0, longitude: 12.0, riskLevel: 'LOW' },
    { id: '3', roadId: 'A9', title: 'Test', subtitle: '', description: '', type: 'CLOSURE', latitude: 50.0, longitude: 13.0, riskLevel: 'HIGH' },
  ]
};

test.beforeEach(async ({ page }) => {
  await page.route('/api/traffic', async (route) => {
    await route.fulfill({ json: mockRoads });
  });
});

test('Autobahnauswahl wird angezeigt', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('autobahn-selector')).toBeVisible();
});

test('Autobahnen werden in der Liste angezeigt', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('autobahn-selector').click();
  await expect(page.getByTestId('road-option-A1')).toBeVisible();
});

test('Autobahn kann ausgewählt werden', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('autobahn-selector').click();
  await page.getByTestId('road-option-A1').click(); // deselect (war vorausgewählt)
  await page.getByTestId('road-option-A1').click(); // re-select
  await page.getByTestId('autobahn-selector').click(); // Dropdown schließen
  await expect(page.getByTestId('selected-chip-A1')).toBeVisible();
});
