import { AppHeader } from './components/layout/AppHeader';
import { AppModals } from './components/layout/AppModals';
import { AppMain } from './components/layout/AppMain';
import { useApp } from './hooks/useApp';

/**
 * Root component of the application.
 * Composes the header, modals, and main content using the useApp hook.
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
