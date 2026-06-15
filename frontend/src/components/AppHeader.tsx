/** Props for the application header */
interface AppHeaderProps {
  /** JWT token, or null if not authenticated */
  token: string | null;
  /** Display name of the authenticated user */
  username: string;
  /** Called when the user clicks the Login button */
  onLoginClick: () => void;
  /** Called when the user clicks the Logout button */
  onLogoutClick: () => void;
}

/**
 * Top navigation header with the app logo and authentication controls.
 * Shows a user chip and Logout button when logged in, Login button otherwise.
 */
export function AppHeader({ token, username, onLoginClick, onLogoutClick }: AppHeaderProps) {
  return (
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
              onClick={onLogoutClick}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="btn"
            style={{ color: 'white', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.4)' }}
            data-testid="login-button"
            onClick={onLoginClick}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
