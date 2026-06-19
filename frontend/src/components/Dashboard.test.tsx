import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { Dashboard } from './Dashboard';
import { fetchDashboardTraffic, deleteFavourite } from '../services/trafficService';

vi.mock('../services/trafficService', () => ({
  fetchDashboardTraffic: vi.fn(),
  deleteFavourite: vi.fn(),
}));

const DEFAULT_PROPS = {
  token: 'test-token',
  refreshKey: 0,
  onRoadSelect: vi.fn(),
};

const ROAD_A3 = 'dashboard-road-A3';
const DELETE_A3 = 'delete-favourite-A3';

/** Builds a minimal TrafficEvent for dashboard tests. */
function buildEvent(overrides: {
  id?: string;
  roadId?: string;
  type?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
} = {}) {
  return {
    id: 'ev-1',
    roadId: 'A3',
    title: 'Stau',
    subtitle: '5 km',
    description: 'desc',
    type: 'JAM',
    latitude: 48.1,
    longitude: 11.5,
    riskLevel: 'LOW' as const,
    ...overrides,
  };
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── empty state ───────────────────────────────────────────

  test('shows empty message when no favourites are saved', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText(/Keine gespeicherten Autobahnen/)).toBeInTheDocument();
    });
  });

  test('shows road card when a favourite road exists', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([
      { roadId: 'A3', events: [], riskScore: 0 },
    ]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByTestId(ROAD_A3)).toBeInTheDocument();
    });
  });

  // ── risk levels ───────────────────────────────────────────

  test('shows HIGH risk badge when road has a HIGH risk event', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent({ riskLevel: 'HIGH' })],
      riskScore: 0.9,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByTestId('risk-badge-HIGH')).toBeInTheDocument();
    });
  });

  test('shows MEDIUM risk badge when road has a MEDIUM risk event', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent({ riskLevel: 'MEDIUM' })],
      riskScore: 0.5,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByTestId('risk-badge-MEDIUM')).toBeInTheDocument();
    });
  });

  test('shows LOW risk badge when road has only LOW risk events', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent({ riskLevel: 'LOW' })],
      riskScore: 0.1,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByTestId('risk-badge-LOW')).toBeInTheDocument();
    });
  });

  test('shows empty-events message when road has no events', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([
      { roadId: 'A3', events: [], riskScore: 0 },
    ]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText('Keine aktuellen Ereignisse.')).toBeInTheDocument();
    });
  });

  // ── event type labels ─────────────────────────────────────

  test('shows Baustelle label for ROADWORK events', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent({ type: 'ROADWORK' })],
      riskScore: 0,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText(/Baustelle/)).toBeInTheDocument();
    });
  });

  test('shows Sperrung label for CLOSURE events', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent({ type: 'CLOSURE' })],
      riskScore: 0,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText(/Sperrung/)).toBeInTheDocument();
    });
  });

  test('shows Warnung label for WARNING events', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent({ type: 'WARNING' })],
      riskScore: 0,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText(/Warnung/)).toBeInTheDocument();
    });
  });

  test('shows raw type label for unknown event types', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent({ type: 'UNKNOWN_TYPE' })],
      riskScore: 0,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText('UNKNOWN_TYPE')).toBeInTheDocument();
    });
  });

  // ── singular/plural ───────────────────────────────────────

  test('shows singular Ereignis for one event', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent()],
      riskScore: 0,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText('1 Ereignis')).toBeInTheDocument();
    });
  });

  test('shows plural Ereignisse for multiple events', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([{
      roadId: 'A3',
      events: [buildEvent({ id: 'ev-1' }), buildEvent({ id: 'ev-2' })],
      riskScore: 0,
    }]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByText('2 Ereignisse')).toBeInTheDocument();
    });
  });

  // ── interactions ──────────────────────────────────────────

  test('calls onRoadSelect when a road card is clicked', async () => {
    const onRoadSelect = vi.fn();
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([
      { roadId: 'A3', events: [], riskScore: 0 },
    ]);
    render(<Dashboard {...DEFAULT_PROPS} onRoadSelect={onRoadSelect} />);
    await waitFor(() => {
      expect(screen.getByTestId(ROAD_A3)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId(ROAD_A3));
    expect(onRoadSelect).toHaveBeenCalledWith('A3');
  });

  test('calls onRoadSelect when Enter is pressed on a road card', async () => {
    const onRoadSelect = vi.fn();
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([
      { roadId: 'A3', events: [], riskScore: 0 },
    ]);
    render(<Dashboard {...DEFAULT_PROPS} onRoadSelect={onRoadSelect} />);
    await waitFor(() => {
      expect(screen.getByTestId(ROAD_A3)).toBeInTheDocument();
    });
    fireEvent.keyDown(screen.getByTestId(ROAD_A3), { key: 'Enter' });
    expect(onRoadSelect).toHaveBeenCalledWith('A3');
  });

  // ── delete favourite ──────────────────────────────────────

  test('shows confirm modal when delete button is clicked', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([
      { roadId: 'A3', events: [], riskScore: 0 },
    ]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByTestId(DELETE_A3)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId(DELETE_A3));
    expect(screen.getByTestId('confirm-ok')).toBeInTheDocument();
  });

  test('deletes road and hides it after confirm', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([
      { roadId: 'A3', events: [], riskScore: 0 },
    ]);
    vi.mocked(deleteFavourite).mockResolvedValue(undefined);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByTestId(DELETE_A3)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId(DELETE_A3));
    fireEvent.click(screen.getByTestId('confirm-ok'));
    await waitFor(() => {
      expect(screen.queryByTestId(ROAD_A3)).not.toBeInTheDocument();
    });
  });

  test('cancelling delete modal keeps the road visible', async () => {
    vi.mocked(fetchDashboardTraffic).mockResolvedValue([
      { roadId: 'A3', events: [], riskScore: 0 },
    ]);
    render(<Dashboard {...DEFAULT_PROPS} />);
    await waitFor(() => {
      expect(screen.getByTestId(DELETE_A3)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId(DELETE_A3));
    fireEvent.click(screen.getByTestId('confirm-cancel'));
    expect(screen.getByTestId(ROAD_A3)).toBeInTheDocument();
  });
});
