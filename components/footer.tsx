import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-ink">gethintcrush</p>
          <p>Public-content insights only.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/disclaimer" className="hover:text-ink">
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
