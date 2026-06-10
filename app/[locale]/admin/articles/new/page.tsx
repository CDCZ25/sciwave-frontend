'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCategories, getLanguages, createResource, type Category, type Language } from '@/lib/api';

export default function NewArticlePage() {
  const t = useTranslations('admin.form');
  const locale = useLocale();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [enLang, setEnLang] = useState<Language | null>(null);
  const [loadError, setLoadError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace(`/${locale}/auth/login`);
    });
  }, [locale, router]);

  useEffect(() => {
    Promise.all([getCategories('en'), getLanguages()])
      .then(([cats, langs]) => {
        setCategories(cats);
        const en = langs.find((l) => l.code === 'en') ?? null;
        setEnLang(en);
      })
      .catch(() => setLoadError(t('errorLoad')));
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enLang || !categoryId) return;
    setSaving(true);
    setSaveError('');
    try {
      await createResource({
        title,
        content,
        categoryId,
        languageId: enLang.id,
        id_crosslanguage: crypto.randomUUID(),
        source_url: sourceUrl || undefined,
        image_url: imageUrl || undefined,
        status: 'draft',
      });
      router.push(`/${locale}/admin`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('errorSave'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 mt-1 text-sm">{t('subtitle')}</p>
      </div>

      {loadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {loadError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {t('titleLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('titlePlaceholder')}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {t('contentLabel')} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('contentPlaceholder')}
            rows={14}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y font-mono text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {t('categoryLabel')} <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
          >
            <option value="">{t('categoryPlaceholder')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && !loadError && (
            <p className="mt-1 text-xs text-amber-600">No English categories found. Create categories for the &ldquo;en&rdquo; language first.</p>
          )}
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {t('sourceLabel')}
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder={t('sourcePlaceholder')}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {t('imageLabel')}
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder={t('imagePlaceholder')}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="mt-3 h-32 w-full object-cover rounded-lg border border-gray-200"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </div>

        {saveError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {saveError}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={saving || !enLang}
            className="px-6 py-2.5 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? t('saving') : t('save')}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/admin`)}
            className="px-6 py-2.5 text-gray-600 font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
