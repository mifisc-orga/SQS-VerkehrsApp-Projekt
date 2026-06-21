import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { IncidentMap } from './IncidentMap';

vi.mock('leaflet/dist/leaflet.css', () => ({}));
vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({ default: '' }));
vi.mock('leaflet/dist/images/marker-icon.png', () => ({ default: '' }));
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({ default: '' }));

vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
  },
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="map-marker">{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const EVENT_A3 = {
  id: 'ev-1',
  roadId: 'A3',
  title: 'Stau A3',
  subtitle: '5 km',
  description: '',
  type: 'JAM',
  latitude: 48.1,
  longitude: 11.5,
  riskLevel: 'HIGH' as const,
};

const EVENT_A9 = {
  id: 'ev-2',
  roadId: 'A9',
  title: 'Baustelle A9',
  subtitle: '2 km',
  description: '',
  type: 'ROADWORK',
  latitude: 48.2,
  longitude: 11.6,
  riskLevel: 'LOW' as const,
};

describe('IncidentMap', () => {

  // ── Rendering ─────────────────────────────────────────────

  test('renders the incident map container', () => {
    render(<IncidentMap events={[]} />);
    expect(screen.getByTestId('incident-map')).toBeInTheDocument();
  });

  test('renders no markers when events list is empty', () => {
    render(<IncidentMap events={[]} />);
    expect(screen.queryByTestId('map-marker')).not.toBeInTheDocument();
  });

  test('renders a marker for each event', () => {
    render(<IncidentMap events={[EVENT_A3, EVENT_A9]} />);
    expect(screen.getAllByTestId('map-marker')).toHaveLength(2);
  });

  test('shows event title in popup', () => {
    render(<IncidentMap events={[EVENT_A3]} />);
    expect(screen.getByText('Stau A3')).toBeInTheDocument();
  });

  test('shows risk level in popup', () => {
    render(<IncidentMap events={[EVENT_A3]} />);
    expect(screen.getByText(/HIGH/)).toBeInTheDocument();
  });
});