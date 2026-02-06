export type AnalysisStatus = 'pending' | 'ready' | 'locked' | 'unlocked' | 'failed';

export type Analysis = {
  id: string;
  session_token: string;
  target_url: string;
  self_url: string | null;
  goal: string | null;
  status: AnalysisStatus;
  created_at: string;
};

export type AnalysisResult = {
  id: string;
  analysis_id: string;
  preview_json: Record<string, unknown>;
  full_json: Record<string, unknown>;
  created_at: string;
};

export type Purchase = {
  id: string;
  analysis_id: string;
  gumroad_sale_id: string;
  product_id: string;
  email: string | null;
  price_cents: number | null;
  currency: string | null;
  verified: boolean;
  raw_payload: Record<string, unknown>;
  created_at: string;
};

export type UnlockToken = {
  id: string;
  analysis_id: string;
  token: string;
  expires_at: string | null;
  created_at: string;
};
