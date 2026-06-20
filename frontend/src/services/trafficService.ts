import type { TrafficEvent, DashboardRoadData } from '../types';

const API_BASE = '/api';

/** Sends a fetch request and throws if the response status is not OK. */
async function checkedFetch(url: string, errorMessage: string, options?: RequestInit): Promise<Response> {
  const response = options === undefined ? await fetch(url) : await fetch(url, options);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response;
}

/** Fetches all available motorways from the server */
export async function fetchAvailableRoads(): Promise<string[]> {
  const response = await checkedFetch(`${API_BASE}/traffic`, 'Failed to load motorways');
  const data = await response.json();
  const roads: string[] = [...new Set<string>((data.events ?? []).map((e: { roadId: string }) => e.roadId))];
  return roads.sort((a, b) => a.localeCompare(b));
}

/** Result of a traffic data request */
export interface TrafficResult {
  /** List of traffic events */
  events: TrafficEvent[];
  /** true if the data is live from the server */
  live: boolean;
  /** Cache timestamp, or null if live */
  cachedAt: string | null;
}

/** Fetches traffic events, optionally filtered by motorway */
export async function fetchTrafficEvents(roadId?: string): Promise<TrafficResult> {
  const url = roadId ? `${API_BASE}/traffic/${roadId}` : `${API_BASE}/traffic`;
  const response = await checkedFetch(url, 'Failed to load events');
  const data = await response.json();
  return {
    events: data.events ?? [],
    live: data.live ?? false,
    cachedAt: data.cachedAt ?? null,
  };
}

/** Authenticates the user and returns a JWT token */
export async function login(username: string, password: string): Promise<{ token: string }> {
  const response = await checkedFetch(`${API_BASE}/auth/login`, 'Login failed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

/** Registers a new user and returns a JWT token */
export async function register(username: string, password: string): Promise<{ token: string }> {
  const response = await checkedFetch(`${API_BASE}/auth/register`, 'Registration failed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

/** Logs the user out server-side (JWT is stateless — token is only cleared on the client) */
export async function logout(token: string): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

/** Saves a motorway as a favourite for the logged-in user */
export async function saveFavourite(token: string, roadId: string): Promise<void> {
  await checkedFetch(`${API_BASE}/saved-roads`, 'Failed to save favourite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ roadId }),
  });
}

/** Removes a motorway from the logged-in user's favourites */
export async function deleteFavourite(token: string, roadId: string): Promise<void> {
  await checkedFetch(`${API_BASE}/saved-roads/${roadId}`, 'Failed to remove favourite', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

/** Fetches all saved motorways for the logged-in user */
export async function fetchSavedRoads(token: string): Promise<string[]> {
  const response = await checkedFetch(`${API_BASE}/saved-roads`, 'Failed to load saved roads', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  return data.map((item: { roadId: string }) => item.roadId);
}

/** Fetches dashboard data for all saved motorways of the logged-in user */
export async function fetchDashboardTraffic(token: string): Promise<DashboardRoadData[]> {
  const response = await checkedFetch(`${API_BASE}/dashboard/saved-road-traffic`, 'Failed to load dashboard data', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  return data.map((item: { roadId: string; trafficEvents: { events: TrafficEvent[]; riskScore: number } }) => ({
    roadId: item.roadId,
    events: item.trafficEvents.events ?? [],
    riskScore: item.trafficEvents.riskScore ?? 0,
  }));
}