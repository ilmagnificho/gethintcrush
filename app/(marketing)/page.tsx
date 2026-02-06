import Link from 'next/link';
import { FeatureCard } from '../../components/feature-card';

export default function LandingPage() {
  return (
    <div className="bg-haze">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
              gethintcrush
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-ink md:text-5xl">
              Public-content insights for better conversation starters.
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Turn public Instagram posts into clear conversation cues. No private data, no DMs, just
              public-content trends and suggested openers.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/analyze"
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
              >
                Start Free Analysis
              </Link>
              <Link
                href="/disclaimer"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-ink"
              >
                Read the disclaimer
              </Link>
            </div>
            <div className="mt-6 text-sm text-slate-500">
              <p>Public-content insights only.</p>
              <p>No private messages or private accounts analyzed.</p>
              <p>For conversation planning, not personal diagnosis.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-ink">Free preview includes</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Top keywords & hashtags</li>
              <li>• Topic distribution snapshot</li>
              <li>• Two ready-to-send conversation starters</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
              Premium unlock adds 20 conversation starters, overlap score, cadence notes, and full
              report PDF.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            title="Public insights only"
            description="We analyze captions, hashtags, and public posting cadence — never private messages or private accounts."
            icon="🔍"
          />
          <FeatureCard
            title="Conversation-ready"
            description="Get topic clusters and ready-to-send openers that keep conversations natural."
            icon="💬"
          />
          <FeatureCard
            title="Purchase once"
            description="Unlock a shareable report with a PDF download after a secure Gumroad checkout."
            icon="⚡"
          />
        </div>
      </section>
    </div>
  );
}
