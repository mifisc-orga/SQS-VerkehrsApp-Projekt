import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { TrafficView } from './TrafficView';

vi.mock('./IncidentMap', () => ({
  IncidentMap: () => <div data-testid="incident-map" />,
}));

const EVENT = {
  id: 'ev-1',
  roadId: 'A3',
  title: 'Stau',
  subtitle: '',
  description: '',
  type: 'JAM',
  latitude: 48.1,
  longitude: 11.5,
  riskLevel: 'HIGH' as const,
};

describe('TrafficView', () => {

  // ── live / cached indicator ───────────────────────────────

  test('shows live indicator when data is live', () => {
    render(<TrafficView isLive={true} cachedAt={null} events={[]} />);
    expect(screen.getByTestId('live-indicator')).toBeInTheDocument();
    expect(screen.queryByTestId('cached-indicator')).not.toBeInTheDocument();
  });

  test('shows cached indicator when data is not live', () => {
    render(<TrafficView isLive={false} cachedAt="2024-01-15T10:00:00Z" events={[]} />);
    expect(screen.getByTestId('cached-indicator')).toBeInTheDocument();
    expect(screen.queryByTestId('live-indicator')).not.toBeInTheDocument();
  });

  // ── events list ───────────────────────────────────────────

  test('shows event items when events are present', () => {
    render(<TrafficView isLive={true} cachedAt={null} events={[EVENT]} />);
    expect(screen.getByTestId('event-item-ev-1')).toBeInTheDocument();
  });

  test('does not show events list when no events', () => {
    render(<TrafficView isLive={true} cachedAt={null} events={[]} />);
    expect(screen.queryByTestId('event-item-ev-1')).not.toBeInTheDocument();
  });

  test('shows event count in the events list header', () => {
    render(<TrafficView isLive={true} cachedAt={null} events={[EVENT]} />);
    expect(screen.getByText('1 Ereignisse')).toBeInTheDocument();
  });

  test('renders incident map', () => {
    render(<TrafficView isLive={true} cachedAt={null} events={[]} />);
    expect(screen.getByTestId('incident-map')).toBeInTheDocument();
  });
});