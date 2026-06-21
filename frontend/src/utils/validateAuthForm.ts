const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;
const MIN_USERNAME_LEN = 3;
const MIN_PASSWORD_LEN = 6;

/**
 * Validates username and password for login and registration forms.
 * Returns an error message string, or null if both fields are valid.
 */
export function validateAuthForm(username: string, password: string): string | null {
  if (!username.trim() || !password.trim()) {
    return 'Bitte Benutzername und Passwort eingeben.';
  }
  if (username.length < MIN_USERNAME_LEN) {
    return `Benutzername muss mindestens ${MIN_USERNAME_LEN} Zeichen lang sein.`;
  }
  if (!USERNAME_RE.test(username)) {
    return 'Benutzername darf nur Buchstaben, Ziffern, _ und - enthalten.';
  }
  if (password.length < MIN_PASSWORD_LEN) {
    return `Passwort muss mindestens ${MIN_PASSWORD_LEN} Zeichen lang sein.`;
  }
  return null;
}
