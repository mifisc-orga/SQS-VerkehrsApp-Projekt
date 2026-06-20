import type { TrafficEvent } from './types';
import { Dashboard } from './components/Dashboard';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { AppHeader } from './components/AppHeader';
import { TrafficView } from './components/TrafficView';
import { SelectorCard } from './components/SelectorCard';
import { useApp } from './hooks/useApp';

/** Props for the logout confirmation and authentication modals. */
interface AppModalsProps {
  /** Whether the logout confirmation modal is visible */
  readonly showLogoutConfirm: boolean;
  /** Whether the authentication modal is visible */
  readonly showLogin: boolean;
  /** Current tab in the auth modal */
  readonly authMode: 'login' | 'register';
  /** Current authentication error message, or null */
  readonly authError: string | null;
  /** Current value of the username input field */
  readonly usernameInput: string;
  /** Current value of the password input field */
  readonly passwordInput: string;
  /** Whether the password is shown in plain text */
  readonly showPassword: boolean;
  /** Called when the user confirms logout */
  readonly onLogoutConfirm: () => void;
  /** Called when the user cancels logout */
  readonly onLogoutCancel: () => void;
  /** Called when the auth modal is closed */
  readonly onClose: () => void;
  /** Called when the auth tab is switched */
  readonly onTabSwitch: (mode: 'login' | 'register') => void;
  /** Called when the username input changes */
  readonly onUsernameChange: (value: string) => void;
  /** Called when the password input changes */
  readonly onPasswordChange: (value: string) => void;
  /** Called to toggle password visibility */
  readonly onTogglePassword: () => void;
  /** Called to submit the login form */
  readonly onLogin: () => Promise<void>;
  /** Called to submit the registration form */
  readonly onRegister: () => Promise<void>;
}

/** Renders both the logout confirmation and the authentication modal. */
function AppModals({
  showLogoutConfirm, showLogin, authMode, authError,
  usernameInput, passwordInput, showPassword,
  onLogoutConfirm, onLogoutCancel, onClose, onTabSwitch,
  onUsernameChange, onPasswordChange, onTogglePassword, onLogin, onRegister,
}: AppModalsProps) {
  return (
    <>
      {showLogoutConfirm && (
        <ConfirmModal
          message="Möchtest du dich wirklich abmelden?"
          confirmLabel="Abmelden"
          onConfirm={onLogoutConfirm}
          onCancel={onLogoutCancel}
        />
      )}
      {showLogin && (
        <AuthModal
          authMode={authMode} authError={authError}
          usernameInput={usernameInput} passwordInput={passwordInput} showPassword={showPassword}
          onClose={onClose} onTabSwitch={onTabSwitch}
          onUsernameChange={onUsernameChange} onPasswordChange={onPasswordChange}
          onTogglePassword={onTogglePassword} onLogin={onLogin} onRegister={onRegister}
        />
      )}
    </>
  );
}

/** Title and description banner shown at the top of the main content area. */
function PageHero() {
  return (
    <div className="page-hero">
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg,#0f766e,#1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.3rem' }}>
        Echtzeit-Verkehrsübersicht
      </h2>
      <p>Aktuelle Ereignisse, Risikobewertung und gespeicherte Autobahnen auf einen Blick.</p>
    </div>
  );
}

/** Props for the main content section of the app. */
interface AppMainProps {
  /** JWT token of the authenticated user, or null */
  readonly token: string | null;
  /** Currently selected motorway identifiers */
  readonly selectedRoads: string[];
  /** Feedback message after saving a favourite, or null */
  readonly savedMessage: string | null;
  /** Increments to trigger a dashboard refresh */
  readonly refreshKey: number;
  /** Whether the traffic data is live */
  readonly isLive: boolean;
  /** Cache timestamp of the traffic data, or null if live */
  readonly cachedAt: string | null;
  /** List of current traffic events */
  readonly events: TrafficEvent[];
  /** Called when the road selection changes */
  readonly onRoadSelect: (roads: string[]) => void;
  /** Called to save the current selection as favourites */
  readonly onSaveFavourite: () => void;
}

/** Main content: road selector, dashboard, and traffic events. */
function AppMain({ token, selectedRoads, savedMessage, refreshKey, isLive, cachedAt, events, onRoadSelect, onSaveFavourite }: AppMainProps) {
  return (
    <main className="app-main">
      <PageHero />
      <SelectorCard token={token} selectedRoads={selectedRoads} savedMessage={savedMessage} onSelect={onRoadSelect} onSave={onSaveFavourite} />
      {token && <Dashboard token={token} refreshKey={refreshKey} onRoadSelect={roadId => onRoadSelect([roadId])} />}
      <TrafficView isLive={isLive} cachedAt={cachedAt} events={events} />
    </main>
  );
}

/**
 * Root component of the application.
 * Manages UI state and composes auth, traffic, and layout sub-components.
 */
function App() {
  const app = useApp();
  return (
    <>
      <AppHeader token={app.auth.token} username={app.auth.username} onLoginClick={() => app.setShowLogin(true)} onLogoutClick={() => app.setShowLogoutConfirm(true)} />
      <AppModals
        showLogoutConfirm={app.showLogoutConfirm} showLogin={app.showLogin}
        authMode={app.authMode} authError={app.auth.authError}
        usernameInput={app.usernameInput} passwordInput={app.passwordInput} showPassword={app.showPassword}
        onLogoutConfirm={app.handleLogoutConfirmed} onLogoutCancel={() => app.setShowLogoutConfirm(false)}
        onClose={app.handleCloseModal} onTabSwitch={app.handleTabSwitch}
        onUsernameChange={app.setUsernameInput} onPasswordChange={app.setPasswordInput}
        onTogglePassword={() => app.setShowPassword(prev => !prev)}
        onLogin={app.handleLoginSubmit} onRegister={app.handleRegisterSubmit}
      />
      <AppMain
        token={app.auth.token} selectedRoads={app.traffic.selectedRoads}
        savedMessage={app.savedMessage} refreshKey={app.refreshKey}
        isLive={app.traffic.isLive} cachedAt={app.traffic.cachedAt} events={app.traffic.events}
        onRoadSelect={app.traffic.handleRoadSelect} onSaveFavourite={app.handleSaveFavourite}
      />
    </>
  );
}

export default App;
