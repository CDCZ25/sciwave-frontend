import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import Navbar from '@/components/Navbar';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col bg-slate-950">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm">
              © 2026 SciWave
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
