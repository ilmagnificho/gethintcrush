import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '../components/footer';
import { NavBar } from '../components/nav-bar';

export const metadata: Metadata = {
  title: 'gethintcrush — Public-content insights',
  description: 'Public-content insights for better conversation starters.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
