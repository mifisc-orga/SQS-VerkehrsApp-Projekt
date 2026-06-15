import { describe, expect, test, vi, afterEach } from 'vitest';
import {
  login,
  register,
  logout,
  saveFavourite,
  fetchAvailableRoads,
  fetchTrafficEvents,
  deleteFavourite,
  fetchSavedRoads,
  fetchDashboardTraffic,
} from './trafficService';

/** Helper: creates a mock fetch response */
function mockFetch(ok: boolean, body: unknown = {}): void {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    json: async () => body,
  } as Response));
}

describe('trafficService', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ── login ─────────────────────────────────────────────────

  describe('login', () => {
    test('sends POST to /api/auth/login with credentials', async () => {
      mockFetch(true, { token: 'test-token' });
      await login('user', 'pass');
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'user', password: 'pass' }),
      });
    });

    test('returns token on success', async () => {
      mockFetch(true, { token: 'test-token' });
      const result = await login('user', 'pass');
      expect(result.token).toBe('test-token');
    });

    test('throws on non-ok response', async () => {
      mockFetch(false);
      await expect(login('user', 'wrong')).rejects.toThrow();
    });
  });

  // ── register ──────────────────────────────────────────────

  describe('register', () => {
    test('sends POST to /api/auth/register with credentials', async () => {
      mockFetch(true, { token: 'reg-token' });
      await register('newuser', 'pass');
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'newuser', password: 'pass' }),
      });
    });

    test('returns token on success', async () => {
      mockFetch(true, { token: 'reg-token' });
      const result = await register('newuser', 'pass');
      expect(result.token).toBe('reg-token');
    });

    test('throws when username is already taken', async () => {
      mockFetch(false);
      await expect(register('taken', 'pass')).rejects.toThrow();
    });
  });

  // ── logout ────────────────────────────────────────────────

  describe('logout', () => {
    test('sends POST to /api/auth/logout with Authorization header', async () => {
      mockFetch(true);
      await logout('my-token');
      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer my-token' },
      });
    });
  });

  // ── saveFavourite ─────────────────────────────────────────

  describe('saveFavourite', () => {
    test('sends POST to /api/saved-roads with roadId and token', async () => {
      mockFetch(true);
      await saveFavourite('my-token', 'A3');
      expect(fetch).toHaveBeenCalledWith('/api/saved-roads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer my-token',
        },
        body: JSON.stringify({ roadId: 'A3' }),
      });
    });

    test('throws on non-ok response', async () => {
      mockFetch(false);
      await expect(saveFavourite('token', 'A3')).rejects.toThrow();
    });
  });

  // ── fetchAvailableRoads ───────────────────────────────────

  describe('fetchAvailableRoads', () => {
    test('returns sorted unique road IDs from traffic events', async () => {
      mockFetch(true, { events: [{ roadId: 'A9' }, { roadId: 'A3' }, { roadId: 'A9' }] });
      const roads = await fetchAvailableRoads();
      expect(roads).toEqual(['A3', 'A9']);
    });

    test('returns empty array when no events', async () => {
      mockFetch(true, { events: [] });
      const roads = await fetchAvailableRoads();
      expect(roads).toEqual([]);
    });

    test('returns empty array when response has no events field', async () => {
      mockFetch(true, {});
      const roads = await fetchAvailableRoads();
      expect(roads).toEqual([]);
    });

    test('throws on non-ok response', async () => {
      mockFetch(false);
      await expect(fetchAvailableRoads()).rejects.toThrow();
    });
  });

  // ── fetchTrafficEvents ────────────────────────────────────

  describe('fetchTrafficEvents', () => {
    test('fetches all events when no roadId given', async () => {
      mockFetch(true, { events: [{ roadId: 'A3' }], live: true, cachedAt: null });
      await fetchTrafficEvents();
      expect(fetch).toHaveBeenCalledWith('/api/traffic');
    });

    test('fetches filtered events when roadId given', async () => {
      mockFetch(true, { events: [], live: false, cachedAt: '2024-01-01T10:00:00Z' });
      await fetchTrafficEvents('A3');
      expect(fetch).toHaveBeenCalledWith('/api/traffic/A3');
    });

    test('returns events, live flag and cachedAt', async () => {
      const event = { roadId: 'A3', type: 'ACCIDENT' };
      mockFetch(true, { events: [event], live: true, cachedAt: '2024-01-01T10:00:00Z' });
      const result = await fetchTrafficEvents();
      expect(result.events).toEqual([event]);
      expect(result.live).toBe(true);
      expect(result.cachedAt).toBe('2024-01-01T10:00:00Z');
    });

    test('returns empty events and false live when response fields are missing', async () => {
      mockFetch(true, {});
      const result = await fetchTrafficEvents();
      expect(result.events).toEqual([]);
      expect(result.live).toBe(false);
      expect(result.cachedAt).toBeNull();
    });

    test('throws on non-ok response', async () => {
      mockFetch(false);
      await expect(fetchTrafficEvents()).rejects.toThrow();
    });
  });

  // ── deleteFavourite ───────────────────────────────────────

  describe('deleteFavourite', () => {
    test('sends DELETE to /api/saved-roads/:roadId with token', async () => {
      mockFetch(true);
      await deleteFavourite('my-token', 'A3');
      expect(fetch).toHaveBeenCalledWith('/api/saved-roads/A3', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer my-token' },
      });
    });

    test('throws on non-ok response', async () => {
      mockFetch(false);
      await expect(deleteFavourite('token', 'A3')).rejects.toThrow();
    });
  });

  // ── fetchSavedRoads ───────────────────────────────────────

  describe('fetchSavedRoads', () => {
    test('returns list of road IDs for the logged-in user', async () => {
      mockFetch(true, [{ roadId: 'A3' }, { roadId: 'A9' }]);
      const roads = await fetchSavedRoads('my-token');
      expect(roads).toEqual(['A3', 'A9']);
    });

    test('sends Authorization header', async () => {
      mockFetch(true, []);
      await fetchSavedRoads('my-token');
      expect(fetch).toHaveBeenCalledWith('/api/saved-roads', {
        headers: { 'Authorization': 'Bearer my-token' },
      });
    });

    test('throws on non-ok response', async () => {
      mockFetch(false);
      await expect(fetchSavedRoads('token')).rejects.toThrow();
    });
  });

  // ── fetchDashboardTraffic ─────────────────────────────────

  describe('fetchDashboardTraffic', () => {
    test('returns mapped dashboard data', async () => {
      const raw = [{
        roadId: 'A3',
        trafficEvents: { events: [{ roadId: 'A3', type: 'JAM' }], riskScore: 0.8 },
      }];
      mockFetch(true, raw);
      const result = await fetchDashboardTraffic('my-token');
      expect(result).toHaveLength(1);
      expect(result[0].roadId).toBe('A3');
      expect(result[0].riskScore).toBe(0.8);
    });

    test('defaults to empty events and zero risk when fields missing', async () => {
      mockFetch(true, [{ roadId: 'A1', trafficEvents: {} }]);
      const result = await fetchDashboardTraffic('my-token');
      expect(result[0].events).toEqual([]);
      expect(result[0].riskScore).toBe(0);
    });

    test('throws on non-ok response', async () => {
      mockFetch(false);
      await expect(fetchDashboardTraffic('token')).rejects.toThrow();
    });
  });
});
