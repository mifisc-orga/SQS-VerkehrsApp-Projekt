import { useEffect, useState } from 'react';
import { AutobahnSelector } from './components/AutobahnSelector';
import { IncidentMap, type TrafficEvent } from './components/IncidentMap';
import { RiskBadge } from './components/RiskBadge';
import { Dashboard } from './components/Dashboard';
import { ConfirmModal } from './components/ConfirmModal';
import { fetchTrafficEvents, login, logout, register, saveFavourite } from './services/trafficService';

/**
 * Root component of the application.
 * Manages global state (auth, traffic data, road selection)
 * and renders the header, auth modal, and main content.
 */
function App() {
  const [allEvents, setAllEvents] = useState<TrafficEvent[]>([]);
  const [events, setEvents] = useState<TrafficEvent[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [selectedRoads, setSelectedRoads] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchTrafficEvents()
      .then((result) => {
        setAllEvents(result.events);
        setIsLive(result.live);
        setCachedAt(result.cachedAt);
        const available = [...new Set(result.events.map((e) => e.roadId))].sort();
        const defaults = available.slice(0, 3);
        setSelectedRoads(defaults);
        setEvents(result.events.filter((e) => defaults.includes(e.roadId)));
      })
      .catch(() => {
        // Traffic data failed to load — app remains functional
      });
  }, []);

  /** Filters displayed events by the selected motorways. */
  function handleRoadSelect(roadIds: string[]): void {
    setSelectedRoads(roadIds);
    if (roadIds.length === 0) {
      setEvents(allEvents);
    } else {
      setEvents(allEvents.filter((e) => roadIds.includes(e.roadId)));
    }
  }

  /** Switches the auth tab and clears any error state. */
  function handleTabSwitch(mode: 'login' | 'register'): void {
    setAuthMode(mode);
    setAuthError(null);
  }

  /** Closes the auth modal and resets all input fields. */
  function handleCloseModal(): void {
    setShowLogin(false);
    setAuthMode('login');
    setAuthError(null);
    setUsernameInput('');
    setPasswordInput('');
    setShowPassword(false);
  }

  /** Logs the user in. On failure, shows an error message inside the modal. */
  async function handleLogin(): Promise<void> {
    try {
      const result = await login(usernameInput, passwordInput);
      setToken(result.token);
      setUsername(usernameInput);
      handleCloseModal();
    } catch {
      setAuthError('Anmeldung fehlgeschlagen. Bitte Benutzername und Passwort prüfen.');
    }
  }

  /** Registers a new user. On failure, shows an error message inside the modal. */
  async function handleRegister(): Promise<void> {
    try {
      const result = await register(usernameInput, passwordInput);
      setToken(result.token);
      setUsername(usernameInput);
      handleCloseModal();
    } catch {
      setAuthError('Registrierung fehlgeschlagen. Benutzername möglicherweise bereits vergeben.');
    }
  }

  /** Logs the user out and resets auth state. */
  async function handleLogout(): Promise<void> {
    if (token) {
      await logout(token);
    }
    setToken(null);
    setUsername('');
    setShowLogoutConfirm(false);
  }

  /** Saves the currently selected motorways as favourites. */
  async function handleSaveFavourite(): Promise<void> {
    if (!token || selectedRoads.length === 0) return;

    const results = await Promise.allSettled(
      selectedRoads.map((road) => saveFavourite(token, road)),
    );

    const saved = results.filter((r) => r.status === 'fulfilled').length;
    const alreadyExisted = results.length - saved;

    if (saved > 0 && alreadyExisted === 0) {
      setSavedMessage('Favouriten gespeichert!');
    } else if (saved > 0 && alreadyExisted > 0) {
      setSavedMessage(`${saved} gespeichert, ${alreadyExisted} bereits vorhanden.`);
    } else {
      setSavedMessage('Alle Autobahnen sind bereits in deinen Favouriten.');
    }

    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setSavedMessage(null), 4000);
  }

  /** Formats an ISO timestamp as local time (HH:MM). */
  function formatCachedAt(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__logo">
          <i className="ti ti-road" style={{ fontSize: '1.3rem' }} aria-hidden="true"></i>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'white' }}>
            Autobahn Safety Monitor
          </h1>
        </div>
        <div className="app-header__auth">
          {token ? (
            <>
              <span className="user-chip" data-testid="user-info">
                <i className="ti ti-user" aria-hidden="true"></i> {username}
              </span>
              <button
                className="btn"
                style={{ color: 'white', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.4)', marginLeft: '8px' }}
                data-testid="logout-button"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn"
              style={{ color: 'white', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.4)' }}
              data-testid="login-button"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* ── Logout Confirmation ── */}
      {showLogoutConfirm && (
        <ConfirmModal
          message="Möchtest du dich wirklich abmelden?"
          confirmLabel="Abmelden"
          onConfirm={() => { void handleLogout(); }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {/* ── Auth Modal ── */}
      {showLogin && (
        <div
          data-testid="login-modal-overlay"
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            data-testid="login-modal"
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              data-testid="login-modal-close"
              className="modal-close"
              onClick={handleCloseModal}
              aria-label="Schließen"
            >
              ×
            </button>

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                className={`auth-tab${authMode === 'login' ? ' auth-tab--active' : ''}`}
                data-testid="tab-login"
                onClick={() => handleTabSwitch('login')}
              >
                Anmelden
              </button>
              <button
                className={`auth-tab${authMode === 'register' ? ' auth-tab--active' : ''}`}
                data-testid="tab-register"
                onClick={() => handleTabSwitch('register')}
              >
                Registrieren
              </button>
            </div>

            {/* Error banner */}
            {authError && (
              <div className="banner-error" data-testid="auth-error">
                {authError}
              </div>
            )}

            <div className="login-panel">
              <div className="form-field" style={{ width: '100%' }}>
                <label>Benutzername</label>
                <input
                  data-testid="username-input"
                  type="text"
                  placeholder="Benutzername"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      void (authMode === 'login' ? handleLogin() : handleRegister());
                    }
                  }}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-field" style={{ width: '100%' }}>
                <label>Passwort</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    data-testid="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Passwort"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        void (authMode === 'login' ? handleLogin() : handleRegister());
                      }
                    }}
                    style={{ width: '100%', paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    data-testid="toggle-password"
                    aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: 'absolute',
                      right: '0.6rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      padding: '0.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      lineHeight: 0,
                    }}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {authMode === 'login' ? (
                <button
                  className="btn btn-primary"
                  data-testid="submit-login"
                  onClick={() => { void handleLogin(); }}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Einloggen
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  data-testid="submit-register"
                  onClick={() => { void handleRegister(); }}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Registrieren
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="app-main">
        {/* ── Hero ── */}
        <div className="page-hero">
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg,#0f766e,#1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.3rem' }}>
            Echtzeit-Verkehrsübersicht
          </h2>
          <p>Aktuelle Ereignisse, Risikobewertung und gespeicherte Autobahnen auf einen Blick.</p>
        </div>

        {/* ── Autobahn selector ── */}
        <div className="card">
          <div className="section-title">Autobahn auswählen</div>
          <AutobahnSelector selected={selectedRoads} onSelect={handleRoadSelect} max={5} />
          {token && selectedRoads.length > 0 && (
            <button
              className="btn btn-success"
              data-testid="save-favourite-button"
              onClick={() => { void handleSaveFavourite(); }}
              style={{ marginTop: '12px' }}
            >
              <i className="ti ti-star" aria-hidden="true"></i>
              {selectedRoads.length === 1 ? selectedRoads[0] : `${selectedRoads.length} Autobahnen`} speichern
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

        {/* ── Dashboard ── */}
        {token && <Dashboard token={token} refreshKey={refreshKey} onRoadSelect={(roadId) => handleRoadSelect([roadId])} />}

        {/* ── Map + Events ── */}
        <div className="map-events-layout">
          {/* Map */}
          <div>
            <div className="data-status" style={{ marginBottom: '6px' }}>
              {isLive ? (
                <span data-testid="live-indicator" className="status-live">
                  <span className="live-dot" aria-hidden="true"></span>
                  Live-Daten
                </span>
              ) : (
                <span data-testid="cached-indicator" className="status-cached">
                  Gecacht · {formatCachedAt(cachedAt)}
                </span>
              )}
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="map-container">
                <IncidentMap events={events} />
              </div>
            </div>
          </div>

          {/* Events list */}
          {events.length > 0 && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div className="section-title">
                Aktuelle Ereignisse
                <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 400, color: 'var(--color-text-muted)' }}>
                  {events.length} Ereignisse
                </span>
              </div>
              <ul className="events-list events-list--scroll">
                {events.map((event) => (
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
