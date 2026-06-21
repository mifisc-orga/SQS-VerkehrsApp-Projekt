import { ConfirmModal } from '../modals/ConfirmModal';
import { AuthModal } from '../modals/AuthModal';

/** Props for the logout confirmation and authentication modals. */
export interface AppModalsProps {
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
export function AppModals({
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
