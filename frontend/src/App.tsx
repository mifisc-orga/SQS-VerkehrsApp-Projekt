import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { AppHeader } from './components/AppHeader';
import { saveFavourite } from './services/trafficService';
import { useAuth } from './hooks/useAuth';
import { useTraffic } from './hooks/useTraffic';
import { buildSavedMessage } from './utils/buildSavedMessage';
import { TrafficView } from './components/TrafficView';
import { SelectorCard } from './components/SelectorCard';

/**
 * Root component of the application.
 * Manages UI state and composes auth, traffic, and layout sub-components.
 */
function App() {
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
    if (ok) handleCloseModal();
  }

  /** Submits the register form; closes the modal on success. */
  async function handleRegisterSubmit(): Promise<void> {
    const ok = await auth.handleRegister(usernameInput, passwordInput);
    if (ok) handleCloseModal();
  }

  /** Confirms logout, clears auth state, and hides the confirm dialog. */
  async function handleLogoutConfirmed(): Promise<void> {
    await auth.handleLogout();
    setShowLogoutConfirm(false);
  }

  /** Saves the currently selected motorways as favourites for the logged-in user. */
  async function handleSaveFavourite(): Promise<void> {
    if (!auth.token || traffic.selectedRoads.length === 0) return;
    const results = await Promise.allSettled(
      traffic.selectedRoads.map(road => saveFavourite(auth.token as string, road)),
    );
    setSavedMessage(buildSavedMessage(results));
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setSavedMessage(null), 4000);
  }

  return (
    <>
      <AppHeader
        token={auth.token}
        username={auth.username}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />

      {showLogoutConfirm && (
        <ConfirmModal
          message="Möchtest du dich wirklich abmelden?"
          confirmLabel="Abmelden"
          onConfirm={handleLogoutConfirmed}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {showLogin && (
        <AuthModal
          authMode={authMode}
          authError={auth.authError}
          usernameInput={usernameInput}
          passwordInput={passwordInput}
          showPassword={showPassword}
          onClose={handleCloseModal}
          onTabSwitch={handleTabSwitch}
          onUsernameChange={setUsernameInput}
          onPasswordChange={setPasswordInput}
          onTogglePassword={() => setShowPassword(prev => !prev)}
          onLogin={handleLoginSubmit}
          onRegister={handleRegisterSubmit}
        />
      )}

      <main className="app-main">
        <div className="page-hero">
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg,#0f766e,#1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.3rem' }}>
            Echtzeit-Verkehrsübersicht
          </h2>
          <p>Aktuelle Ereignisse, Risikobewertung und gespeicherte Autobahnen auf einen Blick.</p>
        </div>

        <SelectorCard
          token={auth.token}
          selectedRoads={traffic.selectedRoads}
          savedMessage={savedMessage}
          onSelect={traffic.handleRoadSelect}
          onSave={handleSaveFavourite}
        />

        {auth.token && <Dashboard token={auth.token} refreshKey={refreshKey} onRoadSelect={roadId => traffic.handleRoadSelect([roadId])} />}

        <TrafficView isLive={traffic.isLive} cachedAt={traffic.cachedAt} events={traffic.events} />
      </main>
    </>
  );
}

export default App;
