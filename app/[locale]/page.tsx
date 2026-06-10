'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getResources, getCategories, type Resource, type Category } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import ArticleCardSkeleton from '@/components/ArticleCardSkeleton';
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
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const [articlesData, categoriesData] = await Promise.all([
          getResources(locale),
          getCategories(locale),
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [locale, reloadKey]);

  const handleRetry = () => setReloadKey((k) => k + 1);

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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Hero onExplore={scrollToGrid} />

      <div ref={gridRef} className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">

        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="sticky top-6">
            <p className="text-xs tracking-widest uppercase text-slate-500 mb-4 px-1">
              {t('allCategories')}
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setSelectedCategory(null); setSearch(''); }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    selectedCategory === null && !search
                      ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {t('allCategories')}
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => { setSelectedCategory(category.id); setSearch(''); }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      selectedCategory === category.id
                        ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-grow min-w-0">
          <SearchBar value={search} onChange={handleSearchChange} />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-lg text-slate-300 mb-6">{t('error')}</p>
              <button
                onClick={handleRetry}
                className="text-cyan-400 hover:text-cyan-300 text-sm tracking-widest uppercase border border-cyan-400/30 hover:border-cyan-300/60 px-6 py-2 rounded-full transition-all duration-200"
              >
                {t('retry')}
              </button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
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