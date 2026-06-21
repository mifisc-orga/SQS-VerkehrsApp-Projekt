import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useTraffic } from './useTraffic';
import { fetchTrafficEvents } from '../services/trafficService';

vi.mock('../services/trafficService', () => ({
  fetchTrafficEvents: vi.fn(),
}));

const EVENT_A3 = { roadId: 'A3', type: 'ACCIDENT', lat: 48.1, lng: 11.5 };
const EVENT_A9 = { roadId: 'A9', type: 'JAM', lat: 48.2, lng: 11.6 };
const EVENT_A8 = { roadId: 'A8', type: 'JAM', lat: 48.3, lng: 11.7 };
const EVENT_A1 = { roadId: 'A1', type: 'JAM', lat: 48.4, lng: 11.8 };

async function setupWithTwoEvents() {
  vi.mocked(fetchTrafficEvents).mockResolvedValue({
    events: [EVENT_A3, EVENT_A9],
    live: true,
    cachedAt: null,
  });
  const { result } = renderHook(() => useTraffic());
  await waitFor(() => {
    expect(result.current.events.length).toBeGreaterThan(0);
  });
  return result;
}

describe('useTraffic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── initial load ──────────────────────────────────────────

  test('loads traffic events on mount', async () => {
    const result = await setupWithTwoEvents();
    expect(result.current.isLive).toBe(true);
    expect(result.current.cachedAt).toBeNull();
  });

  test('selects first three roads by default', async () => {
    vi.mocked(fetchTrafficEvents).mockResolvedValue({
      events: [EVENT_A1, EVENT_A3, EVENT_A8, EVENT_A9],
      live: false,
      cachedAt: '2024-01-01T10:00:00Z',
    });
    const { result } = renderHook(() => useTraffic());

    await waitFor(() => {
      expect(result.current.selectedRoads).toHaveLength(3);
    });

    expect(result.current.selectedRoads).toEqual(['A1', 'A3', 'A8']);
  });

  test('shows only events for selected roads after load', async () => {
    const result = await setupWithTwoEvents();
    expect(result.current.events.every(e => result.current.selectedRoads.includes(e.roadId))).toBe(true);
  });

  test('does not throw when fetch fails', async () => {
    vi.mocked(fetchTrafficEvents).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useTraffic());

    await waitFor(() => {
      expect(fetchTrafficEvents).toHaveBeenCalled();
    });

    expect(result.current.events).toEqual([]);
    expect(result.current.selectedRoads).toEqual([]);
  });

  // ── handleRoadSelect ──────────────────────────────────────

  test('handleRoadSelect filters events to selected roads', async () => {
    const result = await setupWithTwoEvents();

    act(() => {
      result.current.handleRoadSelect(['A3']);
    });

    expect(result.current.selectedRoads).toEqual(['A3']);
    expect(result.current.events).toEqual([EVENT_A3]);
  });

  test('handleRoadSelect with empty array shows all events', async () => {
    const result = await setupWithTwoEvents();

    act(() => {
      result.current.handleRoadSelect([]);
    });

    expect(result.current.events).toEqual([EVENT_A3, EVENT_A9]);
  });
});
