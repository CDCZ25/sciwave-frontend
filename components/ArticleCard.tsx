'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Resource } from '@/lib/api';

interface ArticleCardProps {
  article: Resource;
}

const PLACEHOLDER_COLORS = [
  'from-blue-400 to-indigo-500',
  'from-teal-400 to-cyan-500',
  'from-violet-400 to-purple-500',
  'from-emerald-400 to-green-500',
];

export default function ArticleCard({ article }: ArticleCardProps) {
  const locale = useLocale();
  const t = useTranslations('home');

  const preview = article.content.substring(0, 140).trimEnd() + '…';

  const gradientIndex =
    article.id.charCodeAt(0) % PLACEHOLDER_COLORS.length;
  const gradient = PLACEHOLDER_COLORS[gradientIndex];

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString(locale === 'es' ? 'es-MX' : 'pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={`/${locale}/articles/${article.id_crosslanguage}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer border border-gray-100 hover:border-blue-200 overflow-hidden h-full group">
        {/* Image / Placeholder */}
        <div className="w-full h-44 overflow-hidden shrink-0">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-white/30 text-5xl font-black select-none">
                {article.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {/* Category + Date */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
              {article.category.name}
            </span>
            {formattedDate && (
              <span className="text-xs text-gray-400">{formattedDate}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
            {article.title}
          </h3>

          {/* Preview */}
          <p className="text-gray-500 text-sm leading-relaxed grow line-clamp-3">
            {preview}
          </p>

          {/* Read more */}
          <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
            {t('readMore')} →
          </div>
        </div>
      </div>
    </Link>
  );
}
