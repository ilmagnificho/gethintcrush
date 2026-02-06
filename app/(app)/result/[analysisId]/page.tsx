import Link from 'next/link';
import { fetchAnalysis, fetchAnalysisResult } from '../../../../lib/data/queries';
import { ReportSection } from '../../../../components/report-section';

export default async function ResultPage({
  params
}: {
  params: { analysisId: string };
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

  const preview = result.preview_json as {
    topKeywords: string[];
    topicDistribution: { topic: string; count: number }[];
    conversationStarters: string[];
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Free preview report</h1>
          <p className="mt-2 text-sm text-slate-600">
            Public-content insights only. No private messages or private accounts analyzed.
          </p>
        </div>
        <Link
          href={`/checkout/${analysis.id}`}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          Unlock full report
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ReportSection title="Top keywords">
          <ul className="flex flex-wrap gap-2">
            {preview.topKeywords.map((keyword) => (
              <li key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                {keyword}
              </li>
            ))}
          </ul>
        </ReportSection>
        <ReportSection title="Topic distribution">
          <ul className="space-y-2">
            {preview.topicDistribution.map((topic) => (
              <li key={topic.topic} className="flex items-center justify-between">
                <span className="capitalize">{topic.topic}</span>
                <span className="text-xs text-slate-500">{topic.count}</span>
              </li>
            ))}
          </ul>
        </ReportSection>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ReportSection title="Conversation starters">
          <ul className="space-y-2">
            {preview.conversationStarters.map((starter) => (
              <li key={starter}>{starter}</li>
            ))}
          </ul>
        </ReportSection>
        <ReportSection title="Premium insights" locked>
          <ul className="space-y-2">
            <li>Full topic trends & posting cadence</li>
            <li>Interest overlap scoring</li>
            <li>20 conversation starters</li>
            <li>PDF-ready report</li>
          </ul>
        </ReportSection>
      </div>
    </div>
  );
}
