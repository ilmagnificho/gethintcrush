import { describe, expect, it } from 'vitest';
import { MemoryStore } from '../lib/data/store';
import { handleGumroadWebhook } from '../lib/gumroad/webhook';

const payload = {
  sale_id: 'sale-123',
  product_id: 'prod-abc',
  email: 'test@example.com',
  price: 900,
  currency: 'USD',
  custom_fields: { analysis_id: 'analysis-1' }
};

describe('handleGumroadWebhook', () => {
  it('is idempotent for repeated sale ids', async () => {
    const store = new MemoryStore();
    const first = await handleGumroadWebhook(store, payload);
    const second = await handleGumroadWebhook(store, payload);

    expect(first.token).toBe(second.token);
    expect(second.alreadyProcessed).toBe(true);
  });
});
