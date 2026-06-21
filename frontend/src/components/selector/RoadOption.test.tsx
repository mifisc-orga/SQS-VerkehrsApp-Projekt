import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { RoadOption } from './RoadOption';

const ROAD = 'A3';
const TESTID = `road-option-${ROAD}`;

describe('RoadOption', () => {

  // ── Rendering ─────────────────────────────────────────────

  test('renders road name', () => {
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={false} onToggle={vi.fn()} />);
    expect(screen.getByTestId(TESTID)).toHaveTextContent(ROAD);
  });

  test('has data-selected false when not selected', () => {
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={false} onToggle={vi.fn()} />);
    expect(screen.getByTestId(TESTID)).toHaveAttribute('data-selected', 'false');
  });

  test('has data-selected true when selected', () => {
    render(<RoadOption road={ROAD} isSelected={true} isDisabled={false} onToggle={vi.fn()} />);
    expect(screen.getByTestId(TESTID)).toHaveAttribute('data-selected', 'true');
  });

  test('has tabIndex -1 when disabled', () => {
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={true} onToggle={vi.fn()} />);
    expect(screen.getByTestId(TESTID)).toHaveAttribute('tabindex', '-1');
  });

  // ── Interaction ───────────────────────────────────────────

  test('calls onToggle with road name on click', () => {
    const onToggle = vi.fn();
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId(TESTID));
    expect(onToggle).toHaveBeenCalledWith(ROAD);
  });

  test('does not call onToggle when disabled', () => {
    const onToggle = vi.fn();
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={true} onToggle={onToggle} />);
    fireEvent.click(screen.getByTestId(TESTID));
    expect(onToggle).not.toHaveBeenCalled();
  });

  test('calls onToggle on Enter key', () => {
    const onToggle = vi.fn();
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={false} onToggle={onToggle} />);
    fireEvent.keyDown(screen.getByTestId(TESTID), { key: 'Enter' });
    expect(onToggle).toHaveBeenCalledWith(ROAD);
  });

  test('calls onToggle on Space key', () => {
    const onToggle = vi.fn();
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={false} onToggle={onToggle} />);
    fireEvent.keyDown(screen.getByTestId(TESTID), { key: ' ' });
    expect(onToggle).toHaveBeenCalledWith(ROAD);
  });

  test('does not call onToggle on Enter when disabled', () => {
    const onToggle = vi.fn();
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={true} onToggle={onToggle} />);
    fireEvent.keyDown(screen.getByTestId(TESTID), { key: 'Enter' });
    expect(onToggle).not.toHaveBeenCalled();
  });

  // ── Hover styling ─────────────────────────────────────────

  test('changes background on mouse enter when not selected', () => {
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={false} onToggle={vi.fn()} />);
    const btn = screen.getByTestId(TESTID);
    const initialBg = btn.style.background;
    fireEvent.mouseEnter(btn);
    expect(btn.style.background).not.toBe(initialBg);
  });

  test('changes background on mouse enter when selected', () => {
    render(<RoadOption road={ROAD} isSelected={true} isDisabled={false} onToggle={vi.fn()} />);
    const btn = screen.getByTestId(TESTID);
    const initialBg = btn.style.background;
    fireEvent.mouseEnter(btn);
    expect(btn.style.background).not.toBe(initialBg);
  });

  test('restores background on mouse leave when not selected', () => {
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={false} onToggle={vi.fn()} />);
    const btn = screen.getByTestId(TESTID);
    const initialBg = btn.style.background;
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(btn.style.background).toBe(initialBg);
  });

  test('restores background on mouse leave when selected', () => {
    render(<RoadOption road={ROAD} isSelected={true} isDisabled={false} onToggle={vi.fn()} />);
    const btn = screen.getByTestId(TESTID);
    const initialBg = btn.style.background;
    fireEvent.mouseEnter(btn);
    fireEvent.mouseLeave(btn);
    expect(btn.style.background).toBe(initialBg);
  });

  test('does not change background on hover when disabled', () => {
    render(<RoadOption road={ROAD} isSelected={false} isDisabled={true} onToggle={vi.fn()} />);
    const btn = screen.getByTestId(TESTID);
    const initialBg = btn.style.background;
    fireEvent.mouseEnter(btn);
    expect(btn.style.background).toBe(initialBg);
  });
});