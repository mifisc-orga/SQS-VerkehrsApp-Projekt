/** Props for the authentication modal */
interface AuthModalProps {
  /** Which tab is currently active */
  authMode: 'login' | 'register';
  /** Error message to display, or null if no error */
  authError: string | null;
  /** Current value of the username input */
  usernameInput: string;
  /** Current value of the password input */
  passwordInput: string;
  /** Whether the password is shown as plain text */
  showPassword: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Called when the user switches between login and register tabs */
  onTabSwitch: (mode: 'login' | 'register') => void;
  /** Called when the username input value changes */
  onUsernameChange: (value: string) => void;
  /** Called when the password input value changes */
  onPasswordChange: (value: string) => void;
  /** Called when the password visibility toggle is clicked */
  onTogglePassword: () => void;
  /** Called when the login form is submitted */
  onLogin: () => Promise<void>;
  /** Called when the registration form is submitted */
  onRegister: () => Promise<void>;
}

/**
 * Modal dialog for user authentication (login and registration).
 * Contains two tabs: Anmelden (login) and Registrieren (register).
 */
export function AuthModal({
  authMode,
  authError,
  usernameInput,
  passwordInput,
  showPassword,
  onClose,
  onTabSwitch,
  onUsernameChange,
  onPasswordChange,
  onTogglePassword,
  onLogin,
  onRegister,
}: AuthModalProps) {
  return (
    <div
      data-testid="login-modal-overlay"
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        data-testid="login-modal"
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          data-testid="login-modal-close"
          className="modal-close"
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab${authMode === 'login' ? ' auth-tab--active' : ''}`}
            data-testid="tab-login"
            onClick={() => onTabSwitch('login')}
          >
            Anmelden
          </button>
          <button
            className={`auth-tab${authMode === 'register' ? ' auth-tab--active' : ''}`}
            data-testid="tab-register"
            onClick={() => onTabSwitch('register')}
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
              onChange={(e) => onUsernameChange(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  await (authMode === 'login' ? onLogin() : onRegister());
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
                onChange={(e) => onPasswordChange(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    await (authMode === 'login' ? onLogin() : onRegister());
                  }
                }}
                style={{ width: '100%', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                data-testid="toggle-password"
                aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                onClick={onTogglePassword}
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
              onClick={onLogin}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Einloggen
            </button>
          ) : (
            <button
              className="btn btn-primary"
              data-testid="submit-register"
              onClick={onRegister}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Registrieren
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
