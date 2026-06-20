import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboard } from './useDashboard';

vi.mock('../services/trafficService', () => ({
  fetchDashboardTraffic: vi.fn().mockResolvedValue([
    { roadId: 'A3', events: [], riskScore: 0 },
  ]),
  deleteFavourite: vi.fn().mockResolvedValue(undefined),
}));

/** Shared token used across tests */
const TOKEN = 'test-token';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useDashboard', () => {
  test('fetches road data on mount', async () => {
    const { result } = renderHook(() => useDashboard(TOKEN, 0));
    await act(async () => {});
    expect(result.current.roadData).toHaveLength(1);
    expect(result.current.roadData[0].roadId).toBe('A3');
  });

  test('confirmDeleteRoadId is null initially', () => {
    const { result } = renderHook(() => useDashboard(TOKEN, 0));
    expect(result.current.confirmDeleteRoadId).toBeNull();
  });

  test('handleDeleteRequest sets confirmDeleteRoadId', async () => {
    const { result } = renderHook(() => useDashboard(TOKEN, 0));
    await act(async () => {});
    act(() => result.current.handleDeleteRequest('A3'));
    expect(result.current.confirmDeleteRoadId).toBe('A3');
  });

  test('handleDeleteCancel clears confirmDeleteRoadId', async () => {
    const { result } = renderHook(() => useDashboard(TOKEN, 0));
    await act(async () => {});
    act(() => result.current.handleDeleteRequest('A3'));
    act(() => result.current.handleDeleteCancel());
    expect(result.current.confirmDeleteRoadId).toBeNull();
  });

  test('handleDeleteConfirm removes road from list and clears id', async () => {
    const { result } = renderHook(() => useDashboard(TOKEN, 0));
    await act(async () => {});
    act(() => result.current.handleDeleteRequest('A3'));
    await act(async () => { await result.current.handleDeleteConfirm(); });
    expect(result.current.roadData).toHaveLength(0);
    expect(result.current.confirmDeleteRoadId).toBeNull();
  });

  test('handleDeleteConfirm does nothing when confirmDeleteRoadId is null', async () => {
    const { deleteFavourite } = await import('../services/trafficService');
    const { result } = renderHook(() => useDashboard(TOKEN, 0));
    await act(async () => { await result.current.handleDeleteConfirm(); });
    expect(deleteFavourite).not.toHaveBeenCalled();
  });

  test('handleDeleteConfirm clears id even when deleteFavourite throws', async () => {
    const { deleteFavourite } = await import('../services/trafficService');
    vi.mocked(deleteFavourite).mockRejectedValueOnce(new Error('network'));
    const { result } = renderHook(() => useDashboard(TOKEN, 0));
    await act(async () => {});
    act(() => result.current.handleDeleteRequest('A3'));
    await act(async () => { await result.current.handleDeleteConfirm(); });
    expect(result.current.confirmDeleteRoadId).toBeNull();
  });
});