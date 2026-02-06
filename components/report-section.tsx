import clsx from 'clsx';

export function ReportSection({
  title,
  children,
  locked
}: {
  title: string;
  children: React.ReactNode;
  locked?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {locked ? (
          <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
            Premium
          </span>
        ) : null}
      </div>
      <div className={clsx('mt-4 space-y-3 text-sm text-slate-700', locked && 'blur-premium')}>{children}</div>
      {locked ? (
        <p className="mt-3 text-xs text-slate-500">Unlock full report to view this section.</p>
      ) : null}
    </section>
  );
}
