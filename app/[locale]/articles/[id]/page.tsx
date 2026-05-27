'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { getResource, type Resource } from '@/lib/api';
import { use } from 'react';

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

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const data = await getResource(locale, id);
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [locale, id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">{t('loading')}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('notFound')}</h1>
        <Link
          href={`/${locale}`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {t('backToHome')}
        </Link>
      </div>
    );
  }

  const switchLanguage = () => {
    const newLocale = locale === 'es' ? 'pt' : 'es';
    // Usa id_crosslanguage para cambiar de idioma
    window.location.href = `/${newLocale}/articles/${id}`;
  };
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
      >
        {t('backToHome')}
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
            {article.category.name}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {article.content}
          </div>
        </div>
      </div>

      {/* Article Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {t('category')}: <span className="font-medium text-gray-700">{article.category.name}</span>
          </div>
        </div>
      </footer>
    </article>
  );
}
