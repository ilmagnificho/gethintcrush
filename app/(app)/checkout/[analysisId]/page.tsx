import Link from 'next/link';
import { fetchAnalysis } from '../../../../lib/data/queries';

export default async function CheckoutPage({
  params
}: {
  params: { analysisId: string };
}) {
  const analysis = await fetchAnalysis(params.analysisId);

  if (!analysis) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <p className="text-sm text-slate-600">Analysis not found.</p>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL_SINGLE ?? '';
  const checkoutUrl = `${baseUrl}?analysis_id=${analysis.id}&session_token=${analysis.session_token}&plan=single`;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-ink">Unlock the full report</h1>
      <p className="mt-2 text-sm text-slate-600">
        Secure checkout via Gumroad. We only unlock after verified payment.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Full report includes</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• 20 conversation starters</li>
            <li>• Topic distribution & cadence analysis</li>
            <li>• Interest overlap score (if self profile provided)</li>
            <li>• PDF download</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">One-time unlock</p>
          <p className="mt-2 text-3xl font-semibold text-ink">$9</p>
          <a
            href={checkoutUrl}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
          >
            Continue to Gumroad
          </a>
          <p className="mt-4 text-xs text-slate-500">
            Public-content insights only. No private messages or private accounts analyzed.
          </p>
        </div>
      </div>

      <div className="mt-8 text-sm">
        <Link href={`/result/${analysis.id}`} className="text-slate-600 hover:text-ink">
          Back to preview
        </Link>
      </div>
    </div>
  );
}
