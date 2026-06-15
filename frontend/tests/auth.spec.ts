import { expect, test } from './coverage';

const mockTrafficData = { live: true, cachedAt: null, events: [] };
const mockLoginResponse = { token: 'mock-jwt-token' };
const mockRegisterResponse = { token: 'mock-register-token' };

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
  await page.route('/api/auth/register', async route => {
    await route.fulfill({ status: 409, json: { message: 'Username already taken' } });
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

test('Error message shown on wrong login credentials', async ({ page }) => {
  await page.route('/api/auth/login', async route => {
    await route.fulfill({ status: 401, json: { message: 'Invalid credentials' } });
  });
  await page.goto('/');
  await page.getByTestId('login-button').click();
  await page.getByTestId('username-input').fill('wronguser');
  await page.getByTestId('password-input').fill('wrongpass');
  await page.getByTestId('submit-login').click();
  await expect(page.getByTestId('auth-error')).toBeVisible();
});

test('Error message is cleared when switching tabs', async ({ page }) => {
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
