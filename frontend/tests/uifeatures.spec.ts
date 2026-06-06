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

const mockTrafficDataCached = {
  live: false,
  cachedAt: '2026-05-15T10:00:00Z',
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
    await route.fulfill({ json: [] });
  });
  await page.route('/api/dashboard/saved-road-traffic', async (route) => {
    await route.fulfill({ json: mockTrafficData });
  });
});

// ── 1. Login Modal ──────────────────────────────────────────

test('Login-Modal öffnet sich beim Klick auf Login', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('login-modal')).toBeVisible();
});

test('Login-Modal kann mit X-Button geschlossen werden', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('login-modal')).toBeVisible();
  await page.getByTestId('login-modal-close').click();
  await expect(page.getByTestId('login-modal')).not.toBeVisible();
});

test('Login-Modal kann durch Klick auf Overlay geschlossen werden', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('login-modal')).toBeVisible();
  await page.getByTestId('login-modal-overlay').click({ position: { x: 5, y: 5 } });
  await expect(page.getByTestId('login-modal')).not.toBeVisible();
});

// ── 6. Live Indikator ────────────────────────────────────────

test('Live-Indikator wird angezeigt wenn Daten live sind', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('live-indicator')).toBeVisible();
});

test('Kein Live-Indikator wenn Daten gecacht sind', async ({ page }) => {
  await page.route('/api/traffic', async (route) => {
    await route.fulfill({ json: mockTrafficDataCached });
  });
  await page.goto('/');
  await expect(page.getByTestId('cached-indicator')).toBeVisible();
});

// ── 7. Alle Ereignisse bei keiner Auswahl ────────────────────

test('Alle Ereignisse werden angezeigt wenn keine Autobahn ausgewählt', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('event-item-1')).toBeVisible();
});

test('Auswahl kann per Chip-X entfernt werden', async ({ page }) => {
  await page.goto('/');
  // A1 ist standardmäßig vorausgewählt
  await expect(page.getByTestId('selected-chip-A1')).toBeVisible();
  await page.getByTestId('chip-remove-A1').click();
  await expect(page.getByTestId('selected-chip-A1')).not.toBeVisible();
});
