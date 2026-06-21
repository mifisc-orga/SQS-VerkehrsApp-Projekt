import { describe, test, expect } from 'vitest';
import { validateAuthForm } from './validateAuthForm';

describe('validateAuthForm', () => {
  test('returns null for valid username and password', () => {
    expect(validateAuthForm('user1', 'pass12')).toBeNull();
  });

  test('returns error when username is empty', () => {
    expect(validateAuthForm('', 'pass12')).toBe('Bitte Benutzername und Passwort eingeben.');
  });

  test('returns error when password is empty', () => {
    expect(validateAuthForm('user1', '')).toBe('Bitte Benutzername und Passwort eingeben.');
  });

  test('returns error when username is too short', () => {
    expect(validateAuthForm('ab', 'pass12')).toBe('Benutzername muss mindestens 3 Zeichen lang sein.');
  });

  test('returns error when username contains non-latin characters', () => {
    expect(validateAuthForm('nutzer€', 'pass12')).toBe('Benutzername darf nur Buchstaben, Ziffern, _ und - enthalten.');
  });

  test('returns error when username contains cyrillic characters', () => {
    expect(validateAuthForm('злата', 'pass12')).toBe('Benutzername darf nur Buchstaben, Ziffern, _ und - enthalten.');
  });

  test('returns error when password is too short', () => {
    expect(validateAuthForm('user1', 'abc')).toBe('Passwort muss mindestens 6 Zeichen lang sein.');
  });

  test('allows underscores and hyphens in username', () => {
    expect(validateAuthForm('my_user-1', 'pass12')).toBeNull();
  });
});
