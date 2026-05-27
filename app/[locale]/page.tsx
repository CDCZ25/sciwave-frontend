'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getResources, getCategories, type Resource, type Category } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();
  const [articles, setArticles] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [articlesData, categoriesData] = await Promise.all([
          getResources(locale),
          getCategories(locale),
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category.id === selectedCategory)
    : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl font-extrabold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Category Filter */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {t('allCategories')}
            </h2>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {t('allCategories')}
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content - Article Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div> {/* ← cierra el flex aquí */}

      {/* No articles - fuera del flex */}
      {!loading && filteredArticles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t('noArticles')}
        </div>
      )}
    </div>
  );
}