import { renderHook, act } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { useApp } from './useApp';
import { useAuth } from './useAuth';
import { useTraffic } from './useTraffic';
import { saveFavourite } from '../services/trafficService';

vi.mock('./useAuth');
vi.mock('./useTraffic');
vi.mock('../services/trafficService', () => ({ saveFavourite: vi.fn() }));
vi.mock('../utils/buildSavedMessage', () => ({ buildSavedMessage: vi.fn(() => 'Favouriten gespeichert!') }));

function makeMockAuth(overrides = {}) {
  return {
    token: null as string | null,
    username: '',
    authError: null as string | null,
    setAuthError: vi.fn(),
    handleLogin: vi.fn(),
    handleRegister: vi.fn(),
    handleLogout: vi.fn(),
    ...overrides,
  };
}

function makeMockTraffic(overrides = {}) {
  return {
    events: [],
    selectedRoads: [] as string[],
    isLive: true,
    cachedAt: null,
    handleRoadSelect: vi.fn(),
    ...overrides,
  };
}

describe('useApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue(makeMockAuth());
    vi.mocked(useTraffic).mockReturnValue(makeMockTraffic());
  });

  // ── initial state ─────────────────────────────────────────

  test('initial state has showLogin false and authMode login', () => {
    const { result } = renderHook(() => useApp());
    expect(result.current.showLogin).toBe(false);
    expect(result.current.authMode).toBe('login');
  });

  // ── handleTabSwitch ───────────────────────────────────────

  test('handleTabSwitch updates authMode and clears error', () => {
    const mockAuth = makeMockAuth();
    vi.mocked(useAuth).mockReturnValue(mockAuth);
    const { result } = renderHook(() => useApp());
    act(() => result.current.handleTabSwitch('register'));
    expect(result.current.authMode).toBe('register');
    expect(mockAuth.setAuthError).toHaveBeenCalledWith(null);
  });

  // ── handleCloseModal ──────────────────────────────────────

  test('handleCloseModal resets showLogin and authMode', () => {
    const { result } = renderHook(() => useApp());
    act(() => result.current.setShowLogin(true));
    act(() => result.current.handleCloseModal());
    expect(result.current.showLogin).toBe(false);
    expect(result.current.authMode).toBe('login');
  });

  // ── handleLoginSubmit ─────────────────────────────────────

  test('handleLoginSubmit closes modal on success', async () => {
    const mockAuth = makeMockAuth();
    mockAuth.handleLogin.mockResolvedValue(true);
    vi.mocked(useAuth).mockReturnValue(mockAuth);
    const { result } = renderHook(() => useApp());
    act(() => result.current.setShowLogin(true));
    await act(async () => result.current.handleLoginSubmit());
    expect(result.current.showLogin).toBe(false);
  });

  test('handleLoginSubmit keeps modal open on failure', async () => {
    const mockAuth = makeMockAuth();
    mockAuth.handleLogin.mockResolvedValue(false);
    vi.mocked(useAuth).mockReturnValue(mockAuth);
    const { result } = renderHook(() => useApp());
    act(() => result.current.setShowLogin(true));
    await act(async () => result.current.handleLoginSubmit());
    expect(result.current.showLogin).toBe(true);
  });

  // ── handleRegisterSubmit ──────────────────────────────────

  test('handleRegisterSubmit closes modal on success', async () => {
    const mockAuth = makeMockAuth();
    mockAuth.handleRegister.mockResolvedValue(true);
    vi.mocked(useAuth).mockReturnValue(mockAuth);
    const { result } = renderHook(() => useApp());
    act(() => result.current.setShowLogin(true));
    await act(async () => result.current.handleRegisterSubmit());
    expect(result.current.showLogin).toBe(false);
  });

  // ── handleLogoutConfirmed ─────────────────────────────────

  test('handleLogoutConfirmed calls logout and hides confirm dialog', async () => {
    const mockAuth = makeMockAuth();
    mockAuth.handleLogout.mockResolvedValue(undefined);
    vi.mocked(useAuth).mockReturnValue(mockAuth);
    const { result } = renderHook(() => useApp());
    act(() => result.current.setShowLogoutConfirm(true));
    await act(async () => result.current.handleLogoutConfirmed());
    expect(mockAuth.handleLogout).toHaveBeenCalled();
    expect(result.current.showLogoutConfirm).toBe(false);
  });

  // ── handleSaveFavourite ───────────────────────────────────

  test('handleSaveFavourite does nothing when no token', async () => {
    const { result } = renderHook(() => useApp());
    await act(async () => result.current.handleSaveFavourite());
    expect(saveFavourite).not.toHaveBeenCalled();
  });

  test('handleSaveFavourite sets savedMessage on success', async () => {
    vi.mocked(useAuth).mockReturnValue(makeMockAuth({ token: 'test-token' }));
    vi.mocked(useTraffic).mockReturnValue(makeMockTraffic({ selectedRoads: ['A3'] }));
    vi.mocked(saveFavourite).mockResolvedValue(undefined);
    const { result } = renderHook(() => useApp());
    await act(async () => result.current.handleSaveFavourite());
    expect(result.current.savedMessage).toBe('Favouriten gespeichert!');
  });
});