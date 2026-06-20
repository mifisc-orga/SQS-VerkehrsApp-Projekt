import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useAuth } from './useAuth';
import { login, register, logout } from '../services/trafficService';

vi.mock('../services/trafficService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}));


async function setupLoggedInTheOut() {
  vi.mocked(login).mockResolvedValue({ token: 'test-token' });
  vi.mocked(logout).mockResolvedValue(undefined);
  const { result } = renderHook(() => useAuth());

  await act(async () => {
    await result.current.handleLogin('testuser', 'password');
  });
  await act(async () => {
    await result.current.handleLogout();
  });

  return result;
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── handleLogin ───────────────────────────────────────────

  test('handleLogin returns true and sets token on success', async () => {
    vi.mocked(login).mockResolvedValue({ token: 'test-token' });
    const { result } = renderHook(() => useAuth());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.handleLogin('testuser', 'password');
    });

    expect(success).toBe(true);
    expect(result.current.token).toBe('test-token');
    expect(result.current.username).toBe('testuser');
    expect(result.current.authError).toBeNull();
  });

  test('handleLogin returns false and sets authError on failure', async () => {
    vi.mocked(login).mockRejectedValue(new Error('Login failed'));
    const { result } = renderHook(() => useAuth());

    let success: boolean = true;
    await act(async () => {
      success = await result.current.handleLogin('user', 'wrong');
    });

    expect(success).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.authError).toBeTruthy();
  });

  // ── handleRegister ────────────────────────────────────────

  test('handleRegister returns true and sets token on success', async () => {
    vi.mocked(register).mockResolvedValue({ token: 'reg-token' });
    const { result } = renderHook(() => useAuth());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.handleRegister('newuser', 'password');
    });

    expect(success).toBe(true);
    expect(result.current.token).toBe('reg-token');
    expect(result.current.username).toBe('newuser');
  });

  test('handleRegister returns false and sets authError on failure', async () => {
    vi.mocked(register).mockRejectedValue(new Error('Username taken'));
    const { result } = renderHook(() => useAuth());

    let success: boolean = true;
    await act(async () => {
      success = await result.current.handleRegister('taken', 'password');
    });

    expect(success).toBe(false);
    expect(result.current.authError).toBeTruthy();
  });

  // ── handleLogout ──────────────────────────────────────────

  test('handleLogout clears token and username', async () => {
    const result = await setupLoggedInTheOut();

    expect(result.current.token).toBeNull();
    expect(result.current.username).toBe('');
  });

  test('handleLogout calls logout service with token', async () => {
    const result = await setupLoggedInTheOut();
    expect(logout).toHaveBeenCalledWith('test-token');
  });
});
