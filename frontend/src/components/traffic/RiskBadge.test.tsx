import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskBadge } from './RiskBadge';

describe('RiskBadge', () => {
  test('renders "Niedrig" for LOW risk level', () => {
    render(<RiskBadge riskLevel="LOW" />);
    expect(screen.getByTestId('risk-badge-LOW')).toHaveTextContent('Niedrig');
  });

  test('renders "Mittel" for MEDIUM risk level', () => {
    render(<RiskBadge riskLevel="MEDIUM" />);
    expect(screen.getByTestId('risk-badge-MEDIUM')).toHaveTextContent('Mittel');
  });

  test('renders "Hoch" for HIGH risk level', () => {
    render(<RiskBadge riskLevel="HIGH" />);
    expect(screen.getByTestId('risk-badge-HIGH')).toHaveTextContent('Hoch');
  });

  test('applies correct CSS class for LOW', () => {
    render(<RiskBadge riskLevel="LOW" />);
    expect(screen.getByTestId('risk-badge-LOW')).toHaveClass('risk-low');
  });

  test('applies correct CSS class for MEDIUM', () => {
    render(<RiskBadge riskLevel="MEDIUM" />);
    expect(screen.getByTestId('risk-badge-MEDIUM')).toHaveClass('risk-medium');
  });

  test('applies correct CSS class for HIGH', () => {
    render(<RiskBadge riskLevel="HIGH" />);
    expect(screen.getByTestId('risk-badge-HIGH')).toHaveClass('risk-high');
  });
});
