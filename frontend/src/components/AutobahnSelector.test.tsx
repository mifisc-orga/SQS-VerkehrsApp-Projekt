import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { AutobahnSelector } from './AutobahnSelector';
import { fetchAvailableRoads } from '../services/trafficService';

vi.mock('../services/trafficService', () => ({
  fetchAvailableRoads: vi.fn(),
}));

const ROADS = ['A1', 'A3', 'A8', 'A9', 'A92', 'A99'];

describe('AutobahnSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchAvailableRoads).mockResolvedValue(ROADS);
  });

  // ── basic rendering ───────────────────────────────────────

  test('renders the selector button', async () => {
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    expect(screen.getByTestId('autobahn-selector')).toBeInTheDocument();
  });

  test('opens dropdown when selector button is clicked', async () => {
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    fireEvent.click(screen.getByTestId('autobahn-selector'));
    await waitFor(() => {
      expect(screen.getByTestId('autobahn-dropdown')).toBeInTheDocument();
    });
  });

  test('shows all available roads in dropdown', async () => {
    render(<AutobahnSelector selected={[]} onSelect={vi.fn()} />);
    fireEvent.click(screen.getByTestId('autobahn-selector'));
    await waitFor(() => {
      expect(screen.getByTestId('road-option-A3')).toBeInTheDocument();
    });
    expect(screen.getByTestId('road-option-A9')).toBeInTheDocument();
  });

  // ── selection ─────────────────────────────────────────────

  test('calls onSelect with added road when a road is clicked', async () => {
    const onSelect = vi.fn();
    render(<AutobahnSelector selected={['A3']} onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId('autobahn-selector'));
    await waitFor(() => {
      expect(screen.getByTestId('road-option-A9')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('road-option-A9'));
    expect(onSelect).toHaveBeenCalledWith(['A3', 'A9']);
  });

  test('calls onSelect with road removed when already selected road is clicked', async () => {
    const onSelect = vi.fn();
    render(<AutobahnSelector selected={['A3', 'A9']} onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId('autobahn-selector'));
    await waitFor(() => {
      expect(screen.getByTestId('road-option-A3')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('road-option-A3'));
    expect(onSelect).toHaveBeenCalledWith(['A9']);
  });

  // ── max selection limit ───────────────────────────────────

  test('does not add road when max selection is reached', async () => {
    const onSelect = vi.fn();
    const maxSelected = ['A1', 'A3', 'A8', 'A9', 'A92'];
    render(<AutobahnSelector selected={maxSelected} onSelect={onSelect} max={5} />);
    fireEvent.click(screen.getByTestId('autobahn-selector'));
    await waitFor(() => {
      expect(screen.getByTestId('road-option-A99')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('road-option-A99'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  test('shows max-reached warning when selection limit is hit', async () => {
    const maxSelected = ['A1', 'A3', 'A8', 'A9', 'A92'];
    render(<AutobahnSelector selected={maxSelected} onSelect={vi.fn()} max={5} />);
    fireEvent.click(screen.getByTestId('autobahn-selector'));
    await waitFor(() => {
      expect(screen.getByText(/Maximum 5 Autobahnen erreicht/)).toBeInTheDocument();
    });
  });

  // ── chip remove ───────────────────────────────────────────

  test('shows chip for selected road', () => {
    render(<AutobahnSelector selected={['A3']} onSelect={vi.fn()} />);
    expect(screen.getByTestId('selected-chip-A3')).toBeInTheDocument();
  });

  test('calls onSelect with road removed when chip remove is clicked', () => {
    const onSelect = vi.fn();
    render(<AutobahnSelector selected={['A3', 'A9']} onSelect={onSelect} />);
    fireEvent.click(screen.getByTestId('chip-remove-A3'));
    expect(onSelect).toHaveBeenCalledWith(['A9']);
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
