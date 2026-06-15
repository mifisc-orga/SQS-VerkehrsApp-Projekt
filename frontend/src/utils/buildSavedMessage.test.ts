import { describe, expect, test } from 'vitest';
import { buildSavedMessage } from './buildSavedMessage';

const FULFILLED = { status: 'fulfilled' as const, value: undefined };
const REJECTED = { status: 'rejected' as const, reason: 'error' };

describe('buildSavedMessage', () => {
  test('returns saved message when all results are fulfilled', () => {
    expect(buildSavedMessage([FULFILLED, FULFILLED])).toBe('Favouriten gespeichert!');
  });

  test('returns mixed message when some are fulfilled and some rejected', () => {
    expect(buildSavedMessage([FULFILLED, REJECTED])).toBe('1 gespeichert, 1 bereits vorhanden.');
  });

  test('returns already-exists message when all results are rejected', () => {
    expect(buildSavedMessage([REJECTED, REJECTED])).toBe('Alle Autobahnen sind bereits in deinen Favouriten.');
  });

  test('handles single fulfilled result', () => {
    expect(buildSavedMessage([FULFILLED])).toBe('Favouriten gespeichert!');
  });

  test('handles empty results array', () => {
    expect(buildSavedMessage([])).toBe('Alle Autobahnen sind bereits in deinen Favouriten.');
  });
});
