import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { RoadOption } from './RoadOption';

describe('RoadOption', () => {

  // ── Rendering ─────────────────────────────────────────────

  test('renders road name', () => {
    render(<RoadOption road="A3" isSelected={false} isDisabled={false} onToggle={vi.fn()} />);
    expect(screen.getByTestId('road-option-A3')).toHaveTextContent('A3');
  });

  test('has aria-selected false when not selected', () => {
    render(<RoadOption road="A3" isSelected={false} isDisabled={false} onToggle={vi.fn()} />);
    expect(screen.getByTestId('road-option-A3')).toHaveAttribute('aria-selected', 'false');
  });

  test('has aria-selected true when selected', () => {
    render(<RoadOption road="A3" isSelected={true} isDisabled={false} onToggle={vi.fn()} />);
    expect(screen.getByTestId('road-option-A3')).toHaveAttribute('aria-selected', 'true');
  });

  test('has tabIndex -1 when disabled', () => {
    render(<RoadOption road="A3" isSelected={false} isDisabled={true} onToggle={vi.fn()} />);
    expect(screen.getByTestId('road-option-A3')).toHaveAttribute('tabindex', '-1');
  });

  // ── Interaction ───────────────────────────────────────────

  test('calls onToggle with road name on click', () => {
    const onToggle = vi.fn();
    render(<RoadOption road="A3" isSelected={false} isDisabled={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId('road-option-A3'));
    expect(onToggle).toHaveBeenCalledWith('A3');
  });

  test('does not call onToggle when disabled', () => {
    const onToggle = vi.fn();
    render(<RoadOption road="A3" isSelected={false} isDisabled={true} onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId('road-option-A3'));
    expect(onToggle).not.toHaveBeenCalled();
  });

  test('calls onToggle on Enter key', () => {
    const onToggle = vi.fn();
    render(<RoadOption road="A3" isSelected={false} isDisabled={false} onToggle={onToggle} />);
    fireEvent.keyDown(screen.getByTestId('road-option-A3'), { key: 'Enter' });
    expect(onToggle).toHaveBeenCalledWith('A3');
  });

  test('calls onToggle on Space key', () => {
    const onToggle = vi.fn();
    render(<RoadOption road="A3" isSelected={false} isDisabled={false} onToggle={onToggle} />);
    fireEvent.keyDown(screen.getByTestId('road-option-A3'), { key: ' ' });
    expect(onToggle).toHaveBeenCalledWith('A3');
  });

  test('does not call onToggle on Enter when disabled', () => {
    const onToggle = vi.fn();
    render(<RoadOption road="A3" isSelected={false} isDisabled={true} onToggle={onToggle} />);
    fireEvent.keyDown(screen.getByTestId('road-option-A3'), { key: 'Enter' });
    expect(onToggle).not.toHaveBeenCalled();
  });
});