import { describe, expect, test, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthModal } from './AuthModal';

/** Default props for AuthModal — override only what the test needs */
function renderAuthModal(overrides: Partial<Parameters<typeof AuthModal>[0]> = {}) {
  const props = {
    authMode: 'login' as const,
    authError: null,
    usernameInput: '',
    passwordInput: '',
    showPassword: false,
    onClose: vi.fn(),
    onTabSwitch: vi.fn(),
    onUsernameChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onTogglePassword: vi.fn(),
    onLogin: vi.fn().mockResolvedValue(undefined),
    onRegister: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  return render(<AuthModal {...props} />);
}

// ── Password field type ───────────────────────────────────────

describe('password field visibility', () => {
  test('input type is password when showPassword is false', () => {
    renderAuthModal({ showPassword: false });
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');
  });

  test('input type is text when showPassword is true', () => {
    renderAuthModal({ showPassword: true });
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'text');
  });

  test('calls onTogglePassword when toggle button is clicked', () => {
    const onTogglePassword = vi.fn();
    renderAuthModal({ onTogglePassword });
    fireEvent.click(screen.getByTestId('toggle-password'));
    expect(onTogglePassword).toHaveBeenCalledTimes(1);
  });
});

// ── Submit button labels ──────────────────────────────────────

describe('submit button labels', () => {
  test('shows Einloggen button on login tab', () => {
    renderAuthModal({ authMode: 'login' });
    expect(screen.getByTestId('submit-login')).toHaveTextContent('Einloggen');
  });

  test('shows Registrieren button on register tab', () => {
    renderAuthModal({ authMode: 'register' });
    expect(screen.getByTestId('submit-register')).toHaveTextContent('Registrieren');
  });

  test('does not show register button on login tab', () => {
    renderAuthModal({ authMode: 'login' });
    expect(screen.queryByTestId('submit-register')).not.toBeInTheDocument();
  });

  test('does not show login button on register tab', () => {
    renderAuthModal({ authMode: 'register' });
    expect(screen.queryByTestId('submit-login')).not.toBeInTheDocument();
  });
});

// ── Error display ─────────────────────────────────────────────

describe('error message', () => {
  test('shows error message when authError is set', () => {
    renderAuthModal({ authError: 'Anmeldung fehlgeschlagen.' });
    expect(screen.getByTestId('auth-error')).toHaveTextContent('Anmeldung fehlgeschlagen.');
  });

  test('does not show error element when authError is null', () => {
    renderAuthModal({ authError: null });
    expect(screen.queryByTestId('auth-error')).not.toBeInTheDocument();
  });
});
