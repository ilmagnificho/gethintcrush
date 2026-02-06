import { describe, expect, it } from 'vitest';
import { instagramUrlSchema } from '../lib/validation';

describe('instagramUrlSchema', () => {
  it('accepts instagram urls', () => {
    expect(instagramUrlSchema.parse('https://instagram.com/example')).toBe(
      'https://instagram.com/example'
    );
  });

  it('rejects non-instagram urls', () => {
    expect(() => instagramUrlSchema.parse('https://example.com/user')).toThrow();
  });
});
