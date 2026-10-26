import { ArrowRight, CalendarDays, MapPin, Moon, Sparkles, Star, Sun, Wallet } from 'lucide-react';
import { DESTINATIONS, type Destination } from '../data/destinations';
import { LANG_META, tr, type Lang } from '../lib/i18n';
import Logo from '../components/Logo';

interface HomePageProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onEnter: () => void;
  onAbout: () => void;
  onPickPlace: (place: Destination) => void;
}

export default function HomePage({ lang, onLangChange, theme, onThemeToggle, onEnter, onAbout, onPickPlace }: HomePageProps) {
  const t = (key: string) => tr(lang, key);
  const topPicks = [...DESTINATIONS].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
      {/* Top bar — floating round dock */}
      <header className="sticky top-3 z-30 px-3 pt-3 sm:px-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-stone-200 bg-[#faf7f2]/90 px-4 py-2 shadow-lg backdrop-blur transition-colors duration-300 dark:border-stone-800 dark:bg-stone-950/90">
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
        </div>
      </header>

      {/* Hero — full-width Palace photo with clear text over it */}
      <section className="relative bg-stone-900">
        <img
          src="https://pub-0f3ca40c378b41b2b74bb464f98f62e2.r2.dev/locations/bangalore-palace/1787808805751-27811341995_6e10abef04_k.jpg"
          alt="Bangalore Palace"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col items-center justify-center px-4 py-20 text-center">
          <span className="animate-fade-up"><Logo size={88} /></span>
          <p className="animate-fade-up mt-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-wide text-orange-700 uppercase">
            <Sparkles size={14} /> {t('heroBadge')}
          </p>
          <h1 className="animate-fade-up mt-4 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl">
            {t('heroTitleA')}{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-violet-300 bg-clip-text text-transparent">
              {t('heroTitleB')}
            </span>
          </h1>
          <p className="animate-fade-up-delay mt-4 max-w-2xl text-lg text-white/90">
            {t('heroSub')}
          </p>
          <button
            onClick={onEnter}
            className="animate-fade-up-delay mt-8 flex items-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-600/30 transition hover:scale-105 hover:bg-orange-700"
          >
            {t('enterWebsite')} <ArrowRight size={20} />
          </button>
        </div>
        <p className="absolute inset-x-0 bottom-4 z-10 text-center text-xs font-semibold text-white/70">
          {t('palaceCaption')}
        </p>
      </section>

      {/* Stats strip on the plain page background, so it stays readable */}
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 px-4 py-6 text-sm text-stone-600 dark:text-stone-400">
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

      {/* Top picks */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-bold">{t('topPicks')}</h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('exploreSub')}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((d) => (
            <button
              key={d.id}
              onClick={() => onPickPlace(d)}
              className="overflow-hidden rounded-3xl border border-stone-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
            >
              {d.image ? (
                <>
                  <img
                    src={d.image}
                    alt={d.name}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="px-5 py-4">
                    <p className="text-xs font-bold tracking-wide text-orange-600 uppercase">{d.region}</p>
                    <h3 className="mt-1 text-xl font-extrabold">{d.name}</h3>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{d.tagline}</p>
                  </div>
                </>
              ) : (
                <div className={`bg-gradient-to-br ${d.gradient} px-5 py-6 text-white`}>
                  <p className="text-xs font-bold tracking-wide uppercase opacity-80">{d.region}</p>
                  <h3 className="mt-1 text-2xl font-extrabold">{d.name}</h3>
                  <p className="mt-1 text-sm opacity-90">{d.tagline}</p>
                </div>
              )}
              <div className="flex items-center justify-between px-5 pb-4 text-sm text-stone-600 dark:text-stone-400">
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="text-amber-500" /> {d.rating.toFixed(1)}
                </span>
                <span className="font-semibold text-orange-600">{t('viewDetails')} →</span>
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
