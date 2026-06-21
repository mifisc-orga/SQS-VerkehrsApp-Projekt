import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SelectorCard } from './SelectorCard';

vi.mock('./AutobahnSelector', () => ({
  AutobahnSelector: () => <div data-testid="autobahn-selector" />,
}));

const SAVE_BTN = 'save-favourite-button';
const SAVED_MSG = 'favourite-saved-message';

describe('SelectorCard', () => {

  // ── Save button visibility ────────────────────────────────

  test('shows save button when logged in and roads selected', () => {
    render(<SelectorCard token="tok" selectedRoads={['A3']} savedMessage={null} onSelect={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByTestId(SAVE_BTN)).toBeInTheDocument();
  });

  test('hides save button when no token', () => {
    render(<SelectorCard token={null} selectedRoads={['A3']} savedMessage={null} onSelect={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByTestId(SAVE_BTN)).not.toBeInTheDocument();
  });

  test('hides save button when no roads selected', () => {
    render(<SelectorCard token="tok" selectedRoads={[]} savedMessage={null} onSelect={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByTestId(SAVE_BTN)).not.toBeInTheDocument();
  });

  // ── Save button label ─────────────────────────────────────

  test('shows road name when one road selected', () => {
    render(<SelectorCard token="tok" selectedRoads={['A3']} savedMessage={null} onSelect={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByTestId(SAVE_BTN)).toHaveTextContent('A3 speichern');
  });

  test('shows count when multiple roads selected', () => {
    render(<SelectorCard token="tok" selectedRoads={['A3', 'A9']} savedMessage={null} onSelect={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByTestId(SAVE_BTN)).toHaveTextContent('2 Autobahnen speichern');
  });

  // ── Save button interaction ───────────────────────────────

  test('calls onSave when save button is clicked', () => {
    const onSave = vi.fn();
    render(<SelectorCard token="tok" selectedRoads={['A3']} savedMessage={null} onSelect={vi.fn()} onSave={onSave} />);
    fireEvent.click(screen.getByTestId(SAVE_BTN));
    expect(onSave).toHaveBeenCalled();
  });

  // ── Saved message ─────────────────────────────────────────

  test('shows savedMessage when present', () => {
    render(<SelectorCard token="tok" selectedRoads={['A3']} savedMessage="Favouriten gespeichert!" onSelect={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByTestId(SAVED_MSG)).toHaveTextContent('Favouriten gespeichert!');
  });

  test('does not show savedMessage when null', () => {
    render(<SelectorCard token="tok" selectedRoads={['A3']} savedMessage={null} onSelect={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByTestId(SAVED_MSG)).not.toBeInTheDocument();
  });

  test('shows warning style when message contains bereits', () => {
    render(<SelectorCard token="tok" selectedRoads={['A3']} savedMessage="bereits vorhanden" onSelect={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByTestId(SAVED_MSG)).toHaveClass('banner-warning');
  });

});