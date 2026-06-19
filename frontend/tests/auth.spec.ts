import { expect, test } from './coverage';

const MOCK_TRAFFIC_DATA = { live: true, cachedAt: null, events: [] };
const MOCK_LOGIN_RESPONSE = { token: 'mock-jwt-token' };
const MOCK_REGISTER_RESPONSE = { token: 'mock-register-token' };

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

/**
 * Helper: clicks the logout button and confirms the logout dialog.
 */
async function performLogout(page: import('@playwright/test').Page): Promise<void> {
  await page.getByTestId('logout-button').click();
  await page.getByTestId('confirm-ok').click();
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

// ── Logout ───────────────────────────────────────────────────

test('Logout button is visible after login', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByTestId('logout-button')).toBeVisible();
});

test('Login button is visible again after logout', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await performLogout(page);
  await expect(page.getByTestId('login-button')).toBeVisible();
  await expect(page.getByTestId('user-info')).not.toBeVisible();
});

test('Logout button is no longer visible after logout', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await performLogout(page);
  await expect(page.getByTestId('logout-button')).not.toBeVisible();
});

test('Dashboard is hidden after logout', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByTestId('dashboard')).toBeVisible();
  await performLogout(page);
  await expect(page.getByTestId('dashboard')).not.toBeVisible();
});

// ── Register tab ─────────────────────────────────────────────

test('Register tab is visible in auth modal', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('tab-register')).toBeVisible();
});

test('Login tab is active by default', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('submit-login')).toBeVisible();
  await expect(page.getByTestId('submit-register')).not.toBeVisible();
});

test('Clicking register tab shows register button', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await expect(page.getByTestId('submit-register')).toBeVisible();
  await expect(page.getByTestId('submit-login')).not.toBeVisible();
});

test('Switching back to login tab shows login button again', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('tab-login').click();
  await expect(page.getByTestId('submit-login')).toBeVisible();
  await expect(page.getByTestId('submit-register')).not.toBeVisible();
});

// ── Registration – success ───────────────────────────────────

test('Username is displayed after registration', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('username-input').fill('newuser');
  await page.getByTestId('password-input').fill('securePass123');
  await page.getByTestId('submit-register').click();
  await expect(page.getByTestId('user-info')).toBeVisible();
  await expect(page.getByTestId('user-info')).toContainText('newuser');
});

test('Logout button is visible after registration', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('username-input').fill('newuser');
  await page.getByTestId('password-input').fill('securePass123');
  await page.getByTestId('submit-register').click();
  await expect(page.getByTestId('logout-button')).toBeVisible();
});

test('Dashboard is displayed after registration', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('username-input').fill('newuser');
  await page.getByTestId('password-input').fill('securePass123');
  await page.getByTestId('submit-register').click();
  await expect(page.getByTestId('dashboard')).toBeVisible();
});

// ── Error cases ──────────────────────────────────────────────

test('Error message shown when username is already taken', async ({ page }) => {
  await page.route('/api/auth/register', async route => 
    await route.fulfill({ status: 409, json: { message: 'Username already taken' } });
  );
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('username-input').fill('existinguser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('submit-register').click();
  await expect(page.getByTestId('auth-error')).toBeVisible();
  await expect(page.getByTestId('user-info')).not.toBeVisible();
});

test('Error message shown on wrong login credentials', async ({ page }) => {
  await page.route('/api/auth/login', async route => 
    await route.fulfill({ status: 401, json: { message: 'Invalid credentials' } });
  );
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('wronguser');
  await page.getByTestId('password-input').fill('wrongpass');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('auth-error')).toBeVisible();
});

test('Error message is cleared when switching tabs', async ({ page }) => {
  await page.route('/api/auth/login', async route => 
    await route.fulfill({ status: 401, json: {} });
  );
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('wrong');
  await page.getByTestId('password-input').fill('wrong');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('auth-error')).toBeVisible();
  await page.getByTestId('tab-register').click();
  await expect(page.getByTestId('auth-error')).not.toBeVisible();
});

// ── Password toggle ──────────────────────────────────────────

test('Password field type is password by default', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  const input = page.getByTestId('password-input');
  await expect(input).toHaveAttribute('type', 'password');
});

test('Password field becomes text after clicking toggle', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('toggle-password').click();
  const input = page.getByTestId('password-input');
  await expect(input).toHaveAttribute('type', 'text');
});

test('Password field returns to password after clicking toggle twice', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('toggle-password').click();
  await page.getByTestId('toggle-password').click();
  const input = page.getByTestId('password-input');
  await expect(input).toHaveAttribute('type', 'password');
});

// ── Submit button label ──────────────────────────────────────

test('Submit button shows Einloggen on login tab', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('submit-login')).toContainText('Einloggen');
});

test('Submit button shows Registrieren on register tab', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await expect(page.getByTestId('submit-register')).toContainText('Registrieren');
});

// ── Events list ──────────────────────────────────────────────

test('Events list renders event items when traffic has events', async ({ page }) => {
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
  );
  await page.goto('/');
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
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
  );
  await page.goto('/');
  await page.getByTestId('autobahn-selector').click();
  await expect(page.getByTestId('autobahn-dropdown')).toBeVisible();
  await expect(page.getByTestId('road-option-A3')).toBeVisible();
});

test('AutobahnSelector chip is shown for pre-selected road', async ({ page }) => {
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
  );
  await page.goto('/');
  await expect(page.getByTestId('selected-chip-A3')).toBeVisible();
});

test('AutobahnSelector chip-remove deselects a road', async ({ page }) => {
  await page.route('/api/traffic', async route => {
    await route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
  });
  await page.goto('/');
  await page.getByTestId('chip-remove-A3').click();
  await expect(page.getByTestId('selected-chip-A3')).not.toBeVisible();
});

// ── RiskBadge ────────────────────────────────────────────────

test('RiskBadge is shown for events with HIGH risk level', async ({ page }) => {
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
  );
  await page.goto('/');
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
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
  );
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByTestId('save-favourite-button')).toBeVisible();
});

test('Clicking save favourite shows Favouriten gespeichert message', async ({ page }) => {
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
  );
  await page.goto('/');
  await performLogin(page);
  await page.getByTestId('save-favourite-button').click();
  await expect(page.getByTestId('favourite-saved-message')).toBeVisible();
});

test('Clicking save favourite shows already-in-favourites message when roads already saved', async ({ page }) => {
  await page.route('/api/traffic', async route => 
    await route.fulfill({ json: MOCK_TRAFFIC_WITH_EVENTS });
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
