import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppMain } from './AppMain';

vi.mock('./PageHero', () => ({ PageHero: () => <div data-testid="mock-hero" /> }));
vi.mock('../selector/SelectorCard', () => ({ SelectorCard: () => <div data-testid="mock-selector" /> }));
vi.mock('../traffic/TrafficView', () => ({ TrafficView: () => <div data-testid="mock-traffic" /> }));
vi.mock('../dashboard/Dashboard', () => ({ Dashboard: () => <div data-testid="mock-dashboard" /> }));

const BASE_PROPS = {
  token: null,
  selectedRoads: [],
  savedMessage: null,
  refreshKey: 0,
  isLive: true,
  cachedAt: null,
  events: [],
  onRoadSelect: vi.fn(),
  onSaveFavourite: vi.fn(),
};

describe('AppMain', () => {
  test('renders hero, selector, and traffic view', () => {
    render(<AppMain {...BASE_PROPS} />);
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
    expect(screen.getByTestId('mock-selector')).toBeInTheDocument();
    expect(screen.getByTestId('mock-traffic')).toBeInTheDocument();
  });

  test('does not render dashboard when token is null', () => {
    render(<AppMain {...BASE_PROPS} token={null} />);
    expect(screen.queryByTestId('mock-dashboard')).not.toBeInTheDocument();
  });

  test('renders dashboard when token is provided', () => {
    render(<AppMain {...BASE_PROPS} token="test-token" />);
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument();
  });

  test('shows login callout when not authenticated', () => {
    render(<AppMain {...BASE_PROPS} token={null} />);
    expect(screen.getByTestId('login-callout')).toBeInTheDocument();
  });

  test('hides login callout when authenticated', () => {
    render(<AppMain {...BASE_PROPS} token="test-token" />);
    expect(screen.queryByTestId('login-callout')).not.toBeInTheDocument();
  });
});
