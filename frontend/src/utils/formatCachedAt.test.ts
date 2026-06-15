import { describe, expect, test } from 'vitest';
import { formatCachedAt } from './formatCachedAt';

describe('formatCachedAt', () => {
  test('returns empty string for null input', () => {
    expect(formatCachedAt(null)).toBe('');
  });

  test('returns formatted time string for valid ISO timestamp', () => {
    // Use a fixed timestamp and verify the format HH:MM
    const result = formatCachedAt('2024-01-15T14:30:00.000Z');
    expect(result).toMatch(/^\d{2}:\d{2}$/);
  });

  test('returns empty string for empty string input', () => {
    expect(formatCachedAt('')).toBe('');
  });
});
