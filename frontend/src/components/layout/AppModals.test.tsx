import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppModals } from './AppModals';

vi.mock('../modals/ConfirmModal', () => ({ ConfirmModal: () => <div data-testid="mock-confirm" /> }));
vi.mock('../modals/AuthModal', () => ({ AuthModal: () => <div data-testid="mock-auth" /> }));

const BASE_PROPS = {
  showLogoutConfirm: false,
  showLogin: false,
  authMode: 'login' as const,
  authError: null,
  usernameInput: '',
  passwordInput: '',
  showPassword: false,
  onLogoutConfirm: vi.fn(),
  onLogoutCancel: vi.fn(),
  onClose: vi.fn(),
  onTabSwitch: vi.fn(),
  onUsernameChange: vi.fn(),
  onPasswordChange: vi.fn(),
  onTogglePassword: vi.fn(),
  onLogin: vi.fn(),
  onRegister: vi.fn(),
};

describe('AppModals', () => {
  test('renders nothing when both flags are false', () => {
    const { container } = render(<AppModals {...BASE_PROPS} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders ConfirmModal when showLogoutConfirm is true', () => {
    render(<AppModals {...BASE_PROPS} showLogoutConfirm={true} />);
    expect(screen.getByTestId('mock-confirm')).toBeInTheDocument();
  });

  test('renders AuthModal when showLogin is true', () => {
    render(<AppModals {...BASE_PROPS} showLogin={true} />);
    expect(screen.getByTestId('mock-auth')).toBeInTheDocument();
  });

  test('does not render AuthModal when showLogin is false', () => {
    render(<AppModals {...BASE_PROPS} showLogin={false} />);
    expect(screen.queryByTestId('mock-auth')).not.toBeInTheDocument();
  });
});
