import { describe, expect, it } from 'vitest';
import { MemoryStore } from '../lib/data/store';
import { validateUnlockToken, canAccessFullReport } from '../lib/unlock';

describe('validateUnlockToken', () => {
  it('validates active token', async () => {
    const store = new MemoryStore();
    const token = await store.createOrUpdateUnlockToken({
      analysis_id: 'analysis-1',
      token: 'token-123',
      expires_at: null
    });

    const result = await validateUnlockToken(store, 'analysis-1', token.token);
    expect(result.valid).toBe(true);
  });
});

describe('canAccessFullReport', () => {
  it('denies access when locked', () => {
    expect(canAccessFullReport('locked', true)).toBe(false);
  });
});
