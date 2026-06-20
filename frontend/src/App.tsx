import { Dashboard } from './components/Dashboard';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { AppHeader } from './components/AppHeader';
import { TrafficView } from './components/TrafficView';
import { SelectorCard } from './components/SelectorCard';
import { useApp } from './hooks/useApp';

/**
 * Root component of the application.
 * Manages UI state and composes auth, traffic, and layout sub-components.
 */
function App() {
  const {
    auth, traffic,
    showLogin, setShowLogin,
    authMode,
    usernameInput, setUsernameInput,
    passwordInput, setPasswordInput,
    showPassword, setShowPassword,
    showLogoutConfirm, setShowLogoutConfirm,
    savedMessage, refreshKey,
    handleTabSwitch, handleCloseModal,
    handleLoginSubmit, handleRegisterSubmit,
    handleLogoutConfirmed, handleSaveFavourite,
  } = useApp();

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