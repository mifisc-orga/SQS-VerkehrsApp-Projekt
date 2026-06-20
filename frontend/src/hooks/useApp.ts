import { useState } from 'react';
import { useAuth } from './useAuth';
import type { UseAuthResult } from './useAuth';
import { useTraffic } from './useTraffic';
import { saveFavourite } from '../services/trafficService';
import { buildSavedMessage } from '../utils/buildSavedMessage';

/** Manages the auth modal form inputs and visibility state. */
function useAuthFormState() {
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  return { showLogin, setShowLogin, authMode, setAuthMode, usernameInput, setUsernameInput, passwordInput, setPasswordInput, showPassword, setShowPassword };
}

type AuthFormState = ReturnType<typeof useAuthFormState>;

/** Provides handlers for the auth modal (tab switch, close, login, register). */
function useAuthHandlers(auth: UseAuthResult, form: AuthFormState) {
  function handleTabSwitch(mode: 'login' | 'register'): void {
    form.setAuthMode(mode);
    auth.setAuthError(null);
  }

  function handleCloseModal(): void {
    form.setShowLogin(false);
    form.setAuthMode('login');
    auth.setAuthError(null);
    form.setUsernameInput('');
    form.setPasswordInput('');
    form.setShowPassword(false);
  }

  async function handleLoginSubmit(): Promise<void> {
    const ok = await auth.handleLogin(form.usernameInput, form.passwordInput);
    if (ok) { handleCloseModal(); }
  }

  async function handleRegisterSubmit(): Promise<void> {
    const ok = await auth.handleRegister(form.usernameInput, form.passwordInput);
    if (ok) { handleCloseModal(); }
  }

  return { handleTabSwitch, handleCloseModal, handleLoginSubmit, handleRegisterSubmit };
}

/** All state and event handlers for the App root component. */
export function useApp() {
  const auth = useAuth();
  const traffic = useTraffic();
  const form = useAuthFormState();
  const handlers = useAuthHandlers(auth, form);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleLogoutConfirmed(): Promise<void> {
    await auth.handleLogout();
    setShowLogoutConfirm(false);
  }

  async function handleSaveFavourite(): Promise<void> {
    if (!auth.token || traffic.selectedRoads.length === 0) {
      return;
    }
    const results = await Promise.allSettled(
      traffic.selectedRoads.map(road => saveFavourite(auth.token as string, road)),
    );
    setSavedMessage(buildSavedMessage(results));
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setSavedMessage(null), 4000);
  }

  return { auth, traffic, ...form, ...handlers, showLogoutConfirm, setShowLogoutConfirm, savedMessage, refreshKey, handleLogoutConfirmed, handleSaveFavourite };
}
