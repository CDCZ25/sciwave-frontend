'use client';

import { useTranslations } from 'next-intl';

interface HeroProps {
  onExplore: () => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const t = useTranslations('home');

  return (
    <div
      className="relative overflow-hidden text-white mb-10 shadow-xl"
      style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Trifid_Nebula_by_Deddy_Dayag.jpg/960px-Trifid_Nebula_by_Deddy_Dayag.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-slate-950/60" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />

      <div className="relative px-8 py-16 sm:px-16 sm:py-20 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border border-white/20">
          ✦ SciWave
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
          {t('heroTitle')}
        </h1>
        <p className="text-lg text-cyan-100 leading-relaxed mb-8 max-w-xl">
          {t('heroSubtitle')}
        </p>
        <button
          onClick={onExplore}
          className="inline-flex items-center gap-2 px-7 py-3 bg-linear-to-r from-teal-600 via-cyan-600 to-teal-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 border border-cyan-600/10"
        >
          {t('heroCta')}
        </button>
      </div>
    </div>
  );
}
