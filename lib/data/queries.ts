import { createClient } from '../supabase/server';
import type { Analysis, AnalysisResult } from './types';

export async function fetchAnalysis(analysisId: string): Promise<Analysis | null> {
  const client = createClient();
  const { data, error } = await client.from('analyses').select().eq('id', analysisId).maybeSingle();
  if (error) {
    throw new Error('Unable to load analysis.');
  }
  return data ?? null;
}

export async function fetchAnalysisResult(analysisId: string): Promise<AnalysisResult | null> {
  const client = createClient();
  const { data, error } = await client
    .from('analysis_results')
    .select()
    .eq('analysis_id', analysisId)
    .maybeSingle();
  if (error) {
    throw new Error('Unable to load analysis result.');
  }
  return data ?? null;
}
