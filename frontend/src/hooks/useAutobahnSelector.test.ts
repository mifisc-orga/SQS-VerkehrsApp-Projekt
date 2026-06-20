import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutobahnSelector } from './useAutobahnSelector';

vi.mock('../services/trafficService', () => ({
  fetchAvailableRoads: vi.fn().mockResolvedValue(['A1', 'A3', 'A9']),
}));

/** Shared mock for the onSelect callback */
const ON_SELECT = vi.fn();

beforeEach(() => {
  ON_SELECT.mockClear();
});

describe('useAutobahnSelector', () => {
  test('fetches and returns available roads on mount', async () => {
    const { result } = renderHook(() => useAutobahnSelector([], ON_SELECT, 5));
    await act(async () => {});
    expect(result.current.roads).toEqual(['A1', 'A3', 'A9']);
  });

  test('isOpen is false initially', async () => {
    const { result } = renderHook(() => useAutobahnSelector([], ON_SELECT, 5));
    await act(async () => {});
    expect(result.current.isOpen).toBe(false);
  });

  test('setIsOpen toggles the dropdown', async () => {
    const { result } = renderHook(() => useAutobahnSelector([], ON_SELECT, 5));
    await act(async () => {});
    act(() => result.current.setIsOpen(true));
    expect(result.current.isOpen).toBe(true);
  });

  test('toggle adds a road when under max', async () => {
    const { result } = renderHook(() => useAutobahnSelector([], ON_SELECT, 5));
    await act(async () => {});
    act(() => result.current.toggle('A3'));
    expect(ON_SELECT).toHaveBeenCalledWith(['A3']);
  });

  test('toggle removes a road when already selected', async () => {
    const { result } = renderHook(() => useAutobahnSelector(['A3'], ON_SELECT, 5));
    await act(async () => {});
    act(() => result.current.toggle('A3'));
    expect(ON_SELECT).toHaveBeenCalledWith([]);
  });

  test('toggle does nothing when max is reached and road not selected', async () => {
    const { result } = renderHook(() => useAutobahnSelector(['A1', 'A3'], ON_SELECT, 2));
    await act(async () => {});
    act(() => result.current.toggle('A9'));
    expect(ON_SELECT).not.toHaveBeenCalled();
  });

  test('remove calls onSelect without the road', async () => {
    const { result } = renderHook(() => useAutobahnSelector(['A1', 'A3'], ON_SELECT, 5));
    await act(async () => {});
    act(() => result.current.remove('A1'));
    expect(ON_SELECT).toHaveBeenCalledWith(['A3']);
  });

  test('sets error when fetchAvailableRoads fails', async () => {
    const { fetchAvailableRoads } = await import('../services/trafficService');
    vi.mocked(fetchAvailableRoads).mockRejectedValueOnce(new Error('network error'));
    const { result } = renderHook(() => useAutobahnSelector([], ON_SELECT, 5));
    await act(async () => {});
    expect(result.current.error).toBe('Autobahnen konnten nicht geladen werden.');
  });
});