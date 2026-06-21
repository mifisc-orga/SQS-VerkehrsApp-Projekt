import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DashboardRoadCard } from './DashboardRoadCard';

const DEFAULT_PROPS = {
  roadId: 'A3',
  events: [],
  maxRiskLevel: 'LOW' as const,
  uniqueTypes: [],
  onRoadSelect: vi.fn(),
  onDeleteRequest: vi.fn(),
};

const CARD = 'dashboard-road-A3';
const DELETE_BTN = 'delete-favourite-A3';

describe('DashboardRoadCard', () => {

  // ── Rendering ─────────────────────────────────────────────

  test('renders roadId in the card', () => {
    render(<DashboardRoadCard {...DEFAULT_PROPS} />);
    expect(screen.getByTestId(CARD)).toHaveTextContent('A3');
  });

  test('shows singular Ereignis for one event', () => {
    render(<DashboardRoadCard {...DEFAULT_PROPS} events={[{ id: '1', roadId: 'A3', title: '', subtitle: '', description: '', type: 'JAM', latitude: 0, longitude: 0, riskLevel: 'LOW' }]} />);
    expect(screen.getByText('1 Ereignis')).toBeInTheDocument();
  });

  test('shows plural Ereignisse for multiple events', () => {
    const events = [
      { id: '1', roadId: 'A3', title: '', subtitle: '', description: '', type: 'JAM', latitude: 0, longitude: 0, riskLevel: 'LOW' },
      { id: '2', roadId: 'A3', title: '', subtitle: '', description: '', type: 'JAM', latitude: 0, longitude: 0, riskLevel: 'LOW' },
    ];
    render(<DashboardRoadCard {...DEFAULT_PROPS} events={events} />);
    expect(screen.getByText('2 Ereignisse')).toBeInTheDocument();
  });

  test('shows empty message when no events', () => {
    render(<DashboardRoadCard {...DEFAULT_PROPS} events={[]} />);
    expect(screen.getByText('Keine aktuellen Ereignisse.')).toBeInTheDocument();
  });

  test('shows Baustelle label for ROADWORK type', () => {
    render(<DashboardRoadCard {...DEFAULT_PROPS} uniqueTypes={['ROADWORK']} />);
    expect(screen.getByText(/Baustelle/)).toBeInTheDocument();
  });

  test('shows Sperrung label for CLOSURE type', () => {
    render(<DashboardRoadCard {...DEFAULT_PROPS} uniqueTypes={['CLOSURE']} />);
    expect(screen.getByText(/Sperrung/)).toBeInTheDocument();
  });

  // ── Interaction ───────────────────────────────────────────

  test('calls onRoadSelect with roadId on click', () => {
    const onRoadSelect = vi.fn();
    render(<DashboardRoadCard {...DEFAULT_PROPS} onRoadSelect={onRoadSelect} />);
    fireEvent.click(screen.getByTestId(CARD));
    expect(onRoadSelect).toHaveBeenCalledWith('A3');
  });

  test('calls onRoadSelect on Enter key', () => {
    const onRoadSelect = vi.fn();
    render(<DashboardRoadCard {...DEFAULT_PROPS} onRoadSelect={onRoadSelect} />);
    fireEvent.keyDown(screen.getByTestId(CARD), { key: 'Enter' });
    expect(onRoadSelect).toHaveBeenCalledWith('A3');
  });

  test('calls onDeleteRequest when delete button is clicked', () => {
    const onDeleteRequest = vi.fn();
    render(<DashboardRoadCard {...DEFAULT_PROPS} onDeleteRequest={onDeleteRequest} />);
    fireEvent.click(screen.getByTestId(DELETE_BTN));
    expect(onDeleteRequest).toHaveBeenCalledWith('A3');
  });

  test('does not call onRoadSelect when delete button is clicked', () => {
    const onRoadSelect = vi.fn();
    render(<DashboardRoadCard {...DEFAULT_PROPS} onRoadSelect={onRoadSelect} />);
    fireEvent.click(screen.getByTestId(DELETE_BTN));
    expect(onRoadSelect).not.toHaveBeenCalled();
  });
});