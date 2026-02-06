import type { DataStore } from './data/store';

export async function validateUnlockToken(store: DataStore, analysisId: string, token: string) {
  const record = await store.getUnlockTokenByToken(token);
  if (!record || record.analysis_id !== analysisId) {
    return { valid: false, reason: 'Invalid token.' };
  }

  if (record.expires_at && new Date(record.expires_at) < new Date()) {
    return { valid: false, reason: 'Token expired.' };
  }

  return { valid: true };
}

export function canAccessFullReport(status: string, tokenValid: boolean) {
  return status === 'unlocked' && tokenValid;
}
