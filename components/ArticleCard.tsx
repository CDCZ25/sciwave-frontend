'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Resource } from '@/lib/api';

interface ArticleCardProps {
  article: Resource;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const locale = useLocale();
  const t = useTranslations('home');

  // Extract first 150 characters for preview
  const preview = article.content.substring(0, 150) + '...';

  return (
    <Link href={`/${locale}/articles/${article.id_crosslanguage}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 h-full flex flex-col cursor-pointer border border-gray-100 hover:border-blue-300">
        {/* Imagen */}
        {article.image_url && (
          <div className="w-full h-48 bg-gray-200 overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}
        
        {/* Category Tag */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
            {article.category.name}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {article.title}
        </h3>

        {/* Preview */}
        <p className="text-gray-600 text-sm mb-4 grow line-clamp-3">
          {preview}
        </p>

        {/* Read More */}
        <div className="text-blue-600 font-medium text-sm hover:text-blue-700">
          {t('readMore')}...
        </div>
      </div>
    </Link>
  );
}
