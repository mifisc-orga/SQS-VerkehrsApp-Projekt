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

  async function handleAuth(
    action: () => Promise<{ token: string }>,
    usernameInput: string,
    errorMessage: string,
  ): Promise<boolean> {
    try {
      const result = await action();
      setToken(result.token);
      setUsername(usernameInput);
      setAuthError(null);
      return true;
    } catch {
      setAuthError(errorMessage);
      return false;
    }
  }

  async function handleLogin(usernameInput: string, passwordInput: string): Promise<boolean> {
    return handleAuth(
      () => login(usernameInput, passwordInput),
      usernameInput,
      'Anmeldung fehlgeschlagen. Bitte Benutzername und Passwort prüfen.',
    );
  }

  async function handleRegister(usernameInput: string, passwordInput: string): Promise<boolean> {
    return handleAuth(
      () => register(usernameInput, passwordInput),
      usernameInput,
      'Registrierung fehlgeschlagen. Benutzername möglicherweise bereits vergeben.',
    );
  }

  async function handleLogout(): Promise<void> {
    if (token)
      await logout(token);
    setToken(null);
    setUsername('');
  }

  return { token, username, authError, setAuthError, handleLogin, handleRegister, handleLogout };
}