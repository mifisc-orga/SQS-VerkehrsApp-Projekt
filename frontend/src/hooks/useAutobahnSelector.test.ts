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

/** Renders the hook and flushes the initial async useEffect. */
async function setup(selected: string[], max = 5) {
  const { result } = renderHook(() => useAutobahnSelector(selected, ON_SELECT, max));
  await act(async () => {});
  return result;
}

describe('useAutobahnSelector', () => {
  test('fetches and returns available roads on mount', async () => {
    const result = await setup([]);
    expect(result.current.roads).toEqual(['A1', 'A3', 'A9']);
  });

  test('toggle adds a road when under max', async () => {
    const result = await setup([]);
    act(() => result.current.toggle('A3'));
    expect(ON_SELECT).toHaveBeenCalledWith(['A3']);
  });

  test('toggle removes a road when already selected', async () => {
    const result = await setup(['A3']);
    act(() => result.current.toggle('A3'));
    expect(ON_SELECT).toHaveBeenCalledWith([]);
  });

  test('toggle does nothing when max is reached and road not selected', async () => {
    const result = await setup(['A1', 'A3'], 2);
    act(() => result.current.toggle('A9'));
    expect(ON_SELECT).not.toHaveBeenCalled();
  });

  test('remove calls onSelect without the road', async () => {
    const result = await setup(['A1', 'A3']);
    act(() => result.current.remove('A1'));
    expect(ON_SELECT).toHaveBeenCalledWith(['A3']);
  });

  test('sets error when fetchAvailableRoads fails', async () => {
    const { fetchAvailableRoads } = await import('../services/trafficService');
    vi.mocked(fetchAvailableRoads).mockRejectedValueOnce(new Error('network error'));
    const result = await setup([]);
    expect(result.current.error).toBe('Autobahnen konnten nicht geladen werden.');
  });
});