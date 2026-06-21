import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SelectorDropdown } from './SelectorDropdown';

const ROADS = ['A1', 'A3', 'A9'];

describe('SelectorDropdown', () => {

  // ── Rendering ─────────────────────────────────────────────

  test('renders a road option for each road', () => {
    render(<SelectorDropdown roads={ROADS} selected={[]} max={5} onToggle={vi.fn()} />);
    expect(screen.getByTestId('road-option-A1')).toBeInTheDocument();
    expect(screen.getByTestId('road-option-A3')).toBeInTheDocument();
    expect(screen.getByTestId('road-option-A9')).toBeInTheDocument();
  });

  test('renders nothing when roads list is empty', () => {
    render(<SelectorDropdown roads={[]} selected={[]} max={5} onToggle={vi.fn()} />);
    expect(screen.queryByTestId('road-option-A1')).not.toBeInTheDocument();
  });

  // ── Maximum warning ───────────────────────────────────────────

  test('shows max warning when selection limit is reached', () => {
    render(<SelectorDropdown roads={ROADS} selected={['A1', 'A3']} max={2} onToggle={vi.fn()} />);
    expect(screen.getByText(/Maximum 2 Autobahnen erreicht/)).toBeInTheDocument();
  });

  test('does not show max warning when under the limit', () => {
    render(<SelectorDropdown roads={ROADS} selected={['A1']} max={5} onToggle={vi.fn()} />);
    expect(screen.queryByText(/Maximum/)).not.toBeInTheDocument();
  });

  // ── Interaction ───────────────────────────────────────────

  test('calls onToggle when a road option is clicked', () => {
    const onToggle = vi.fn();
    render(<SelectorDropdown roads={ROADS} selected={[]} max={5} onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId('road-option-A3'));
    expect(onToggle).toHaveBeenCalledWith('A3');
  });
});