import { useState } from 'react';
import { login, logout, register } from '../services/trafficService';

/** Return type of the useAuth hook */
export interface UseAuthResult {
  /** JWT token, or null if not authenticated */
  token: string | null;
  /** Display name of the authenticated user */
  username: string;
  /** Current authentication error message, or null */
  authError: string | null;
  /** Manually override the auth error (e.g. to clear it on tab switch) */
  setAuthError: (error: string | null) => void;
  /** Attempt login; returns true on success, sets authError on failure */
  handleLogin: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  /** Attempt registration; returns true on success, sets authError on failure */
  handleRegister: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  /** Log out the current user and clear auth state */
  handleLogout: () => Promise<void>;
}

/** State setter functions required by auth action helpers. */
interface AuthSetters {
  /** Sets the JWT token (null on logout) */
  readonly setToken: (t: string | null) => void;
  /** Sets the authenticated user's display name */
  readonly setUsername: (u: string) => void;
  /** Sets the current auth error message (null to clear) */
  readonly setAuthError: (e: string | null) => void;
}

async function performAuth(
  action: () => Promise<{ token: string }>,
  usernameInput: string,
  errorMessage: string,
  setters: AuthSetters,
): Promise<boolean> {
  try {
    const result = await action();
    setters.setToken(result.token);
    setters.setUsername(usernameInput);
    setters.setAuthError(null);
    return true;
  } catch {
    setters.setAuthError(errorMessage);
    return false;
  }
}

async function performLogin(
  usernameInput: string,
  passwordInput: string,
  setters: AuthSetters,
): Promise<boolean> {
  return performAuth(
    () => login(usernameInput, passwordInput),
    usernameInput,
    'Anmeldung fehlgeschlagen. Bitte Benutzername und Passwort prüfen.',
    setters,
  );
}

async function performRegister(
  usernameInput: string,
  passwordInput: string,
  setters: AuthSetters,
): Promise<boolean> {
  return performAuth(
    () => register(usernameInput, passwordInput),
    usernameInput,
    'Registrierung fehlgeschlagen. Benutzername möglicherweise bereits vergeben.',
    setters,
  );
}

async function performLogout(
  token: string | null,
  setToken: (t: string | null) => void,
  setUsername: (u: string) => void,
): Promise<void> {
  if (token) {
    await logout(token);
  }
  setToken(null);
  setUsername('');
}

/**
 * Manages authentication state (token, username, authError) and provides
 * login, register, and logout handlers.
 */
export function useAuth(): UseAuthResult {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const setters: AuthSetters = { setToken, setUsername, setAuthError };
  return {
    token,
    username,
    authError,
    setAuthError,
    handleLogin: (u, p) => performLogin(u, p, setters),
    handleRegister: (u, p) => performRegister(u, p, setters),
    handleLogout: () => performLogout(token, setToken, setUsername),
  };
}
