'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Resource } from '@/lib/api';
import { getCategoryColor } from '@/lib/categoryColors';

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

  const gradientIndex = article.id.charCodeAt(0) % PLACEHOLDER_COLORS.length;
  const gradient = PLACEHOLDER_COLORS[gradientIndex];

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString(locale === 'es' ? 'es-MX' : 'pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={`/${locale}/articles/${article.id_crosslanguage}`} className="group block h-full">
      <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-400/30 hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.1)] transition-all duration-300">

        {/* Image */}
        <div className="relative w-full h-44 bg-slate-800 overflow-hidden shrink-0">
          {article.image_url ? (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-white/30 text-5xl font-black select-none">
                {article.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 text-xs font-semibold tracking-wide uppercase bg-slate-950/70 backdrop-blur-sm border rounded-full ${getCategoryColor(article.category.name)}`}>
              {article.category.name}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {formattedDate && (
              <span className="text-xs text-slate-500">{formattedDate}</span>
            )}
          </div>

          <h3
            className="text-base font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-cyan-100 transition-colors"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {article.title}
          </h3>

          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-grow">
            {preview}
          </p>

          <div className="mt-4 flex items-center gap-1 text-cyan-400 text-xs font-semibold tracking-widest uppercase group-hover:gap-2 transition-all duration-200">
            {t('readMore')}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}