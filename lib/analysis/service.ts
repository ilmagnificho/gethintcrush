import { nanoid } from 'nanoid';
import type { ContentProvider, PublicProfile } from './provider';
import { buildInsightReport, splitPreviewFull } from './analysis';
import type { DataStore } from '../data/store';

export type AnalyzeInput = {
  target_url: string;
  self_url: string | null;
  goal: string | null;
  manual_text?: string | null;
};

export async function runAnalysis(
  store: DataStore,
  provider: ContentProvider,
  input: AnalyzeInput
) {
  const sessionToken = nanoid();
  const analysis = await store.createAnalysis({
    session_token: sessionToken,
    target_url: input.target_url,
    self_url: input.self_url ?? null,
    goal: input.goal ?? null,
    status: 'pending'
  });

  let targetProfile: PublicProfile;
  if (input.manual_text) {
    targetProfile = {
      captions: input.manual_text.split(/\n|\r/).filter(Boolean),
      hashtags: []
    };
  } else {
    targetProfile = await provider.fetchPublicProfile(input.target_url);
  }

  let selfProfile: PublicProfile | undefined;
  if (input.self_url) {
    selfProfile = await provider.fetchPublicProfile(input.self_url);
  }

  const report = buildInsightReport(targetProfile, selfProfile);
  const { preview, full } = splitPreviewFull(report);

  await store.createAnalysisResult({
    analysis_id: analysis.id,
    preview_json: preview,
    full_json: full
  });

  await store.updateAnalysisStatus(analysis.id, 'locked');

  return { analysis, preview, full };
}
