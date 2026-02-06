import { nanoid } from 'nanoid';
import type { DataStore } from '../data/store';

export type GumroadWebhookPayload = {
  sale_id: string;
  product_id: string;
  email?: string;
  price?: number;
  currency?: string;
  custom_fields?: Record<string, string>;
};

export type UnlockResult = {
  analysisId: string;
  token: string;
  alreadyProcessed: boolean;
};

export function validateGumroadPayload(payload: GumroadWebhookPayload) {
  if (!payload.sale_id || !payload.product_id) {
    throw new Error('Missing Gumroad sale_id or product_id.');
  }
}

export async function handleGumroadWebhook(
  store: DataStore,
  payload: GumroadWebhookPayload
): Promise<UnlockResult> {
  validateGumroadPayload(payload);

  const existing = await store.findPurchaseBySaleId(payload.sale_id);
  if (existing) {
    const token = await store.getUnlockTokenByAnalysis(existing.analysis_id);
    if (!token) {
      throw new Error('Unlock token missing for existing purchase.');
    }
    return { analysisId: existing.analysis_id, token: token.token, alreadyProcessed: true };
  }

  const analysisId = payload.custom_fields?.analysis_id;
  if (!analysisId) {
    throw new Error('Missing analysis_id in Gumroad custom fields.');
  }

  await store.createPurchase({
    analysis_id: analysisId,
    gumroad_sale_id: payload.sale_id,
    product_id: payload.product_id,
    email: payload.email ?? null,
    price_cents: payload.price ?? null,
    currency: payload.currency ?? null,
    raw_payload: payload
  });

  await store.updateAnalysisStatus(analysisId, 'unlocked');

  const token = await store.createOrUpdateUnlockToken({
    analysis_id: analysisId,
    token: nanoid(32),
    expires_at: null
  });

  return { analysisId, token: token.token, alreadyProcessed: false };
}
