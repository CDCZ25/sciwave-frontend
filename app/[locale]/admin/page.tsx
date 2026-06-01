'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getAllResources, translateResource, type Resource } from '@/lib/api';

const LANG_LABELS: Record<string, string> = { en: 'EN', es: 'ES', pt: 'PT' };
const LANG_COLORS: Record<string, string> = {
  en: 'bg-gray-100 text-gray-700',
  es: 'bg-yellow-100 text-yellow-800',
  pt: 'bg-green-100 text-green-800',
};
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  review: 'bg-amber-100 text-amber-700',
};

export default function AdminPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; type: 'ok' | 'err'; msg: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace(`/${locale}/auth/login`);
    });
  }, [locale, router]);

  useEffect(() => {
    getAllResources()
      .then(setResources)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const enIds = new Set(
    resources.filter((r) => r.language.code === 'en').map((r) => r.id_crosslanguage),
  );
  const translatedIds = new Set(
    resources.filter((r) => r.language.code !== 'en').map((r) => r.id_crosslanguage),
  );

  const handleTranslate = async (resource: Resource) => {
    setTranslating(resource.id);
    setFeedback(null);
    try {
      const result = await translateResource(resource.id);
      const fresh = await getAllResources();
      setResources(fresh);
      setFeedback({ id: resource.id, type: 'ok', msg: `${t('translated')} (ES + PT)` });
      console.log('Translated:', result);
    } catch (err) {
      setFeedback({ id: resource.id, type: 'err', msg: err instanceof Error ? err.message : t('translateError') });
    } finally {
      setTranslating(null);
    }
  };

  const enResources = resources.filter((r) => r.language.code === 'en');
  const otherResources = resources.filter((r) => r.language.code !== 'en');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <Link
          href={`/${locale}/admin/articles/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span>+</span> {t('newArticle')}
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 text-gray-500">{t('noResources')}</div>
      ) : (
        <>
          {/* English articles — translatable */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
              {t('langEn')} ({enResources.length})
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Título</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">{t('category')}</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">{t('status')}</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Traducciones</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enResources.map((r) => {
                    const isTranslated = translatedIds.has(r.id_crosslanguage);
                    const isTranslating = translating === r.id;
                    const fb = feedback?.id === r.id ? feedback : null;
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 max-w-xs">
                          <span className="line-clamp-1">{r.title}</span>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{r.category.name}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {t(`status${r.status.charAt(0).toUpperCase() + r.status.slice(1)}` as 'statusDraft')}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-1">
                            {['es', 'pt'].map((code) => {
                              const langs = resources
                                .filter((x) => x.id_crosslanguage === r.id_crosslanguage && x.language.code === code);
                              return (
                                <span
                                  key={code}
                                  className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${langs.length > 0 ? LANG_COLORS[code] : 'bg-gray-50 text-gray-300 border border-dashed border-gray-200'}`}
                                >
                                  {code.toUpperCase()}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {fb && (
                            <span className={`text-xs mr-3 ${fb.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
                              {fb.msg}
                            </span>
                          )}
                          {isTranslated ? (
                            <span className="text-xs text-gray-400 font-medium">{t('alreadyTranslated')}</span>
                          ) : (
                            <button
                              onClick={() => handleTranslate(r)}
                              disabled={isTranslating}
                              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                              {isTranslating ? (
                                <>
                                  <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  {t('translating')}
                                </>
                              ) : (
                                <>✦ {t('translate')}</>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Translated resources */}
          {otherResources.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Traducciones generadas ({otherResources.length})
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold text-gray-600">Título</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">{t('language')}</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">{t('category')}</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {otherResources.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-800 max-w-xs">
                          <span className="line-clamp-1">{r.title}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${LANG_COLORS[r.language.code] ?? 'bg-gray-100 text-gray-600'}`}>
                            {LANG_LABELS[r.language.code] ?? r.language.code.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{r.category.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {t(`status${r.status.charAt(0).toUpperCase() + r.status.slice(1)}` as 'statusDraft')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
