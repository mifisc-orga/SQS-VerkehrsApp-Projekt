import { expect, test } from './coverage';

const mockTrafficData = { live: true, cachedAt: null, events: [] };
const mockLoginResponse = { token: 'mock-jwt-token' };
const mockRegisterResponse = { token: 'mock-register-token' };

/**
 * Hilfsfunktion: führt den Standard-Login-Ablauf durch.
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

test.beforeEach(async ({ page }) => {
  await page.route('/api/traffic', async route => {
    await route.fulfill({ json: mockTrafficData });
  });
  await page.route('/api/traffic/**', async route => {
    await route.fulfill({ json: mockTrafficData });
  });
  await page.route('/api/auth/login', async route => {
    await route.fulfill({ json: mockLoginResponse });
  });
  await page.route('/api/auth/register', async route => {
    await route.fulfill({ json: mockRegisterResponse });
  });
  await page.route('/api/auth/logout', async route => {
    await route.fulfill({ status: 200 });
  });
  await page.route('/api/saved-roads', async route => {
    await route.fulfill({ json: [] });
  });
  await page.route('/api/dashboard/saved-road-traffic', async route => {
    await route.fulfill({ json: [] });
  });
});

// ── Logout ───────────────────────────────────────────────────

test('Logout-Button ist nach dem Login sichtbar', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByTestId('logout-button')).toBeVisible();
});

test('Nach Logout ist der Login-Button wieder sichtbar', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await page.getByTestId('logout-button').click();
  await expect(page.getByTestId('login-button')).toBeVisible();
  await expect(page.getByTestId('user-info')).not.toBeVisible();
});

test('Nach Logout ist der Logout-Button nicht mehr sichtbar', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await page.getByTestId('logout-button').click();
  await expect(page.getByTestId('logout-button')).not.toBeVisible();
});

test('Dashboard wird nach Logout ausgeblendet', async ({ page }) => {
  await page.goto('/');
  await performLogin(page);
  await expect(page.getByTestId('dashboard')).toBeVisible();
  await page.getByTestId('logout-button').click();
  await expect(page.getByTestId('dashboard')).not.toBeVisible();
});

// ── Register-Tab ─────────────────────────────────────────────

test('Register-Tab ist im Auth-Modal sichtbar', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('tab-register')).toBeVisible();
});

test('Login-Tab ist standardmäßig aktiv', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('submit-login')).toBeVisible();
  await expect(page.getByTestId('submit-register')).not.toBeVisible();
});

test('Klick auf Register-Tab zeigt Register-Button', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await expect(page.getByTestId('submit-register')).toBeVisible();
  await expect(page.getByTestId('submit-login')).not.toBeVisible();
});

test('Zurück zu Login-Tab zeigt wieder Login-Button', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('tab-login').click();
  await expect(page.getByTestId('submit-login')).toBeVisible();
  await expect(page.getByTestId('submit-register')).not.toBeVisible();
});

// ── Registrierung – Erfolg ───────────────────────────────────

test('Nach Registrierung wird der Nutzername angezeigt', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('username-input').fill('newuser');
  await page.getByTestId('password-input').fill('securePass123');
  await page.getByTestId('submit-register').click();
  await expect(page.getByTestId('user-info')).toBeVisible();
  await expect(page.getByTestId('user-info')).toContainText('newuser');
});

test('Nach Registrierung ist der Logout-Button sichtbar', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('username-input').fill('newuser');
  await page.getByTestId('password-input').fill('securePass123');
  await page.getByTestId('submit-register').click();
  await expect(page.getByTestId('logout-button')).toBeVisible();
});

test('Nach Registrierung wird das Dashboard angezeigt', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('username-input').fill('newuser');
  await page.getByTestId('password-input').fill('securePass123');
  await page.getByTestId('submit-register').click();
  await expect(page.getByTestId('dashboard')).toBeVisible();
});

// ── Fehlerfälle ──────────────────────────────────────────────

test('Fehlermeldung bei bereits vergebenem Benutzernamen', async ({ page }) => {
  await page.route('/api/auth/register', async route => {
    await route.fulfill({ status: 409, json: { message: 'Benutzername bereits vergeben' } });
  });
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('tab-register').click();
  await page.getByTestId('username-input').fill('existinguser');
  await page.getByTestId('password-input').fill('password');
  await page.getByTestId('submit-register').click();
  await expect(page.getByTestId('auth-error')).toBeVisible();
  await expect(page.getByTestId('user-info')).not.toBeVisible();
});

test('Fehlermeldung bei falschem Login', async ({ page }) => {
  await page.route('/api/auth/login', async route => {
    await route.fulfill({ status: 401, json: { message: 'Ungültige Zugangsdaten' } });
  });
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('wronguser');
  await page.getByTestId('password-input').fill('wrongpass');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('auth-error')).toBeVisible();
});

test('Fehlermeldung wird beim Tab-Wechsel zurückgesetzt', async ({ page }) => {
  await page.route('/api/auth/login', async route => {
    await route.fulfill({ status: 401, json: {} });
  });
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('wrong');
  await page.getByTestId('password-input').fill('wrong');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('auth-error')).toBeVisible();
  await page.getByTestId('tab-register').click();
  await expect(page.getByTestId('auth-error')).not.toBeVisible();
});
