import type { TrafficEvent } from '../components/IncidentMap';

const API_BASE = '/api';

export async function fetchAvailableRoads(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/traffic`);
  if (!response.ok) {
    throw new Error(`Fehler beim Laden der Autobahnen: ${response.status}`);
  }
  const data = await response.json();
  const roads: string[] = [...new Set<string>((data.events ?? []).map((e: { roadId: string }) => e.roadId))];
  return roads.sort();
}

export async function fetchTrafficEvents(roadId?: string): Promise<TrafficEvent[]> {
  const url = roadId ? `${API_BASE}/traffic/${roadId}` : `${API_BASE}/traffic`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fehler beim Laden der Ereignisse: ${response.status}`);
  }
  const data = await response.json();
  return data.events ?? [];
}

export async function login(username: string, password: string): Promise<{ token: string; username: string }> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Login fehlgeschlagen');
  }
  return response.json();
}

export async function saveFavourite(token: string, roadId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/saved-roads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ roadId }),
  });
  if (!response.ok) {
    throw new Error('Favorit konnte nicht gespeichert werden');
  }
}

export async function deleteFavourite(token: string, roadId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/saved-roads/${roadId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Favorit konnte nicht entfernt werden');
  }
}

export async function fetchSavedRoads(token: string): Promise<string[]> {
  const response = await fetch(`${API_BASE}/saved-roads`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Gespeicherte Straßen konnten nicht geladen werden');
  }
  return response.json();
}

export async function fetchDashboardTraffic(token: string): Promise<TrafficEvent[]> {
  const response = await fetch(`${API_BASE}/dashboard/saved-road-traffic`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Dashboard-Daten konnten nicht geladen werden');
  }
  const data = await response.json();
  return data.events ?? [];
}
