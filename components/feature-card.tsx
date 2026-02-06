import { ReactNode } from 'react';

export function FeatureCard({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="gradient-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-2xl">{icon}</div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
