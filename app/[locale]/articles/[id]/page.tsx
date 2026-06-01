'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { getResource, type Resource } from '@/lib/api';
import { use } from 'react';

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

  const [article, setArticle] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [otherExists, setOtherExists] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const data = await getResource(locale, id);
        setArticle(data);

        const other = OTHER_LOCALE[locale];
        if (other) {
          getResource(other, id)
            .then(() => setOtherExists(true))
            .catch(() => setOtherExists(false));
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [locale, id]);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchLanguage = () => {
    const other = OTHER_LOCALE[locale];
    if (other) window.location.href = `/${other}/articles/${id}`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        <p className="mt-4 text-gray-500 text-sm">{t('loading')}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('notFound')}</h1>
        <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-700 font-medium">
          {t('backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
      >
        {t('backToHome')}
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
            {article.category.name}
          </span>
          <span className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
            {LANG_NAMES[article.language.code] ?? article.language.code.toUpperCase()}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        {/* Actions bar */}
        <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-100">
          {/* Language switcher */}
          {otherExists && (
            <button
              onClick={switchLanguage}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors"
            >
              {t('readInLanguage')} {LANG_NAMES[OTHER_LOCALE[locale]]}
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors"
          >
            {copied ? (
              <span className="text-green-600">{t('shareCopied')}</span>
            ) : (
              <>{t('share')}</>
            )}
          </button>

          {/* Source URL */}
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors"
            >
              {t('source')} ↗
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-gray prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-[1.0625rem]">
          {article.content}
        </div>
      </div>
    </article>
  );
}
