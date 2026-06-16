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

/**
 * Manages authentication state (token, username, authError) and provides
 * login, register, and logout handlers.
 */
export function useAuth(): UseAuthResult {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  async function handleLogin(usernameInput: string, passwordInput: string): Promise<boolean> {
    try {
      const result = await login(usernameInput, passwordInput);
      setToken(result.token);
      setUsername(usernameInput);
      setAuthError(null);
      return true;
    } catch {
      setAuthError('Anmeldung fehlgeschlagen. Bitte Benutzername und Passwort prüfen.');
      return false;
    }
  }

  async function handleRegister(usernameInput: string, passwordInput: string): Promise<boolean> {
    try {
      const result = await register(usernameInput, passwordInput);
      setToken(result.token);
      setUsername(usernameInput);
      setAuthError(null);
      return true;
    } catch {
      setAuthError('Registrierung fehlgeschlagen. Benutzername möglicherweise bereits vergeben.');
      return false;
    }
  }

  async function handleLogout(): Promise<void> {
    if (token) { await logout(token); }
    setToken(null);
    setUsername('');
  }

  return { token, username, authError, setAuthError, handleLogin, handleRegister, handleLogout };
}
