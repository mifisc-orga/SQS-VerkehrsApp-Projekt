import { useState } from 'react';
import { AutobahnSelector } from './components/AutobahnSelector';
import { IncidentMap } from './components/IncidentMap';
import { RiskBadge } from './components/RiskBadge';
import { Dashboard } from './components/Dashboard';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { AppHeader } from './components/AppHeader';
import { saveFavourite } from './services/trafficService';
import { useAuth } from './hooks/useAuth';
import { useTraffic } from './hooks/useTraffic';
import { buildSavedMessage } from './utils/buildSavedMessage';
import { formatCachedAt } from './utils/formatCachedAt';

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
    if (ok) { handleCloseModal(); }
  }

  /** Submits the register form; closes the modal on success. */
  async function handleRegisterSubmit(): Promise<void> {
    const ok = await auth.handleRegister(usernameInput, passwordInput);
    if (ok) { handleCloseModal(); }
  }

  /** Confirms logout, clears auth state, and hides the confirm dialog. */
  async function handleLogoutConfirmed(): Promise<void> {
    await auth.handleLogout();
    setShowLogoutConfirm(false);
  }

  /** Saves the currently selected motorways as favourites for the logged-in user. */
  async function handleSaveFavourite(): Promise<void> {
    if (!auth.token || traffic.selectedRoads.length === 0) { return; }
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

        <div className="card">
          <div className="section-title">Autobahn auswählen</div>
          <AutobahnSelector selected={traffic.selectedRoads} onSelect={traffic.handleRoadSelect} max={5} />
          {auth.token && traffic.selectedRoads.length > 0 && (
            <button
              className="btn btn-success"
              data-testid="save-favourite-button"
              onClick={handleSaveFavourite}
              style={{ marginTop: '12px' }}
            >
              <i className="ti ti-star" aria-hidden="true"></i>
              {traffic.selectedRoads.length === 1 ? traffic.selectedRoads[0] : `${traffic.selectedRoads.length} Autobahnen`} speichern
            </button>
          )}
          {savedMessage && (
            <div
              className={savedMessage.includes('bereits') ? 'banner-warning' : 'banner-success'}
              data-testid="favourite-saved-message"
              style={{ marginTop: '10px' }}
            >
              <i className={`ti ${savedMessage.includes('bereits') ? 'ti-info-circle' : 'ti-check'}`} aria-hidden="true"></i> {savedMessage}
            </div>
          )}
        </div>

        {auth.token && <Dashboard token={auth.token} refreshKey={refreshKey} onRoadSelect={roadId => traffic.handleRoadSelect([roadId])} />}

        <div className="map-events-layout">
          <div>
            <div className="data-status" style={{ marginBottom: '6px' }}>
              {traffic.isLive ? (
                <span data-testid="live-indicator" className="status-live">
                  <span className="live-dot" aria-hidden="true"></span>
                  Live-Daten
                </span>
              ) : (
                <span data-testid="cached-indicator" className="status-cached">
                  Gecacht · {formatCachedAt(traffic.cachedAt)}
                </span>
              )}
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="map-container">
                <IncidentMap events={traffic.events} />
              </div>
            </div>
          </div>

          {traffic.events.length > 0 && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div className="section-title">
                Aktuelle Ereignisse
                <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 400, color: 'var(--color-text-muted)' }}>
                  {traffic.events.length} Ereignisse
                </span>
              </div>
              <ul className="events-list events-list--scroll">
                {traffic.events.map(event => (
                  <li key={event.id} className="event-item" data-testid={`event-item-${event.id}`}>
                    <span className="event-item__road">{event.roadId}</span>
                    <span className="event-item__title">{event.title}</span>
                    <RiskBadge riskLevel={event.riskLevel} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
