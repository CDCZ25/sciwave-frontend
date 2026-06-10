'use client';

import { useEffect, useState, use } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getResource, type Resource } from '@/lib/api';
import { getCategoryColor } from '@/lib/categoryColors';
import Spinner from '@/components/Spinner';

const LANG_NAMES: Record<string, string> = { es: 'Español', pt: 'Português', en: 'English' };
const OTHER_LOCALE: Record<string, string> = { es: 'pt', pt: 'es' };

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations('article');
  const locale = useLocale();
  const router = useRouter();

  const [article, setArticle] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [otherExists, setOtherExists] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const data = await getResource(locale, id);
        setArticle(data);

        const other = OTHER_LOCALE[locale];
        if (other) {
          getResource(other, id)
            .then(() => setOtherExists(true))
            .catch(() => setOtherExists(false));
        }
      } catch (err) {
        console.error('Failed to fetch article:', err);
        // A real 404 falls through to the "not found" view; other failures show retry.
        if ((err as { status?: number }).status === 404) {
          setArticle(null);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [locale, id, reloadKey]);

  const handleRetry = () => setReloadKey((k) => k + 1);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchLanguage = () => {
    const other = OTHER_LOCALE[locale];
    if (other) router.push(`/${other}/articles/${id}`);
  };

  if (loading) {
    return <Spinner size={56} label={t('loading')} className="min-h-screen bg-slate-950" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-center px-4">
        <p className="text-lg text-slate-300 mb-6">{t('error')}</p>
        <button
          onClick={handleRetry}
          className="text-cyan-400 hover:text-cyan-300 text-sm tracking-widest uppercase border border-cyan-400/30 hover:border-cyan-300/60 px-6 py-2 rounded-full transition-all duration-200"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-center px-4">
        <p className="text-6xl font-black text-slate-800 mb-4">404</p>
        <h1 className="text-xl font-semibold text-slate-200 mb-6">{t('notFound')}</h1>
        <Link href={`/${locale}`} className="text-cyan-400 hover:text-cyan-300 text-sm tracking-widest uppercase border border-cyan-400/30 hover:border-cyan-300/60 px-6 py-2 rounded-full transition-all duration-200">
          {t('backToHome')}
        </Link>
      </div>
    );
  }

  const getHostname = (url: string) => {
    try { return new URL(url).hostname; }
    catch { return url; }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Back button */}
      <div className="fixed top-26 left-8 z-50">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-200 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToHome')}
        </Link>
      </div>

      {/* Hero */}
      <div className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase border rounded-full ${getCategoryColor(article.category.name)}`}>
              {article.category.name}
            </span>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest uppercase border rounded-full text-slate-300 bg-slate-400/10 border-slate-400/20">
              {LANG_NAMES[article.language.code] ?? article.language.code.toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
            {article.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-8 border-b border-slate-800">
          {otherExists && (
            <button
              onClick={switchLanguage}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700 rounded-full transition-all duration-200"
            >
              {t('readInLanguage')} {LANG_NAMES[OTHER_LOCALE[locale]]}
            </button>
          )}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700 rounded-full transition-all duration-200"
          >
            {copied ? (
              <span className="text-emerald-400">{t('shareCopied')}</span>
            ) : (
              <>{t('share')}</>
            )}
          </button>
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-800/60 hover:bg-slate-700 border border-slate-700 rounded-full transition-all duration-200"
            >
              {t('source')}: {getHostname(article.source_url)}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        <div className="relative">
          <div className="hidden md:block absolute -left-6 top-0 bottom-0 w-px bg-linear-to-b from-cyan-400/40 via-cyan-400/10 to-transparent" />
          <div className="text-slate-300 leading-relaxed text-base space-y-4 whitespace-pre-wrap">
            {article.content}
          </div>
        </div>
      </main>
    </div>
  );
}