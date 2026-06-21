import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { AppHeader } from './AppHeader';

const LOGIN_BUTTON = 'login-button';
const LOGOUT_BUTTON = 'logout-button';
const USER_INFO = 'user-info';

describe('AppHeader', () => {

  // ── Logged out ────────────────────────────────────────────

  test('shows login button when not logged in', () => {
    render(<AppHeader token={null} username="" onLoginClick={vi.fn()} onLogoutClick={vi.fn()} />);
    expect(screen.getByTestId(LOGIN_BUTTON)).toBeInTheDocument();
  });

  test('hides logout button and user info when not logged in', () => {
    render(<AppHeader token={null} username="" onLoginClick={vi.fn()} onLogoutClick={vi.fn()} />);
    expect(screen.queryByTestId(LOGOUT_BUTTON)).not.toBeInTheDocument();
    expect(screen.queryByTestId(USER_INFO)).not.toBeInTheDocument();
  });

  test('calls onLoginClick when login button is clicked', () => {
    const onLoginClick = vi.fn();
    render(<AppHeader token={null} username="" onLoginClick={onLoginClick} onLogoutClick={vi.fn()} />);
    fireEvent.click(screen.getByTestId(LOGIN_BUTTON));
    expect(onLoginClick).toHaveBeenCalled();
  });

  // ── Logged in ─────────────────────────────────────────────

  test('shows logout button and user info when logged in', () => {
    render(<AppHeader token="tok" username="alice" onLoginClick={vi.fn()} onLogoutClick={vi.fn()} />);
    expect(screen.getByTestId(LOGOUT_BUTTON)).toBeInTheDocument();
    expect(screen.getByTestId(USER_INFO)).toBeInTheDocument();
  });

  test('hides login button when logged in', () => {
    render(<AppHeader token="tok" username="alice" onLoginClick={vi.fn()} onLogoutClick={vi.fn()} />);
    expect(screen.queryByTestId(LOGIN_BUTTON)).not.toBeInTheDocument();
  });

  test('displays username in user info chip', () => {
    render(<AppHeader token="tok" username="alice" onLoginClick={vi.fn()} onLogoutClick={vi.fn()} />);
    expect(screen.getByTestId(USER_INFO)).toHaveTextContent('alice');
  });

  test('calls onLogoutClick when logout button is clicked', () => {
    const onLogoutClick = vi.fn();
    render(<AppHeader token="tok" username="alice" onLoginClick={vi.fn()} onLogoutClick={onLogoutClick} />);
    fireEvent.click(screen.getByTestId(LOGOUT_BUTTON));
    expect(onLogoutClick).toHaveBeenCalled();
  });
});