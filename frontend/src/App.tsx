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
  readonly showLogoutConfirm: boolean;
  readonly showLogin: boolean;
  readonly authMode: 'login' | 'register';
  readonly authError: string | null;
  readonly usernameInput: string;
  readonly passwordInput: string;
  readonly showPassword: boolean;
  readonly onLogoutConfirm: () => void;
  readonly onLogoutCancel: () => void;
  readonly onClose: () => void;
  readonly onTabSwitch: (mode: 'login' | 'register') => void;
  readonly onUsernameChange: (value: string) => void;
  readonly onPasswordChange: (value: string) => void;
  readonly onTogglePassword: () => void;
  readonly onLogin: () => Promise<void>;
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
  readonly token: string | null;
  readonly selectedRoads: string[];
  readonly savedMessage: string;
  readonly refreshKey: number;
  readonly isLive: boolean;
  readonly cachedAt: string | null;
  readonly events: TrafficEvent[];
  readonly onRoadSelect: (roads: string[]) => void;
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
