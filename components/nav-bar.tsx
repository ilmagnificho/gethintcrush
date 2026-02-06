import Link from 'next/link';

export function NavBar() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          gethintcrush
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/analyze" className="text-slate-600 hover:text-ink">
            Analyze
          </Link>
          <Link href="/disclaimer" className="text-slate-600 hover:text-ink">
            Disclaimer
          </Link>
        </nav>
      </div>
    </header>
  );
}
