'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const goals = [
  { value: '', label: 'Choose a goal (optional)' },
  { value: 'conversation_starters', label: 'Conversation starters' },
  { value: 'interest_overlap', label: 'Interest overlap' },
  { value: 'vibe_summary', label: 'Vibe summary' }
];

export default function AnalyzePage() {
  const router = useRouter();
  const [targetUrl, setTargetUrl] = useState('');
  const [selfUrl, setSelfUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [manualText, setManualText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_url: targetUrl,
          self_url: selfUrl || null,
          goal: goal || null,
          manual_text: manualText || null
        })
      });

      if (!response.ok) {
        const message = await response.json();
        throw new Error(message.error || 'Unable to start analysis.');
      }

      const data = await response.json();
      router.push(`/result/${data.analysis_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-ink">Start a free analysis</h1>
      <p className="mt-2 text-sm text-slate-600">
        Public-content insights only. No private messages or private accounts analyzed.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="text-sm font-medium text-ink">Target Instagram URL</label>
          <input
            value={targetUrl}
            onChange={(event) => setTargetUrl(event.target.value)}
            required
            placeholder="https://instagram.com/target"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Your Instagram URL (optional)</label>
          <input
            value={selfUrl}
            onChange={(event) => setSelfUrl(event.target.value)}
            placeholder="https://instagram.com/you"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Goal (optional)</label>
          <select
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
          >
            {goals.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Fallback manual captions (optional)</label>
          <textarea
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
            placeholder="Paste public captions or hashtags here if the profile is unavailable."
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
          />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
        >
          {loading ? 'Analyzing...' : 'Generate preview'}
        </button>
      </form>
    </div>
  );
}
