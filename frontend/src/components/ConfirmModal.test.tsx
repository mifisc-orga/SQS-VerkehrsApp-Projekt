import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

function renderConfirmModal(overrides: Partial<Parameters<typeof ConfirmModal>[0]> = {}) {
  const props = {
    message: 'Möchtest du dich wirklich abmelden?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };
  return { ...render(<ConfirmModal {...props} />), props };
}

describe('ConfirmModal', () => {
  test('displays the message', () => {
    renderConfirmModal({ message: 'Wirklich löschen?' });
    expect(screen.getByText('Wirklich löschen?')).toBeInTheDocument();
  });

  test('shows default confirm label "Entfernen"', () => {
    renderConfirmModal();
    expect(screen.getByTestId('confirm-ok')).toHaveTextContent('Entfernen');
  });

  test('shows custom confirm label when provided', () => {
    renderConfirmModal({ confirmLabel: 'Abmelden' });
    expect(screen.getByTestId('confirm-ok')).toHaveTextContent('Abmelden');
  });

  test('calls onConfirm when confirm button is clicked', () => {
    const { props } = renderConfirmModal();
    fireEvent.click(screen.getByTestId('confirm-ok'));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', () => {
    const { props } = renderConfirmModal();
    fireEvent.click(screen.getByTestId('confirm-cancel'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when overlay is clicked', () => {
    const { props } = renderConfirmModal();
    fireEvent.click(screen.getByTestId('confirm-modal-overlay'));
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when Escape key is pressed', () => {
    const { props } = renderConfirmModal();
    fireEvent.keyDown(screen.getByTestId('confirm-modal-overlay'), { key: 'Escape' });
    expect(props.onCancel).toHaveBeenCalledTimes(1);
  });
});
