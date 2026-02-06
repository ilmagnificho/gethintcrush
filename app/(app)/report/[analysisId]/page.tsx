import Link from 'next/link';
import { SupabaseStore } from '../../../../lib/data/store';
import { validateUnlockToken } from '../../../../lib/unlock';
import { fetchAnalysis, fetchAnalysisResult } from '../../../../lib/data/queries';
import { ReportSection } from '../../../../components/report-section';

export default async function ReportPage({
  params,
  searchParams
}: {
  params: { analysisId: string };
  searchParams: { token?: string };
}) {
  const analysis = await fetchAnalysis(params.analysisId);
  const result = await fetchAnalysisResult(params.analysisId);

  if (!analysis || !result) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <p className="text-sm text-slate-600">Analysis not found.</p>
      </div>
    );
  }

  if (analysis.status !== 'unlocked') {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-ink">Report locked</h1>
        <p className="mt-2 text-sm text-slate-600">
          This report is locked until payment is verified.
        </p>
        <Link href={`/checkout/${analysis.id}`} className="mt-6 inline-flex text-sm text-ink">
          Continue to checkout
        </Link>
      </div>
    );
  }

  const store = new SupabaseStore();
  const token = searchParams.token ?? '';
  const tokenCheck = await validateUnlockToken(store, analysis.id, token);

  if (!tokenCheck.valid) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-ink">Access denied</h1>
        <p className="mt-2 text-sm text-slate-600">{tokenCheck.reason}</p>
        <Link href={`/checkout/${analysis.id}`} className="mt-6 inline-flex text-sm text-ink">
          Return to checkout
        </Link>
      </div>
    );
  }

  const full = result.full_json as {
    topKeywords: string[];
    topHashtags: string[];
    topicDistribution: { topic: string; count: number }[];
    cadenceSummary: string;
    conversationStarters: string[];
    overlapScore?: number;
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Full report</h1>
          <p className="mt-2 text-sm text-slate-600">For conversation planning, not personal diagnosis.</p>
        </div>
        <a
          href={`/api/report/pdf/${analysis.id}?token=${token}`}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          Download PDF
        </a>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ReportSection title="Top keywords">
          <ul className="flex flex-wrap gap-2">
            {full.topKeywords.map((keyword) => (
              <li key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                {keyword}
              </li>
            ))}
          </ul>
        </ReportSection>
        <ReportSection title="Top hashtags">
          <ul className="flex flex-wrap gap-2">
            {full.topHashtags.map((tag) => (
              <li key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                {tag}
              </li>
            ))}
          </ul>
        </ReportSection>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ReportSection title="Topic distribution">
          <ul className="space-y-2">
            {full.topicDistribution.map((topic) => (
              <li key={topic.topic} className="flex items-center justify-between">
                <span className="capitalize">{topic.topic}</span>
                <span className="text-xs text-slate-500">{topic.count}</span>
              </li>
            ))}
          </ul>
        </ReportSection>
        <ReportSection title="Cadence summary">
          <p>{full.cadenceSummary}</p>
        </ReportSection>
      </div>

      {full.overlapScore !== undefined ? (
        <div className="mt-6">
          <ReportSection title="Interest overlap">
            <p>Overlap score: {full.overlapScore}</p>
          </ReportSection>
        </div>
      ) : null}

      <div className="mt-6">
        <ReportSection title="Conversation starters">
          <ul className="space-y-2">
            {full.conversationStarters.map((starter) => (
              <li key={starter}>{starter}</li>
            ))}
          </ul>
        </ReportSection>
      </div>
    </div>
  );
}
