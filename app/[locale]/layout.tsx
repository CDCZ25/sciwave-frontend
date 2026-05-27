import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
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
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm">
              © 2026 SciWave {locale === 'es' ? '' : ''}
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
