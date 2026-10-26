import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Car,
  Clock,
  Compass,
  Copy,
  Download,
  FileDown,
  Gauge,
  Heart,
  House,
  Landmark,
  Languages,
  LayoutDashboard,
  MapPin,
  Moon,
  Mountain,
  Music,
  Route,
  Search,
  Sparkles,
  Star,
  Sun,
  Users,
  UtensilsCrossed,
  Wallet,
  Waves,
  Shuffle,
  Check,
  Pin,
} from 'lucide-react';
import {
  DESTINATIONS,
  GROUP_SIZE,
  type BudgetTier,
  type Destination,
  type Group,
  type Interest,
  type Pace,
} from './data/destinations';
import { formatINR, generateItinerary } from './lib/planner';
import { mapsDirectionsUrl } from './lib/maps';
import Logo from './components/Logo';
import PlaceDetail from './components/PlaceDetail';
import BengaluruSection from './components/BengaluruSection';
import HomePage from './pages/Home';
import {
  BUDGET_LABELS_I18N,
  GROUP_LABELS_I18N,
  INTEREST_LABELS_I18N,
  LANG_META,
  PACE_LABELS_I18N,
  tr,
  type Lang,
} from './lib/i18n';

const INTEREST_ICONS: Record<Interest, typeof Landmark> = {
  heritage: Landmark,
  nature: Mountain,
  beaches: Waves,
  adventure: Compass,
  wildlife: Sun,
  food: UtensilsCrossed,
  spiritual: Star,
  city: Music,
};

type Theme = 'light' | 'dark';
type Tab = 'overview' | 'budget' | 'days';

