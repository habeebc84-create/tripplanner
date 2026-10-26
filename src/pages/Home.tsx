import { ArrowRight, CalendarDays, MapPin, Moon, Sparkles, Star, Sun, Wallet } from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { LANG_META, tr, type Lang } from '../lib/i18n';
import Logo from '../components/Logo';

interface HomePageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onEnter: () => void;
  onAbout: () => void;
}

export default function HomePage({ lang, onLangChange, theme, onThemeToggle, onEnter, onAbout }: HomePageProps) {
  const t = (key: string) => tr(lang, key);
  const topPicks = [...DESTINATIONS].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="flex items-center gap-2">
          <Logo size={36} />
          <span className="text-lg font-bold tracking-tight">
            Karnataka Yatra <span className="text-orange-600">AI</span>
          </span>
        </span>
        <span className="flex items-center gap-2">
          <button
            onClick={onAbout}
            className="hidden rounded-full px-3 py-1.5 text-sm font-semibold text-stone-600 hover:text-orange-600 sm:block dark:text-stone-300"
          >
            {t('navAbout')}
          </button>
          <span className="flex rounded-full bg-stone-100 p-1 dark:bg-stone-800">
            {(Object.keys(LANG_META) as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => onLangChange(l)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  lang === l ? 'bg-stone-900 text-white dark:bg-orange-600' : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                {LANG_META[l].native}
              </button>
            ))}
          </span>
          <button
            onClick={onThemeToggle}
            aria-label="Toggle dark mode"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-700 hover:border-orange-400 dark:border-stone-700 dark:text-stone-200"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </span>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-orange-400/30 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute top-20 right-0 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl animate-float-slow" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-10 pb-12 text-center sm:pt-14">
          <span className="animate-fade-up"><Logo size={88} /></span>
          <p className="animate-fade-up mt-5 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold tracking-wide text-orange-700 uppercase dark:bg-orange-900/40 dark:text-orange-300">
            <Sparkles size={14} /> {t('heroBadge')}
          </p>
          <h1 className="animate-fade-up mt-4 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">
            {t('heroTitleA')}{' '}
            <span className="bg-gradient-to-r from-orange-600 via-rose-500 to-violet-600 bg-clip-text text-transparent">
              {t('heroTitleB')}
            </span>
          </h1>
          <p className="animate-fade-up-delay mt-4 max-w-2xl text-lg text-stone-600 dark:text-stone-400">
            {t('heroSub')}
          </p>
          <button
            onClick={onEnter}
            className="animate-fade-up-delay mt-8 flex items-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-600/30 transition hover:scale-105 hover:bg-orange-700"
          >
            {t('enterWebsite')} <ArrowRight size={20} />
          </button>
          <div className="animate-fade-up-delay mt-8 flex flex-wrap justify-center gap-6 text-sm text-stone-600 dark:text-stone-400">
            <span className="flex items-center gap-2">
              <MapPin size={16} className="text-orange-600" /> {DESTINATIONS.length} {t('statDest')}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays size={16} className="text-orange-600" /> 1–7 {t('statDays')}
            </span>
            <span className="flex items-center gap-2">
              <Wallet size={16} className="text-orange-600" /> {t('statBudget')}
            </span>
          </div>
        </div>
      </section>

      {/* Top picks */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-bold">{t('topPicks')}</h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('exploreSub')}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((d) => (
            <button
              key={d.id}
              onClick={onEnter}
              className="overflow-hidden rounded-3xl border border-stone-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
            >
              <div className={`bg-gradient-to-br ${d.gradient} px-5 py-6 text-white`}>
                <p className="text-xs font-bold tracking-wide uppercase opacity-80">{d.region}</p>
                <h3 className="mt-1 text-2xl font-extrabold">{d.name}</h3>
                <p className="mt-1 text-sm opacity-90">{d.tagline}</p>
              </div>
              <div className="flex items-center justify-between px-5 py-3 text-sm text-stone-600 dark:text-stone-400">
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="text-amber-500" /> {d.rating.toFixed(1)}
                </span>
                <span className="font-semibold text-orange-600">{t('enterWebsite')} →</span>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3.5 font-bold text-white transition hover:scale-105 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
          >
            {t('planTrip')} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500 transition-colors duration-300 dark:border-stone-800 dark:text-stone-400">
        Karnataka Yatra AI — {t('footer')}
      </footer>
    </div>
  );
}
