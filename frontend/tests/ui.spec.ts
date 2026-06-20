import { expect, test } from './coverage';

const MOCK_TRAFFIC_DATA = { live: true, cachedAt: null, events: [] };
const MOCK_LOGIN_RESPONSE = { token: 'mock-jwt-token' };

/** A realistic traffic event used in tests that need visible map markers and risk badges. */
const MOCK_EVENT = {
  id: 'ev-1',
  roadId: 'A3',
  title: 'Stau auf der A3',
  subtitle: 'Länge: 5 km',
  description: 'Stau zwischen München und Nürnberg',
  type: 'JAM',
  latitude: 48.1,
  longitude: 11.5,
  riskLevel: 'HIGH',
};

const MOCK_TRAFFIC_WITH_EVENTS = { live: true, cachedAt: null, events: [MOCK_EVENT] };
const MOCK_TRAFFIC_CACHED = { live: false, cachedAt: '2024-01-15T14:30:00.000Z', events: [] };

/** Dashboard API response with a HIGH-risk ROADWORK event on A3. */
const MOCK_DASHBOARD_HIGH = [{
  roadId: 'A3',
  trafficEvents: {
    events: [{
      id: 'ev-dash-1',
      roadId: 'A3',
      title: 'Schwerer Stau',
      subtitle: '10 km',
      description: 'Stau auf der A3',
      type: 'ROADWORK',
      latitude: 48.1,
      longitude: 11.5,
      riskLevel: 'HIGH',
    }],
    riskScore: 0.9,
  },
}];

/** Dashboard API response with a MEDIUM-risk CLOSURE event on A9. */
const MOCK_DASHBOARD_MEDIUM = [{
  roadId: 'A9',
  trafficEvents: {
    events: [{
      id: 'ev-dash-2',
      roadId: 'A9',
      title: 'Sperrung A9',
      subtitle: '3 km',
      description: 'Sperrung auf der A9',
      type: 'CLOSURE',
      latitude: 48.2,
      longitude: 11.6,
      riskLevel: 'MEDIUM',
    }],
    riskScore: 0.5,
  },
}];

/** Dashboard API response with a LOW-risk WARNING event on A8. */
const MOCK_DASHBOARD_WARNING = [{
  roadId: 'A8',
  trafficEvents: {
    events: [{
      id: 'ev-dash-3',
      roadId: 'A8',
      title: 'Warnung A8',
      subtitle: '2 km',
      description: 'Warnung auf der A8',
      type: 'WARNING',
      latitude: 48.3,
      longitude: 11.7,
      riskLevel: 'LOW',
    }],
    riskScore: 0.1,
  },
}];


/**
 * Helper: performs the standard login flow.
 */
async function performLogin(
  page: import('@playwright/test').Page,
  username = 'testuser',
  password = 'password',
): Promise<void> {
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill(username);
  await page.getByTestId('password-input').fill(password);
  await page.getByTestId('submit-login').click();
}

/** Helper: overrides traffic route with events and navigates to home page. */
async function gotoWithEvents(page: import('@playwright/test').Page): Promise<void> {
  await page.route('/api/traffic', async route =>
    route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS })
  );
  await page.goto('/');
}

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
  await page.route('/api/auth/register', async route => 
    await route.fulfill({ json: MOCK_REGISTER_RESPONSE });
  );
  await page.route('/api/auth/logout', async route => 
    await route.fulfill({ status: 200 });
  );
  await page.route('/api/saved-roads', async route => 
    await route.fulfill({ json: [] });
  );
  await page.route('/api/dashboard/saved-road-traffic', async route => 
    await route.fulfill({ json: [] });
  );
});

// ── Events list ──────────────────────────────────────────────

test('Events list renders event items when traffic has events', async ({ page }) => {
  await gotoWithEvents(page);
  await expect(page.getByTestId('event-item-ev-1')).toBeVisible();
});

// ── IncidentMap ──────────────────────────────────────────────

test('Incident map is visible on page load', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('incident-map')).toBeVisible();
});

test('Live indicator is shown when traffic data is live', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('live-indicator')).toBeVisible();
});

test('Cached indicator is shown when traffic data is not live', async ({ page }) => {
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_CACHED });
  );
  await page.goto('/');
  await expect(page.getByTestId('cached-indicator')).toBeVisible();
});

// ── AutobahnSelector ─────────────────────────────────────────

test('AutobahnSelector button is visible on page load', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('autobahn-selector')).toBeVisible();
});

