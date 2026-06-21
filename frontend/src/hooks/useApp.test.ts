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

const TEST_USERNAME = 'user';
const TEST_CREDENTIALS = 'pass12';

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

/** Renders useApp with the given mock auth and opens the login modal. */
function setupAndOpenModal(mockAuth: ReturnType<typeof makeMockAuth>) {
  vi.mocked(useAuth).mockReturnValue(mockAuth);
  const { result } = renderHook(() => useApp());
  act(() => result.current.setShowLogin(true));
  return result;
}

/** Opens modal and fills in valid credentials. */
function setupWithCredentials(mockAuth: ReturnType<typeof makeMockAuth>) {
  const result = setupAndOpenModal(mockAuth);
  act(() => result.current.setUsernameInput(TEST_USERNAME));
  act(() => result.current.setPasswordInput(TEST_CREDENTIALS));
  return result;
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
    const result = setupWithCredentials(mockAuth);
    await act(async () => result.current.handleLoginSubmit());
    expect(result.current.showLogin).toBe(false);
  });

  test('handleLoginSubmit keeps modal open on failure', async () => {
    const mockAuth = makeMockAuth();
    mockAuth.handleLogin.mockResolvedValue(false);
    const result = setupWithCredentials(mockAuth);
    await act(async () => result.current.handleLoginSubmit());
    expect(result.current.showLogin).toBe(true);
  });

  test('handleLoginSubmit sets error when fields are empty', async () => {
    const mockAuth = makeMockAuth();
    const result = setupAndOpenModal(mockAuth);
    await act(async () => result.current.handleLoginSubmit());
    expect(mockAuth.setAuthError).toHaveBeenCalledWith('Bitte Benutzername und Passwort eingeben.');
    expect(mockAuth.handleLogin).not.toHaveBeenCalled();
  });

  // ── handleRegisterSubmit ──────────────────────────────────

  test('handleRegisterSubmit closes modal on success', async () => {
    const mockAuth = makeMockAuth();
    mockAuth.handleRegister.mockResolvedValue(true);
    const result = setupWithCredentials(mockAuth);
    await act(async () => result.current.handleRegisterSubmit());
    expect(result.current.showLogin).toBe(false);
  });

  test('handleRegisterSubmit sets error when password is empty', async () => {
    const mockAuth = makeMockAuth();
    const result = setupAndOpenModal(mockAuth);
    act(() => result.current.setUsernameInput(TEST_USERNAME));
    await act(async () => result.current.handleRegisterSubmit());
    expect(mockAuth.setAuthError).toHaveBeenCalledWith('Bitte Benutzername und Passwort eingeben.');
    expect(mockAuth.handleRegister).not.toHaveBeenCalled();
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
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    vi.mocked(useAuth).mockReturnValue(makeMockAuth({ token: 'test-token' }));
    vi.mocked(useTraffic).mockReturnValue(makeMockTraffic({ selectedRoads: ['A3'] }));
    vi.mocked(saveFavourite).mockResolvedValue(undefined);
    const { result } = renderHook(() => useApp());
    await act(async () => result.current.handleSaveFavourite());
    act(() => vi.advanceTimersByTime(700));
    expect(result.current.savedMessage).toBe('Favouriten gespeichert!');
    vi.useRealTimers();
  });
});
