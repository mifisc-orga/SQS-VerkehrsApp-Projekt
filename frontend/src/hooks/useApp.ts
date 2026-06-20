import { useState } from 'react';
import { useAuth } from './useAuth';
import { useTraffic } from './useTraffic';
import { saveFavourite } from '../services/trafficService';
import { buildSavedMessage } from '../utils/buildSavedMessage';

/** All state and event handlers for the App root component. */
export function useApp() {
  const auth = useAuth();
  const traffic = useTraffic();

  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /** Switches the auth tab and clears any error. */
  function handleTabSwitch(mode: 'login' | 'register'): void {
    setAuthMode(mode);
    auth.setAuthError(null);
  }

  /** Closes the auth modal and resets all input fields. */
  function handleCloseModal(): void {
    setShowLogin(false);
    setAuthMode('login');
    auth.setAuthError(null);
    setUsernameInput('');
    setPasswordInput('');
    setShowPassword(false);
  }

  /** Submits the login form; closes the modal on success. */
  async function handleLoginSubmit(): Promise<void> {
    const ok = await auth.handleLogin(usernameInput, passwordInput);
    if (ok)
      handleCloseModal();
  }

  /** Submits the register form; closes the modal on success. */
  async function handleRegisterSubmit(): Promise<void> {
    const ok = await auth.handleRegister(usernameInput, passwordInput);
    if (ok)
      handleCloseModal();
  }

  /** Confirms logout, clears auth state, and hides the confirm dialog. */
  async function handleLogoutConfirmed(): Promise<void> {
    await auth.handleLogout();
    setShowLogoutConfirm(false);
  }

  /** Saves the currently selected motorways as favourites for the logged-in user. */
  async function handleSaveFavourite(): Promise<void> {
    if (!auth.token || traffic.selectedRoads.length === 0)
      return;
    const results = await Promise.allSettled(
      traffic.selectedRoads.map(road => saveFavourite(auth.token as string, road)),
    );
    setSavedMessage(buildSavedMessage(results));
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setSavedMessage(null), 4000);
  }

  return {
    auth,
    traffic,
    showLogin,
    setShowLogin,
    authMode,
    usernameInput,
    setUsernameInput,
    passwordInput,
    setPasswordInput,
    showPassword,
    setShowPassword,
    showLogoutConfirm,
    setShowLogoutConfirm,
    savedMessage,
    refreshKey,
    handleTabSwitch,
    handleCloseModal,
    handleLoginSubmit,
    handleRegisterSubmit,
    handleLogoutConfirmed,
    handleSaveFavourite,
  };
}