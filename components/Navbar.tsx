'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const switchLanguage = () => {
    const newLocale = locale === 'es' ? 'pt' : 'es';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-blue-700 via-blue-600 to-indigo-600 shadow-xl border-b border-blue-500/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2 group">
            <div className="font-serif text-3xl font-extrabold text-white tracking-tight drop-shadow-sm group-hover:text-blue-100 transition-colors duration-200">
              SciWave
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={switchLanguage}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200 tracking-widest uppercase"
              aria-label={t('languageSwitch')}
            >
              {locale === 'es' ? 'PT' : 'ES'}
            </button>

            {/* Login/Logout */}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                {t('logout')}
              </button>
            ) : (
              <Link
                href={`/${locale}/auth/login`}
                className="px-4 py-2 text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              >
                {t('login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}