test('AutobahnSelector shows road options when traffic data has events', async ({ page }) => {
  await gotoWithEvents(page);
  await page.getByTestId('autobahn-selector').click();
  await expect(page.getByTestId('autobahn-dropdown')).toBeVisible();
  await expect(page.getByTestId('road-option-A3')).toBeVisible();
});

test('AutobahnSelector chip is shown for pre-selected road', async ({ page }) => {
  await gotoWithEvents(page);
  await expect(page.getByTestId('selected-chip-A3')).toBeVisible();
});

test('AutobahnSelector chip-remove deselects a road', async ({ page }) => {
  await gotoWithEvents(page);
  await page.getByTestId('chip-remove-A3').click();
  await expect(page.getByTestId('selected-chip-A3')).not.toBeVisible();
});

// ── RiskBadge ────────────────────────────────────────────────

test('RiskBadge is shown for events with HIGH risk level', async ({ page }) => {
  await gotoWithEvents(page);
  await expect(page.getByTestId('risk-badge-HIGH')).toBeVisible();
});

// ── ConfirmModal cancel ───────────────────────────────────────

test('Cancelling logout modal keeps user logged in', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await page.getByTestId('logout-button').click();
  await page.getByTestId('confirm-cancel').click();
  await expect(page.getByTestId('logout-button')).toBeVisible();
  await expect(page.getByTestId('user-info')).toBeVisible();
});

test('Clicking overlay of logout modal cancels logout', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await page.getByTestId('logout-button').click();
  await page.getByTestId('confirm-modal-overlay').click({ position: { x: 5, y: 5 } });
  await expect(page.getByTestId('logout-button')).toBeVisible();
});

// ── Dashboard with traffic data ───────────────────────────────

test('Dashboard shows HIGH risk badge for road with HIGH risk event', async ({ page }) => {
  await page.route('/api/dashboard/saved-road-traffic', async route => 
    await route.fulfill({ json: MOCK_DASHBOARD_HIGH });
  );
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByTestId('dashboard-road-A3')).toBeVisible();
  await expect(page.getByTestId('risk-badge-HIGH')).toBeVisible();
});

test('Dashboard shows MEDIUM risk badge for road with MEDIUM risk event', async ({ page }) => {
  await page.route('/api/dashboard/saved-road-traffic', async route => 
    await route.fulfill({ json: MOCK_DASHBOARD_MEDIUM });
  );
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByTestId('risk-badge-MEDIUM')).toBeVisible();
});

test('Dashboard shows Baustelle label for ROADWORK events', async ({ page }) => {
  await page.route('/api/dashboard/saved-road-traffic', async route => 
    await route.fulfill({ json: MOCK_DASHBOARD_HIGH });
  );
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByText(/Baustelle/)).toBeVisible();
});

test('Dashboard shows Sperrung label for CLOSURE events', async ({ page }) => {
  await page.route('/api/dashboard/saved-road-traffic', async route => 
    await route.fulfill({ json: MOCK_DASHBOARD_MEDIUM });
  );
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByText(/Sperrung/)).toBeVisible();
});

test('Dashboard shows Warnung label for WARNING events', async ({ page }) => {
  await page.route('/api/dashboard/saved-road-traffic', async route => 
    await route.fulfill({ json: MOCK_DASHBOARD_WARNING });
  );
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByText(/Warnung/)).toBeVisible();
});

// ── Save favourite ────────────────────────────────────────────

test('Save favourite button is visible when logged in with selected roads', async ({ page }) => {
  await gotoWithEvents(page);
  await performLogin(page);
  await expect(page.getByTestId('save-favourite-button')).toBeVisible();
});

test('Clicking save favourite shows Favouriten gespeichert message', async ({ page }) => {
  await gotoWithEvents(page);
  await performLogin(page);
  await page.getByTestId('save-favourite-button').click();
  await expect(page.getByTestId('favourite-saved-message')).toBeVisible();
});

test('Clicking save favourite shows already-in-favourites message when roads already saved', async ({ page }) => {
  await page.route('/api/traffic', async route => 
    route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
  );
  await page.route('/api/saved-roads', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 409, json: { message: 'Already exists' } });
    } else {
      await route.fulfill({ json: [] });
    }
  });
  await page.goto('/');
  await performLogin(page);
  await page.getByTestId('save-favourite-button').click();
  await expect(page.getByTestId('favourite-saved-message')).toBeVisible();
  await expect(page.getByTestId('favourite-saved-message')).toContainText('bereits');
});
