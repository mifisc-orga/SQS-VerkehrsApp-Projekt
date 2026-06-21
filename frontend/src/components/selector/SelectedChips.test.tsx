import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SelectedChips } from './SelectedChips';

describe('SelectedChips', () => {

  // ── Empty state ───────────────────────────────────────────

  test('renders nothing when selected is empty', () => {
    const { container } = render(<SelectedChips selected={[]} onRemove={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  // ── Rendering ─────────────────────────────────────────────

  test('renders a chip for each selected road', () => {
    render(<SelectedChips selected={['A3', 'A9']} onRemove={vi.fn()} />);
    expect(screen.getByTestId('selected-chip-A3')).toBeInTheDocument();
    expect(screen.getByTestId('selected-chip-A9')).toBeInTheDocument();
  });

  test('displays road name inside chip', () => {
    render(<SelectedChips selected={['A3']} onRemove={vi.fn()} />);
    expect(screen.getByTestId('selected-chip-A3')).toHaveTextContent('A3');
  });

  // ── Remove ────────────────────────────────────────────────

  test('calls onRemove with correct road when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<SelectedChips selected={['A3', 'A9']} onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('chip-remove-A3'));
    expect(onRemove).toHaveBeenCalledWith('A3');
  });

  test('does not call onRemove for other chips when one is removed', () => {
    const onRemove = vi.fn();
    render(<SelectedChips selected={['A3', 'A9']} onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('chip-remove-A3'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});