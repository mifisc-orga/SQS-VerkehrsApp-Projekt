import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { AutobahnSelector } from './AutobahnSelector';
import { fetchAvailableRoads } from '../../services/trafficService';

vi.mock('../../services/trafficService', () => ({
  fetchAvailableRoads: vi.fn(),
}));

const ROAD_A3 = 'A3';
const ROAD_A9 = 'A9';
const ROADS = ['A1', ROAD_A3, 'A8', ROAD_A9, 'A92', 'A99'];
const MANY_ROADS = ['A1','A2','A3','A4','A5','A6','A7','A8','A9','A10','A11','A12'];

const CHIP_A3 = 'road-chip-A3';
const CHIP_A9 = 'road-chip-A9';
const CHIP_A99 = 'road-chip-A99';

describe('AutobahnSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchAvailableRoads).mockResolvedValue(ROADS);
  });

  // ── basic rendering ───────────────────────────────────────

  test('renders chip grid on mount', async () => {
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    await act(async () => {});
    expect(screen.getByTestId('autobahn-selector')).toBeInTheDocument();
  });

  test('shows all available roads as chips', async () => {
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByTestId(CHIP_A3)).toBeInTheDocument();
    });
    expect(screen.getByTestId(CHIP_A9)).toBeInTheDocument();
  });

  // ── selection ─────────────────────────────────────────────

  test('calls onSelect with road added when unselected chip is clicked', async () => {
    const onSelect = vi.fn();
    render(<AutobahnSelector selected={[ROAD_A3]} onSelect={onSelect} />);
    await waitFor(() => expect(screen.getByTestId(CHIP_A9)).toBeInTheDocument());
    fireEvent.click(screen.getByTestId(CHIP_A9));
    expect(onSelect).toHaveBeenCalledWith([ROAD_A3, ROAD_A9]);
  });

  test('calls onSelect with road removed when selected chip is clicked', async () => {
    const onSelect = vi.fn();
    render(<AutobahnSelector selected={[ROAD_A3, ROAD_A9]} onSelect={onSelect} />);
    await waitFor(() => expect(screen.getByTestId(CHIP_A3)).toBeInTheDocument());
    fireEvent.click(screen.getByTestId(CHIP_A3));
    expect(onSelect).toHaveBeenCalledWith([ROAD_A9]);
  });

  test('selected chip has aria-pressed true', async () => {
    render(<AutobahnSelector selected={[ROAD_A3]} onSelect={vi.fn()} />);
    await waitFor(() => expect(screen.getByTestId(CHIP_A3)).toBeInTheDocument());
    expect(screen.getByTestId(CHIP_A3)).toHaveAttribute('aria-pressed', 'true');
  });

  // ── max selection limit ───────────────────────────────────

  test('unselected chips are disabled when max is reached', async () => {
    const maxSelected = ['A1', 'A3', 'A8', 'A9', 'A92'];
    render(<AutobahnSelector selected={maxSelected} onSelect={vi.fn()} max={5} />);
    await waitFor(() => expect(screen.getByTestId(CHIP_A99)).toBeInTheDocument());
    expect(screen.getByTestId(CHIP_A99)).toBeDisabled();
  });

  test('shows max-reached hint when selection limit is hit', async () => {
    const maxSelected = ['A1', 'A3', 'A8', 'A9', 'A92'];
    render(<AutobahnSelector selected={maxSelected} onSelect={vi.fn()} max={5} />);
    await waitFor(() => {
      expect(screen.getByTestId('max-reached-hint')).toBeInTheDocument();
    });
  });

  // ── show more / collapse ──────────────────────────────────

  test('shows only first 10 roads initially when more are available', async () => {
    vi.mocked(fetchAvailableRoads).mockResolvedValue(MANY_ROADS);
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    await waitFor(() => expect(screen.getByTestId('road-chip-A10')).toBeInTheDocument());
    expect(screen.queryByTestId('road-chip-A11')).not.toBeInTheDocument();
  });

  test('shows show-more button when roads exceed initial limit', async () => {
    vi.mocked(fetchAvailableRoads).mockResolvedValue(MANY_ROADS);
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    await waitFor(() => expect(screen.getByTestId('show-more-button')).toBeInTheDocument());
  });

  test('shows all roads after clicking show-more button', async () => {
    vi.mocked(fetchAvailableRoads).mockResolvedValue(MANY_ROADS);
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    await waitFor(() => expect(screen.getByTestId('show-more-button')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('show-more-button'));
    expect(screen.getByTestId('road-chip-A11')).toBeInTheDocument();
    expect(screen.getByTestId('road-chip-A12')).toBeInTheDocument();
  });

  // ── error state ───────────────────────────────────────────

  test('shows error message when roads cannot be loaded', async () => {
    vi.mocked(fetchAvailableRoads).mockRejectedValue(new Error('Network error'));
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText(/Autobahnen konnten nicht geladen werden/)).toBeInTheDocument();
    });
  });
});
