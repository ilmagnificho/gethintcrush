import { createClient } from '../supabase/server';
import type { Analysis, AnalysisResult, AnalysisStatus, Purchase, UnlockToken } from './types';

export type CreateAnalysisInput = {
  session_token: string;
  target_url: string;
  self_url: string | null;
  goal: string | null;
  status: AnalysisStatus;
};

export type CreateAnalysisResultInput = {
  analysis_id: string;
  preview_json: Record<string, unknown>;
  full_json: Record<string, unknown>;
};

export type CreatePurchaseInput = Omit<Purchase, 'id' | 'created_at' | 'verified'> & { verified?: boolean };

export type CreateUnlockTokenInput = {
  analysis_id: string;
  token: string;
  expires_at: string | null;
};

export interface DataStore {
  createAnalysis(input: CreateAnalysisInput): Promise<Analysis>;
  updateAnalysisStatus(analysisId: string, status: AnalysisStatus): Promise<void>;
  getAnalysis(analysisId: string): Promise<Analysis | null>;
  createAnalysisResult(input: CreateAnalysisResultInput): Promise<AnalysisResult>;
  getAnalysisResult(analysisId: string): Promise<AnalysisResult | null>;
  findPurchaseBySaleId(saleId: string): Promise<Purchase | null>;
  createPurchase(input: CreatePurchaseInput): Promise<Purchase>;
  createOrUpdateUnlockToken(input: CreateUnlockTokenInput): Promise<UnlockToken>;
  getUnlockTokenByToken(token: string): Promise<UnlockToken | null>;
  getUnlockTokenByAnalysis(analysisId: string): Promise<UnlockToken | null>;
}

export class SupabaseStore implements DataStore {
  private client = createClient();

  async createAnalysis(input: CreateAnalysisInput): Promise<Analysis> {
    const { data, error } = await this.client
      .from('analyses')
      .insert(input)
      .select()
      .single();
    if (error || !data) {
      throw new Error('Failed to create analysis.');
    }
    return data;
  }

  async updateAnalysisStatus(analysisId: string, status: AnalysisStatus): Promise<void> {
    const { error } = await this.client
      .from('analyses')
      .update({ status })
      .eq('id', analysisId);
    if (error) {
      throw new Error('Failed to update analysis status.');
    }
  }

  async getAnalysis(analysisId: string): Promise<Analysis | null> {
    const { data, error } = await this.client
      .from('analyses')
      .select()
      .eq('id', analysisId)
      .maybeSingle();
    if (error) {
      throw new Error('Failed to fetch analysis.');
    }
    return data ?? null;
  }

  async createAnalysisResult(input: CreateAnalysisResultInput): Promise<AnalysisResult> {
    const { data, error } = await this.client
      .from('analysis_results')
      .insert(input)
      .select()
      .single();
    if (error || !data) {
      throw new Error('Failed to create analysis result.');
    }
    return data;
  }

  async getAnalysisResult(analysisId: string): Promise<AnalysisResult | null> {
    const { data, error } = await this.client
      .from('analysis_results')
      .select()
      .eq('analysis_id', analysisId)
      .maybeSingle();
    if (error) {
      throw new Error('Failed to fetch analysis result.');
    }
    return data ?? null;
  }

  async findPurchaseBySaleId(saleId: string): Promise<Purchase | null> {
    const { data, error } = await this.client
      .from('purchases')
      .select()
      .eq('gumroad_sale_id', saleId)
      .maybeSingle();
    if (error) {
      throw new Error('Failed to fetch purchase.');
    }
    return data ?? null;
  }

  async createPurchase(input: CreatePurchaseInput): Promise<Purchase> {
    const { data, error } = await this.client
      .from('purchases')
      .insert({ ...input, verified: input.verified ?? false })
      .select()
      .single();
    if (error || !data) {
      throw new Error('Failed to create purchase.');
    }
    return data;
  }

  async createOrUpdateUnlockToken(input: CreateUnlockTokenInput): Promise<UnlockToken> {
    const { data, error } = await this.client
      .from('unlock_tokens')
      .upsert(input, { onConflict: 'analysis_id' })
      .select()
      .single();
    if (error || !data) {
      throw new Error('Failed to create unlock token.');
    }
    return data;
  }

  async getUnlockTokenByToken(token: string): Promise<UnlockToken | null> {
    const { data, error } = await this.client
      .from('unlock_tokens')
      .select()
      .eq('token', token)
      .maybeSingle();
    if (error) {
      throw new Error('Failed to fetch unlock token.');
    }
    return data ?? null;
  }

  async getUnlockTokenByAnalysis(analysisId: string): Promise<UnlockToken | null> {
    const { data, error } = await this.client
      .from('unlock_tokens')
      .select()
      .eq('analysis_id', analysisId)
      .maybeSingle();
    if (error) {
      throw new Error('Failed to fetch unlock token.');
    }
    return data ?? null;
  }
}

export class MemoryStore implements DataStore {
  private analyses = new Map<string, Analysis>();
  private results = new Map<string, AnalysisResult>();
  private purchases = new Map<string, Purchase>();
  private unlockTokens = new Map<string, UnlockToken>();

  async createAnalysis(input: CreateAnalysisInput): Promise<Analysis> {
    const analysis: Analysis = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...input
    };
    this.analyses.set(analysis.id, analysis);
    return analysis;
  }

  async updateAnalysisStatus(analysisId: string, status: AnalysisStatus): Promise<void> {
    const analysis = this.analyses.get(analysisId);
    if (!analysis) return;
    this.analyses.set(analysisId, { ...analysis, status });
  }

  async getAnalysis(analysisId: string): Promise<Analysis | null> {
    return this.analyses.get(analysisId) ?? null;
  }

  async createAnalysisResult(input: CreateAnalysisResultInput): Promise<AnalysisResult> {
    const result: AnalysisResult = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...input
    };
    this.results.set(input.analysis_id, result);
    return result;
  }

  async getAnalysisResult(analysisId: string): Promise<AnalysisResult | null> {
    return this.results.get(analysisId) ?? null;
  }

  async findPurchaseBySaleId(saleId: string): Promise<Purchase | null> {
    return this.purchases.get(saleId) ?? null;
  }

  async createPurchase(input: CreatePurchaseInput): Promise<Purchase> {
    const purchase: Purchase = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      verified: input.verified ?? false,
      ...input
    };
    this.purchases.set(purchase.gumroad_sale_id, purchase);
    return purchase;
  }

  async createOrUpdateUnlockToken(input: CreateUnlockTokenInput): Promise<UnlockToken> {
    const token: UnlockToken = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...input
    };
    this.unlockTokens.set(input.analysis_id, token);
    return token;
  }

  async getUnlockTokenByToken(token: string): Promise<UnlockToken | null> {
    for (const entry of this.unlockTokens.values()) {
      if (entry.token === token) return entry;
    }
    return null;
  }

  async getUnlockTokenByAnalysis(analysisId: string): Promise<UnlockToken | null> {
    return this.unlockTokens.get(analysisId) ?? null;
  }
}