function stored<T extends string>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return (v as T) || fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => stored<Lang>('yatra-lang', 'en'));
  const [theme, setTheme] = useState<Theme>(() => stored<Theme>('yatra-theme', 'light'));
  const [interests, setInterests] = useState<Interest[]>(['heritage', 'nature']);
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState<BudgetTier>('moderate');
  const [pace, setPace] = useState<Pace>('balanced');
  const [group, setGroup] = useState<Group>('couple');
  const [seed, setSeed] = useState(1);
  const [startCity, setStartCity] = useState('Bengaluru');
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<Interest | 'all'>('all');
  const [tab, setTab] = useState<Tab>('overview');
  const [selectedPlace, setSelectedPlace] = useState<Destination | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'rating' | 'cost' | 'distance'>('rating');
  const [favsOnly, setFavsOnly] = useState(false);
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem('yatra-favs') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [view, setView] = useState<'home' | 'app'>('home');

  const t = (key: string) => tr(lang, key);
  const interestLabel = INTEREST_LABELS_I18N[lang];
  const budgetLabel = BUDGET_LABELS_I18N[lang];
  const paceLabel = PACE_LABELS_I18N[lang];
  const groupLabel = GROUP_LABELS_I18N[lang];

  useEffect(() => {
    try {
      window.localStorage.setItem('yatra-lang', lang);
    } catch {
      /* private mode */
    }
  }, [lang]);

  useEffect(() => {
    try {
      window.localStorage.setItem('yatra-theme', theme);
    } catch {
      /* private mode */
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem('yatra-favs', JSON.stringify(favourites));
    } catch {
      /* private mode */
    }
  }, [favourites]);

  const toggleFavourite = (id: string) =>
    setFavourites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const planAround = (place: Destination) => {
    setPinnedId(place.id);
    setInterests(place.tags);
    setDays(Math.max(2, place.days));
    setGenerated(true);
    setTab('overview');
    setSelectedPlace(null);
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' });
  };

  const itinerary = useMemo(
    () =>
      generateItinerary({
        interests,
        days,
        budget,
        pace,
        group,
        seed,
        startCity,
        pinned: pinnedId ? DESTINATIONS.find((d) => d.id === pinnedId) : undefined,
      }),
    [interests, days, budget, pace, group, seed, startCity, pinnedId],
  );

  const toggleInterest = (tag: Interest) =>
    setInterests((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
    );

  const planText = useMemo(() => {
    const lines = [
      `Karnataka trip — ${days} days, ${budget}, ${pace} pace`,
      `Stops: ${itinerary.stops.map((s) => `${s.destination.name} (${s.days}d)`).join(' → ')}`,
      `Estimated total: ${formatINR(itinerary.cost.total)} for ${GROUP_SIZE[group]} traveller(s)`,
      '',
      ...itinerary.dayPlans.map(
        (d) =>
          `Day ${d.day} — ${d.destination.name}: Morning: ${d.morning}; Afternoon: ${d.afternoon}; Evening: ${d.evening}.`,
      ),
    ];
    return lines.join('\n');
  }, [itinerary, days, budget, pace, group]);

  const copyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const downloadPlan = () => {
    const blob = new Blob([planText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'karnataka-trip-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredDestinations = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = DESTINATIONS.filter((d) => {
      if (filter !== 'all' && !d.tags.includes(filter)) return false;
      if (favsOnly && !favourites.includes(d.id)) return false;
      if (
        q &&
        !`${d.name} ${d.tagline} ${d.region}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'cost') return a.costPerDay.moderate - b.costPerDay.moderate;
      if (sort === 'distance') return a.distanceFromBengaluruKm - b.distanceFromBengaluruKm;
      return b.rating - a.rating;
    });
    return list;
  }, [filter, favsOnly, favourites, search, sort]);

  const budgetParts = [
    { label: t('stay'), value: itinerary.cost.stay, color: '#ea580c' },
    { label: t('food'), value: itinerary.cost.food, color: '#f59e0b' },
    { label: t('transport'), value: itinerary.cost.transport, color: '#0284c7' },
    { label: t('activities'), value: itinerary.cost.activities, color: '#7c3aed' },
  ];
  const donut = (() => {
    let acc = 0;
    const stops = budgetParts.map((p) => {
      const pct = itinerary.cost.total > 0 ? (p.value / itinerary.cost.total) * 100 : 0;
      const seg = `${p.color} ${acc}% ${acc + pct}%`;
      acc += pct;
      return seg;
    });
    return `conic-gradient(${stops.join(', ')})`;
  })();


  if (view === 'home') {
    return (
      <HomePage
        lang={lang}
        onLangChange={setLang}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onEnter={() => setView('app')}
        onAbout={() => {
          setView('app');
          setTimeout(
            () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }),
            150,
          );
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-[#faf7f2]/90 backdrop-blur transition-colors duration-300 dark:border-stone-800 dark:bg-stone-950/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <button onClick={() => setView('home')} className="flex items-center gap-2">
            <Logo size={36} />
            <span className="text-lg font-bold tracking-tight">
              Karnataka Yatra <span className="text-orange-600">AI</span>
            </span>
          </button>
          <nav className="hidden gap-6 text-sm font-medium text-stone-600 dark:text-stone-400 md:flex">
            <button onClick={() => setView('home')} className="flex items-center gap-1 hover:text-orange-600">
              <House size={15} /> {t('homeNav')}
            </button>
            <a href="#planner" className="hover:text-orange-600">{t('navPlanner')}</a>
            <a href="#destinations" className="hover:text-orange-600">{t('navDestinations')}</a>
            <a href="#bengaluru" className="hover:text-orange-600">{t('navBengaluru')}</a>
            <a href="#how" className="hover:text-orange-600">{t('navHow')}</a>
            <a href="#about" className="hover:text-orange-600">{t('navAbout')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-stone-100 p-1 dark:bg-stone-800">
              {(Object.keys(LANG_META) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    lang === l ? 'bg-stone-900 text-white dark:bg-orange-600' : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {LANG_META[l].native}
                </button>
              ))}
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-700 hover:border-orange-400 dark:border-stone-700 dark:text-stone-200"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a
              href="#planner"
              className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500"
            >
              {t('planTrip')}
            </a>
          </div>
        </div>
      </header>

      {/* Planner */}
      <section id="planner" className="animate-fade-up mx-auto max-w-6xl scroll-mt-20 px-4 pt-10 pb-14">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 sm:p-7">
          <h2 className="text-2xl font-bold">{t('plannerTitle')}</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('plannerSub')}</p>

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">{t('loveTitle')}</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(interestLabel) as Interest[]).map((tag) => {
                const Icon = INTEREST_ICONS[tag];
                const active = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 ${
                      active
                        ? 'border-orange-600 bg-orange-600 text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-orange-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'
                    }`}
                  >
                    <Icon size={15} /> {interestLabel[tag]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <CalendarDays size={15} /> {t('tripLength')}: {days} {t('daysUnit')}
              </label>
              <input
                type="range"
                min={2}
                max={7}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-orange-600"
              />
              <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>2 {t('daysUnit')}</span>
                <span>7 {t('daysUnit')}</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">{t('budgetLabel')}</p>
              <div className="flex gap-1 rounded-full bg-stone-100 p-1 dark:bg-stone-800">
                {(Object.keys(budgetLabel) as BudgetTier[]).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setBudget(tier)}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold ${
                      budget === tier ? 'bg-stone-900 text-white dark:bg-orange-600' : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {budgetLabel[tier]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">{t('paceLabel')}</p>
              <div className="flex gap-1 rounded-full bg-stone-100 p-1 dark:bg-stone-800">
                {(Object.keys(paceLabel) as Pace[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPace(p)}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold ${
                      pace === p ? 'bg-stone-900 text-white dark:bg-orange-600' : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {paceLabel[p]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Users size={15} /> {t('travellingAs')}
              </p>
              <div className="flex gap-1 rounded-full bg-stone-100 p-1 dark:bg-stone-800">
                {(Object.keys(groupLabel) as Group[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold ${
                      group === g ? 'bg-stone-900 text-white dark:bg-orange-600' : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {groupLabel[g]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <MapPin size={15} /> {t('startCity')}
              </label>
              <select
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium dark:border-stone-700 dark:bg-stone-900"
              >
                {['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {pinnedId && (
              <span className="flex items-center gap-2 rounded-full bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
                <Pin size={14} /> {t('pinned')}: {DESTINATIONS.find((d) => d.id === pinnedId)?.name}
                <button
                  onClick={() => setPinnedId(null)}
                  className="ml-1 rounded-full bg-orange-600 px-2 py-0.5 text-xs font-bold text-white"
                >
                  {t('clear')}
                </button>
              </span>
            )}
          </div>

          <button
            onClick={() => setGenerated(true)}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-6 py-3.5 text-base font-bold text-white transition hover:scale-[1.01] hover:bg-orange-700 sm:w-auto"
          >
            <Sparkles size={18} /> {t('generate')}
          </button>

          {generated && (
            <div className="animate-fade-up mt-8 border-t border-stone-200 pt-6 dark:border-stone-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold">
                    <LayoutDashboard size={20} className="text-orange-600" /> {t('dashboardTitle')}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                    {t('planTitle')} · {days} {t('daysUnit')} · {t('dashboardSub')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSeed((s) => s + 1)}
                    className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-orange-400 dark:border-stone-700"
                  >
                    <Shuffle size={15} /> {t('regenerate')}
                  </button>
                  <button
                    onClick={copyPlan}
                    className="flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white dark:bg-orange-600"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? t('copied') : t('copyPlan')}
                  </button>
                  <button
                    onClick={downloadPlan}
                    className="flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold hover:border-orange-400 dark:border-stone-700"
                  >
                    <Download size={15} /> {t('downloadPlan')}
                  </button>
                  <button
                    onClick={async () => {
                      const { exportItineraryPdf } = await import('./lib/exportPdf');
                      exportItineraryPdf(itinerary, { days, budget, pace, group, startCity });
                    }}
                    className="flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                  >
                    <FileDown size={15} /> {t('exportPdf')}
                  </button>
                </div>
              </div>

              {/* Dashboard tabs */}
              <div className="mt-5 flex gap-1 rounded-full bg-stone-100 p-1 dark:bg-stone-800 sm:w-fit">
                {(
                  [
                    { id: 'overview', label: t('tabOverview'), icon: LayoutDashboard },
                    { id: 'budget', label: t('tabBudget'), icon: Wallet },
                    { id: 'days', label: t('tabDays'), icon: CalendarDays },
                  ] as const
                ).map((tabItem) => (
                  <button
                    key={tabItem.id}
                    onClick={() => setTab(tabItem.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      tab === tabItem.id
                        ? 'bg-stone-900 text-white dark:bg-orange-600'
                        : 'text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    <tabItem.icon size={15} /> {tabItem.label}
                  </button>
                ))}
              </div>

              {tab === 'overview' && (
                <div className="animate-fade-up mt-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-orange-50 p-4 dark:bg-orange-900/20">
                      <p className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase dark:text-stone-400">
                        <Wallet size={14} /> {t('estTotal')}
                      </p>
                      <p className="mt-1 text-2xl font-extrabold">{formatINR(itinerary.cost.total)}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {t('forTravellers')} · {formatINR(Math.round(itinerary.cost.total / GROUP_SIZE[group]))} {t('perPerson')}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-800">
                      <p className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase dark:text-stone-400">
                        <Gauge size={14} /> {t('matchLabel')}
                      </p>
                      <p className="mt-1 text-2xl font-extrabold">
                        {interests.length === 0 ? t('topRated') : `${itinerary.matchScore}%`}
                      </p>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
                        <div
                          className="animate-grow-bar h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500"
                          style={{ width: `${interests.length === 0 ? 100 : itinerary.matchScore}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{t('matchWith')}</p>
                    </div>
                    <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-800">
                      <p className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase dark:text-stone-400">
                        <Route size={14} /> {t('routeTitle')}
                      </p>
                      <p className="mt-1 text-2xl font-extrabold">{itinerary.stops.length} {t('statDest')}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{t('routeStrip')}</p>
                    </div>
                  </div>

                  {/* Route stepper */}
                  <div className="mt-6 overflow-x-auto pb-2">
                    <div className="flex min-w-max items-start gap-0">
                      {itinerary.stops.map((stop, i) => (
                        <div
                          key={stop.destination.id}
                          onClick={() => setSelectedPlace(stop.destination)}
                          className="flex cursor-pointer items-start"
                          title={t('viewDetails')}
                        >
                          {i > 0 && <div className="mt-5 h-0.5 w-10 bg-orange-300 sm:w-16" />}
                          <div className="flex w-28 flex-col items-center text-center">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                              {stop.days}d
                            </span>
                            <span className="mt-2 text-xs font-bold">{stop.destination.name}</span>
                            <span className="text-[11px] text-stone-500 dark:text-stone-400">{stop.destination.region}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {itinerary.tips.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-amber-50 p-4 dark:bg-amber-900/20">
                      <p className="text-sm font-bold">{t('tipsTitle')}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-600 dark:text-stone-300">
                        {itinerary.tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === 'budget' && (
                <div className="animate-fade-up mt-6 grid items-center gap-6 sm:grid-cols-2">
                  <div className="relative mx-auto h-56 w-56">
                    <div className="h-full w-full rounded-full" style={{ background: donut }} />
                    <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-white text-center dark:bg-stone-900">
                      <span className="text-xs text-stone-500 dark:text-stone-400">{t('estTotal')}</span>
                      <span className="text-xl font-extrabold">{formatINR(itinerary.cost.total)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {budgetParts.map((part) => (
                      <div key={part.label}>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2 font-medium">
                            <span className="h-3 w-3 rounded-full" style={{ background: part.color }} />
                            {part.label}
                          </span>
                          <span className="font-bold">{formatINR(part.value)}</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
                          <div
                            className="animate-grow-bar h-full rounded-full"
                            style={{
                              width: `${itinerary.cost.total > 0 ? (part.value / itinerary.cost.total) * 100 : 0}%`,
                              background: part.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <p className="pt-1 text-xs text-stone-500 dark:text-stone-400">
                      {t('forTravellers')} · {formatINR(Math.round(itinerary.cost.total / GROUP_SIZE[group]))} {t('perPerson')}
                    </p>
                  </div>
                </div>
              )}

              {tab === 'days' && (
                <ol className="animate-fade-up mt-6 space-y-4">
                  {itinerary.dayPlans.map((d) => (
                    <li key={d.day} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                          {d.day}
                        </span>
                        <span className="w-px flex-1 bg-stone-200 dark:bg-stone-700" />
                      </div>
                      <div className="flex-1 rounded-2xl border border-stone-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
                        <p className="font-bold">
                          {t('dayLabel')} {d.day} · {d.destination.name}
                          <span className="ml-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                            {d.destination.region} · {t('bestLabel')} {d.destination.bestTime}
                          </span>
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-stone-600 dark:text-stone-300">
                          {d.travelFrom && (
                            <li className="flex gap-2">
                              <Car size={15} className="mt-0.5 shrink-0 text-orange-600" />
                              <span>
                                <b>
                                  {d.travelKm != null && d.travelKm > 0
                                    ? `${t('travelStart')} ${d.travelFrom} · ${d.travelKm} km`
                                    : d.travelFrom === startCity
                                      ? `${t('travelStart')} ${d.travelFrom}`
                                      : `${t('travelBetween')}: ${d.travelFrom} → ${d.destination.name}`}
                                </b>{' '}
                                <a
                                  href={mapsDirectionsUrl(d.travelFrom, d.destination.name)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-semibold text-orange-600 underline"
                                >
                                  {t('directions')}
                                </a>
                              </span>
                            </li>
                          )}
                          <li className="flex gap-2">
                            <Sun size={15} className="mt-0.5 shrink-0 text-amber-500" />
                            <span><b>{t('morning')}:</b> {d.morning}</span>
                          </li>
                          <li className="flex gap-2">
                            <Clock size={15} className="mt-0.5 shrink-0 text-sky-600" />
                            <span><b>{t('afternoon')}:</b> {d.afternoon}</span>
                          </li>
                          <li className="flex gap-2">
                            <Star size={15} className="mt-0.5 shrink-0 text-violet-600" />
                            <span><b>{t('evening')}:</b> {d.evening}</span>
                          </li>
                          <li className="flex gap-2">
                            <Wallet size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                            <span><b>{t('dayCost')}:</b> {formatINR(d.dayCost)} · {t('stayIn')} {d.destination.name}</span>
                          </li>
                        </ul>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14">
        <h2 className="text-2xl font-bold">{t('exploreTitle')}</h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t('exploreSub')}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 ${
              filter === 'all'
                ? 'border-stone-900 bg-stone-900 text-white dark:bg-orange-600 dark:border-orange-600'
                : 'border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900'
            }`}
          >
            {t('all')}
          </button>
          {(Object.keys(interestLabel) as Interest[]).map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 ${
                filter === tag
                  ? 'border-stone-900 bg-stone-900 text-white dark:bg-orange-600 dark:border-orange-600'
                  : 'border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900'
              }`}
            >
              {interestLabel[tag]}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex min-w-56 flex-1 items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm dark:border-stone-700 dark:bg-stone-900">
            <Search size={15} className="shrink-0 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent outline-none placeholder:text-stone-400"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            {t('sortBy')}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'rating' | 'cost' | 'distance')}
              className="rounded-full border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
            >
              <option value="rating">{t('sortRating')}</option>
              <option value="cost">{t('sortCost')}</option>
              <option value="distance">{t('sortDistance')}</option>
            </select>
          </label>
          <button
            onClick={() => setFavsOnly((v) => !v)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
              favsOnly
                ? 'border-rose-500 bg-rose-500 text-white'
                : 'border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900'
            }`}
          >
            <Heart size={15} fill={favsOnly ? '#fff' : 'none'} /> {t('favourites')} ({favourites.length})
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDestinations.map((d) => (
            <article
              key={d.id}
              onClick={() => setSelectedPlace(d)}
              className="cursor-pointer overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
            >
              <div className={`relative bg-gradient-to-br ${d.gradient} px-5 py-6 text-white`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavourite(d.id);
                  }}
                  aria-label="Favourite"
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-white hover:bg-black/40"
                >
                  <Heart size={16} fill={favourites.includes(d.id) ? '#fff' : 'none'} />
                </button>
                <p className="text-xs font-bold tracking-wide uppercase opacity-80">{d.region}</p>
                <h3 className="mt-1 text-2xl font-extrabold">{d.name}</h3>
                <p className="mt-1 text-sm opacity-90">{d.tagline}</p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5">
                  {d.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-200"
                    >
                      {interestLabel[tag]}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Star size={15} className="text-amber-500" /> {d.rating.toFixed(1)}
                  </span>
                  <span>
                    {d.days} {d.days > 1 ? t('daysUnit') : t('dayUnit')} {t('recommended')}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-stone-600 dark:text-stone-400">
                  <span>{t('bestLabel')}: {d.bestTime}</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {t('fromPerDay')} {formatINR(d.costPerDay.moderate)}{t('perDay')}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlace(d);
                  }}
                  className="mt-4 w-full rounded-full bg-orange-600 py-2 text-sm font-bold text-white hover:bg-orange-700"
                >
                  {t('viewDetails')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bengaluru deep dive */}
      <BengaluruSection
        lang={lang}
        onPlanBengaluruDay={() => {
          const bengaluru = DESTINATIONS.find((d) => d.id === 'bengaluru');
          if (bengaluru) planAround(bengaluru);
        }}
      />

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <h2 className="text-2xl font-bold">{t('howTitle')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { title: t('step1Title'), text: t('step1Text') },
            { title: t('step2Title'), text: t('step2Text') },
            { title: t('step3Title'), text: t('step3Text') },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-stone-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
            >
              <h3 className="font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-stone-400">{t('disclaimer')}</p>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16">
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition duration-300 dark:border-stone-800 dark:bg-stone-900 sm:p-8">
          <h2 className="text-2xl font-bold">{t('aboutTitle')}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-stone-600 dark:text-stone-300">
            {t('aboutText')}
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <MapPin size={16} className="text-orange-600" /> {DESTINATIONS.length} {t('statDest')}
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <Route size={16} className="text-orange-600" /> {new Set(DESTINATIONS.map((d) => d.region)).size} {t('regions')}
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <Languages size={16} className="text-orange-600" /> 3 {t('languages')}
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <Check size={16} className="text-orange-600" /> {t('noSignup')}
            </span>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500 transition-colors duration-300 dark:border-stone-800 dark:text-stone-400">
        Karnataka Yatra AI — {t('footer')}
      </footer>

      {selectedPlace && (
        <PlaceDetail
          place={selectedPlace}
          lang={lang}
          budget={budget}
          isFavourite={favourites.includes(selectedPlace.id)}
          onToggleFavourite={toggleFavourite}
          onClose={() => setSelectedPlace(null)}
          onPlanAround={planAround}
        />
      )}
    </div>
  );
}
