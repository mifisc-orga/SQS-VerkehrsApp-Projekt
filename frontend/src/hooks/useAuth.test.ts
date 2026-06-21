import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useAuth, UseAuthResult } from './useAuth';
import { login, register, logout } from '../services/trafficService';

vi.mock('../services/trafficService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}));

async function runAuthHook(
  action: (result: { current: UseAuthResult }) => Promise<boolean>
): Promise<{ success: boolean; result: { current: UseAuthResult } }> {
  const { result } = renderHook(() => useAuth());
  let success = false;
  await act(async () => {
    success = await action(result);
  });
  return { success, result };
}

async function setupLoggedInThenOut() {
  vi.mocked(login).mockResolvedValue({ token: 'test-token' });
  vi.mocked(logout).mockResolvedValue(undefined);
  const { result } = renderHook(() => useAuth());

  await act(async () => { await result.current.handleLogin('testuser', 'password'); });
  await act(async () => { await result.current.handleLogout(); });

  return result;
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── handleLogin ───────────────────────────────────────────

  test('handleLogin returns true and sets token on success', async () => {
    vi.mocked(login).mockResolvedValue({ token: 'test-token' });
    const { success, result } = await runAuthHook(r => r.current.handleLogin('testuser', 'password'));
    expect(success).toBe(true);
    expect(result.current.token).toBe('test-token');
    expect(result.current.username).toBe('testuser');
    expect(result.current.authError).toBeNull();
  });

  test('handleLogin returns false and sets authError on failure', async () => {
    vi.mocked(login).mockRejectedValue(new Error('Login failed'));
    const { success, result } = await runAuthHook(r => r.current.handleLogin('user', 'wrong'));
    expect(success).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.authError).toBeTruthy();
  });

  // ── handleRegister ────────────────────────────────────────

  test('handleRegister returns true and sets token on success', async () => {
    vi.mocked(register).mockResolvedValue({ token: 'reg-token' });
    const { success, result } = await runAuthHook(r => r.current.handleRegister('newuser', 'password'));
    expect(success).toBe(true);
    expect(result.current.token).toBe('reg-token');
    expect(result.current.username).toBe('newuser');
  });

  test('handleRegister returns false and sets authError on failure', async () => {
    vi.mocked(register).mockRejectedValue(new Error('Username taken'));
    const { success, result } = await runAuthHook(r => r.current.handleRegister('taken', 'password'));
    expect(success).toBe(false);
    expect(result.current.authError).toBeTruthy();
  });

  // ── handleLogout ──────────────────────────────────────────

  test('handleLogout clears token and username', async () => {
    const result = await setupLoggedInThenOut();
    expect(result.current.token).toBeNull();
    expect(result.current.username).toBe('');
  });

  test('handleLogout calls logout service with token', async () => {
    await setupLoggedInThenOut();
    expect(logout).toHaveBeenCalledWith('test-token');
  });
});
