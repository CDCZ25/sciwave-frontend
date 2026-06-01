'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getResources, getCategories, type Resource, type Category } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import Hero from '@/components/Hero';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();

  const [articles, setArticles] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const gridRef = useRef<HTMLDivElement>(null);

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

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setSelectedCategory(null);
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = !selectedCategory || article.category.id === selectedCategory;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Hero onExplore={scrollToGrid} />

      <div ref={gridRef} className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-20">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              {t('allCategories')}
            </h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setSelectedCategory(null); setSearch(''); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === null && !search
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {t('allCategories')}
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => { setSelectedCategory(category.id); setSearch(''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-grow min-w-0">
          <SearchBar value={search} onChange={handleSearchChange} />

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">{t('noArticles')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
